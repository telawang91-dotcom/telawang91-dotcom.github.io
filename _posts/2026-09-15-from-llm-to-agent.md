---
layout: post
title: "从 LLM 到 Agent：模型、状态、工具与环境"
subtitle: "当模型开始持续感知、调用工具并根据结果更新状态，它才真正进入 Agent 范式。"
date: 2026-09-15 18:02:00 +0800
series: "AI Agent 基础"
series_key: agent-foundations
series_index: "01"
category: Tech
homepage: false
tags: [Agent, LLM, Tool-Use, State]
---

很多“Agent 入门”会从框架开始讲：LangChain、LangGraph、AutoGen。更容易建立稳定认知的方法，是先问一个更基础的问题：**普通 LLM 应用和 Agent 到底差在哪里？**

## 普通 LLM 应用通常只有一次决策

最简单的生成式应用是：

```text
User Input → Prompt → LLM → Output
```

即使加上 RAG，本质也仍然是一次增强后的生成：

```text
Question → Retrieve → Context → LLM → Answer
```

系统可以非常有价值，但它并没有持续地操作环境。

## Agent 多了“行动”和“反馈”

Agent 至少包含一个闭环：

```text
Goal
 ↓
Observe
 ↓
Decide / Plan
 ↓
Act with Tool
 ↓
Environment changes
 ↓
Observe again
```

关键变化是：**模型的输出不再只是文本，而可能改变外部世界。**

例如它可以读取文件、查询数据库、调用搜索、执行代码、修改仓库、控制设备。

## Model 不是 Agent 本身

模型提供的是能力：语言理解、推理、生成和选择。

Agent 是更大的系统，它把模型嵌进运行时：

```text
Agent = Model + State + Tools + Context + Runtime Policy
```

如果去掉状态和运行时，只剩“模型每轮自己看聊天历史决定下一步”，复杂任务很快就会失控。

## State：Agent 的任务记忆

State 回答的是：

- 当前目标是什么；
- 已经完成哪些步骤；
- 当前处在哪个阶段；
- 已经产生哪些 Artifact；
- 最近一次 Tool 调用是否成功；
- 还有多少预算；
- 是否等待人工确认。

一个简化状态可能是：

```python
state = {
    "goal": "fix failing test",
    "current_step": 2,
    "artifacts": ["analysis.md"],
    "errors": [],
    "status": "executing"
}
```

状态最好是系统可读的数据，而不是只存在自然语言对话里。

## Tool：把语言决策变成可执行动作

Tool 通常可以抽象成：

```text
name + description + input schema + executor + permission
```

模型并不直接执行操作。它生成 Tool Call，系统先校验参数和权限，再真正调用外部能力。

这层分离非常重要，因为错误的模型输出不应该直接变成不可逆动作。

## Environment：Agent 实际工作的世界

环境可以是：

- 浏览器页面；
- Git 仓库；
- 操作系统；
- 数据库；
- 手机 GUI；
- 智能家居设备；
- 企业业务系统。

不同环境的核心差别，在于**可观察状态和可执行动作**不同。

GUI Agent 观察页面节点并点击控件；Coding Agent 观察 Codebase 和测试结果并修改文件；Smart Home Agent 观察传感器状态并控制设备。

## Agent 的核心循环

最小实现可以写成：

```python
while not done:
    context = build_context(state, environment)
    action = model.decide(context, tools)
    result = execute(action)
    state = update_state(state, result)
```

真正工程化以后，还要继续加入：

- timeout；
- retry；
- checkpoint；
- validation；
- permission；
- tracing；
- evaluation。

## 为什么“自主性”不是越高越好

Agent 经常被描述成“自主完成任务”。但生产系统追求的不是最大自主性，而是**在允许范围内自主**。

确定性的业务规则、权限边界和安全检查应该由工程系统掌握；模型主要负责那些确实需要语义理解和不确定性判断的部分。

## 一个判断标准

如果一个系统只是：

> 输入问题 → 输出答案

它更像 LLM Application。

如果它需要：

> 观察环境 → 选择动作 → 执行 → 根据结果继续决定

它就进入 Agent 问题空间。

## 核心结论

从 LLM 到 Agent，不是简单“加一个工具”。真正的变化是从**一次生成**变成**持续执行闭环**。理解这一点以后，Function Calling、Memory、Planning、Workflow 和 Evaluation 就都会落到正确的位置上。
