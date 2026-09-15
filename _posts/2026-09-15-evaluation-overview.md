---
layout: post
title: "总纲：为什么 Agent 的评测比聊天机器人难"
subtitle: "Agent 不只要看答案好不好，还要看过程、动作、状态变化和最终结果是否可靠。"
date: 2026-09-15 18:08:00 +0800
series: "Agent Evaluation 与 Reliability"
series_key: evaluation-reliability
series_index: "00"
category: Tech
homepage: false
tags: [Evaluation, Tracing, Benchmark, Reliability]
---

聊天机器人评测通常关注回答是否相关、准确、流畅。Agent 更难，因为它不仅生成文本，还会规划、调用工具、修改状态，并对外部环境产生影响。

## Agent 评测至少有四层

一个完整任务可以拆成：

```text
Understanding
   ↓
Planning
   ↓
Tool Execution
   ↓
Final State / Artifact
```

最终答案正确，不代表过程可靠；过程某一步错误，也不一定意味着最终任务失败。

因此只看一个总分很难解释问题。

## 第一层：任务有没有完成

最基础的是 Task Completion。

但“完成”必须有可验证定义。例如 Coding Agent 不是“模型说已经修好了”，而可能是：

- 指定测试通过；
- 目标文件发生预期修改；
- 没有破坏已有测试；
- 产物格式满足约束。

完成率必须绑定机器可检查条件。

## 第二层：路径是否合理

两个 Agent 都完成任务，一个可能 4 步完成，另一个可能调用 30 次工具、重复修改文件并触发多次失败。

所以还要看：

- Step 数；
- Tool Call 数；
- Retry 次数；
- Token / Cost；
- 是否走了不必要路径。

这反映工程效率和稳定性。

## 第三层：过程哪里失败

Tracing 的核心不是画一条漂亮链路，而是让每个失败都能定位：

```text
Retrieval Failure
Planning Failure
Tool Selection Failure
Parameter Failure
Execution Failure
Validation Failure
```

没有 Trace，Badcase 最后只剩“这个模型不行”。

## 第四层：结果质量怎么判断

结果验证最好分层：

- 能确定判断的，优先 Assertion / AST / Schema / Test；
- 需要语义判断的，再使用规则或 LLM-as-Judge；
- 高风险结论必要时人工复核。

原则是：**确定性问题尽量用确定性方法判断。**

## 为什么 LLM-as-Judge 不能包打天下

Judge 适合评估风格、完整性、语义一致性等模糊维度。

但它会受到 Prompt、模型版本、位置偏差和随机性的影响，因此不应该替代本来就可以通过测试或结构化比较完成的验证。

## Benchmark 必须支持回归

好的 Benchmark 不只用来跑一次排行榜，而应该成为工程回归集。

每次修改 Prompt、Retriever、Planner 或 Tool 以后，都可以重新跑同一批任务，观察：

- 哪些变好；
- 哪些退化；
- 哪一层变化最大。

这才形成可持续优化。

## 为什么需要多维指标

Agent 的可靠性通常需要同时观察：

```text
Completion
Correctness
Planning Quality
Tool Quality
Efficiency
Safety
Recoverability
```

维度名称可以按业务调整，但目标是一致的：避免用一个“成功率”掩盖系统内部问题。

## Badcase 是最有价值的数据

评测真正产生价值的地方，不只是分数，而是失败样本进入闭环：

```text
Benchmark
  ↓
Trace Badcase
  ↓
Failure Classification
  ↓
Fix Retrieval / Planning / Tool / Validation
  ↓
Regression
```

长期看，可靠性来自这套循环，而不是一次模型升级。

## 这一系列怎么读

```text
Tracing
  ↓
Benchmark
  ↓
LLM-as-Judge
  ↓
Deterministic Evaluation
  ↓
Multi-dimensional Metrics
  ↓
Badcase Loop
  ↓
Guardrail / CodeCheck
```

前半部分回答“怎么测”，后半部分回答“怎么用评测推动系统变好”。

## 一句话总结

> Agent Evaluation 的目标不是给模型打一个漂亮分数，而是让每一次成功和失败都可解释、可比较、可回归、可改进。
