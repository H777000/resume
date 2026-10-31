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
    summary.innerHTML = '<span class="demo-art demo-art-'+kind+'" aria-hidden="true"><span class="demo-art-back"></span><span class="demo-art-front">'+(kind==='ppt'?'<i></i><b></b><em></em>':'<b>A</b><i>文</i>')+'</span></span><span class="demo-entry-copy"><span class="demo-entry-eyebrow">互动演示</span><span class="demo-entry-title">亲手体验 '+label+'</span><span class="demo-entry-subtitle">'+(kind==='ppt'?'从一个主题，到可编辑的演示文稿':'从一段文字，到双语对照阅读')+'</span></span><span class="demo-entry-action"><span class="demo-entry-open">开始体验</span><span class="demo-entry-close">收起演示</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
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
    details.addEventListener('toggle', () => {
      mountDemo();
      if (details.open && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        box.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:320,easing:'ease-out'});
      }
    });
  });
})();
