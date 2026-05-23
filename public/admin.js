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