---
layout: post
title: "总纲：Agent 的上下文为什么比 Prompt 更重要"
subtitle: "真正决定 Agent 质量的，往往不是一句 Prompt，而是系统在这一刻给模型看了什么。"
date: 2026-09-15 18:04:00 +0800
series: "RAG 与 Context Engineering"
series_key: rag-context
series_index: "00"
category: Tech
homepage: false
tags: [RAG, Context-Engineering, Retrieval, Agent]
---

很多 Agent 问题最后都会被归因成“Prompt 不够好”。但当系统进入长任务、多工具、多知识源场景以后，更常见的问题其实是：**模型拿到的上下文不对。**

## Prompt 只是上下文的一部分

模型一次调用真正看到的内容通常包括：

```text
System Instruction
+ User Goal
+ Retrieved Knowledge
+ Tool Schemas
+ Current State
+ Workspace Artifacts
+ Memory
+ Recent Tool Results
```

Context Engineering 关心的是：这些信息从哪里来、什么时候进入、优先级如何、哪些信息必须过滤，以及什么时候应该被压缩或丢弃。

## RAG 解决“外部知识怎么进来”

RAG 的基础链路是：

```text
Parse → Chunk → Index → Retrieve → Rerank → Context
```

但在 Agent 场景里，检索对象不一定只是文档。

它还可能包括：

- 历史成功计划；
- 失败轨迹；
- Tool 使用示例；
- Codebase 片段；
- 当前 Workspace Artifact；
- 项目级 Memory。

因此 Agent RAG 比问答 RAG 更接近“任务经验召回”。

## 为什么 Hybrid Search 很常见

关键词检索擅长精确实体、函数名、错误码；向量检索擅长语义近似。Agent 任务经常同时需要这两类能力。

因此常见工程路线是：

```text
BM25 ─┐
      ├→ RRF / Fusion → Rerank → Context
Vector┘
```

融合检索不是为了堆算法，而是减少单一检索方式的盲区。

## Context Engineering 比“扩大 Context Window”更重要

上下文窗口变大，不意味着应该把全部资料放进去。

过多内容会引入：

- 无关信息干扰；
- 冲突事实；
- Token 成本；
- 注意力稀释；
- 敏感信息越权暴露。

更合理的目标是：**最小充分上下文**。

## Workspace 与长期知识要分开

长期知识回答“这个项目通常是什么样”；Workspace 回答“这一次任务现在做到哪里”。

例如 Coding Agent 中：

```text
Codebase = 长期事实空间
Workspace = 当前任务状态空间
```

把两者混在一起，会让旧任务 Artifact 污染当前任务，也让检索难以判断时效性。

## Badcase 排查必须分层

“知识库有答案但没答对”不能直接归因给模型。

至少应该按链路检查：

```text
Parse
 ↓
Chunk
 ↓
Recall
 ↓
Fusion / Rerank
 ↓
Context Assembly
 ↓
Generation / Planning
```

只有知道问题发生在哪一层，优化才有意义。

## 权限也属于 Context Engineering

不是“检索到了”就一定应该给模型看。

企业系统中还需要在检索前后处理：

- 用户权限；
- 项目隔离；
- Metadata Filter；
- Tool 权限；
- 敏感字段脱敏。

所以 Retrieval 的最终目标不是 Top-K 最相关，而是**Top-K 相关且允许使用**。

## 这一系列怎么读

```text
RAG Basics
   ↓
Hybrid Search
   ↓
Badcase Debugging
   ↓
Planning RAG
   ↓
Workspace / Codebase
   ↓
Few-shot Retrieval
   ↓
Permission-aware RAG
```

前半部分解决“怎么找到”，后半部分解决“找到以后怎么安全、有效地进入 Agent Context”。

## 一句话总结

> Prompt Engineering 在优化“怎么说”，Context Engineering 在设计“模型这一刻到底知道什么”。对于复杂 Agent，后者通常更重要。
