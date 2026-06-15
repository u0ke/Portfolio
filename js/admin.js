/* ===========================================
   Hamza Bari (ice) — admin.js
   Full admin dashboard logic
   =========================================== */

(function () {
  'use strict';

  // -------- Auth gate --------
  if (!window.IceAuth || !window.IceAuth.isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }

  // -------- Data --------
  const STORAGE_KEY = 'ice_portfolio_data_v1';
  const DEFAULT_DATA = {
    profile: {
      name: 'Hamza Bari', nickname: 'ice', tagline: 'Web Developer & Graphic Designer',
      age: 19, location: 'Agadir, Morocco',
      bio: "I'm a 19-year-old creative developer from Morocco. I specialize in building sleek, minimalist digital experiences that feel calm, fast, and intentional. When I'm not coding, I'm usually hitting the gym or optimizing my gaming setup.",
      avatar: 'assets/images/avatar.svg',
      funFacts: [
        { icon: 'dumbbell', label: 'Gym Lover' },
        { icon: 'cpu', label: 'PC Enthusiast' },
        { icon: 'code', label: 'Code Junkie' },
        { icon: 'coffee', label: 'Coffee Powered' }
      ],
      contact: { email: 'barihamza73@gmail.com', linkedin: 'https://linkedin.com/u0ke', github: 'https://github.com/u0ke' }
    },
    skills: {
      hard: [
        { "name": "Html", "level": 96 },
        { "name": "CSS", "level": 95 },
        { "name": "Tailwind CSS", "level": 95 },
        { "name": "JavaScript", "level": 62 },
        { "name": "Node.js", "level": 60 },
        { "name": "Python", "level": 55 },
        { "name": "Git", "level": 93 },
        { "name": "Figma", "level": 70 },
        { "name": "VS Code", "level": 90 }
      ],
      soft: [
        { name: 'Problem-solving' },
        { name: 'Teamwork' },
        { name: 'Communication' },
        { name: 'Time management' }
      ]
    },
    projects: [
      { id: 'p-001', title: 'Helix Dashboard', description: 'A clean, minimal admin dashboard template built with vanilla JS and Tailwind.', image: 'assets/images/project-1.svg', stack: ['JavaScript', 'Tailwind', 'Chart.js'], demo: 'https://example.com', github: 'https://github.com/hamzabari/helix', featured: true }
    ],
    education: [{ school: 'Ecole du Web Avancé (EWA)', location: 'Agadir, Morocco', program: 'Web Development Program', status: 'Currently Studying' }],
    blog: [{ id: 'b-001', title: 'Tailwind CSS Tips for Minimalist Design', excerpt: 'A few opinionated tricks to keep your Tailwind output clean and your UI calm.', date: '2026-04-12' }],
    messages: [],
    settings: { siteTitle: 'Hamza Bari — ice', theme: 'helium-dark', accent: '#1BFFFF' }
  };

  const ICONS = {
    dumbbell: '🏋', cpu: '🖥', code: '⌨', coffee: '☕', rocket: '🚀', palette: '🎨', camera: '📷', music: '🎵', book: '📚', globe: '🌍', gamepad: '🎮', pen: '✍'
  };

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.profile) return parsed;
      }
    } catch (e) { /* ignore */ }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  function saveData() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data)); }
    catch (e) { showToast('Failed to save (storage full?)', true); }
  }

  const state = {
    data: loadData(),
    currentSection: 'dashboard',
    currentUser: (window.IceAuth.getCreds() || {}).username || 'admin'
  };

  // -------- Utilities --------
  function $(s, root) { return (root || document).querySelector(s); }
  function $$(s, root) { return Array.from((root || document).querySelectorAll(s)); }
  function uid(prefix) { return (prefix || 'id') + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
  function esc(s) {
    if (s == null) return '';
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function escAttr(s) { return esc(s); }
  function todayISO() { return new Date().toISOString().slice(0, 10); }

  // -------- Toast --------
  let toastTimer = null;
  function showToast(msg, isError) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.remove('hidden');
    t.classList.add('show');
    t.style.background = isError ? 'rgba(239, 68, 68, 0.95)' : '#1BFFFF';
    t.style.color = isError ? '#fff' : '#0A0F2C';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.classList.add('hidden'), 200);
    }, 2200);
  }

  // -------- Navigation --------
  function navigate(section) {
    state.currentSection = section;
    $$('.admin-section').forEach(s => s.classList.toggle('hidden', s.dataset.section !== section));
    $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.nav === section));

    const titles = {
      dashboard: ['Dashboard', 'Welcome back, ' + (state.data.profile.nickname || 'Ice')],
      profile: ['Profile', 'Manage your public profile'],
      skills: ['Skills', 'Hard & soft skills'],
      projects: ['Projects', 'Your selected work'],
      blog: ['Blog', 'Articles & writing'],
      messages: ['Messages', 'Inbox'],
      settings: ['Settings', 'Site, credentials, data']
    };
    const [kicker, title] = titles[section] || ['', ''];
    $('#sectionKicker').textContent = kicker;
    $('#sectionTitle').textContent = title;

    if (section === 'dashboard') renderDashboard();
    if (section === 'profile') renderProfileForm();
    if (section === 'skills') renderSkillsAdmin();
    if (section === 'projects') renderProjectsAdmin();
    if (section === 'blog') renderBlogAdmin();
    if (section === 'messages') renderMessagesAdmin();
    if (section === 'settings') renderSettingsForm();

    // Close mobile nav
    const mob = $('#mobileNav');
    if (mob) mob.classList.add('hidden');
  }

  // -------- Dashboard --------
  function renderDashboard() {
    $('#statProjects').textContent = (state.data.projects || []).length;
    $('#statHardSkills').textContent = ((state.data.skills || {}).hard || []).length;
    $('#statBlog').textContent = (state.data.blog || []).length;
    const unread = (state.data.messages || []).filter(m => !m.read).length;
    $('#statMessages').textContent = unread;
    const badge = $('#unreadBadge');
    if (unread > 0) {
      badge.textContent = unread;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }

    const recent = (state.data.messages || []).slice().reverse().slice(0, 5);
    const recEl = $('#recentMessages');
    if (!recent.length) {
      recEl.innerHTML = '<p class="text-white/40">No messages yet.</p>';
    } else {
      recEl.innerHTML = recent.map(m => `
        <div class="flex items-start gap-2 ${m.read ? '' : 'font-semibold'}">
          <span class="${m.read ? '' : 'unread-dot'} mt-1.5"></span>
          <div class="min-w-0 flex-1">
            <p class="text-white truncate">${esc(m.name)} <span class="text-white/40 font-normal">— ${esc(m.email)}</span></p>
            <p class="text-white/50 text-xs truncate">${esc(m.message)}</p>
          </div>
        </div>
      `).join('');
    }
  }

  // -------- Profile form --------
  function renderProfileForm() {
    const f = $('#profileForm');
    if (!f) return;
    const p = state.data.profile || {};
    f.name.value = p.name || '';
    f.nickname.value = p.nickname || '';
    f.tagline.value = p.tagline || '';
    f.age.value = p.age || '';
    f.location.value = p.location || '';
    f.avatar.value = p.avatar || '';
    f.bio.value = p.bio || '';
    f.email.value = (p.contact || {}).email || '';
    f.linkedin.value = (p.contact || {}).linkedin || '';
    f.github.value = (p.contact || {}).github || '';

    // Fun facts
    const factsList = $('#funFactsList');
    factsList.innerHTML = (p.funFacts || []).map((f, i) => funFactRow(f, i)).join('');

    // Education
    const eduList = $('#educationList');
    eduList.innerHTML = (state.data.education || []).map((e, i) => eduRow(e, i)).join('');
  }

  function funFactRow(f, i) {
    const iconOptions = Object.keys(ICONS).map(k => `<option value="${k}" ${f.icon === k ? 'selected' : ''}>${ICONS[k]} ${k}</option>`).join('');
    return `
      <div class="inline-row" data-row="funFact" data-i="${i}">
        <select data-key="icon" style="max-width:140px;">${iconOptions}</select>
        <input data-key="label" type="text" value="${escAttr(f.label || '')}" placeholder="Label" />
        <button type="button" data-remove="funFacts" data-i="${i}" aria-label="Remove">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>
    `;
  }

  function eduRow(e, i) {
    return `
      <div class="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 bg-white/4 rounded-xl border border-white/8" data-row="edu" data-i="${i}">
        <input data-key="school" type="text" value="${escAttr(e.school || '')}" placeholder="School" class="md:col-span-2" />
        <input data-key="location" type="text" value="${escAttr(e.location || '')}" placeholder="Location" />
        <input data-key="program" type="text" value="${escAttr(e.program || '')}" placeholder="Program" />
        <div class="md:col-span-3 flex gap-2">
          <input data-key="status" type="text" value="${escAttr(e.status || '')}" placeholder="Status (e.g. Currently Studying)" />
        </div>
        <button type="button" data-remove="education" data-i="${i}" class="btn-icon danger justify-self-end" aria-label="Remove">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>
    `;
  }

  // -------- Skills admin --------
  function renderSkillsAdmin() {
    const hard = (state.data.skills || {}).hard || [];
    const soft = (state.data.skills || {}).soft || [];

    $('#hardSkillsAdmin').innerHTML = hard.map((s, i) => `
      <div class="inline-row" data-row="hard" data-i="${i}">
        <input data-key="name" type="text" value="${escAttr(s.name || '')}" placeholder="Skill name" />
        <input data-key="level" type="number" min="0" max="100" value="${s.level || 0}" placeholder="%" style="max-width:90px;" />
        <button type="button" data-remove="hard" data-i="${i}" aria-label="Remove">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>
    `).join('');

    $('#softSkillsAdmin').innerHTML = soft.map((s, i) => `
      <div class="inline-row" data-row="soft" data-i="${i}">
        <input data-key="name" type="text" value="${escAttr(s.name || '')}" placeholder="Skill name" />
        <button type="button" data-remove="soft" data-i="${i}" aria-label="Remove">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>
    `).join('');
  }

  // -------- Projects admin --------
  function renderProjectsAdmin() {
    const list = state.data.projects || [];
    const el = $('#projectsAdminList');
    if (!list.length) {
      el.innerHTML = '<p class="text-white/40 text-center py-12">No projects yet. Click "New Project" to add one.</p>';
      return;
    }
    el.innerHTML = list.map(p => `
      <div class="admin-card">
        <img class="card-thumb" src="${escAttr(p.image || 'assets/images/project-1.svg')}" alt="" onerror="this.style.background='linear-gradient(135deg,#1E1B4B,#1E3A8A)';this.removeAttribute('src');" />
        <div class="card-body">
          <p class="card-title">${esc(p.title || 'Untitled')}</p>
          <p class="card-sub">${esc(p.description || '')}</p>
          <div class="flex flex-wrap gap-1.5 mt-2">
            ${(p.stack || []).map(t => `<span class="text-[10px] px-2 py-0.5 rounded-full bg-electric/10 text-electric border border-electric/20">${esc(t)}</span>`).join('')}
          </div>
        </div>
        <div class="card-actions">
          <button class="btn-icon" data-edit="project" data-id="${escAttr(p.id)}" aria-label="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="m18.5 2.5 3 3L12 15l-4 1 1-4z"/></svg>
          </button>
          <button class="btn-icon danger" data-delete="project" data-id="${escAttr(p.id)}" aria-label="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </div>
      </div>
    `).join('');
  }

  function openProjectModal(id) {
    const isNew = !id;
    const p = isNew ? { id: uid('p'), title: '', description: '', image: 'assets/images/project-1.svg', stack: [], demo: '', github: '', featured: false } : (state.data.projects.find(x => x.id === id) || {});
    showModal(isNew ? 'New Project' : 'Edit Project', `
      <form id="projectForm" class="space-y-4">
        <div class="form-group">
          <label>Title</label>
          <input name="title" type="text" required value="${escAttr(p.title)}" />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea name="description" rows="3">${esc(p.description)}</textarea>
        </div>
        <div class="form-group">
          <label>Image URL</label>
          <input name="image" type="text" value="${escAttr(p.image)}" placeholder="assets/images/project-x.svg" />
        </div>
        <div class="form-group">
          <label>Stack (comma-separated)</label>
          <input name="stack" type="text" value="${escAttr((p.stack || []).join(', '))}" placeholder="JavaScript, Tailwind, Figma" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label>Live Demo URL</label>
            <input name="demo" type="url" value="${escAttr(p.demo || '')}" />
          </div>
          <div class="form-group">
            <label>GitHub URL</label>
            <input name="github" type="url" value="${escAttr(p.github || '')}" />
          </div>
        </div>
        <div class="form-group">
          <label class="flex items-center gap-2 cursor-pointer">
            <input name="featured" type="checkbox" ${p.featured ? 'checked' : ''} class="w-4 h-4 accent-electric" />
            <span class="text-sm text-white/80 normal-case tracking-normal">Featured project</span>
          </label>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" data-modal-close class="px-5 py-2.5 rounded-full border border-white/20 text-white text-sm font-semibold hover:bg-white/5 transition">Cancel</button>
          <button type="submit" class="px-5 py-2.5 rounded-full bg-white text-ink text-sm font-semibold hover:bg-electric transition">${isNew ? 'Create' : 'Save'}</button>
        </div>
      </form>
    `);

    $('#projectForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      const fd = new FormData(this);
      const updated = {
        id: p.id,
        title: (fd.get('title') || '').toString().trim(),
        description: (fd.get('description') || '').toString().trim(),
        image: (fd.get('image') || '').toString().trim() || 'assets/images/project-1.svg',
        stack: (fd.get('stack') || '').toString().split(',').map(s => s.trim()).filter(Boolean),
        demo: (fd.get('demo') || '').toString().trim(),
        github: (fd.get('github') || '').toString().trim(),
        featured: !!fd.get('featured')
      };
      if (!updated.title) { showToast('Title is required', true); return; }
      const list = state.data.projects || [];
      const idx = list.findIndex(x => x.id === p.id);
      if (idx === -1) list.push(updated); else list[idx] = updated;
      state.data.projects = list;
      saveData();
      closeModal();
      renderProjectsAdmin();
      showToast(isNew ? 'Project created' : 'Project updated');
    });
  }

  // -------- Blog admin --------
  function renderBlogAdmin() {
    const list = state.data.blog || [];
    const el = $('#blogAdminList');
    if (!list.length) {
      el.innerHTML = '<p class="text-white/40 text-center py-12">No posts yet. Click "New Post" to add one.</p>';
      return;
    }
    el.innerHTML = list.map(b => `
      <div class="admin-card">
        <div class="card-thumb flex items-center justify-center text-3xl">📝</div>
        <div class="card-body">
          <p class="card-title">${esc(b.title || 'Untitled')}</p>
          <p class="card-sub">${esc(b.excerpt || '')}</p>
          <p class="text-xs text-white/40 mt-2">${esc(b.date || '')}</p>
        </div>
        <div class="card-actions">
          <button class="btn-icon" data-edit="blog" data-id="${escAttr(b.id)}" aria-label="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="m18.5 2.5 3 3L12 15l-4 1 1-4z"/></svg>
          </button>
          <button class="btn-icon danger" data-delete="blog" data-id="${escAttr(b.id)}" aria-label="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </div>
      </div>
    `).join('');
  }

  function openBlogModal(id) {
    const isNew = !id;
    const b = isNew ? { id: uid('b'), title: '', excerpt: '', date: todayISO() } : (state.data.blog.find(x => x.id === id) || {});
    showModal(isNew ? 'New Blog Post' : 'Edit Blog Post', `
      <form id="blogForm" class="space-y-4">
        <div class="form-group">
          <label>Title</label>
          <input name="title" type="text" required value="${escAttr(b.title)}" />
        </div>
        <div class="form-group">
          <label>Excerpt</label>
          <textarea name="excerpt" rows="3">${esc(b.excerpt)}</textarea>
        </div>
        <div class="form-group">
          <label>Date</label>
          <input name="date" type="date" value="${escAttr(b.date)}" />
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" data-modal-close class="px-5 py-2.5 rounded-full border border-white/20 text-white text-sm font-semibold hover:bg-white/5 transition">Cancel</button>
          <button type="submit" class="px-5 py-2.5 rounded-full bg-white text-ink text-sm font-semibold hover:bg-electric transition">${isNew ? 'Create' : 'Save'}</button>
        </div>
      </form>
    `);

    $('#blogForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      const fd = new FormData(this);
      const updated = {
        id: b.id,
        title: (fd.get('title') || '').toString().trim(),
        excerpt: (fd.get('excerpt') || '').toString().trim(),
        date: (fd.get('date') || todayISO()).toString()
      };
      if (!updated.title) { showToast('Title is required', true); return; }
      const list = state.data.blog || [];
      const idx = list.findIndex(x => x.id === b.id);
      if (idx === -1) list.push(updated); else list[idx] = updated;
      state.data.blog = list;
      saveData();
      closeModal();
      renderBlogAdmin();
      showToast(isNew ? 'Post created' : 'Post updated');
    });
  }

  // -------- Messages --------
  function renderMessagesAdmin() {
    const list = (state.data.messages || []).slice().reverse();
    const el = $('#messagesList');
    if (!list.length) {
      el.innerHTML = '<p class="text-white/40 text-center py-12">No messages yet.</p>';
      return;
    }
    el.innerHTML = list.map(m => `
      <div class="message-item ${m.read ? '' : 'unread'}" data-msg="${escAttr(m.id)}">
        <div class="message-head">
          <div class="message-meta">
            <div class="message-avatar">${esc((m.name || '?').charAt(0).toUpperCase())}</div>
            <div>
              <p class="message-from">${esc(m.name)} ${m.read ? '' : '<span class="unread-dot ml-1"></span>'}</p>
              <p class="message-email">${esc(m.email)}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="message-date">${formatDate(m.date)}</span>
            <button class="btn-icon danger" data-delete-msg="${escAttr(m.id)}" aria-label="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
            </button>
          </div>
        </div>
        <p class="message-body">${esc(m.message)}</p>
        <div class="flex gap-2 mt-1">
          <a href="mailto:${escAttr(m.email)}" class="text-xs text-electric hover:underline">Reply via email</a>
        </div>
      </div>
    `).join('');
  }

  // -------- Settings --------
  function renderSettingsForm() {
    const s = state.data.settings || {};
    const f = $('#settingsForm');
    f.siteTitle.value = s.siteTitle || '';
    f.accent.value = s.accent || '#1BFFFF';
    f.theme.value = s.theme || 'helium-dark';

    const creds = window.IceAuth.getCreds() || {};
    const cf = $('#credsForm');
    cf.username.value = creds.username || '';
    cf.password.value = '';
  }

  // -------- Modal --------
  function showModal(title, contentHTML) {
    $('#modalTitle').textContent = title;
    $('#modalContent').innerHTML = contentHTML;
    $('#modal').classList.remove('hidden');
  }
  function closeModal() {
    $('#modal').classList.add('hidden');
    $('#modalContent').innerHTML = '';
  }

  // -------- Form Handlers --------
  function attachHandlers() {
    // Nav
    $$('.nav-btn').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.nav)));
    $$('.quick-btn').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.nav)));

    // Logout
    function doLogout() {
      window.IceAuth.logout();
      window.location.href = 'login.html';
    }
    $('#logoutBtn').addEventListener('click', doLogout);
    const mobLogout = $('#logoutBtnMobile');
    if (mobLogout) mobLogout.addEventListener('click', doLogout);

    // Mobile nav
    $('#mobileNavToggle').addEventListener('click', () => $('#mobileNav').classList.toggle('hidden'));

    // Modal close
    $('#modalClose').addEventListener('click', closeModal);
    $('#modal').addEventListener('click', (ev) => {
      if (ev.target === $('#modal')) closeModal();
      if (ev.target.closest('[data-modal-close]')) closeModal();
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') closeModal();
    });

    // Profile form submit
    $('#profileForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      const f = this;
      state.data.profile = {
        name: f.name.value.trim(),
        nickname: f.nickname.value.trim(),
        tagline: f.tagline.value.trim(),
        age: parseInt(f.age.value, 10) || '',
        location: f.location.value.trim(),
        avatar: f.avatar.value.trim() || 'assets/images/avatar.svg',
        bio: f.bio.value.trim(),
        funFacts: state.data.profile.funFacts || [],
        contact: {
          email: f.email.value.trim(),
          linkedin: f.linkedin.value.trim(),
          github: f.github.value.trim()
        }
      };
      saveData();
      showToast('Profile saved');
    });

    // Fun fact & education input sync (live)
    $('#funFactsList').addEventListener('input', function (ev) {
      const row = ev.target.closest('[data-row="funFact"]');
      if (!row) return;
      const i = parseInt(row.dataset.i, 10);
      const key = ev.target.dataset.key;
      if (!key) return;
      state.data.profile.funFacts[i][key] = ev.target.value;
      saveData();
    });
    $('#educationList').addEventListener('input', function (ev) {
      const row = ev.target.closest('[data-row="edu"]');
      if (!row) return;
      const i = parseInt(row.dataset.i, 10);
      const key = ev.target.dataset.key;
      if (!key) return;
      state.data.education[i][key] = ev.target.value;
      saveData();
    });

    // Add fun fact / education
    document.addEventListener('click', function (ev) {
      const addBtn = ev.target.closest('[data-add]');
      if (addBtn) {
        const type = addBtn.dataset.add;
        if (type === 'funFacts') {
          state.data.profile.funFacts = state.data.profile.funFacts || [];
          state.data.profile.funFacts.push({ icon: 'code', label: 'New fact' });
          saveData(); renderProfileForm();
        } else if (type === 'education') {
          state.data.education = state.data.education || [];
          state.data.education.push({ school: '', location: '', program: '', status: '' });
          saveData(); renderProfileForm();
        } else if (type === 'hard') {
          state.data.skills.hard.push({ name: 'New skill', level: 50 });
          saveData(); renderSkillsAdmin();
        } else if (type === 'soft') {
          state.data.skills.soft.push({ name: 'New skill' });
          saveData(); renderSkillsAdmin();
        } else if (type === 'project') {
          openProjectModal(null);
        } else if (type === 'blog') {
          openBlogModal(null);
        }
      }
    });

    // Remove fun fact / education / skill
    document.addEventListener('click', function (ev) {
      const rm = ev.target.closest('[data-remove]');
      if (!rm) return;
      const type = rm.dataset.remove;
      const i = parseInt(rm.dataset.i, 10);
      if (type === 'funFacts') {
        state.data.profile.funFacts.splice(i, 1);
        saveData(); renderProfileForm();
      } else if (type === 'education') {
        state.data.education.splice(i, 1);
        saveData(); renderProfileForm();
      } else if (type === 'hard') {
        state.data.skills.hard.splice(i, 1);
        saveData(); renderSkillsAdmin();
      } else if (type === 'soft') {
        state.data.skills.soft.splice(i, 1);
        saveData(); renderSkillsAdmin();
      }
    });

    // Skills input sync
    $('#hardSkillsAdmin').addEventListener('input', function (ev) {
      const row = ev.target.closest('[data-row="hard"]');
      if (!row) return;
      const i = parseInt(row.dataset.i, 10);
      const key = ev.target.dataset.key;
      if (!key) return;
      if (key === 'level') {
        state.data.skills.hard[i][key] = parseInt(ev.target.value, 10) || 0;
      } else {
        state.data.skills.hard[i][key] = ev.target.value;
      }
      saveData();
    });
    $('#softSkillsAdmin').addEventListener('input', function (ev) {
      const row = ev.target.closest('[data-row="soft"]');
      if (!row) return;
      const i = parseInt(row.dataset.i, 10);
      const key = ev.target.dataset.key;
      if (!key) return;
      state.data.skills.soft[i][key] = ev.target.value;
      saveData();
    });

    // Project edit / delete
    $('#projectsAdminList').addEventListener('click', function (ev) {
      const ed = ev.target.closest('[data-edit="project"]');
      const del = ev.target.closest('[data-delete="project"]');
      if (ed) openProjectModal(ed.dataset.id);
      if (del) {
        if (confirm('Delete this project?')) {
          state.data.projects = (state.data.projects || []).filter(p => p.id !== del.dataset.id);
          saveData(); renderProjectsAdmin(); showToast('Project deleted');
        }
      }
    });

    // Blog edit / delete
    $('#blogAdminList').addEventListener('click', function (ev) {
      const ed = ev.target.closest('[data-edit="blog"]');
      const del = ev.target.closest('[data-delete="blog"]');
      if (ed) openBlogModal(ed.dataset.id);
      if (del) {
        if (confirm('Delete this post?')) {
          state.data.blog = (state.data.blog || []).filter(b => b.id !== del.dataset.id);
          saveData(); renderBlogAdmin(); showToast('Post deleted');
        }
      }
    });

    // Messages: click to mark read, button to delete
    $('#messagesList').addEventListener('click', function (ev) {
      const del = ev.target.closest('[data-delete-msg]');
      if (del) {
        ev.stopPropagation();
        state.data.messages = (state.data.messages || []).filter(m => m.id !== del.dataset.deleteMsg);
        saveData(); renderMessagesAdmin(); showToast('Message deleted');
        return;
      }
      const item = ev.target.closest('[data-msg]');
      if (item) {
        const id = item.dataset.msg;
        const m = (state.data.messages || []).find(x => x.id === id);
        if (m && !m.read) {
          m.read = true;
          saveData(); renderMessagesAdmin();
        }
      }
    });

    // Clear all messages
    $('#clearMessagesBtn').addEventListener('click', function () {
      if (!(state.data.messages || []).length) { showToast('No messages to clear'); return; }
      if (confirm('Delete all messages? This cannot be undone.')) {
        state.data.messages = [];
        saveData(); renderMessagesAdmin(); showToast('All messages cleared');
      }
    });

    // Settings form
    $('#settingsForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      state.data.settings = {
        siteTitle: this.siteTitle.value.trim() || 'Hamza Bari — Ice',
        accent: this.accent.value || '#1BFFFF',
        theme: this.theme.value || 'helium-dark'
      };
      saveData();
      showToast('Settings saved');
    });

    // Credentials form
    $('#credsForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      const cur = window.IceAuth.getCreds() || { username: 'ice', password: 'ice123' };
      const newUser = this.username.value.trim() || cur.username;
      const newPwd = this.password.value;
      if (!newPwd) {
        // username only
        window.IceAuth.setCreds(newUser, cur.password);
        showToast('Username updated');
        return;
      }
      if (newPwd.length < 6) { showToast('Password must be at least 6 characters', true); return; }
      window.IceAuth.setCreds(newUser, newPwd);
      showToast('Credentials updated. Please log in again.');
      setTimeout(() => {
        window.IceAuth.logout();
        window.location.href = 'login.html';
      }, 1200);
    });

    // Data management
    $('#exportBtn').addEventListener('click', function () {
      const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio-backup-' + todayISO() + '.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('Exported');
    });

    $('#importFile').addEventListener('change', function (ev) {
      const file = ev.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const parsed = JSON.parse(e.target.result);
          if (!parsed.profile) throw new Error('Invalid format');
          if (!confirm('Importing will replace all current data. Continue?')) {
            ev.target.value = '';
            return;
          }
          state.data = parsed;
          saveData();
          showToast('Imported successfully');
          navigate(state.currentSection);
        } catch (err) {
          showToast('Invalid JSON file', true);
        } finally {
          ev.target.value = '';
        }
      };
      reader.readAsText(file);
    });

    $('#resetBtn').addEventListener('click', function () {
      if (!confirm('Reset all data to defaults? This will delete your customizations.')) return;
      state.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      saveData();
      showToast('Reset to defaults');
      navigate(state.currentSection);
    });
  }

  // -------- Date helper --------
  function formatDate(iso) {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { return iso; }
  }

  // -------- Init --------
  document.addEventListener('DOMContentLoaded', function () {
    $('#adminUser').textContent = state.currentUser;
    attachHandlers();
    navigate('dashboard');
  });

})();
