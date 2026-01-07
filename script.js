/* ============================================
   PORTFOLIO ANIMATIONS & INTERACTIONS
   Enhanced with reliable scroll reveals
   ============================================ */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initParticleBackground();
    initScrollReveal();
    initSmoothScroll();
    initMagneticButtons();
    initTiltEffects();
    initYellowDoodleUnderline();
    initBrandColorSkillGlows();
    initConfettiButton();
});

/* ============================================
   ENHANCED PARTICLE BACKGROUND
   Interactive particle constellation
   ============================================ */
function initParticleBackground() {
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 180 };
    let animationId;

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse position
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Enhanced Particle class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = Math.random() * 40 + 5;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;

            // Enhanced color palette
            const colors = [
                { r: 124, g: 58, b: 237 },   // Purple
                { r: 168, g: 85, b: 247 },   // Light purple
                { r: 236, g: 72, b: 153 },   // Pink
                { r: 6, g: 182, b: 212 },    // Cyan
                { r: 249, g: 115, b: 22 }    // Orange accent
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.5 + 0.3;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulsePhase = Math.random() * Math.PI * 2;
        }

        draw() {
            // Pulsing effect
            const pulse = Math.sin(Date.now() * this.pulseSpeed + this.pulsePhase) * 0.3 + 0.7;
            const alpha = this.alpha * pulse;

            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * pulse, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();

            // Glow effect for larger particles
            if (this.size > 1.5) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.5)`;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        update() {
            // Enhanced mouse interaction with attraction/repulsion
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;

                    // Repulsion effect
                    this.x -= forceDirectionX * force * this.density * 0.3;
                    this.y -= forceDirectionY * force * this.density * 0.3;
                }
            }

            // Gentle drift
            this.x += this.vx;
            this.y += this.vy;

            // Smooth return to base
            const returnSpeed = 0.02;
            this.x += (this.baseX - this.x) * returnSpeed;
            this.y += (this.baseY - this.y) * returnSpeed;

            // Boundary wrapping with buffer
            const buffer = 50;
            if (this.x < -buffer) this.x = canvas.width + buffer;
            if (this.x > canvas.width + buffer) this.x = -buffer;
            if (this.y < -buffer) this.y = canvas.height + buffer;
            if (this.y > canvas.height + buffer) this.y = -buffer;

            this.draw();
        }
    }

    // Initialize particles
    function init() {
        particles = [];
        const density = window.innerWidth < 768 ? 8000 : 6000;
        const numberOfParticles = Math.min((canvas.width * canvas.height) / density, 180);

        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    // Draw connections between nearby particles
    function connect() {
        const maxDistance = 120;

        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.15;

                    // Gradient line
                    const gradient = ctx.createLinearGradient(
                        particles[a].x, particles[a].y,
                        particles[b].x, particles[b].y
                    );
                    gradient.addColorStop(0, `rgba(${particles[a].color.r}, ${particles[a].color.g}, ${particles[a].color.b}, ${opacity})`);
                    gradient.addColorStop(1, `rgba(${particles[b].color.r}, ${particles[b].color.g}, ${particles[b].color.b}, ${opacity})`);

                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 0.6;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => particle.update());
        connect();

        animationId = requestAnimationFrame(animate);
    }

    init();
    animate();

    // Reinitialize on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            init();
        }, 250);
    });
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   Using Intersection Observer for reliability
   ============================================ */
function initScrollReveal() {
    // Add reveal classes to elements
    const revealElements = [
        { selector: '.section-header', class: 'reveal-up' },
        { selector: '.about-image', class: 'reveal-up' },
        { selector: '.about-text', class: 'reveal-up' },
        { selector: '.stat', class: 'reveal-scale', stagger: true },
        { selector: '.skill-card', class: 'reveal-scale', stagger: true },
        { selector: '.project-card', class: 'reveal-up', stagger: true },
        { selector: '.footer-content', class: 'reveal-up' }
    ];

    // Apply classes
    revealElements.forEach(({ selector, class: revealClass, stagger }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.classList.add(revealClass);
            if (stagger) {
                el.classList.add(`stagger-${Math.min(index + 1, 10)}`);
            }
        });
    });

    // Create Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: unobserve after revealing
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('.reveal-up, .reveal-scale').forEach(el => {
        observer.observe(el);
    });

    // Also use GSAP if available for enhanced animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        initGSAPAnimations();
    }
}

/* ============================================
   GSAP ENHANCED ANIMATIONS (if available)
   ============================================ */
function initGSAPAnimations() {
    // Parallax for about section image
    gsap.to('.image-glow', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        y: 100,
        scale: 1.2
    });

    // Skills cards enhanced entrance
    gsap.utils.toArray('.skill-card').forEach((card, i) => {
        gsap.fromTo(card,
            {
                opacity: 0,
                y: 60,
                rotateX: -15,
                scale: 0.9
            },
            {
                scrollTrigger: {
                    trigger: '.skills-grid',
                    start: 'top 85%',
                    once: true
                },
                opacity: 1,
                y: 0,
                rotateX: 0,
                scale: 1,
                duration: 0.7,
                delay: i * 0.08,
                ease: 'back.out(1.5)'
            }
        );
    });

    // Project cards parallax depth
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.fromTo(card,
            {
                opacity: 0,
                y: 100,
                scale: 0.95
            },
            {
                scrollTrigger: {
                    trigger: '.projects-grid',
                    start: 'top 85%',
                    once: true
                },
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                delay: i * 0.12,
                ease: 'power3.out'
            }
        );
    });

    // Footer reveal
    gsap.from('.footer-content', {
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 90%',
            once: true
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
}

/* ============================================
   SMOOTH SCROLL FOR NAVIGATION
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 50;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   MAGNETIC BUTTON EFFECT
   ============================================ */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-download');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

/* ============================================
   3D TILT EFFECT FOR CARDS
   ============================================ */
function initTiltEffects() {
    const cards = document.querySelectorAll('.skill-card, .project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });
}

/* ============================================
   TYPING EFFECT (Optional - for hero subtitle)
   ============================================ */
function initTypingEffect(element, texts, speed = 70) {
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => { isDeleting = true; type(); }, 1500);
            return;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }

        const typeSpeed = isDeleting ? speed / 2 : speed;
        setTimeout(type, typeSpeed);
    }

    type();
}

// Uncomment to enable typing effect
const subtitleEl = document.querySelector('.hero-subtitle');
initTypingEffect(subtitleEl, [
    'Developer • Problem Solver • Occasional Debugger of My Own Life',
    'Turning Coffee into Code Since 2023',
    'Full-Stack Developer & UI Enthusiast'
]);

/* ============================================
   YELLOW DOODLE UNDERLINE ON "CODE"
   Appears after 1 second
   ============================================ */
function initYellowDoodleUnderline() {
    setTimeout(() => {
        const codeText = document.querySelector('.hero-title .gradient-text');
        if (!codeText) return;

        const rect = codeText.getBoundingClientRect();
        const svg = document.getElementById('doodle-svg');

        // Create yellow doodle underline
        const underline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const startX = rect.left;
        const startY = rect.bottom + 5; // Properly below the word
        const endX = rect.right;
        const midY = startY + 10; // Subtle curve

        underline.setAttribute('d', `M ${startX} ${startY} Q ${(startX + endX) / 2} ${midY}, ${endX} ${startY}`);
        underline.setAttribute('stroke', '#FFD700');
        underline.setAttribute('stroke-width', '3');
        underline.setAttribute('fill', 'none');
        underline.setAttribute('filter', 'url(#neon-glow)');
        underline.style.strokeDasharray = rect.width;
        underline.style.strokeDashoffset = rect.width;
        underline.style.animation = 'drawDoodle 0.8s ease forwards';

        svg.appendChild(underline);

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes drawDoodle {
                to { stroke-dashoffset: 0; }
            }
        `;
        document.head.appendChild(style);
    }, 1000);
}

/* ============================================
   BRAND-COLOR SKILL GLOWS
   Each skill card glows with its brand color
   ============================================ */
function initBrandColorSkillGlows() {
    const skillCards = document.querySelectorAll('.skill-card');
    const brandColors = {
        'C++': '#659AD2',
        'C': '#A8B9CC',
        'Python': '#3776AB',
        'JavaScript': '#F0DB4F',
        'HTML5': '#E44D26',
        'CSS3': '#1572B6',
        'SQL': '#00758F',
        'Bash': '#4EAA25',
        'Git': '#F34F29',
        'GitHub': '#ffffff'
    };

    skillCards.forEach(card => {
        const skillName = card.querySelector('.skill-name').textContent.trim();
        const brandColor = brandColors[skillName];

        if (brandColor) {
            const glow = card.querySelector('.skill-glow');
            if (glow) {
                glow.style.background = `radial-gradient(circle, ${brandColor}40, transparent 70%)`;
                glow.style.opacity = '0';
                glow.style.transition = 'opacity 0.4s ease';
            }

            card.addEventListener('mouseenter', () => {
                if (glow) glow.style.opacity = '1';
                card.style.boxShadow = `0 20px 60px ${brandColor}50, 0 0 40px ${brandColor}30`;
                card.style.borderColor = `${brandColor}60`;
            });

            card.addEventListener('mouseleave', () => {
                if (glow) glow.style.opacity = '0';
                card.style.boxShadow = '';
                card.style.borderColor = '';
            });
        }
    });
}

/* ============================================
   CONFETTI BUTTON WITH SHAKE
   Download button shakes and pops confetti
   ============================================ */
function initConfettiButton() {
    const downloadBtn = document.querySelector('.btn-download');
    if (!downloadBtn || typeof confetti === 'undefined') return;

    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Shake animation
        downloadBtn.style.animation = 'shake 0.5s ease';

        setTimeout(() => {
            downloadBtn.style.animation = '';

            // Confetti explosion
            const rect = downloadBtn.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            confetti({
                particleCount: 150,
                spread: 90,
                origin: { x, y },
                colors: ['#7c3aed', '#a855f7', '#ec4899', '#f97316', '#FFD700'],
                ticks: 200,
                gravity: 1.2,
                scalar: 1.2
            });

            // Trigger download after confetti
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = 'assets/cv.pdf';
                link.download = 'CV.pdf';
                link.click();
            }, 300);
        }, 500);
    });

    // Add shake keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
}
