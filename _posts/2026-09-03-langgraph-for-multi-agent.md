---
layout: post
title: "LangGraph 为什么更适合 Multi-Agent？"
subtitle: "真正需要的不是更多 Agent，而是可控的状态、路由和恢复。"
date: 2026-09-03 10:00:00 +0800
series: "Workflow 与 Multi-Agent"
series_key: workflow-multi-agent
series_index: "02"
category: Tech
tags: [LangGraph, Multi-Agent, Agent, Workflow]
---

很多 Multi-Agent Demo 的核心只是：一个 Agent 调另一个 Agent。但工程上的 Multi-Agent，需要回答更困难的问题：任务由谁拆、状态存在哪里、失败怎么回退、谁有权调用哪些 Tool、什么时候结束。

## Chain 和 Graph 的差别

Chain 更适合相对线性的处理：A → B → C。Multi-Agent 往往包含条件分支、循环、重试、并行和人工节点，天然更接近 Graph。

## Supervisor 不应该只是一个“大 Prompt”

Supervisor 的职责至少包括任务路由、状态收敛、预算控制和失败处理。如果这些逻辑全部藏在 Prompt 里，就很难观测和评测。

更好的方式是：Supervisor 负责语义决策，Graph 负责允许的流转边界。

## Shared State 比共享整段对话更重要

多个 Agent 不需要看到全部历史。常见做法是共享一个结构化 State，再按角色给不同 Agent 投影它真正需要的部分。

这样可以降低上下文长度，也能减少权限泄露和无关信息干扰。

## Validator 是很容易被忽略的角色

如果 Worker 输出直接进入执行层，Multi-Agent 只是把一次模型生成变成多次模型生成。Validator 的价值在于把“生成”与“执行”隔开：先检查格式、前置条件、冲突、安全性和业务约束，再允许执行。

## 最重要的工程价值

LangGraph 真正适合 Multi-Agent 的原因，是它让状态、路由、Checkpoint 和恢复策略成为一等公民。这些能力决定了一个系统能不能从 Demo 走向稳定运行。
