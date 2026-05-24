// Sidebar navigation
function showSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(sec => sec.style.display = 'none');
    document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
    document.getElementById(sectionId).style.display = 'block';
    event.target.classList.add('active');
}

// Load existing data
window.onload = async () => {
    const res = await fetch('/api/data');
    const data = await res.json();
    
    document.getElementById('about-text').value = data.about.text;
    document.getElementById('skills-input').value = data.skills.join(', ');
    renderAdminProjects(data.projects);
};

// Save About (Text & Image)
document.getElementById('about-form').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('text', document.getElementById('about-text').value);
    
    const imageFile = document.getElementById('about-image').files[0];
    if (imageFile) formData.append('image', imageFile);

    await fetch('/api/about', { method: 'POST', body: formData });
    alert('About section updated!');
};

// Save Skills
async function saveSkills() {
    const skillsArray = document.getElementById('skills-input').value.split(',').map(s => s.trim());
    await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: skillsArray })
    });
    alert('Skills updated!');
}

// Add Project
document.getElementById('project-form').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', document.getElementById('proj-title').value);
    formData.append('description', document.getElementById('proj-desc').value);
    formData.append('image', document.getElementById('proj-image').files[0]);

    await fetch('/api/projects', { method: 'POST', body: formData });
    alert('Project Added!');
    location.reload(); // Reload to show the new project
};

// Render Projects in Admin
function renderAdminProjects(projects) {
    const container = document.getElementById('admin-projects-list');
    container.innerHTML = '';
    projects.forEach(proj => {
        container.innerHTML += `
            <div class="admin-project-card">
                <h4>${proj.title}</h4>
                <button onclick="deleteProject('${proj.id}')" style="background: red;">Delete</button>
            </div>
        `;
    });
}

// Delete Project
async function deleteProject(id) {
    if(confirm('Are you sure you want to delete this project?')) {
        await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        location.reload();
    }
}

let portfolioData = { about: {}, skills: [], projects: [] };

function checkCode() {
    const code = document.getElementById('admin-code').value;
    if (code === 'admin123') { // Replace with your secure password
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        fetchData();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

async function fetchData() {
    try {
        const res = await fetch('/api/data');
        portfolioData = await res.json();
        renderDashboard();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function renderDashboard() {
    // Render About
    document.getElementById('about-name').value = portfolioData.about.name || '';
    document.getElementById('about-bio').value = portfolioData.about.bio || '';
    if(portfolioData.about.image) {
        document.getElementById('about-img-preview').src = portfolioData.about.image;
    }

    // Render Skills
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = '';
    portfolioData.skills.forEach((skill, index) => {
        skillsContainer.innerHTML += `
            <div class="item-card">
                <input type="text" value="${skill.name}" onchange="updateSkill(${index}, this.value)" placeholder="Skill Name" style="width:100%; padding:8px; box-sizing: border-box;">
                <button class="btn btn-danger" onclick="deleteSkill(${index})">Remove</button>
            </div>
        `;
    });

    // Render Projects
    const projectsContainer = document.getElementById('projects-container');
    projectsContainer.innerHTML = '';
    portfolioData.projects.forEach((proj, index) => {
        projectsContainer.innerHTML += `
            <div class="item-card">
                <img src="${proj.image || 'https://via.placeholder.com/300x180'}" alt="Preview">
                
                <div class="file-upload-wrapper" style="margin-bottom: 15px;">
                    <button class="btn" style="width: 100%; background: #4b5563;">Browse Image</button>
                    <input type="file" accept="image/*" onchange="uploadImage(event, 'project', ${index})">
                </div>

                <input type="text" value="${proj.title || ''}" onchange="updateProject(${index}, 'title', this.value)" placeholder="Project Title" style="width:100%; padding:8px; margin-bottom:10px; box-sizing: border-box;">
                <textarea onchange="updateProject(${index}, 'desc', this.value)" placeholder="Project Description" rows="3" style="width:100%; padding:8px; margin-bottom:10px; box-sizing: border-box;">${proj.desc || ''}</textarea>
                <input type="text" value="${proj.link || ''}" onchange="updateProject(${index}, 'link', this.value)" placeholder="Project Link" style="width:100%; padding:8px; box-sizing: border-box;">
                
                <button class="btn btn-danger" onclick="deleteProject(${index})">Delete Project</button>
            </div>
        `;
    });
}

// Opens the File Explorer and Uploads to the backend
async function uploadImage(event, type, index = null) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        
        if (type === 'about-img') {
            portfolioData.about.image = data.imageUrl;
        } else if (type === 'project') {
            portfolioData.projects[index].image = data.imageUrl;
        }
        renderDashboard(); // Refresh UI to show the new picture immediately
    } catch (error) {
        alert('Image upload failed.');
    }
}

// Portfolio Data Modifiers
function updateSkill(index, value) { portfolioData.skills[index].name = value; }
function deleteSkill(index) { portfolioData.skills.splice(index, 1); renderDashboard(); }
function addSkill() { portfolioData.skills.push({ name: '' }); renderDashboard(); }

function updateProject(index, key, value) { portfolioData.projects[index][key] = value; }
function deleteProject(index) { portfolioData.projects.splice(index, 1); renderDashboard(); }
function addProject() { portfolioData.projects.push({ title: '', desc: '', image: '', link: '' }); renderDashboard(); }

// Save changes to database.json
async function saveAllChanges() {
    portfolioData.about.name = document.getElementById('about-name').value;
    portfolioData.about.bio = document.getElementById('about-bio').value;

    try {
        const res = await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(portfolioData)
        });
        if (res.ok) {
            alert('Live Portfolio Published Successfully!');
        }
    } catch (error) {
        alert('Failed to save changes.');
    }
}