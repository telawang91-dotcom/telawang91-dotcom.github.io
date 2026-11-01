---
layout: default
title: Projects
permalink: /projects/
description: "Wang Xinfeng �Ĺ��� AI Agent ������Ŀ��ʵ���ʼǣ�ReproLab��Smart Home Multi-Agent��GUI Agent ���з� Agent Harness��"
---
<div class="wide-page projects-page">
  <div class="projects-intro">
    <p class="eyebrow">BUILDING</p>
    <h1>Projects</h1>
    <p class="lead">���ﲻ��������ʲô�����У������������ʲô�������⡱��֯��ÿ����Ŀ���������������д��롢�ܹ�˵������ʵ���档</p>
  </div>

  <article class="project-showcase">
    <div class="project-copy">
      <div class="project-kicker">FEATURED �� AI RESEARCH AGENT</div>
      <h2>ReproLab</h2>
      <p class="project-slogan">�ÿ��� AI ��ÿ�����ֶ�����·��ÿ�����۶������ܡ�</p>
      <p>һ���������ȵĿ��� AI ����̨�������ϼ�������̬�������ɹ�д��������ѪԵ�Ϳɸ���У�����ӳɿ����о��ջ������Ĳ��ǡ�����һ������򡱣�������֤�ݡ����롢���ݺͽ���֮���γɿ������·��</p>

      <div class="project-metrics"><span>Planner / Executor / Critic</span><span>Hybrid RAG</span><span>Provenance</span><span>Reproduction</span><span>Next.js + FastAPI</span></div>

      <div class="mini-arch"><span>Document / Dataset</span><b>��</b><span>Hybrid RAG</span><b>��</b><span>Agent</span><b>��</b><span>Run</span><b>��</b><span>Artifact</span><b>��</b><span>Claim</span></div>

      <div class="project-facts">
        <div><strong>Trust anchor</strong><span>Dataset �� Run �� Artifact �� Claim</span></div>
        <div><strong>Retrieval</strong><span>BM25 + pgvector + RRF + reranker</span></div>
        <div><strong>Reliability</strong><span>Re-run �� drift detection �� validation</span></div>
      </div>

      <div class="repo-actions">
        <a class="button primary" href="https://github.com/telawang91-dotcom/reprolab" target="_blank" rel="noreferrer">GitHub Repository �J</a>
        <a class="button" href="https://github.com/telawang91-dotcom/reprolab/blob/main/README.md" target="_blank" rel="noreferrer">Architecture & Docs �J</a>
      </div>
    </div>

    <div class="project-visual">
      <a href="https://github.com/telawang91-dotcom/reprolab" target="_blank" rel="noreferrer">
        <img class="project-screen" src="https://raw.githubusercontent.com/telawang91-dotcom/reprolab/main/docs/images/workbench-home.png" alt="ReproLab ���й���̨����" loading="lazy">
      </a>
      <p class="project-caption">ReproLab �� research workbench</p>
      <div class="project-gallery two-up">
        <img src="https://raw.githubusercontent.com/telawang91-dotcom/reprolab/main/docs/images/knowledge-space.png" alt="ReproLab ֪ʶ�ռ�" loading="lazy">
        <img src="https://raw.githubusercontent.com/telawang91-dotcom/reprolab/main/docs/images/getting-started.png" alt="ReproLab �״�ʹ������" loading="lazy">
      </div>
    </div>
  </article>

  <article class="project-showcase reverse">
    <div class="project-copy">
      <div class="project-kicker">MULTI-AGENT �� SMART HOME</div>
      <h2>Smart Home Multi-Agent</h2>
      <p class="project-slogan">�ÿ���֤�� Multi-Agent ����������Ե� if-then ����</p>
      <p>���������ջ���������ɡ���֪ �� Ԥ�� �� ���� �� ��֤ �� ִ�С��ջ���ϵͳʹ�� LangGraph Supervisor Эͬ Worker Agents����ͨ���豸�������� Home Assistant��REST��WebSocket �� Docker ����</p>

      <div class="mini-arch"><span>Perception</span><b>��</b><span>Prediction</span><b>��</b><span>Decision</span><b>��</b><span>Validation</span><b>��</b><span>Execution</span></div>
      <div class="project-metrics"><span>LangGraph</span><span>FastAPI</span><span>WebSocket</span><span>Home Assistant</span><span>85% E2E Completion</span></div>

      <div class="project-facts">
        <div><strong>Orchestration</strong><span>Supervisor + Worker Agents</span></div>
        <div><strong>Prediction</strong><span>Holt-Winters / Holt / Newton Cooling</span></div>
        <div><strong>Safety</strong><span>Multi-sensor fusion + validation before action</span></div>
      </div>

      <div class="repo-actions">
        <a class="button primary" href="https://github.com/telawang91-dotcom/smart-home-multi-agent" target="_blank" rel="noreferrer">GitHub Repository �J</a>
        <a class="button" href="https://github.com/telawang91-dotcom/smart-home-multi-agent/blob/main/docs/architecture.svg" target="_blank" rel="noreferrer">Architecture �J</a>
      </div>
    </div>

    <div class="project-visual">
      <a href="https://github.com/telawang91-dotcom/smart-home-multi-agent" target="_blank" rel="noreferrer">
        <img class="project-screen" src="https://raw.githubusercontent.com/telawang91-dotcom/smart-home-multi-agent/main/docs/showcase/showcase-hero.png" alt="Smart Home Multi-Agent ǰ��չʾ" loading="lazy">
      </a>
      <p class="project-caption">Smart Home Multi-Agent �� desktop dashboard</p>
      <img class="project-demo" src="https://raw.githubusercontent.com/telawang91-dotcom/smart-home-multi-agent/main/docs/showcase/showcase-demo.gif" alt="Smart Home Multi-Agent Demo" loading="lazy">
    </div>
  </article>

  <article class="project-showcase compact-project">
    <div class="project-copy">
      <div class="project-kicker">LOCAL LLM �� PRODUCT PROTOTYPE</div>
      <h2>Elderly Health Management</h2>
      <p class="project-slogan">�ѱ��ش�ģ�ͷŽ�����������������������ֻ��һ���ʴ�ҳ�档</p>
      <p>���� Flask��Ollama������ģ������ӻ�����������ǻ����Ͻ�������ԭ�ͣ�ǿ���������ȡ������Ѻý����ͽ������ݱջ���</p>
      <div class="project-metrics"><span>Flask</span><span>Ollama</span><span>Local LLM</span><span>Health Visualization</span></div>
      <div class="repo-actions"><a class="button" href="https://github.com/telawang91-dotcom/elderly-health-management" target="_blank" rel="noreferrer">GitHub Repository �J</a></div>
    </div>
    <div class="project-note">
      <span>PROJECT NOTE</span>
      <p>�����Ŀ�������Ҵӡ�AI ���ܡ�����Agent ���̡������ڲ�Ʒ˼·��ģ���������뱻�Ž�������ҵ��״̬�����ݺͽ����ջ��С�</p>
    </div>
  </article>

  <article class="project-showcase compact-project">
    <div class="project-copy">
      <div class="project-kicker">GUI AGENT �� KNOWLEDGE PIPELINE</div>
      <h2>GUI ����֪ʶ����ָ��� Agent</h2>
      <p class="project-slogan">���������·��ת��Ϊ�ɼ���������֪ʶ�������ָ�</p>
      <p>����ֻ���ͼ����ģ̬�������������̽������ GUI ����������ͨ���ڵ��ƽ����������ǿ����ͼ���������ָ��������ӽ�����������Ȼ���Բ���֪ʶ��</p>
      <div class="project-metrics"><span>ADB</span><span>Multimodal LLM</span><span>GUI Tree</span><span>BM25</span><span>Instruction Augmentation</span></div>
      <div class="repo-actions"><a class="button primary" href="https://github.com/telawang91-dotcom/vivo-gui-instruction-agent" target="_blank" rel="noreferrer">GitHub Repository �J</a><a class="button" href="https://github.com/telawang91-dotcom/vivo-gui-instruction-agent/tree/main/docs" target="_blank" rel="noreferrer">System Design �J</a></div>
    </div>
    <div class="project-note"><span>PROJECT DOCUMENTATION</span><p>�ֿ��ṩ��Ŀ������ϵͳ����ĵ���˵���ɼ�������������������ָ����ƣ���ǰ����������Դ����ԭʼ�ɼ����ݡ�</p></div>
  </article>

  <section class="project-footer-note">
    <p>�з� Agent Harness �Ĺ��̾��������� <a class="text-link" href="{{ '/2026/11/01/reliable-development-agent-harness/' | relative_url }}">�淶������������֤�ջ�</a>������Ϊͨ�ü������̣���������ҵ��ĿԴ�롣</p>
    <p>���������ʵ����Ŀ�� <a class="text-link" href="https://github.com/telawang91-dotcom" target="_blank" rel="noreferrer">github.com/telawang91-dotcom �J</a></p>
  </section>
</div>
