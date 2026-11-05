---
layout: default
title: AI Agent 工程学习地图
description: 从工具调用、RAG 和 Agent 编排，到评测、Coding Agent 与项目复盘。按学习目标选择路线，直接阅读系列总纲与章节。
permalink: /learning-map/
---
{% assign series = site.data.series %}
{% assign total_featured = 0 %}
{% for item in series %}
  {% assign published = item.chapters | where: 'status', 'published' %}
  {% assign featured = published | where: 'featured', true %}
  {% assign total_featured = total_featured | plus: featured.size %}
{% endfor %}

<div class="wide-page roadmap">
  <header class="roadmap-hero">
    <p class="eyebrow">LEARNING MAP / AI AGENT ENGINEERING</p>
    <h1>AI Agent 工程学习地图</h1>
    <p class="roadmap-intro">从第一次工具调用，到能追踪、验证和恢复的 Agent 系统。初学可以从基础读起，手上有项目也可以按当前卡点直达对应章节。</p>
    <div class="roadmap-actions">
      <a class="button primary" href="#reading-paths">选择学习路线 ↓</a>
      <a class="button" href="#series-map">查看全部系列 ↓</a>
    </div>
    <p class="roadmap-stats">{{ series.size }} 个系列 <span aria-hidden="true">·</span> {{ total_featured }} 篇主线文章</p>
  </header>

  <section id="reading-paths" class="roadmap-section" aria-labelledby="paths-title">
    <p class="eyebrow">01 / START HERE</p>
    <h2 id="paths-title">按目标选一条路线</h2>
    <div class="roadmap-paths">
      <article>
        <h3>做出第一个 Agent</h3>
        <p>适合会调用模型 API、想做出一个能查资料和调用工具的小项目的读者。</p>
        <ol>
          <li><a href="#agent-foundations">理解工具调用与权限</a></li>
          <li><a href="#rag-context">接入检索与上下文</a></li>
          <li><a href="#workflow-multi-agent">把步骤组织成工作流</a></li>
        </ol>
      </article>
      <article>
        <h3>让现有 Demo 更可靠</h3>
        <p>适合已经跑通原型，正在处理失败恢复、错误定位和回归评测的读者。</p>
        <ol>
          <li><a href="#workflow-multi-agent">记录状态与恢复路径</a></li>
          <li><a href="#evaluation-reliability">用 Trace 和评测定位问题</a></li>
          <li><a href="#project-cases">对照真实案例检查设计</a></li>
        </ol>
      </article>
      <article>
        <h3>构建 Coding Agent</h3>
        <p>适合关注代码库上下文、工具权限和自动验证，想跑通一次代码交付的读者。</p>
        <ol>
          <li><a href="#ai-coding-harness">串起规格、代码修改与验证</a></li>
          <li><a href="#evaluation-reliability">建立可重复运行的评测</a></li>
          <li><a href="#project-cases">复盘 Harness 的工程分工</a></li>
        </ol>
      </article>
    </div>
  </section>

  <section id="series-map" class="roadmap-section" aria-labelledby="series-title">
    <p class="eyebrow">02 / SERIES INDEX</p>
    <h2 id="series-title">从基础到项目实战</h2>
    <p class="roadmap-hint">每个系列只推荐几篇主线文章。术语、实现细节和延伸阅读放在各自的系列页。</p>
    <nav class="roadmap-jump" aria-label="系列导航">
      {% for item in series %}
        <a href="#{{ item.id }}">{{ item.accent }} {{ item.short_title | escape }}</a>
      {% endfor %}
    </nav>

    {% for item in series %}
      {% assign published = item.chapters | where: 'status', 'published' %}
      {% assign featured = published | where: 'featured', true %}
      {% assign overview = published | where: 'no', '00' | first %}
      {% assign series_url = '/series/' | append: item.id | append: '/' %}
      <article class="roadmap-series" id="{{ item.id }}">
        <span class="roadmap-number" aria-hidden="true">{{ item.accent }}</span>
        <div>
          <p class="roadmap-meta">{{ item.category | escape }} <span aria-hidden="true">·</span> {{ featured.size }} 篇主线</p>
          <h3>{{ item.title | escape }}</h3>
          <p>{{ item.description | escape }}</p>
          <p class="roadmap-check"><strong>读完试着回答</strong> {{ item.roadmap_check | escape }}</p>
          <div class="roadmap-actions">
            {% if overview %}<a class="text-link" href="{{ overview.url | relative_url }}">阅读总纲 →</a>{% endif %}
            <a href="{{ series_url | relative_url }}">系列页与补充笔记 →</a>
          </div>
          <details>
            <summary>查看主线文章</summary>
            <ul class="roadmap-chapters">
              {% for chapter in featured %}
                <li><a href="{{ chapter.url | relative_url }}"><span aria-hidden="true">{{ chapter.no }}</span>{{ chapter.title | escape }}</a></li>
              {% endfor %}
            </ul>
          </details>
        </div>
      </article>
    {% endfor %}
  </section>

  <aside class="roadmap-note" aria-label="模型推理服务延伸阅读">
    <strong>延伸阅读 · 模型推理服务</strong>
    <p>如果 Agent 慢在模型调用，先从 KV Cache、请求调度和首 token 延迟入手。</p>
    <a class="text-link" href="{{ '/2026/11/05/vllm-serving-notes/' | relative_url }}">vLLM 学习笔记 →</a>
  </aside>

  <aside class="roadmap-note" aria-label="贯穿全图的工程原则">
    <strong>贯穿全图的工程原则</strong>
    <p>模型负责理解、生成和提出决策。工程系统负责记录状态、限制权限、执行操作、验证结果和处理失败。</p>
    <a class="text-link" href="{{ '/search/' | relative_url }}">搜索文章 →</a>
  </aside>
</div>
