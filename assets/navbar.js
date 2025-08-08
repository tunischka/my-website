// assets/navbar.js
(() => {
  'use strict';

  // Root'u otomatik bul: /my-website/   (script yolundan)
  const s = document.currentScript;
  const assetsPath = new URL(s.getAttribute('src'), location.href).pathname; // /my-website/assets/navbar.js
  const ROOT = assetsPath.replace(/assets\/navbar\.js$/, '');                // /my-website/

  // Mount noktası
  const mount = document.getElementById('site-nav') || (function () {
    const d = document.createElement('div'); d.id = 'site-nav';
    document.body.insertBefore(d, document.body.firstChild);
    return d;
  })();

  // HTML
  mount.innerHTML = `
<nav class="nav-main">
  <div class="nav-inner">
    <a class="brand" href="${ROOT}index.html">Tuna</a>
    <ul class="menu">
      <li><a href="${ROOT}index.html" data-match="home">Home</a></li>
      <li><a href="${ROOT}cv.html" data-match="cv">CV</a></li>
      <li><a href="${ROOT}projects.html" data-match="projects">Projects</a></li>
      <li><button id="themeToggle" type="button" aria-label="Toggle dark mode">🌓</button></li>
    </ul>
  </div>
</nav>`;

  // Aktif link (alt sayfalarda da çalışır)
  const path = location.pathname.replace(ROOT, ''); // '' | index.html | cv.html | projects/... 
  const key  = path.startsWith('projects') ? 'projects'
             : path.startsWith('cv')       ? 'cv'
             : 'home';
  const active = mount.querySelector(`a[data-match="${key}"]`);
  if (active) active.classList.add('active');
})();
