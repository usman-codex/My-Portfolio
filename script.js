document.addEventListener('DOMContentLoaded', () => {

    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // --- Navbar Sticky & Mobile Menu ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'var(--background-color)'; // Ensure bg color on scroll
            navbar.style.boxShadow = '0 2px 5px var(--shadow-color)';
        } else {
            // Reset styles if needed, depends on initial navbar state
             // navbar.style.backgroundColor = 'transparent'; // Example if transparent initially
             // navbar.style.boxShadow = 'none';
        }
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // --- Dark Mode Toggle ---
    const applyDarkMode = (isDark) => {
        if (isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };

    // Check local storage for saved preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
        applyDarkMode(savedMode === 'true');
    } else {
        applyDarkMode(true); // Always default to dark mode
        localStorage.setItem('darkMode', true); // Save preference
    }
    
    darkModeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    });

    // --- Scroll Animations (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target);
            } else {
                 // Optional: Remove class if you want animation to replay on scroll up
                 // entry.target.classList.remove('is-visible');
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });


    // --- Contact Form Submission ---
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default page reload

            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');
            formStatus.textContent = 'Sending...';
            formStatus.className = 'form-status'; // Reset classes
            submitButton.disabled = true;

            try {
                // **IMPORTANT:** Replace with your actual Formspree endpoint or backend URL
                const response = await fetch('YOUR_FORMSPREE_ENDPOINT', { // <--- REPLACE THIS
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully! Thank you.';
                    formStatus.classList.add('success');
                    contactForm.reset(); // Clear the form
                } else {
                    // Try to get error details from response if possible
                    const data = await response.json();
                    if (data.errors) {
                         formStatus.textContent = data.errors.map(error => error.message).join(', ');
                    } else {
                        formStatus.textContent = 'Oops! There was a problem sending your message.';
                    }
                     formStatus.classList.add('error');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                formStatus.textContent = 'An error occurred. Please try again later.';
                formStatus.classList.add('error');
            } finally {
                submitButton.disabled = false; // Re-enable button
            }
        });
    }

});