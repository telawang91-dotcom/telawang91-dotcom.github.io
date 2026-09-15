---
layout: post
title: "LLM-as-Judge 为什么不稳定，以及什么时候还能用？"
subtitle: "让模型评模型很方便，但它更适合评语义质量，不适合替代所有确定性验证。"
date: 2026-09-15 18:41:00 +0800
series: "Agent Evaluation 与 Reliability"
series_key: evaluation-reliability
series_index: "03"
category: Tech
tags: [Agent, Evaluation, LLM-as-Judge, Reliability]
---

LLM-as-Judge 的优点很明显：不需要给每个任务都写复杂规则，就能评价回答是否相关、解释是否完整、表达是否清晰。

但如果把它当成唯一评测器，结果很容易漂移。

## 为什么 Judge 会不稳定

### 1. Judge 自己也是概率模型

同一输入多次评测，分数可能略有不同。

### 2. 它可能被输出风格影响

更长、更自信、更像“标准答案”的文本，有时会获得更高分，即使事实并没有更准确。

### 3. 它不一定知道真实环境状态

Agent 是否真正创建了文件、数据库是否更新、脚本是否执行成功，这些不能只看自然语言解释。

### 4. Prompt 很容易改变评分尺度

评分标准稍微改写，整体分布可能发生变化，导致历史 Benchmark 不可比。

## 哪些指标适合 LLM-as-Judge

适合语义类指标：

- relevance；
- completeness；
- coherence；
- explanation quality；
- user intent satisfaction。

不适合单独承担：

- 文件是否存在；
- JSON 是否合法；
- API 是否调用正确；
- 数值是否精确；
- 测试是否通过；
- 权限是否越界。

这些应该交给程序化 Validator。

## 最稳的做法：Hybrid Evaluation

```text
Agent Output
   ↓
Deterministic Checks
   ├─ Schema
   ├─ Assertions
   ├─ AST / Test
   └─ Environment State
   ↓
LLM Judge
   ├─ Semantic Quality
   └─ Explanation Quality
   ↓
Final Score
```

先判断“做没做对”，再判断“做得好不好”。

## 如何降低 Judge 漂移

可以做几件事：

- temperature 设低；
- 使用结构化评分 Schema；
- 给出正反例；
- 把评价维度拆开；
- 固定 Judge 模型版本；
- 保存 Judge Prompt 版本；
- 对边界 Case 进行多次采样或人工复核。

例如不要问：

> “这个回答好不好？0-10 分。”

而是拆成：

```json
{
  "correctness": 0-2,
  "completeness": 0-2,
  "relevance": 0-2,
  "reason": "..."
}
```

## Pairwise 往往比绝对打分更稳定

比起让模型判断“这个结果是 7 分还是 8 分”，让它比较：

> A 和 B 哪个更好？为什么？

通常更容易得到稳定结果，尤其适合模型版本对比。

## 面试里怎么说

> LLM-as-Judge 适合评语义质量，但我不会用它替代确定性验证。文件状态、JSON、代码测试、工具结果这类指标应该通过 Assertion、AST 或环境检查完成；Judge 更多负责 relevance、completeness、解释质量。这样可以减少评测漂移，也更容易定位问题。
