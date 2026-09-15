---
layout: default
title: Projects
permalink: /projects/
---
<div class="narrow-page projects-page">
  <p class="eyebrow">BUILDING</p>
  <h1>Projects</h1>
  <p class="lead">这里不按“做过什么”罗列，而按“解决了什么工程问题”组织。</p>

  <article class="project-feature">
    <div class="project-kicker">FEATURED · AI RESEARCH AGENT</div>
    <h2>ReproLab</h2>
    <p class="project-slogan">让科研 AI 的每个数字都有来路，每个结论都能重跑。</p>
    <p>一个本地优先的科研 AI 工作台，把资料检索、动态分析、成果写作、数据血缘和可复现校验连接成可信研究闭环。</p>
    <div class="project-metrics"><span>Planner / Executor / Critic</span><span>Hybrid RAG</span><span>Provenance</span><span>Reproduction</span><span>Next.js + FastAPI</span></div>
    <div class="mini-arch"><span>Document / Dataset</span><b>→</b><span>Hybrid RAG</span><b>→</b><span>Agent</span><b>→</b><span>Run</span><b>→</b><span>Artifact</span><b>→</b><span>Claim</span></div>
    <p><a class="text-link" href="https://github.com/telawang91-dotcom/reprolab" target="_blank" rel="noreferrer">View repository →</a></p>
  </article>

  <article class="project-feature">
    <div class="project-kicker">MULTI-AGENT · SMART HOME</div>
    <h2>Smart Home Multi-Agent</h2>
    <p class="project-slogan">用可验证的 Multi-Agent 流程替代刚性的 if-then 规则。</p>
    <p>面向老年照护场景，完成感知、预测、决策、验证、执行闭环，使用 LangGraph Supervisor 协同 Worker Agents，并接入 Home Assistant、WebSocket 和 Docker。</p>
    <div class="mini-arch"><span>Perception</span><b>→</b><span>Prediction</span><b>→</b><span>Decision</span><b>→</b><span>Validation</span><b>→</b><span>Execution</span></div>
    <div class="project-metrics"><span>LangGraph</span><span>FastAPI</span><span>WebSocket</span><span>Home Assistant</span><span>85% E2E Completion</span></div>
    <p><a class="text-link" href="https://github.com/telawang91-dotcom/smart-home-multi-agent" target="_blank" rel="noreferrer">View repository →</a></p>
  </article>

  <article class="project-feature compact-project">
    <div class="project-kicker">LOCAL LLM · PRODUCT PROTOTYPE</div>
    <h2>Elderly Health Management</h2>
    <p>基于 Flask、Ollama、本地大模型与可视化组件的智慧养老健康管理系统，强调本地优先、老年友好交互与健康数据闭环。</p>
    <p><a class="text-link" href="https://github.com/telawang91-dotcom/elderly-health-management" target="_blank" rel="noreferrer">View repository →</a></p>
  </article>
</div>
