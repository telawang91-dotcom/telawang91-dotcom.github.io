---
layout: post
title: "Agent Planning 的 RAG，为什么和普通问答 RAG 不一样？"
subtitle: "检索目标从“找到答案”变成“找到下一步怎么做”。"
date: 2026-09-08 10:00:00 +0800
series: "RAG 与 Context Engineering"
series_key: rag-context
series_index: "04"
category: Tech
tags: [RAG, Agent, Planning, Retrieval]
---

普通问答 RAG 的目标通常是找到支持答案的知识片段；Agent Planning 的 RAG 更像是在检索**可复用的任务经验**：相似任务、可行路径、工具组合、前置条件和失败模式。

## 检索对象发生了变化

问答 RAG 常见文档是产品说明、制度、手册；Planning RAG 更适合沉淀结构化 Few-shot：任务描述、环境特征、计划步骤、工具调用、执行结果以及失败原因。

## 为什么需要 Hybrid Retrieval

任务文本既可能包含非常强的关键词，也可能只是语义相近。因此工程上通常会把关键词检索和向量检索并行执行，再用 RRF 等方法进行融合。

## 召回错误样本比召回不到更危险

Planning 场景如果召回了一个“看起来像但前提不同”的计划，可能直接让 Agent 执行错误工具。因此除了相似度，还要检查任务约束、环境状态、工具可用性和结果置信度。

## 高置信模板与低置信降级

高置信且条件一致的历史计划可以作为强 Few-shot；相似度一般时只提供片段作为参考；低置信时退回通用 Planner，而不是强行复用错误样本。

## 数据闭环

Planning RAG 的最大价值不是第一次检索，而是让 Badcase 进入数据闭环：失败任务经过人工修正后沉淀为新的高质量样本，后续任务可以直接受益，而不一定需要重新微调模型。
