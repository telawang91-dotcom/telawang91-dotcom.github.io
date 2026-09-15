---
layout: post
title: "总纲：为什么 Agent 需要 Runtime"
subtitle: "模型负责做判断，Runtime 负责让状态、权限、失败和恢复变得可控。"
date: 2026-09-15 18:06:00 +0800
series: "Workflow 与 Multi-Agent"
series_key: workflow-multi-agent
series_index: "00"
category: Tech
homepage: false
tags: [Workflow, Multi-Agent, LangGraph, Runtime]
---

Agent Demo 很容易做成“模型决定下一步，然后继续调用模型”。真正困难的是任务变长以后：状态放哪、失败怎么办、谁能调用什么、什么时候必须停、怎么恢复。

这些问题共同指向一个东西：**Agent Runtime**。

## Runtime 是模型和真实执行之间的系统层

可以把复杂 Agent 粗略拆成：

```text
User Goal
   ↓
LLM / Planner
   ↓
Agent Runtime
   ↓
Tools / Workers / Environment
```

Runtime 不负责替模型理解语义，而是把模型的概率性决策约束在可执行边界中。

## 为什么不能只靠自由流转

完全开放的自由流转会出现几个典型问题：

- 重复调用同一 Tool；
- Agent 相互来回委派；
- 失败后不知道 Retry 还是 Replan；
- 状态只存在对话里；
- 高风险动作没有审批点；
- 任务无法从中断处恢复。

这些问题不是换一个更强模型就自然消失的。

## State Machine 解决“当前在哪”

状态机把业务阶段显式化：

```text
Planning → Reviewing → Executing → Validating → Done
                       ↓
                    Failed
```

每个状态有允许的输入、动作和下一跳，因此系统能判断“当前发生了什么”，而不是让模型自己回忆。

## LangGraph 的价值在于 Graph Runtime

LangGraph 适合复杂 Agent，并不只是因为它能画流程图，而是因为 State、Node、Edge、Conditional Routing 和 Checkpoint 都是核心抽象。

这让分支、循环、Retry、人工节点和恢复变成显式工程结构。

## Multi-Agent 的重点不是 Agent 数量

多个 Agent 的价值来自**职责隔离**：

- Planner 负责计划；
- Worker 负责执行特定任务；
- Validator 负责检查；
- Manager / Supervisor 负责路由与收敛。

如果所有 Agent 都能看到所有上下文、调用所有工具、自由互相委派，多 Agent 反而会增加不可控性。

## Artifact 为什么重要

复杂任务不应该只靠聊天消息交接。

更稳定的方式是把阶段结果变成 Artifact：

```text
Requirement
   ↓
Design Artifact
   ↓
Task Artifact
   ↓
Code / Execution Artifact
   ↓
Validation Result
```

Artifact 有 schema、版本和状态，更容易校验和恢复。

## 失败处理必须分类

失败后只“重试一次”通常不够。

常见策略包括：

- Retry：瞬时超时或偶发错误；
- Fallback：主工具不可用；
- Replan：计划前提错误；
- Rollback：已经产生副作用；
- Human Review：高风险或不确定状态。

Runtime 的价值就是把这些策略从 Prompt 里拿出来。

## Context 共享也要受控

多 Agent 不应该默认共享整段对话。

更好的方式是共享结构化 State 和 Artifact，再根据角色投影真正需要的字段。

这样既能降低 Token，也能减少敏感信息和无关信息传播。

## 这一系列怎么读

```text
State Machine
   ↓
LangGraph
   ↓
Supervisor / Manager
   ↓
Artifact Workflow
   ↓
Retry / Rollback / Replan
   ↓
Shared Context
   ↓
Multi-Agent Badcases
```

这条线从“流程为什么要显式化”一直走到“多个 Agent 怎么在真实工程里稳定协作”。

## 一句话总结

> Agent 越接近生产环境，越应该让模型负责语义不确定性，让 Runtime 负责状态、边界、执行、验证和恢复。
