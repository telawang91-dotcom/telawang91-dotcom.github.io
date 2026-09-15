---
layout: post
title: "Planning：ReAct、Plan-and-Execute 与结构化计划怎么选？"
subtitle: "Planning 的关键不是让模型想得更久，而是把任务拆解变成可执行、可检查的中间表示。"
date: 2026-09-15 18:30:00 +0800
series: "AI Agent 基础"
series_key: agent-foundations
series_index: "06"
category: Tech
tags: [Agent, Planning, ReAct, Planner-Executor]
---

Agent 和普通聊天模型最大的差别之一，是它不只要回答问题，还要决定**下一步做什么**。当任务包含多个工具、多步依赖和失败恢复时，Planning 就从“提示词技巧”变成了运行时设计问题。

## ReAct：边想边做

ReAct 可以理解为一个循环：观察当前状态，做一次推理，选择一个动作，再根据工具结果继续。

```text
Observe → Think → Act → Observe → ...
```

它的优点是灵活，适合开放环境和短任务；缺点也很明显：长任务容易漂移、重复调用工具，也不容易在执行前验证整条路径。

## Plan-and-Execute：先规划，再执行

另一种方式是先生成计划，再让 Executor 逐步执行。

```text
Task
  ↓
Planner
  ↓
Step 1 / Step 2 / Step 3
  ↓
Executor
```

这种结构更容易做预算控制、进度显示、失败重试和离线评测。问题在于：如果计划一开始就错了，Executor 会非常稳定地执行错误计划，因此还需要 Replan 机制。

## 结构化计划比自然语言计划更重要

工程上更实用的做法，是把计划表示为结构化 IR，而不是一段 prose。

```json
{
  "steps": [
    {"id": 1, "tool": "search", "args": {"q": "..."}},
    {"id": 2, "tool": "analyze", "depends_on": [1]},
    {"id": 3, "tool": "write", "depends_on": [2]}
  ]
}
```

一旦计划结构化，系统就能检查 schema、依赖、工具权限、预算和终止条件。

## 一个实用的选择方式

短任务、环境变化快：可以偏 ReAct。

长任务、工具链复杂：更适合 Plan-and-Execute。

高可靠任务：使用“结构化 Planner + 确定性 Executor + Validator + Replan”。

## 为什么 Planner 和 Executor 要分开

Planner 负责不确定的语义判断；Executor 负责确定性的工具调度。如果让同一个 LLM 同时承担规划、执行、状态推进和异常处理，系统会越来越难观测。

更稳的边界是：**LLM 负责想，Runtime 负责跑。**

## 面试时最值得讲的一句话

Planning 的工程价值不是生成更多步骤，而是把隐式思考转成系统可读取的中间表示，从而支持验证、执行、追踪和失败恢复。
