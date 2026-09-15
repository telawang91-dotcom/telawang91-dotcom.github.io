---
layout: post
title: "总纲：AI Agent 到底在解决什么问题？"
subtitle: "Agent 的核心不是让模型更会聊天，而是让模型进入状态、工具和环境组成的执行闭环。"
date: 2026-09-15 18:00:00 +0800
series: "AI Agent 基础"
series_key: agent-foundations
series_index: "00"
category: Tech
homepage: false
tags: [Agent, Tool-Use, Planning, Memory]
---

如果只把 Agent 理解成“LLM + Function Calling”，很多工程问题会显得零散：为什么需要 Memory？为什么还要 Planning？MCP 和 Function Calling 为什么不是二选一？为什么高风险 Tool 需要人工确认？

更统一的理解是：**Agent 是一个围绕目标持续观察、决策、执行和更新状态的系统。**

## 从一次生成到一个闭环

普通 LLM 调用更像一次函数：

```text
Prompt → Model → Response
```

Agent 则多了一层持续运行的循环：

```text
Goal
  ↓
Observe → Reason / Plan → Act → Observe
  ↑                         ↓
  └────── State / Memory ───┘
```

模型只负责其中一部分认知决策。状态保存、工具执行、权限、超时、重试和验证仍然需要系统负责。

## Agent 的五个基本组件

### 1. Model：理解与决策

模型负责理解自然语言目标、识别意图、生成计划、选择工具以及根据执行结果调整下一步。

它擅长处理不确定性，但不应该被当成数据库、事务系统或权限系统。

### 2. State：当前任务到底进行到哪里

状态描述“现在发生了什么”：目标、当前步骤、已完成动作、已有产物、错误、预算和剩余任务。

没有显式 State，长任务很容易退化成“模型从聊天记录里猜现在做到哪一步”。

### 3. Tool：让决策影响真实环境

Tool 把模型输出接到搜索、文件、数据库、浏览器、代码执行、设备控制等真实能力上。

因此 Tool 也是风险边界：读操作和写操作、低风险和高风险操作，不能拥有相同权限。

### 4. Memory / Context：给模型正确的信息

Context 是当前这一步真正需要看到的信息；Memory 是跨步骤或跨任务保存并按需召回的信息。

工程目标不是“把信息都塞进去”，而是让正确的信息在正确时间到达正确 Agent。

### 5. Runtime / Guardrail：保证系统可控

真正生产化的 Agent 还需要 Workflow、状态机、重试、人工确认、Checkpoint、Tracing 和 Evaluation。

这些能力不一定属于模型，却决定系统能不能稳定运行。

## 为什么 Function Calling 只是开始

Function Calling 解决的是：模型如何表达“我要调用某个工具”。

但一个完整系统还必须解决：

- 工具有几十甚至几百个时如何选择；
- 参数是否合法；
- Tool 超时后怎么办；
- 哪些用户能调用哪些 Tool；
- 高风险 Tool 是否需要审批；
- 执行结果是否满足任务目标。

所以 Tool Use 只是 Agent Runtime 的一个入口。

## Planning 的真正价值

短任务可以边观察边行动；长任务需要先建立结构。

Planning 的价值不是生成一份漂亮的步骤列表，而是把大目标拆成**可执行、可检查、可恢复**的小任务。

因此后续会看到 ReAct、Plan-and-Execute、结构化 Plan，以及 Planner + Executor 的边界。

## Memory 也不是聊天记录

直接保存全部历史会带来上下文膨胀、错误信息长期污染和权限泄露。

更合理的做法是区分：

- 当前任务状态；
- 可复用事实；
- 历史成功轨迹；
- 用户长期偏好；
- 项目级知识。

然后在召回时重新判断相关性、时效性和权限。

## 安全为什么必须放在系统层

Agent 最大的变化，是模型输出开始产生真实副作用。

因此安全策略必须覆盖 Tool Schema、权限、参数校验、执行前审批和执行后验证，而不能只写一句“请谨慎操作”的 Prompt。

## 这一系列怎么读

推荐顺序是：

```text
从 LLM 到 Agent
    ↓
Function Calling
    ↓
MCP
    ↓
Tool Schema / Router
    ↓
Memory
    ↓
Planning
    ↓
Permission / HITL
```

读完以后，应该能把一个 Agent 拆成模型层、状态层、工具层、上下文层和 Runtime 层，而不是只记住几个框架名。

## 一句话总结

> Agent Engineering 的本质，是把模型的概率性决策嵌入一个可观察、可执行、可验证、可恢复的确定性工程系统中。
