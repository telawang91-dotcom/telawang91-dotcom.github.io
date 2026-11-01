---
layout: post
title: "Codebase Context：大仓库到底应该怎么被 Coding Agent 理解？"
subtitle: "真正的问题不是把多少代码塞进 Context，而是如何让 Agent 在需要时找到正确的代码结构和依赖。"
date: 2026-09-15 18:43:00 +0800
updated: "2026-11-01"
series: "AI Coding 与 Agent Harness"
series_key: ai-coding-harness
series_index: "01"
category: Tech
tags: [AI-Coding, Coding-Agent, Context-Engineering, Codebase]
---

Coding Agent 面对一个真实仓库时，不可能把几十万行代码全部放进 Prompt。

所以 Codebase Context 的核心不是“上下文窗口够不够大”，而是：**先建立代码库索引，再按任务动态选择最相关的结构和文件。**

## Codebase Context 可以分四层

### 1. Repository Structure

先让 Agent 知道仓库大致长什么样：

```text
src/
  api/
  service/
  models/
tests/
docs/
```

目录树可以帮助模型形成第一层定位。

### 2. Symbol Index

提取：

- class；
- function；
- interface；
- import；
- call relation。

这样用户问“登录逻辑在哪”，不一定先做全文向量搜索，而可以从 `AuthService.login` 等符号进入。

### 3. Semantic Retrieval

当任务表达比较自然语言，例如：

> “修改上传文件大小限制”

可以通过 Embedding / Hybrid Search 找相关配置、接口和文档。

### 4. Dependency Expansion

只找到目标函数还不够，还要继续补它的邻居：

```text
Target Function
   ├─ Imports
   ├─ Callers
   ├─ Callees
   ├─ Tests
   └─ Config
```

这一步能避免 Agent 只改局部代码，却漏掉关联测试和配置。

## 不要一次把所有召回结果全塞进去

可以采用逐步探索：

```text
Task
 ↓
Search symbols
 ↓
Read target file
 ↓
Follow references
 ↓
Read tests
 ↓
Edit
```

这比一开始召回 30 个文件更可控。

## Codebase Context 要和 Workspace 分开

本文用 Task Workspace 表示当前任务产生的 Artifact，例如 Plan、Patch、Test Log；Codebase Context 则表示仓库范围内、需要随代码更新的事实。

两者生命周期不同：

```text
Codebase Context → repository-scoped
Task Workspace  → task-scoped
```

如果混在一起，旧任务的 Patch 和日志可能污染后续检索。

还有一种常见用法是 Project Workspace：它表示跨仓库的项目空间，保存共享业务概念、接口契约和工程约束。这与本文的 Task Workspace 不是同一层。涉及多个服务时，可以按“项目共享事实 → 相关仓库 → 本次任务”组织上下文，再按修改范围读取必要内容。

例如修改订单状态接口，除了当前服务实现，还应补充状态枚举的共享定义、消费方的兼容要求和对应测试。召回片段最好携带来源路径与版本；文档与代码不一致时，应先确认差异，而不是让摘要覆盖原始事实。更完整的分层讨论见[研发 Agent Harness]({{ '/2026/11/01/reliable-development-agent-harness/' | relative_url }})。

## 什么时候需要摘要

超大文件不一定全文放入模型，可以先生成结构摘要：

```text
File: payment_service.py
- PaymentService.create_payment
- PaymentService.refund
- depends on PaymentRepository
- called by /api/payment
```

真正需要修改时再读取相关区域。

## 如何降低错误改动

Context Builder 除了“找相关代码”，还应该补：

- repository conventions；
- test location；
- code owner / protected area；
- project instructions；
- allowed edit scope。

否则模型可能写出语法正确但不符合项目规范的代码。

## 面试里怎么说

> Coding Agent 的 Codebase Context 我不会理解成把整个仓库塞给模型，而是做分层索引：目录结构、Symbol、语义检索和依赖扩展。Agent 先定位相关 Symbol，再按调用关系、测试和配置动态展开上下文；Codebase 和任务 Workspace 分开，避免临时产物污染长期代码知识。
