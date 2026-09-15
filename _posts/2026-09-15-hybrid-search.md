---
layout: post
title: "Hybrid Search：关键词、向量与 RRF 为什么要一起用？"
subtitle: "语义检索擅长找相似意思，关键词检索擅长抓精确实体，真正稳的系统通常需要两者融合。"
date: 2026-09-15 18:34:00 +0800
series: "RAG 与 Context Engineering"
series_key: rag-context
series_index: "02"
category: Tech
tags: [RAG, Hybrid-Search, BM25, Vector-Search, RRF]
---

只用向量检索，很多时候“看起来很智能”，但遇到订单号、函数名、错误码、产品型号这类精确实体时容易失误。只用关键词检索，又很难处理同义表达和自然语言改写。

所以很多 RAG 系统会采用 **Hybrid Search**：关键词检索和向量检索并行，再融合排序。

## 两种检索各自擅长什么

BM25 / Keyword Search 擅长：

- 专有名词；
- 错误码；
- ID；
- 函数名；
- 精确短语。

Vector Search 擅长：

- 同义表达；
- 自然语言改写；
- 意图相似；
- 长文本语义。

例如用户问：

> “支付失败提示 E1042 怎么处理？”

关键词检索很容易抓到 `E1042`，而向量检索可以补充“支付失败”“交易异常”等语义相近内容。

## 最简单的 Hybrid Search

```text
Query
 ├─ BM25 → rank_keyword
 └─ Vector → rank_vector
            ↓
          Fusion
            ↓
         Top-K
```

但两个检索器的原始分数通常不能直接相加，因为量纲不同。

## RRF 为什么常用

Reciprocal Rank Fusion 不依赖原始分数，只看排名。

一个常见形式是：

```text
RRF(d) = Σ 1 / (k + rank_i(d))
```

如果一篇文档同时在关键词结果和向量结果中排得很靠前，它最终的融合分数会更高。

优点是实现简单，而且对不同检索器的分数量纲不敏感。

## 融合之后为什么还要 Rerank

Hybrid Search 解决“召回尽量别漏”，Rerank 解决“真正相关的排到前面”。

常见链路：

```text
BM25 Top 20
Vector Top 20
     ↓
RRF Merge
     ↓
Top 20 Candidates
     ↓
Cross-Encoder / LLM Rerank
     ↓
Top 5 Context
```

这比直接让向量库返回 Top 5 稳定很多。

## Agent 场景为什么更需要 Hybrid Search

Agent Planning 检索的不只是知识，还可能是历史计划、工具轨迹和错误样本。

这类数据经常包含：

- Tool Name；
- API Path；
- 参数名；
- 状态码；
- 任务语义。

既有精确 token，也有自然语言，因此 Hybrid Search 特别合适。

## 面试里怎么说

> 我一般不会把关键词检索和向量检索看成二选一。关键词适合精确实体，向量适合语义相似，工程上可以并行召回，再用 RRF 做 rank-level 融合，最后 Rerank。这样对错误码、函数名这类精确信息和自然语言意图都更稳。
