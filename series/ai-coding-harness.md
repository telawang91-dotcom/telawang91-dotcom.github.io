---
layout: series
title: "AI Coding 与 Agent Harness"
permalink: /series/ai-coding-harness/
series_key: ai-coding-harness
---

这套系列关注 **Coding Agent 如何理解代码库、组织任务产物、执行工具并完成验证闭环**。内容会覆盖 Codebase Context、Workspace、Spec → Design → Tasks → Code、脚本校验、无交互评测与权限控制。

重点不是某个 IDE 插件，而是 Coding Agent 背后的 Harness 与工程运行时。

可以沿两条路线阅读：先从第 00～07 章建立代码检索、任务产物、工作流与评测的基础，再读第 08～09 章，理解这些能力如何组成完整的研发闭环。

- [研发 Agent Harness]({{ '/2026/11/01/reliable-development-agent-harness/' | relative_url }})：讨论规则与技能分离、上下文分层、人工方案选择、证据校验与失败恢复。
- [增量规格与全量知识]({{ '/2026/11/01/agent-spec-change-lifecycle/' | relative_url }})：用导出任务的虚构例子，说明规格如何随代码演进，以及归档时怎样维护当前事实。
