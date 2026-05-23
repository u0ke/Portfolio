document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Offset for the fixed header
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

    // 2. Scroll Reveal Animations using Intersection Observer
    const revealElements = document.querySelectorAll(".reveal");

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" 
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add("active");
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 3. Contact Form Submission Handler (Mock functionality)
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector("button[type='submit']");
            const originalText = btn.innerHTML;
            
            // Visual feedback
            btn.innerHTML = "Message Sent! ✓";
            btn.style.backgroundColor = "#28a745"; // Green success color
            
            // Reset form after 3 seconds
            setTimeout(() => {
                contactForm.reset();
                btn.innerHTML = originalText;
                btn.style.backgroundColor = "";
            }, 3000);
        });
    }
});