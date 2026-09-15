---
layout: post
title: "Smart Home：感知—预测—决策—验证—执行闭环怎么设计？"
subtitle: "真正的 Multi-Agent 项目，不是让几个 Agent 聊天，而是让环境状态最终安全地变成设备动作。"
date: 2026-09-09 09:00:00 +0800
series: "Agent Project Case Studies"
series_key: project-cases
series_index: "01"
category: Tech
tags: [Multi-Agent, LangGraph, Smart-Home, Project]
---

智能家居很适合展示 Multi-Agent 的工程价值，因为它不是生成一段文字，而是最终要影响真实环境。系统既要理解传感器数据，又要预测趋势、生成策略、做安全校验，最后才能执行设备控制。

因此我把整个流程拆成五段：

```text
感知 Perception
      ↓
预测 Prediction
      ↓
决策 Decision
      ↓
验证 Validation
      ↓
执行 Execution
```

## 感知：不要把原始数据直接交给模型

真实传感器数据会抖动、缺失、重复，甚至不同传感器互相冲突。

所以 Perception 层更像数据预处理和状态抽象：

- 温湿度做范围检查和异常值过滤；
- 人体存在信号结合时间窗口，减少瞬时抖动；
- 设备状态统一转换成结构化环境 State；
- 冲突数据保留置信度，而不是强行覆盖。

Agent 应该消费“环境状态”，而不是消费所有原始采样点。

## 预测：回答短时间后会发生什么

只看当前温度容易做出滞后的控制。系统会结合短时趋势预测未来环境变化，再把结果交给决策层。

在项目里可以根据数据量选择不同模型：数据足够时使用 Holt-Winters，样本较少时退化到 Holt 或更简单的物理趋势模型。

关键不是模型多高级，而是预测结果必须有置信度和可降级策略。

## 决策：LLM 负责语义权衡

Decision Agent 综合：

```text
Current State
+ Prediction
+ Occupancy / Activity
+ Comfort Model
+ User Preference
+ Safety Policy
```

它更擅长处理多目标权衡，比如舒适、节能、安全之间的冲突。

但它输出的仍然只是“建议动作”，不能直接控制设备。

## 验证：生成和执行之间必须隔一层

Validator 是整个闭环里最重要的安全边界之一。

它会检查：

- Tool 参数是否合法；
- 设备是否存在且可用；
- 动作是否和当前状态冲突；
- 是否触发安全规则；
- 高风险动作是否需要人工确认。

只有通过验证，策略才能进入执行层。

## 执行：Tool 层屏蔽设备差异

执行层通过统一 Tool 接口操作设备，底层可以接 Home Assistant、REST API 或 WebSocket。

```text
Agent Action
    ↓
Device Tool
    ↓
Device Abstraction
    ↓
Home Assistant / Simulator
```

这样 Agent 不需要知道某个空调具体是什么品牌，也不会直接接触底层协议细节。

## 为什么适合用 LangGraph

五个阶段天然存在条件分支：验证失败可能回到 Decision，设备执行失败可能 Retry，涉及关键动作可能进入 Human-in-the-loop。

因此图结构比简单 Chain 更贴合实际流程。

## 结论

这个项目最想表达的不是“用了五个 Agent”，而是一个更重要的工程原则：

> 环境感知、模型推理和真实执行之间必须有清晰的状态、验证和工具边界。

Multi-Agent 只是组织复杂职责的一种方式，真正决定系统是否可靠的是整个闭环有没有被工程化。
