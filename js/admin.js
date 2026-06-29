
(function () {
  'use strict';

  const SESSION_KEY = 'hb_admin_session';
  const DATA_PATH = 'data/portfolio.json';
  const MSG_KEY = 'hb_messages';

  // ------- AUTH GATE -------
  const session = sessionStorage.getItem(SESSION_KEY);
  if (!session) {
    window.location.replace('login.html');
    return;
  }
  try {
    const sess = JSON.parse(session);
    const userEl = document.getElementById('adminUser');
    if (userEl) userEl.textContent = sess.user || 'admin';
  } catch (_) { /* ignore */ }

  // ------- STATE -------
  let DATA = null;
  let dirty = { profile: false, skills: false, projects: false, settings: false };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ------- LOAD -------
  async function loadData() {
    try {
      const res = await fetch(DATA_PATH + '?v=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) throw new Error('load failed');
      DATA = await res.json();
    } catch (err) {
      console.error(err);
      DATA = {
        profile: {}, skills: [], projects: [],
        messages: [], settings: {}, admin: { username: 'admin', password: 'hamza2026' }
      };
    }
    // Merge in any locally-saved messages
    const localMsgs = JSON.parse(localStorage.getItem(MSG_KEY) || '[]');
    DATA.messages = localMsgs;
    return DATA;
  }

  // ------- SAVE (download updated JSON) -------
  function saveDataAsDownload() {
    // Strip messages — they're stored in localStorage on the public site
    const exportData = { ...DATA, messages: [] };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }

  // ------- TABS -------
  function setupTabs() {
    const items = $$('.admin-nav-item');
    const panels = $$('.admin-panel');
    items.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.getAttribute('data-tab');
        items.forEach(i => i.classList.toggle('is-active', i === item));
        panels.forEach(p => p.classList.toggle('is-active', p.getAttribute('data-panel') === tab));
        // Update hash without scrolling
        history.replaceState(null, '', '#' + tab);
        if (tab === 'messages') renderMessages();
      });
    });

    // Open tab from hash if present
    const hash = (location.hash || '').replace('#', '');
    if (hash) {
      const target = items.find(i => i.getAttribute('data-tab') === hash);
      if (target) target.click();
    }
  }

  // ------- PROFILE -------
  function renderProfile() {
    const form = $('#profileForm');
    if (!form || !DATA.profile) return;
    const p = DATA.profile;
    form.elements['name'].value = p.name || '';
    form.elements['title'].value = p.title || '';
    form.elements['location'].value = p.location || '';
    form.elements['age'].value = p.age || '';
    form.elements['school'].value = p.school || '';
    form.elements['avatar'].value = p.avatar || '';
    form.elements['tagline'].value = p.tagline || '';
    form.elements['bio'].value = p.bio || '';
    form.elements['email'].value = p.email || '';
    form.elements['github'].value = p.github || '';
    form.elements['linkedin'].value = p.linkedin || '';
    form.elements['twitter'].value = p.twitter || '';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      DATA.profile = {
        ...DATA.profile,
        name: form.elements['name'].value,
        title: form.elements['title'].value,
        location: form.elements['location'].value,
        age: parseInt(form.elements['age'].value, 10) || DATA.profile.age,
        school: form.elements['school'].value,
        avatar: form.elements['avatar'].value,
        tagline: form.elements['tagline'].value,
        bio: form.elements['bio'].value,
        email: form.elements['email'].value,
        github: form.elements['github'].value,
        linkedin: form.elements['linkedin'].value,
        twitter: form.elements['twitter'].value
      };
      showToast('profileToast', 'Saved. Export portfolio.json to apply changes live.');
    });
  }

  // ------- SKILLS -------
  function renderSkills() {
    const list = $('#skillsList');
    if (!list) return;
    list.innerHTML = '';
    DATA.skills.forEach((s, idx) => {
      const item = document.createElement('div');
      item.className = 'admin-list-item';
      item.innerHTML = `
        <div class="admin-list-item-head">
          <span class="admin-list-item-title">Skill #${idx + 1}</span>
          <button type="button" class="admin-remove-btn" data-idx="${idx}">Remove</button>
        </div>
        <div class="admin-form-row">
          <div class="admin-field">
            <label>Name</label>
            <input type="text" data-field="name" value="${escapeHtml(s.name)}" />
          </div>
          <div class="admin-field">
            <label>Icon</label>
            <select data-field="icon">
              ${['html','css','tailwind','js','bootstrap','node','python','git','figma'].map(k =>
                `<option value="${k}" ${s.icon === k ? 'selected' : ''}>${k}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="admin-field">
          <label>Level (${s.level}%)</label>
          <input type="range" min="0" max="100" value="${s.level}" data-field="level" />
        </div>
      `;
      list.appendChild(item);
      item.querySelector('.admin-remove-btn').addEventListener('click', () => {
        DATA.skills.splice(idx, 1);
        renderSkills();
      });
      item.querySelectorAll('[data-field]').forEach((inp) => {
        inp.addEventListener('input', () => {
          const f = inp.getAttribute('data-field');
          DATA.skills[idx][f] = f === 'level' ? parseInt(inp.value, 10) : inp.value;
        });
      });
    });

    $('#addSkillBtn').onclick = () => {
      DATA.skills.push({ name: 'New Skill', level: 70, icon: 'html' });
      renderSkills();
    };
    $('#saveSkillsBtn').onclick = () => {
      showToast('skillsToast', 'Saved. Export portfolio.json to apply changes live.');
    };
  }

  // ------- PROJECTS -------
  function renderProjects() {
    const list = $('#projectsList');
    if (!list) return;
    list.innerHTML = '';
    DATA.projects.forEach((pr, idx) => {
      const item = document.createElement('div');
      item.className = 'admin-list-item';
      item.innerHTML = `
        <div class="admin-list-item-head">
          <span class="admin-list-item-title">Project #${idx + 1}</span>
          <button type="button" class="admin-remove-btn" data-idx="${idx}">Remove</button>
        </div>
        <div class="admin-form-row">
          <div class="admin-field">
            <label>Name</label>
            <input type="text" data-field="name" value="${escapeHtml(pr.name)}" />
          </div>
          <div class="admin-field">
            <label>Status</label>
            <select data-field="status">
              ${['Live','Archived','WIP'].map(s => `<option value="${s}" ${pr.status === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="admin-field">
          <label>Description</label>
          <textarea data-field="description" rows="2">${escapeHtml(pr.description || '')}</textarea>
        </div>
        <div class="admin-form-row">
          <div class="admin-field">
            <label>Tech (comma-separated)</label>
            <input type="text" data-field="tech" value="${escapeHtml((pr.tech || []).join(', '))}" />
          </div>
          <div class="admin-field">
            <label>Accent color</label>
            <input type="color" data-field="color" value="${escapeHtml(pr.color || '#0070f3')}" />
          </div>
        </div>
        <div class="admin-field">
          <label>URL</label>
          <input type="url" data-field="url" value="${escapeHtml(pr.url || '#')}" />
        </div>
      `;
      list.appendChild(item);
      item.querySelector('.admin-remove-btn').addEventListener('click', () => {
        DATA.projects.splice(idx, 1);
        renderProjects();
      });
      item.querySelectorAll('[data-field]').forEach((inp) => {
        inp.addEventListener('input', () => {
          const f = inp.getAttribute('data-field');
          let v = inp.value;
          if (f === 'tech') v = v.split(',').map(t => t.trim()).filter(Boolean);
          DATA.projects[idx][f] = v;
        });
      });
    });

    $('#addProjectBtn').onclick = () => {
      DATA.projects.push({
        id: 'p-' + Date.now(),
        name: 'New Project',
        description: 'A short description of this project.',
        tech: ['HTML', 'CSS', 'JavaScript'],
        color: '#0070f3',
        status: 'Live',
        url: '#'
      });
      renderProjects();
    };
    $('#saveProjectsBtn').onclick = () => {
      showToast('projectsToast', 'Saved. Export portfolio.json to apply changes live.');
    };
  }

  // ------- MESSAGES -------
  function renderMessages() {
    const list = $('#messagesList');
    if (!list) return;
    const msgs = (DATA.messages || []).slice().reverse();
    const badge = $('#msgBadge');
    if (badge) {
      badge.textContent = msgs.length;
      badge.hidden = msgs.length === 0;
    }
    if (msgs.length === 0) {
      list.innerHTML = '<div class="messages-empty">No messages yet.</div>';
      return;
    }
    list.innerHTML = msgs.map((m) => `
      <div class="message-card">
        <div class="message-head">
          <div class="message-from">
            <span class="message-name">${escapeHtml(m.name)}</span>
            <a class="message-email" href="mailto:${escapeHtml(m.email)}">${escapeHtml(m.email)}</a>
          </div>
          <div class="message-meta">
            <span class="message-date">${formatDate(m.date)}</span>
            <button class="message-del" data-id="${escapeHtml(m.id)}">Delete</button>
          </div>
        </div>
        ${m.subject ? `<div class="message-subject">${escapeHtml(m.subject)}</div>` : ''}
        <div class="message-body">${escapeHtml(m.message)}</div>
      </div>
    `).join('');

    $$('.message-del', list).forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        DATA.messages = (DATA.messages || []).filter(x => x.id !== id);
        try { localStorage.setItem(MSG_KEY, JSON.stringify(DATA.messages)); } catch (_) {}
        renderMessages();
      });
    });
  }

  function formatDate(iso) {
    try {
      const d = new Date(iso);
      const now = new Date();
      const diff = (now - d) / 1000;
      if (diff < 60) return 'Just now';
      if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
      if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (_) { return iso || ''; }
  }

  // ------- SETTINGS -------
  function renderSettings() {
    const form = $('#settingsForm');
    if (!form) return;
    const s = DATA.settings || {};
    const a = DATA.admin || {};
    form.elements['siteTitle'].value = s.siteTitle || '';
    form.elements['accent'].value = s.accent || '#0070f3';
    form.elements['theme'].value = s.theme || '';
    form.elements['username'].value = a.username || '';
    form.elements['password'].value = a.password || '';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      DATA.settings = {
        ...DATA.settings,
        siteTitle: form.elements['siteTitle'].value,
        accent: form.elements['accent'].value,
        theme: form.elements['theme'].value
      };
      DATA.admin = {
        username: form.elements['username'].value,
        password: form.elements['password'].value
      };
      showToast('settingsToast', 'Saved. Export portfolio.json to apply changes live.');
    });
  }

  // ------- TOAST -------
  function showToast(id, msg, isError) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-show');
    el.classList.toggle('is-error', !!isError);
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('is-show'), 4000);
  }

  // ------- LOGOUT -------
  function setupLogout() {
    const btn = $('#logoutBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      sessionStorage.removeItem(SESSION_KEY);
      window.location.href = 'login.html';
    });
  }

  // ------- EXPORT BUTTON (top bar) -------
  function setupExport() {
    // Inject an export button if not present
    const right = $('.admin-top-right');
    if (!right) return;
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-ghost';
    exportBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Export JSON
    `;
    exportBtn.addEventListener('click', saveDataAsDownload);
    right.insertBefore(exportBtn, right.firstChild);
  }

  // ------- INIT -------
  async function init() {
    await loadData();
    setupTabs();
    renderProfile();
    renderSkills();
    renderProjects();
    renderSettings();
    renderMessages();
    setupLogout();
    setupExport();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();