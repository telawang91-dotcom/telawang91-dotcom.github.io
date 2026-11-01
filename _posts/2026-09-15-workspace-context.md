---
layout: post
title: "Workspace Context：任务产物如何跨 Agent 传递？"
subtitle: "Workspace 不是临时文件夹，而是当前任务可被不同 Agent 读取、验证和接力的状态空间。"
date: 2026-09-15 18:38:00 +0800
updated: "2026-11-01"
series: "AI Coding 与 Agent Harness"
series_key: ai-coding-harness
series_index: "02"
category: Tech
tags: [AI-Coding, Workspace, Context-Engineering, Multi-Agent]
---

在 Coding Agent 里，Codebase Context 解决“仓库里有什么”，Workspace Context 解决“当前任务已经做到哪一步”。这两个上下文生命周期完全不同。

本文讨论的是 **Task Workspace（任务工作区）**。跨仓库项目也可能使用 Workspace 保存长期共享的业务与架构知识，那属于 **Project Workspace（项目工作空间）**。名称相同不代表生命周期相同，落地时应在数据结构与文档中明确作用域。

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

不过，“状态已保存”不等于“可以直接接着跑”。恢复前应核对产物版本、当前代码和验证输入是否一致：如果中断后设计或依赖发生变化，就需要让相关阶段失效并重新检查。对于已经发送的外部动作，还应先核对实际执行结果，避免重复操作。

## 交接时传递引用、版本与未解决问题

一个实用的交接记录可以包含：任务标识、当前阶段、输入产物引用、输出产物引用、对应版本、验证结论和未解决问题。下一位 Agent 读取的是可定位的产物，而不是一句“前面的工作已完成”。

任务结束后，应将确认有效的规格和设计变化更新到长期知识；探索草稿和失败日志继续保留为任务记录，避免直接混入当前有效事实。相关例子见[增量规格与全量知识]({{ '/2026/11/01/agent-spec-change-lifecycle/' | relative_url }})。

## 与 Codebase 的边界

Codebase Context 是随代码演进的仓库事实，Task Workspace 是当前任务的增量状态。前者更偏 Retrieval，后者更偏 Task Memory / Artifact Store；两者都需要版本与失效管理。

## 面试回答重点

在任务范围内，我会把 Task Workspace 定义成动态上下文和产物空间，用结构化 Artifact 在多个 Agent 之间交接，并通过角色视图控制每个 Agent 能看到什么。配合版本记录、证据检查和恢复逻辑，这些产物可以为断点恢复和评测提供依据。
