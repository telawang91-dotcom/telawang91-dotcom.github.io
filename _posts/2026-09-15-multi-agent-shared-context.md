---
layout: post
title: "多 Agent 共享上下文：到底应该共享什么，不共享什么？"
subtitle: "共享整个聊天记录最省事，也最容易把噪声、权限和成本一起放大。"
date: 2026-09-15 18:38:00 +0800
series: "Workflow 与 Multi-Agent"
series_key: workflow-multi-agent
series_index: "06"
category: Tech
tags: [Multi-Agent, Context-Engineering, State, Workspace]
---

Multi-Agent 系统里一个很自然的问题是：多个 Agent 怎么共享上下文？

最简单的做法是把所有消息都放进一个共享 Conversation History。但系统变复杂以后，这种方案会出现严重问题：每个 Agent 都看到大量无关信息、Context 越来越长、不同角色之间权限边界模糊。

## 不要先想“怎么共享”，先想“哪些信息是公共状态”

更合理的方式是建立结构化 Shared State：

```json
{
  "goal": "完成服务部署",
  "plan": [...],
  "current_step": 3,
  "artifacts": {...},
  "errors": [...],
  "status": "running"
}
```

这是所有 Agent 可以依赖的任务事实。

## Agent 不需要看到所有字段

可以针对不同角色生成 State Projection：

```text
Planner 看到：Goal + Constraints + History Summary
Coder   看到：Task + Code Context + Workspace Artifacts
Tester  看到：Changed Files + Test Plan + Logs
Manager 看到：Plan + Status + Errors + Artifacts
```

这样既减少 Token，也减少无关信息干扰。

## Artifact 比自然语言转述更可靠

Agent A 完成设计后，不应该只发一句：

> “我已经设计好了，主要有三个模块……”

更好的交接方式是生成明确 Artifact：

```text
design.md
api_schema.json
tasks.yaml
patch.diff
test_report.json
```

下一 Agent 读取 Artifact，而不是依赖上一 Agent 的口头总结。

## Codebase 和 Workspace 应该分开

Codebase 是长期事实：源码、文档、依赖和架构。

Workspace 是当前任务产生的动态信息：计划、设计、日志、Patch、测试结果。

如果混成一个向量库，很容易发生：

- 临时日志污染长期知识；
- 旧任务 Artifact 被新任务召回；
- 权限边界难做；
- 生命周期难管理。

## 权限同样要作用在共享上下文

多 Agent 系统不能因为“内部 Agent”就默认互相可见全部数据。

例如：

```text
Payment Agent → 可见支付信息
Support Agent → 只见脱敏摘要
Analytics Agent → 只见聚合数据
```

Context Builder 在注入之前必须做 Role / Scope Filter。

## 什么时候适合共享原始历史

只有在任务非常短、Agent 数量少、信息敏感度低时，全量共享 Conversation History 才比较合理。

复杂场景更适合：

```text
Structured State
+ Artifact Store
+ Retrieval
+ Role-specific Context Projection
```

## 面试里怎么说

> 多 Agent 之间我不会简单共享完整聊天记录，而是共享结构化 State 和 Artifact。不同 Agent 根据角色拿到 State 的不同投影，Codebase 和 Workspace 分开管理，同时在 Context Builder 阶段做权限过滤。这样能降低 Token、噪声和越权风险，也更方便追踪每一步是谁产生了什么结果。
