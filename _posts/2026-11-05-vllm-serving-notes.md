---
layout: post
title: "vLLM 学习笔记：长 Prompt 进来时，GPU 怎么分时间和显存？"
subtitle: "从一条 Coding Agent 请求出发，理解 KV Cache、PagedAttention、连续批处理和延迟指标。"
date: 2026-11-05 15:00:00 +0800
continue_reading: "/2026/09/11/agent-tracing/"
category: Tech
tags: [vLLM, AI-Infra, LLM-Serving, KV-Cache, Agent]
---

一个 Coding Agent 正在流式生成补丁。这时，另一条请求带着几千个 token 的仓库上下文到达。服务既要让正在生成的请求继续输出，也要尽快给新请求首个 token。读阿甘的 vLLM 系列时，我觉得最值得记下的是把这场竞争拆成两个问题：**这一轮还有多少 token 的调度预算？推进这些请求需要的 KV Cache 块能不能分出来？** [阿甘的博客 · Scheduler：GPU 这一轮到底给谁用？](https://arganzheng.life/scheduler-batch-and-fairness.html)

## 一条请求的两个阶段

| 阶段 | 模型在做什么 | 用户感知 |
| --- | --- | --- |
| Prefill | 处理输入 token，建立各层的 KV Cache，并得到用于生成首个输出 token 的 logits | 排队和输入处理都会影响首 token 延迟（TTFT） |
| Decode | 利用已有 KV Cache，逐步生成后续 token，并将新 token 对应的 K、V 加入缓存 | 相邻输出 token 的间隔（ITL）影响流式输出是否连贯 |

KV Cache 保存的是历史 token 对应的注意力键和值。它让解码时可以复用这些结果，但缓存会随上下文长度和并发请求增加。以一个假设的标准 Transformer 为例，32 层、8 个 KV 头、每头维度 128，K 和 V 都用 BF16。忽略分片、块对齐和其他开销，每个 token 的 KV 约占 **128 KiB**，一条 8,192 token 的序列约占 **1 GiB**。这个估算只算 KV，不含模型权重和运行时开销。

```text
每 token 的 KV 字节数 ≈ 2 × 层数 × KV 头数 × 头维度 × 每元素字节数
```

## PagedAttention 管显存，连续批处理管每轮推进

**PagedAttention** 把一条序列的 KV Cache 映射到若干物理块。这些块在显存里可以不连续，序列变长时再按需分配。原始论文用这种设计减少了为未知输出长度预留连续空间造成的浪费，使更多请求有机会同时进入批次。[PagedAttention 原始论文](https://arxiv.org/abs/2309.06180)

**Continuous Batching（连续批处理）** 让批次成员随迭代变化。短请求完成后，引擎可以继续调度其他请求，具体还要看 token 预算和 KV 块是否够用。**Chunked Prefill（分块预填充）** 则把长输入分成多轮处理，让它有机会与正在生成的请求共享同一轮计算。长输入分多少轮、每轮给多少预算，会影响首 token 延迟和输出间隔，适合用自己的长短请求分布验证。[vLLM 优化与调参文档](https://docs.vllm.ai/en/latest/configuration/optimization/) · [阿甘的博客 · vLLM 系列总结](https://arganzheng.life/deep-dive-into-vllm-series-recap-and-self-test.html)

这里还有一个容易混淆的机制。**Prefix Caching（前缀缓存）** 复用多个请求共享的输入前缀所对应的 KV，节省这段输入的 Prefill。比如多轮 Coding Agent 请求都带着同一段系统说明，命中时可以跳过该段的重复计算。后续新生成的 token 仍要解码。[vLLM 自动前缀缓存文档](https://docs.vllm.ai/en/latest/features/automatic_prefix_caching/)

## 怎样判断慢在哪

下面是一个压测设计示例。固定模型、硬件、vLLM 版本和输出长度分布，用相同请求集比较两组设置，每次只改变一个因素。

| 对照 | 优先观察 | 能回答的问题 |
| --- | --- | --- |
| 纯短请求与混入长 Prompt 的请求 | 分组的 p95 TTFT、p95 ITL 和排队时间 | 长输入到达后，变慢的是首 token、流式输出，还是两者 |
| 同长度的重复前缀与不同前缀 | 前缀命中和 TTFT | 重复输入有没有真正复用 KV |
| 并发逐级增加 | 输出 token 吞吐、KV 使用率、抢占次数和 p95 延迟 | 吞吐提高了多少，尾部延迟是否还在目标范围内 |

在 Agent 侧，我还会把模型请求和工具调用分别计时。如果任务卡在检索或脚本执行，单独调整 vLLM 的批处理预算无法解释整条任务为什么慢。先用 Trace 划清时间花在哪一层，再决定该调引擎还是工作流。[vLLM 生产指标文档](https://docs.vllm.ai/en/latest/usage/metrics/) · [Agent Tracing 笔记](/2026/09/11/agent-tracing/)
