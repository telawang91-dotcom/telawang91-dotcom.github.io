---
layout: post
title: "工程实践：为什么结构化 Plan + Executor 更适合可评测 Agent？"
subtitle: "自然语言计划容易生成，结构化计划更容易执行、约束和比较。"
date: 2026-09-15 20:20:00 +0800
series: "Agent Project Case Studies"
series_key: project-cases
series_index: "08"
category: Tech
tags: [Agent, Planning, Executor, Evaluation]
---

很多 Agent 的计划只是几句自然语言：先做 A，再做 B，最后做 C。对人来说足够，但对执行系统和评测系统来说，这种计划太模糊。

如果希望 Agent 能稳定调用工具，并且后续能判断“计划本身错了，还是执行错了”，更适合把 Plan 变成结构化 IR。

## 结构化 Plan 长什么样

一个简化例子：

```json
{
  "goal": "完成目标任务",
  "steps": [
    {
      "id": "s1",
      "action": "inspect",
      "tool": "tool_a",
      "args": {},
      "preconditions": [],
      "expected": "state_a"
    },
    {
      "id": "s2",
      "action": "execute",
      "tool": "tool_b",
      "depends_on": ["s1"],
      "expected": "state_b"
    }
  ]
}
```

关键不是字段名称，而是步骤、依赖、工具和预期结果都能被程序读取。

## Planner 和 Executor 的边界更清楚

Planner 输出“应该做什么”；Executor 只负责把结构化步骤调度成真实 Tool Call。

这样 Executor 可以在不理解全部业务语义的情况下做确定性检查：

- 工具是否存在；
- 参数是否合法；
- 前置条件是否满足；
- 依赖步骤是否完成；
- 执行预算是否耗尽。

## 为什么更容易处理循环

自由 Agent 很容易陷入“失败 → 再试一次 → 继续失败”的循环。

结构化执行可以设置显式预算：

```text
step_retry_budget
replan_budget
total_tool_budget
```

超过预算就进入 Replan 或终止，而不是让模型无限自我反思。

## 为什么更容易评测

如果标准答案也可以被解析成结构化动作序列，就能比较：

```text
Precondition
Action Sequence
Final State
```

例如两条计划自然语言表述不同，但只要关键动作和最终状态一致，就可以视为功能等价。

反过来，如果最终失败，也能知道：

- Planner 是否选择了错误动作；
- Executor 是否执行失败；
- 工具返回是否异常。

## Trace 也会更干净

结构化 Plan 让每一步都有 step_id，于是 Trace 可以自然关联：

```text
plan.step_3
  → tool.call
  → observation
  → assertion
```

这对离线回放和 Badcase 分析非常有价值。

## 什么时候不需要这么重

如果任务只有一两次简单工具调用，直接 Function Calling 就足够。

只有当任务开始出现长链路、依赖、重试、预算、并行和可评测需求时，结构化 Plan 的价值才明显。

## 核心结论

结构化 Plan 不是为了让输出“看起来更工程化”，而是把 LLM 的计划变成 Runtime 能够**执行、验证、恢复和比较**的中间表示。

当 Agent 要从一次性生成走向可回归系统时，这个中间层非常关键。
