(function() {
    let scene, camera, renderer, cube, controls;

    function init() {
        const heroContainer = document.getElementById('hero-cube-container');
        if (!heroContainer) {
            console.error('Hero cube container not found');
            return;
        }

        // Create the scene
        scene = new THREE.Scene();

        // Create the camera
        camera = new THREE.PerspectiveCamera(75, heroContainer.clientWidth / heroContainer.clientHeight, 0.1, 1000);
        camera.position.z = 3.5;

        // Create the renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        heroContainer.appendChild(renderer.domElement);

        // --- Lighting ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(2, 3, 4);
        scene.add(directionalLight);

        // --- Texture Creation ---
        function createTexture(drawFunction) {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const context = canvas.getContext('2d');
            drawFunction(context, canvas.width, canvas.height);
            return new THREE.CanvasTexture(canvas);
        }

        // Right Side: Visual Merchandising (VM)
        const vmTexture = createTexture((ctx, w, h) => {
            ctx.fillStyle = '#2a2a2a';
            ctx.fillRect(0, 0, w, h);
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 8;

            // Simple mannequin
            ctx.beginPath();
            ctx.arc(w * 0.5, h * 0.3, 40, 0, Math.PI * 2); // Head
            ctx.moveTo(w * 0.5, h * 0.3 + 40);
            ctx.lineTo(w * 0.5, h * 0.65); // Body
            ctx.moveTo(w * 0.35, h * 0.45);
            ctx.lineTo(w * 0.65, h * 0.45); // Arms
            ctx.moveTo(w * 0.5, h * 0.65);
            ctx.lineTo(w * 0.4, h * 0.85); // Left Leg
            ctx.moveTo(w * 0.5, h * 0.65);
            ctx.lineTo(w * 0.6, h * 0.85); // Right Leg
            ctx.stroke();

            // Simple shelf
            ctx.strokeRect(w * 0.15, h * 0.5, 100, 200);
            ctx.beginPath();
            ctx.moveTo(w * 0.15, h * 0.65);
            ctx.lineTo(w*0.15 + 100, h * 0.65);
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 60px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('VISUAL', w / 2, h * 0.1);
            ctx.fillText('MERCHANDISING', w / 2, h * 0.18);
        });

        // Left Side: Store Design (SD)
        const sdTexture = createTexture((ctx, w, h) => {
            ctx.fillStyle = '#2a2a2a';
            ctx.fillRect(0, 0, w, h);
            ctx.strokeStyle = '#ff0055';
            ctx.lineWidth = 6;

            // Blueprint grid
            ctx.globalAlpha = 0.3;
            for (let i = 0; i < w; i += 40) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, h);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(w, i);
                ctx.stroke();
            }
            ctx.globalAlpha = 1.0;

            // Layout lines
            ctx.lineWidth = 12;
            ctx.strokeRect(w * 0.15, h * 0.25, w * 0.7, h * 0.6);
            ctx.strokeRect(w * 0.15, h * 0.25, w * 0.3, h * 0.2);
            ctx.strokeRect(w * 0.6, h * 0.5, w * 0.25, h * 0.35);


            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 70px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('STORE', w / 2, h * 0.1);
            ctx.fillText('DESIGN', w / 2, h * 0.2);
        });

        // Top Side: .in Tech
        const inTexture = createTexture((ctx, w, h) => {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, w, h);
            ctx.strokeStyle = '#00aaff';
            ctx.lineWidth = 8;

            // Circuit lines
            ctx.beginPath();
            ctx.moveTo(50, 50);
            ctx.lineTo(50, 200);
            ctx.lineTo(300, 200);
            ctx.lineTo(300, 100);
            ctx.moveTo(w-50, h-50);
            ctx.lineTo(w-50, h-300);
            ctx.lineTo(150, h-300);
            ctx.lineTo(150, h-100);
            ctx.stroke();

            // Nodes
            ctx.fillStyle = '#00aaff';
            ctx.beginPath();
            ctx.arc(50, 50, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(300, 100, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(150, h-100, 15, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 160px Orbitron';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('.in', w / 2, h / 2);
        });
            
        // Generic texture for other sides
        const genericTexture = createTexture((ctx, w, h) => {
            ctx.fillStyle = '#222222';
            ctx.fillRect(0, 0, w, h);
            ctx.strokeStyle = '#444';
            ctx.lineWidth = 20;
            ctx.strokeRect(0,0,w,h);
        });


        // --- Cube Creation ---
        const materials = [
            sdTexture,      // Right side
            sdTexture,      // Left side
            inTexture,      // Top side
            inTexture,      // Bottom side
            vmTexture,      // Front side
            vmTexture,      // Back side
        ];
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        cube = new THREE.Mesh(geometry, materials.map(tex => new THREE.MeshStandardMaterial({ map: tex })));
        scene.add(cube);

        // --- Controls ---
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;

        // Disable zoom and pan
        controls.enableZoom = false;
        controls.enablePan = false;
            
        // Set initial rotation
        cube.rotation.y = -0.4;
        cube.rotation.x = -0.4;

        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);
        onWindowResize(); // Initial call
    }

    // --- Animation Loop ---
    function animate() {
        requestAnimationFrame(animate);
        controls.update(); // only required if controls.enableDamping or controls.autoRotate are set to true
        renderer.render(scene, camera);
    }

    // --- Handle Window Resize ---
    function onWindowResize() {
        const heroContainer = document.getElementById('hero-cube-container');
        if (heroContainer && camera && renderer) {
            const width = heroContainer.clientWidth;
            const height = heroContainer.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
    }

    // --- Start the application ---
    init();
    animate();

})();