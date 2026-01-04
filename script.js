// ===== GLOBAL VARIABLES =====
let particlesCanvas, particlesCtx;
let interactiveCanvas, interactiveCtx;
let particles = [];
let interactivePoints = [];
let mouseX = 0, mouseY = 0;
let scrollProgress = 0;

// Text animation variables
let animatedTexts = [];
let scrollAnimationElements = [];

// ===== PARTICLE BACKGROUND =====
function initParticleBackground() {
    particlesCanvas = document.getElementById('particlesCanvas');
    particlesCtx = particlesCanvas.getContext('2d');
    
    resizeParticleCanvas();
    window.addEventListener('resize', resizeParticleCanvas);
    
    createParticles();
    animateParticles();
}

function resizeParticleCanvas() {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
}

function createParticles() {
    particles = [];
    const particleCount = Math.min(150, Math.floor(window.innerWidth * window.innerHeight / 8000));
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * particlesCanvas.width,
            y: Math.random() * particlesCanvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            color: `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05})`
        });
    }
}

function animateParticles() {
    particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    
    particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x < 0 || particle.x > particlesCanvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > particlesCanvas.height) particle.speedY *= -1;
        
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
            const angle = Math.atan2(dy, dx);
            const force = (150 - distance) / 150;
            particle.x -= Math.cos(angle) * force * 2;
            particle.y -= Math.sin(angle) * force * 2;
        }
        
        particlesCtx.beginPath();
        particlesCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        particlesCtx.fillStyle = particle.color;
        particlesCtx.fill();
        
        particles.forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                particlesCtx.beginPath();
                particlesCtx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
                particlesCtx.lineWidth = 0.5;
                particlesCtx.moveTo(particle.x, particle.y);
                particlesCtx.lineTo(otherParticle.x, otherParticle.y);
                particlesCtx.stroke();
            }
        });
    });
    
    requestAnimationFrame(animateParticles);
}

// ===== INTERACTIVE CANVAS =====
function initInteractiveCanvas() {
    interactiveCanvas = document.getElementById('interactiveCanvas');
    interactiveCtx = interactiveCanvas.getContext('2d');
    
    resizeInteractiveCanvas();
    window.addEventListener('resize', resizeInteractiveCanvas);
    
    createInteractivePoints();
    animateInteractiveCanvas();
}

function resizeInteractiveCanvas() {
    interactiveCanvas.width = window.innerWidth;
    interactiveCanvas.height = window.innerHeight;
}

function createInteractivePoints() {
    interactivePoints = [];
    const pointCount = Math.min(50, Math.floor(window.innerWidth * window.innerHeight / 20000));
    
    for (let i = 0; i < pointCount; i++) {
        interactivePoints.push({
            x: Math.random() * interactiveCanvas.width,
            y: Math.random() * interactiveCanvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            color: `rgba(85, 255, 255, ${Math.random() * 0.3 + 0.1})`,
            trail: []
        });
    }
}

function animateInteractiveCanvas() {
    interactiveCtx.clearRect(0, 0, interactiveCanvas.width, interactiveCanvas.height);
    
    interactivePoints.forEach(point => {
        point.x += point.speedX;
        point.y += point.speedY;
        
        if (point.x < 0 || point.x > interactiveCanvas.width) point.speedX *= -1;
        if (point.y < 0 || point.y > interactiveCanvas.height) point.speedY *= -1;
        
        const dx = mouseX - point.x;
        const dy = mouseY - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
            const angle = Math.atan2(dy, dx);
            const force = (200 - distance) / 200;
            point.x += Math.cos(angle) * force * 5;
            point.y += Math.sin(angle) * force * 5;
        }
        
        point.trail.push({ x: point.x, y: point.y });
        if (point.trail.length > 10) point.trail.shift();
        
        point.trail.forEach((trailPoint, index) => {
            const alpha = index / point.trail.length;
            interactiveCtx.beginPath();
            interactiveCtx.arc(trailPoint.x, trailPoint.y, point.size * alpha, 0, Math.PI * 2);
            interactiveCtx.fillStyle = `rgba(85, 255, 255, ${0.2 * alpha})`;
            interactiveCtx.fill();
        });
        
        interactiveCtx.beginPath();
        interactiveCtx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        interactiveCtx.fillStyle = point.color;
        interactiveCtx.fill();
        
        interactiveCtx.beginPath();
        interactiveCtx.arc(point.x, point.y, point.size * 3, 0, Math.PI * 2);
        interactiveCtx.strokeStyle = `rgba(85, 255, 255, 0.1)`;
        interactiveCtx.lineWidth = 1;
        interactiveCtx.stroke();
    });
    
    requestAnimationFrame(animateInteractiveCanvas);
}

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    document.querySelectorAll('a, button, .interactive-text, .nav-link, .btn-3d, .project-card-3d, .skill-3d, .contact-link-3d, .social-link-3d').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

// ===== SCROLL PROGRESS =====
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
        scrollProgress = scrolled;
    });
}

// ===== HEADER SCROLL EFFECT =====
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle || !navMenu) return;
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// ===== TEXT ANIMATIONS =====
function initTextAnimations() {
    // Animate hero title parts
    const nameParts = document.querySelectorAll('.name-part');
    nameParts.forEach((part, index) => {
        part.style.opacity = '0';
        setTimeout(() => {
            part.style.opacity = '1';
        }, 400 + index * 200);
    });
    
    // Animate subtitle words
    const subtitleWords = document.querySelectorAll('.subtitle-word');
    subtitleWords.forEach((word, index) => {
        word.style.opacity = '0';
        word.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            word.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            word.style.opacity = '1';
            word.style.transform = 'translateY(0)';
        }, 800 + index * 100);
        
        word.addEventListener('mouseenter', () => {
            const originalText = word.getAttribute('data-word');
            word.textContent = originalText.split('').reverse().join('');
            setTimeout(() => {
                word.textContent = originalText;
            }, 300);
        });
    });
    
    // Collect all interactive texts
    animatedTexts = document.querySelectorAll('.interactive-text, .title-3d, .section-title, .project-title, .skill-name, .contact-link-3d');
    
    // Add hover effects to interactive texts
    animatedTexts.forEach(text => {
        text.addEventListener('mouseenter', () => {
            text.style.transform = 'translateY(-2px)';
            text.style.textShadow = '0 5px 15px rgba(85, 255, 255, 0.3)';
        });
        
        text.addEventListener('mouseleave', () => {
            text.style.transform = 'translateY(0)';
            text.style.textShadow = 'none';
        });
    });
    
    // 3D title effect
    const titles3D = document.querySelectorAll('.title-3d');
    titles3D.forEach(title => {
        title.addEventListener('mousemove', (e) => {
            const rect = title.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 20;
            const rotateX = (centerY - y) / 20;
            
            title.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        title.addEventListener('mouseleave', () => {
            title.style.transform = 'perspective(500px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Collect all elements to animate on scroll
    scrollAnimationElements = document.querySelectorAll('.section-header, .bio-card, .skill-3d, .experience-3d, .project-card-3d, .contact-card-3d, .contact-form-wrapper');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                if (entry.target.classList.contains('skill-3d')) {
                    const skillFill = entry.target.querySelector('.skill-fill');
                    const skillValue = entry.target.querySelector('.skill-value');
                    const level = entry.target.getAttribute('data-skill');
                    
                    setTimeout(() => {
                        skillFill.style.width = level + '%';
                        skillValue.textContent = level + '%';
                    }, 300);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    scrollAnimationElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// ===== STATS COUNTER =====
function initStatsCounter() {
    const statElements = document.querySelectorAll('.stat-3d');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = parseInt(stat.getAttribute('data-count'));
                const numberElement = stat.querySelector('.stat-number');
                
                let current = 0;
                const increment = target / 50;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        numberElement.textContent = Math.floor(current);
                        setTimeout(updateCounter, 30);
                    } else {
                        numberElement.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });
    
    statElements.forEach(stat => observer.observe(stat));
}

// ===== FORM SUBMISSION =====
function initForm() {
    const contactForm = document.getElementById('messageForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.btn-submit');
        const originalContent = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            
            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerHTML = originalContent;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 2000);
        }, 1500);
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== NAME PARALLAX EFFECT WITH RAINBOW =====
function initNameParallax() {
    const nameParts = document.querySelectorAll('.name-part');
    
    if (!nameParts.length) return;
    
    // Setup rainbow animation
    nameParts.forEach((part, index) => {
        part.style.backgroundSize = '300% 100%';
        part.style.webkitBackgroundClip = 'text';
        part.style.webkitTextFillColor = 'transparent';
        part.style.backgroundClip = 'text';
        
        // Set different gradient directions
        if (index === 0) { // SULTON
            part.style.backgroundImage = 'linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff)';
        } else { // HASANUDIN
            part.style.backgroundImage = 'linear-gradient(90deg, #8b00ff, #4b0082, #0000ff, #00ff00, #ffff00, #ff7f00, #ff0000)';
        }
        
        // Start rainbow animation
        let position = 0;
        const animateRainbow = () => {
            position = (position + 0.2) % 100;
            part.style.backgroundPosition = `${position}% 50%`;
            requestAnimationFrame(animateRainbow);
        };
        animateRainbow();
    });
    
    // Scroll parallax effect
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const updateParallax = () => {
        const scrollY = window.scrollY;
        const scrollDelta = scrollY - lastScrollY;
        
        if (nameParts[0]) { // SULTON - geser ke kiri
            const currentLeft = parseFloat(nameParts[0].style.transform?.replace('translateX(', '')?.replace('px)', '') || 0);
            const newLeft = Math.max(-100, Math.min(0, currentLeft - scrollDelta * 0.1));
            nameParts[0].style.transform = `translateX(${newLeft}px)`;
        }
        
        if (nameParts[1]) { // HASANUDIN - geser ke kanan
            const currentRight = parseFloat(nameParts[1].style.transform?.replace('translateX(', '')?.replace('px)', '') || 0);
            const newRight = Math.min(100, Math.max(0, currentRight + scrollDelta * 0.1));
            nameParts[1].style.transform = `translateX(${newRight}px)`;
        }
        
        lastScrollY = scrollY;
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    
    // Mouse move effect untuk lebih interaktif
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        nameParts.forEach((part, index) => {
            const moveX = (mouseX - 0.5) * 20;
            const moveY = (mouseY - 0.5) * 10;
            
            if (index === 0) {
                part.style.transform = `translateX(${moveX - 50}px) translateY(${moveY}px)`;
            } else {
                part.style.transform = `translateX(${moveX + 50}px) translateY(${moveY}px)`;
            }
        });
    });
    
    // Reset saat mouse keluar window
    document.addEventListener('mouseleave', () => {
        nameParts.forEach((part, index) => {
            if (index === 0) {
                part.style.transform = 'translateX(0px)';
            } else {
                part.style.transform = 'translateX(0px)';
            }
        });
    });
}

// ===== FIX SECTION VISIBILITY =====
function fixSectionVisibility() {
    // Force show all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '1';
        section.style.visibility = 'visible';
        section.style.display = 'block';
    });
    
    // Force show all content
    const contentElements = document.querySelectorAll('.about-content, .projects-grid, .contact-content, .hero-actions, .hero-stats, .profile-3d');
    contentElements.forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.display = 'flex';
    });
    
    // Fix skill bars
    const skillBars = document.querySelectorAll('.skill-fill');
    skillBars.forEach(bar => {
        const level = bar.closest('.skill-3d')?.getAttribute('data-skill') || 0;
        bar.style.width = level + '%';
        bar.style.opacity = '1';
    });
    
    // Fix project cards
    const projectCards = document.querySelectorAll('.project-card-3d');
    projectCards.forEach(card => {
        card.style.opacity = '1';
        card.style.visibility = 'visible';
    });
}

// ===== ENHANCE INTERACTIVE EFFECTS =====
function enhanceInteractiveEffects() {
    // Add click effect to interactive texts
    const interactiveTexts = document.querySelectorAll('.interactive-text');
    interactiveTexts.forEach(text => {
        text.addEventListener('click', () => {
            text.style.transform = 'scale(1.05)';
            text.style.color = '#55ffff';
            
            setTimeout(() => {
                text.style.transform = 'scale(1)';
                text.style.color = '';
            }, 300);
        });
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-3d');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', function() {
    // ===== DEBUG IMAGE LOADING =====
    console.log("🔍 DEBUG: Checking image loading...");
    
    const profileImg = document.querySelector('.profile-image');
    if (profileImg) {
        console.log("✅ Found profile image element");
        console.log("📁 Current src:", profileImg.src);
        
        // Test multiple paths
        const testPaths = [
            'profile2.jpeg',                    // Root folder
            './profile2.jpeg',                  // Current folder
            'assets/profile2.jpeg',             // Assets folder with "profile"
            'assets/profil2.jpeg',              // Assets folder with "profil"
            './assets/profile2.jpeg',           // Relative path
            './assets/profil2.jpeg'             // Relative path alternative
        ];
        
        // Function to test image load
        function testImageLoad(path, index) {
            const testImg = new Image();
            testImg.onload = function() {
                console.log(`✅ Path works: ${path}`);
                if (index === 0) { // If first path works, update main image
                    profileImg.src = path;
                    console.log(`🔄 Updated main image to: ${path}`);
                }
            };
            testImg.onerror = function() {
                console.log(`❌ Path failed: ${path}`);
                if (index < testPaths.length - 1) {
                    // Try next path
                    setTimeout(() => testImageLoad(testPaths[index + 1], index + 1), 100);
                } else {
                    console.log("❌ All paths failed, using fallback");
                    profileImg.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400&q=80';
                }
            };
            testImg.src = path;
        }
        
        // Start testing
        testImageLoad(testPaths[0], 0);
        
        // Add error handler to main image
        profileImg.onerror = function() {
            console.error("❌ Main image failed to load:", this.src);
            // Try immediate fallback
            this.src = './profile2.jpeg';
        };
        
        profileImg.onload = function() {
            console.log("🎉 Main image loaded successfully:", this.src);
        };
        
        // Force display of profile container
        const profileContainer = document.querySelector('.profile-3d');
        if (profileContainer) {
            profileContainer.style.cssText = `
                opacity: 1 !important;
                visibility: visible !important;
                display: block !important;
                border: 2px solid #55ffff !important;
            `;
        }
        
        const photoFrame = document.querySelector('.photo-frame');
        if (photoFrame) {
            photoFrame.style.cssText = `
                background: #1a1a24 !important;
                min-height: 400px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            `;
            
            // Add fallback text
            const fallbackDiv = document.createElement('div');
            fallbackDiv.innerHTML = `
                <div style="
                    color: #55ffff;
                    text-align: center;
                    padding: 20px;
                    border: 2px dashed #55ffff;
                    border-radius: 10px;
                ">
                    <i class="fas fa-image" style="font-size: 48px; margin-bottom: 10px;"></i>
                    <br>
                    Loading profile image...
                    <br>
                    <small>If not loading, check console</small>
                </div>
            `;
            
            // Check if image loaded after 2 seconds
            setTimeout(() => {
                if (profileImg.naturalWidth === 0) {
                    photoFrame.appendChild(fallbackDiv);
                    console.log("⚠️ Image not loaded, showing fallback");
                }
            }, 2000);
        }
    } else {
        console.error("❌ Profile image element NOT FOUND!");
        // Try to find by other selectors
        const possibleSelectors = [
            '.hero-visual img',
            '.profile-container img',
            '.card-front img',
            'img[alt*="Sulton"]',
            'img[alt*="Hasanudin"]'
        ];
        
        possibleSelectors.forEach(selector => {
            const img = document.querySelector(selector);
            if (img) {
                console.log(`Found image with selector: ${selector}`);
                console.log(`Src: ${img.src}`);
                img.style.border = '3px solid red !important';
            }
        });
    }
    
    // Initialize background effects
    initParticleBackground();
    initInteractiveCanvas();
    
    // Initialize UI effects
    initCustomCursor();
    initScrollProgress();
    initHeaderScroll();
    initMobileMenu();
    
    // Initialize animations
    initTextAnimations();
    initScrollAnimations();
    initStatsCounter();
    initNameParallax();
    
    // Initialize interactions
    initForm();
    initSmoothScroll();
    
    // Fix visibility issues
    fixSectionVisibility();
    enhanceInteractiveEffects();
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Force show everything after load
    setTimeout(() => {
        document.body.classList.add('fully-loaded');
        
        // Trigger animations for all elements
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
        });
        
        // Final check for profile image
        const finalImg = document.querySelector('.profile-image');
        if (finalImg && finalImg.naturalWidth === 0) {
            console.warn("⚠️ Final check: Image still not loaded");
            console.log("Trying last resort fallback...");
            finalImg.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400&q=80';
        }
    }, 100);
});