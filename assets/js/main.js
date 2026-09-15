(() => {
  const article = document.querySelector('.article-body');
  if (article) {
    const words = article.innerText.trim().length;
    const minutes = Math.max(1, Math.round(words / 500));
    const reading = document.getElementById('reading-time');
    if (reading) reading.textContent = `约 ${minutes} 分钟`;

    const headings = [...article.querySelectorAll('h2, h3')];
    const tocList = document.getElementById('toc-list');
    if (tocList && headings.length) {
      headings.forEach((h, i) => {
        if (!h.id) h.id = `section-${i + 1}`;
        const a = document.createElement('a');
        a.href = `#${h.id}`;
        a.textContent = h.textContent;
        a.dataset.text = h.textContent.toLowerCase();
        a.className = h.tagName === 'H3' ? 'toc-h3' : 'toc-h2';
        tocList.appendChild(a);
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            tocList.querySelectorAll('a').forEach(a => a.classList.toggle('current', a.getAttribute('href') === `#${entry.target.id}`));
          }
        });
      }, { rootMargin: '-15% 0px -70% 0px' });
      headings.forEach(h => observer.observe(h));
    }

    const filter = document.getElementById('toc-filter');
    if (filter && tocList) {
      filter.addEventListener('input', () => {
        const q = filter.value.trim().toLowerCase();
        tocList.querySelectorAll('a').forEach(a => a.hidden = q && !a.dataset.text.includes(q));
      });
    }

    article.querySelectorAll('pre').forEach(pre => {
      const wrap = document.createElement('div');
      wrap.className = 'code-wrap';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      const button = document.createElement('button');
      button.className = 'copy-code';
      button.textContent = 'Copy';
      button.addEventListener('click', async () => {
        await navigator.clipboard.writeText(pre.innerText);
        button.textContent = 'Copied';
        setTimeout(() => button.textContent = 'Copy', 1200);
      });
      wrap.appendChild(button);
    });
  }
})();
