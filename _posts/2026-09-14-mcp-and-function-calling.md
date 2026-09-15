---
layout: post
title: "MCP：为什么有 Function Calling 还需要协议层？"
subtitle: "Function Calling 解决模型怎么调用工具，MCP 解决工具怎么被标准化地提供出来。"
date: 2026-09-14 09:00:00 +0800
series: "AI Agent 基础"
series_key: agent-foundations
series_index: "03"
category: Tech
tags: [Agent, MCP, Function-Calling, Tool-Use]
---

刚开始做 Agent 时，很容易把 MCP 和 Function Calling 看成两种竞争方案。实际上它们解决的是**不同层级的问题**。

Function Calling 更接近模型接口：模型根据一组 Tool Schema，输出“我要调用哪个工具、参数是什么”。MCP 更接近工具接入协议：一个客户端如何发现远端有哪些 Tool、资源和 Prompt，如何调用它们，以及如何统一通信方式。

## Function Calling 在解决什么

假设系统给模型两个工具：

```json
{
  "name": "get_weather",
  "parameters": {
    "city": "string"
  }
}
```

模型并不会真的执行天气查询。它只是输出一个结构化意图：

```json
{
  "name": "get_weather",
  "arguments": {"city": "Shenzhen"}
}
```

真正的执行仍然由 Agent Runtime 完成。

所以 Function Calling 的核心价值是：**让自然语言模型输出可执行的结构化 Tool Call。**

## MCP 多解决了哪一层

如果只有三个内部工具，直接写 Python 函数再把 Schema 塞给模型完全够用。

问题出现在工具越来越多、来自不同团队甚至不同服务的时候。每个 Agent 都自己维护一套 API Client、鉴权方式、Schema 和错误处理，会迅速失控。

MCP 把这一层标准化：

```text
Agent / LLM Client
        │
        │ MCP
        ↓
MCP Server
  ├─ tools/list
  ├─ tools/call
  ├─ resources
  └─ prompts
        │
        ↓
DB / Git / Browser / Internal Service
```

Client 不需要提前把每个工具写死在业务代码里，而是可以通过协议发现能力。

## tools/list 和 tools/call

可以把它理解成两个最核心动作：

- `tools/list`：Server 告诉 Client “我有哪些工具、参数 Schema 是什么”。
- `tools/call`：Client 按标准格式请求 Server 执行某个工具。

模型仍然可以通过 Function Calling 做“选工具”这件事，只不过 Tool Schema 的来源不再一定是业务代码手写，而可能来自 MCP Server。

## 为什么不是把所有 MCP Tool 都塞给模型

几十个工具还好，上百个工具全部塞 Context 会有三个问题：Token 浪费、工具混淆、选择准确率下降。

更合理的做法通常是分层路由：

```text
User Task
   ↓
Tool Domain Router
   ↓
筛选相关 MCP Server / Tool Set
   ↓
LLM Function Calling
   ↓
Tool Execution
```

也就是说 MCP 解决“能力供应”，Agent Runtime 仍然需要解决“能力选择”。

## 权限和安全边界

协议标准化并不等于天然安全。工程上仍然需要：

1. Server 侧做认证和授权；
2. Agent 按角色只暴露最小 Tool Set；
3. 写操作、删除操作等敏感 Tool 增加人工确认；
4. 参数进入真实系统前再次做 Schema 和业务校验；
5. 记录 Tool Call Trace，便于审计和复盘。

## 一句话区分

面试里我会这样回答：

> Function Calling 是模型“表达工具调用意图”的机制；MCP 是 Agent 系统“标准化接入和发现外部能力”的协议。前者解决模型到工具调用这一跳，后者解决工具生态如何统一接进来。两者经常是组合关系，而不是替代关系。
