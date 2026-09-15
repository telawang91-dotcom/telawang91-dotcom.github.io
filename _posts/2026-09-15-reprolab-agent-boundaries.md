---
layout: post
title: "ReproLab：Planner / Executor / Critic 的工程边界怎么划？"
subtitle: "把理解、执行和验证拆开，才能知道一次分析到底在哪一层出了问题。"
date: 2026-09-15 19:40:00 +0800
series: "Agent Project Case Studies"
series_key: project-cases
series_index: "04"
category: Tech
tags: [ReproLab, Planner, Executor, Critic, Agent]
---

把一个复杂 Agent 写成“一个大 Prompt + 一堆工具”很快，但很难维护。ReproLab 更关注三个职责的分离：Planner 负责想清楚要做什么，Executor 负责把计划变成真实执行，Critic 负责检查结果是否可信。

## Planner：负责意图和计划，不直接改世界

Planner 的输入是用户问题、可用数据、检索证据和工具能力。它的主要输出应该是结构化计划，而不是直接执行代码。

例如：

```json
{
  "goal": "比较两组样本均值并给出显著性结论",
  "steps": [
    "读取数据字段",
    "检查缺失值",
    "选择统计检验",
    "执行计算",
    "生成表格和结论"
  ]
}
```

Planner 的重点是“决定做什么”和“为什么这么做”。

## Executor：负责确定性执行

Executor 不应该继续自由发挥，而是把结构化步骤映射成真实动作，例如生成 Python、读取文件、执行分析、持久化结果。

它需要处理的是工程问题：

- Tool 参数是否合法；
- 文件是否存在；
- 代码是否执行成功；
- 超时怎么办；
- 输出怎样保存为 Artifact；
- 环境和输入怎样被记录。

因此 Executor 更接近 Runtime，而不是第二个 Planner。

## Critic：验证，而不是重复生成

Critic 如果只是“再让一个模型看一遍”，价值有限。更好的 Critic 应优先使用可以验证的信号：

- 数值是否能从 Artifact 中找到；
- 引用是否指向真实来源；
- 图表数据是否与文字描述一致；
- 结果是否满足用户约束；
- 代码重跑是否出现漂移。

只有无法确定性判断的语义问题，才交给模型评审。

## 为什么不让 Planner 直接执行

如果 Planner 同时负责规划、写代码、执行和判断成功，失败时只能看到“最终答案不对”。

拆开以后 Trace 可以清晰区分：

```text
Planning Failure
Execution Failure
Validation Failure
```

这对 Badcase 归因和 Benchmark 都非常重要。

## 三层之间用 Artifact 交接

Agent 之间最好不要只通过自然语言聊天交接。

例如 Planner 产出 Plan Artifact，Executor 读取 Plan 并产出 Run / Artifact，Critic 再读取这些结构化产物做验证。

这样每一层都有明确输入输出，也便于断点恢复和重新执行。

## Critic 失败后怎么办

验证失败不代表一定从头开始。

常见策略可以是：

```text
引用缺失 → 回到 Retrieval / Writing
代码执行错误 → 回到 Executor
方法选择错误 → 回到 Planner
轻微格式问题 → 局部 Repair
```

这比统一“重新生成一次”更稳定，也更节省成本。

## 核心结论

Planner / Executor / Critic 的价值不在于把一个 Agent 拆成三个名字，而在于把**不确定推理、确定性执行、结果验证**分成三个可观测边界。

边界越清楚，系统越容易调试、评测和持续演进。
