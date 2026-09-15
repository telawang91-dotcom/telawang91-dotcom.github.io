---
layout: post
title: "Few-shot Retrieval：怎么让历史轨迹真正帮助 Agent Planning？"
subtitle: "Few-shot 不是把旧案例硬塞进 Prompt，而是检索与当前约束真正匹配的可复用经验。"
date: 2026-09-15 18:32:00 +0800
series: "RAG 与 Context Engineering"
series_key: rag-context
series_index: "06"
category: Tech
tags: [RAG, Few-shot, Planning, Retrieval]
---

在 Agent Planning 里，历史成功轨迹非常有价值，因为它们不仅包含知识，还包含“这个任务在什么条件下，用了哪些工具，按什么顺序完成”。

但如果 Few-shot 只是随机挑几个相似案例放进 Prompt，很容易误导 Planner。

## 一个轨迹样本应该包含什么

相比普通 QA，Planning Few-shot 最好结构化保存：任务描述、环境约束、工具集合、计划步骤、关键中间产物、最终结果以及失败原因。

```text
Task + Context + Tool Set
        ↓
Plan / Trace
        ↓
Result + Failure Reason
```

## 检索不能只看语义相似度

两个任务文本很像，不代表可复用同一条路径。还要匹配环境、设备状态、权限、工具版本和前置条件。

因此更稳的流程是：语义召回候选 → 元数据过滤 → 条件一致性检查 → Rerank。

## 成功样本和失败样本都值得保留

成功轨迹可以告诉 Planner“什么路径可能可行”，失败轨迹则能告诉它“什么路径应该避免”。这类负样本在高风险 Agent 场景里尤其重要。

## 高置信复用，低置信只参考

不要把所有召回结果都当模板。高置信且前提一致时，可以强 Few-shot；相似但条件不完全一致时，只作为参考；低置信时直接回到通用规划策略。

## 数据闭环才是核心价值

真正有价值的是：线上 Badcase → 人工修正 → 形成高质量轨迹 → 进入知识库 → 后续类似任务直接受益。

这让系统可以通过数据迭代提升，而不一定每次都依赖模型微调。

## 面试回答的核心

Planning Few-shot 的关键不是“找相似问题”，而是“找可复用轨迹”。检索时除了语义相似度，还要约束任务条件、工具可用性和执行结果，避免错误样本把 Planner 带偏。
