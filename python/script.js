  // Smooth scrolling for navigation
        document.querySelector('.cta-button').addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('#beginner').scrollIntoView({
                behavior: 'smooth'
            });
        });

        // Intersection Observer for animation triggers - Super Quick
        const observerOptions = {
            threshold: 0.05, // Trigger much earlier
            rootMargin: '100px 0px -20px 0px' // Start animation 100px before element enters viewport
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    // Remove observer after animation to prevent re-triggering
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all day cards and section titles
        document.querySelectorAll('.day-card, .section-title').forEach(card => {
            observer.observe(card);
        });

        // Add staggered animation delay to cards - Much faster
        document.querySelectorAll('.day-card').forEach((card, index) => {
            card.style.animationDelay = `${(index % 6) * 0.05}s`; // Reduced from 0.1s to 0.05s
        });

        // Enhanced parallax effect with multiple layers
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero');
            const speed = scrolled * 0.5;
            
            if (parallax) {
                parallax.style.transform = `translateY(${speed}px)`;
            }

            // Add parallax to section backgrounds
            document.querySelectorAll('.section::before').forEach((bg, index) => {
                const bgSpeed = scrolled * (0.1 + index * 0.02);
                bg.style.transform = `translateY(${bgSpeed}px)`;
            });
        });

        // Super quick card hover effects
        document.querySelectorAll('.day-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transition = 'all 0.3s ease';
            });

            card.addEventListener('click', function() {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 100); // Faster click feedback
            });
        });

        // Enhanced floating elements with more dynamic movement
        document.querySelectorAll('.floating-element').forEach((element, index) => {
            let animationId;
            
            const animate = () => {
                const time = Date.now() * 0.001;
                const randomX = Math.sin(time + index) * 15;
                const randomY = Math.cos(time * 0.5 + index) * 10;
                element.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.sin(time) * 5}deg)`;
                animationId = requestAnimationFrame(animate);
            };
            
            animate();
        });

        // Add magnetic effect to CTA button
        const ctaButton = document.querySelector('.cta-button');
        ctaButton.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        ctaButton.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });

        // Quick reveal animation for sections
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'sectionSlideIn 0.6s ease-out forwards';
                }
            });
        }, { threshold: 0.1, rootMargin: '50px' });

        document.querySelectorAll('.section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            sectionObserver.observe(section);
        });

        // Add the section slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sectionSlideIn {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);