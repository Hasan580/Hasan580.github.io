// Main JavaScript functionality for Firas Technology Solutions website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initTypingEffect();
    initFormHandling();
    initSmoothScrolling();
    initScrollToTop();
    
    // Initialize page-specific functionality
    if (window.location.pathname.includes('downloads')) {
        initDownloadsPage();
    }
    
    if (window.location.pathname.includes('services')) {
        initServicesPage();
    }
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements that should animate
    const animatedElements = document.querySelectorAll(`
        .about-card,
        .feature-card,
        .service-card,
        .download-card,
        .pricing-card,
        .process-step,
        .faq-item
    `);

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Typing effect for hero title
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const text = typingElement.textContent;
    typingElement.textContent = '';
    typingElement.style.borderRight = '3px solid var(--primary-color)';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            // Keep blinking cursor for a while, then remove it
            setTimeout(() => {
                typingElement.style.borderRight = 'none';
            }, 2000);
        }
    };
    
    // Start typing after a short delay
    setTimeout(typeWriter, 1000);
}

// Form handling
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form-container');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const service = formData.get('service');
        const message = formData.get('message');
        
        // Create email body
        const emailBody = `Name: ${name}%0D%0AEmail: ${email}%0D%0AService: ${service}%0D%0AMessage: ${message}`;
        const emailSubject = `Service Request from ${name}`;
        
        // Open email client
        window.location.href = `mailto:hassan.f.abdalmuttaleb@gmail.com?subject=${emailSubject}&body=${emailBody}`;
        
        // Show success message
        showNotification('Thank you! Your message has been prepared. Please send the email from your email client.', 'success');
        
        // Reset form
        contactForm.reset();
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to top functionality
function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top when clicked
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add hover effect
    scrollBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.1)';
    });
    
    scrollBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 2000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// FAQ functionality
function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    // Close all other FAQs
    document.querySelectorAll('.faq-question').forEach(question => {
        if (question !== element) {
            question.classList.remove('active');
            question.nextElementSibling.classList.remove('open');
        }
    });
    
    // Toggle current FAQ
    element.classList.toggle('active');
    answer.classList.toggle('open');
}

// Modal functionality
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
    document.body.style.overflow = 'auto';
}

function closeServiceModal() {
    closeModal();
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Downloads page functionality
function initDownloadsPage() {
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const downloadCards = document.querySelectorAll('.download-card');
    const noResults = document.getElementById('noResults');

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterCards(searchTerm, getCurrentFilter());
        });
    }

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            filterCards(searchTerm, filter);
        });
    });

    function getCurrentFilter() {
        const activeBtn = document.querySelector('.filter-btn.active');
        return activeBtn ? activeBtn.dataset.filter : 'all';
    }

    function filterCards(searchTerm, filter) {
        let visibleCount = 0;

        downloadCards.forEach(card => {
            const category = card.dataset.category;
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesFilter = filter === 'all' || category === filter;
            
            if (matchesSearch && matchesFilter) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Show/hide no results message
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }
}

// Services page functionality
function initServicesPage() {
    // Service request functionality is handled by modal
}

// Download handling
function handleDownload(fileId) {
    showModal('downloadModal');
    
    // Track download attempt
    console.log(`Download requested for: ${fileId}`);
    
    // You can add actual download logic here when files are available
    // For now, we just show the modal with information
}

// Video tutorial handling
function showVideoTutorial(videoId) {
    // This would open the YouTube video
    // For now, we'll show a placeholder
    showNotification('Video tutorial will be available soon on our YouTube channel!', 'info');
    
    // You can replace this with actual YouTube links when available
    // window.open(`https://youtube.com/watch?v=${videoId}`, '_blank');
}

// Service request handling
function requestService(serviceType) {
    showModal('serviceModal');
    
    // Track service request
    console.log(`Service requested: ${serviceType}`);
    
    // You can add analytics or tracking here
}

// Add loading animation for buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
        const btn = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
        
        // Add loading state
        const originalText = btn.innerHTML;
        btn.style.pointerEvents = 'none';
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        
        // Remove loading state after a short delay
        setTimeout(() => {
            btn.style.pointerEvents = 'auto';
            btn.innerHTML = originalText;
        }, 1000);
    }
});

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        const parallax = hero.querySelector('.hero-bg-animation');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }
});

// Add floating animation to cards on hover
document.addEventListener('mouseover', function(e) {
    if (e.target.closest('.floating-card')) {
        const card = e.target.closest('.floating-card');
        card.style.animationPlayState = 'paused';
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.closest('.floating-card')) {
        const card = e.target.closest('.floating-card');
        card.style.animationPlayState = 'running';
    }
});

// Add dynamic pricing calculations (if needed)
function calculatePrice(serviceType, complexity = 'standard') {
    const basePrices = {
        'hardware-repair': { basic: 40, standard: 60, premium: 100 },
        'hardware-upgrade': { basic: 25, standard: 40, premium: 70 },
        'software-install': { basic: 30, standard: 45, premium: 65 },
        'thermal-paste': { basic: 25, standard: 35, premium: 50 },
        'maintenance': { basic: 20, standard: 30, premium: 45 },
        'consultation': { basic: 15, standard: 20, premium: 30 }
    };
    
    return basePrices[serviceType] ? basePrices[serviceType][complexity] : 0;
}

// Add performance monitoring
function trackPagePerformance() {
    window.addEventListener('load', function() {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
        
        // You can send this data to analytics
        if (loadTime > 3000) {
            console.warn('Page load time is over 3 seconds. Consider optimizing.');
        }
    });
}

// Initialize performance tracking
trackPagePerformance();

// Add error handling for images
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        console.warn('Image failed to load:', e.target.src);
    }
}, true);

// Add copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showNotification('Copied to clipboard!', 'success');
    }).catch(function() {
        showNotification('Failed to copy to clipboard', 'error');
    });
}

// Add print functionality
function printPage() {
    window.print();
}

// Add theme detection
function detectTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // User prefers dark theme
        console.log('Dark theme preferred');
        // You can add dark theme support here
    }
}

detectTheme();

// Export functions for use in other files
window.FirasTech = {
    showModal,
    closeModal,
    showNotification,
    toggleFaq,
    handleDownload,
    showVideoTutorial,
    requestService,
    calculatePrice,
    copyToClipboard,
    printPage
};
