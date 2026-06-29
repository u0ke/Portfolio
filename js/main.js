
(function () {
  'use strict';

  // ------- DATA STORE (single source) -------
  const DATA_PATH = 'data/portfolio.json';
  const SESSION_KEY = 'hb_admin_session';

  let DATA = null;
  let isAdminLoggedIn = false;

  // ------- UTIL -------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // ------- DATA LOAD -------
  async function loadData() {
    try {
      const res = await fetch(DATA_PATH + '?v=' + Date.now(), { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load portfolio.json');
      DATA = await res.json();
      return DATA;
    } catch (err) {
      console.error('[portfolio] data load error:', err);
      // Fallback minimal data so site still renders
      DATA = {
        profile: {
          name: 'Hamza Bari',
          title: 'Frontend Developer',
          location: 'Agadir, Morocco',
          age: 19,
          school: 'EWA School',
          bio: '',
          tagline: 'Building interfaces that feel inevitable.',
          email: 'hello@hamzabari.dev',
          github: 'https://github.com/',
          linkedin: 'https://linkedin.com/',
          twitter: '',
          avatar: 'HB'
        },
        skills: [
          { name: 'HTML', level: 95, icon: 'html' },
          { name: 'CSS', level: 92, icon: 'css' },
          { name: 'JavaScript', level: 90, icon: 'js' }
        ],
        projects: [],
        messages: [],
        settings: { siteTitle: 'Hamza Bari', accent: '#0070f3' },
        admin: { username: 'admin', password: 'hamza2026' }
      };
      return DATA;
    }
  }

  // ------- RENDER -------
  function renderProfile() {
    const p = DATA.profile;
    if (!p) return;

    document.title = (DATA.settings?.siteTitle) || `${p.name} — Frontend Developer`;

    if ($('#brandName')) $('#brandName').textContent = p.name;
    if ($('#brandMark')) $('#brandMark').textContent = p.avatar || (p.name || '?').split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase();
    if ($('#heroBadge')) $('#heroBadge').textContent = p.avatar || 'HB';

    if ($('#metaLocation')) $('#metaLocation').textContent = p.location;
    if ($('#metaAge')) $('#metaAge').textContent = p.age;
    if ($('#metaSchool')) $('#metaSchool').textContent = p.school;

    if ($('#heroBio') && p.bio) $('#heroBio').textContent = p.bio;
    if ($('#heroBadgeText')) $('#heroBadgeText').textContent = 'Available for new opportunities';

    // Split hero title into parts if defined
    if (p.tagline && typeof p.tagline === 'string') {
      // keep current static layout but adjust tagline
    }

    // About paragraphs
    if (p.bio) {
      const p1 = $('#aboutP1');
      if (p1) p1.textContent = p.bio;
    }

    // Contact links
    const emailEl = $('[data-email]');
    if (emailEl && p.email) emailEl.textContent = p.email;
    const ghEl = $('#contactGithub');
    if (ghEl && p.github) ghEl.setAttribute('href', p.github);
    const liEl = $('#contactLinkedin');
    if (liEl && p.linkedin) liEl.setAttribute('href', p.linkedin);
    const emLink = $('#contactEmail');
    if (emLink && p.email) emLink.setAttribute('href', 'mailto:' + p.email);
  }

  function renderSkills() {
    const grid = $('#skillsGrid');
    if (!grid) return;
    const icons = window.SKILL_ICONS || {};
    grid.innerHTML = (DATA.skills || []).map((s) => {
      const svg = icons[s.icon] || icons.html || '';
      const level = Math.max(0, Math.min(100, Number(s.level) || 0));
      return `
        <div class="skill-card reveal">
          <div class="skill-head">
            <div class="skill-name">
              <span class="skill-icon">${svg}</span>
              <span>${escapeHtml(s.name)}</span>
            </div>
            <span class="skill-pct">${level}%</span>
          </div>
          <div class="skill-bar"><div class="skill-bar-fill" data-fill="${level}"></div></div>
        </div>
      `;
    }).join('');
  }

  function renderProjects() {
    const list = $('#projectsList');
    if (!list) return;
    const arrowSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`;
    list.innerHTML = (DATA.projects || []).map((pr) => {
      const tech = (pr.tech || []).map(t => `<span>${escapeHtml(t)}</span>`).join('');
      const status = (pr.status || 'Live').toLowerCase();
      const statusClass = status === 'archived' ? 'archived' : '';
      const accent = pr.color || '#0070f3';
      return `
        <article class="project-card reveal" style="--accent:${escapeHtml(accent)}">
          <div class="project-left">
            <div class="project-head">
              <h3 class="project-name">${escapeHtml(pr.name)}</h3>
              <span class="project-status ${statusClass}">${escapeHtml(pr.status || 'Live')}</span>
            </div>
            <p class="project-desc">${escapeHtml(pr.description || '')}</p>
            <div class="project-tech">${tech}</div>
          </div>
          <a href="${escapeHtml(pr.url || '#')}" target="_blank" rel="noopener" class="project-cta">
            View ${arrowSvg}
          </a>
        </article>
      `;
    }).join('');
  }

  // ------- REVEAL ON SCROLL -------
  function setupReveal() {
    const els = $$('.reveal');
    if (!('IntersectionObserver' in window) || els.length === 0) {
      els.forEach(e => e.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(e => io.observe(e));
  }

  // ------- FILL BARS WHEN VISIBLE -------
  function setupSkillBars() {
    const fills = $$('.skill-bar-fill');
    if (fills.length === 0) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const v = en.target.getAttribute('data-fill') || '0';
          en.target.style.width = v + '%';
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.4 });
    fills.forEach(f => io.observe(f));
  }

  // ------- ACTIVE NAV LINK ON SCROLL -------
  function setupActiveNav() {
    const sections = $$('section[id]');
    const links = $$('[data-nav]');
    if (sections.length === 0 || links.length === 0) return;

    const map = new Map();
    links.forEach((a) => {
      const id = (a.getAttribute('href') || '').replace('#', '');
      if (id) map.set(id, a);
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach(a => a.classList.remove('is-active'));
        const link = map.get(en.target.id);
        if (link) link.classList.add('is-active');
      });
    }, { rootMargin: '-50% 0px -45% 0px', threshold: 0 });
    sections.forEach(s => io.observe(s));
  }

  // ------- NAVBAR HOVER SHOW/HIDE -------
  function setupNavbarHover() {
    const navbar = $('#navbar');
    const trigger = $('#navTrigger');
    if (!navbar || !trigger) return;

    let hideTimer = null;

    const show = () => {
      clearTimeout(hideTimer);
      navbar.classList.add('is-visible');
    };
    const hide = () => {
      hideTimer = setTimeout(() => {
        navbar.classList.remove('is-visible');
      }, 180);
    };

    trigger.addEventListener('mouseenter', show);
    navbar.addEventListener('mouseenter', show);
    trigger.addEventListener('mouseleave', hide);
    navbar.addEventListener('mouseleave', hide);

    // Touch / mobile: tap the trigger to toggle
    trigger.addEventListener('click', () => {
      navbar.classList.toggle('is-visible');
    });

    // Always show when scrolled near top of hero
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      // Hide if user is scrolling down beyond hero, show if scrolling up
      if (y < 80) {
        show();
      } else if (y > lastY) {
        hide();
      } else {
        show();
      }
      lastY = y;
    }, { passive: true });
  }

  // ------- CONTACT FORM -------
  function setupContactForm() {
    const form = $('#contactForm');
    if (!form) return;
    const status = $('#formStatus');
    const submitBtn = $('#submitBtn');
    const submitText = $('#submitText');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = $('#cf-name').value.trim();
      const email = $('#cf-email').value.trim();
      const subject = $('#cf-subject').value.trim();
      const message = $('#cf-message').value.trim();

      if (!name || !email || !message) {
        showStatus('Please fill in your name, email, and message.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitText.textContent = 'Sending...';

      const entry = {
        id: 'm-' + Date.now(),
        name, email, subject, message,
        date: new Date().toISOString(),
        read: false
      };

      // Save to localStorage (acts as our JSON-backed store on the client)
      try {
        const list = JSON.parse(localStorage.getItem('hb_messages') || '[]');
        list.push(entry);
        localStorage.setItem('hb_messages', JSON.stringify(list));
      } catch (_) { /* ignore quota */ }

      // Simulate send delay for nice UX
      await new Promise(r => setTimeout(r, 600));

      submitBtn.disabled = false;
      submitText.textContent = 'Send message';
      form.reset();
      showStatus('Message sent — thanks! I\'ll get back to you soon.', 'success');
    });

    function showStatus(msg, type) {
      if (!status) return;
      status.textContent = msg;
      status.classList.remove('is-success', 'is-error');
      status.classList.add(type === 'success' ? 'is-success' : 'is-error');
      clearTimeout(showStatus._t);
      showStatus._t = setTimeout(() => {
        status.classList.remove('is-success', 'is-error');
      }, 6000);
    }
  }

  // ------- ADMIN TRIGGER + POPUP -------
  function setupAdmin() {
    const trigger = $('#adminTrigger');
    const overlay = $('#adminOverlay');
    const closeBtn = $('#adminPopupClose');
    const form = $('#adminLoginForm');
    const errEl = $('#adminPopupError');
    if (!trigger || !overlay || !form) return;

    // Check existing session
    isAdminLoggedIn = !!sessionStorage.getItem(SESSION_KEY);

    const open = () => {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      const firstInput = form.querySelector('input');
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
    };
    const close = () => {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      errEl.classList.remove('is-show');
      form.reset();
    };

    trigger.addEventListener('click', () => {
      if (isAdminLoggedIn) {
        window.location.href = 'admin.html';
      } else {
        open();
      }
    });
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = $('#al-user').value.trim();
      const pass = $('#al-pass').value;

      const admin = DATA?.admin || { username: 'admin', password: 'hamza2026' };
      if (user === admin.username && pass === admin.password) {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user, time: Date.now() }));
        isAdminLoggedIn = true;
        errEl.classList.remove('is-show');
        window.location.href = 'admin.html';
      } else {
        errEl.textContent = 'Invalid credentials. Try again.';
        errEl.classList.add('is-show');
      }
    });
  }

  // ------- YEAR -------
  function setYear() {
    const y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
  }

  // ------- INIT -------
  async function init() {
    await loadData();
    renderProfile();
    renderSkills();
    renderProjects();
    setYear();
    setupReveal();
    setupSkillBars();
    setupActiveNav();
    setupNavbarHover();
    setupContactForm();
    setupAdmin();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();