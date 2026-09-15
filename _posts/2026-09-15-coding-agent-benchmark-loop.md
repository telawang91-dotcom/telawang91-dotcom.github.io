---
layout: post
title: "Benchmark 驱动 Coding Agent：怎么让系统持续迭代而不是靠感觉调 Prompt？"
subtitle: "真正的优化闭环应该从 Badcase 到回归集，再从回归结果反推 Context、Planning、Tool 和 Guardrail。"
date: 2026-09-15 18:41:00 +0800
series: "AI Coding 与 Agent Harness"
series_key: ai-coding-harness
series_index: "07"
category: Tech
tags: [AI-Coding, Benchmark, Evaluation, Harness]
---

Coding Agent 很容易进入一种低效迭代：发现一个问题，改 Prompt，再挑几个例子人工测试。如果没有稳定 Benchmark，很难知道改动到底是整体提升，还是只修好当前案例。

## Benchmark 应该覆盖什么

任务集不能只包含简单补代码，还要覆盖代码理解、跨文件修改、测试修复、配置变更、脚本生成和异常恢复等不同任务类型。

每个任务最好保存输入、代码环境、期望产物、关键 Trace 和确定性验收条件。

## 评测不能只看最终答案

Coding Agent 的“成功”至少要看：任务是否完成、修改范围是否合理、测试是否通过、工具调用是否正确、是否越权、成本和时延是否可接受。

## Trace 让 Benchmark 变得可解释

如果新版本完成率下降，仅看分数无法知道原因。Trace 可以区分：上下文没召回、计划拆错、工具选错、执行失败还是验证误判。

这使 Benchmark 从排行榜变成诊断工具。

## Badcase 怎么进入闭环

```text
Production / Eval Badcase
        ↓
Root Cause Classification
        ↓
Fix Context / Planner / Tool / Guardrail
        ↓
Add Regression Case
        ↓
Full Benchmark
        ↓
Release Decision
```

每次线上高价值问题都应该沉淀成回归任务，避免同类问题重复出现。

## 为什么要版本化 Benchmark

代码库、工具和 Agent 能力都会变化。Benchmark 也需要版本管理，记录任务定义、环境、评分逻辑和基线结果，否则不同时间的分数不可比较。

## 面试回答重点

我会用 Benchmark 驱动 Coding Agent 迭代，而不是单点调 Prompt。每个 Badcase 先通过 Trace 定位到 Context、Planning、Tool 或 Execution，再做对应修复，并加入回归集。这样每次版本升级都能量化判断是整体提升还是局部过拟合。
