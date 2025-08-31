// --- 3D Setup ---
const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 35;
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// --- LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);
const spotLight = new THREE.SpotLight(0xffffff, 2, 100, Math.PI / 8, 0.5, 1);
spotLight.position.set(15, 15, 25);
scene.add(spotLight);

// --- 3D TEXT ---
const FONT_DATA = {
  'C': [ ' XXX ', 'X   X', 'X    ', 'X   X', ' XXX ' ], 'O': [ ' XXX ', 'X   X', 'X   X', 'X   X', ' XXX ' ], 'N': [ 'X   X', 'XX  X', 'X X X', 'X  XX', 'X   X' ], 'T': [ 'XXXXX', '  X  ', '  X  ', '  X  ', '  X  ' ], 'A': [ ' XXX ', 'X   X', 'XXXXX', 'X   X', 'X   X' ], 'V': [ 'X   X', 'X   X', 'X   X', ' X X ', '  X  ' ], 'M': [ 'X   X', 'XX XX', 'X X X', 'X   X', 'X   X' ], 'S': [ ' XXX ', 'X    ', ' XXX ', '    X', ' XXX ' ], 'D': [ 'XXXX ', 'X   X', 'X   X', 'X   X', 'XXXX ' ], 'I': [ 'XXXXX', '  X  ', '  X  ', '  X  ', 'XXXXX' ], '.': [ '     ', '     ', '     ', '     ', ' XX  ' ], ' ': [ '     ', '     ', '     ', '     ', '     ' ]
};
const textToBuild = "CONTACT VMSD.IN";
const textGroup = new THREE.Group();
const cubeSize = 0.5;
const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0xa0a0a0, shininess: 100 });
let currentX = 0, letterSpacing = 1, characterWidth = 5 * cubeSize;

textToBuild.split('').forEach(char => {
  const letterData = FONT_DATA[char.toUpperCase()];
  if (letterData) {
    for (let y = 0; y < letterData.length; y++) {
      const row = letterData[y];
      for (let x = 0; x < row.length; x++) {
        if (row[x] === 'X') {
          const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
          cube.position.set(currentX + x * cubeSize, (letterData.length - y) * cubeSize, 0);
          textGroup.add(cube);
        }
      }
    }
    currentX += characterWidth + letterSpacing;
  }
});

const box = new THREE.Box3().setFromObject(textGroup);
const center = box.getCenter(new THREE.Vector3());
textGroup.position.sub(center);
scene.add(textGroup);

const clock = new THREE.Clock();

function animate3D() {
  const elapsedTime = clock.getElapsedTime();
  spotLight.position.x = Math.cos(elapsedTime * 0.3) * 25;
  spotLight.position.y = Math.sin(elapsedTime * 0.5) * 25;
  requestAnimationFrame(animate3D);
  textGroup.rotation.y += 0.005;
  textGroup.rotation.x += 0.001;
  renderer.render(scene, camera);
}
animate3D();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- HTML Text Setup & Animation ---
const texts = ["Press Enter & Scroll", "+91 8787 545 171 (whatsapp)", "bharath@vmsd.in (mail)", "Our team will get back to you", "Drop your query"];
let currentIndex = 0;
let isAnimating = false;
const textContainer = document.getElementById('text-container');

function setText(text) {
    textContainer.innerHTML = '';
    const words = text.split(' ');
    words.forEach((word, wordIndex) => {
        const wordWrapper = document.createElement('span');
        wordWrapper.className = 'word';
        word.split('').forEach(char => {
            const letter = document.createElement('span');
            letter.className = 'letter';
            letter.innerText = char;
            wordWrapper.appendChild(letter);
        });
        textContainer.appendChild(wordWrapper);
        if (wordIndex < words.length - 1) {
            const space = document.createElement('span');
            space.innerHTML = '&nbsp;';
            textContainer.appendChild(space);
        }
    });
}

function animateText(direction) {
    if (isAnimating) return;
    isAnimating = true;
    const letters = document.querySelectorAll('.letter');
    const container = document.getElementById('container');
    const masterTl = gsap.timeline({
        onComplete: () => {
            if (direction === 'next') {
                currentIndex++;
                if (currentIndex >= texts.length) { currentIndex = 0; }
            } else {
                currentIndex--;
                if (currentIndex < 0) { currentIndex = texts.length - 1; }
            }
            setText(texts[currentIndex]);
            gsap.fromTo('.letter', {opacity: 0, scale: 0}, {opacity: 1, scale: 1, duration: 0.5, stagger: 0.05, onComplete: () => { isAnimating = false; }});
        }
    });
    masterTl.to(container, { duration: 0.8, keyframes: [ { x: -15, y: 8 }, { x: 15, y: -8 }, { x: -15, y: 12 }, { x: 15, y: -12 }, { x: -10, y: 10 }, { x: 10, y: -10 }, { x: 0, y: 0 } ], ease: 'none' }, 0);
    masterTl.to(letters, { duration: 1, opacity: 0, x: () => (Math.random() - 0.5) * 800, y: () => (Math.random() - 0.5) * 800, z: () => (Math.random() - 0.5) * 800, rotation: () => (Math.random() - 0.5) * 720, stagger: 0.05, ease: "power1.in" }, 0);
}

setText(texts[currentIndex]);
window.addEventListener("wheel", (event) => {
    const direction = event.deltaY > 0 ? 'next' : 'prev';
    animateText(direction);
});

// --- Fullscreen and Music ---
let isFirstInteraction = true;
const music = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');

// --- Fullscreen Toggle & First Interaction Music ---
function handleFirstInteraction() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    if (isFirstInteraction) {
        music.play();
        musicToggle.textContent = '🎵';
        isFirstInteraction = false;
    }
}

document.body.addEventListener('click', (event) => {
    // Do not toggle fullscreen if the music icon is clicked
    if (event.target.id !== 'music-toggle') {
        handleFirstInteraction();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleFirstInteraction();
    }
});

// --- Music Toggle ---
musicToggle.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        musicToggle.textContent = '🎵';
    } else {
        music.pause();
        musicToggle.textContent = '🔇';
    }
    isFirstInteraction = false; // The user has interacted with the music toggle
});