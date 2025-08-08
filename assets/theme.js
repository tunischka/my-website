// /assets/theme.js
(() => {
  'use strict';
  if (window.__theme_inited) return;
  window.__theme_inited = true;

  const KEY = 'theme';
  const root = document.documentElement;
  const set = t => { root.setAttribute('data-theme', t); try{localStorage.setItem(KEY,t);}catch(e){} };

  const initial = localStorage.getItem(KEY)
    || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  set(initial);

  function attachInNavbar(){
    const btn = document.getElementById('themeToggle');
    if (!btn) return null;

    btn.classList.add('switch');      // switch görünümü
    btn.textContent = '';             // emoji varsa kaldır

    let wrap = btn.closest('.theme-switch');
    if (!wrap){
      wrap = document.createElement('span');
      wrap.className = 'theme-switch';
      btn.parentNode.insertBefore(wrap, btn);
      wrap.appendChild(btn);
    }
    let label = wrap.querySelector('.theme-label');
    if (!label){
      label = document.createElement('span');
      label.className = 'theme-label';
      label.textContent = 'There shall be a light!';
      wrap.appendChild(label);
    }
    btn.addEventListener('click', toggle);
    return {wrap, btn, label};
  }

  function createFloating(){
    const wrap = document.createElement('div');
    wrap.className = 'theme-switch theme-floating';

    const btn = document.createElement('button');
    btn.id = 'themeToggle';
    btn.className = 'switch';
    btn.type = 'button';

    const label = document.createElement('span');
    label.className = 'theme-label';
    label.textContent = 'there shall be a light';

    wrap.append(btn, label);
    document.addEventListener('DOMContentLoaded', ()=> document.body.appendChild(wrap));
    btn.addEventListener('click', toggle);
    return {wrap, btn, label};
  }

  function toggle(){
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    set(next);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const wired = attachInNavbar();
    if (!wired) createFloating();
  });
})();
