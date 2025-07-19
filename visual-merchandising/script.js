        // Progress bar functionality
        function updateProgressBar() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById('progressBar').style.width = scrolled + '%';
        }

        window.addEventListener('scroll', updateProgressBar);

        // Floating elements
        function createFloatingElements() {
            const container = document.getElementById('floatingElements');
            for (let i = 0; i < 20; i++) {
                const element = document.createElement('div');
                element.className = 'floating-element';
                element.style.left = Math.random() * 100 + '%';
                element.style.top = Math.random() * 100 + '%';
                element.style.animationDelay = Math.random() * 6 + 's';
                element.style.animationDuration = (Math.random() * 3 + 3) + 's';
                container.appendChild(element);
            }
        }

        createFloatingElements();

        // Card interactions
        const cards = document.querySelectorAll('.card');
        const completedCards = new Set();

        cards.forEach(card => {
            card.addEventListener('click', function() {
                const topic = this.getAttribute('data-topic');
                
                // Toggle completed state
                if (completedCards.has(topic)) {
                    completedCards.delete(topic);
                    this.classList.remove('completed');
                } else {
                    completedCards.add(topic);
                    this.classList.add('completed');
                }
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Simulate navigation (in real app, this would navigate to content)
                console.log(`Opening module: ${topic}`);
            });

            // Add hover sound effect (visual feedback)
            card.addEventListener('mouseenter', function() {
                this.style.boxShadow = '0 30px 60px rgba(255, 0, 85, 0.4)';
            });

            card.addEventListener('mouseleave', function() {
                if (!this.classList.contains('main-topic')) {
                    this.style.boxShadow = '';
                }
            });
        });

        // Smooth scrolling for better UX
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Add parallax effect to hero section
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });

        // Intersection Observer for animation triggers
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });

        // Add dynamic background gradient
        document.addEventListener('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            const width = window.innerWidth;
            const height = window.innerHeight;
            const xPercent = (x / width) * 100;
            const yPercent = (y / height) * 100;
            document.body.style.background = `radial-gradient(circle at ${xPercent}% ${yPercent}%, rgba(255, 0, 85, 0.2), #121212 20%)`;
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const sections = document.querySelectorAll('.section');
                const currentIndex = Array.from(sections).findIndex(section => {
                    const rect = section.getBoundingClientRect();
                    return rect.top >= 0 && rect.top <= window.innerHeight / 2;
                });
                
                let targetIndex = currentIndex;
                if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
                    targetIndex = currentIndex + 1;
                } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                    targetIndex = currentIndex - 1;
                }
                
                if (targetIndex !== currentIndex && sections[targetIndex]) {
                    sections[targetIndex].scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
