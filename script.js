// ===== Page Loading =====
window.addEventListener('load', () => {
    const loadingOverlay = document.getElementById('loadingOverlay');
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
    }, 1000);
});

// ===== Navigation =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Counter Animation =====
const counters = document.querySelectorAll('.stat-number');
const speed = 200;
let hasAnimated = false;

function animateCounters() {
    if (hasAnimated) return;

    const heroSection = document.querySelector('.hero');
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    const scrollPosition = window.pageYOffset + window.innerHeight;

    if (scrollPosition > heroBottom - 200) {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const increment = target / speed;
            let count = 0;

            const updateCount = () => {
                count += increment;
                if (count < target) {
                    counter.textContent = Math.ceil(count);
                    setTimeout(updateCount, 10);
                } else {
                    counter.textContent = target + (target === 50 ? '+' : '');
                }
            };

            updateCount();
        });
        hasAnimated = true;
    }
}

window.addEventListener('scroll', animateCounters);

// ===== AOS (Animate On Scroll) =====
function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        }
    );

    elements.forEach(element => {
        observer.observe(element);
    });
}

document.addEventListener('DOMContentLoaded', initAOS);

// ===== Booking Form =====
const bookingForm = document.getElementById('bookingForm');

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(bookingForm);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Validate form
    if (!data.name || !data.phone || !data.location || !data.service || !data.date || !data.time) {
        showNotification('الرجاء ملء جميع الحقول المطلوبة', 'error');
        return;
    }

    // Format date
    const selectedDate = new Date(data.date);
    const formattedDate = selectedDate.toLocaleDateString('ar-IQ', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Create confirmation message
    const message = `
تم استلام طلب الحجز بنجاح!

الاسم: ${data.name}
رقم الهاتف: ${data.phone}
الفرع: ${getLocationName(data.location)}
الخدمة: ${getServiceName(data.service)}
التاريخ: ${formattedDate}
الوقت: ${data.time}
${data.notes ? `\nملاحظات: ${data.notes}` : ''}

سنتصل بك قريباً لتأكيد الحجز.
    `;

    // Show confirmation
    showNotification('تم إرسال طلب الحجز بنجاح!', 'success');
    alert(message);

    // Reset form
    bookingForm.reset();

    // In a real application, you would send this data to a server
    console.log('Booking data:', data);
});

// Helper functions for booking
function getLocationName(value) {
    const locations = {
        'university': 'حي الجامعة',
        'wathaiq': 'ساحة الواثق',
        'saidiya': 'السيدية'
    };
    return locations[value] || value;
}

function getServiceName(value) {
    const services = {
        'pc': 'Gaming PC',
        'vip-pc': 'VIP Gaming PC',
        'ps5': 'PlayStation 5',
        'vip-ps5': 'VIP PS5 Room',
        'billiards': 'Billiards',
        'snooker': 'Snooker'
    };
    return services[value] || value;
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: 10px;
                padding: 15px 20px;
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                animation: slideIn 0.3s ease;
                max-width: 400px;
            }
            
            .notification-success {
                border-color: var(--success);
            }
            
            .notification-error {
                border-color: var(--danger);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notification-success i {
                color: var(--success);
            }
            
            .notification-error i {
                color: var(--danger);
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add to page
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== Gallery =====
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const category = item.getAttribute('data-category');
        showNotification(`معرض ${category} - قريباً سيتم إضافة الصور`, 'info');
    });
});

// ===== Newsletter Form =====
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (email) {
            showNotification('شكراً لاشتراكك! سنرسل لك أحدث العروض.', 'success');
            newsletterForm.reset();
        }
    });
}

// ===== Scroll to Top Button =====
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Service Cards Tilt Effect =====
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== Pricing Cards Interaction =====
const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        if (card.classList.contains('popular')) {
            card.style.transform = 'scale(1.05)';
        } else {
            card.style.transform = '';
        }
    });
});

// ===== Dynamic Current Year =====
const currentYear = new Date().getFullYear();
const footerBottom = document.querySelector('.footer-bottom p');
if (footerBottom) {
    footerBottom.innerHTML = `&copy; ${currentYear} X Space Cyber Cafe. جميع الحقوق محفوظة.`;
}

// ===== Lazy Loading for Images =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ===== Performance Optimization =====
let ticking = false;

function onScroll() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            activateNavLink();
            animateCounters();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll, { passive: true });

// ===== Console Welcome Message =====
console.log('%c🎮 X Space Cyber Cafe 🎮', 'color: #8b5cf6; font-size: 24px; font-weight: bold;');
console.log('%cأهلاً بك في موقع X Space Cyber Cafe!', 'color: #06b6d4; font-size: 16px;');
console.log('%cللتواصل: info@xspace-cafe.com', 'color: #10b981; font-size: 14px;');

// ===== Prevent Context Menu on Certain Elements (Optional) =====
// Uncomment if you want to protect images
/*
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', (e) => e.preventDefault());
});
*/

// ===== Add Loading State to Forms =====
function addLoadingState(button) {
    const originalText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
    
    return () => {
        button.disabled = false;
        button.innerHTML = originalText;
    };
}

// ===== Date Input Min Value (Today) =====
const dateInput = document.querySelector('input[type="date"]');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// ===== Phone Number Validation =====
const phoneInput = document.querySelector('input[type="tel"]');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        // Allow only numbers and common phone characters
        e.target.value = e.target.value.replace(/[^\d\s\-\+\(\)]/g, '');
    });
}

// ===== Service Availability Check =====
function checkServiceAvailability(service, location, date, time) {
    // This would normally make an API call to check availability
    // For now, we'll simulate it
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                available: true,
                message: 'الخدمة متاحة في الوقت المحدد'
            });
        }, 1000);
    });
}

// ===== Enhanced Booking Form with Real-time Validation =====
const formInputs = bookingForm.querySelectorAll('input, select, textarea');

formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        validateInput(input);
    });
});

function validateInput(input) {
    const value = input.value.trim();
    
    if (input.hasAttribute('required') && !value) {
        input.style.borderColor = 'var(--danger)';
        return false;
    }
    
    if (input.type === 'tel' && value) {
        const phoneRegex = /^07\d{9}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            input.style.borderColor = 'var(--danger)';
            return false;
        }
    }
    
    input.style.borderColor = 'var(--success)';
    return true;
}

// ===== Music Player & Music Mode =====
const musicToggle = document.getElementById('musicToggle');
const headphoneModal = document.getElementById('headphoneModal');
const startMusicBtn = document.getElementById('startMusicBtn');
const backgroundMusic = document.getElementById('backgroundMusic');
const musicModeOverlay = document.getElementById('musicModeOverlay');
let musicModeActive = false;

// Initialize music player
musicToggle.addEventListener('click', () => {
    if (!backgroundMusic.paused) {
        // Pause music and exit music mode
        backgroundMusic.pause();
        deactivateMusicMode();
    } else {
        // Show headphone modal
        headphoneModal.classList.add('show');
    }
});

// Start music from modal
startMusicBtn.addEventListener('click', () => {
    headphoneModal.classList.remove('show');
    startMusic();
});

// Start music function
function startMusic() {
    backgroundMusic.play().then(() => {
        activateMusicMode();
        showNotification('🎵 وضع الموسيقى مُفعّل | Music Mode Activated', 'success');
    }).catch(error => {
        console.error('Error playing music:', error);
        showNotification('حدث خطأ في تشغيل الموسيقى', 'error');
    });
}

// Activate music mode
function activateMusicMode() {
    musicModeActive = true;
    musicToggle.classList.add('playing');
    musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
    document.body.classList.add('music-mode');
    musicModeOverlay.classList.add('active');
    
    // Smooth transition
    setTimeout(() => {
        document.body.style.transition = 'all 1s ease';
    }, 100);
}

// Deactivate music mode
function deactivateMusicMode() {
    musicModeActive = false;
    musicToggle.classList.remove('playing');
    musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    document.body.classList.remove('music-mode');
    musicModeOverlay.classList.remove('active');
    showNotification('وضع الموسيقى مُعطّل | Music Mode Deactivated', 'info');
}

// Close modal on outside click
headphoneModal.addEventListener('click', (e) => {
    if (e.target === headphoneModal) {
        headphoneModal.classList.remove('show');
    }
});

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && headphoneModal.classList.contains('show')) {
        headphoneModal.classList.remove('show');
    }
});

// Keyboard shortcut for music (Space bar)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        musicToggle.click();
    }
});

// Volume control with mouse wheel (optional enhancement)
musicToggle.addEventListener('wheel', (e) => {
    if (musicModeActive) {
        e.preventDefault();
        const volumeChange = e.deltaY > 0 ? -0.1 : 0.1;
        backgroundMusic.volume = Math.max(0, Math.min(1, backgroundMusic.volume + volumeChange));
        showNotification(`🔊 مستوى الصوت: ${Math.round(backgroundMusic.volume * 100)}%`, 'info');
    }
}, { passive: false });

// ===== Tournaments Section =====
const loadTournamentsBtn = document.getElementById('loadTournamentsBtn');
const refreshTournamentsBtn = document.getElementById('refreshTournamentsBtn');
const tournamentsGrid = document.getElementById('tournamentsGrid');
const tournamentsLoading = document.getElementById('tournamentsLoading');
const tournamentsError = document.getElementById('tournamentsError');

if (loadTournamentsBtn) {
    loadTournamentsBtn.addEventListener('click', loadTournaments);
}
if (refreshTournamentsBtn) {
    refreshTournamentsBtn.addEventListener('click', loadTournaments);
}

function loadTournaments() {
    console.log('Loading tournaments...');
    
    // Show loading state
    tournamentsLoading.style.display = 'block';
    tournamentsError.style.display = 'none';
    tournamentsGrid.innerHTML = '';
    loadTournamentsBtn.style.display = 'none';
    refreshTournamentsBtn.style.display = 'inline-flex';

    // Simulate loading delay for smooth transition
    setTimeout(() => {
        tournamentsLoading.style.display = 'none';
        displayTournaments();
    }, 800);
}

function displayTournaments() {
    console.log('Displaying ZAIN ESPORTS tournaments...');
    
    // Tournament dates (Year, Month-1, Day, Hour, Minute)
    const tournaments = [
        {
            name: 'FC26 - ZAIN ESPORTS',
            description: 'مهرجان العراق للألعاب والرياضات الإلكترونية - الخريف',
            game: 'FC26',
            game_icon: 'fa-futbol',
            date: new Date(2025, 11, 15, 16, 0), // Dec 15, 2025, 4:00 PM
            location: 'Xspace حي الجامعة',
            venue_details: 'الكرادة, حي الجامعة, السيدية',
            participants: 'فردي',
            prize: '15,000,000 دينار عراقي',
            status: 'upcoming',
            registration_link: '#booking',
            image: null // No image for FC26
        },
        {
            name: 'Generals - ZAIN ESPORTS',
            description: 'مهرجان العراق للألعاب والرياضات الإلكترونية - الخريف',
            game: 'Generals',
            game_icon: 'fa-chess-knight',
            date: new Date(2025, 11, 20, 16, 0), // Dec 20, 2025, 4:00 PM
            location: 'Xspace الكرادة, ساحة الواثق',
            venue_details: '3 مواقع في بغداد',
            participants: 'فريق (3 لاعبين + 1 احتياطي اختياري)',
            prize: '15,000,000 دينار عراقي',
            status: 'upcoming',
            registration_link: '#booking',
            image: null
        },
        {
            name: 'Valorant - ZAIN ESPORTS',
            description: 'مهرجان العراق للألعاب والرياضات الإلكترونية - الخريف',
            game: 'Valorant',
            game_icon: 'fa-bullseye',
            date: new Date(2025, 11, 25, 16, 0), // Dec 25, 2025, 4:00 PM
            location: 'Xspace الكرادة, ساحة الواثق',
            venue_details: '6 منافسات مختلفة',
            participants: 'فريق (5 لاعبين + 1 احتياطي اختياري)',
            prize: '15,000,000 دينار عراقي',
            status: 'upcoming',
            registration_link: '#booking',
            image: null
        },
        {
            name: 'Call of Duty - ZAIN ESPORTS',
            description: 'مهرجان العراق للألعاب والرياضات الإلكترونية - الخريف',
            game: 'Call of Duty',
            game_icon: 'fa-crosshairs',
            date: new Date(2025, 11, 28, 16, 0), // Dec 28, 2025, 4:00 PM
            location: 'Xspace السيدية',
            venue_details: 'شهر 2 من المنافسات',
            participants: 'فريق (5 لاعبين + 1 احتياطي اختياري)',
            prize: '15,000,000 دينار عراقي',
            status: 'upcoming',
            registration_link: '#booking',
            image: 'call of duty.jpg'
        },
        {
            name: 'Rainbow Six - ZAIN ESPORTS',
            description: 'مهرجان العراق للألعاب والرياضات الإلكترونية - الخريف',
            game: 'Rainbow Six',
            game_icon: 'fa-shield-alt',
            date: new Date(2026, 0, 5, 16, 0), // Jan 5, 2026, 4:00 PM
            location: 'Xspace السيدية',
            venue_details: '3 مواقع في بغداد',
            participants: 'فريق (5 لاعبين + 1 احتياطي اختياري)',
            prize: '15,000,000 دينار عراقي',
            status: 'upcoming',
            registration_link: '#booking',
            image: 'Rainbow-Six-Siege-X.jpg'
        },
        {
            name: 'Rocket League - ZAIN ESPORTS',
            description: 'مهرجان العراق للألعاب والرياضات الإلكترونية - الخريف',
            game: 'Rocket League',
            game_icon: 'fa-rocket',
            date: new Date(2026, 0, 10, 16, 0), // Jan 10, 2026, 4:00 PM
            location: 'Xspace حي الجامعة',
            venue_details: 'بطولة شهر 2',
            participants: 'فريق (2 لاعبين)',
            prize: '15,000,000 دينار عراقي',
            status: 'upcoming',
            registration_link: '#booking',
            image: 'rocket league.jpg'
        }
    ];

    tournamentsGrid.innerHTML = '';
    tournamentsGrid.style.display = 'grid';
    tournamentsGrid.style.visibility = 'visible';
    tournamentsGrid.style.opacity = '1';
    
    console.log('Displaying tournaments:', tournaments.length);
    console.log('tournamentsGrid element:', tournamentsGrid);

    tournaments.forEach((tournament, index) => {
        console.log(`Creating card ${index + 1} for:`, tournament.name);
        const card = createTournamentCard(tournament, index);
        console.log('Card created:', card);
        tournamentsGrid.appendChild(card);
    });
    
    console.log('Cards appended to grid, total children:', tournamentsGrid.children.length);
    
    // Start countdown timers
    startCountdownTimers();
    
    console.log('Tournaments displayed successfully!');
}

// Countdown timer function
function startCountdownTimers() {
    const countdownElements = document.querySelectorAll('.tournament-countdown');
    
    function updateCountdowns() {
        const now = new Date().getTime();
        
        countdownElements.forEach(element => {
            const targetDate = new Date(element.dataset.date).getTime();
            const distance = targetDate - now;
            
            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                const daysEl = element.querySelector('.countdown-days');
                const hoursEl = element.querySelector('.countdown-hours');
                const minutesEl = element.querySelector('.countdown-minutes');
                const secondsEl = element.querySelector('.countdown-seconds');
                
                if (daysEl) daysEl.textContent = days;
                if (hoursEl) hoursEl.textContent = hours;
                if (minutesEl) minutesEl.textContent = minutes;
                if (secondsEl) secondsEl.textContent = seconds;
            } else {
                element.innerHTML = '<div class="countdown-expired">\u0628\u062f\u0623\u062a \u0627\u0644\u0628\u0637\u0648\u0644\u0629!</div>';
            }
        });
    }
    
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
}

function createTournamentCard(tournament, index) {
    const card = document.createElement('div');
    card.className = 'tournament-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (index * 100).toString());
    
    // Test with simple content first
    card.style.minHeight = '400px';
    card.style.display = 'block';
    card.style.visibility = 'visible';

    const gameIcon = tournament.game_icon || 'fa-gamepad';
    const statusBadge = tournament.status === 'active' ? 
        '<div class=\"tournament-status active\">نشط الآن</div>' : 
        '<div class=\"tournament-status upcoming\">قريباً</div>';
    
    const dateStr = tournament.date.toLocaleDateString('ar-IQ', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Banner with image or gradient
    let bannerContent;
    if (tournament.image) {
        bannerContent = `
            <div class="tournament-banner tournament-banner-image" style="background-image: url('${tournament.image}');">
                ${statusBadge}
                <div class="tournament-logo">
                    <div class="zain-logo">ZAIN ESPORTS</div>
                </div>
            </div>
        `;
    } else {
        bannerContent = `
            <div class="tournament-banner" style="background: linear-gradient(135deg, #d4af37 0%, #f4e5a0 50%, #d4af37 100%);">
                ${statusBadge}
                <div class="tournament-logo">
                    <div class="zain-logo">ZAIN ESPORTS</div>
                    <div class="tournament-subtitle">مهرجان العراق للألعاب والرياضات الإلكترونية - الخريف</div>
                </div>
            </div>
        `;
    }

    card.innerHTML = `
        ${bannerContent}
        <div class="tournament-content">
            <div class="tournament-game-header">
                <i class="fas ${gameIcon}"></i>
                <h3 class="tournament-title">${tournament.name}</h3>
            </div>
            
            <div class="tournament-countdown" data-date="${tournament.date.toISOString()}">
                <div class="countdown-item">
                    <span class="countdown-number countdown-days">0</span>
                    <span class="countdown-label">أيام</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number countdown-hours">0</span>
                    <span class="countdown-label">ساعات</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number countdown-minutes">0</span>
                    <span class="countdown-label">دقائق</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number countdown-seconds">0</span>
                    <span class="countdown-label">ثواني</span>
                </div>
            </div>
            
            <div class="tournament-info">
                <div class="tournament-info-item">
                    <i class="fas fa-gamepad"></i>
                    <span><strong>اللعبة:</strong> ${tournament.game}</span>
                </div>
                <div class="tournament-info-item">
                    <i class="fas fa-calendar"></i>
                    <span><strong>التاريخ:</strong> ${dateStr}</span>
                </div>
                <div class="tournament-info-item">
                    <i class="fas fa-users"></i>
                    <span><strong>التنسيق:</strong> ${tournament.participants}</span>
                </div>
                <div class="tournament-info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span><strong>الموقع:</strong> ${tournament.location}</span>
                </div>
                ${tournament.venue_details ? `
                <div class="tournament-info-item">
                    <i class="fas fa-info-circle"></i>
                    <span><strong>التفاصيل:</strong> ${tournament.venue_details}</span>
                </div>
                ` : ''}
            </div>

            <div class="tournament-prizes">
                <h4><i class="fas fa-trophy"></i> الجوائز</h4>
                <div class="total-prize">
                    <span class="prize-amount">${tournament.prize}</span>
                    <span class="prize-label">إجمالي الجوائز</span>
                </div>
            </div>

            <div class="tournament-actions">
                <a href="${tournament.registration_link}" class="tournament-btn tournament-btn-primary">
                    <i class="fas fa-user-plus"></i> سجل الآن
                </a>
                <a href="#tournaments" class="tournament-btn tournament-btn-secondary">
                    <i class="fas fa-info-circle"></i> التفاصيل
                </a>
            </div>
        </div>
    `;

    return card;
}

function displayNoTournaments() {
    tournamentsGrid.innerHTML = `
        <div class="no-tournaments">
            <i class="fas fa-trophy"></i>
            <p>لا توجد بطولات حالية</p>
            <p style="font-size: 14px; margin-top: 10px;">تابعنا على وسائل التواصل الاجتماعي للحصول على آخر التحديثات</p>
        </div>
    `;
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ X Space Website Initialized Successfully');
    console.log('🎵 Press Space or click the music icon to start the experience');
    console.log('🏆 Click the tournaments button to view upcoming competitions');
});
