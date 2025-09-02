const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    for (let i = 0; i < revealElements.length; i++) {
        const elementTop = revealElements[i].getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            revealElements[i].classList.add('visible');
        } else {
            revealElements[i].classList.remove('visible');
        }
    }
};

window.addEventListener('scroll', revealOnScroll);

// Navbar scroll effect
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Carousel
const carouselContainer = document.querySelector('.carousel-container');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
const dotsContainer = document.querySelector('.carousel-dots');
const videos = document.querySelectorAll('.carousel-slide video');

let currentIndex = 0;
let slideWidth = carouselSlides.length > 0 ? carouselSlides[0].clientWidth : 0;
let loopCount = 0;

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
    loopCount = 0; // Reset loop count
    playCurrentVideo();
}

function showNextSlide() {
    currentIndex = (currentIndex + 1) % carouselSlides.length;
    goToSlide(currentIndex);
}

function showPrevSlide() {
    currentIndex = (currentIndex - 1 + carouselSlides.length) % carouselSlides.length;
    goToSlide(currentIndex);
}

function playCurrentVideo() {
    videos.forEach((video, index) => {
        if (index === currentIndex) {
            video.play();
        } else {
            video.pause();
            video.currentTime = 0;
        }
    });
}

videos.forEach(video => {
    video.addEventListener('ended', () => {
        loopCount++;
        if (loopCount >= 3) {
            showNextSlide();
        } else {
            video.play();
        }
    });
});

if (nextBtn) {
    nextBtn.addEventListener('click', showNextSlide);
}

if (prevBtn) {
    prevBtn.addEventListener('click', showPrevSlide);
}

// Handle window resize
window.addEventListener('resize', () => {
    if (carouselSlides.length > 0) {
        slideWidth = carouselSlides[0].clientWidth;
        goToSlide(currentIndex);
    }
});

// Start the first video
playCurrentVideo();

const headerVideo = document.getElementById('header-video');
const headerVideoSource = document.getElementById('header-video-source');
const videoSources = [
    "genAI/img/v1.mp4",
    "genAI/img/v2.mp4",
    "genAI/img/v3.mp4"
];
let currentVideoIndex = 0;

function playNextHeaderVideo() {
    currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
    headerVideoSource.src = videoSources[currentVideoIndex];
    headerVideo.load();
    headerVideo.play();
}

headerVideo.addEventListener('ended', playNextHeaderVideo);

// Start the first video
headerVideo.play();
