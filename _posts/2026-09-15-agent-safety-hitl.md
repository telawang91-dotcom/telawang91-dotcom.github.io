---
layout: post
title: "Agent 的权限、安全与 Human-in-the-loop 应该怎么设计？"
subtitle: "高风险能力不能只靠 Prompt 约束，权限、审批与执行边界必须进入系统层。"
date: 2026-09-15 18:31:00 +0800
series: "AI Agent 基础"
series_key: agent-foundations
series_index: "07"
category: Tech
tags: [Agent, Security, HITL, Permissions]
---

只要 Agent 能调用真实工具，安全问题就不再只是“模型会不会说错话”，而是“模型能不能真的做错事”。因此生产环境里的安全设计，重点必须从 Prompt 移到 **Tool、Runtime 和权限层**。

## 第一层：最小权限

Agent 不应该默认拥有所有工具。不同角色只拿完成任务所需的最小 Tool Set，例如只读 Agent 可以读仓库和搜索知识库，但不能直接执行高风险写操作。

权限最好绑定到明确角色和任务状态，而不是把几十个敏感工具全部暴露给模型。

## 第二层：参数校验

即使模型选对了工具，参数也可能越界。执行前应该做 schema、枚举、路径、资源范围和业务规则校验。

```text
LLM Tool Call
   ↓
Schema Validation
   ↓
Permission Check
   ↓
Policy Check
   ↓
Execute
```

## 第三层：Human-in-the-loop

并不是所有操作都需要人工确认。更合理的是根据风险等级触发审批：只读查询自动执行；可逆写操作允许自动执行并记录；不可逆、高影响操作进入 HITL。

人工节点真正的意义不是“让人兜底一切”，而是把少数高风险决策从自动化路径中显式切出来。

## 第四层：执行后验证

很多风险只在执行后才能暴露。因此需要检查返回码、实际状态变化、影响范围以及是否满足预期后置条件。

## Prompt 为什么不够

提示词可以降低误调用概率，但它不是访问控制系统。只要 Tool 在上下文里可见并且 Runtime 允许执行，模型仍有机会调用它。

所以更可靠的原则是：**Prompt 负责引导，Permission 负责硬约束。**

## 面试可以怎么回答

我会把安全拆成四层：最小权限 Tool 暴露、调用参数校验、风险操作 HITL、执行后 Guardrail。核心目标是即使模型判断错误，也不能直接突破系统边界。
