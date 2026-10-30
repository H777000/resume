(() => {
  const local = ['127.0.0.1', 'localhost'].includes(location.hostname);
  const origin = window.PORTFOLIO_DEMO_ORIGIN || (local ? (location.port === '8769' ? location.origin : 'http://127.0.0.1:8769') : '');
  const demoBase = new URL('/demo/', origin || location.origin);
  // Warm up only the connection: no iframe, API call or generation is started.
  if (origin && new URL(origin).origin !== location.origin) {
    const connection = document.createElement('link');
    connection.rel = 'preconnect'; connection.href = new URL(origin).origin;
    document.head.append(connection);
  }
  const cards = [...document.querySelectorAll('#experience .timeline > article')];
  ['ppt', 'translate'].forEach((kind, i) => {
    const card = cards[i]; if (!card) return;
    const details = document.createElement('details'); details.className = 'portfolio-demo';
    const label = ['Agent PPT', '学术翻译'][i];
    const summary = document.createElement('summary');
    summary.innerHTML = '<span class="demo-entry-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="13" rx="3"/><path d="M8 21h8M12 17v4"/><path d="m10 8 5 3-5 3Z" fill="currentColor" stroke="none"/></svg></span><span class="demo-entry-copy"><span class="demo-entry-title">在线体验 · '+label+'</span><span class="demo-entry-subtitle">'+(kind==='ppt'?'输入主题，逐页生成可编辑演示文稿':'上传文档或输入文字，体验双语翻译')+'</span></span><span class="demo-entry-action"><span class="demo-entry-open">展开体验</span><span class="demo-entry-close">收起体验</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 8 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
    const box = document.createElement('div'); box.className = 'portfolio-demo-body';
    details.append(summary, box); card.append(details);
    function mountDemo() {
      if (!details.open || box.childElementCount) return;
      if (!origin || kind === 'xiangban') { const p = document.createElement('p'); p.textContent = kind === 'xiangban' ? '原项目界面尚在接入，暂未开放体验。' : '体验后台尚未公开，接入后可直接在这里使用。'; box.append(p); return; }
      const loading = document.createElement('p'); loading.setAttribute('role', 'status'); loading.textContent = '正在加载项目界面…'; box.append(loading);
      const frame = document.createElement('iframe'); frame.title = '在线体验 · ' + label;
      const frameUrl = new URL(demoBase); frameUrl.searchParams.set('project', kind);
      frame.src = frameUrl.href;
      frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-downloads allow-forms');
      frame.loading = 'eager';
      // A frame load event also fires for some error pages. Wait for the app itself.
      const timeout = setTimeout(() => {
        loading.textContent = '项目界面加载较慢。如出现访问确认页，请点击 Visit Site；否则请检查网络后重试。';
        const retry = document.createElement('button');
        retry.type = 'button'; retry.textContent = '重新加载';
        retry.onclick = () => { window.removeEventListener('message', onReady); box.replaceChildren(); mountDemo(); };
        loading.append(' ', retry);
      }, 30000);
      const onReady = event => {
        if (event.source !== frame.contentWindow || event.origin !== frameUrl.origin || event.data?.type !== 'portfolio-demo-ready') return;
        clearTimeout(timeout); loading.remove(); window.removeEventListener('message', onReady);
      };
      window.addEventListener('message', onReady);
      frame.addEventListener('error', () => { loading.textContent = '体验服务暂时无法连接，请稍后重试。'; });
      box.append(frame);
    }
    details.addEventListener('toggle', mountDemo);
  });
})();
