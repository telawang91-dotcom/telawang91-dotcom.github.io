---
layout: post
title: "为什么 Agent Workflow 需要状态机，而不是让 LLM 自由流转？"
subtitle: "当任务进入真实工程环境，流程控制必须从 Prompt 中拿出来。"
date: 2026-09-12 10:00:00 +0800
pinned: true
series: "AI Agent Engineering"
series_index: "04"
tags: [Agent, Workflow, LangGraph, Multi-Agent, Evaluation]
---

Demo 阶段最自然的做法，是把当前对话、工具列表和目标一起交给 LLM，让它自己决定下一步。但当 Agent 需要处理十几步任务、外部工具、失败重试和人工审批时，这种做法会迅速暴露问题。

## 自由流转最常见的四类问题

第一类是**状态不清晰**。模型知道“对话里发生过什么”，但系统未必知道“当前任务处于哪个业务阶段”。

第二类是**重复执行**。没有显式状态和幂等约束时，模型可能再次调用已经成功过的 Tool。

第三类是**失败不可恢复**。一个工具失败之后，系统不知道应该 Retry、Replan、Rollback 还是直接终止。

第四类是**难以评测**。如果每次路径都完全开放，Benchmark 很难比较两个版本到底在哪一步产生差异。

## 状态机真正解决了什么

状态机把流程从 Prompt 中抽出来，变成系统可见的数据结构。每一个 Node 有明确输入、输出和前置条件；Edge 表示允许发生的转移；Conditional Edge 负责根据结果选择下一条路径。

## 一个实用的 Agent 状态

```python
class AgentState(TypedDict):
    task: str
    plan: list[str]
    current_step: int
    artifacts: dict
    retry_count: int
    errors: list[str]
    status: str
```

关键不是字段长什么样，而是**业务状态必须能被机器判断**。

## Retry、Replan 和 Human-in-the-loop

工具超时可能适合 Retry；计划前提错误应该 Replan；涉及高风险操作应该转人工确认。这三种情况如果都写成一句“请根据情况处理”，最终都变成模型猜测。

## 为什么这类问题适合 LangGraph

LangGraph 的优势并不只是“能画图”，而是它天然围绕 State、Node、Edge、Checkpoint 和 Conditional Routing 组织长链路任务。

## 结论

Agent 越接近生产环境，越应该减少“让模型顺便负责流程控制”。模型负责语义判断，Workflow Runtime 负责状态和约束，可靠性会高很多。
