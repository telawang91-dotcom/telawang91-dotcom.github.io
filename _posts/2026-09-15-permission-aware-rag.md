---
layout: post
title: "权限 RAG：最小权限、元数据过滤与越权防护怎么做？"
subtitle: "RAG 不只是检索相关内容，还必须保证召回结果属于当前用户有权看到的数据范围。"
date: 2026-09-15 18:39:00 +0800
series: "RAG 与 Context Engineering"
series_key: rag-context
series_index: "07"
category: Tech
tags: [RAG, Security, Access-Control, Agent]
---

企业 RAG 最危险的一类问题，不是“没搜到”，而是**搜到了不该让当前用户看到的内容**。

如果知识库里同时有公开文档、团队内部文档、财务资料和管理层资料，那么单纯根据向量相似度召回是不够的。

## 权限过滤应该发生在检索层

一个错误思路是：

```text
先召回所有文档
  ↓
交给 LLM
  ↓
Prompt 里告诉模型不要泄露
```

这已经太晚了。模型只要看到了敏感内容，就存在泄露风险。

更安全的流程：

```text
User Identity
   ↓
Authorization Policy
   ↓
Allowed Scope
   ↓
Metadata Filter
   ↓
Retrieval
   ↓
Rerank
   ↓
LLM
```

## 文档入库时就要带权限元数据

例如：

```json
{
  "doc_id": "finance-2026-q3",
  "department": "finance",
  "visibility": "internal",
  "roles": ["finance_manager"],
  "owner": "team-finance"
}
```

检索时根据当前身份构造过滤条件，而不是先取结果再删。

## RBAC 和 ABAC 怎么选

RBAC 基于角色：

```text
admin
manager
employee
```

实现简单，适合权限结构稳定的场景。

ABAC 基于属性：

```text
user.department == document.department
AND user.region == document.region
AND document.classification <= user.clearance
```

更灵活，适合复杂企业数据。

## Agent 场景还要防 Tool 越权

即使知识库权限做对了，Agent 仍可能调用一个高权限 Tool 获取数据。

所以权限应该同时覆盖：

```text
Knowledge Access
Tool Access
Action Access
```

例如 Support Agent 可以检索订单摘要，但不能调用退款 Tool；普通员工可以检索制度文档，但不能读取薪资数据。

## 检索缓存也可能泄露数据

如果缓存 Key 只有 Query：

```text
"季度奖金政策"
```

那么管理员第一次查询后的敏感结果，可能被普通员工命中同一缓存。

正确的 Cache Key 至少应该包含：

```text
query + user_scope + permission_version
```

## 日志同样要脱敏

不要为了 Debug 把所有检索结果原文写进日志。尤其是：

- 身份信息；
- 财务数据；
- Token；
- 用户隐私；
- 私有代码。

Trace 可以保留 doc_id、score、过滤规则和摘要，而不是无脑保存全文。

## 面试里怎么说

> 权限 RAG 的原则是“先授权，再检索”，而不是检索完以后靠 Prompt 防泄露。我会在文档入库时记录角色、部门、owner、classification 等权限元数据，查询时先根据当前身份生成 Allowed Scope，再作为 Metadata Filter 参与 Retrieval。Agent 场景还需要让 Tool 权限和知识权限保持一致，并注意缓存和 Trace 的二次泄露。
