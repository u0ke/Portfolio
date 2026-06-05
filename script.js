document.addEventListener("DOMContentLoaded", () => {
    // Footer year
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ======================================================
    //  THEME TOGGLE  (kept from original, robustified)
    // ======================================================
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon = themeToggleBtn?.querySelector("i");
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeIcon?.classList.replace("fi-br-moon", "fi-br-sun");
    }
    themeToggleBtn?.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            themeIcon?.classList.replace("fi-br-moon", "fi-br-sun");
            localStorage.setItem("theme", "dark");
        } else {
            themeIcon?.classList.replace("fi-br-sun", "fi-br-moon");
            localStorage.setItem("theme", "light");
        }
    });

    // ======================================================
    //  LAYOUT TOGGLE  (NEW: alternates between two layouts)
    // ======================================================
    const layoutBtn = document.getElementById("layout-toggle");
    const savedLayout = localStorage.getItem("layout") || "default";
    if (savedLayout === "split") document.body.classList.add("layout-split");
    layoutBtn?.addEventListener("click", () => {
        document.body.classList.toggle("layout-split");
        const isSplit = document.body.classList.contains("layout-split");
        localStorage.setItem("layout", isSplit ? "split" : "default");
        layoutBtn.style.transform = isSplit ? "rotate(180deg)" : "rotate(0)";
        setTimeout(() => (layoutBtn.style.transform = ""), 350);
    });

    // ======================================================
    //  CUSTOM CURSOR  (desktop only, with hover scaling)
    // ======================================================
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;

    if (dot && ring && !isCoarse) {
        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let dx = mx, dy = my;
        let rx = mx, ry = my;

        window.addEventListener("mousemove", (e) => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
        });

        // smooth follow for the ring
        function loop() {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(loop);
        }
        loop();

        // hover state on interactive elements
        const hoverSel = "a, button, .tag-chip, .skill-card, .project-card, .contact-method, .icon-btn, input, textarea";
        document.addEventListener("mouseover", (e) => {
            if (e.target.closest(hoverSel)) {
                dot.classList.add("is-hover");
                ring.classList.add("is-hover");
            }
        });
        document.addEventListener("mouseout", (e) => {
            if (e.target.closest(hoverSel)) {
                dot.classList.remove("is-hover");
                ring.classList.remove("is-hover");
            }
        });

        // hide cursor when leaving window
        document.addEventListener("mouseleave", () => {
            dot.style.opacity = "0";
            ring.style.opacity = "0";
        });
        document.addEventListener("mouseenter", () => {
            dot.style.opacity = "1";
            ring.style.opacity = "1";
        });
    }

    // ======================================================
    //  ICE PARTICLES (snowfall)
    // ======================================================
    const particlesHost = document.getElementById("ice-particles");
    if (particlesHost) {
        const COUNT = window.innerWidth < 640 ? 18 : 36;
        for (let i = 0; i < COUNT; i++) {
            const p = document.createElement("span");
            const size = 2 + Math.random() * 6;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.left = `${Math.random() * 100}%`;
            p.style.animationDuration = `${8 + Math.random() * 14}s`;
            p.style.animationDelay = `${-Math.random() * 18}s`;
            p.style.opacity = (0.3 + Math.random() * 0.6).toFixed(2);
            particlesHost.appendChild(p);
        }
    }

    // ======================================================
    //  SCROLL PROGRESS BAR
    // ======================================================
    const progressBar = document.getElementById("scroll-progress");
    function updateProgress() {
        const h = document.documentElement;
        const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
        if (progressBar) progressBar.style.width = `${scrolled}%`;
    }
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    // ======================================================
    //  PARALLAX on auroras (mouse move)
    // ======================================================
    const auroras = document.querySelectorAll(".aurora");
    if (auroras.length && !isCoarse) {
        window.addEventListener("mousemove", (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            auroras.forEach((a, i) => {
                const depth = (i + 1) * 0.4;
                a.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
            });
        });
    }

    // ======================================================
    //  ADMIN MODAL BUTTON
    // ======================================================
    const adminBtn = document.getElementById('admin-mode-btn');
    if (adminBtn) {
        adminBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openAdminModal();
        });
    }

    // ======================================================
    //  SMOOTH SCROLL  (offset for sticky header)
    // ======================================================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            if (href === "#") return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerH = document.querySelector('.site-header')?.offsetHeight || 0;
                const top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 12;
                window.scrollTo({ top, behavior: "smooth" });
            }
        });
    });

    // ======================================================
    //  SCROLL REVEAL
    // ======================================================
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("active"); });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

    // ======================================================
    //  TILT EFFECT on project + skill cards (desktop)
    // ======================================================
    if (!isCoarse) {
        const tiltEls = document.querySelectorAll(".project-card, .skill-card, .image-frame");
        tiltEls.forEach(el => {
            el.addEventListener("mousemove", (e) => {
                const r = el.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                el.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-6px)`;
            });
            el.addEventListener("mouseleave", () => {
                el.style.transform = "";
            });
        });
    }

    // ======================================================
    //  LOAD DATA FROM BACKEND
    // ======================================================
    loadPortfolioData();
});

// ======================================================
//  DATA FETCH + RENDER
// ======================================================
async function loadPortfolioData() {
    try {
        const res = await fetch('/api/data');
        if (!res.ok) throw new Error('No data');
        const data = await res.json();
        renderHero(data.hero);
        renderAbout(data.about);
        renderSkills(data.skills);
        renderProjects(data.projects);
        renderContact(data.contact);
        renderStats(data.stats);
        renderJourney(data.journey);
    } catch (err) {
        console.warn('Static fallback (no server).', err);
    }
}

function renderHero(hero) {
    if (!hero) return;
    setText('dyn-hero-badge', hero.badge);
    setText('dyn-hero-greeting', hero.greeting);
    setText('dyn-hero-highlight', hero.highlight);
    setText('dyn-hero-desc', hero.description);
    setText('dyn-hero-exp-years', hero.expYears);
    setText('dyn-hero-exp-text', hero.expText);
    setText('dyn-hero-exp-years-badge', hero.expBadge || hero.expYears);
    setText('dyn-hero-name-first', hero.firstName || 'Hamza');
    setText('dyn-hero-name-last', hero.lastName || 'Bari');
    setText('dyn-hero-projects', hero.projectsCount || '12+');
    if (hero.image) document.getElementById('dyn-hero-img').src = hero.image;
}

function renderAbout(about) {
    if (!about) return;
    setText('dyn-about-badge', about.badge);
    setText('dyn-about-titleLine1', about.titleLine1);
    setText('dyn-about-titleHighlight', about.titleHighlight);
    setText('dyn-about-titleLine2', about.titleLine2);
    setText('dyn-about-subtitle', about.subtitle);
    setText('dyn-about-philosophyTitle', about.philosophyTitle);
    setText('dyn-about-philosophyQuote', about.philosophyQuote);
    setText('dyn-about-codeSnippet', about.codeSnippet);

    const pContainer = document.getElementById('dyn-about-paragraphs');
    pContainer.innerHTML = '';
    (about.paragraphs || []).forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        pContainer.appendChild(p);
    });

    renderCompetencies(about.competencies || []);
}

function renderCompetencies(list) {
    const comp = document.getElementById('dyn-about-competencies');
    comp.innerHTML = '';
    list.forEach(item => {
        const label = typeof item === 'string' ? item : item.label;
        const lang = (typeof item === 'object' && item.lang) || detectLang(label);
        const chip = document.createElement('span');
        chip.className = 'tag-chip';
        chip.dataset.lang = lang;
        chip.textContent = label;
        comp.appendChild(chip);
    });
}

function detectLang(text) {
    const t = text.toLowerCase();
    if (t.includes('html'))    return 'html';
    if (t.includes('css'))     return 'css';
    if (t.includes('js') || t.includes('javascript')) return 'js';
    if (t.includes('ts') || t.includes('typescript')) return 'ts';
    if (t.includes('react'))   return 'react';
    if (t.includes('tailwind'))return 'tailwind';
    if (t.includes('node'))    return 'node';
    if (t.includes('git'))     return 'git';
    if (t.includes('figma'))   return 'figma';
    if (t.includes('python'))  return 'python';
    return 'default';
}

function renderSkills(skills) {
    const container = document.getElementById('dyn-skills');
    container.innerHTML = '';
    (skills || []).forEach(skill => {
        const card = document.createElement('div');
        const theme = skill.color || 'ice';
        card.className = 'skill-card' + (theme === 'ice-solid' ? ' solid-ice' : '');
        card.innerHTML = `
            <div class="icon-circle ${theme === 'ice-solid' ? 'outline' : theme}">
                <i class="${skill.icon}"></i>
            </div>
            <h3>${escapeHtml(skill.title)}</h3>
            <p>${escapeHtml(skill.desc)}</p>
        `;
        container.appendChild(card);
    });
}

function renderProjects(projects) {
    const container = document.getElementById('dyn-projects');
    container.innerHTML = '';
    (projects || []).forEach(p => {
        const tagsHtml = (p.tags || []).map(t =>
            `<span class="tag" data-lang="${detectLang(t)}">${escapeHtml(t)}</span>`
        ).join('');
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-img">
                <img src="${p.image || ''}" alt="${escapeHtml(p.title || '')}" onerror="this.style.opacity=0">
            </div>
            <div class="project-info">
                <div class="tags">${tagsHtml}</div>
                <h3>${escapeHtml(p.title)}</h3>
                <p>${escapeHtml(p.desc)}</p>
                <a href="${p.link || '#'}" class="project-link" target="_blank" rel="noopener">View Project <span>→</span></a>
            </div>
        `;
        container.appendChild(card);
    });

    // re-apply tilt to newly added project cards
    if (!window.matchMedia('(pointer: coarse)').matches) {
        const newCards = container.querySelectorAll('.project-card');
        newCards.forEach(el => {
            el.addEventListener("mousemove", (e) => {
                const r = el.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                el.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-8px)`;
            });
            el.addEventListener("mouseleave", () => { el.style.transform = ""; });
        });
    }
}

function renderContact(contact) {
    if (!contact) return;
    setText('dyn-contact-heading', contact.heading);
    setText('dyn-contact-description', contact.description);
    setText('dyn-contact-email', contact.email);
    setText('dyn-contact-github', contact.github);

    // Wire the email anchor to a real mailto:
    const emailLink = document.getElementById('dyn-contact-email-link');
    if (emailLink && contact.email) emailLink.href = `mailto:${contact.email}`;

    // Wire the GitHub anchor to a real https://github.com/<user>
    const ghLink = document.getElementById('dyn-contact-github-link');
    if (ghLink) {
        const handle = (contact.githubHandle || contact.github || '').replace(/^@/, '').trim();
        if (handle) ghLink.href = `https://github.com/${handle}`;
    }
}

function renderStats(stats) {
    const container = document.getElementById('dyn-stats');
    if (!container || !stats) return;
    container.innerHTML = '';
    stats.forEach(s => {
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.innerHTML = `<strong>${escapeHtml(s.value)}</strong><span>${escapeHtml(s.label)}</span>`;
        container.appendChild(card);
    });
}

function renderJourney(journey) {
    const container = document.getElementById('dyn-journey');
    if (!container || !journey) return;
    container.innerHTML = '';
    journey.forEach(j => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-year">${escapeHtml(j.year)}</div>
            <h4>${escapeHtml(j.title)}</h4>
            <p>${escapeHtml(j.desc)}</p>
        `;
        container.appendChild(item);
    });
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text != null) el.textContent = text;
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ======================================================
//  STYLED ADMIN LOGIN MODAL  (kept + minor cleanup)
// ======================================================
function openAdminModal() {
    if (!document.getElementById('admin-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'admin-modal-styles';
        style.textContent = `
            #admin-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(2, 18, 36, 0.65);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                display: grid;
                place-items: center;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.25s ease;
                padding: 20px;
            }
            #admin-modal-overlay.show { opacity: 1; }
            .admin-modal {
                background: var(--surface, #ffffff);
                border: 1px solid var(--border, #d2e7f3);
                border-radius: 22px;
                padding: 40px 36px;
                width: 100%;
                max-width: 420px;
                box-shadow: var(--shadow-lg, 0 24px 50px -16px rgba(2,132,199,0.28));
                text-align: center;
                transform: scale(0.92) translateY(20px);
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            #admin-modal-overlay.show .admin-modal { transform: scale(1) translateY(0); }
            .admin-modal.shake { animation: modalShake 0.4s ease; }
            @keyframes modalShake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-10px); }
                40% { transform: translateX(10px); }
                60% { transform: translateX(-8px); }
                80% { transform: translateX(8px); }
            }
            .admin-modal-icon {
                width: 64px; height: 64px;
                background: linear-gradient(135deg, var(--primary), var(--ice));
                color: white;
                border-radius: 18px;
                display: grid;
                place-items: center;
                margin: 0 auto 22px;
                font-size: 1.6rem;
                box-shadow: 0 8px 20px -6px rgba(2, 132, 199, 0.5);
            }
            .admin-modal h2 {
                font-size: 1.4rem;
                font-weight: 700;
                letter-spacing: -0.02em;
                margin-bottom: 8px;
                color: var(--text, #06121e);
            }
            .admin-modal > p {
                color: var(--text-soft, #5a7a92);
                font-size: 0.9rem;
                margin-bottom: 22px;
                line-height: 1.5;
            }
            .admin-modal input {
                width: 100%;
                padding: 12px 14px;
                border: 1px solid var(--border-strong, #aed2e6);
                border-radius: 10px;
                font-size: 0.95rem;
                font-family: inherit;
                background: var(--bg, #f4faff);
                color: var(--text, #06121e);
                transition: all 0.2s;
                text-align: center;
                letter-spacing: 0.1em;
                box-sizing: border-box;
            }
            .admin-modal input:focus {
                outline: none;
                border-color: var(--primary, #0284c7);
                box-shadow: 0 0 0 3px var(--primary-soft, rgba(2, 132, 199, 0.10));
                background: var(--surface, #ffffff);
            }
            .admin-modal-error {
                color: #dc2626;
                font-size: 0.82rem;
                font-weight: 600;
                display: none;
                margin: 10px 0 0;
            }
            .admin-modal-actions {
                display: flex;
                gap: 10px;
                margin-top: 22px;
            }
            .am-btn {
                flex: 1;
                padding: 11px 18px;
                border-radius: 10px;
                font-weight: 600;
                font-size: 0.9rem;
                font-family: inherit;
                cursor: pointer;
                border: 1px solid transparent;
                transition: all 0.2s;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }
            .am-btn-primary {
                background: linear-gradient(135deg, var(--primary, #0284c7), var(--primary-light, #38bdf8));
                color: white;
            }
            .am-btn-primary:hover {
                transform: translateY(-1px);
                box-shadow: 0 6px 16px rgba(2, 132, 199, 0.4);
            }
            .am-btn-ghost {
                background: transparent;
                color: var(--text, #06121e);
                border-color: var(--border-strong, #aed2e6);
            }
            .am-btn-ghost:hover {
                background: var(--bg-alt, #e6f3fc);
                border-color: var(--text, #06121e);
                transform: translateY(-1px);
            }
            @media (max-width: 480px) {
                .admin-modal { padding: 32px 24px; }
                .admin-modal-actions { flex-direction: column-reverse; }
            }
        `;
        document.head.appendChild(style);
    }

    const overlay = document.createElement('div');
    overlay.id = 'admin-modal-overlay';
    overlay.innerHTML = `
        <div class="admin-modal">
            <div class="admin-modal-icon">
                <i class="fi fi-br-lock"></i>
            </div>
            <h2>Admin Access</h2>
            <p>Enter the access code to manage your portfolio.</p>
            <input type="password" id="admin-modal-code" placeholder="Access code" autocomplete="off">
            <p id="admin-modal-error" class="admin-modal-error">Incorrect code. Please try again.</p>
            <div class="admin-modal-actions">
                <button class="am-btn am-btn-ghost" id="admin-modal-cancel">Cancel</button>
                <button class="am-btn am-btn-primary" id="admin-modal-submit">
                    <i class="fi fi-br-check"></i> Access Dashboard
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    requestAnimationFrame(() => overlay.classList.add('show'));

    const input = document.getElementById('admin-modal-code');
    const errorMsg = document.getElementById('admin-modal-error');
    const modal = overlay.querySelector('.admin-modal');
    input.focus();

    const submit = () => {
        const code = input.value.trim();
        if (code === 'admin123') {
            sessionStorage.setItem('adminToken', code);
            closeAdminModal(overlay);
            setTimeout(() => { window.location.href = 'admin.html'; }, 200);
        } else {
            errorMsg.style.display = 'block';
            input.value = '';
            input.focus();
            modal.classList.add('shake');
            setTimeout(() => modal.classList.remove('shake'), 400);
        }
    };

    document.getElementById('admin-modal-submit').addEventListener('click', submit);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submit();
    });
    input.addEventListener('input', () => {
        errorMsg.style.display = 'none';
    });
    document.getElementById('admin-modal-cancel').addEventListener('click', () => {
        closeAdminModal(overlay);
    });
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAdminModal(overlay);
    });
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeAdminModal(overlay);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

function closeAdminModal(overlay) {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 250);
}
