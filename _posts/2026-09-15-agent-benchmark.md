---
layout: post
title: "Agent Benchmark：怎么设计真正能回归的任务集？"
subtitle: "一个好 Benchmark 不是几十条 Prompt，而是一套可重复、可分层、能定位回归来源的测试系统。"
date: 2026-09-15 18:40:00 +0800
series: "Agent Evaluation 与 Reliability"
series_key: evaluation-reliability
series_index: "02"
category: Tech
tags: [Agent, Evaluation, Benchmark, Reliability]
---

Agent 评测和普通聊天机器人评测最大的区别，是 Agent 不只输出文本，还会规划、调用工具、修改环境并产生副作用。

因此一个 Benchmark 不能只问：

> 最后答案像不像标准答案？

还要评估整个执行过程。

## 一个 Agent Task 至少需要哪些字段

```json
{
  "task_id": "deploy-001",
  "instruction": "修复配置并重启服务",
  "initial_state": {...},
  "allowed_tools": [...],
  "expected_artifacts": [...],
  "assertions": [...],
  "max_steps": 12
}
```

重点是 `initial_state` 和 `assertions`。如果环境每次都不同，两个版本之间就无法公平比较。

## Benchmark 要覆盖不同难度

可以分层：

```text
Level 1：单 Tool、短路径
Level 2：多 Tool、顺序执行
Level 3：需要 Planning
Level 4：异常恢复 / Replan
Level 5：多 Agent / 长链路
```

如果所有 Case 都很简单，完成率很高也说明不了系统可靠。

## 不只看 Completion Rate

常见指标可以包括：

- Task Success Rate；
- Step Success Rate；
- Tool Selection Accuracy；
- Invalid Tool Call Rate；
- Average Steps；
- Token / Cost；
- Latency；
- Retry Count；
- Safety Violation；
- Artifact Quality。

同样 90% 成功率，一个平均 5 步完成，一个平均 20 步绕圈，工程质量完全不同。

## 为什么需要可重放环境

如果任务依赖外部 API、文件系统或数据库，测试时最好提供 Sandbox / Mock / Snapshot。

例如：

```text
Before test
  ↓
Restore workspace snapshot
  ↓
Run Agent
  ↓
Check filesystem / DB / artifact
  ↓
Reset
```

这样每次回归都有相同起点。

## 任务集怎么避免“刷题”

如果 Agent Prompt 专门针对固定 Case 优化，会出现 Benchmark Overfitting。

因此可以保留：

- public dev set；
- hidden test set；
- 参数化变体；
- 新增真实 Badcase。

真实线上失败应该持续沉淀进回归集。

## 为什么要分模块统计

如果总成功率从 85% 降到 80%，只看一个数字几乎没法定位。

更好的 Dashboard 会拆：

```text
Retrieval failures     12
Planning failures       5
Tool failures           3
Validation failures     2
Timeouts                4
```

这样版本回归才真正可行动。

## 面试里怎么说

> Agent Benchmark 我会设计成可重复执行的任务集，每条 Case 固定初始环境、允许工具、预期 Artifact 和确定性 Assertion，不只看最终回答。指标会拆完成率、步骤数、工具选择、重试、成本和失败类型，并把线上 Badcase 持续沉淀成回归 Case，这样 Benchmark 才能真正驱动迭代。
