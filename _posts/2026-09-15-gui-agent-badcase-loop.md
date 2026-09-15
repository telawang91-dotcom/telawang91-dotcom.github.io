---
layout: post
title: "GUI Agent：Badcase 怎么从一次失败变成回归资产？"
subtitle: "知识覆盖、路径检索、模型规划、工具执行，必须分层看。"
date: 2026-09-15 20:10:00 +0800
series: "Agent Project Case Studies"
series_key: project-cases
series_index: "07"
category: Tech
tags: [GUI-Agent, Badcase, Evaluation, Retrieval]
---

GUI Agent 失败时，最没价值的结论是“模型不稳定”。因为一个点击任务从自然语言到真实执行，中间至少经过知识覆盖、检索、规划和工具执行四层，任何一层都可能导致失败。

## 第一层：知识覆盖

先问最基础的问题：系统里到底有没有这个功能？

如果功能树里缺少对应页面或动作，再强的 Planner 也无法规划出正确路径。

这类 Badcase 应该归为 Knowledge Coverage，而不是 Retrieval Failure。

## 第二层：路径检索

如果知识库里有正确功能，但 Top-K 没召回，就需要看：

- 关键词是否不一致；
- 向量语义是否偏移；
- metadata 是否过滤错；
- 融合排序是否把正确路径压下去；
- Top-K 是否过小。

只有这一层有问题，才应该优化检索。

## 第三层：模型规划

如果正确路径已经进入上下文，Planner 仍然选择错误节点，问题才真正落到 Planning。

此时可以分析：

- 候选太多导致干扰；
- 路径描述不够区分；
- 当前页面状态没有被显式提供；
- Few-shot 与当前任务前提不一致；
- 模型没有遵守约束。

## 第四层：Tool Execution

有时候计划完全正确，但实际执行失败，例如：

- 控件定位变化；
- 点击没有生效；
- 页面加载超时；
- 权限弹窗打断路径；
- ADB 或自动化工具返回异常。

这类问题应该修工具或执行策略，而不是继续调 Prompt。

## Badcase 最终要进入回归集

修好一次还不够。

每个重要失败都应该形成：

```text
Input
Expected Path
Retrieved Candidates
Planned Actions
Execution Trace
Final Result
Failure Layer
Fix
```

然后加入回归测试。否则同类问题很容易在后续版本重新出现。

## 为什么分层特别重要

如果把所有失败都归到模型，团队会不断换 Prompt、换模型，却不一定改善真正的问题。

分层以后，优化动作会更具体：

```text
Knowledge → 补知识
Retrieval → 调召回/融合/过滤
Planning → 调上下文/约束/Few-shot
Execution → 修 Tool / Retry / Observation
```

## 核心结论

Badcase 的价值不在于解释“这次为什么失败”，而在于把失败转成**可分类、可修复、可回归的数据资产**。

这也是 Agent 系统从 Demo 走向稳定工程最重要的迭代机制之一。
