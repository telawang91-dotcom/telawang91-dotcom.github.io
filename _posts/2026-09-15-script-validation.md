---
layout: post
title: "Script Validation：JSON、Workflow 与 Bash 到底应该校验什么？"
subtitle: "脚本校验的目标不是证明文本‘像代码’，而是阻止错误产物进入执行环境。"
date: 2026-09-15 18:39:00 +0800
series: "AI Coding 与 Agent Harness"
series_key: ai-coding-harness
series_index: "04"
category: Tech
tags: [AI-Coding, Validation, JSON, Bash]
---

Coding Agent 往往会生成 JSON、Workflow 配置和 Bash 脚本。如果这些产物直接执行，模型的一次格式错误就可能变成真实环境里的执行错误。

所以在 Harness 里，脚本校验应该是一层确定性 Gate。

## JSON 校验什么

最基础是语法合法性，但远远不够。还应该检查必填字段、字段类型、枚举值、嵌套结构、跨字段约束和业务规则。

例如一个任务节点可以语法完全合法，但 `tool` 和 `args` 不匹配，这种错误必须在执行前拦截。

## Workflow 校验什么

Workflow 更关心图结构：节点是否存在、Edge 是否引用有效节点、是否有不可达节点、是否存在非法循环、入口和终止节点是否明确。

如果是状态机，还要检查状态转移是否合法，避免从未完成的前置状态直接跳到执行。

## Bash 校验什么

Bash 既要做语法检查，也要做风险检查。常见包括：危险命令、路径越界、未引用变量、错误处理缺失、不可控网络访问和可能破坏环境的递归操作。

真正执行时还应该配合 sandbox、超时、资源限制和最小权限。

## 为什么 LLM 自检不够

让模型重新读一遍自己生成的脚本，可以补充语义检查，但不能替代 parser、schema validator、shell checker 和规则引擎。

确定性错误应该交给确定性工具。

## 一个合理的校验链

```text
Generated Artifact
      ↓
Parser / Syntax
      ↓
Schema / Structure
      ↓
Policy / Security
      ↓
Dry Run / Static Check
      ↓
Execution
      ↓
Post-condition Check
```

## 面试回答重点

JSON 我会校验语法、Schema 和业务约束；Workflow 重点检查节点、边、状态转移和可达性；Bash 除了语法，还要检查危险命令、路径和执行权限。核心是让错误在执行前尽量暴露。
