document.addEventListener("DOMContentLoaded", () => {
    // Footer year
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Theme
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

        // Admin button (Styled Modal)
    const adminBtn = document.getElementById('admin-mode-btn');
    if (adminBtn) {
        adminBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openAdminModal();
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            if (href === "#") return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerH = document.querySelector('.site-header').offsetHeight;
                const top = target.getBoundingClientRect().top + window.pageYOffset - headerH;
                window.scrollTo({ top, behavior: "smooth" });
            }
        });
    });

    // Scroll reveal
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("active"); });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

    // Load data
    loadPortfolioData();
});

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

    const comp = document.getElementById('dyn-about-competencies');
    comp.innerHTML = '';
    (about.competencies || []).forEach(c => {
        const s = document.createElement('span');
        s.textContent = c;
        comp.appendChild(s);
    });
}

function renderSkills(skills) {
    const container = document.getElementById('dyn-skills');
    container.innerHTML = '';
    (skills || []).forEach(skill => {
        const card = document.createElement('div');
        card.className = 'skill-card' + (skill.color === 'blue-solid' ? ' solid-blue' : '');
        card.innerHTML = `
            <div class="icon-circle ${skill.color || 'blue'}">
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
        const tagsHtml = (p.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('');
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
                <a href="${p.link || '#'}" class="project-link" target="_blank" rel="noopener">View Project →</a>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderContact(contact) {
    if (!contact) return;
    setText('dyn-contact-heading', contact.heading);
    setText('dyn-contact-description', contact.description);
    setText('dyn-contact-email', contact.email);
    setText('dyn-contact-github', contact.github);
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

// ============================================
// STYLED ADMIN LOGIN MODAL
// ============================================
function openAdminModal() {
    // Inject styles once
    if (!document.getElementById('admin-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'admin-modal-styles';
        style.textContent = `
            #admin-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
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
                border: 1px solid var(--border, #e7e5e4);
                border-radius: 20px;
                padding: 40px 36px;
                width: 100%;
                max-width: 420px;
                box-shadow: 0 20px 40px -10px rgba(0,0,0,0.12), 0 8px 16px -8px rgba(0,0,0,0.08);
                text-align: center;
                transform: scale(0.92) translateY(20px);
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            #admin-modal-overlay.show .admin-modal {
                transform: scale(1) translateY(0);
            }
            .admin-modal.shake {
                animation: modalShake 0.4s ease;
            }
            @keyframes modalShake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-10px); }
                40% { transform: translateX(10px); }
                60% { transform: translateX(-8px); }
                80% { transform: translateX(8px); }
            }
            .admin-modal-icon {
                width: 64px; height: 64px;
                background: rgba(79, 70, 229, 0.08);
                color: #4f46e5;
                border-radius: 16px;
                display: grid;
                place-items: center;
                margin: 0 auto 22px;
                font-size: 1.6rem;
            }
            .admin-modal h2 {
                font-size: 1.4rem;
                font-weight: 700;
                letter-spacing: -0.02em;
                margin-bottom: 8px;
                color: var(--text, #0c0a09);
            }
            .admin-modal > p {
                color: var(--text-soft, #78716c);
                font-size: 0.9rem;
                margin-bottom: 22px;
                line-height: 1.5;
            }
            .admin-modal input {
                width: 100%;
                padding: 12px 14px;
                border: 1px solid var(--border-strong, #d6d3d1);
                border-radius: 10px;
                font-size: 0.95rem;
                font-family: inherit;
                background: var(--bg, #fafaf9);
                color: var(--text, #0c0a09);
                transition: all 0.2s;
                text-align: center;
                letter-spacing: 0.1em;
                box-sizing: border-box;
            }
            .admin-modal input:focus {
                outline: none;
                border-color: #4f46e5;
                box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.08);
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
                background: #4f46e5;
                color: white;
            }
            .am-btn-primary:hover {
                background: #4338ca;
                transform: translateY(-1px);
                box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
            }
            .am-btn-ghost {
                background: transparent;
                color: var(--text, #0c0a09);
                border-color: var(--border-strong, #d6d3d1);
            }
            .am-btn-ghost:hover {
                background: var(--bg-alt, #f5f5f4);
                border-color: var(--text, #0c0a09);
                transform: translateY(-1px);
            }
            @media (max-width: 480px) {
                .admin-modal { padding: 32px 24px; }
                .admin-modal-actions { flex-direction: column-reverse; }
            }
        `;
        document.head.appendChild(style);
    }

    // Create overlay
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

    // Trigger animation
    requestAnimationFrame(() => overlay.classList.add('show'));

    const input = document.getElementById('admin-modal-code');
    const errorMsg = document.getElementById('admin-modal-error');
    const modal = overlay.querySelector('.admin-modal');
    input.focus();

    // Submit handler
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

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAdminModal(overlay);
    });

    // Close on Escape
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
