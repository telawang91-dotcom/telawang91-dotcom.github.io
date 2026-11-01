---
layout: post
title: "����ʵ����Agent Harness ��ΰ� Workflow��Context �� Evaluation ���ɱջ���"
subtitle: "������ Harness ����һ��ģ�͵��ÿǣ����ǰ�����״̬�������ġ�ִ�к�����ͳһ������"
date: 2026-09-15 20:30:00 +0800
updated: "2026-11-01"
series: "Agent Project Case Studies"
series_key: project-cases
series_index: "09"
category: Tech
tags: [Agent-Harness, Workflow, Context-Engineering, Evaluation]
---

�� Agent ��ʼ�����������Ժ�ֻ����ģ�� + Tool���ܿ�������������⣺����״̬ɢ�ڶԻ��������Խ��Խ�ҡ�ʧ���Ժ�����жϸ����Ի������¹滮��

һ���������� Harness����Ҫ�� Workflow��Context��Tool Execution��Validation �� Evaluation ����ͬһ�����п���

���Ľ��������ܡ����ڷֲ�֪ʶ���׶����ա�ʧЧ֤��������ָ��ľ���ȡ�ᣬ���Լ����Ķ�[�з� Agent Harness���淶������������֤�ջ�]({{ '/2026/11/01/reliable-development-agent-harness/' | relative_url }})��

## ��һ�㣺Workflow ������״̬

����Ӧ������ȷ�׶Σ������ǿ�ģ���Լ���ס�������������ˡ���

����һ���з���������Գ���ɣ�

```text
Understand
  ��
Spec
  ��
Design
  ��
Tasks
  ��
Implement
  ��
Validate
```

ÿ���׶ζ�Ӧ������ʽ���롢����ͽ���������

## �ڶ��㣺Context ������������ʷ

��������������ĸ��ʺϲ�ɲ�ͬ�������ڣ�

- Codebase��������ʵ�ʹ���ṹ��
- Workspace����ǰ��������� Spec��Design��Tasks��Patch��Validation Result��
- Short-term State����ǰ�ڵ����ڴ����ľֲ���Ϣ��

������ͬ Agent ���԰���ɫ��ȡ��Ҫ���֣������ǹ���������ʷ��

����� Workspace ָ������������һ�������÷��ǿ�ֿ����Ŀ�����ռ䣬����ά�������ܹ���������ʱӦ��ȷ���֡���Ŀ��������ʵ���͡�������ʱ������������߻���ͬһ�������������

## �����㣺Agent ֮��ͨ�� Artifact ����

���һ�� Agent ֻ����һ�� Agent ˵�����Ѿ���ƺ��ˡ�����Ϣ�߽��ģ����

�����׵��ǽ��ӽṹ�� Artifact��

```text
Spec Artifact
Design Artifact
Task Artifact
Patch Artifact
Validation Artifact
```

Workflow ���Լ�� Artifact �Ƿ��������پ����Ƿ�����������һ�׶Ρ�

## ���Ĳ㣺Tool ������Ȩ�޺�Լ��

��ͬ��ɫ��Ӧ��ӵ��ȫ�����ߡ�

����ֻ����滮�� Agent û��Ҫֱ��ִ�и߷���д��������֤ Agent ���Զ�ȡ���������һ����Ҫ�޸�ʵ�֡�

��СȨ�޵ļ�ֵ��ֻ�ǰ�ȫ��Ҳ�ܼ���ģ��ѡ�� Tool �������ռ䡣

## ����㣺��֤������ Runtime ��һ����

ִ���겻������ɡ�

Harness Ӧ�ðѸ�ʽ��顢��̬���򡢲��ԡ����Ժ�ҵ��У����Ϊ״̬ת�Ƶ�һ���֣�

```text
Execute
  ��
Validate
  ���� pass �� next
  ���� repairable �� repair
  ���� plan issue �� replan
  ���� risky �� human review
```

����ʧ�ܴ���������һ�� Prompt������ϵͳ����

## �����㣺Evaluation ���������� Harness

��� Benchmark ���ִ���ʧ�ܼ�����ĳ���ڵ㣬��˵��������ܲ���ģ�ͱ��������ڣ�

- Context ������
- Tool Schema��
- ״̬ת�ƣ�
- Validation Rule��
- Retry / Replan ���ԡ�

������ⲻ����Ŀ���Ĵ��ģ�飬���� Runtime ��Ƶķ���ϵͳ��

## �޽����������ʵ��������

��������ͨ��ϣ��������ظ������Ի�̶����룬�������˹����������Ĳ�ȷ���ԣ���ʵ Harness ������������塢ȷ�Ϻ��˹�������

�����ֻ���������ȫ�ȼۣ��������ʱ��Ҫ�ѽ���������ʽ�滻��ȷ���Թ����Ԥ�������ģ��������ע���죬�����Ǽ������߷���������������ʵ���顣

## ���Ľ���

Harness �ļ�ֵ���ǰ�ģ�������Ž�һ�������еĹ�����ǣ�

```text
Workflow
+ Context
+ Tools
+ Artifacts
+ Validation
+ Trace
+ Evaluation
```

����Щ�������γɱջ��Ժ�Agent �Ų���ֻ��һ�ε��ã�����һ���ܱ����������ԡ�����ͳ���������ϵͳ��
