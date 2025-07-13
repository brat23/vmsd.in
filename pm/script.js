// Module data
const modules = [
    {
        number: "01",
        title: "Introduction to Project Management",
        subtopics: [
            "What is a Project?",
            "Lifecycle of a Project",
            "Waterfall vs Agile"
        ]
    },
    {
        number: "02",
        title: "Project Planning",
        subtopics: [
            "Scope Definition",
            "WBS (Work Breakdown Structure)",
            "Gantt Charts and Timelines"
        ]
    },
    {
        number: "03",
        title: "Time and Resource Management",
        subtopics: [
            "Resource Allocation",
            "Critical Path Method",
            "Capacity Planning"
        ]
    },
    {
        number: "04",
        title: "Risk Management",
        subtopics: [
            "Identifying Risk",
            "Risk Matrix",
            "Mitigation Planning"
        ]
    },
    {
        number: "05",
        title: "Budgeting and Cost Control",
        subtopics: [
            "Estimating Costs",
            "Budget Planning",
            "Cost Variance & Forecasting"
        ]
    },
    {
        number: "06",
        title: "Communication and Leadership",
        subtopics: [
            "Stakeholder Management",
            "Team Dynamics",
            "Conflict Resolution"
        ]
    },
    {
        number: "07",
        title: "Agile and Scrum",
        subtopics: [
            "Agile Manifesto",
            "Scrum Framework",
            "Kanban Boards",
            "Sprint Planning & Review"
        ]
    },
    {
        number: "08",
        title: "Tools and Software",
        subtopics: [
            "MS Project",
            "Jira / Trello / Asana / Notion",
            "Slack + Docs + Integrations"
        ]
    },
    {
        number: "09",
        title: "Monitoring & Evaluation",
        subtopics: [
            "KPIs & Project Metrics",
            "Earned Value Management (EVM)",
            "Post-Mortem & Lessons Learned"
        ]
    },
    {
        number: "10",
        title: "Legal, Ethics & Contracts",
        subtopics: [
            "NDAs and SLAs",
            "Procurement & Vendor Contracts",
            "Compliance"
        ]
    },
    {
        number: "11",
        title: "Specialized Domains",
        subtopics: [
            "IT Project Management",
            "Creative Projects (Design & Marketing)",
            "Event and Exhibition Project Management"
        ]
    },
    {
        number: "12",
        title: "Certification and Career Path",
        subtopics: [
            "PMP, PRINCE2, Scrum Master",
            "Building a PM Portfolio",
            "Case Studies of Great PMs"
        ]
    }
];

// Generate floating particles
function createParticles() {
    const particlesContainer = document.querySelector('.floating-particles');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Generate navigation dots
function createNavigation() {
    const nav = document.getElementById('floatingNav');
    modules.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'nav-dot';
        dot.setAttribute('data-module', index);
        dot.addEventListener('click', () => scrollToModule(index));
        nav.appendChild(dot);
    });
}

// Generate module cards
function createModules() {
    const grid = document.getElementById('modulesGrid');
    modules.forEach((module, index) => {
        const card = document.createElement('div');
        card.className = 'module-card';
        card.setAttribute('data-module', index);
        
        const subtopicsHTML = module.subtopics.map(subtopic => {
            const fileName = subtopic.toLowerCase().replace(/ & /g, '-and-').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            return `<li><a href="articles/module${module.number}-${fileName}.html" class="subtopic-link">${subtopic}</a></li>`;
        }).join('');

        card.innerHTML = `
            <div class="card-content">
                <div class="module-number">Module ${module.number}</div>
                <a href="articles/module${module.number}-${module.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}.html" class="module-title">${module.title}</a>
                <ul class="subtopics">${subtopicsHTML}</ul>
            </div>
        `;

        grid.appendChild(card);
        
    });
}

// Scroll to module
function scrollToModule(index) {
    const module = document.querySelector(`[data-module="${index}"]`);
    module.scrollIntoView({ behavior: 'smooth' });
}

// Update progress bar
function updateProgressBar() {
    const scrolled = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = (scrolled / maxScroll) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

// Update navigation dots
function updateNavigation() {
    const scrollPos = window.scrollY;
    const cards = document.querySelectorAll('.module-card');
    const dots = document.querySelectorAll('.nav-dot');
    
    cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            dots[index].classList.add('active');
        } else {
            dots[index].classList.remove('active');
        }
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.module-card');
        
        cards.forEach(card => {
            const title = card.querySelector('.module-title').textContent.toLowerCase();
            const subtopics = Array.from(card.querySelectorAll('.subtopic-link'))
                .map(link => link.textContent.toLowerCase())
                .join(' ');
            
            if (title.includes(query) || subtopics.includes(query)) {
                card.style.display = 'block';
                card.style.opacity = '1';
            } else {
                card.style.opacity = '0.3';
            }
        });
    });
}

// Demo toggle
function toggleDemo() {
    const cards = document.querySelectorAll('.module-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.toggle('glow-effect');
        }, index * 100);
    });
    
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('glow-effect');
        });
    }, 3000);
}

// Add interactive hover effects
function addInteractiveEffects() {
    const cards = document.querySelectorAll('.module-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize everything
    document.addEventListener('DOMContentLoaded', () => {
            createParticles();
            createNavigation();
            createModules();
            setupSearch();
            addInteractiveEffects();
    
    // Add scroll listeners
    window.addEventListener('scroll', () => {
        updateProgressBar();
        updateNavigation();
    });
    
    // Add click handlers for all links
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            // Add your navigation logic here
        }
    });
});

// Add some extra visual effects
setInterval(() => {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        particle.style.background = Math.random() > 0.5 ? 
            'var(--primary-color)' : 'var(--secondary-color)';
    });
}, 2000);