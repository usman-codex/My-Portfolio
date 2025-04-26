document.addEventListener('DOMContentLoaded', () => {

    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const darkModeToggles = document.querySelectorAll('.dark-mode-toggle'); // Select ALL toggle buttons
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // --- Navbar Sticky & Mobile Menu ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            // Make sure variables are defined before changing styles
            if (navbar) {
                navbar.style.backgroundColor = 'var(--background-color)';
                navbar.style.boxShadow = '0 2px 5px var(--shadow-color)';
            }
        } else {
            // Reset styles only if navbar exists and needs reset (e.g., if initially transparent)
            // if (navbar) {
            //     navbar.style.backgroundColor = 'transparent'; // Example
            //     navbar.style.boxShadow = 'none'; // Example
            // }
        }
    });

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }


    // Close mobile menu when a link is clicked
    if (navLinks.length > 0 && hamburger && navMenu) {
        navLinks.forEach(link => link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }


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
    // Set initial mode based on saved preference or default to dark
    const initialModeIsDark = savedMode !== null ? (savedMode === 'true') : true;
    applyDarkMode(initialModeIsDark);


    // Add event listener to EACH toggle button
    if (darkModeToggles.length > 0) {
        darkModeToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const isDarkMode = document.body.classList.toggle('dark-mode');
                localStorage.setItem('darkMode', isDarkMode);
                // No need to manually update icons here, CSS handles it based on body class
            });
        });
    }


    // --- Scroll Animations (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
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
    }


    // --- Contact Form Submission ---
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default page reload

            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (formStatus) {
                formStatus.textContent = 'Sending...';
                formStatus.className = 'form-status'; // Reset classes
            }
             if(submitButton) submitButton.disabled = true;

            try {
                // **IMPORTANT:** Replace with your actual Formspree endpoint or backend URL
                // Example using Formspree: Create a form at formspree.io and replace YOUR_CODE
                const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', { // <--- REPLACE THIS with your endpoint
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    if(formStatus) {
                        formStatus.textContent = 'Message sent successfully! Thank you.';
                        formStatus.classList.add('success');
                    }
                    contactForm.reset(); // Clear the form
                } else {
                    // Try to get error details from response if possible
                    const data = await response.json().catch(() => ({})); // Gracefully handle non-JSON response
                    if (formStatus) {
                        if (data && data.errors) {
                            formStatus.textContent = data.errors.map(error => error.message).join(', ');
                        } else {
                            formStatus.textContent = 'Oops! There was a problem sending your message.';
                        }
                        formStatus.classList.add('error');
                    }
                }
            } catch (error) {
                console.error('Form submission error:', error);
                 if(formStatus) {
                    formStatus.textContent = 'An error occurred. Please try again later.';
                    formStatus.classList.add('error');
                 }
            } finally {
                if(submitButton) submitButton.disabled = false; // Re-enable button
            }
        });
    }

});
