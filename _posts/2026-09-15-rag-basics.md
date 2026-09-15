---
layout: post
title: "RAG 基础：Chunk、Embedding、Vector Search 到底怎么串起来？"
subtitle: "RAG 的核心不是向量数据库，而是把正确的信息在正确的时机送进模型上下文。"
date: 2026-09-15 18:33:00 +0800
series: "RAG 与 Context Engineering"
series_key: rag-context
series_index: "01"
category: Tech
tags: [RAG, Embedding, Vector-Search, Chunking]
---

RAG 的基本目标很简单：模型不知道的信息，不直接要求它“想出来”，而是先从外部知识库里找相关内容，再把检索结果交给模型生成答案。

典型链路是：

```text
Document
  ↓
Parse / Clean
  ↓
Chunk
  ↓
Embedding
  ↓
Vector Store

User Query
  ↓
Embedding
  ↓
Top-K Retrieval
  ↓
Context Assembly
  ↓
LLM
```

## Chunk 为什么是第一道关键设计

Chunk 太大，会把大量无关内容一起召回；Chunk 太小，又可能丢失上下文。

工程上一般会同时考虑：

- 文档结构；
- 段落和标题边界；
- Token 长度；
- overlap；
- 业务语义完整性。

比如 API 文档，比起固定每 500 Token 切一刀，更适合按“接口 + 参数 + 返回值”形成一个语义 Chunk。

## Embedding 在做什么

Embedding 把文本映射成向量，使语义接近的文本在向量空间中距离更近。

查询时：

```text
query → embedding → nearest neighbors
```

但 Embedding 并不是“理解一切”。它对精确 ID、数字、专有名词、代码符号等场景可能不如关键词检索稳定。

## Top-K 不是越大越好

召回 20 段不一定比召回 5 段好。Top-K 太大可能导致：

- Context 变长；
- 噪声增加；
- 模型被冲突信息干扰；
- 成本升高。

常见做法是先做较宽召回，再通过 Rerank 缩小到真正相关的少量上下文。

## Metadata Filter 很重要

向量相似度只回答“语义像不像”，但很多业务问题还需要确定性条件：

```text
department = finance
version = v3
permission = manager
language = zh
```

因此检索通常是：

```text
Metadata Filter
    +
Semantic Retrieval
    ↓
Candidate Chunks
```

## RAG 真正的难点在 Retrieval

生成模型往往不是第一个应该排查的地方。

如果知识库明明有答案，但最终回答错了，应该按链路定位：

1. 文档有没有正确解析；
2. Chunk 是否包含答案；
3. Query 是否表达清楚；
4. 检索有没有召回；
5. Rerank 有没有把正确片段排前；
6. Context 是否被截断；
7. 最后才看模型生成。

## 面试里怎么说

> RAG 的标准流程是文档解析、Chunk、Embedding、索引、Query Retrieval、Rerank、Context Assembly 和生成。真正影响效果的通常不是“用了哪个向量库”，而是 Chunk 策略、检索召回率、元数据过滤、Rerank 和上下文组装。
