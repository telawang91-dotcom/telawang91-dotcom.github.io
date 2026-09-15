---
layout: post
title: "Coding Agent 的工具权限：为什么最小权限比强 Prompt 更重要？"
subtitle: "真正可靠的 Coding Agent，不应该因为‘看得见工具’就自动拥有执行它的权力。"
date: 2026-09-15 18:40:00 +0800
series: "AI Coding 与 Agent Harness"
series_key: ai-coding-harness
series_index: "06"
category: Tech
tags: [AI-Coding, Security, Permissions, Tool-Use]
---

Coding Agent 的工具通常比普通 Agent 更危险：它可能读写文件、执行命令、安装依赖、调用测试环境，甚至修改仓库状态。因此权限设计必须进入 Runtime，而不是只靠 Prompt 告诉模型“不要做危险操作”。

## 权限应该按角色拆

Planner 需要读需求和代码上下文，但通常不需要直接执行高风险写操作；Coder 可以修改受限 Workspace；Validator 应该以只读或受控执行方式运行测试和检查。

```text
Planner   → read / search
Coder     → scoped write / build
Validator → test / inspect
Manager   → route / approve policy
```

## 权限还应该按资源范围收缩

“可以写文件”太宽。更可靠的是限定允许修改的目录、文件类型、命令集合和网络访问范围。

即使模型选错工具，系统仍然要在 Runtime 阶段阻止越界操作。

## 高风险工具需要二次确认

涉及删除、发布、生产环境变更、凭证或不可逆操作时，应进入审批或显式 confirmation。Human-in-the-loop 不需要覆盖所有步骤，只覆盖真正高风险的边界。

## Tool Schema 也属于安全边界

Schema 越清晰，模型越不容易构造危险参数。枚举、路径约束、参数范围和显式 confirmation 字段都可以减少错误空间。

## 权限和上下文也有关

Agent 不应该看到自己无权使用的敏感工具说明和数据。最小权限最好同时作用在 **Tool Exposure、Context Exposure 和 Runtime Execution** 三层。

## 面试回答重点

Coding Agent 的权限我会做三层：按角色暴露最小 Tool Set、按资源限制参数和执行范围、高风险操作进入 HITL。Prompt 只能降低误操作概率，真正的权限边界必须由 Runtime 强制执行。
