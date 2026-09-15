---
layout: post
title: "Guardrail 与 CodeCheck：为什么执行后验证不可缺？"
subtitle: "模型输出通过了，不代表执行结果就可信；可靠 Agent 需要前置约束和后置验证两道边界。"
date: 2026-09-15 18:37:00 +0800
series: "Agent Evaluation 与 Reliability"
series_key: evaluation-reliability
series_index: "07"
category: Tech
tags: [Guardrail, CodeCheck, Agent, Reliability]
---

很多 Agent 系统把验证放在生成阶段：只要 JSON 能解析、模型说“完成了”，就认为任务成功。但真正的工程风险通常发生在执行之后。

## 前置校验解决什么

执行前要检查格式、参数、权限、依赖和业务约束。它的目标是阻止明显错误进入执行层。

```text
Plan / Tool Call
      ↓
Schema Check
      ↓
Permission Check
      ↓
Business Rule Check
      ↓
Execute
```

## 后置验证解决什么

即使调用参数完全合法，真实结果也可能不符合预期。比如脚本返回 0，但文件没有正确生成；代码编译通过，但测试失败；设备命令成功发送，但状态没有变化。

因此执行后还要验证后置条件。

## CodeCheck 可以检查哪些层

对于 Coding Agent，常见验证包括：语法/编译、Lint、单元测试、类型检查、依赖完整性、变更范围以及安全规则。

最重要的是把这些检查变成确定性工具，而不是让 LLM 再读一遍代码说“看起来没问题”。

## Guardrail 不应该只有一个总开关

更实用的设计是分层：输入 Guardrail 控制进入系统的任务；Tool Guardrail 控制调用范围；Output Guardrail 检查产物；Execution Guardrail 验证真实状态。

## 为什么后置验证是闭环的最后一步

如果系统只知道“我发出了动作”，它只能证明执行意图存在；只有验证真实世界或代码环境的状态变化，才能证明任务真正完成。

## 面试回答重点

我会把 Guardrail 分成执行前约束和执行后验证。前面主要做 schema、权限和业务规则检查，后面做测试、状态断言和结果校验。核心原则是：LLM 负责生成候选动作，确定性检查负责决定这个动作是否真的有效。
