---
layout: default
title: Experience
description: "王新峰的实习与工程实践经历，包含华为、vivo 等实习经历、深圳零一学院实践及相关证明材料预览。"
permalink: /experience/
---
<div class="narrow-page experience-page">
  <p class="eyebrow">CAREER · EXPERIENCE</p>
  <h1>实习经历</h1>
  <p class="lead">从工程实践出发，持续探索 AI Agent 在真实任务中的构建、运行与评估。</p>

  <section class="badge-gallery" aria-label="实习工牌记录">
    <div class="badge-gallery-heading"><span>实习记录</span><span>INTERNSHIP BADGES</span></div>
    <div class="badge-gallery-grid">
      <figure class="badge-gallery-item">
        <a href="{{ '/assets/img/huawei-work-badge.png' | relative_url }}" target="_blank" rel="noreferrer" aria-label="查看华为工牌原图"><img src="{{ '/assets/img/huawei-work-badge.png' | relative_url }}" alt="华为实习工牌" width="434" height="551" loading="lazy"></a>
        <figcaption>Huawei<span>华为</span></figcaption>
      </figure>
      <figure class="badge-gallery-item">
        <a href="{{ '/assets/img/autel-work-badge.png' | relative_url }}" target="_blank" rel="noreferrer" aria-label="查看道通科技工牌原图"><img src="{{ '/assets/img/autel-work-badge.png' | relative_url }}" alt="道通科技实习工牌" width="434" height="609" loading="lazy"></a>
        <figcaption>Autel<span>道通科技</span></figcaption>
      </figure>
      <figure class="badge-gallery-item">
        <a href="{{ '/assets/img/vivo-work-badge.png' | relative_url }}" target="_blank" rel="noreferrer" aria-label="查看vivo工牌原图"><img src="{{ '/assets/img/vivo-work-badge.png' | relative_url }}" alt="vivo实习工牌" width="509" height="708" loading="lazy"></a>
        <figcaption>vivo<span>实习工牌</span></figcaption>
      </figure>
    </div>
  </section>

  <section class="other-experience">
    <div class="timeline">
      <div class="timeline-item"><div class="timeline-date">2026.07 — 至今</div><div><h3>Huawei · AI 应用开发实习生</h3>
        <p><strong>项目：SuperHarness · Agent Harness</strong></p>
        <p>主要参与面向 AI 辅助研发的 Agent Harness 工程实践，围绕规范驱动开发、分层上下文管理、研发工作流编排与自动化质量校验开展工作，关注长任务执行的可验证性、可追溯性与失败恢复。</p>
        <ul>
          <li><strong>Agent Workflow 与状态管理：</strong>基于 IPD 软件研发流程设计产物驱动式 Workflow，将需求分析、设计、开发、DT、检视等阶段抽象为状态机，由 ManagerAgent 统一编排；通过阶段产物、Completion Condition 与 verifyScript 实现机械化准入，并支持失败重试、人工审批与断点续传，使 Agent 从自由流转转向确定性研发流程。</li>
          <li><strong>上下文工程：</strong>构建 Workspace + Codebase 双层上下文体系，Workspace 沉淀全局业务、架构事实与工程约束，Codebase 承载单服务 SDD、代码及开发态上下文，支持 RR/IR 到 US 不同粒度研发任务的动态上下文注入。</li>
          <li><strong>自动化评测与质量闭环：</strong>搭建 DSABench 三层组合评测与七维评分体系，并结合 verify.py、CodeReview、DT 等机制对阶段产物进行独立校验；通过 Benchmark / Badcase 持续定位问题并驱动 Harness 迭代，累计支撑 4000+ 次内部调用。</li>
        </ul>
        <p><a class="text-link" href="{{ '/2026/11/01/reliable-development-agent-harness/' | relative_url }}">技术复盘：研发 Agent 的流程、上下文与验证闭环 →</a></p>
        <figure class="offer-preview">
          <a href="{{ '/assets/img/huawei-internship-certificate.png' | relative_url }}" target="_blank" rel="noreferrer"><img src="{{ '/assets/img/huawei-internship-certificate.png' | relative_url }}" alt="华为实习证明节选，盖章单位为华为技术有限公司，落款日期为 2026 年 10 月 16 日" loading="lazy"></a>
          <figcaption>华为实习证明 · 节选预览 · 2026.10.16</figcaption>
        </figure></div></div>
      <div class="timeline-item"><div class="timeline-date">2026.05 — 2026.07</div><div><h3>道通科技 · AI Agent 平台实习生</h3>
        <p>面向具身智能的 LLM Agent 引擎（Harness），围绕执行引擎、任务规划、确定性评测和混合检索开展工程实践。</p>
        <ul>
          <li><strong>Agent 执行引擎与任务规划：</strong>设计结构化中间表示（IR/DSL）作为 Agent 可执行计划，采用 Planner + Executor 架构，由 LLM 负责理解与规划，Executor 确定性调度工具执行；引入多级执行预算、自我批判与异常终止机制，降低死循环风险。</li>
          <li><strong>自动化评测与可观测性：</strong>针对 LLM-as-Judge 结果不稳定的问题，将标准答案与 Agent Trace 统一解析为 AST，基于前置条件、动作序列和终态断言进行确定性比对；搭建覆盖无人机、编码、油田等场景的 200+ Benchmark 回归集，通过全链路 Tracing 区分模型规划错误与工具执行错误。</li>
          <li><strong>RAG 与数据驱动规划优化：</strong>构建关键词与 bge 向量双路召回、RRF 融合的混合检索 RAG，为 Planner 动态检索 Few-shot 示例并组装 Prompt；设计高置信模板直用、低置信向量降级及人在回路的数据沉淀机制，通过语料迭代持续优化 Agent 行为，无需额外微调。</li>
        </ul>
      </div></div>
      <div class="timeline-item"><div class="timeline-date">2026.02 — 2026.05</div><div><h3>vivo · GUI Agent 开发实习生</h3>
        <p>面向手机 GUI Agent 的自然语言控机能力，参与功能树与知识库构建、路径检索、规划执行和 Badcase 分层优化。</p>
        <ul>
          <li><strong>GUI 功能树与知识库建设：</strong>基于 ADB 与 DFS 遍历 App 功能页面，将页面描述、控件语义、动作类型和预期变化结构化为 JSON 功能树；覆盖 47 款 App、累计 5000+ 功能节点，为模型数据生产与页面知识库建设提供基础。</li>
          <li><strong>混合检索与指令执行：</strong>基于功能树构建混合检索 RAG，采用关键词与向量双路召回、RRF 融合及元数据过滤检索操作路径；接入 Agent Planning 与 Function Calling，通过 ADB 工具执行指令。在 4000 条指令测试集中，Top5 路径命中率达到 92%。</li>
          <li><strong>Badcase 分层评测与优化：</strong>围绕真实任务建立“知识覆盖 → 路径召回 → 模型规划 → 工具执行”的分层评测闭环，定位失败根因；通过知识补全、RAG 召回优化、泛化样本扩展及 ADB 工具完善进行针对性修复，并用回归评测验证效果。</li>
        </ul>
        <figure class="offer-preview">
          <a href="{{ '/assets/img/vivo-internship-certificate.png' | relative_url }}" target="_blank" rel="noreferrer"><img src="{{ '/assets/img/vivo-internship-certificate.png' | relative_url }}" alt="vivo 实习证明节选，单位为维沃移动通信（深圳）有限公司，落款日期为 2026 年 6 月 1 日" loading="lazy"></a>
          <figcaption>vivo 实习证明 · 节选预览 · 2026.06.01</figcaption>
        </figure></div></div>
      <div class="timeline-item"><div class="timeline-date">2026.01 · 冬季学期</div><div><h3>深圳零一学院 · AI 社会创新实践</h3><p>完成冬季学期 ORIC 课程「AI 赋能社会可持续发展」方向的学习与实践，参与为期 10 天的沉浸式课程与跨学科项目协作。</p>
        <figure class="offer-preview">
          <a href="{{ '/assets/img/x-institute-practice-certificate.jpg' | relative_url }}" target="_blank" rel="noreferrer"><img src="{{ '/assets/img/x-institute-practice-certificate.jpg' | relative_url }}" alt="深圳零一学院 ORIC 课程 AI 赋能社会可持续发展方向结营证书，颁发日期为 2026 年 1 月 29 日" loading="lazy"></a>
          <figcaption>深圳零一学院实践结营证书 · 2026.01.29</figcaption>
        </figure></div></div>
    </div>
  </section>
</div>
