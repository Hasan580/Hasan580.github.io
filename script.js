// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initAnimations();
    initChatButton();
    initScrollEffects();
    initParallax();
    initMobileOptimizations();
    initMusicPlayer();
    initThemeToggle();
});

// Mobile optimizations
function initMobileOptimizations() {
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Add mobile class to body
        document.body.classList.add('mobile-device');
        
        // Disable parallax on mobile for better performance
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(element => {
            element.style.transform = 'none';
        });
        
        // Optimize animations for mobile
        const skillIcons = document.querySelectorAll('.skill-icon');
        skillIcons.forEach(icon => {
            icon.style.animation = 'none';
        });
        
        // Reduce motion for better performance
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const animatedElements = document.querySelectorAll('[data-aos]');
            animatedElements.forEach(element => {
                element.style.animation = 'none';
                element.style.transition = 'none';
            });
        }
    }
    
    // Improve touch interactions
    const touchElements = document.querySelectorAll('.btn, .social-link, .skill-card, .project-card, .course-card');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 150);
        });
    });
    
    // Prevent zoom on input focus (mobile)
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            document.querySelector('meta[name="viewport"]').setAttribute('content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        });
        
        input.addEventListener('blur', function() {
            document.querySelector('meta[name="viewport"]').setAttribute('content', 
                'width=device-width, initial-scale=1.0');
        });
    });
    
    // Optimize scroll performance on mobile
    let ticking = false;
    function updateScrollElements() {
        // Your scroll-based animations here
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollElements);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Animate hamburger bars
            const bars = hamburger.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                if (hamburger.classList.contains('active')) {
                    if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) bar.style.opacity = '0';
                    if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                }
            });
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                
                // Reset hamburger bars
                const bars = hamburger.querySelectorAll('.bar');
                bars.forEach(bar => {
                    bar.style.transform = 'none';
                    bar.style.opacity = '1';
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }
}

// Animation functionality
function initAnimations() {
    // Simple AOS (Animate On Scroll) implementation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => {
        observer.observe(el);
        
        // Add staggered delay
        const delay = el.getAttribute('data-aos-delay') || 0;
        el.style.transitionDelay = delay + 'ms';
    });

    // Counter animation for any number elements
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        // Start counter when element is visible
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        });

        counterObserver.observe(counter);
    });

    // Typing animation for hero title
    const heroTitle = document.querySelector('.hero-title .gradient-text');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing after a short delay
        setTimeout(typeWriter, 500);
    }
}

// Chat button functionality
function initChatButton() {
    const chatBtn = document.getElementById('chatBtn');
    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            // You can customize this to open your preferred chat platform
            const contacts = [
                { name: 'Email', url: 'mailto:7zribrahim@gmail.com', icon: 'fas fa-envelope' },
                { name: 'WhatsApp', url: 'https://wa.me/9647XXXXXXXX', icon: 'fab fa-whatsapp' },
                { name: 'Telegram', url: 'https://t.me/yourusername', icon: 'fab fa-telegram' },
                { name: 'LinkedIn', url: 'http://www.linkedin.com/in/ibrahim4u', icon: 'fab fa-linkedin' }
            ];

            showChatModal(contacts);
        });
    }
}

// Show chat modal
function showChatModal(contacts) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.chat-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'chat-modal';
    modal.innerHTML = `
        <div class="chat-modal-content">
            <div class="chat-modal-header">
                <h3>Let's Connect!</h3>
                <button class="chat-modal-close">&times;</button>
            </div>
            <div class="chat-modal-body">
                <p>Choose your preferred way to get in touch:</p>
                <div class="chat-options">
                    ${contacts.map(contact => `
                        <a href="${contact.url}" target="_blank" class="chat-option">
                            <i class="${contact.icon}"></i>
                            <span>${contact.name}</span>
                        </a>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Add modal styles
    const modalStyles = `
        .chat-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .chat-modal-content {
            background: white;
            border-radius: 1rem;
            padding: 0;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            animation: slideUp 0.3s ease;
        }
        
        .chat-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 2rem;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .chat-modal-header h3 {
            margin: 0;
            color: #1f2937;
        }
        
        .chat-modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #6b7280;
            transition: color 0.2s;
        }
        
        .chat-modal-close:hover {
            color: #1f2937;
        }
        
        .chat-modal-body {
            padding: 2rem;
        }
        
        .chat-modal-body p {
            margin-bottom: 1.5rem;
            color: #6b7280;
        }
        
        .chat-options {
            display: grid;
            gap: 0.75rem;
        }
        
        .chat-option {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            background: #f8fafc;
            border-radius: 0.5rem;
            text-decoration: none;
            color: #1f2937;
            transition: all 0.2s;
            border: 1px solid #e5e7eb;
        }
        
        .chat-option:hover {
            background: #2563eb;
            color: white;
            transform: translateY(-2px);
        }
        
        .chat-option i {
            font-size: 1.2rem;
            width: 20px;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;

    // Add styles to head if not already added
    if (!document.querySelector('#chat-modal-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'chat-modal-styles';
        styleSheet.textContent = modalStyles;
        document.head.appendChild(styleSheet);
    }

    document.body.appendChild(modal);

    // Close modal functionality
    const closeBtn = modal.querySelector('.chat-modal-close');
    closeBtn.addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => modal.remove(), 300);
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => modal.remove(), 300);
        }
    });

    // Add fadeOut animation
    const fadeOutKeyframes = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    
    if (!document.querySelector('#fadeout-styles')) {
        const fadeOutSheet = document.createElement('style');
        fadeOutSheet.id = 'fadeout-styles';
        fadeOutSheet.textContent = fadeOutKeyframes;
        document.head.appendChild(fadeOutSheet);
    }
}

// Scroll effects
function initScrollEffects() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll indicator for hero section
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('#about') || document.querySelector('section:nth-of-type(2)');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Hide scroll indicator when scrolled
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
            }
        });
    }

    // Progress bar on scroll
    createScrollProgressBar();
}

// Create scroll progress bar
function createScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
    
    const progressStyles = `
        .scroll-progress {
            position: fixed;
            top: 70px;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(37, 99, 235, 0.1);
            z-index: 999;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .scroll-progress.visible {
            opacity: 1;
        }
        
        .scroll-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #2563eb, #3b82f6);
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    
    if (!document.querySelector('#progress-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'progress-styles';
        styleSheet.textContent = progressStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(progressBar);
    
    const progressFill = progressBar.querySelector('.scroll-progress-fill');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrolled / maxScroll) * 100;
        
        progressFill.style.width = scrollPercent + '%';
        
        // Show/hide progress bar
        if (scrolled > 100) {
            progressBar.classList.add('visible');
        } else {
            progressBar.classList.remove('visible');
        }
    });
}

// Parallax effects
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    // Hero background parallax
    const heroBackground = document.querySelector('.animated-bg');
    if (heroBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            heroBackground.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Form handling (if you add contact forms later)
function initFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual logic)
            setTimeout(() => {
                // Show success message
                showNotification('Message sent successfully!', 'success');
                
                // Reset form
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 2.7s forwards;
        }
        
        .notification-success { background: #10b981; }
        .notification-error { background: #ef4444; }
        .notification-info { background: #3b82f6; }
        .notification-warning { background: #f59e0b; }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = notificationStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after animation
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Dark mode toggle (optional feature)
function initDarkMode() {
    const darkModeToggle = document.querySelector('#dark-mode-toggle');
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            // Save preference
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
        });
        
        // Load saved preference
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        if (savedDarkMode) {
            document.body.classList.add('dark-mode');
        }
    }
}

// Performance optimization
function initPerformanceOptimizations() {
    // Optimize scroll events
    const optimizedScrollHandler = throttle(() => {
        // Your scroll handling code here
    }, 16); // ~60fps
    
    window.addEventListener('scroll', optimizedScrollHandler);
    
    // Optimize resize events
    const optimizedResizeHandler = debounce(() => {
        // Your resize handling code here
    }, 250);
    
    window.addEventListener('resize', optimizedResizeHandler);
}

// Initialize all optional features
document.addEventListener('DOMContentLoaded', function() {
    initLazyLoading();
    initDarkMode();
    initPerformanceOptimizations();
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can add error reporting here
});

// Service worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Music Player functionality
function initMusicPlayer() {
    const musicBtn = document.getElementById('musicBtn');
    const backgroundMusic = document.getElementById('backgroundMusic');
    
    if (!musicBtn || !backgroundMusic) return;
    
    let isPlaying = false;
    
    // Set initial volume
    backgroundMusic.volume = 0.3;
    
    musicBtn.addEventListener('click', function() {
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });
    
    function playMusic() {
        backgroundMusic.play().then(() => {
            isPlaying = true;
            musicBtn.classList.add('playing');
            musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
            musicBtn.title = 'Pause Background Music';
            
            // Add success feedback
            showMusicFeedback('Music Playing', 'success');
        }).catch(error => {
            console.log('Audio playback failed:', error);
            showMusicFeedback('Unable to play music. Please click to enable audio.', 'error');
        });
    }
    
    function pauseMusic() {
        backgroundMusic.pause();
        isPlaying = false;
        musicBtn.classList.remove('playing');
        musicBtn.innerHTML = '<i class="fas fa-music"></i>';
        musicBtn.title = 'Play Background Music';
        
        showMusicFeedback('Music Paused', 'info');
    }
    
    // Handle music end
    backgroundMusic.addEventListener('ended', () => {
        // Since we have loop attribute, this shouldn't trigger often
        // but we'll handle it just in case
        isPlaying = false;
        musicBtn.classList.remove('playing');
        musicBtn.innerHTML = '<i class="fas fa-music"></i>';
        musicBtn.title = 'Play Background Music';
    });
    
    // Handle audio errors
    backgroundMusic.addEventListener('error', (e) => {
        console.log('Audio error:', e);
        isPlaying = false;
        musicBtn.classList.remove('playing');
        musicBtn.innerHTML = '<i class="fas fa-music"></i>';
        musicBtn.title = 'Play Background Music';
        showMusicFeedback('Audio file not found or corrupted', 'error');
    });
    
    // Auto-play attempt (will only work after user interaction)
    document.addEventListener('click', function autoPlayAttempt() {
        if (!isPlaying) {
            backgroundMusic.play().then(() => {
                // Auto-play successful - remove this listener
                document.removeEventListener('click', autoPlayAttempt);
            }).catch(() => {
                // Auto-play failed - keep the listener for next interaction
            });
        }
    }, { once: false });
}

// Music feedback function
function showMusicFeedback(message, type = 'info') {
    // Remove existing feedback
    const existingFeedback = document.querySelector('.music-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    const feedback = document.createElement('div');
    feedback.className = `music-feedback music-feedback-${type}`;
    feedback.textContent = message;
    
    // Add feedback styles
    const feedbackStyles = `
        .music-feedback {
            position: fixed;
            top: 80px;
            right: 2rem;
            background: white;
            color: #1f2937;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            font-size: 0.875rem;
            font-weight: 500;
            animation: slideInRight 0.3s ease, fadeOutRight 0.3s ease 2.7s forwards;
            border-left: 4px solid #3b82f6;
        }
        
        .music-feedback-success {
            border-left-color: #10b981;
        }
        
        .music-feedback-error {
            border-left-color: #ef4444;
        }
        
        .music-feedback-info {
            border-left-color: #3b82f6;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOutRight {
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#music-feedback-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'music-feedback-styles';
        styleSheet.textContent = feedbackStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(feedback);
    
    // Remove feedback after animation
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.remove();
        }
    }, 3000);
}

// Theme Toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Add switching animation
        themeToggle.classList.add('switching');
        setTimeout(() => {
            themeToggle.classList.remove('switching');
        }, 600);
        
        setTheme(newTheme);
        showThemeFeedback(newTheme);
    });
}

function setTheme(theme) {
    const themeToggle = document.getElementById('themeToggle');
    
    // Set theme attribute
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save theme preference
    localStorage.setItem('theme', theme);
    
    // Update button icon and title
    if (themeToggle) {
        if (theme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.title = 'Switch to Light Mode';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.title = 'Switch to Dark Mode';
        }
    }
    
    // Update theme-color meta tag
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
        themeColorMeta.content = theme === 'dark' ? '#0f172a' : '#2563eb';
    }
}

function showThemeFeedback(theme) {
    // Remove existing feedback
    const existingFeedback = document.querySelector('.theme-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    const feedback = document.createElement('div');
    feedback.className = 'theme-feedback';
    feedback.innerHTML = `
        <i class="fas fa-${theme === 'dark' ? 'moon' : 'sun'}"></i>
        <span>${theme === 'dark' ? 'Dark' : 'Light'} Mode Activated</span>
    `;
    
    // Add feedback styles
    const feedbackStyles = `
        .theme-feedback {
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--card-bg);
            color: var(--text-primary);
            padding: 0.75rem 1.5rem;
            border-radius: 2rem;
            box-shadow: 0 4px 20px var(--shadow-color);
            z-index: 9999;
            font-size: 0.875rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            border: 1px solid var(--border-color);
            animation: themeSlideIn 0.4s ease, themeSlideOut 0.4s ease 2.6s forwards;
        }
        
        .theme-feedback i {
            color: var(--primary-color);
        }
        
        @keyframes themeSlideIn {
            from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        
        @keyframes themeSlideOut {
            to { transform: translateX(-50%) translateY(-20px); opacity: 0; }
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#theme-feedback-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'theme-feedback-styles';
        styleSheet.textContent = feedbackStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(feedback);
    
    // Remove feedback after animation
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.remove();
        }
    }, 3000);
}
