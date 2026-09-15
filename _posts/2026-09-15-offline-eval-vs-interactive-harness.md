---
layout: post
title: "无交互评测与真实交互 Harness，有什么本质差异？"
subtitle: "评测环境追求可重复，真实 Harness 需要应对用户补充信息、工具反馈和环境变化。"
date: 2026-09-15 18:45:00 +0800
series: "AI Coding 与 Agent Harness"
series_key: ai-coding-harness
series_index: "05"
category: Tech
tags: [AI-Coding, Agent-Harness, Evaluation, Benchmark]
---

真实 Agent Harness 往往允许交互：Agent 可以向用户追问、根据中间反馈调整计划，甚至等待人工确认。

但 Benchmark 为了可重复，通常希望一次任务在固定环境下自动跑完。

这两种环境天然存在差异。

## 为什么评测平台经常禁用交互

如果每次执行都需要真人回答：

- 无法大规模自动跑；
- 不同人的回答会改变结果；
- 两个模型版本不再公平可比；
- CI 无法无人值守执行。

所以评测环境通常要求：**任务信息在开始时就完整提供，运行过程中不能依赖真人。**

## 不是简单“改一句 Prompt”

Prompt 会明确告诉 Agent：

> 当前环境是非交互评测，不要等待用户输入。

但只改 Prompt 不够。

真实系统中的 `ask_user`、`request_confirmation` 等交互节点，在评测环境里还需要 Runtime 级处理。

例如：

```text
Agent requests clarification
          ↓
Eval Runtime
          ↓
预置 Context 中是否已有答案？
   ├─ Yes → 自动提供
   └─ No  → 标记 insufficient_context / fail
```

## 可以预先注入完整任务上下文

把真实交互里可能逐步获取的信息，在 Benchmark Case 中显式给出：

```yaml
instruction: fix deployment config
context:
  target_env: staging
  port: 8081
  allowed_scope: service-a
```

这样 Agent 不需要追问。

## 高风险确认怎么模拟

真实环境：

```text
Delete resource
  ↓
Human confirmation
```

评测环境可以通过预设 Policy：

```yaml
confirmation_policy:
  delete_test_resource: approved
  production_write: denied
```

Runtime 根据 Case 配置自动返回确定性结果。

## 交互能力本身也应该单独评测

非交互 Benchmark 不能完全代表真实 Harness。

因此可以把 Evaluation 拆成两套：

```text
Offline Benchmark
- 可重复
- 大规模回归
- 固定上下文

Interactive Evaluation
- 澄清能力
- Human-in-the-loop
- 动态环境变化
- 用户反馈适应
```

两者目标不同，不能用一套指标完全替代。

## 无交互环境会不会和线上差异很大

会有差异，但可以控制。

核心逻辑——Planning、Tool Use、Workflow、Validation——应该尽量保持一致；差异只放在 Interaction Adapter 层。

```text
Agent Core
   ↓
Interaction Interface
   ├─ Production → Human / UI
   └─ Evaluation → Deterministic Adapter
```

这样不会为了 Benchmark 维护一套完全不同的 Agent。

## 最大风险：Benchmark 比真实环境“更容易”

评测任务把信息一次性给全，可能比线上用户的模糊表达简单很多。

所以还要额外加入：

- 信息缺失 Case；
- 冲突条件 Case；
- 工具失败 Case；
- 环境变化 Case。

否则离线得分很高，线上仍可能表现差。

## 面试里怎么说

> 无交互评测的核心是为了可重复和自动回归，所以我会把真实环境中需要用户补充的信息预置到 Case Context，并在 Runtime 层给 `ask_user`、确认节点提供 Deterministic Adapter，而不是只靠改 Prompt。Agent Core 尽量和正式 Harness 一致，差异集中在 Interaction Layer，同时再保留一套交互式测试覆盖澄清和 Human-in-the-loop 能力。
