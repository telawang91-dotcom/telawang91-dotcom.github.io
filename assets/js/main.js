(() => {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    const applyTheme = (theme) => {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem('theme', theme);
      themeToggle.textContent = theme === 'dark' ? '☀' : '◐';
      themeToggle.setAttribute('aria-label', theme === 'dark' ? '切换到浅色主题' : '切换到深色主题');
    };
    applyTheme(document.documentElement.dataset.theme || 'light');
    themeToggle.addEventListener('click', () => {
      applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  }

  const article = document.querySelector('.article-body');
  if (article) {
    const words = article.innerText.trim().length;
    const minutes = Math.max(1, Math.round(words / 500));
    const reading = document.getElementById('reading-time');
    if (reading) reading.textContent = `约 ${minutes} 分钟`;

    const progressBar = document.getElementById('reading-progress-bar');
    if (progressBar) {
      const updateProgress = () => {
        const rect = article.getBoundingClientRect();
        const articleTop = window.scrollY + rect.top;
        const articleHeight = article.offsetHeight;
        const viewport = window.innerHeight;
        const max = Math.max(1, articleHeight - viewport * 0.35);
        const current = Math.min(max, Math.max(0, window.scrollY - articleTop + viewport * 0.2));
        progressBar.style.width = `${Math.min(100, (current / max) * 100)}%`;
      };
      updateProgress();
      window.addEventListener('scroll', updateProgress, { passive: true });
      window.addEventListener('resize', updateProgress);
    }

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

    const copyLink = document.getElementById('copy-link');
    if (copyLink) {
      copyLink.addEventListener('click', async () => {
        await navigator.clipboard.writeText(window.location.href);
        copyLink.textContent = '已复制';
        copyLink.dataset.done = 'true';
        setTimeout(() => {
          copyLink.textContent = '复制文章链接';
          copyLink.dataset.done = 'false';
        }, 1400);
      });
    }

    const share = document.getElementById('share-article');
    if (share) {
      share.addEventListener('click', async () => {
        if (navigator.share) {
          try {
            await navigator.share({ title: document.title, url: window.location.href });
          } catch (e) {
            if (e.name !== 'AbortError') console.warn(e);
          }
        } else {
          await navigator.clipboard.writeText(window.location.href);
          share.textContent = '链接已复制';
          setTimeout(() => share.textContent = '分享文章', 1400);
        }
      });
    }
  }
})();
