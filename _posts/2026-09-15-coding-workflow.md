---
layout: post
title: "Coding Workflow：Spec → Design → Tasks → Code 为什么比直接写代码稳？"
subtitle: "复杂研发任务真正难的不是生成代码，而是让需求、设计、任务和实现之间保持可追踪。"
date: 2026-09-15 18:44:00 +0800
series: "AI Coding 与 Agent Harness"
series_key: ai-coding-harness
series_index: "03"
category: Tech
tags: [AI-Coding, Coding-Agent, Workflow, Agent-Harness]
---

Coding Agent 最容易做成一个“收到需求 → 直接改代码”的循环。

对于小修复这可能足够，但任务一复杂，就会出现理解偏差、改错范围、遗漏依赖和难以回滚的问题。

所以更可靠的做法，是让任务经过显式 Workflow：

```text
Spec
 ↓
Design
 ↓
Tasks
 ↓
Code
 ↓
Validate
```

## Spec 阶段解决“到底要做什么”

Spec 需要把自然语言需求变成更明确的约束：

```text
Goal
Non-goals
Acceptance Criteria
Constraints
Affected Area
```

例如：

> “支持批量删除文件”

应该进一步明确：最大数量、权限、失败是否原子、是否支持恢复、API 兼容性。

## Design 阶段解决“准备怎么做”

Design 不需要写成很长的文档，但至少应该回答：

- 修改哪些模块；
- 新增哪些接口；
- 数据怎么流；
- 是否有迁移；
- 风险点是什么。

这一步让 Agent 在真正动代码前先暴露错误理解。

## Tasks 阶段把设计变成可执行单元

一个好的 Task 不只是：

> “完成后端修改”

而是类似：

```yaml
- id: T1
  action: add batch delete API
  files: [api/files.py]
  depends_on: []
  acceptance: endpoint returns per-file status
```

这样 Manager Agent 可以路由，执行过程也能逐步验收。

## Code 阶段不要一次改完整个项目

推荐按 Task 小步执行：

```text
T1 → Edit → Test → Artifact
T2 → Edit → Test → Artifact
T3 → Integration Test
```

每一步都有明确中间产物，失败时更容易恢复。

## 为什么 Artifact 很重要

不同阶段可以交接：

```text
spec.md
design.md
tasks.yaml
patch.diff
test_report.json
```

这些 Artifact 比 Agent 间自然语言转述更稳定，也方便 Evaluation。

## Validator 应该放在每个关键 Gate

不是等所有代码生成完才测试。

例如：

```text
Spec → schema check
Design → consistency check
Tasks → dependency check
Code → lint / unit test
Final → integration test
```

越晚发现错误，修复成本越高。

## 小任务也需要完整流程吗

不一定。

工程上可以根据任务复杂度做 Dynamic Workflow：

```text
Tiny Fix → Code → Test
Medium   → Plan → Code → Test
Complex  → Spec → Design → Tasks → Code → Multi-stage Validate
```

流程本身也应该是可配置的。

## 面试里怎么说

> 我更倾向让 Coding Agent 走 Spec → Design → Tasks → Code → Validate，而不是直接改代码。每一阶段都产出结构化 Artifact，并设置 Gate 做校验。这样需求、设计和实现之间可以追踪，任务也更适合 Manager Agent 分发；小任务可以走简化路径，复杂任务才启用完整流程。
