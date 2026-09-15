---
layout: post
title: "Coding Agent 到底比普通 Agent 多了什么？"
subtitle: "真正复杂的不是会写代码，而是要理解仓库、维护任务状态、执行工具并证明改动是对的。"
date: 2026-09-10 09:00:00 +0800
series: "AI Coding 与 Agent Harness"
series_key: ai-coding-harness
series_index: "00"
category: Tech
tags: [AI-Coding, Agent, Harness, Context-Engineering]
---

如果把 Coding Agent 简化成“LLM + 写文件工具”，Demo 很快就能跑起来。但真正面对一个真实仓库时，问题会立刻变多：该读哪些文件、改动影响谁、测试怎么跑、失败后从哪里恢复、多个 Agent 如何交接产物。

这也是为什么 Coding Agent 往往需要一层 Harness。

## 普通 Agent 的核心闭环

```text
User Task
  ↓
Reason / Plan
  ↓
Tool Call
  ↓
Observation
  ↓
Answer
```

而 Coding Agent 更接近：

```text
Requirement
   ↓
Repository Understanding
   ↓
Spec / Design / Task Breakdown
   ↓
Code Change
   ↓
Static Check / Test / Build
   ↓
Review / Repair
   ↓
Deliverable
```

执行跨度更长，状态也更多。

## Harness 在管什么

我会把 Harness 理解成 Agent 周围的工程运行时，至少负责四件事。

### 1. Workflow

明确任务处于需求、设计、开发还是验证阶段；哪些阶段能回退，哪些操作需要人工审批。

### 2. Context

把长期 Codebase Context 和当前 Workspace Artifact 分开管理，再按角色组装模型上下文。

### 3. Tool Runtime

统一文件操作、Shell、测试、搜索、Git 等工具，并做权限、超时、输出截断和错误处理。

### 4. Verification

生成代码不能等于任务完成。系统还要验证 JSON、脚本、代码格式、单测、构建结果和最终业务条件。

## 为什么要有中间产物

长任务如果只依赖聊天历史，很难恢复，也很难让多个 Agent 协作。

更稳定的方式是让流程产生显式 Artifact：

```text
requirement
   ↓
delta-spec
   ↓
delta-design
   ↓
tasks
   ↓
code diff
   ↓
test report
```

下一阶段消费的是上一阶段确认后的产物，而不是重新理解整段对话。

## Coding Agent 的“完成”应该怎么定义

对普通聊天，模型输出最后一句话就结束了。

对 Coding Agent，更合理的完成条件是机器可判断的：

- 目标文件确实修改；
- 关键接口满足契约；
- 测试通过；
- 没有新增高风险错误；
- 交付产物完整；
- 最终状态满足验收条件。

这也是 Harness 和普通 Chat Agent 最明显的差别。

## 结论

Coding Agent 的难点不只是代码生成，而是把“理解 → 设计 → 修改 → 验证 → 交付”变成一个可靠的软件工程流程。

模型是其中的推理引擎，Harness 才是让这套能力真正可控运行的骨架。
