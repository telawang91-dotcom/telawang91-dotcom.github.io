---
layout: post
title: "Tool Schema 与 Tool Router：工具多了以后怎么办？"
subtitle: "几十个工具全部塞进 Context，不只是浪费 Token，也会显著增加选错工具的概率。"
date: 2026-09-15 18:31:00 +0800
series: "AI Agent 基础"
series_key: agent-foundations
series_index: "04"
category: Tech
tags: [Agent, Tool-Use, Function-Calling, MCP, Routing]
---

当 Agent 只有 3 个工具时，最简单的方法是把所有 Tool Schema 都交给模型。但工具增长到几十甚至上百个后，这种做法会迅速遇到问题：上下文变长、工具含义互相干扰、模型选错工具、权限边界难以控制。

所以工程上通常需要两层能力：**Tool Schema 设计**和 **Tool Router**。

## Tool Schema 不是接口文档的复制

一个 Tool Schema 的目标，是帮助模型完成正确选择，而不是完整描述所有实现细节。

好的 Schema 一般包含：

- 清晰的工具名称；
- 面向模型的 description；
- 尽量小的参数集合；
- 强约束类型；
- 枚举而不是自由文本；
- 明确失败语义。

例如：

```json
{
  "name": "query_order",
  "description": "根据订单 ID 查询订单详情；仅用于已知订单 ID 的精确查询，不用于搜索用户历史订单",
  "parameters": {
    "type": "object",
    "properties": {
      "order_id": {"type": "string"}
    },
    "required": ["order_id"]
  }
}
```

这里最有价值的是“**不用于什么**”。工具之间边界越清楚，模型越稳定。

## 为什么工具越多，准确率反而可能下降

模型在 Tool Selection 阶段实际上在做一个语义分类问题。

当工具数量不断增加，尤其是存在很多语义接近的 Tool 时，会出现：

- `search_user` 和 `get_user` 混淆；
- `run_command` 和 `run_script` 混淆；
- 多个数据库查询 Tool 语义重叠；
- 低频工具占据大量 Context。

因此并不是“工具越全越好”，而是应该只暴露**当前任务真正可能需要的工具集合**。

## Tool Router 的基本思路

可以先根据任务做一级路由：

```text
User Task
   ↓
Tool Router
   ├─ Search Tools
   ├─ Coding Tools
   ├─ Database Tools
   ├─ File Tools
   └─ High-risk Tools
         ↓
   Selected Tool Schemas
         ↓
        LLM
```

Router 可以有多种实现：

1. **规则路由**：根据任务类型、用户角色和当前状态过滤；
2. **Embedding 检索**：把工具 description 向量化，只召回 Top-K；
3. **小模型分类**：先预测工具类别；
4. **层级工具树**：先选 namespace，再选具体 Tool；
5. **MCP Server 分组**：按服务域动态发现工具。

## Tool Retrieval 和普通 RAG 很像

工具很多时，本质上可以把 Tool Schema 当成一种特殊文档：

```text
Task Query
   ↓
Retrieve relevant tool descriptions
   ↓
Top-K Tool Schemas
   ↓
LLM Tool Selection
```

但 Tool Retrieval 比普通 RAG 更敏感，因为召回错误不只是回答质量下降，还可能触发错误操作。

所以通常要加：

- namespace 过滤；
- 权限过滤；
- 当前 Workflow State 过滤；
- 风险等级过滤。

## 权限过滤应该发生在 Router 之前

不要把用户无权调用的高风险工具展示给模型，然后只期待 Prompt 告诉它“不要调用”。

更稳妥的是：

```text
All Tools
  ↓
RBAC / Policy Filter
  ↓
State Filter
  ↓
Semantic Router
  ↓
LLM
```

模型根本看不到无权限工具，越权概率自然更低。

## 敏感 Tool 要多一层确认

像删除数据、发送邮件、执行 Shell、支付等操作，即使模型选对了工具，也不应该马上执行。

常见流程：

```text
LLM proposes tool call
        ↓
Policy Engine
        ↓
Risk = High ?
   ├─ No → Execute
   └─ Yes → Human Confirmation → Execute
```

## 面试里怎么说

> 工具数量少时可以把 Schema 全量放进模型上下文，但工具规模上来以后我会做 Tool Router：先按权限和 Workflow State 做确定性过滤，再用语义检索或分类选出 Top-K Tool，最后交给 LLM 做精确选择。这样既减少 Token，也能降低相似工具之间的误选率。
