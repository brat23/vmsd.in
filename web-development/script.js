// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll animations with Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all section content elements
    document.querySelectorAll('.section-content').forEach(section => {
        observer.observe(section);
    });

    // Progress bar functionality
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = Math.min(scrolled, 100) + '%';
        });
    }

    // Floating particles system
    const particlesContainer = document.querySelector('.particles');
    
    function createParticle() {
        if (!particlesContainer) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);

        // Remove particle after animation completes
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 20000);
    }

    // Create particles periodically
    if (particlesContainer) {
        setInterval(createParticle, 3000);

        // Create initial particles
        for (let i = 0; i < 5; i++) {
            setTimeout(createParticle, i * 1000);
        }
    }

    // Header scroll effect (hide/show on scroll)
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    if (header) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down & past 100px
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            lastScrollTop = Math.max(scrollTop, 0); // Prevent negative values
        });
    }

    // Scroll to Top Button functionality
    const scrollToTopButton = document.getElementById('scroll-to-top');

    if (scrollToTopButton) {
        // Show/hide scroll to top button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                scrollToTopButton.classList.add('show');
            } else {
                scrollToTopButton.classList.remove('show');
            }
        });

        // Scroll to top when button is clicked
        scrollToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Add keyboard accessibility
        scrollToTopButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    } else {
        console.warn('Scroll-to-top button not found. Make sure you have an element with id="scroll-to-top" in your HTML.');
    }

    // Additional scroll effects (optional)
    window.addEventListener('scroll', throttle(() => {
        // Parallax effect for elements with .parallax class
        document.querySelectorAll('.parallax').forEach(element => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            element.style.transform = `translateY(${rate}px)`;
        });

        // Fade in/out effect for elements with .fade-on-scroll class
        document.querySelectorAll('.fade-on-scroll').forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('fade-in');
            } else {
                element.classList.remove('fade-in');
            }
        });
    }, 10));

});

// Utility function to throttle scroll events for better performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Debounce function for resize events
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Handle window resize events
window.addEventListener('resize', debounce(() => {
    // Recalculate any position-dependent elements
    console.log('Window resized');
}, 250));

// Error handling for smooth scroll fallback
if (!('scrollBehavior' in document.documentElement.style)) {
    // Polyfill for browsers that don't support smooth scrolling
    console.warn('Smooth scrolling not supported, consider adding a polyfill');
}