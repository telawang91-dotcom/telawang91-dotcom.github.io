---
layout: post
title: "Retry、Rollback 与 Replan：Agent 失败以后怎么继续？"
subtitle: "失败处理不是统一重试，而是先判断失败类型，再选择恢复策略。"
date: 2026-09-15 18:37:00 +0800
series: "Workflow 与 Multi-Agent"
series_key: workflow-multi-agent
series_index: "05"
category: Tech
tags: [Agent, Workflow, Retry, Replan, Reliability]
---

真实 Agent 系统一定会失败。工具超时、参数错误、外部服务不可用、计划前提错误、执行结果不符合预期，这些都非常常见。

工程上的关键不是“如何避免所有失败”，而是**失败以后系统还能不能恢复**。

## 先把失败分类

可以粗分成四类：

### 1. Transient Error

例如网络超时、限流、临时服务不可用。

这类问题通常适合 Retry。

### 2. Input / Parameter Error

例如 Tool 参数类型错误、缺字段、路径不存在。

这类问题应该先修正输入，而不是重复调用同一个错误请求。

### 3. Plan Error

计划本身就不成立，例如前置条件不存在、依赖顺序错误。

这时应该 Replan。

### 4. Side-effect Error

已经执行了部分写操作，但后续失败。例如先创建资源，再配置失败。

这种情况可能需要 Rollback 或补偿事务。

## Retry 什么时候有效

Retry 适合“同样输入再次执行可能成功”的错误。

通常会配合指数退避：

```text
1s → 2s → 4s → 8s
```

并设置最大次数，避免无限循环。

还可以只对特定错误码重试：

```python
if error.type in RETRYABLE_ERRORS:
    retry()
else:
    escalate()
```

## Replan 和 Retry 的本质区别

Retry 假设计划是对的，只是执行偶然失败。

Replan 认为**原来的计划已经不再可信**。

例如：

```text
Plan: edit config → restart service
```

但执行时发现配置文件根本不存在，这不是“再试一次”能解决的，需要重新判断环境并生成新计划。

## Rollback 为什么难

不是所有 Tool 都天然可逆。

```text
create_file       → delete_file
create_resource   → delete_resource
send_email        → ?
charge_payment    → refund_payment
```

所以工具层最好显式标注：

- 是否有副作用；
- 是否幂等；
- 是否可回滚；
- 对应补偿动作是什么。

## 幂等性是 Agent Tool 的重要属性

如果一次 Tool Call 超时，系统可能不知道服务端到底执行成功没有。

这时重复调用可能产生两份资源。

所以高价值 Tool 最好支持 idempotency key：

```text
request_id = task_id + step_id
```

重复请求时服务端只执行一次。

## 一个实用恢复流程

```text
Step Failed
   ↓
Classify Error
   ├─ Transient → Retry
   ├─ Invalid Input → Repair Args
   ├─ Plan Invalid → Replan
   ├─ Side Effect → Rollback / Compensate
   └─ High Risk → Human Review
```

## 为什么失败信息要结构化

不要只保存：

```text
"tool failed"
```

更好的错误对象：

```json
{
  "step": "deploy",
  "tool": "run_command",
  "error_type": "timeout",
  "retryable": true,
  "attempt": 2,
  "stderr": "..."
}
```

这样 Manager 和评测系统才能做稳定判断。

## 面试里怎么说

> Agent 的异常处理我会先做错误分类，而不是统一重试。临时错误 Retry，输入错误修参数，计划前提错误 Replan，有副作用的失败需要 Rollback 或补偿；同时工具层要考虑幂等性和最大重试次数。核心是把恢复策略从 Prompt 中拿出来，变成 Workflow Runtime 的确定性逻辑。
