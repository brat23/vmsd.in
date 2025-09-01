        const LEVEL_THRESHOLDS = { 1: 0, 2: 400, 3: 900, 4: 1500, 5: 2175, 6: 2750 };
        const LEVEL_NAMES = { 1: 'AI Novice', 2: 'AI Apprentice', 3: 'AI Adept', 4: 'AI Expert', 5: 'AI Master', 6: 'AI Grandmaster' };

        let userStats = {
            level: 1,
            xp: 0,
            completedModules: 0,
            streak: 1, // Start streak at 1
            unlockedSkills: 0
        };

        let expandedModules = new Set();
        let exploredModulesEver = new Set();
        let completedModulesSet = new Set();
        let currentSubtopic = null;

        function getLevelFromXP(xp) {
            let level = 1;
            for (const lvl in LEVEL_THRESHOLDS) {
                if (xp >= LEVEL_THRESHOLDS[lvl]) {
                    level = parseInt(lvl);
                } else {
                    break;
                }
            }
            return level;
        }

        function createParticles() {
            const container = document.getElementById('particleContainer');
            if (!container) return;
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'bg-particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (6 + Math.random() * 4) + 's';
                container.appendChild(particle);
            }
        }

        function toggleModule(moduleNum) {
            const subtopics = document.getElementById(`subtopics-${moduleNum}`);
            const expandText = document.getElementById(`expand-text-${moduleNum}`);
            const moduleCard = document.querySelector(`[data-module="${moduleNum}"]`);
            
            if (expandedModules.has(moduleNum)) {
                subtopics.classList.remove('expanded');
                expandText.textContent = 'Explore Module';
                moduleCard.classList.remove('module-expanded');
                expandedModules.delete(moduleNum);
            } else {
                subtopics.classList.add('expanded');
                expandText.textContent = 'Collapse Module';
                moduleCard.classList.add('module-expanded');
                expandedModules.add(moduleNum);
                
                if (!exploredModulesEver.has(moduleNum)) {
                    showAchievement(`🎯 Module ${moduleNum} Explored!`);
                    exploredModulesEver.add(moduleNum);
                }
            }
            saveProgress();
        }

        function showAchievement(text) {
            const popup = document.getElementById('achievementPopup');
            popup.textContent = text;
            popup.classList.add('show');
            setTimeout(() => popup.classList.remove('show'), 3000);
        }

        function openTopicModal(subtopicElement) {
            currentSubtopic = subtopicElement;
            const title = subtopicElement.querySelector('.subtopic-title').textContent;
            const description = subtopicElement.querySelector('.subtopic-description').textContent;

            const modal = document.getElementById('topicModal');
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalContent').innerHTML = `
                <p style="margin: 1rem 0; color: rgba(255, 255, 255, 0.8);">${description}</p>
                <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 10px; margin: 1rem 0;">
                    <h4 style="color: var(--secondary-color); margin-bottom: 0.5rem;">Learning Objectives:</h4>
                    <ul style="color: rgba(255, 255, 255, 0.8); line-height: 1.6; padding-left: 20px;">
                        <li>Master core concepts and principles</li>
                        <li>Apply practical techniques and tools</li>
                        <li>Complete hands-on exercises</li>
                    </ul>
                </div>
            `;
            modal.style.display = 'flex';
            setTimeout(() => modal.style.opacity = '1', 10);
        }

        function closeModal() {
            const modal = document.getElementById('topicModal');
            modal.style.opacity = '0';
            setTimeout(() => modal.style.display = 'none', 300);
        }

        function startTopic() {
            if (currentSubtopic) {
                completeSubtopic(currentSubtopic);
            }
            closeModal();
        }

        function updateXP(amount) {
            userStats.xp += amount;
            const oldLevel = userStats.level;
            userStats.level = getLevelFromXP(userStats.xp);

            updateUIFromStats();

            if (userStats.level > oldLevel) {
                showAchievement(`🎉 Level Up! Welcome to Level ${userStats.level}`);
            }
        }

        function unlockSkill() {
            userStats.unlockedSkills++;
            const skillNodes = document.querySelectorAll('#skillNodes .skill-node');
            skillNodes.forEach((node, index) => {
                node.classList.toggle('unlocked', index < userStats.unlockedSkills);
            });
        }

        function completeSubtopic(element) {
            if (!element.classList.contains('completed')) {
                element.classList.add('completed');
                showAchievement('✅ Subtopic Completed! +25 XP');
                updateXP(25);
                updateModuleProgress(element.closest('.module-card'));
                saveProgress();
            }
        }

        function updateModuleProgress(moduleCard) {
            if (!moduleCard) return;
            const allSubtopics = moduleCard.querySelectorAll('.subtopic');
            const completedSubtopics = moduleCard.querySelectorAll('.subtopic.completed');
            
            const progress = allSubtopics.length > 0 ? (completedSubtopics.length / allSubtopics.length) * 100 : 0;
            
            const progressCircle = moduleCard.querySelector('.progress-circle');
            const progressText = moduleCard.querySelector('.progress-text');
            progressCircle.style.setProperty('--progress', (progress * 3.6) + 'deg');
            progressText.textContent = Math.round(progress) + '%';
            
            const statusBadge = moduleCard.querySelector('.status-badge');
            if (progress === 100) {
                const moduleNum = parseInt(moduleCard.dataset.module);
                if (!completedModulesSet.has(moduleNum)) {
                    showAchievement('🎊 Module Completed! +200 XP');
                    updateXP(200);
                    completedModulesSet.add(moduleNum);
                    userStats.completedModules = completedModulesSet.size;
                    unlockSkill();
                }
                statusBadge.textContent = 'Completed';
                statusBadge.style.background = 'var(--gradient-secondary)';
            } else if (progress > 0) {
                statusBadge.textContent = 'In Progress';
                statusBadge.style.background = 'var(--gradient-primary)';
            } else {
                statusBadge.textContent = 'Locked';
                statusBadge.style.background = 'grey';
            }
        }

        function updateUIFromStats() {
            document.getElementById('currentLevel').textContent = userStats.level;
            document.querySelector('.level-badge div:last-child').textContent = LEVEL_NAMES[userStats.level];
            document.getElementById('totalXP').textContent = userStats.xp.toLocaleString();
            document.getElementById('completedModules').textContent = userStats.completedModules;
            document.getElementById('streak').textContent = userStats.streak;
            
            const currentLevel = userStats.level;
            const nextLevel = currentLevel + 1;

            if (currentLevel >= 6) { // Max level reached
                document.getElementById('xpFill').style.width = '100%';
                document.getElementById('xpToNextLevelText').textContent = 'Max Level Reached!';
            } else {
                const currentLevelXPThreshold = LEVEL_THRESHOLDS[currentLevel];
                const nextLevelXPThreshold = LEVEL_THRESHOLDS[nextLevel];
                
                const xpIntoCurrentLevel = userStats.xp - currentLevelXPThreshold;
                const xpNeededForNextLevel = nextLevelXPThreshold - currentLevelXPThreshold;
                
                const percentage = xpNeededForNextLevel > 0 ? (xpIntoCurrentLevel / xpNeededForNextLevel) * 100 : 0;
                
                document.getElementById('xpFill').style.width = percentage + '%';
                document.getElementById('xpToNextLevelText').textContent = `Progress to Level ${nextLevel}`;
            }

            const skillNodes = document.querySelectorAll('#skillNodes .skill-node');
            skillNodes.forEach((node, index) => {
                node.classList.toggle('unlocked', index < userStats.unlockedSkills);
            });
        }

        function saveProgress() {
            const completedSubtopics = Array.from(document.querySelectorAll('.subtopic.completed')).map(el => el.dataset.subtopicId);
            const progress = {
                userStats,
                completedSubtopics,
                expandedModules: Array.from(expandedModules),
                exploredModulesEver: Array.from(exploredModulesEver),
                completedModulesSet: Array.from(completedModulesSet)
            };
            localStorage.setItem('genAIJourneyProgress', JSON.stringify(progress));
            saveIndicator();
        }

        function loadProgress() {
            const savedProgress = localStorage.getItem('genAIJourneyProgress');
            if (savedProgress) {
                const progress = JSON.parse(savedProgress);

                progress.completedSubtopics.forEach(id => {
                    const subtopic = document.querySelector(`[data-subtopic-id="${id}"]`);
                    if (subtopic) subtopic.classList.add('completed');
                });

                if (progress.completedModulesSet) {
                    completedModulesSet = new Set(progress.completedModulesSet.map(Number));
                } else {
                    document.querySelectorAll('.module-card').forEach(card => {
                        const allSubtopics = card.querySelectorAll('.subtopic');
                        const completedInModule = Array.from(allSubtopics).every(s => s.classList.contains('completed'));
                        if (allSubtopics.length > 0 && completedInModule) {
                            completedModulesSet.add(parseInt(card.dataset.module));
                        }
                    });
                }

                if (progress.userStats && typeof progress.userStats.level !== 'undefined') {
                    userStats = progress.userStats;
                } else {
                    userStats.xp = progress.completedSubtopics.length * 25;
                    userStats.xp += completedModulesSet.size * 200;
                    userStats.level = getLevelFromXP(userStats.xp);
                }
                userStats.completedModules = completedModulesSet.size;
                userStats.unlockedSkills = completedModulesSet.size;
                
                expandedModules = new Set(progress.expandedModules);
                exploredModulesEver = new Set(progress.exploredModulesEver);
            }
            updateUIFromStats();
            document.querySelectorAll('.module-card').forEach(card => updateModuleProgress(card));
        }

        function showIntroductoryToast() {
            setTimeout(() => {
                if (userStats.xp === 0) {
                    showAchievement("👋 Welcome! Click a subtopic to begin your journey.");
                }
            }, 2000);
        }

        function saveIndicator() {
            let indicator = document.getElementById('saveIndicator');
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'saveIndicator';
                indicator.style.cssText = `
                    position: fixed; bottom: 20px; left: 20px;
                    background: var(--secondary-glow); color: var(--secondary-color);
                    padding: 0.5rem 1rem; border-radius: 10px; font-size: 0.8rem;
                    z-index: 1000; opacity: 0; transition: opacity 0.5s ease;
                `;
                indicator.textContent = '💾 Progress Saved';
                document.body.appendChild(indicator);
            }
            
            indicator.style.opacity = '1';
            setTimeout(() => indicator.style.opacity = '0', 2000);
        }

        function setupModuleScroller() {
            const scrollContainer = document.querySelector('.modules-grid');
            const leftBtn = document.getElementById('scroll-left-btn');
            const rightBtn = document.getElementById('scroll-right-btn');

            if (!scrollContainer || !leftBtn || !rightBtn) return;

            const scrollAmount = 400;

            function updateButtonState() {
                const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
                leftBtn.disabled = scrollContainer.scrollLeft <= 0;
                rightBtn.disabled = scrollContainer.scrollLeft >= maxScroll - 1;
            }

            leftBtn.addEventListener('click', () => {
                scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });

            rightBtn.addEventListener('click', () => {
                scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });

            scrollContainer.addEventListener('scroll', updateButtonState);
            
            new ResizeObserver(updateButtonState).observe(scrollContainer);
            updateButtonState(); 
        }

        document.addEventListener('click', function(e) {
            const subtopicLink = e.target.closest('.subtopic-link');
            if (subtopicLink) {
                const subtopic = subtopicLink.querySelector('.subtopic');
                if (subtopic) {
                    completeSubtopic(subtopic);
                }
                return;
            }

            const subtopic = e.target.closest('.subtopic:not(.subtopic-link .subtopic)');
            if (subtopic) {
                openTopicModal(subtopic);
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            createParticles();
            loadProgress();
            showIntroductoryToast();
            setupModuleScroller();
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

// Carousel
const carouselContainer = document.querySelector('.carousel-container');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
const dotsContainer = document.querySelector('.carousel-dots');

let currentIndex = 0;
let slideWidth = carouselSlides.length > 0 ? carouselSlides[0].clientWidth : 0;

// Create dots
if (dotsContainer) {
    carouselSlides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(i);
        });
        dotsContainer.appendChild(dot);
    });
}

const dots = document.querySelectorAll('.carousel-dot');

function goToSlide(index) {
    if (carouselContainer) {
        carouselContainer.style.transform = `translateX(-${slideWidth * index}px)`;
    }
    if (dots.length > 0) {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    }
    currentIndex = index;
}

function showNextSlide() {
    currentIndex = (currentIndex + 1) % carouselSlides.length;
    goToSlide(currentIndex);
}

function showPrevSlide() {
    currentIndex = (currentIndex - 1 + carouselSlides.length) % carouselSlides.length;
    goToSlide(currentIndex);
}

if (nextBtn) {
    nextBtn.addEventListener('click', showNextSlide);
}

if (prevBtn) {
    prevBtn.addEventListener('click', showPrevSlide);
}

// Auto slide
if (carouselSlides.length > 0) {
    setInterval(showNextSlide, 5000);
}

// Handle window resize
window.addEventListener('resize', () => {
    if (carouselSlides.length > 0) {
        slideWidth = carouselSlides[0].clientWidth;
        goToSlide(currentIndex);
    }
});
    