---
layout: post
title: "总纲：怎么把一个 Agent Demo 做成可展示项目"
subtitle: "真正有说服力的项目，不是功能列表，而是问题、架构、约束、Badcase 和验证闭环。"
date: 2026-09-15 18:10:00 +0800
series: "Agent Project Case Studies"
series_key: project-cases
series_index: "00"
category: Tech
homepage: false
tags: [Agent, Project, Case-Study, Engineering]
---

很多 Agent 项目在 Demo 阶段看起来都很相似：输入一句话，模型调用几个工具，最后返回一个结果。真正能体现工程能力的，是你能不能回答：**为什么这样设计、失败时会怎样、系统怎么验证自己做对了。**

## 一个项目至少要讲清四层

### 1. Problem：为什么需要 Agent

不要从“我用了 LangGraph”开始。

先说明原问题是什么，以及为什么固定规则、单次 LLM 调用或普通工作流不够。

例如 Smart Home 的核心不是“用了 Multi-Agent”，而是环境状态动态变化、舒适与安全目标可能冲突、动作执行前需要验证。

### 2. Architecture：系统怎么拆

架构应该围绕责任边界，而不是技术栈列表。

例如：

```text
Perception → Prediction → Decision → Validation → Execution
```

或：

```text
Question → Planner → Executor → Artifact → Validation → Claim
```

看到这条链，读者应该能理解数据怎么流、决策在哪里发生、确定性检查在哪里发生。

### 3. Failure：系统哪里最容易错

真正有工程深度的项目一定会讲 Badcase。

可以按层拆：

- 数据质量；
- 检索；
- Planning；
- Tool Selection；
- Execution；
- Validation；
- Context Sharing。

只展示成功 Demo，很难说明系统经过了真实迭代。

### 4. Verification：怎么证明它真的工作

可靠项目需要明确成功标准。

例如：

- E2E completion；
- Top-K path hit rate；
- 回归 Benchmark；
- Trace-based failure analysis；
- Assertion / Test；
- Reproduction / Provenance。

这些比一句“效果很好”更有说服力。

## 公开项目和实习案例要区别处理

公开 GitHub 项目可以直接展示架构、截图、接口设计和实现细节。

实习项目更适合抽象成工程方法论，只讨论：

- 问题类型；
- 通用架构；
- 设计原则；
- Failure Pattern；
- Evaluation Method。

不应该公开内部代码、真实业务数据、内部接口、知识库内容或组织敏感信息。

## Case Study 最好遵循固定模板

一篇工程案例可以按下面组织：

```text
1. Problem
2. Constraints
3. Architecture
4. Key Design Decision
5. Failure Modes
6. Evaluation
7. Trade-offs
8. What I would improve next
```

这样读者看到不同项目时，可以直接横向比较你的设计能力。

## 为什么项目文章比简历更重要

简历只能写一句：

> 使用 LangGraph 构建 Multi-Agent Workflow。

博客可以继续回答：

- 为什么不是普通 Chain；
- State 怎么设计；
- Agent 之间共享什么；
- Validator 放在哪里；
- Badcase 怎么定位；
- 为什么失败后选择 Replan 而不是 Retry。

这就是“做过”与“真正理解”的区别。

## 这一系列会覆盖什么

本系列主要使用公开项目和脱敏工程案例：

```text
Smart Home
  ├─ E2E Agent Loop
  └─ Sensor Data Quality

ReproLab
  ├─ Provenance
  └─ Planner / Executor / Critic

GUI Agent
  ├─ Function Tree / Retrieval / Tool Execution
  └─ Badcase Loop

Agent Platform Methodology
  ├─ Structured Plan + Executor
  └─ Harness Engineering Loop
```

它们分别代表环境 Agent、科研 Agent、GUI Agent 和通用 Agent Platform 四种不同问题空间。

## 一句话总结

> 一个好的 Agent Case Study，不是告诉别人用了多少框架，而是让别人看到你如何把一个不确定问题拆成可执行、可验证、可恢复的工程系统。
