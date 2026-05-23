document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. BACKEND INTEGRATION: Fetch dynamic data ---
    fetch('/api/data')
        .then(res => res.json())
        .then(data => {
            const heroName = document.getElementById('dyn-hero-name');
            const heroImg = document.getElementById('dyn-hero-img');
            const aboutText = document.getElementById('dyn-about-text');
            const projTitle = document.getElementById('dyn-project-title');
            const projDesc = document.getElementById('dyn-project-desc');

            if(heroName) heroName.innerHTML = data.heroName;
            if(heroImg) heroImg.src = data.heroImage;
            if(aboutText) aboutText.innerHTML = data.aboutText;
            if(projTitle) projTitle.innerHTML = data.projectName;
            if(projDesc) projDesc.innerHTML = data.projectDesc;
        })
        .catch(err => console.log("Running in static mode, start the Node server to see dynamic content."));

    // --- 2. ADMIN LOGIN LOGIC ---
    const adminBtn = document.getElementById('admin-mode-btn');
    if(adminBtn) {
        adminBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const code = prompt("Enter Admin Code:");
            if(code === "1234") {
                // Save a temporary token and redirect
                sessionStorage.setItem("adminToken", "1234");
                window.location.href = "admin.html";
            } else {
                alert("Incorrect Password!");
            }
        });
    }

    // --- 3. Smooth Scrolling for Navigation Links ---
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
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- 4. Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll(".reveal");
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px" 
    };
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // --- 5. Contact Form Submission Handler ---
    const contactForm = document.querySelector(".contact-form");
    if (contactForm && !contactForm.id) { // Avoid interfering with the admin form
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector("button[type='submit']");
            const originalText = btn.innerHTML;
            btn.innerHTML = "Message Sent! ✓";
            btn.style.backgroundColor = "#28a745";
            setTimeout(() => {
                contactForm.reset();
                btn.innerHTML = originalText;
                btn.style.backgroundColor = "";
            }, 3000);
        });
    }

    // --- 6. Dark/Light Mode Toggle functionality ---
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