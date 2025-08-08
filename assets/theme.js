// /assets/theme.js
(() => {
  'use strict';
  if (window.__theme_inited) return;
  window.__theme_inited = true;

  const KEY = 'theme';
  const root = document.documentElement;

  const set = (t) => {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem(KEY, t); } catch(e) {}
  };

  // initial: saved > system > light
  const initial = localStorage.getItem(KEY)
    || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light');
  set(initial);

  // Attach to an existing #themeToggle (e.g., in navbar), else create floating
  function attachToExistingButton(){
    const btn = document.getElementById('themeToggle');
    if (!btn) return null;

    let wrap = btn.closest('.theme-wrap');
    if (!wrap) {
      wrap = document.createElement('span');
      wrap.className = 'theme-wrap';
      btn.parentNode.insertBefore(wrap, btn);
      wrap.appendChild(btn);
    }
    let pill = wrap.querySelector('.theme-pill');
    if (!pill) {
      pill = document.createElement('span');
      pill.className = 'theme-pill';
      wrap.appendChild(pill);
    }
    btn.addEventListener('click', onToggle);
    return {wrap, btn, pill};
  }

  function createFloatingWidget(){
    const wrap = document.createElement('div');
    wrap.className = 'theme-wrap theme-floating';

    const btn = document.createElement('button');
    btn.id = 'themeToggle';
    btn.type = 'button';
    btn.textContent = '🌓';

    const pill = document.createElement('span');
    pill.className = 'theme-pill';

    wrap.appendChild(btn);
    wrap.appendChild(pill);
    document.body.appendChild(wrap);

    btn.addEventListener('click', onToggle);
    return {wrap, btn, pill};
  }

  function showPill(msg){
    const pill = document.querySelector('.theme-pill');
    if (!pill) return;
    pill.textContent = msg;
    pill.classList.remove('show');     // restart anim
    void pill.offsetWidth;             // reflow
    pill.classList.add('show');
  }

  function onToggle(){
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    set(next);
    // İstenen mesaj: light'a geçince sağa doğru kapsül göster
    if (next === 'light') showPill('there shall be a light');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const attached = attachToExistingButton();
    if (!attached) createFloatingWidget();
  });
})();
