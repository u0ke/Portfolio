const ADMIN_CODE = 'admin123';
let data = {
    hero: {}, about: { paragraphs: [], competencies: [] },
    skills: [], projects: [], contact: {}
};

// === TOAST ===
function toast(msg, type = 'success') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show ' + type;
    setTimeout(() => t.className = 'toast', 2500);
}

// === TABS ===
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('sec-' + tab.dataset.tab).classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// === AUTH ===
function checkCode() {
    const code = document.getElementById('admin-code').value;
    if (code === ADMIN_CODE) {
        sessionStorage.setItem('adminToken', code);
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadData();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

// Allow Enter key
document.getElementById('admin-code')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') checkCode();
});

// Auto-login if token exists
if (sessionStorage.getItem('adminToken') === ADMIN_CODE) {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    window.addEventListener('DOMContentLoaded', loadData);
}

// === LOAD DATA ===
async function loadData() {
    try {
        const res = await fetch('/api/data');
        if (!res.ok) throw new Error('Failed to fetch');
        data = await res.json();
        // Ensure arrays exist
        data.about.paragraphs = data.about.paragraphs || [];
        data.about.competencies = data.about.competencies || [];
        data.skills = data.skills || [];
        data.projects = data.projects || [];
        renderAll();
    } catch (err) {
        console.error(err);
        toast('Failed to load data. Is the server running?', 'error');
    }
}

function renderAll() {
    // HERO
    setVal('hero-badge', data.hero.badge);
    setVal('hero-greeting', data.hero.greeting);
    setVal('hero-name', data.hero.name);
    setVal('hero-highlight', data.hero.highlight);
    setVal('hero-desc', data.hero.description);
    setVal('hero-expYears', data.hero.expYears);
    setVal('hero-expText', data.hero.expText);
    if (data.hero.image) {
        const img = document.getElementById('hero-img-preview');
        img.src = data.hero.image;
        img.style.display = 'block';
    }

    // ABOUT
    setVal('about-badge', data.about.badge);
    setVal('about-titleLine1', data.about.titleLine1);
    setVal('about-titleHighlight', data.about.titleHighlight);
    setVal('about-titleLine2', data.about.titleLine2);
    setVal('about-subtitle', data.about.subtitle);
    setVal('about-philosophyTitle', data.about.philosophyTitle);
    setVal('about-philosophyQuote', data.about.philosophyQuote);
    setVal('about-codeSnippet', data.about.codeSnippet);

    renderParagraphs();
    renderCompetencies();
    renderSkills();
    renderProjects();
    setVal('contact-heading', data.contact.heading);
    setVal('contact-description', data.contact.description);
    setVal('contact-email', data.contact.email);
    setVal('contact-github', data.contact.github);
}

function setVal(id, val) {
    const el = document.getElementById(id);
    if (el && val != null) el.value = val;
}

// === PARAGRAPHS ===
function renderParagraphs() {
    const container = document.getElementById('about-paragraphs-list');
    container.innerHTML = '';
    data.about.paragraphs.forEach((p, i) => {
        const row = document.createElement('div');
        row.className = 'form-group';
        row.style.marginBottom = '10px';
        row.innerHTML = `
            <div style="display: flex; gap: 8px; align-items: flex-start;">
                <textarea rows="2" onchange="updateParagraph(${i}, this.value)" style="flex: 1;">${escapeHtml(p)}</textarea>
                <button class="btn btn-sm btn-danger" onclick="deleteParagraph(${i})" style="flex-shrink: 0;">
                    <i class="fi fi-br-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(row);
    });
}
function updateParagraph(i, val) { data.about.paragraphs[i] = val; }
function deleteParagraph(i) {
    data.about.paragraphs.splice(i, 1);
    renderParagraphs();
}
function addParagraph() {
    data.about.paragraphs.push('');
    renderParagraphs();
    // Scroll & focus the new textarea
    const list = document.getElementById('about-paragraphs-list');
    const last = list.lastElementChild?.querySelector('textarea');
    if (last) last.focus();
}

// === COMPETENCIES ===
function renderCompetencies() {
    const container = document.getElementById('about-competencies-list');
    container.innerHTML = '';
    data.about.competencies.forEach((c, i) => {
        const row = document.createElement('div');
        row.className = 'list-row';
        row.innerHTML = `
            <input type="text" value="${escapeHtml(c)}" onchange="updateCompetency(${i}, this.value)">
            <button class="btn btn-sm btn-danger" onclick="deleteCompetency(${i})">
                <i class="fi fi-br-trash"></i>
            </button>
        `;
        container.appendChild(row);
    });
}
function updateCompetency(i, val) { data.about.competencies[i] = val; }
function deleteCompetency(i) {
    data.about.competencies.splice(i, 1);
    renderCompetencies();
}
function addCompetency() {
    data.about.competencies.push('');
    renderCompetencies();
    const list = document.getElementById('about-competencies-list');
    const last = list.lastElementChild?.querySelector('input');
    if (last) last.focus();
}

// === SKILLS ===
function renderSkills() {
    const container = document.getElementById('skills-container');
    container.innerHTML = '';
    data.skills.forEach((s, i) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.78rem;">Icon Class (Flaticon)</label>
                <input type="text" value="${escapeHtml(s.icon || '')}" onchange="updateSkill(${i}, 'icon', this.value)" placeholder="fi fi-rr-rocket-lunch">
            </div>
            <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.78rem;">Title</label>
                <input type="text" value="${escapeHtml(s.title || '')}" onchange="updateSkill(${i}, 'title', this.value)">
            </div>
            <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.78rem;">Description</label>
                <textarea rows="2" onchange="updateSkill(${i}, 'desc', this.value)">${escapeHtml(s.desc || '')}</textarea>
            </div>
            <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.78rem;">Color Variant</label>
                <select onchange="updateSkill(${i}, 'color', this.value)">
                    <option value="blue" ${s.color === 'blue' ? 'selected' : ''}>Blue (Default)</option>
                    <option value="red" ${s.color === 'red' ? 'selected' : ''}>Red (Pink)</option>
                    <option value="blue-solid" ${s.color === 'blue-solid' ? 'selected' : ''}>Blue Solid (Filled)</option>
                </select>
            </div>
            <div class="item-card-actions">
                <button class="btn btn-sm btn-danger" onclick="deleteSkill(${i})">
                    <i class="fi fi-br-trash"></i> Remove
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}
function updateSkill(i, key, val) { data.skills[i][key] = val; }
function deleteSkill(i) {
    if (confirm('Remove this skill?')) {
        data.skills.splice(i, 1);
        renderSkills();
    }
}
function addSkill() {
    data.skills.push({ title: '', desc: '', icon: 'fi fi-rr-star', color: 'blue' });
    renderSkills();
}

// === PROJECTS ===
function renderProjects() {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';
    data.projects.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <img src="${p.image || ''}" class="img-preview" onerror="this.style.opacity=0">
            <div class="file-upload-wrapper">
                <button class="btn btn-sm btn-ghost btn-block" type="button">
                    <i class="fi fi-br-upload"></i> Change Image
                </button>
                <input type="file" accept="image/*" onchange="uploadImage(event, 'project', ${i})">
            </div>
            <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.78rem;">Title</label>
                <input type="text" value="${escapeHtml(p.title || '')}" onchange="updateProject(${i}, 'title', this.value)">
            </div>
            <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.78rem;">Description</label>
                <textarea rows="2" onchange="updateProject(${i}, 'desc', this.value)">${escapeHtml(p.desc || '')}</textarea>
            </div>
            <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.78rem;">Project Link</label>
                <input type="text" value="${escapeHtml(p.link || '')}" onchange="updateProject(${i}, 'link', this.value)" placeholder="https://...">
            </div>
            <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.78rem;">Tags (comma separated)</label>
                <input type="text" value="${(p.tags || []).join(', ')}" onchange="updateProjectTags(${i}, this.value)">
            </div>
            <div class="item-card-actions">
                <button class="btn btn-sm btn-danger" onclick="deleteProject(${i})">
                    <i class="fi fi-br-trash"></i> Delete
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}
function updateProject(i, key, val) { data.projects[i][key] = val; }
function updateProjectTags(i, val) {
    data.projects[i].tags = val.split(',').map(t => t.trim()).filter(Boolean);
}
function deleteProject(i) {
    if (confirm('Delete this project?')) {
        data.projects.splice(i, 1);
        renderProjects();
    }
}
function addProject() {
    data.projects.push({ title: '', desc: '', image: '', link: '#', tags: [] });
    renderProjects();
}

// === IMAGE UPLOAD ===
async function uploadImage(event, target, index = null) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error);

        if (target === 'hero') {
            data.hero.image = result.imageUrl;
        } else if (target === 'project') {
            data.projects[index].image = result.imageUrl;
        }
        renderAll();
        toast('Image uploaded successfully');
    } catch (err) {
        console.error(err);
        toast('Image upload failed', 'error');
    }
}

// === SAVE ALL ===
async function saveAllChanges() {
    // Collect from inputs
    data.hero.badge = getVal('hero-badge');
    data.hero.greeting = getVal('hero-greeting');
    data.hero.name = getVal('hero-name');
    data.hero.highlight = getVal('hero-highlight');
    data.hero.description = getVal('hero-desc');
    data.hero.expYears = getVal('hero-expYears');
    data.hero.expText = getVal('hero-expText');

    data.about.badge = getVal('about-badge');
    data.about.titleLine1 = getVal('about-titleLine1');
    data.about.titleHighlight = getVal('about-titleHighlight');
    data.about.titleLine2 = getVal('about-titleLine2');
    data.about.subtitle = getVal('about-subtitle');
    data.about.philosophyTitle = getVal('about-philosophyTitle');
    data.about.philosophyQuote = getVal('about-philosophyQuote');
    data.about.codeSnippet = getVal('about-codeSnippet');

    data.contact.heading = getVal('contact-heading');
    data.contact.description = getVal('contact-description');
    data.contact.email = getVal('contact-email');
    data.contact.github = getVal('contact-github');

    try {
        const res = await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data, null, 2)
        });
        if (!res.ok) throw new Error('Save failed');
        toast('✅ Portfolio published to database.json!');
    } catch (err) {
        console.error(err);
        toast('Failed to save', 'error');
    }
}

function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
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
