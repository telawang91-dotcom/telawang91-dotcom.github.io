---
layout: post
title: "RAG Badcase：知识库有答案却检索不到，怎么排查？"
subtitle: "别一上来就换 Embedding；先把问题拆成入库、召回、排序、上下文和生成五层。"
date: 2026-09-15 18:35:00 +0800
series: "RAG 与 Context Engineering"
series_key: rag-context
series_index: "03"
category: Tech
tags: [RAG, Badcase, Retrieval, Evaluation]
---

RAG 面试里非常高频的一类问题是：

> 知识库里明明有答案，但模型就是答不出来，你怎么排查？

一个成熟的回答不应该是“调一下 Top-K”或者“换 Embedding 模型”，而是先把链路拆开。

## 第 1 层：答案到底有没有被正确入库

先确认原始文档是否真的进入知识库：

- 文件是否解析成功；
- OCR / PDF 解析是否丢行；
- 表格是否被打散；
- 标题层级是否保留；
- Chunk 是否包含完整答案。

很多所谓“检索不到”，本质是**答案从来没有以可检索形式存在过**。

## 第 2 层：Chunk 切得是否合理

典型问题：

```text
Chunk A：问题背景
Chunk B：关键结论
Chunk C：限制条件
```

如果用户问题依赖 B + C，而切分把它们拆开，单个 Chunk 可能都不够相关。

可以检查：

- Chunk size；
- overlap；
- 是否按标题/段落切；
- 是否需要 parent-child retrieval。

## 第 3 层：召回有没有拿到正确候选

直接记录 Query 对应的 Top-K：

```text
Query
Top1: ...
Top2: ...
Top3: ...
```

如果正确答案完全不在 Top-K，问题在 Retrieval；如果已经召回但最终没用上，问题在后面。

召回层常见原因：

- Query 太口语；
- Embedding 对专有名词不敏感；
- Metadata Filter 把正确文档过滤掉；
- Top-K 太小；
- 关键词信息被向量检索忽略。

这时可以尝试 Query Rewrite、Hybrid Search 或扩宽召回。

## 第 4 层：Rerank 有没有把正确答案压下去

有时正确 Chunk 在候选里，但 Reranker 把它排到后面。

所以要同时记录：

```text
retrieval_rank
rerank_score
final_rank
```

否则你只看最终 Top 5，很难知道是哪一步出了问题。

## 第 5 层：Context Assembly 有没有截断

正确片段即使排进 Top-K，也可能在拼 Prompt 时被截断。

常见原因：

- 文章太长；
- 系统 Prompt 占用太多 Token；
- 多路检索结果重复；
- 历史对话过长。

因此 Context Builder 也需要可观测。

## 最后一层才是 Generation

如果正确证据已经稳定出现在最终 Context，但模型仍答错，这时才应该考虑：

- Prompt 是否要求引用证据；
- 模型是否遵循 Context；
- 是否存在冲突知识；
- 是否需要结构化输出；
- 是否需要更强模型。

## 最实用的 Badcase 表

我会给每个失败样本标注：

```text
parse_error
chunk_error
query_error
retrieval_miss
rerank_error
context_truncation
generation_error
permission_filter_error
```

持续统计以后，就能知道系统主要瓶颈到底在哪。

## 面试里怎么说

> 知识库有答案但检索不到，我不会直接换模型，而是按 Parse → Chunk → Retrieval → Rerank → Context → Generation 分层排查。先看正确答案有没有被正确入库，再看是否进入召回候选、Rerank 后排名和最终 Context，最后才判断是不是生成模型的问题。这样 Badcase 才能定位到具体模块。
