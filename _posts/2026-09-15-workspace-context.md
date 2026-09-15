---
layout: post
title: "Workspace Context：任务产物如何跨 Agent 传递？"
subtitle: "Workspace 不是临时文件夹，而是当前任务可被不同 Agent 读取、验证和接力的状态空间。"
date: 2026-09-15 18:38:00 +0800
series: "AI Coding 与 Agent Harness"
series_key: ai-coding-harness
series_index: "02"
category: Tech
tags: [AI-Coding, Workspace, Context-Engineering, Multi-Agent]
---

在 Coding Agent 里，Codebase Context 解决“仓库里有什么”，Workspace Context 解决“当前任务已经做到哪一步”。这两个上下文生命周期完全不同。

## Workspace 应该承载什么

Workspace 更适合保存当前任务的动态产物：需求解析、设计决策、任务拆分、修改文件列表、执行日志、测试结果和失败记录。

```text
Task
 ↓
Spec
 ↓
Design
 ↓
Tasks
 ↓
Patch / Code
 ↓
Validation Result
```

这些内容不是仓库长期事实，而是一次任务执行过程中产生的状态。

## 为什么不能只共享聊天记录

聊天记录包含大量解释性文本，而且角色之间看到的内容完全相同。随着任务变长，信息噪声会越来越大。

Workspace 更适合按 Artifact 组织，让不同 Agent 读取自己需要的内容。例如 Coder 读取任务和设计，Validator 读取修改结果和验收标准，而不必看到全部历史对话。

## 多 Agent 怎么共享

共享不等于广播。更好的设计是：Runtime 维护统一 Workspace，不同 Agent 根据角色拿到投影视图。

```text
Shared Workspace
├── Planner  → task + requirements
├── Coder    → design + tasks + code context
└── Validator→ patch + tests + acceptance criteria
```

这样既减少 token，也降低角色污染和越权风险。

## Workspace 还承担断点恢复

当任务执行到测试阶段失败，如果前面的 Spec、Design、Tasks 和 Patch 已持久化，就可以从失败点继续，而不是重新让模型生成所有内容。

## 与 Codebase 的边界

Codebase 是长期稳定的仓库事实，Workspace 是当前任务的增量状态。前者更偏 Retrieval，后者更偏 Task Memory / Artifact Store。

## 面试回答重点

我会把 Workspace 定义成当前任务的动态上下文和产物空间，用结构化 Artifact 在多个 Agent 之间交接，并通过角色视图控制每个 Agent 能看到什么。这样比共享完整对话更可控，也天然支持断点恢复和评测。
