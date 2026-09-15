---
layout: default
title: Projects
permalink: /projects/
description: "Wang Xinfeng 的公开 AI Agent 工程项目：ReproLab、Smart Home Multi-Agent 与本地健康管理系统。"
---
<div class="wide-page projects-page">
  <div class="projects-intro">
    <p class="eyebrow">BUILDING</p>
    <h1>Projects</h1>
    <p class="lead">这里不按“做过什么”罗列，而按“解决了什么工程问题”组织。每个项目都尽量保留可运行代码、架构说明与真实界面。</p>
  </div>

  <article class="project-showcase">
    <div class="project-copy">
      <div class="project-kicker">FEATURED · AI RESEARCH AGENT</div>
      <h2>ReproLab</h2>
      <p class="project-slogan">让科研 AI 的每个数字都有来路，每个结论都能重跑。</p>
      <p>一个本地优先的科研 AI 工作台，把资料检索、动态分析、成果写作、数据血缘和可复现校验连接成可信研究闭环。核心不是“再做一个聊天框”，而是让证据、代码、数据和结论之间形成可审计链路。</p>

      <div class="project-metrics"><span>Planner / Executor / Critic</span><span>Hybrid RAG</span><span>Provenance</span><span>Reproduction</span><span>Next.js + FastAPI</span></div>

      <div class="mini-arch"><span>Document / Dataset</span><b>→</b><span>Hybrid RAG</span><b>→</b><span>Agent</span><b>→</b><span>Run</span><b>→</b><span>Artifact</span><b>→</b><span>Claim</span></div>

      <div class="project-facts">
        <div><strong>Trust anchor</strong><span>Dataset → Run → Artifact → Claim</span></div>
        <div><strong>Retrieval</strong><span>BM25 + pgvector + RRF + reranker</span></div>
        <div><strong>Reliability</strong><span>Re-run · drift detection · validation</span></div>
      </div>

      <div class="repo-actions">
        <a class="button primary" href="https://github.com/telawang91-dotcom/reprolab" target="_blank" rel="noreferrer">GitHub Repository ↗</a>
        <a class="button" href="https://github.com/telawang91-dotcom/reprolab/blob/main/README.md" target="_blank" rel="noreferrer">Architecture & Docs ↗</a>
      </div>
    </div>

    <div class="project-visual">
      <a href="https://github.com/telawang91-dotcom/reprolab" target="_blank" rel="noreferrer">
        <img class="project-screen" src="https://raw.githubusercontent.com/telawang91-dotcom/reprolab/main/docs/images/workbench-home.png" alt="ReproLab 科研工作台界面" loading="lazy">
      </a>
      <p class="project-caption">ReproLab · research workbench</p>
      <div class="project-gallery two-up">
        <img src="https://raw.githubusercontent.com/telawang91-dotcom/reprolab/main/docs/images/knowledge-space.png" alt="ReproLab 知识空间" loading="lazy">
        <img src="https://raw.githubusercontent.com/telawang91-dotcom/reprolab/main/docs/images/getting-started.png" alt="ReproLab 首次使用引导" loading="lazy">
      </div>
    </div>
  </article>

  <article class="project-showcase reverse">
    <div class="project-copy">
      <div class="project-kicker">MULTI-AGENT · SMART HOME</div>
      <h2>Smart Home Multi-Agent</h2>
      <p class="project-slogan">用可验证的 Multi-Agent 流程替代刚性的 if-then 规则。</p>
      <p>面向老年照护场景，完成“感知 → 预测 → 决策 → 验证 → 执行”闭环。系统使用 LangGraph Supervisor 协同 Worker Agents，并通过设备抽象层接入 Home Assistant、REST、WebSocket 和 Docker 部署。</p>

      <div class="mini-arch"><span>Perception</span><b>→</b><span>Prediction</span><b>→</b><span>Decision</span><b>→</b><span>Validation</span><b>→</b><span>Execution</span></div>
      <div class="project-metrics"><span>LangGraph</span><span>FastAPI</span><span>WebSocket</span><span>Home Assistant</span><span>85% E2E Completion</span></div>

      <div class="project-facts">
        <div><strong>Orchestration</strong><span>Supervisor + Worker Agents</span></div>
        <div><strong>Prediction</strong><span>Holt-Winters / Holt / Newton Cooling</span></div>
        <div><strong>Safety</strong><span>Multi-sensor fusion + validation before action</span></div>
      </div>

      <div class="repo-actions">
        <a class="button primary" href="https://github.com/telawang91-dotcom/smart-home-multi-agent" target="_blank" rel="noreferrer">GitHub Repository ↗</a>
        <a class="button" href="https://github.com/telawang91-dotcom/smart-home-multi-agent/blob/main/docs/architecture.svg" target="_blank" rel="noreferrer">Architecture ↗</a>
      </div>
    </div>

    <div class="project-visual">
      <a href="https://github.com/telawang91-dotcom/smart-home-multi-agent" target="_blank" rel="noreferrer">
        <img class="project-screen" src="https://raw.githubusercontent.com/telawang91-dotcom/smart-home-multi-agent/main/docs/showcase/showcase-hero.png" alt="Smart Home Multi-Agent 前端展示" loading="lazy">
      </a>
      <p class="project-caption">Smart Home Multi-Agent · desktop dashboard</p>
      <img class="project-demo" src="https://raw.githubusercontent.com/telawang91-dotcom/smart-home-multi-agent/main/docs/showcase/showcase-demo.gif" alt="Smart Home Multi-Agent Demo" loading="lazy">
    </div>
  </article>

  <article class="project-showcase compact-project">
    <div class="project-copy">
      <div class="project-kicker">LOCAL LLM · PRODUCT PROTOTYPE</div>
      <h2>Elderly Health Management</h2>
      <p class="project-slogan">把本地大模型放进健康管理工作流，而不是只做一个问答页面。</p>
      <p>基于 Flask、Ollama、本地模型与可视化组件构建的智慧养老健康管理原型，强调本地优先、老年友好交互和健康数据闭环。</p>
      <div class="project-metrics"><span>Flask</span><span>Ollama</span><span>Local LLM</span><span>Health Visualization</span></div>
      <div class="repo-actions"><a class="button" href="https://github.com/telawang91-dotcom/elderly-health-management" target="_blank" rel="noreferrer">GitHub Repository ↗</a></div>
    </div>
    <div class="project-note">
      <span>PROJECT NOTE</span>
      <p>这个项目保留了我从“AI 功能”走向“Agent 工程”的早期产品思路：模型能力必须被放进完整的业务状态、数据和交互闭环中。</p>
    </div>
  </article>

  <section class="project-footer-note">
    <p>更多代码与实验项目见 <a class="text-link" href="https://github.com/telawang91-dotcom" target="_blank" rel="noreferrer">github.com/telawang91-dotcom ↗</a></p>
  </section>
</div>
