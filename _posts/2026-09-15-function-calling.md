---
layout: post
title: "Function Calling：模型到底是怎么学会调用工具的？"
subtitle: "它不是让模型直接执行函数，而是让模型生成一份结构化调用意图。"
date: 2026-09-15 18:30:00 +0800
series: "AI Agent 基础"
series_key: agent-foundations
series_index: "02"
category: Tech
tags: [Agent, Function-Calling, Tool-Use, JSON-Schema]
---

很多人第一次接触 Function Calling，会误以为“LLM 可以直接运行代码”。其实模型本身通常只负责两件事：**理解用户意图**，以及**生成一个符合约束的工具调用请求**。真正执行函数的是模型外部的 Agent Runtime。

## 一次 Tool Call 到底经历什么

最典型的链路是：

```text
User
  ↓
LLM + Tool Schemas
  ↓
选择 Tool + 生成参数
  ↓
Runtime 校验参数
  ↓
执行真实函数 / API
  ↓
Tool Result
  ↓
再次交给 LLM
  ↓
Final Answer
```

模型看到的不是 Python 函数对象，而是一份描述工具能力的 Schema。例如：

```json
{
  "name": "get_weather",
  "description": "查询指定城市天气",
  "parameters": {
    "type": "object",
    "properties": {
      "city": {"type": "string"},
      "date": {"type": "string"}
    },
    "required": ["city"]
  }
}
```

模型输出的也不是函数执行结果，而更像：

```json
{
  "name": "get_weather",
  "arguments": {
    "city": "深圳",
    "date": "today"
  }
}
```

之后 Runtime 才真正执行 `get_weather(...)`。

## 为什么 Schema 质量很重要

工具选择错误，很多时候不是模型“不聪明”，而是 Tool Schema 写得含糊。

一个好 Schema 至少需要明确：

- 工具到底解决什么问题；
- 什么情况下应该调用；
- 什么情况下不应该调用；
- 参数的类型、枚举和必填项；
- 参数之间有没有依赖关系；
- 返回结果是什么结构。

例如同时存在 `search_docs` 和 `search_web`，如果两个 description 都写成“搜索信息”，模型很难稳定选择。更好的描述应该体现数据来源、适用范围和新鲜度差异。

## Tool Call 为什么经常需要多轮

真实任务通常不是一次调用结束。例如：

```text
查找订单
  ↓
get_order(order_id)
  ↓
发现需要用户身份
  ↓
get_user(user_id)
  ↓
检查退款条件
  ↓
refund_order(order_id)
```

所以 Agent Runtime 本质上是一个循环：

```python
while not finished:
    response = llm(messages, tools)
    if response.has_tool_call:
        result = execute(response.tool_call)
        messages.append(result)
    else:
        return response.text
```

真正工程化时，还会加入最大轮数、超时、预算、权限、重试和人工确认。

## 参数校验应该放在哪里

不要完全信任模型生成的参数。Runtime 在执行前应该做确定性校验：

1. JSON 是否能解析；
2. 是否符合 JSON Schema；
3. 必填字段是否存在；
4. 类型和枚举是否合法；
5. 业务约束是否满足；
6. 当前 Agent 是否有权限调用。

这也是一个重要原则：**模型负责语义选择，程序负责确定性约束。**

## Function Calling 和 Agent 的关系

Function Calling 只是 Agent 的一个基础能力。真正完整的 Agent 还需要：

- 状态管理；
- Planning；
- Memory / Context；
- Workflow；
- Tool Runtime；
- Evaluation；
- Guardrail。

因此“支持 Function Calling”并不等于“已经有了 Agent 系统”。

## 面试里怎么一句话说清楚

> Function Calling 本质上是让模型根据 Tool Schema 生成结构化的工具调用意图，真正的函数执行发生在模型外部 Runtime。工程上最关键的是 Tool Schema、参数校验、多轮 Tool Call、权限和失败处理，而不是单纯让模型返回一个函数名。
