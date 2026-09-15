---
layout: post
title: "多 Agent 系统最常见的五类流转 Badcase"
subtitle: "真正难的往往不是 Agent 会不会回答，而是任务会不会在错误节点、错误角色和错误状态之间循环。"
date: 2026-09-15 18:34:00 +0800
series: "Workflow 与 Multi-Agent"
series_key: workflow-multi-agent
series_index: "07"
category: Tech
tags: [Multi-Agent, Workflow, Badcase, LangGraph]
---

Multi-Agent 系统最容易被低估的问题，不是“某个 Agent 输出不好”，而是**流转出了问题**。如果路由、状态和失败策略没有设计好，多个 Agent 只会把一次错误放大成一串错误。

## 1. Manager 分错任务

Manager 把任务交给能力不匹配的子 Agent，是最常见的路由问题。解决方式不是单纯强化 Prompt，而是给每个 Agent 定义明确 capability、输入契约和 Tool 范围，并在分发前做约束匹配。

## 2. 子 Agent 无法完成却不退出

如果 Worker 一直尝试，它可能进入无效循环。系统应该允许明确返回 `blocked / need_replan / failed`，由上层决定重试、改计划还是终止。

## 3. 上下文越传越多

把完整历史广播给所有 Agent，会导致上下文膨胀、角色污染和权限泄露。更好的方式是共享结构化 State，再按角色做 Context Projection。

## 4. 已完成步骤被重复执行

如果任务状态没有显式记录，Manager 可能再次分发已经完成的工作。需要幂等标识、step status 和 artifact version 来防止重复执行。

## 5. 失败后回不到正确节点

工具失败不代表整条任务失败。不同错误应该有不同恢复路径：瞬时失败 Retry、计划前提错误 Replan、产物校验失败回到上游修订、风险操作转 HITL。

```text
Failure
├── transient → retry
├── planning  → replan
├── artifact  → revise upstream
└── risky     → human approval
```

## 为什么一定要显式状态机

这些 Badcase 的共同点，是“系统不知道现在到底在哪”。一旦状态、产物和错误类型显式化，流转策略才有可能从模型猜测变成确定性控制。

## 面试回答重点

我会把 Multi-Agent Badcase 分成路由错误、子 Agent 无法完成、上下文污染、重复执行和失败恢复五类。核心不是让每个 Agent 更聪明，而是用状态、角色边界和异常转移把系统流转约束住。
