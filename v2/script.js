/* ====================
   PREMIUM CYBER-POP PORTFOLIO - JS
   WebGL + GSAP + Confetti
   ==================== */

document.addEventListener('DOMContentLoaded', () => {
    initWebGLBackground();
    initHandDrawnDoodles();
    initGSAPPhysics();
    initParallaxProjects();
    initConfettiButton();
});

/* ====================
   WEBGL FLOATING DIGITAL MESH
   ==================== */
function initWebGLBackground() {
    const canvas = document.getElementById('webgl-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // Create wireframe mesh
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00F0FF,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 1000;
    const posArray = new Float32Array(particlesCnt * 3);

    for (let i = 0; i < particlesCnt * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.01,
        color: 0xFF00FF,
        transparent: true,
        opacity: 0.8
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation
    function animate() {
        requestAnimationFrame(animate);

        mesh.rotation.x += 0.001;
        mesh.rotation.y += 0.002;

        // React to mouse
        mesh.rotation.x += mouseY * 0.001;
        mesh.rotation.y += mouseX * 0.001;

        particlesMesh.rotation.y += 0.0005;

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

/* ====================
   HAND-DRAWN NEON DOODLES
   ==================== */
function initHandDrawnDoodles() {
    const svg = document.getElementById('doodle-svg');

    setTimeout(() => {
        const highlights = document.querySelectorAll('.title-word.highlight');

        highlights.forEach((word, index) => {
            const rect = word.getBoundingClientRect();

            setTimeout(() => {
                // Underline squiggle
                const underline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                const y = rect.bottom + 5;
                underline.setAttribute('d', `M ${rect.left} ${y} Q ${rect.left + rect.width / 2} ${y + 8}, ${rect.right} ${y}`);
                underline.setAttribute('stroke', index % 2 === 0 ? '#FFD700' : '#00F0FF');
                underline.setAttribute('stroke-width', '3');
                underline.setAttribute('fill', 'none');
                underline.setAttribute('filter', 'url(#neon-glow)');
                underline.style.strokeDasharray = rect.width;
                underline.style.strokeDashoffset = rect.width;
                underline.style.animation = 'drawDoodle 0.5s ease forwards';
                svg.appendChild(underline);

                // Sparkle
                if (index === 1) {
                    setTimeout(() => {
                        const sparkle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                        sparkle.textContent = '✨';
                        sparkle.setAttribute('x', rect.right + 10);
                        sparkle.setAttribute('y', rect.top + rect.height / 2);
                        sparkle.setAttribute('font-size', '20');
                        sparkle.setAttribute('filter', 'url(#neon-glow)');
                        sparkle.style.opacity = '0';
                        sparkle.style.animation = 'sparkleIn 0.3s ease forwards';
                        svg.appendChild(sparkle);
                    }, 200);
                }
            }, 1000 + (index * 200));
        });

    }, 2000);

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes drawDoodle {
            to { stroke-dashoffset: 0; }
        }
        @keyframes sparkleIn {
            to { opacity: 1; transform: scale(1.2); }
        }
    `;
    document.head.appendChild(style);
}

/* ====================
   GSAP PHYSICS-BASED ANIMATIONS
   ==================== */
function initGSAPPhysics() {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // About section - text and stats
    gsap.from('.about-text p', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 70%',
            once: true
        },
        opacity: 0,
        y: 40,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out'
    });

    gsap.from('.stat-card-about', {
        scrollTrigger: {
            trigger: '.about-stats',
            start: 'top 80%',
            once: true
        },
        opacity: 0,
        scale: 0.8,
        y: 40,
        stagger: 0.15,
        duration: 0.7,
        ease: 'back.out(1.7)'
    });

    // Skills cards - elastic bounce
    gsap.from('.skill-card', {
        scrollTrigger: {
            trigger: '.skills',
            start: 'top 70%',
            once: true
        },
        opacity: 0,
        scale: 0.5,
        y: 100,
        rotation: 15,
        stagger: {
            amount: 0.8,
            from: 'random'
        },
        duration: 0.8,
        ease: 'back.out(1.7)'
    });

    // Project cards - slide and pop
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                once: true
            },
            opacity: 0,
            x: index % 2 === 0 ? -100 : 100,
            scale: 0.9,
            rotation: index % 2 === 0 ? -5 : 5,
            duration: 1,
            ease: 'elastic.out(1, 0.75)'
        });
    });
}

/* ====================
   PARALLAX PROJECTS
   ==================== */
function initParallaxProjects() {
    const projectImages = document.querySelectorAll('.image-placeholder');

    projectImages.forEach(img => {
        const card = img.closest('.project-card');

        if (!card) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    window.addEventListener('scroll', () => {
                        const rect = card.getBoundingClientRect();
                        const scrolled = window.pageYOffset;
                        const rate = scrolled * 0.3;

                        if (rect.top < window.innerHeight && rect.bottom > 0) {
                            const offset = (rect.top - window.innerHeight / 2) * 0.1;
                            img.style.transform = `translateY(${offset}px)`;
                        }
                    });
                }
            });
        });

        observer.observe(card);
    });
}

/* ====================
   CONFETTI CV BUTTON
   ==================== */
function initConfettiButton() {
    const button = document.getElementById('cv-download');
    if (!button || typeof confetti === 'undefined') return;

    button.addEventListener('click', (e) => {
        // Glitch animation
        button.style.animation = 'glitch 0.3s ease';
        setTimeout(() => {
            button.style.animation = '';
        }, 300);

        // Confetti explosion
        const rect = button.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x, y },
            colors: ['#00F0FF', '#FF00FF', '#FFD700', '#00FF00']
        });

        // Trigger download (when cv.pdf exists)
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = 'assets/cv.pdf';
            link.download = 'CV.pdf';
            link.click();
        }, 500);
    });

    // Add glitch keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glitch {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-5px, 2px); }
            40% { transform: translate(3px, -2px); }
            60% { transform: translate(-2px, 3px); }
            80% { transform: translate(2px, -1px); }
        }
    `;
    document.head.appendChild(style);
}
