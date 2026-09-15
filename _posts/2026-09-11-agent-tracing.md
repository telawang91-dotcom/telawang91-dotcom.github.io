---
layout: post
title: "Agent Tracing：一次失败到底错在哪一层？"
subtitle: "如果只有最终答案，你很难知道是检索错、规划错、工具错，还是验证根本没拦住。"
date: 2026-09-11 09:00:00 +0800
series: "Agent Evaluation 与 Reliability"
series_key: evaluation-reliability
series_index: "01"
category: Tech
tags: [Agent, Evaluation, Tracing, Reliability]
---

传统接口失败时，日志通常能告诉你哪个请求返回了 500。Agent 系统更麻烦：即使最终结果错了，中间每一步都可能“看起来合理”。

所以 Agent 评测的第一步往往不是打分，而是把整条执行链记录下来。

## 一条 Trace 至少要有什么

一个实用的 Trace 通常包含：

```text
Task
  ↓
Context Assembly
  ↓
Planner Output
  ↓
Tool Selection
  ↓
Tool Arguments
  ↓
Tool Result
  ↓
State Transition
  ↓
Validation
  ↓
Final Result
```

每一步都要带时间、输入摘要、输出、错误信息和关联 ID。

## 为什么只记录 Prompt 不够

如果只把 LLM Request / Response 存下来，你只能看到“模型说了什么”，看不到系统真正做了什么。

比如模型计划本身是对的，但 Tool Adapter 把参数映射错了；或者工具执行成功，但 Validator 没检查终态。只看 Prompt 很容易把这些错误都归因给模型。

## 分层定位 Badcase

我更喜欢把失败先粗分成四层：

1. **Knowledge / Context**：该给模型的信息没有拿到，或者拿错了；
2. **Planning**：上下文正确，但模型生成了错误步骤；
3. **Tool / Execution**：计划正确，工具参数、权限或底层执行出错；
4. **Validation / Termination**：执行结果异常，但系统没有识别，或者错误结束。

这样做的好处是优化动作会更明确。

```text
Knowledge Error  → 补知识 / 调检索
Planning Error   → Prompt / Few-shot / Model / Planner 设计
Tool Error       → Schema / Adapter / Runtime
Validation Error → Assertion / Guardrail / State Machine
```

## Trace 还要支持版本对比

Agent 系统迭代频繁。真正有价值的不是“这一条为什么错”，而是：

> 新版本到底把哪些 Badcase 修好了，又新引入了哪些回归？

因此 Trace 最好绑定模型版本、Prompt 版本、工具版本、代码提交和 Benchmark Case ID。

## 可观测性不是为了做漂亮 Dashboard

Dashboard 只是表现层。Tracing 的核心价值有三个：

- **Debug**：能重建一次失败的执行过程；
- **Eval**：能对中间步骤做分层评分；
- **Data Flywheel**：能把真实 Badcase 变成后续 Benchmark 和 Few-shot 数据。

## 结论

Agent 的最终结果只是最后一个症状。没有 Trace，就只能猜“模型是不是不够聪明”；有了 Trace，才有机会把问题还原成可修复的工程缺陷。
