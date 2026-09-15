---
layout: post
title: "工程实践：Agent Harness 如何把 Workflow、Context 和 Evaluation 串成闭环？"
subtitle: "真正的 Harness 不是一个模型调用壳，而是把任务状态、上下文、执行和评测统一起来。"
date: 2026-09-15 20:30:00 +0800
series: "Agent Project Case Studies"
series_key: project-cases
series_index: "09"
category: Tech
tags: [Agent-Harness, Workflow, Context-Engineering, Evaluation]
---

当 Agent 开始处理长任务以后，只做“模型 + Tool”很快会遇到三个问题：任务状态散在对话里、上下文越来越乱、失败以后很难判断该重试还是重新规划。

一个更完整的 Harness，需要把 Workflow、Context、Tool Execution、Validation 和 Evaluation 放在同一个运行框架里。

## 第一层：Workflow 管任务状态

任务应该有明确阶段，而不是靠模型自己记住“现在做到哪了”。

例如一个研发类任务可以抽象成：

```text
Understand
  ↓
Spec
  ↓
Design
  ↓
Tasks
  ↓
Implement
  ↓
Validate
```

每个阶段都应该有显式输入、输出和进入条件。

## 第二层：Context 不等于聊天历史

长任务里的上下文更适合拆成不同生命周期：

- Codebase：长期事实和代码结构；
- Workspace：当前任务产生的 Spec、Design、Tasks、Patch、Validation Result；
- Short-term State：当前节点正在处理的局部信息。

这样不同 Agent 可以按角色读取必要部分，而不是共享整段历史。

## 第三层：Agent 之间通过 Artifact 交接

如果一个 Agent 只对下一个 Agent 说“我已经设计好了”，信息边界很模糊。

更稳妥的是交接结构化 Artifact：

```text
Spec Artifact
Design Artifact
Task Artifact
Patch Artifact
Validation Artifact
```

Workflow 可以检查 Artifact 是否完整，再决定是否允许进入下一阶段。

## 第四层：Tool 必须有权限和约束

不同角色不应该拥有全部工具。

例如只负责规划的 Agent 没必要直接执行高风险写操作；验证 Agent 可以读取结果，但不一定需要修改实现。

最小权限的价值不只是安全，也能减少模型选错 Tool 的搜索空间。

## 第五层：验证必须是 Runtime 的一部分

执行完不等于完成。

Harness 应该把格式检查、静态规则、测试、断言和业务校验作为状态转移的一部分：

```text
Execute
  ↓
Validate
  ├─ pass → next
  ├─ repairable → repair
  ├─ plan issue → replan
  └─ risky → human review
```

这样失败处理不再是一句 Prompt，而是系统规则。

## 第六层：Evaluation 反过来驱动 Harness

如果 Benchmark 发现大量失败集中在某个节点，就说明问题可能不在模型本身，而在：

- Context 构建；
- Tool Schema；
- 状态转移；
- Validation Rule；
- Retry / Replan 策略。

因此评测不是项目最后的打分模块，而是 Runtime 设计的反馈系统。

## 无交互评测和真实交互环境

离线评测通常希望任务可重复，所以会固定输入，并减少人工交互带来的不确定性；真实 Harness 则可能允许澄清、确认和人工审批。

这两种环境不会完全等价，因此评测时需要把交互策略显式替换成确定性规则或预设上下文，并清楚标注差异，而不是假设离线分数能完整代表真实体验。

## 核心结论

Harness 的价值，是把模型能力放进一个可运行的工程外壳：

```text
Workflow
+ Context
+ Tools
+ Artifacts
+ Validation
+ Trace
+ Evaluation
```

当这些层真正形成闭环以后，Agent 才不再只是一次调用，而是一个能被治理、调试、评测和持续迭代的系统。
