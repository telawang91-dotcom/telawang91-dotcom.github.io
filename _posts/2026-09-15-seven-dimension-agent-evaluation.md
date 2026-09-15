---
layout: post
title: "七维评测：为什么 Agent 不能只看任务完成率？"
subtitle: "完成只是第一维，可靠性还取决于规划、工具、效率、稳定性、安全与可恢复性。"
date: 2026-09-15 18:35:00 +0800
series: "Agent Evaluation 与 Reliability"
series_key: evaluation-reliability
series_index: "05"
category: Tech
tags: [Evaluation, Agent, Benchmark, Reliability]
---

如果一个 Agent 的任务完成率是 85%，这个数字有用，但远远不够。它没有告诉你失败发生在哪，也没有告诉你“完成的那 85%”是不是付出了巨大的 token、工具调用和不稳定成本。

更工程化的做法，是把评测拆成多个维度。

## 1. Task Completion

最终任务是否达到目标。它是最重要的结果指标，但不能解释过程质量。

## 2. Planning Quality

计划是否覆盖关键步骤、依赖是否正确、是否出现明显绕路或遗漏。对于长任务，很多失败实际上在执行前就已经埋下。

## 3. Tool Correctness

工具选择、参数和调用顺序是否正确。即使最终侥幸成功，错误 Tool Call 仍然说明系统不稳定。

## 4. Efficiency

关注 token、LLM 调用次数、Tool Call 次数、执行时延和不必要重试。Agent 不能只追求“做成”，还要避免无限试错。

## 5. Robustness

输入轻微变化、工具短暂失败、上下文缺失时，系统能否保持稳定表现，而不是一次 Benchmark 成功就结束。

## 6. Safety & Compliance

是否越权、是否执行高风险操作、是否泄露不该进入上下文的数据，以及 HITL 是否在正确位置触发。

## 7. Recoverability

遇到失败时能不能 Retry、Replan、Rollback、Resume，而不是整个任务从头重跑或直接崩溃。

## 七维不是固定公式

不同系统可以调整维度。真正重要的是：**把“成功率”拆成可以定位和优化的工程指标。**

例如 Coding Agent 可以额外强调测试通过率和代码质量，GUI Agent 可以强调路径命中率和动作正确率。

## 聚合分数要小心

可以做总分方便版本对比，但不要只保留一个加权分数。因为两个版本可能总分相同，一个是效率差，一个是安全差，工程决策完全不同。

## 面试时可以怎么讲

我的评测思路不会只看任务完成率，而会从结果、规划、工具、效率、稳定性、安全和恢复能力多个维度做拆解。这样 Benchmark 才能真正指导 Badcase 定位和版本迭代，而不只是给模型打一个分。
