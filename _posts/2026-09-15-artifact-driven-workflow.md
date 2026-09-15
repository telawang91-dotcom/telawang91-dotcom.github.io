---
layout: post
title: "产物驱动 Workflow：为什么 Artifact 比聊天历史更适合推动状态流转？"
subtitle: "可靠 Workflow 不应该靠模型‘记住做到哪了’，而应该靠可验证产物决定下一步。"
date: 2026-09-15 18:33:00 +0800
series: "Workflow 与 Multi-Agent"
series_key: workflow-multi-agent
series_index: "04"
category: Tech
tags: [Workflow, Artifact, Multi-Agent, State-Machine]
---

很多 Agent Workflow 一开始都会把“任务进度”放在对话历史里：模型根据之前说过什么，判断下一步该做什么。这种方式在 Demo 里够用，但任务一长，就会出现状态漂移。

更可靠的方式，是让流程围绕 **Artifact** 推进。

## Artifact 是什么

Artifact 可以是结构化需求、设计文档、任务列表、代码补丁、测试报告、执行结果等。关键不是格式，而是它必须是**可持久化、可验证、可被后续节点消费**的正式产物。

```text
Requirement
   ↓
Spec Artifact
   ↓
Design Artifact
   ↓
Task Artifact
   ↓
Code / Result Artifact
```

## 为什么比聊天历史可靠

聊天历史是描述性的，Artifact 是状态性的。

系统不需要猜“是不是已经完成设计”，只需要判断设计产物是否存在、是否合法、是否通过校验。

## Artifact 可以成为状态机的条件

例如：

```text
if spec.valid == true:
    go_to(design)
else:
    go_to(revise_spec)
```

这样 Edge 的条件可以由确定性检查驱动，而不是让 LLM 自己决定“我觉得可以进入下一步”。

## 多 Agent 之间为什么适合用 Artifact 交接

当多个 Agent 协作时，最稳的共享方式通常不是共享整段对话，而是共享经过定义的中间产物。

例如 Planner 输出任务计划，Coder 只消费计划和必要代码上下文，Validator 再消费代码结果和验收标准。这样角色边界更清晰，也更容易做最小权限。

## Artifact 还能支持恢复

如果流程中途失败，只要前面的 Artifact 已经持久化，就不需要从头重跑。Runtime 可以从最近一个有效产物继续。

这也是 Checkpoint / Resume 能真正落地的基础。

## 工程上最关键的一点

Artifact 驱动的本质，是把“流程状态”从模型脑子里拿出来，变成系统能读、能验、能保存的数据。

## 面试可以直接说

我更倾向用 Artifact 推动 Workflow，而不是让 Agent 通过对话历史判断进度。因为 Artifact 可以做 schema 校验、版本管理、状态判断和断点恢复，也能作为不同 Agent 之间稳定的交接契约。
