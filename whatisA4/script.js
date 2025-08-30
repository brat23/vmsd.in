import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';


const sizes = {
    A0: { name: 'A0', width: 841, height: 1188, dimensions: '841 x 1188 mm | 33.1 x 46.8 in', use: 'Technical drawings, posters' },
    A1: { name: 'A1', width: 594, height: 841, dimensions: '594 x 841 mm | 23.4 x 33.1 in', use: 'Technical drawings, posters' },
    A2: { name: 'A2', width: 420, height: 594, dimensions: '420 x 594 mm | 16.5 x 23.4 in', use: 'Notices, posters, architectural drawings' },
    A3: { name: 'A3', width: 297, height: 420, dimensions: '297 x 420 mm | 11.7 x 16.5 in', use: 'Drawings, diagrams, large tables' },
    A4: { name: 'A4', width: 210, height: 297, dimensions: '210 x 297 mm | 8.3 x 11.7 in', use: 'Letters, magazines, notepads, forms' },
    A5: { name: 'A5', width: 148, height: 210, dimensions: '148 x 210 mm | 5.8 x 8.3 in', use: 'Notepads, invitations, diaries' },
    A6: { name: 'A6', width: 105, height: 148, dimensions: '105 x 148 mm | 4.1 x 5.8 in', use: 'Postcards, small booklets' },
    A7: { name: 'A7', width: 74, height: 105, dimensions: '74 x 105 mm | 2.9 x 4.1 in', use: 'Labels, tickets' },
    A8: { name: 'A8', width: 52, height: 74, dimensions: '52 x 74 mm | 2.0 x 2.9 in', use: 'Business cards, bank cards' },
    DL: { name: 'DL', width: 99, height: 210, dimensions: '99 x 210 mm | 3.9 x 8.3 in', use: 'Compliment slips, personal letters, flyers' },
    Letter: { name: 'Letter', width: 216, height: 279, dimensions: '216 x 279 mm | 8.5 x 11.0 in', use: 'US standard for business and academic documents' }
};

const sizeTitle = document.getElementById('sizeTitle');
const sizeDimensions = document.getElementById('sizeDimensions');
const sizeUse = document.getElementById('sizeUse');

// Update sizeTitle text based on device type
function updateSizeTitleText() {
    if (window.innerWidth <= 768) { // Using the same breakpoint as CSS
        sizeTitle.textContent = 'Select a size';
    } else {
        sizeTitle.textContent = 'Hover a size';
    }
}

// Call on initial load
updateSizeTitleText();

// Call on window resize
window.addEventListener('resize', updateSizeTitleText);

let renderer, scene, camera, controls, paperPlane, labelRenderer, humanHeightLabel;

function init() {
    // Renderer
    const canvas = document.querySelector('#c');
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

    // CSS2DRenderer for labels
    const annotationsContainer = document.getElementById('annotations-container');
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(annotationsContainer.clientWidth, annotationsContainer.clientHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none';
    annotationsContainer.appendChild(labelRenderer.domElement);

    


    // Scene
    scene = new THREE.Scene();

    // Camera
    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 1, 5);

    // Controls
    controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 1, 0);
    controls.enableDamping = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xD93636, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Human Model
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube); // Add test cube initially

    const loader = new GLTFLoader();
    loader.load('human.glb',
        (gltf) => {
            const model = gltf.scene;
            scene.add(model); // Add first, then scale/position

            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());

            // If model has no size (e.g., empty GLB), use a default scale
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = (maxDim === 0) ? 0.1 : 1.7 / maxDim; // Default scale if maxDim is 0

            model.scale.set(scale, scale, scale);

            // Center the model
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            model.position.y += size.y * scale / 2; // Move model to stand on the ground
            model.position.x = -0.5; // Move to the left

            // Remove the test cube if model loads successfully
            scene.remove(cube);

            // Create human height label
            const humanHeightDiv = document.createElement('div');
            humanHeightDiv.className = 'annotation';
            humanHeightLabel = new CSS2DObject(humanHeightDiv);
            scene.add(humanHeightLabel);

            // Set initial human height label content and position
            const heightInMeters = size.y * scale;
            const totalInches = heightInMeters * 39.37; // 1 meter = 39.37 inches
            const feet = Math.floor(totalInches / 12);
            const inches = Math.round(totalInches % 12); // Round to nearest whole number
            humanHeightLabel.element.textContent = `${feet}' ${inches}"`;
            humanHeightLabel.position.set(model.position.x, model.position.y + (size.y * scale / 2) + 0.3, model.position.z); // Above the head
        },
        undefined, // onProgress callback
        (error) => {
            console.error('An error happened while loading the model:', error);
            sizeTitle.textContent = 'Error loading model. Check console.';
            // Keep the test cube if model fails to load
        }
    );

    // Paper Plane
    const paperGeometry = new THREE.PlaneGeometry(1, 1);
    const paperMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: false, // Set to false for full opacity
        opacity: 1 // Set to 1 for full opacity
    });
    paperPlane = new THREE.Mesh(paperGeometry, paperMaterial);
    paperPlane.position.set(0.5, 0.85, 0); // Move to the right, and set Z to 0 to be on the same plane as human
    scene.add(paperPlane);

    // New function to select a size
    function selectSize(sizeKey) {
        const data = sizes[sizeKey];

        sizeTitle.textContent = data.name;
        sizeDimensions.textContent = data.dimensions;
        sizeUse.textContent = data.use;

        const paperWidth = data.width / 1000; // convert mm to meters
        const paperHeight = data.height / 1000; // convert mm to meters

        paperPlane.scale.set(paperWidth, paperHeight, 1);
        if (paperPlane.material.map) {
            paperPlane.material.map.dispose(); // Dispose of old texture to free memory
        }
        paperPlane.material.map = createTextureFromText(data.name);
        paperPlane.material.needsUpdate = true; // Important for material changes
    }

    // Call selectSize for A0 as default
    selectSize('A0');

    


    // Event Listeners
    document.querySelectorAll('.size-list li').forEach(item => {
        item.addEventListener('mouseenter', () => {
            const size = item.getAttribute('data-size');
            const data = sizes[size];

            sizeTitle.textContent = data.name;
            sizeDimensions.textContent = data.dimensions;
            sizeUse.textContent = data.use;

            const paperWidth = data.width / 1000; // convert mm to meters
            const paperHeight = data.height / 1000; // convert mm to meters

            paperPlane.scale.set(paperWidth, paperHeight, 1);
            if (paperPlane.material.map) {
                paperPlane.material.map.dispose(); // Dispose of old texture to free memory
            }
            paperPlane.material.map = createTextureFromText(data.name);
            paperPlane.material.needsUpdate = true; // Important for material changes

            
        });
    });

    requestAnimationFrame(animate);
}

function animate() {
    requestAnimationFrame(animate);

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    controls.update();
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
        // Update labelRenderer size as well
        const annotationsContainer = document.getElementById('annotations-container');
        if (annotationsContainer) { // Check if container exists
            labelRenderer.setSize(annotationsContainer.clientWidth, annotationsContainer.clientHeight);
        }
    }
    return needResize;
}

function createTextureFromText(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas dimensions (adjust as needed for text size and aspect ratio)
    canvas.width = 256;
    canvas.height = 256;

    // Fill background (optional, for better visibility)
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Text styling
    context.font = 'bold 80px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Draw text
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true; // Important for dynamic textures
    return texture;
}

// Mobile Navigation Toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const sizeListItems = document.querySelectorAll('#mobile-nav .size-list li');

if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
    });

    // Close mobile nav when a size is selected
    sizeListItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileNav.classList.remove('active');
        });
    });
}

init();