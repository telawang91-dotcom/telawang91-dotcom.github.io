---
layout: post
title: "Agent Memory：短期记忆、长期记忆与可控召回"
subtitle: "Memory 不是把所有历史都塞回 Prompt，而是决定什么信息值得被保存、检索和重新注入。"
date: 2026-09-15 18:32:00 +0800
series: "AI Agent 基础"
series_key: agent-foundations
series_index: "05"
category: Tech
tags: [Agent, Memory, Context-Engineering, RAG]
---

Agent 的 Memory 经常被简单理解成“保存聊天记录”。但工程上真正困难的问题不是怎么存，而是：**存什么、存多久、什么时候召回、召回多少、哪些信息不能被带入新的任务。**

## 先区分三种 Memory

### 1. Working Memory

当前任务正在使用的短期状态，例如：

- 用户目标；
- 当前 Plan；
- 已执行步骤；
- Tool Result；
- 中间 Artifact；
- Retry Count。

它通常直接存在 Agent State 或 Workspace 中，生命周期跟当前任务一致。

### 2. Episodic Memory

保存过去发生过的“经验”：

```text
任务是什么
→ 当时怎么规划
→ 调用了哪些工具
→ 哪一步失败
→ 最终怎么修正
```

这类 Memory 很适合作为 Few-shot 或 Planning RAG 的数据源。

### 3. Semantic Memory

保存更稳定的事实和知识，例如用户偏好、产品知识、业务规则、领域术语。这类内容通常更接近知识库。

## 为什么不能把全部历史都带回模型

全量历史会带来三个问题。

第一是 **Token 不断增长**。第二是 **旧信息污染当前任务**。第三是 **权限与隐私风险**：一个旧任务中的敏感信息不应该默认进入新任务。

所以 Memory 需要从“存储”升级成“检索系统”。

## 一个更合理的 Memory Pipeline

```text
New Event
  ↓
Memory Writer
  ↓
Importance / Privacy / TTL
  ↓
Memory Store
  ↓
Query → Retrieve → Filter → Rerank
  ↓
Selected Memories
  ↓
Prompt / Agent State
```

写入时就可以打上元数据：

```json
{
  "type": "episode",
  "task": "deploy service",
  "importance": 0.82,
  "scope": "project-a",
  "owner": "user-123",
  "ttl": "30d"
}
```

## Memory Retrieval 要看什么

不能只看向量相似度。常见过滤条件包括：

- 当前用户；
- 当前项目；
- 时间范围；
- Memory 类型；
- 权限；
- 是否已经过期；
- 是否与当前 Workflow State 匹配。

最终评分甚至可以写成：

```text
score = semantic_similarity
      + recency_weight
      + importance_weight
      + task_match
```

## Memory 和 RAG 的区别

底层技术可能都用向量检索，但数据来源不同。

RAG 更多检索外部知识；Memory 更多来自 Agent 自己过去的交互和执行轨迹。二者经常共用检索基础设施，但生命周期和权限模型不同。

## 什么内容不应该写入长期记忆

- 临时验证码；
- 密钥和 Token；
- 无价值的中间日志；
- 未验证的模型推测；
- 高敏感隐私信息；
- 一次性任务状态。

尤其不能把 LLM 的猜测自动沉淀成“用户事实”。

## 面试里怎么说

> 我会把 Memory 分成 Working、Episodic 和 Semantic 三层。Working Memory 管当前任务状态，Episodic Memory 沉淀执行经验，Semantic Memory 管长期事实。长期 Memory 不会全量塞回 Context，而是经过权限、时间、任务相关性和语义相关性过滤后再注入，核心是可控召回而不是无限记忆。
