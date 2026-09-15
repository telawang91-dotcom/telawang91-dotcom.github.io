---
layout: default
title: AI Agent Learning Map
permalink: /learning-map/
---
<div class="wide-page">
  <p class="eyebrow">ROADMAP</p>
  <h1>AI Agent Engineering Learning Map</h1>
  <p class="lead">从“让模型会调用工具”到“让 Agent 系统可控、可验证、可迭代”。这张图也是这个博客的长期内容目录。</p>

  <div class="map-grid">
    <section class="map-card"><div class="map-index">01</div><h2>Foundation</h2><p>LLM · Prompt · Structured Output · JSON Schema · API</p><a href="{{ '/tags/#Foundation' | relative_url }}">进入基础层 →</a></section>
    <section class="map-card"><div class="map-index">02</div><h2>Tool Use</h2><p>Function Calling · MCP · Tool Schema · Permission · Retry</p><a href="{{ '/tags/#Tool-Use' | relative_url }}">进入工具层 →</a></section>
    <section class="map-card"><div class="map-index">03</div><h2>Retrieval & Context</h2><p>RAG · Hybrid Search · RRF · Rerank · Memory · Context Engineering</p><a href="{{ '/tags/#RAG' | relative_url }}">进入上下文层 →</a></section>
    <section class="map-card"><div class="map-index">04</div><h2>Agent Runtime</h2><p>Planning · Planner/Executor · Workflow · State Machine · Checkpoint</p><a href="{{ '/tags/#Workflow' | relative_url }}">进入运行时 →</a></section>
    <section class="map-card"><div class="map-index">05</div><h2>Multi-Agent</h2><p>Supervisor · Manager Agent · Delegation · Shared State · Handoff</p><a href="{{ '/tags/#Multi-Agent' | relative_url }}">进入多智能体 →</a></section>
    <section class="map-card"><div class="map-index">06</div><h2>Evaluation & Reliability</h2><p>Tracing · Benchmark · Badcase · Guardrail · Deterministic Check · HITL</p><a href="{{ '/tags/#Evaluation' | relative_url }}">进入评测层 →</a></section>
    <section class="map-card"><div class="map-index">07</div><h2>AI Coding</h2><p>Codebase Context · Workspace · Coding Agent · Harness · Verification</p><a href="{{ '/tags/#AI-Coding' | relative_url }}">进入 AI Coding →</a></section>
  </div>

  <div class="map-principle">
    <strong>主线原则</strong>
    <span>LLM 负责理解与生成不确定性决策；工程系统负责状态、权限、执行、验证和恢复。</span>
  </div>
</div>
