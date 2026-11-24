(function () {
  function show(message) {
    var root = document.getElementById('root');
    if (!root) return;
    var note = document.getElementById('boot-error');
    if (!note) {
      note = document.createElement('p');
      note.id = 'boot-error';
      note.style.cssText = 'padding:24px;color:#a12626;white-space:pre-wrap;font:16px/1.6 system-ui';
      note.setAttribute('role', 'alert');
      root.prepend(note);
    }
    note.textContent = '项目启动失败：' + message + '\n请把这条具体错误发给作者。';
  }
  window.addEventListener('error', function (event) {
    if (event.target && event.target.tagName === 'SCRIPT') show('程序文件加载失败：' + event.target.src);
    else if (event.message) show(event.message);
  }, true);
  window.addEventListener('unhandledrejection', function (event) {
    show(String(event.reason && event.reason.message || event.reason));
  });
})();
