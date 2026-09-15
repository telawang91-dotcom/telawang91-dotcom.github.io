---
layout: post
title: "Supervisor 与 Manager Agent：任务到底应该怎么分发？"
subtitle: "Manager Agent 不应该只是一个更大的 Prompt，而应该承担任务拆解、路由、约束和收敛。"
date: 2026-09-15 18:36:00 +0800
series: "Workflow 与 Multi-Agent"
series_key: workflow-multi-agent
series_index: "03"
category: Tech
tags: [Multi-Agent, Supervisor, Manager-Agent, Workflow]
---

Multi-Agent 系统最容易写成一种“Agent 互相聊天”的结构：Manager 收到任务后，把自然语言丢给某个 Worker，再看结果决定下一步。

Demo 可以这样做，但工程系统需要更清晰的职责边界。

## Manager Agent 的四个核心职责

### 1. Task Decomposition

把用户目标拆成可执行子任务，而不是直接把原任务转发给 Worker。

```text
Goal
  ↓
Subtask A
Subtask B
Subtask C
```

每个子任务最好有：输入、预期产物、依赖关系、完成条件。

### 2. Routing

决定哪个 Agent 最适合执行哪一步。

路由不只看语义，还要考虑：

- Agent 能力；
- Tool 权限；
- 当前状态；
- 成本；
- 是否需要并行。

### 3. State Convergence

Worker 返回结果以后，Manager 不应该只把文本拼起来，而应该把结果写回结构化状态：

```json
{
  "task_id": "T3",
  "status": "done",
  "artifact": "design.md",
  "confidence": 0.91
}
```

这样后续节点可以确定性判断。

### 4. Failure Handling

Worker 失败时，Manager 需要区分：

```text
Retry
Reassign
Replan
Escalate to human
Terminate
```

而不是统一回复“请重新尝试”。

## 为什么 Manager 不应该掌握所有细节

如果 Manager 既负责规划、执行、校验、上下文管理，又知道所有 Tool Schema，它会迅速变成一个超级 Agent。

更合理的结构是：

```text
Manager
  ├─ Planner / Router
  ├─ Worker A
  ├─ Worker B
  └─ Validator
```

Manager 控制方向，Worker 做具体任务，Validator 独立检查结果。

## 如何防止分配不合理

可以在任务分发前建立 Agent Capability Registry：

```json
{
  "agent": "coding_agent",
  "capabilities": ["edit_code", "run_test"],
  "tools": ["filesystem", "shell"],
  "risk": "medium"
}
```

路由时先做能力匹配和权限过滤，再让 LLM 做语义判断。

## Worker 完不成怎么办

一个常见策略是：

```text
Worker Failed
   ↓
Is transient error?
   ├─ Yes → Retry
   └─ No
       ↓
Can another worker handle it?
   ├─ Yes → Reassign
   └─ No
       ↓
Is plan wrong?
   ├─ Yes → Replan
   └─ No → Human / Fail
```

这比让模型自由决定稳定得多。

## 面试里怎么说

> 我把 Manager Agent 看成控制面，而不是一个什么都做的超级 Agent。它主要负责任务拆解、能力路由、状态收敛和异常处理；具体执行交给 Worker，结果再经过 Validator。分发时会结合 Agent Capability、Tool 权限和当前 Workflow State，而不是只靠一个 Prompt 做语义匹配。
