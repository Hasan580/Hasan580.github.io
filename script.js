// Portfolio Website JavaScript
// Enhanced with animations, Vanta.js backgrounds, and interactive features

class PortfolioApp {
    constructor() {
        this.currentPage = 'about';
        this.vantaEffects = {};
        this.isLoading = true;
        
        this.init();
    }
      init() {
        try {
            this.setupEventListeners();
            this.initializeLoading();
            this.setupNavigationObserver();
            this.initializeAnimations();
            
            // Initialize after DOM is fully loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.setupVantaBackgrounds();
                    this.finishLoading();
                });
            } else {
                this.setupVantaBackgrounds();
                this.finishLoading();
            }
        } catch (error) {
            console.error('Error initializing app:', error);
            // Ensure loading screen is removed even if there's an error
            this.finishLoading();
        }
    }
      setupEventListeners() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
                
                // Close mobile menu after navigation
                const navMenu = document.querySelector('.nav-menu');
                const navToggle = document.querySelector('.nav-toggle');
                if (navMenu && navToggle && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        });
          // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            // Use both click and touchstart for better mobile support
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileMenu();
            });
            
            navToggle.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileMenu();
            }, { passive: false });
            
            // Keyboard support for hamburger menu
            navToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleMobileMenu();
                }
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
            
            // Close menu with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
        
        // Chat button functionality
        this.setupChatButton();
        
        // Intersection observer for animations
        this.setupIntersectionObserver();
        
        // Smooth scrolling for anchor links
        this.setupSmoothScrolling();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Window resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu && navToggle) {
            const isActive = navMenu.classList.contains('active');
            
            console.log('Mobile menu toggle:', isActive ? 'closing' : 'opening');
            
            if (isActive) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                navMenu.classList.add('active');
                navToggle.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    }
      initializeLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            // Show loading for minimum 1 second, then finish regardless
            setTimeout(() => {
                this.finishLoading();
            }, 1000);
        }
    }
    
    finishLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                this.isLoading = false;
                this.initializePageAnimations();
            }, 1000);
        }
    }      setupVantaBackgrounds() {
        // Check if Vanta is available
        if (typeof VANTA === 'undefined') {
            console.warn('Vanta.js not loaded - applying fallback backgrounds');
            this.applyFallbackBackgrounds();
            return;
        }
        
        try {
            // Birds effect for About page
            const aboutElement = document.getElementById('vanta-about');
            if (aboutElement && VANTA.BIRDS) {
                this.vantaEffects.birds = VANTA.BIRDS({
                    el: aboutElement,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    backgroundColor: 0x0,
                    backgroundAlpha: 0.0,
                    color1: 0xffffff,
                    color2: 0x000000,
                    birdSize: 1.20,
                    quantity: 3.00,
                    speedLimit: 4.00,
                    separation: 100.00,
                    alignment: 20.00,
                    cohesion: 20.00
                });
            } else {
                this.applyFallbackBackground('vanta-about');
            }
            
            // Cells effect for YouTube page
            const youtubeElement = document.getElementById('vanta-youtube');
            if (youtubeElement && VANTA.CELLS) {
                this.vantaEffects.cells = VANTA.CELLS({
                    el: youtubeElement,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    scale: 1.00,
                    color1: 0xffffff,
                    color2: 0x000000,
                    backgroundAlpha: 0.0,
                    size: 1.50,
                    speed: 1.00
                });
            } else {
                this.applyFallbackBackground('vanta-youtube');
            }
        } catch (error) {
            console.warn('Error initializing Vanta backgrounds:', error);
            this.applyFallbackBackgrounds();
        }
    }
    
    applyFallbackBackgrounds() {
        this.applyFallbackBackground('vanta-about');
        this.applyFallbackBackground('vanta-youtube');
    }
    
    applyFallbackBackground(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // Apply CSS-based animated background
        element.style.background = `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.05) 0%, transparent 50%),
            linear-gradient(135deg, #000000 0%, #111111 100%)
        `;
        element.style.backgroundSize = '500px 500px, 300px 300px, 400px 400px, 100% 100%';
        element.style.animation = 'moveBackground 20s ease-in-out infinite';
        
        // Add the animation keyframes if they don't exist
        if (!document.getElementById('fallback-animations')) {
            const style = document.createElement('style');
            style.id = 'fallback-animations';
            style.textContent = `
                @keyframes moveBackground {
                    0%, 100% { 
                        background-position: 0% 0%, 100% 100%, 50% 50%, 0% 0%; 
                    }
                    25% { 
                        background-position: 100% 0%, 0% 100%, 80% 20%, 0% 0%; 
                    }
                    50% { 
                        background-position: 100% 100%, 0% 0%, 20% 80%, 0% 0%; 
                    }
                    75% { 
                        background-position: 0% 100%, 100% 0%, 60% 40%, 0% 0%; 
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        console.log(`Applied fallback background for ${elementId}`);
    }
    
    navigateToPage(pageId) {
        if (this.isLoading || pageId === this.currentPage) return;
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
        
        // Update pages with transition
        const currentPageElement = document.getElementById(this.currentPage);
        const newPageElement = document.getElementById(pageId);
        
        if (currentPageElement && newPageElement) {
            // Fade out current page
            currentPageElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            currentPageElement.style.opacity = '0';
            currentPageElement.style.transform = 'translateX(-50px)';
            
            setTimeout(() => {
                currentPageElement.classList.remove('active');
                newPageElement.classList.add('active');
                
                // Fade in new page
                newPageElement.style.opacity = '0';
                newPageElement.style.transform = 'translateX(50px)';
                
                requestAnimationFrame(() => {
                    newPageElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    newPageElement.style.opacity = '1';
                    newPageElement.style.transform = 'translateX(0)';
                });
                
                this.currentPage = pageId;
                this.onPageChange(pageId);
            }, 300);
        }
    }
    
    onPageChange(pageId) {
        // Reset Vanta effects based on page
        if (pageId === 'about' && this.vantaEffects.birds) {
            this.vantaEffects.birds.resize();
        } else if (pageId === 'youtube' && this.vantaEffects.cells) {
            this.vantaEffects.cells.resize();
        }
        
        // Trigger page-specific animations
        this.triggerPageAnimations(pageId);
        
        // Update URL without page reload
        history.pushState({ page: pageId }, '', `#${pageId}`);
    }
    
    setupChatButton() {
        const chatButton = document.getElementById('chatButton');
        const chatModal = document.getElementById('chatModal');
        const chatClose = document.getElementById('chatClose');
        
        if (chatButton && chatModal && chatClose) {
            chatButton.addEventListener('click', () => {
                chatModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                this.animateChatOpen();
            });
            
            chatClose.addEventListener('click', () => {
                this.closeChatModal();
            });
            
            // Close modal when clicking outside
            chatModal.addEventListener('click', (e) => {
                if (e.target === chatModal) {
                    this.closeChatModal();
                }
            });
            
            // Close with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && chatModal.classList.contains('active')) {
                    this.closeChatModal();
                }
            });
        }
    }
    
    animateChatOpen() {
        const chatOptions = document.querySelectorAll('.chat-option');
        chatOptions.forEach((option, index) => {
            option.style.opacity = '0';
            option.style.transform = 'translateY(20px)';
            setTimeout(() => {
                option.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                option.style.opacity = '1';
                option.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    closeChatModal() {
        const chatModal = document.getElementById('chatModal');
        if (chatModal) {
            chatModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.info-item, .skill-category, .social-link').forEach(el => {
            observer.observe(el);
        });
    }
    
    animateElement(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    initializePageAnimations() {
        // Animate skill tags with stagger effect
        const skillTags = document.querySelectorAll('.skill-tag');
        skillTags.forEach((tag, index) => {
            tag.style.opacity = '0';
            tag.style.transform = 'scale(0.8)';
            setTimeout(() => {
                tag.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                tag.style.opacity = '1';
                tag.style.transform = 'scale(1)';
            }, index * 50);
        });
        
        // Animate social links
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateX(-30px)';
            setTimeout(() => {
                link.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                link.style.opacity = '1';
                link.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }
    
    triggerPageAnimations(pageId) {
        const page = document.getElementById(pageId);
        if (!page) return;
        
        // Reset and animate elements on page change
        const animatableElements = page.querySelectorAll('.info-item, .skill-category, .social-link, .project-placeholder, .youtube-placeholder');
        
        animatableElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    setupNavigationObserver() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigateToPage(e.state.page);
            }
        });
        
        // Set initial state
        const hash = window.location.hash.slice(1);
        if (hash && ['about', 'projects', 'youtube'].includes(hash)) {
            this.currentPage = hash;
            this.navigateToPage(hash);
        }
    }
    
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Arrow key navigation
            if (e.altKey) {
                switch (e.key) {
                    case 'ArrowLeft':
                        this.navigateToPrevious();
                        break;
                    case 'ArrowRight':
                        this.navigateToNext();
                        break;
                }
            }
        });
    }
    
    navigateToPrevious() {
        const pages = ['about', 'projects', 'youtube'];
        const currentIndex = pages.indexOf(this.currentPage);
        const previousIndex = currentIndex > 0 ? currentIndex - 1 : pages.length - 1;
        this.navigateToPage(pages[previousIndex]);
    }
    
    navigateToNext() {
        const pages = ['about', 'projects', 'youtube'];
        const currentIndex = pages.indexOf(this.currentPage);
        const nextIndex = currentIndex < pages.length - 1 ? currentIndex + 1 : 0;
        this.navigateToPage(pages[nextIndex]);
    }
    
    handleResize() {
        // Resize Vanta effects
        Object.values(this.vantaEffects).forEach(effect => {
            if (effect && typeof effect.resize === 'function') {
                effect.resize();
            }
        });
    }
    
    initializeAnimations() {
        // Add entrance animations to key elements
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.addEntranceAnimation(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        // Observe main sections
        document.querySelectorAll('.hero-section, .info-section, .page-header').forEach(section => {
            animationObserver.observe(section);
        });
    }
    
    addEntranceAnimation(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    // Cleanup method
    destroy() {
        // Clean up Vanta effects
        Object.values(this.vantaEffects).forEach(effect => {
            if (effect && typeof effect.destroy === 'function') {
                effect.destroy();
            }
        });
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('popstate', this.setupNavigationObserver);
    }
}

// Enhanced Profile Image Effect with WebGL Shader
class ProfileImageEffect {
    constructor() {
        this.canvas = null;
        this.gl = null;
        this.program = null;
        this.texture = null;
        this.animationId = null;
        this.mouse = { x: 0.5, y: 0.5 };
        this.time = 0;
        
        this.init();
    }
    
    init() {
        const profileImage = document.querySelector('.profile-img');
        if (!profileImage) return;
        
        this.createCanvas(profileImage);
        this.setupWebGL();
        this.loadImage(profileImage.src);
        this.addEventListeners();
    }
    
    createCanvas(img) {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.opacity = '0';
        this.canvas.style.transition = 'opacity 0.3s ease';
        this.canvas.style.borderRadius = '20px';
        
        img.parentElement.appendChild(this.canvas);
    }
    
    setupWebGL() {
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        if (!this.gl) {
            console.warn('WebGL not supported');
            return;
        }
        
        const vertexShaderSource = `
            attribute vec2 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
                v_texCoord = a_texCoord;
            }
        `;
        
        const fragmentShaderSource = `
            precision mediump float;
            uniform sampler2D u_texture;
            uniform vec2 u_mouse;
            uniform float u_time;
            uniform vec2 u_resolution;
            varying vec2 v_texCoord;
            
            void main() {
                vec2 uv = v_texCoord;
                vec2 mouse = u_mouse;
                
                // Fluid distortion effect
                float dist = distance(uv, mouse);
                float influence = smoothstep(0.3, 0.0, dist);
                
                // Wave distortion
                vec2 distortion = vec2(
                    sin(uv.y * 10.0 + u_time * 2.0) * 0.01,
                    cos(uv.x * 8.0 + u_time * 1.5) * 0.01
                ) * influence;
                
                // Chromatic aberration
                float aberration = influence * 0.01;
                vec3 color;
                color.r = texture2D(u_texture, uv + distortion + vec2(aberration, 0.0)).r;
                color.g = texture2D(u_texture, uv + distortion).g;
                color.b = texture2D(u_texture, uv + distortion - vec2(aberration, 0.0)).b;
                
                // Ethereal glow effect
                float glow = exp(-dist * 3.0) * 0.3 * sin(u_time * 3.0) * influence;
                color += vec3(glow);
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;
        
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        
        this.program = this.createProgram(vertexShader, fragmentShader);
        this.gl.useProgram(this.program);
        
        // Setup geometry
        const positions = new Float32Array([
            -1, -1,  0, 0,
             1, -1,  1, 0,
            -1,  1,  0, 1,
             1,  1,  1, 1,
        ]);
        
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
        
        const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        const texCoordLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');
        
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 16, 0);
        
        this.gl.enableVertexAttribArray(texCoordLocation);
        this.gl.vertexAttribPointer(texCoordLocation, 2, this.gl.FLOAT, false, 16, 8);
    }
    
    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    createProgram(vertexShader, fragmentShader) {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Program link error:', this.gl.getProgramInfoLog(program));
            this.gl.deleteProgram(program);
            return null;
        }
        
        return program;
    }
    
    loadImage(src) {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => {
            this.createTexture(image);
            this.startAnimation();
        };
        image.src = src;
    }
    
    createTexture(image) {
        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    }
    
    addEventListeners() {
        const profileContainer = document.querySelector('.profile-image');
        if (!profileContainer) return;
        
        profileContainer.addEventListener('mouseenter', () => {
            this.canvas.style.opacity = '1';
        });
        
        profileContainer.addEventListener('mouseleave', () => {
            this.canvas.style.opacity = '0';
        });
        
        profileContainer.addEventListener('mousemove', (e) => {
            const rect = profileContainer.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) / rect.width;
            this.mouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
        });
    }
    
    startAnimation() {
        const animate = () => {
            this.time += 0.016;
            this.render();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }
    
    render() {
        if (!this.gl || !this.program || !this.texture) return;
        
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        
        this.gl.useProgram(this.program);
        
        const mouseLocation = this.gl.getUniformLocation(this.program, 'u_mouse');
        const timeLocation = this.gl.getUniformLocation(this.program, 'u_time');
        const resolutionLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
        
        this.gl.uniform2f(mouseLocation, this.mouse.x, this.mouse.y);
        this.gl.uniform1f(timeLocation, this.time);
        this.gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);
        
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.gl && this.texture) {
            this.gl.deleteTexture(this.texture);
        }
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
    }
}

// Initialize the application
let portfolioApp;
let profileEffect;

// Simple initialization that works regardless of load state
(function() {
    function initializeApp() {
        try {
            portfolioApp = new PortfolioApp();
            profileEffect = new ProfileImageEffect();
        } catch (error) {
            console.error('Error initializing:', error);
            // Fallback simple initialization
            initializeBasicFunctionality();
        }
    }
    
    function initializeBasicFunctionality() {
        // Hide loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 1000);
        }
        
        // Basic navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const pageId = this.getAttribute('data-page');
                
                // Hide all pages
                document.querySelectorAll('.page').forEach(page => {
                    page.classList.remove('active');
                });
                
                // Show target page
                const targetPage = document.getElementById(pageId);
                if (targetPage) {
                    targetPage.classList.add('active');
                }
                
                // Update nav
                document.querySelectorAll('.nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
        
        // Basic chat button
        const chatButton = document.getElementById('chatButton');
        const chatModal = document.getElementById('chatModal');
        const chatClose = document.getElementById('chatClose');
        
        if (chatButton && chatModal) {
            chatButton.addEventListener('click', function() {
                chatModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }
        
        if (chatClose && chatModal) {
            chatClose.addEventListener('click', function() {
                chatModal.classList.remove('active');
                document.body.style.overflow = '';
            });
            
            chatModal.addEventListener('click', function(e) {
                if (e.target === chatModal) {
                    chatModal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
})();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (portfolioApp) {
        portfolioApp.destroy();
    }
    if (profileEffect) {
        profileEffect.destroy();
    }
});

// Service Worker Registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is implemented
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered: ', registration))
        //     .catch(registrationError => console.log('SW registration failed: ', registrationError));
    });
}

// Export for module usage if needed
export { PortfolioApp, ProfileImageEffect };