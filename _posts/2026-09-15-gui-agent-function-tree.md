---
layout: post
title: "GUI Agent：功能树、路径检索与 Tool Execution 怎么串起来？"
subtitle: "手机界面不是一张图片，而是一个需要被结构化、检索和执行的状态空间。"
date: 2026-09-15 19:50:00 +0800
series: "Agent Project Case Studies"
series_key: project-cases
series_index: "05"
category: Tech
tags: [GUI-Agent, Retrieval, Function-Calling, ADB]
---

GUI Agent 的难点并不只是“模型会不会点击”。真正的问题是：一个自然语言目标如何映射到正确页面、正确控件、正确动作，并且在页面变化后继续走下去。

如果只把截图交给模型自由操作，搜索空间会非常大。一个更工程化的思路，是先把 App 的功能空间结构化。

## 把页面空间变成功能树

可以把一个 App 的能力抽象为：

```text
App
 └─ Page
     └─ Control
         └─ Action
             └─ Expected Change
```

例如“打开设置 → 进入蓝牙 → 开启开关”并不是三次随机点击，而是一条有状态转移的功能路径。

功能树中的节点可以记录：

- 页面标识；
- 控件文本或属性；
- 可执行动作；
- 前置页面；
- 执行后的预期变化；
- 失败或不可用条件。

## 为什么功能树适合检索

用户说“把蓝牙打开”，系统不需要把整个 App 的所有节点都塞给模型。

更合理的是先检索相关功能节点和路径，再把 Top-K 候选交给 Planner。

因此 GUI Agent 可以形成：

```text
User Goal
  ↓
Path Retrieval
  ↓
Candidate Functions
  ↓
Planner
  ↓
Function Calling / Tool Execution
  ↓
Observed UI State
```

## Hybrid Retrieval 为什么有价值

GUI 功能名称里有很多非常强的关键词，例如“蓝牙”“热点”“省电模式”；但用户表达又可能非常口语化，例如“把网络共享给电脑”。

因此关键词和向量检索各有优势：

- Keyword 擅长精确功能名；
- Vector 擅长语义改写；
- RRF 等融合策略可以让两路候选共同参与排序；
- metadata 可以先限制 App、页面层级或设备状态。

## Planner 不应该凭空发明控件

路径候选提供的是“系统已知、可执行”的能力边界。

Planner 的职责是从候选路径中组合下一步，而不是根据语言常识猜一个不存在的按钮名称。

这能显著降低 hallucinated tool call。

## Tool Execution 要返回观察，而不是只返回成功

执行层完成点击、滑动、输入之后，需要把新的页面状态返回给 Planner。

例如：

```json
{
  "action": "tap",
  "target": "Bluetooth",
  "status": "success",
  "new_page": "BluetoothSettings",
  "expected_change_matched": true
}
```

如果预期变化没有发生，就应该进入重试、重新感知或重新规划，而不是继续盲走。

## 这类系统为什么需要闭环

GUI 是动态环境：弹窗、网络、权限、版本差异都可能改变路径。

所以真实执行必须是：

```text
Plan → Act → Observe → Validate → Replan
```

而不是一次生成完整点击序列以后不再观察。

## 核心结论

GUI Agent 的关键不是让模型“更会看图”，而是把 UI 空间变成**可检索能力图 + 可验证状态转移**。

一旦页面、控件、动作和预期变化被结构化，检索、规划、执行和 Badcase 分析都会变得更可控。
