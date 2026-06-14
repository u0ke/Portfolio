/* ===========================================
   Hamza Bari (Ice) — Portfolio main.js
   Public site logic: data load, render, UX
   =========================================== */

(function () {
  'use strict';

  // -------- Data store (localStorage-backed) --------
  const STORAGE_KEY = 'ice_portfolio_data_v1';

  const defaultData = {
    profile: {
      name: 'Hamza Bari',
      nickname: 'Ice',
      tagline: 'Web Developer & Graphic Designer',
      age: 19,
      location: 'Agadir, Morocco',
      bio: "I'm a 19-year-old creative developer from Morocco. I specialize in building sleek, minimalist digital experiences that feel calm, fast, and intentional. When I'm not coding, I'm usually hitting the gym or optimizing my gaming setup.",
      avatar: 'assets/images/avatar.svg',
      funFacts: [
        { icon: 'dumbbell', label: 'Gym Lover' },
        { icon: 'cpu', label: 'PC Enthusiast' },
        { icon: 'code', label: 'Code Junkie' },
        { icon: 'coffee', label: 'Coffee Powered' }
      ],
      contact: {
        email: 'hello@hamzabari.dev',
        linkedin: 'https://linkedin.com/in/hamzabari',
        github: 'https://github.com/hamzabari'
      }
    },
    skills: {
      hard: [
        { name: 'JavaScript', level: 90 },
        { name: 'Node.js', level: 80 },
        { name: 'Tailwind CSS', level: 95 },
        { name: 'Figma', level: 85 },
        { name: 'Responsive Design', level: 92 },
        { name: 'HTML5 & CSS3', level: 95 }
      ],
      soft: [
        { name: 'Problem-solving' },
        { name: 'Teamwork' },
        { name: 'Communication' },
        { name: 'Time management' },
        { name: 'Adaptability' },
        { name: 'Creativity' }
      ]
    },
    projects: [
      {
        id: 'p-001',
        title: 'Helix Dashboard',
        description: 'A clean, minimal admin dashboard template built with vanilla JS and Tailwind.',
        image: 'assets/images/project-1.svg',
        stack: ['JavaScript', 'Tailwind', 'Chart.js'],
        demo: 'https://example.com',
        github: 'https://github.com/hamzabari/helix',
        featured: true
      },
      {
        id: 'p-002',
        title: 'Mirleft Travel',
        description: 'A modern landing page celebrating the surf-town vibes of Mirleft, Morocco.',
        image: 'assets/images/project-2.svg',
        stack: ['HTML5', 'Tailwind', 'GSAP'],
        demo: 'https://example.com',
        github: 'https://github.com/hamzabari/mirleft',
        featured: true
      },
      {
        id: 'p-003',
        title: 'Ice Portfolio v1',
        description: 'My first personal portfolio with a focus on dark mode and typography.',
        image: 'assets/images/project-3.svg',
        stack: ['HTML', 'CSS', 'Vanilla JS'],
        demo: 'https://example.com',
        github: 'https://github.com/hamzabari/portfolio-v1',
        featured: false
      }
    ],
    education: [
      {
        school: 'Ecole du Web Avancé (EWA)',
        location: 'Agadir, Morocco',
        program: 'Web Development Program',
        status: 'Currently Studying'
      }
    ],
    blog: [
      { id: 'b-001', title: 'Tailwind CSS Tips for Minimalist Design', excerpt: 'A few opinionated tricks to keep your Tailwind output clean and your UI calm.', date: '2026-04-12' },
      { id: 'b-002', title: 'Minimalist Design Principles', excerpt: 'Why removing elements is harder than adding them — and how to do it well.', date: '2026-03-22' },
      { id: 'b-003', title: 'PC Hardware Tweaking: A Casual Guide', excerpt: 'Subtle tuning tricks to squeeze more frames out of your gaming rig.', date: '2026-02-08' }
    ],
    messages: [],
    settings: { siteTitle: 'Hamza Bari — Ice', theme: 'helium-dark', accent: '#1BFFFF' }
  };

  function loadData() {
    // Try localStorage first (admin writes to it)
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.profile) return mergeDefaults(parsed, defaultData);
      }
    } catch (e) { /* ignore */ }

    // No cache — return defaults now so the page can render fast.
    // If we are over http(s), asynchronously load portfolio.json and re-render
    // when it arrives. This is the path used on Netlify.
    if (typeof fetch !== 'undefined') {
      // Don't await — kick off the load and let the page render with defaults
      // first (or whatever localStorage was), then re-render with real data.
      fetch('data/portfolio.json', { cache: 'no-cache' })
        .then(r => (r.ok ? r.json() : null))
        .then(json => {
          if (!json || !json.profile) return;
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(json)); } catch (e) {}
          // Merge into our live data and re-render every section
          const merged = mergeDefaults(json, defaultData);
          Object.keys(merged).forEach(k => { data[k] = merged[k]; });
          renderAll();
        })
        .catch(() => { /* allow file:// usage or offline */ });
    }

    return defaultData;
  }

  function mergeDefaults(loaded, def) {
    // Shallow merge for top-level keys, deep-ish for nested
    const out = JSON.parse(JSON.stringify(def));
    Object.keys(loaded).forEach(k => {
      if (loaded[k] && typeof loaded[k] === 'object' && !Array.isArray(loaded[k])) {
        out[k] = Object.assign({}, out[k] || {}, loaded[k]);
      } else {
        out[k] = loaded[k];
      }
    });
    return out;
  }

  const data = loadData();

  // -------- SVG Icon Library --------
  const ICONS = {
    dumbbell: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/></svg>',
    cpu: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>',
    code: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    coffee: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>',
    cap: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',
    send: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    github: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.52-1.34-1.27-1.7-1.27-1.7-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.39.97.01 1.95.14 2.86.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.41-5.27 5.69.41.35.78 1.04.78 2.1v3.12c0 .31.21.67.8.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>'
  };

  function icon(name) {
    return ICONS[name] || ICONS.code;
  }

  // -------- Image helpers (fix: missing/broken images on Netlify) --------
  // Inline SVG placeholder — used as the src when a JSON image is missing or
  // fails to load. Keeps the layout intact instead of showing a broken icon.
  const FALLBACK_IMG =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">' +
      '<rect width="400" height="300" fill="#1E1B4B"/>' +
      '<g fill="none" stroke="#ffffff33" stroke-width="2">' +
      '<rect x="40" y="40" width="320" height="220" rx="12"/>' +
      '<circle cx="140" cy="130" r="22"/>' +
      '<path d="M60 240 L160 160 L220 210 L280 170 L340 240 Z"/>' +
      '</g>' +
      '<text x="200" y="285" text-anchor="middle" fill="#ffffff66" ' +
      'font-family="Inter, sans-serif" font-size="14">Image unavailable</text>' +
      '</svg>'
    );

  // Resolve "./assets/..." / "assets/..." / "https://..." into a clean URL.
  // Returns the placeholder when the path is empty.
  function resolveImg(path, fallback) {
    if (!path) return fallback || FALLBACK_IMG;
    const p = String(path).trim();
    if (!p) return fallback || FALLBACK_IMG;
    if (/^(https?:|data:|\/\/)/i.test(p)) return p; // already absolute
    // Strip leading "./" so "./assets/x" and "assets/x" both work
    return p.replace(/^\.\//, '').replace(/^\/+/, '');
  }

  // Render every dynamic section. Called on first load AND whenever new JSON
  // arrives (e.g. after the async fetch on Netlify completes).
  function renderAll() {
    renderHeroName();
    renderProfile();
    renderSkills();
    renderProjects();
    renderEducation();
    renderBlog();
    setTimeout(animateSkillBars, 50);
  }

  // -------- Hero name letter reveal --------
  function renderHeroName() {
    const el = document.getElementById('heroName');
    if (!el) return;
    const name = (data.profile.name || 'Hamza Bari').toUpperCase();
    el.innerHTML = name
      .split('')
      .map((c, i) => {
        const isSpace = c === ' ';
        return `<span class="char" style="animation-delay:${isSpace ? 0 : (300 + i * 50)}ms;${isSpace ? 'width:.4em;' : ''}">${isSpace ? '&nbsp;' : escapeHtml(c)}</span>`;
      })
      .join('');
  }

  // -------- Profile / Hero --------
  function renderProfile() {
    const p = data.profile;

    const taglineEl = document.getElementById('heroTagline');
    if (taglineEl) taglineEl.textContent = p.tagline || '';

    const bioEl = document.getElementById('aboutBio');
    if (bioEl) bioEl.textContent = p.bio || '';

    const avatarEl = document.getElementById('avatarImg');
    if (avatarEl) {
      avatarEl.src = resolveImg(p.avatar);
      avatarEl.onerror = function () {
        if (avatarEl.dataset.fallback !== '1') {
          avatarEl.dataset.fallback = '1';
          avatarEl.src = FALLBACK_IMG;
        }
      };
    }

    // Fun facts
    const factsEl = document.getElementById('funFactsGrid');
    if (factsEl) {
      factsEl.innerHTML = (p.funFacts || [])
        .map(f => `
          <div class="fun-fact">
            <div class="fun-fact-icon">${icon(f.icon || 'code')}</div>
            <span class="fun-fact-label">${escapeHtml(f.label || '')}</span>
          </div>
        `).join('');
    }

    // Contact
    const e = p.contact || {};
    const emailLink = document.getElementById('emailLink');
    const liLink = document.getElementById('linkedinLink');
    const ghLink = document.getElementById('githubLink');
    if (emailLink) { emailLink.href = 'mailto:' + (e.email || '#'); emailLink.textContent = e.email || 'Email'; }
    if (liLink) liLink.href = e.linkedin || '#';
    if (ghLink) ghLink.href = e.github || '#';

    // Footer
    const fn = document.getElementById('footerName');
    if (fn) fn.textContent = p.name || 'Hamza Bari';
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    // Page title
    document.title = (p.name || 'Hamza Bari') + ' — ' + (p.tagline || 'Portfolio');
  }

  // -------- Skills --------
  function renderSkills() {
    const hardEl = document.getElementById('hardSkillsList');
    if (hardEl) {
      const hard = (data.skills && data.skills.hard) || [];
      hardEl.innerHTML = hard.map((s, i) => `
        <div data-aos="fade-up" data-aos-delay="${100 + i * 60}">
          <div class="skill-row">
            <span class="text-sm font-medium text-white/90">${escapeHtml(s.name)}</span>
            <span class="text-xs text-white/40">${s.level || 0}%</span>
          </div>
          <div class="skill-bar">
            <div class="skill-bar-fill" data-level="${s.level || 0}"></div>
          </div>
        </div>
      `).join('');
    }

    const softEl = document.getElementById('softSkillsList');
    if (softEl) {
      const soft = (data.skills && data.skills.soft) || [];
      softEl.innerHTML = soft.map((s, i) => `
        <span class="skill-chip" data-aos="zoom-in" data-aos-delay="${100 + i * 40}">${icon('code')} ${escapeHtml(s.name)}</span>
      `).join('');
    }
  }

  function animateSkillBars() {
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
      const lvl = parseInt(bar.getAttribute('data-level') || '0', 10);
      requestAnimationFrame(() => { bar.style.width = lvl + '%'; });
    });
  }

  // -------- Projects --------
  function renderProjects() {
    const el = document.getElementById('projectsGrid');
    if (!el) return;
    const list = data.projects || [];
    if (!list.length) {
      el.innerHTML = '<p class="col-span-full text-center text-white/40">No projects yet.</p>';
      return;
    }
    el.innerHTML = list.map((p, i) => `
      <article class="project-card" data-aos="fade-up" data-aos-delay="${i * 80}">
        <img class="project-thumb" src="${escapeAttr(resolveImg(p.image, 'assets/images/project-1.svg'))}" alt="${escapeAttr(p.title || 'Project')}" loading="lazy" onerror="if(this.dataset.fb!=='1'){this.dataset.fb='1';this.src='${FALLBACK_IMG.replace(/'/g, '%27')}';}" />
        <div class="project-body">
          <h3 class="project-title">${escapeHtml(p.title || 'Untitled')}</h3>
          <p class="project-desc">${escapeHtml(p.description || '')}</p>
          <div class="project-stack">
            ${(p.stack || []).map(t => `<span class="project-tag">${escapeHtml(t)}</span>`).join('')}
          </div>
          <div class="project-actions">
            ${p.demo ? `<a href="${escapeAttr(p.demo)}" target="_blank" rel="noopener" class="px-4 py-2 rounded-full bg-white text-ink text-xs font-semibold hover:bg-electric transition">Live Demo</a>` : ''}
            ${p.github ? `<a href="${escapeAttr(p.github)}" target="_blank" rel="noopener" class="px-4 py-2 rounded-full border border-white/20 text-white text-xs font-semibold hover:bg-white/10 transition inline-flex items-center gap-1.5">${icon('github')} GitHub</a>` : ''}
          </div>
        </div>
      </article>
    `).join('');
  }

  // -------- Education --------
  function renderEducation() {
    const el = document.getElementById('educationList');
    if (!el) return;
    const list = data.education || [];
    el.innerHTML = list.map((e, i) => `
      <div class="edu-card" data-aos="fade-up" data-aos-delay="${i * 80}">
        <div class="edu-icon">${icon('cap')}</div>
        <div>
          <div class="edu-school">${escapeHtml(e.school || '')}</div>
          <div class="edu-loc">${escapeHtml(e.location || '')}${e.program ? ' · ' + escapeHtml(e.program) : ''}</div>
        </div>
        ${e.status ? `<div class="edu-status">${escapeHtml(e.status)}</div>` : ''}
      </div>
    `).join('');
  }

  // -------- Blog --------
  function renderBlog() {
    const el = document.getElementById('blogGrid');
    if (!el) return;
    const list = data.blog || [];
    if (!list.length) {
      el.innerHTML = '<p class="col-span-full text-center text-white/40">No posts yet.</p>';
      return;
    }
    el.innerHTML = list.map((b, i) => `
      <article class="blog-card" data-aos="fade-up" data-aos-delay="${i * 80}">
        <div class="blog-date">${formatDate(b.date)}</div>
        <h3 class="blog-title">${escapeHtml(b.title || '')}</h3>
        <p class="blog-excerpt">${escapeHtml(b.excerpt || '')}</p>
      </article>
    `).join('');
  }

  // -------- Contact Form --------
  function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const status = document.getElementById('formStatus');

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get('name') || '').toString().trim();
      const email = (fd.get('email') || '').toString().trim();
      const message = (fd.get('message') || '').toString().trim();

      if (!name || !email || !message) {
        status.textContent = 'Please fill in all fields.';
        status.className = 'text-sm form-status-error';
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        status.textContent = 'Please enter a valid email.';
        status.className = 'text-sm form-status-error';
        return;
      }

      const messages = (data.messages || []);
      messages.push({
        id: 'm-' + Date.now().toString(36),
        name, email, message,
        date: new Date().toISOString(),
        read: false
      });
      data.messages = messages;

      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}

      status.textContent = '✓ Message sent! I\'ll get back to you soon.';
      status.className = 'text-sm form-status-success';
      form.reset();
      setTimeout(() => { status.textContent = ''; status.className = 'text-sm text-white/60'; }, 5000);
    });
  }

  // -------- Mobile Nav --------
  function setupMobileNav() {
    const btn = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => menu.classList.toggle('hidden'));
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.add('hidden')));
  }

  // -------- Utilities --------
  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function escapeAttr(s) { return escapeHtml(s); }
  function formatDate(iso) {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { return iso; }
  }

  // -------- Init --------
  document.addEventListener('DOMContentLoaded', function () {
    renderAll();
    setupContactForm();
    setupMobileNav();

    if (window.AOS) {
      window.AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60
      });
    }

    // Animate skill bars after a beat
    setTimeout(animateSkillBars, 700);

    // Live update: if admin tab updates localStorage in another tab, refresh dynamic sections
    window.addEventListener('storage', function (e) {
      if (e.key !== STORAGE_KEY) return;
      try {
        const fresh = JSON.parse(e.newValue || 'null');
        if (!fresh) return;
        Object.assign(data, fresh);
        renderAll();
      } catch (err) { /* ignore */ }
    });
  });
})();
