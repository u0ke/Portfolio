document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. FULL DATABASE FETCH ---
    fetch('/api/data')
        .then(res => res.json())
        .then(data => {
            // Hero
            if(data.hero) {
                document.getElementById('dyn-hero-badge').innerHTML = data.hero.badge;
                document.getElementById('dyn-hero-name').innerHTML = data.hero.name;
                document.getElementById('dyn-hero-desc').innerHTML = data.hero.desc;
                document.getElementById('dyn-hero-img').src = data.hero.image;
                document.getElementById('dyn-hero-exp-years').innerHTML = data.hero.expYears;
                document.getElementById('dyn-hero-exp-text').innerHTML = data.hero.expText;
            }
            // About
            if(data.about) {
                document.getElementById('dyn-about-badge').innerHTML = data.about.badge;
                document.getElementById('dyn-about-title').innerHTML = data.about.title;
                document.getElementById('dyn-about-subtitle').innerHTML = data.about.subtitle;
            }
            // Skills
            if(data.skills) {
                document.getElementById('dyn-s1-icon').className = data.skills.s1.icon;
                document.getElementById('dyn-s1-title').innerHTML = data.skills.s1.title;
                document.getElementById('dyn-s1-desc').innerHTML = data.skills.s1.desc;
                
                document.getElementById('dyn-s2-icon').className = data.skills.s2.icon;
                document.getElementById('dyn-s2-title').innerHTML = data.skills.s2.title;
                document.getElementById('dyn-s2-desc').innerHTML = data.skills.s2.desc;
                
                document.getElementById('dyn-s3-icon').className = data.skills.s3.icon;
                document.getElementById('dyn-s3-title').innerHTML = data.skills.s3.title;
                document.getElementById('dyn-s3-desc').innerHTML = data.skills.s3.desc;
            }
            // Projects
            if(data.projects) {
                document.getElementById('dyn-p1-img').src = data.projects.p1.img;
                document.getElementById('dyn-p1-title').innerHTML = data.projects.p1.title;
                document.getElementById('dyn-p1-desc').innerHTML = data.projects.p1.desc;
                
                document.getElementById('dyn-p2-img').src = data.projects.p2.img;
                document.getElementById('dyn-p2-title').innerHTML = data.projects.p2.title;
                document.getElementById('dyn-p2-desc').innerHTML = data.projects.p2.desc;
            }
        })
        .catch(err => console.log("Running in static mode, start the Node server to see dynamic content."));

    // --- 2. ADMIN LOGIN ---
    const adminBtn = document.getElementById('admin-mode-btn');
    if(adminBtn) {
        adminBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const code = prompt("Enter Admin Code:");
            if(code === "1234") {
                sessionStorage.setItem("adminToken", "1234");
                window.location.href = "admin.html";
            } else {
                alert("Incorrect Password!");
            }
        });
    }

    // --- 3. SMOOTH SCROLLING ---
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });

    // --- 4. SCROLL REVEAL ---
    const revealElements = document.querySelectorAll(".reveal");
    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("active"); });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    revealElements.forEach(el => revealOnScroll.observe(el));

    // --- 5. DARK MODE TOGGLE ---
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon = themeToggleBtn.querySelector("i");
    const currentTheme = localStorage.getItem("theme");
    
    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeIcon.classList.replace("fi-br-moon", "fi-br-sun");
    }

    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            themeIcon.classList.replace("fi-br-moon", "fi-br-sun");
            localStorage.setItem("theme", "dark");
        } else {
            themeIcon.classList.replace("fi-br-sun", "fi-br-moon");
            localStorage.setItem("theme", "light");
        }
    });
});