---
layout: post
title: "AI Agent 工程学习地图：从 Tool Use 到 Reliable Agent"
subtitle: "不是堆框架，而是建立一条从模型能力到工程可靠性的主线。"
date: 2026-09-15 09:00:00 +0800
updated: 2026-09-15
pinned: true
series: "AI Agent Engineering"
series_index: "总览"
tags: [Agent, Roadmap, Workflow, RAG, Evaluation, AI-Coding]
---

做 Agent 很容易陷入一个误区：今天学 Function Calling，明天看 MCP，后天又去追一个新的 Multi-Agent 框架。名词越来越多，但遇到真实系统问题时仍然不知道应该在哪一层排查。

我更倾向于把 Agent 工程拆成七层：**基础能力、工具调用、检索与上下文、运行时、Multi-Agent、评测可靠性、AI Coding**。这七层不是技术名词列表，而是一条系统演进路径。

## 1. Foundation：先让输出可以被系统消费

Agent 的第一步并不是“自治”，而是把模型输出从自然语言变成可靠的结构化信息。这里最重要的是 Structured Output、JSON Schema、参数校验和错误恢复。

## 2. Tool Use：模型决定“做什么”，系统决定“怎么做”

Function Calling 和 MCP 的核心不是让模型获得更多权力，而是把能力放到清晰的 Tool 边界后面。一个好的 Tool 应该有明确 schema、可观察错误、最小权限以及必要的人类确认。

## 3. Retrieval & Context：把“模型记忆”变成“系统上下文”

RAG 解决的不是知识越多越好，而是在当前任务下找到**最有用、最可信、最适用**的上下文。工程上通常需要混合检索、元数据过滤、Rerank，以及对 Workspace / Codebase / Memory 的分层管理。

## 4. Agent Runtime：真正的 Agent 工程分水岭

一旦任务变成长链路，仅靠 prompt 让模型自由决定下一步，系统很快就会遇到状态丢失、重复执行、死循环、无法恢复等问题。

因此需要显式状态、预算、超时、重试、回退、Checkpoint 和人工确认。LangGraph 这类框架的价值，也主要体现在这里。

## 5. Multi-Agent：不是 Agent 越多越强

Multi-Agent 的价值在于角色边界，而不是数量。Supervisor / Manager Agent 负责拆解、分发与收敛；Worker 只在自己的能力边界内执行。

## 6. Evaluation & Reliability：没有评测，就没有工程迭代

Agent 的失败至少可以拆成：知识覆盖、检索、规划、工具执行、状态流转、输出验证。只有建立 Trace 和 Benchmark，才能知道应该改模型、改 Prompt、改检索还是改工具。

## 7. AI Coding：Agent 工程问题的集中体现

Coding Agent 会同时遇到上下文选择、长链路规划、工具调用、权限、安全、执行、测试和验证问题，因此它几乎是 Agent Engineering 的综合题。

真正可靠的 Coding Agent，不是“生成代码”结束，而是 **理解任务 → 获取代码上下文 → 修改 → 执行 → 验证 → 修复 → 交付**。

## 总结

如果只记一句话：**LLM 负责处理不确定性，工程系统负责把不确定性限制在可控边界内。**

这也是我接下来整理这个博客的主线。
