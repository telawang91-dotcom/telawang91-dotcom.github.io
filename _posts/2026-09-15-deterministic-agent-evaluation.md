---
layout: post
title: "AST / Assertion：Agent 执行结果怎么做确定性比对？"
subtitle: "能用程序判断的，就不要先交给另一个 LLM 猜。"
date: 2026-09-15 18:42:00 +0800
series: "Agent Evaluation 与 Reliability"
series_key: evaluation-reliability
series_index: "04"
category: Tech
tags: [Agent, Evaluation, AST, Assertion, Reliability]
---

Agent 评测里，一个很重要的原则是：**只要结果可以通过程序确定，就优先做确定性验证。**

因为确定性检查更稳定、更可解释，也更适合长期回归。

## 文本任务和执行任务要分开

如果任务只是“总结一篇文章”，很难写严格 Assertion。

但如果任务是：

> 修改配置，把端口从 8080 改成 8081，并保持其他字段不变。

那就完全没必要让 LLM Judge 猜。

可以直接解析文件：

```python
assert config["port"] == 8081
assert config["host"] == "0.0.0.0"
```

## JSON / YAML 可以直接做结构化校验

常见检查：

- 是否能解析；
- 必填字段；
- 字段类型；
- 枚举；
- 业务约束；
- 是否包含禁止字段。

```python
assert result["status"] == "success"
assert isinstance(result["steps"], list)
```

## 代码场景为什么需要 AST

只比较字符串会很脆弱。

下面两段代码语义相同，但文本完全不同：

```python
x = a + b
```

```python
x=(a+b)
```

所以可以解析成 AST，再判断：

- 函数是否存在；
- 调用关系是否符合要求；
- 是否使用指定 API；
- 是否引入危险调用；
- 是否修改了不该改的区域。

## 最强的验证还是运行结果

代码 Agent 的最终目标不是“代码看起来对”，而是：

```text
Build passes
Tests pass
Lint passes
Expected behavior passes
```

因此评测通常可以分三层：

```text
Static Check
  ↓
AST / Schema
  ↓
Runtime Test
  ↓
Environment Assertion
```

## Bash / Shell 怎么校验

Shell 脚本可以先做静态检查：

- 语法；
- 禁止命令；
- 危险路径；
- 变量引用。

再放进 Sandbox 执行。

高风险操作不要直接在真实环境跑。

## Artifact Validation 比自然语言更可靠

如果 Agent 任务要求交付：

```text
plan.json
design.md
patch.diff
test_report.json
```

评测器可以分别验证这些 Artifact，而不是只看 Agent 最后一段总结。

这也是为什么工程 Agent 系统通常强调“产物驱动”。

## Assertion 也需要版本管理

任务定义变了，验证规则也可能变化。

建议保存：

```text
task_version
evaluator_version
schema_version
```

否则历史得分可能不能直接比较。

## 面试里怎么说

> Agent 评测里我倾向于“能确定性验证就不交给 LLM Judge”。结构化输出用 Schema / Assertion，代码用 AST、Build 和 Test，环境任务直接检查最终状态。LLM Judge 留给语义质量评价。这样评测更稳定，也能明确知道失败发生在哪个条件。
