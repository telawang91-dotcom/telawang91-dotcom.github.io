---
layout: post
title: "Badcase 闭环：怎么把一次 Agent 失败变成下一版系统的能力？"
subtitle: "Badcase 不是一条错误日志，而是连接知识、规划、工具、执行与评测的数据资产。"
date: 2026-09-15 18:36:00 +0800
series: "Agent Evaluation 与 Reliability"
series_key: evaluation-reliability
series_index: "06"
category: Tech
tags: [Agent, Badcase, Evaluation, Tracing]
---

Agent 系统一定会失败，真正拉开工程差距的不是“有没有 Badcase”，而是**Badcase 能不能被稳定地定位、修复和回归**。

## 第一步：先分层，不要一上来改 Prompt

一个任务失败，至少可能来自五层：知识覆盖、检索、规划、工具调用、执行环境。

```text
Task Failure
├── Knowledge
├── Retrieval
├── Planning
├── Tool Call
└── Execution
```

如果知识库里根本没有答案，再怎么改 Planner Prompt 都没有用；如果 Tool Schema 错了，也不应该怪模型推理能力。

## 第二步：用 Trace 找首个错误点

不要只看最终输出。应该沿着事件流找“第一个偏离预期的节点”，因为后面的错误通常只是连锁反应。

例如最终任务失败，但根因可能只是 RAG 在第二步召回了错误 Few-shot，随后 Planner、Executor 都只是基于错误上下文继续执行。

## 第三步：把修复映射到对应层

知识问题 → 补知识或数据；检索问题 → 优化召回、过滤、Rerank；规划问题 → 调整 Planner、Few-shot 或结构化约束；工具问题 → 修 Tool Schema / Runtime；执行问题 → 加 Retry、超时或环境修复。

## 第四步：修复后必须进入 Benchmark

如果一个 Badcase 修完后没有加入回归集，它很可能几周后再次出现。

因此一个完整闭环应该是：

```text
Online Failure
   ↓
Trace & Classification
   ↓
Fix
   ↓
Regression Case
   ↓
Benchmark
   ↓
Release
```

## 第五步：高价值 Badcase 要沉淀成数据

规划类 Badcase 可以沉淀为 Few-shot；工具类 Badcase 可以转成 schema 规则或单测；安全类 Badcase 应该升级成 Guardrail。

也就是说，错误不只是“被修掉”，还应该转化成系统资产。

## 面试回答重点

我会先用 Trace 找首个错误点，再按知识、检索、规划、工具、执行分层定位，修复以后把案例加入 Benchmark 做回归。这样 Badcase 才能形成闭环，而不是靠人工一次次救火。
