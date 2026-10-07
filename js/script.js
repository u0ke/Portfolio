const projects = [
  {
    id: "group-finder", name: "Group Finder", year: "2025",
    description: "A web application that helps users discover and join groups based on shared interests. It features group search, category filtering, member management, and an intuitive interface for connecting people with similar passions.",
    tech: ["HTML", "JavaScript", "Tailwind CSS"], mark: "?", a: "#f5f5f5", b: "#e5e5e5", text: "#d4d4d4",
    live: "https://github.com/u0ke/group-finder.git",
    source: "https://github.com/u0ke/group-finder.git"
  },
  {
    id: "task-flow", name: "Task Flow", year: "2025",
    description: "A modern task management platform that helps users organize, track, and complete their work efficiently. It includes task creation, priority management, progress tracking, deadlines, and an intuitive dashboard.",
    tech: ["HTML5", "Tailwind", "JavaScript"], mark: "~", a: "#f5f5f5", b: "#d4d4d4", text: "#d4d4d4",
    live: "https://github.com/hfdkr/Task_Flow.git",
    source: "https://github.com/hfdkr/Task_Flow.git"
  },
  {
    id: "Hamza-portfolio", name: "Hamza's Portfolio", year: "2025",
    description: "My first personal portfolio, designed with a minimalist approach, soft color palettes, and a smooth, elegant layout inspired by modern design principles.",
    tech: ["HTML", "CSS", "Vanilla JavaScript"], mark: "hamza", a: "#f5f5f5", b: "#e5e5e5", text: "#d4d4d4",
    live: "https://github.com/u0ke/Portfolio.git",
    source: "https://github.com/u0ke/Portfolio.git"
  }
];

const projectList = document.getElementById("project-list");

function renderProjects(filter = "All") {
  const list = filter === "All" ? projects : projects.filter(p => p.year === filter);

  projectList.innerHTML = list.map(p => `
    <article class="project-row">
      <div>
        <div class="project-preview" style="--preview-a:${p.a};--preview-b:${p.b};--preview-text:${p.text}">
          <span class="preview-mark">${p.mark}</span>
        </div>
      </div>
      <div class="project-details">
        <div>
          <div class="project-year"><span>${p.year}</span><i></i></div>
          <h3 class="project-title">${p.name}</h3>
          <p class="project-description">${p.description}</p>
          <div class="techs">${p.tech.map(t => `<span class="tech">${t}</span>`).join("")}</div>
        </div>
        <div class="project-links">
          <a href="${p.live}" target="_blank" rel="noopener noreferrer">Live demo ↗</a>
          <a href="${p.source}" target="_blank" rel="noopener noreferrer">Source ◉</a>
        </div>
      </div>
    </article>
  `).join("");
}

renderProjects();

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    renderProjects(button.dataset.filter);
  });
});

// Theme: keeps the React version's localStorage behavior.
const root = document.documentElement;

const themeButtons = [
  document.getElementById("theme-toggle"),
  document.getElementById("theme-toggle-mobile")
];

function getTheme() {
  const stored = localStorage.getItem("theme");
  return stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}

function applyTheme(theme) {
  root.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
  themeButtons.forEach(btn => { if (btn) btn.textContent = theme === "dark" ? "☀" : "☾"; });
}

applyTheme(getTheme());

themeButtons.forEach(btn => btn?.addEventListener("click", () => {
  applyTheme(root.classList.contains("dark") ? "light" : "dark");
}));

// Header scroll state.
const header = document.getElementById("site-header");

function updateHeader() { header.classList.toggle("scrolled", window.scrollY > 24); }

updateHeader();

window.addEventListener("scroll", updateHeader, { passive: true });

// Mobile menu.
const mobileMenu = document.getElementById("mobile-menu");

document.getElementById("menu-toggle").addEventListener("click", () => {
  mobileMenu.classList.add("open");
  mobileMenu.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
});

document.getElementById("menu-close").addEventListener("click", closeMenu);

document.querySelectorAll(".mobile-links a").forEach(link => link.addEventListener("click", closeMenu));

function closeMenu() {
  mobileMenu.classList.remove("open");
  mobileMenu.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Active navigation / scroll spy.
const navLinks = [...document.querySelectorAll(".desktop-nav a")];

const sections = ["about", "skills", "projects", "education", "contact"].map(id => document.getElementById(id));

function updateActiveNav() {
  const position = window.scrollY + 100;
  let active = "";
  sections.forEach(section => { if (section.offsetTop <= position) active = section.id; });
  navLinks.forEach(link => link.style.color = link.getAttribute("href") === `#${active}` ? "var(--text)" : "");
}

window.addEventListener("scroll", updateActiveNav, { passive: true });

updateActiveNav();

// Reveal-on-scroll replacement for Framer Motion.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: "0px 0px -60px 0px" });

document.querySelectorAll(".reveal:not(.visible)").forEach(el => observer.observe(el));

// Copy email.
const copyButton = document.getElementById("copy-email");

const copied = document.getElementById("copied");

const copyIcon = document.getElementById("copy-icon");

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("barihamza73@gmail.com");
    copied.classList.add("show");
    copyIcon.textContent = "✓";
    setTimeout(() => { copied.classList.remove("show"); copyIcon.textContent = "□"; }, 2000);
  } catch {
    window.location.href = "mailto:barihamza73@gmail.com";
  }
});
