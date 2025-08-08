// assets/navbar.js
(() => {
  'use strict';
  const s = document.currentScript;

  // 1) data-root öncelikli (örn: "/my-website/")
  let ROOT = s?.dataset?.root || '';
  if (!ROOT) {
    // 2) script src'den türet (…/my-website/assets/navbar.js => /my-website/)
    const path = new URL(s.src, location.href).pathname;
    ROOT = path.replace(/assets\/navbar\.js.*$/, '');
  }
  if (!ROOT.endsWith('/')) ROOT += '/';

  // mount
  const mount = document.getElementById('site-nav') || (() => {
    const d = document.createElement('div'); d.id='site-nav';
    document.body.insertBefore(d, document.body.firstChild); return d;
  })();

  mount.innerHTML = `
<nav class="nav-main">
  <div class="nav-inner">
    <a class="brand" href="${ROOT}index.html">Tuna</a>
    <ul class="menu">
      <li><a href="${ROOT}index.html" data-match="home">Home</a></li>
      <li><a href="${ROOT}cv.html" data-match="cv">CV</a></li>
      <li><a href="${ROOT}projects.html" data-match="projects">Projects</a></li>
      <li><button id="themeToggle" type="button" aria-label="Toggle dark mode"></button></li>
    </ul>
  </div>
</nav>`;

  // active link
  const rel = location.pathname.startsWith(ROOT)
    ? location.pathname.slice(ROOT.length)
    : location.pathname.replace(/^\//,'');
  const key = rel.startsWith('projects') ? 'projects'
           : rel.startsWith('cv')       ? 'cv'
           : 'home';
  const a = mount.querySelector(`a[data-match="${key}"]`);
  if (a) a.classList.add('active');
})();
