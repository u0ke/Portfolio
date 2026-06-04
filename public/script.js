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

    // Admin button
    const adminBtn = document.getElementById('admin-mode-btn');
    adminBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const code = prompt("Enter Admin Code:");
        if (code === "admin123") {
            sessionStorage.setItem("adminToken", code);
            window.location.href = "admin.html";
        } else if (code !== null) {
            alert("Incorrect Password!");
        }
    });

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
