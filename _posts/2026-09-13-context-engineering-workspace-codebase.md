---
layout: post
title: "Context Engineering：Workspace 与 Codebase 应该怎么分？"
subtitle: "代码库是长期事实，工作区是当前任务状态；两者混在一起，Agent 很快就会迷路。"
date: 2026-09-13 09:00:00 +0800
series: "RAG 与 Context Engineering"
series_key: rag-context
series_index: "05"
category: Tech
tags: [Context-Engineering, RAG, Agent, AI-Coding]
---

在复杂 Agent 任务里，“上下文”不是一段越来越长的聊天记录。更实用的做法，是把上下文拆成不同生命周期的数据空间。

一个常见划分是 **Codebase + Workspace**。

## Codebase：相对稳定的长期事实

Codebase 主要回答：

- 项目有哪些目录和模块？
- 某个接口在哪里定义？
- 哪些测试覆盖了这段逻辑？
- 当前依赖、配置和代码约束是什么？

它的特点是范围大、更新相对慢、适合按需检索。

因此通常不会把整个仓库直接塞进 Context，而是通过文件索引、符号检索、关键词搜索、Embedding、依赖关系等方式动态获取局部证据。

## Workspace：当前任务正在发生什么

Workspace 更像任务现场，保存的是：

```text
Task
 ├─ requirements
 ├─ plan
 ├─ intermediate artifacts
 ├─ changed files
 ├─ test results
 ├─ errors
 └─ decisions
```

这些内容生命周期更短，但对当前任务极其重要。

如果设计 Agent 已经输出了一份设计文档，编码 Agent 最应该读取的是经过确认的设计产物，而不是重新从聊天记录里猜一遍需求。

## 为什么不能全部共享

最简单的多 Agent 共享方式，是所有 Agent 都读同一段历史消息。问题是：

1. Context 越来越长；
2. 不同角色会看到大量无关信息；
3. 敏感工具和内部推理边界难以隔离；
4. 同一事实可能在多轮对话里出现冲突版本。

所以更合理的是**共享结构化状态，但按角色投影上下文**。

例如：

```text
Manager Agent
    │
    ├── Design Agent   → requirement + architecture context
    ├── Coding Agent   → accepted design + relevant code
    └── Verify Agent   → diff + tests + acceptance criteria
```

它们共享同一个任务，但并不共享完全相同的信息视图。

## Context Assembly 才是关键

真正的 Context Engineering 不是“存更多”，而是每次调用模型前决定：

- 哪些信息必须固定进入 System / Policy；
- 哪些任务状态从 Workspace 获取；
- 哪些长期知识从 Codebase / Knowledge Base 检索；
- 哪些历史 Trace 只在需要时召回；
- 哪些内容必须因为权限而隐藏。

可以把一次模型调用理解成：

```text
Final Context
 = Policy
 + Role Instruction
 + Current Task State
 + Retrieved Evidence
 + Relevant Artifacts
 + Tool Schema
```

## 结论

Context Engineering 的目标不是无限扩大上下文窗口，而是**在正确的阶段，把正确的信息交给正确的 Agent**。

Codebase 管长期事实，Workspace 管任务过程，Context Assembly 决定这一轮真正送进模型的内容。这个边界一旦清晰，多 Agent 协作、断点续传和评测都会更容易做。
