(() => {
  const input = document.getElementById('site-search');
  const results = document.getElementById('search-results');
  if (!input || !results || !window.SEARCH_INDEX) return;
  const render = () => {
    const q = input.value.trim().toLowerCase();
    results.innerHTML = '';
    if (!q) { results.innerHTML = '<p class="muted">输入关键词搜索文章标题、摘要和标签。</p>'; return; }
    const hits = window.SEARCH_INDEX.filter(item => `${item.title} ${item.excerpt} ${item.content || ""} ${item.tags}`.toLowerCase().includes(q));
    if (!hits.length) { results.innerHTML = '<p class="muted">没有匹配文章。</p>'; return; }
    hits.forEach(item => {
      const el = document.createElement('article');
      el.className = 'search-hit';
      el.innerHTML = `<h2><a href="${item.url}">${item.title}</a></h2><p>${item.excerpt}</p><div class="post-tags">${item.tags.split(' ').map(t => `<span>#${t}</span>`).join('')}</div>`;
      results.appendChild(el);
    });
  };
  input.addEventListener('input', render);
  render();
})();
