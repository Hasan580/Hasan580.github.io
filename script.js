// Configuration - Replace with your email service details
const CONFIG = {
    // EmailJS configuration (Free email service)
    // Sign up at https://www.emailjs.com/
    emailServiceId: 'YOUR_SERVICE_ID',
    emailTemplateId: 'YOUR_TEMPLATE_ID',
    emailUserId: 'YOUR_USER_ID',
    
    // Your email to receive orders
    yourEmail: 'your-email@example.com',
    
    // Backend Server Configuration
    backendUrl: 'http://localhost:3000',
    pollInterval: 5000, // 5 seconds
    maxPollTime: 300000, // 5 minutes
    demoMode: false // Real Tripo3D API now active!
};

// Load Products from localStorage or use default
let products = JSON.parse(localStorage.getItem('storeProducts')) || [];

// Default products if none exist
if (products.length === 0) {
    products = [
    {
        id: 1,
        nameAr: 'مجسم سوبرمان',
        nameEn: 'Superman Figure',
        descriptionAr: 'مجسم سوبرمان عالي الجودة مطبوع بتقنية 3D',
        descriptionEn: 'High-quality 3D printed Superman figure',
        price: 60000,
        image: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400',
        category: 'figures'
    },
    {
        id: 2,
        nameAr: 'مجسم باتمان',
        nameEn: 'Batman Figure',
        descriptionAr: 'مجسم باتمان مفصل مع قاعدة عرض',
        descriptionEn: 'Detailed Batman figure with display base',
        price: 70000,
        image: 'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=400',
        category: 'figures'
    },
    {
        id: 3,
        nameAr: 'حامل هاتف',
        nameEn: 'Phone Holder',
        descriptionAr: 'حامل هاتف عصري بتصميم فريد',
        descriptionEn: 'Modern phone holder with unique design',
        price: 18000,
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400',
        category: 'accessories'
    },
    {
        id: 4,
        nameAr: 'مجسم سبايدرمان',
        nameEn: 'Spider-Man Figure',
        descriptionAr: 'مجسم سبايدرمان في وضعية حركية رائعة',
        descriptionEn: 'Spider-Man figure in dynamic action pose',
        price: 65000,
        image: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400',
        category: 'figures'
    },
    {
        id: 5,
        nameAr: 'قاعدة لامبة LED',
        nameEn: 'LED Lamp Base',
        descriptionAr: 'قاعدة لامبة LED مع نقوش فنية',
        descriptionEn: 'LED lamp base with artistic patterns',
        price: 38000,
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400',
        category: 'decorations'
    },
    {
        id: 6,
        nameAr: 'منظم مكتب',
        nameEn: 'Desk Organizer',
        descriptionAr: 'منظم مكتب عملي وأنيق',
        descriptionEn: 'Practical and elegant desk organizer',
        price: 28000,
        image: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=400',
        category: 'accessories'
    },
    {
        id: 7,
        nameAr: 'مجسم أيرون مان',
        nameEn: 'Iron Man Figure',
        descriptionAr: 'مجسم أيرون مان مع إضاءة LED',
        descriptionEn: 'Iron Man figure with LED lighting',
        price: 85000,
        image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400',
        category: 'figures'
    },
    {
        id: 8,
        nameAr: 'إطار صور هندسي',
        nameEn: 'Geometric Photo Frame',
        descriptionAr: 'إطار صور بتصميم هندسي مبتكر',
        descriptionEn: 'Photo frame with innovative geometric design',
        price: 33000,
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400',
        category: 'decorations'
    },
    {
        id: 9,
        nameAr: 'حامل مفاتيح',
        nameEn: 'Key Holder',
        descriptionAr: 'حامل مفاتيح جداري عملي',
        descriptionEn: 'Practical wall-mounted key holder',
        price: 14000,
        image: 'https://images.unsplash.com/photo-1592503254549-d83d24a4dfab?w=400',
        category: 'accessories'
    },
    {
        id: 10,
        nameAr: 'مجسم ثور',
        nameEn: 'Thor Figure',
        descriptionAr: 'مجسم ثور مع مطرقته الأسطورية',
        descriptionEn: 'Thor figure with his legendary hammer',
        price: 68000,
        image: 'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=400',
        category: 'figures'
    },
    {
        id: 11,
        nameAr: 'إناء نباتات هندسي',
        nameEn: 'Geometric Plant Pot',
        descriptionAr: 'إناء نباتات بتصميم هندسي حديث',
        descriptionEn: 'Plant pot with modern geometric design',
        price: 22000,
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400',
        category: 'decorations'
    },
    {
        id: 12,
        nameAr: 'حامل سماعات',
        nameEn: 'Headphone Stand',
        descriptionAr: 'حامل سماعات أنيق للمكتب',
        descriptionEn: 'Elegant headphone stand for desk',
        price: 24000,
        image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400',
        category: 'accessories'
    }
];
    // Save default products to localStorage
    localStorage.setItem('storeProducts', JSON.stringify(products));
}

// State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentLanguage = localStorage.getItem('language') || 'ar';
let currentCategory = 'all';
let uploadedImage = null;
let uploadedImageFile = null;
let currentModelData = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Save default products to localStorage on first load
    const savedProducts = localStorage.getItem('storeProducts');
    if (!savedProducts || JSON.parse(savedProducts).length === 0) {
        console.log('Saving default products to localStorage...');
        localStorage.setItem('storeProducts', JSON.stringify(products));
        console.log('Saved', products.length, 'products');
    }
    
    console.log('DOM Content Loaded - Starting initialization');
    
    try {
        initializeDarkMode();
        console.log('✓ Dark mode initialized');
    } catch (e) { console.error('Dark mode error:', e); }
    
    try {
        initializeLanguage();
        console.log('✓ Language initialized');
    } catch (e) { console.error('Language error:', e); }
    
    try {
        initializeMusic();
        console.log('✓ Music initialized');
    } catch (e) { console.error('Music error:', e); }
    
    try {
        initializeUserStatus();
        console.log('✓ User status initialized');
    } catch (e) { console.error('User status error:', e); }
    
    try {
        initializeSearch();
        console.log('✓ Search initialized');
    } catch (e) { console.error('Search error:', e); }
    
    try {
        renderProducts();
        console.log('✓ Products rendered');
    } catch (e) { console.error('Products error:', e); }
    
    try {
        updateCartUI();
        console.log('✓ Cart UI updated');
    } catch (e) { console.error('Cart UI error:', e); }
    
    try {
        attachEventListeners();
        console.log('✓ Event listeners attached');
    } catch (e) { console.error('Event listeners error:', e); }
    
    try {
        initializeAIConverter();
        console.log('✓ AI Converter initialized');
    } catch (e) { console.error('AI Converter error:', e); }
    
    console.log('All initialization complete');
});

// Check if user is logged in and update UI
function initializeUserStatus() {
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const userName = localStorage.getItem('userName');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const userBtn = document.getElementById('userBtn');
    const userNameSpan = document.getElementById('userName');
    const adminPanelLink = document.getElementById('adminPanelLink');
    
    if (userLoggedIn && userName && userBtn && userNameSpan) {
        userBtn.href = '#';
        userBtn.onclick = (e) => {
            e.preventDefault();
            logout();
        };
        userNameSpan.textContent = userName.split(' ')[0]; // First name only
        userBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
        userBtn.classList.add('bg-purple-500', 'hover:bg-purple-600');
        
        // Show admin panel link if user is admin
        if (isAdmin && adminPanelLink) {
            adminPanelLink.classList.remove('hidden');
        }
    }
}

function logout() {
    if (confirm(currentLanguage === 'ar' ? 'هل تريد تسجيل الخروج?' : 'Do you want to logout?')) {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('isAdmin');
        showNotification(currentLanguage === 'ar' ? 'تم تسجيل الخروج' : 'Logged out', 'info');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// Music Management
let isPlaying = false;
let audioContext;
let analyser;
let dataArray;

function initializeMusic() {
    const musicBtn = document.getElementById('musicToggle');
    const audio = document.getElementById('backgroundMusic');
    const musicStatus = document.getElementById('musicStatus');
    
    if (musicBtn && audio) {
        musicBtn.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                isPlaying = false;
                document.documentElement.classList.remove('dark');
                document.body.classList.remove('music-active');
                if (musicStatus) musicStatus.textContent = 'OFF';
                localStorage.setItem('darkMode', 'false');
                
                // Reset all inline styles applied by visualizer
                resetVisualizerStyles();
            } else {
                audio.play().catch(err => console.log('Audio play error:', err));
                isPlaying = true;
                document.documentElement.classList.add('dark');
                document.body.classList.add('music-active');
                if (musicStatus) musicStatus.textContent = 'ON';
                localStorage.setItem('darkMode', 'true');
                
                // Initialize audio visualizer
                if (!audioContext) {
                    initAudioVisualizer(audio);
                }
            }
        });
    }
}

function resetVisualizerStyles() {
    // Reset body background to default (let Tailwind classes handle it)
    document.body.style.background = '';
    document.body.style.boxShadow = '';
    document.body.style.animation = '';
    
    // Reset music button
    const musicBtn = document.getElementById('musicToggle');
    if (musicBtn) {
        musicBtn.style.transform = '';
        musicBtn.style.filter = '';
        musicBtn.style.transition = '';
    }
    
    // Reset header
    const header = document.querySelector('header');
    if (header) {
        header.style.boxShadow = '';
        header.style.transition = '';
    }
    
    // Reset logo
    const logo = document.querySelector('header img');
    if (logo) {
        logo.style.filter = '';
        logo.style.transition = '';
    }
    
    // Reset primary elements and headings
    const primaryElements = document.querySelectorAll('.text-primary, .border-primary, .bg-primary, .text-blue-400, h1, h2, h3');
    primaryElements.forEach(el => {
        el.style.filter = '';
        el.style.transition = '';
    });
    
    // Reset cards
    const cards = document.querySelectorAll('.bg-white, .product-card');
    cards.forEach(card => {
        card.style.boxShadow = '';
        card.style.transition = '';
        card.style.transform = '';
    });
}

function initAudioVisualizer(audio) {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 256;
        
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        visualize();
    } catch (error) {
        console.log('Audio visualizer error:', error);
    }
}

function visualize() {
    if (!isPlaying) return;
    
    requestAnimationFrame(visualize);
    analyser.getByteFrequencyData(dataArray);
    
    // Enhanced bass detection with multiple frequency ranges
    const bassData = dataArray.slice(0, 20);
    const bassSum = bassData.reduce((a, b) => a + b, 0);
    const bassIntensity = Math.pow(bassSum / 20 / 255, 0.8); // Power curve for more dramatic response
    
    // Deep sub-bass (20-60Hz)
    const subBass = Math.pow(dataArray.slice(0, 5).reduce((a, b) => a + b, 0) / 5 / 255, 0.7);
    
    // Mid-bass (60-120Hz)
    const midBass = dataArray.slice(5, 15).reduce((a, b) => a + b, 0) / 10 / 255;
    
    // Mid-range (120-250Hz)
    const midRange = dataArray.slice(15, 30).reduce((a, b) => a + b, 0) / 15 / 255;
    
    // Treble for sparkle
    const treble = dataArray.slice(50, 80).reduce((a, b) => a + b, 0) / 30 / 255;
    
    // Average intensity
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const intensity = average / 255;
    
    document.documentElement.style.setProperty('--audio-intensity', intensity);
    document.documentElement.style.setProperty('--bass-intensity', bassIntensity);
    
    if (document.documentElement.classList.contains('dark')) {
        // Dynamic color based on frequency spectrum
        const hue = 200 + (bassIntensity * 100) - (treble * 20); // Blue to purple-pink
        const saturation = 50 + (bassIntensity * 50);
        const brightness = 2 + (subBass * 15); // Very dark base, explosive bass brightness
        
        // Create animated radial gradient background with bass pulse
        const centerGlow = 15 + (subBass * 35); // Glow size based on sub-bass
        const edgeGlow = 5 + (midBass * 15);
        
        document.body.style.background = `
            radial-gradient(ellipse at 50% 50%, 
                hsl(${hue}, ${saturation}%, ${brightness + centerGlow}%) 0%, 
                hsl(${hue + 20}, ${saturation - 10}%, ${brightness + edgeGlow}%) 15%,
                hsl(${hue}, ${saturation - 15}%, ${brightness}%) 40%,
                hsl(${hue - 10}, ${saturation - 20}%, ${Math.max(1, brightness - 2)}%) 70%,
                #000000 100%
            )
        `;
        
        // Add radial glow overlay effect on high bass
        if (bassIntensity > 0.4) {
            document.body.style.boxShadow = `inset 0 0 ${bassIntensity * 200}px ${bassIntensity * 100}px hsl(${hue}, 80%, 30%, ${bassIntensity * 0.4})`;
        } else {
            document.body.style.boxShadow = 'none';
        }
        
        // Music button - subtle glow only, no popping
        const musicBtn = document.getElementById('musicToggle');
        if (musicBtn && bassIntensity > 0.4) {
            const glowSize = 10 + (bassIntensity * 20);
            musicBtn.style.filter = `drop-shadow(0 0 ${glowSize}px hsl(${hue}, 80%, 50%, 0.3))`;
            musicBtn.style.transition = 'filter 0.1s ease-out';
        } else if (musicBtn) {
            musicBtn.style.filter = '';
        }
        
        // Pulse header with bass
        const header = document.querySelector('header');
        if (header && bassIntensity > 0.3) {
            header.style.boxShadow = `0 4px ${bassIntensity * 40}px hsl(${hue}, 70%, 50%, ${bassIntensity * 0.5})`;
            header.style.transition = 'box-shadow 0.05s ease-out';
        } else if (header) {
            header.style.boxShadow = '';
        }
        
        // Logo glow with treble
        const logo = document.querySelector('header img');
        if (logo && treble > 0.3) {
            logo.style.filter = `drop-shadow(0 0 ${treble * 15}px hsl(${hue + 40}, 90%, 60%, ${treble * 0.6}))`;
            logo.style.transition = 'filter 0.1s ease-out';
        } else if (logo) {
            logo.style.filter = '';
        }
        
        // Sync primary elements with mid-range
        if (midRange > 0.25) {
            const elements = document.querySelectorAll('.text-primary, .border-primary, .bg-primary, .text-blue-400, h1, h2, h3');
            elements.forEach(el => {
                el.style.filter = `drop-shadow(0 0 ${midRange * 15}px hsl(${hue}, 90%, 60%, ${midRange * 0.5}))`;
                el.style.transition = 'filter 0.08s ease-out';
            });
        }
        
        // Product cards pulse with bass
        if (bassIntensity > 0.3) {
            const cards = document.querySelectorAll('.bg-white, .product-card');
            cards.forEach(card => {
                if (card.closest('#cartSidebar') || card.closest('#checkoutModal')) return;
                card.style.boxShadow = `
                    0 0 ${bassIntensity * 30}px hsl(${hue}, 70%, 50%, ${bassIntensity * 0.4}),
                    0 0 ${bassIntensity * 15}px hsl(${hue + 30}, 80%, 60%, ${bassIntensity * 0.3})
                `;
                card.style.transform = `scale(${1 + bassIntensity * 0.02})`;
                card.style.transition = 'box-shadow 0.05s ease-out, transform 0.05s ease-out';
            });
        }
        
    } else {
        // Light mode - subtle effects
        const musicBtn = document.getElementById('musicToggle');
        if (musicBtn) {
            const scale = 1 + (intensity * 0.15);
            musicBtn.style.transform = `scale(${scale})`;
        }
    }
}

// Dark Mode Management (controlled by music button)
function initializeDarkMode() {
    // Do not auto-enable dark mode on load
    // Dark mode is only enabled when music plays
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode && isPlaying) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
    }
}

// Language Management
function initializeLanguage() {
    const html = document.documentElement;
    html.lang = currentLanguage;
    html.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    const langText = document.getElementById('langText');
    if (langText) {
        langText.textContent = currentLanguage === 'ar' ? 'EN' : 'AR';
    }
    updateTexts();
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'ar' ? 'en' : 'ar';
    localStorage.setItem('language', currentLanguage);
    initializeLanguage();
    renderProducts();
    updateCartUI();
}

function updateTexts() {
    const elements = document.querySelectorAll('[data-en][data-ar]');
    elements.forEach(el => {
        const text = currentLanguage === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = text;
        } else {
            el.textContent = text;
        }
    });
}

// Search functionality
let searchTerm = '';

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase();
            renderProducts(currentCategory);
            
            if (clearSearch) {
                clearSearch.classList.toggle('hidden', searchTerm === '');
            }
        });
    }
    
    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchTerm = '';
                clearSearch.classList.add('hidden');
                renderProducts(currentCategory);
            }
        });
    }
}

// Products Rendering
function renderProducts(category = 'all') {
    currentCategory = category;
    const grid = document.getElementById('productsGrid');
    if (!grid) {
        console.error('Products grid not found');
        return;
    }
    
    let filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    // Apply search filter
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
            p.nameAr.toLowerCase().includes(searchTerm) ||
            p.nameEn.toLowerCase().includes(searchTerm) ||
            p.descriptionAr.toLowerCase().includes(searchTerm) ||
            p.descriptionEn.toLowerCase().includes(searchTerm)
        );
    }
    
    console.log('Rendering products:', filteredProducts.length);
    
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image-container">
                <img src="${product.image}" alt="${currentLanguage === 'ar' ? product.nameAr : product.nameEn}" class="product-image">
                <div class="product-badge">${currentLanguage === 'ar' ? 'جديد' : 'New'}</div>
            </div>
            <div class="product-info">
                <h4 class="product-title">${currentLanguage === 'ar' ? product.nameAr : product.nameEn}</h4>
                <p class="product-description">${currentLanguage === 'ar' ? product.descriptionAr : product.descriptionEn}</p>
                <div class="product-price">${product.price.toLocaleString()} ${currentLanguage === 'ar' ? 'د.ع' : 'IQD'}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i>
                    <span>${currentLanguage === 'ar' ? 'أضف للسلة' : 'Add to Cart'}</span>
                </button>
            </div>
        </div>
    `).join('');
}

// Cart Management
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification(currentLanguage === 'ar' ? 'تمت الإضافة للسلة' : 'Added to cart');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    // Don't close cart, let user see the updated state
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            showNotification(currentLanguage === 'ar' ? 'تم إزالة المنتج' : 'Item removed', 'info');
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = `${totalPrice.toLocaleString()} ${currentLanguage === 'ar' ? 'د.ع' : 'IQD'}`;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>${currentLanguage === 'ar' ? 'السلة فارغة' : 'Cart is empty'}</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${currentLanguage === 'ar' ? item.nameAr : item.nameEn}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-title">${currentLanguage === 'ar' ? item.nameAr : item.nameEn}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()} ${currentLanguage === 'ar' ? 'د.ع' : 'IQD'}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" data-action="decrease" data-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase" data-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="remove-btn" data-action="remove" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Attach event listeners to cart buttons using event delegation
        cartItems.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                const action = btn.dataset.action;
                const id = parseInt(btn.dataset.id);
                
                if (action === 'decrease') {
                    updateQuantity(id, -1);
                } else if (action === 'increase') {
                    updateQuantity(id, 1);
                } else if (action === 'remove') {
                    removeFromCart(id);
                }
            });
        });
    }
}

// Cart Sidebar Toggle
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.classList.toggle('active');
}

// Checkout
function openCheckout() {
    if (cart.length === 0) {
        showNotification(currentLanguage === 'ar' ? 'السلة فارغة!' : 'Cart is empty!', 'error');
        return;
    }
    document.getElementById('checkoutModal').classList.remove('hidden');
    document.getElementById('checkoutModal').classList.add('flex');
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('flex');
    document.getElementById('checkoutModal').classList.add('hidden');
}

// Submit Order
function submitOrder(event) {
    event.preventDefault();
    
    console.log('=== ORDER SUBMISSION STARTED ===');
    console.log('Cart contents:', cart);
    
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerAddress = document.getElementById('customerAddress').value;
    
    console.log('Customer details:', { customerName, customerPhone, customerEmail, customerAddress });
    
    if (cart.length === 0) {
        console.error('Cart is empty!');
        showNotification('السلة فارغة!', 'error');
        return;
    }
    
    // Create order ID
    const orderId = 'order_' + Date.now();
    
    // Create order object with all details
    const order = {
        id: orderId,
        customer: {
            name: customerName,
            phone: customerPhone,
            email: customerEmail,
            address: customerAddress
        },
        items: cart.map(item => ({
            name: currentLanguage === 'ar' ? item.nameAr : item.nameEn,
            nameAr: item.nameAr,
            nameEn: item.nameEn,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity
        })),
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        orderDate: new Date().toLocaleString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US'),
        status: 'placed',
        statusHistory: [
            { status: 'placed', timestamp: Date.now(), label: 'Order Placed' }
        ],
        timestamp: Date.now()
    };
    
    console.log('Order object created:', order);
    
    // Get existing orders from localStorage
    let orders = JSON.parse(localStorage.getItem('storeOrders')) || [];
    console.log('Existing orders count:', orders.length);
    
    // Add new order to array
    orders.push(order);
    console.log('Orders after adding new one:', orders.length);
    
    // Save back to localStorage
    try {
        localStorage.setItem('storeOrders', JSON.stringify(orders));
        console.log('✅ Order saved to localStorage successfully!');
        
        // Verify it was saved
        const verifyOrders = JSON.parse(localStorage.getItem('storeOrders'));
        console.log('✅ Verification: Total orders in localStorage:', verifyOrders.length);
        console.log('✅ Last order ID:', verifyOrders[verifyOrders.length - 1].id);
    } catch (error) {
        console.error('❌ Error saving to localStorage:', error);
        showNotification('حدث خطأ في حفظ الطلب', 'error');
        return;
    }
    
    // Save customer phone for easy access to My Orders page
    localStorage.setItem('lastOrderPhone', customerPhone);
    
    // Track product sales for statistics
    updateProductSales(cart);
    
    console.log('=== ORDER SUBMISSION COMPLETED ===');
    
    // Show success and reset
    closeCheckout();
    showSuccessModal();
    cart = [];
    saveCart();
    updateCartUI();
    document.getElementById('checkoutForm').reset();
}

// Track product sales
function updateProductSales(cartItems) {
    let salesStats = JSON.parse(localStorage.getItem('productSales')) || {};
    
    cartItems.forEach(item => {
        if (!salesStats[item.id]) {
            salesStats[item.id] = {
                productId: item.id,
                nameAr: item.nameAr,
                nameEn: item.nameEn,
                totalSold: 0,
                revenue: 0
            };
        }
        salesStats[item.id].totalSold += item.quantity;
        salesStats[item.id].revenue += item.price * item.quantity;
    });
    
    localStorage.setItem('productSales', JSON.stringify(salesStats));
}

function createEmailBody(orderDetails) {
    let body = `=== ${currentLanguage === 'ar' ? 'طلب جديد' : 'New Order'} ===\n\n`;
    body += `${currentLanguage === 'ar' ? 'التاريخ' : 'Date'}: ${orderDetails.orderDate}\n\n`;
    body += `=== ${currentLanguage === 'ar' ? 'معلومات العميل' : 'Customer Information'} ===\n`;
    body += `${currentLanguage === 'ar' ? 'الاسم' : 'Name'}: ${orderDetails.customer.name}\n`;
    body += `${currentLanguage === 'ar' ? 'الهاتف' : 'Phone'}: ${orderDetails.customer.phone}\n`;
    body += `${currentLanguage === 'ar' ? 'البريد' : 'Email'}: ${orderDetails.customer.email}\n`;
    body += `${currentLanguage === 'ar' ? 'العنوان' : 'Address'}: ${orderDetails.customer.address}\n\n`;
    body += `=== ${currentLanguage === 'ar' ? 'المنتجات' : 'Products'} ===\n`;
    
    orderDetails.items.forEach((item, index) => {
        body += `${index + 1}. ${item.name}\n`;
        body += `   ${currentLanguage === 'ar' ? 'السعر' : 'Price'}: ${item.price} ${currentLanguage === 'ar' ? 'ريال' : 'SAR'}\n`;
        body += `   ${currentLanguage === 'ar' ? 'الكمية' : 'Quantity'}: ${item.quantity}\n`;
        body += `   ${currentLanguage === 'ar' ? 'المجموع' : 'Total'}: ${item.total} ${currentLanguage === 'ar' ? 'ريال' : 'SAR'}\n\n`;
    });
    
    body += `=== ${currentLanguage === 'ar' ? 'المجموع الكلي' : 'Grand Total'} ===\n`;
    body += `${orderDetails.totalAmount} ${currentLanguage === 'ar' ? 'ريال' : 'SAR'}`;
    
    return body;
}

function sendViaMailto(emailBody) {
    const subject = encodeURIComponent(currentLanguage === 'ar' ? 'طلب جديد من الموقع' : 'New Order from Website');
    const body = encodeURIComponent(emailBody);
    const mailtoLink = `mailto:${CONFIG.yourEmail}?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
}

async function sendEmailJS(orderDetails) {
    // This requires EmailJS library and setup
    // Include this in HTML: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    if (typeof emailjs !== 'undefined') {
        const templateParams = {
            to_email: CONFIG.yourEmail,
            customer_name: orderDetails.customer.name,
            customer_phone: orderDetails.customer.phone,
            customer_email: orderDetails.customer.email,
            customer_address: orderDetails.customer.address,
            order_items: orderDetails.items.map(item => 
                `${item.name} x${item.quantity} = ${item.total} SAR`
            ).join('\n'),
            total_amount: orderDetails.totalAmount,
            order_date: orderDetails.orderDate
        };
        
        await emailjs.send(
            CONFIG.emailServiceId,
            CONFIG.emailTemplateId,
            templateParams,
            CONFIG.emailUserId
        );
    }
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    toggleCart();
    
    // Show follow your order message
    const message = currentLanguage === 'ar' 
        ? 'تم إرسال طلبك بنجاح! تابع طلبك من صفحة "طلباتي".' 
        : 'Your order has been submitted successfully! Track your order from "My Orders" page.';
    showNotification(message, 'success');
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('flex');
    document.getElementById('successModal').classList.add('hidden');
}

// Notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-24 ${currentLanguage === 'ar' ? 'right' : 'left'}-4 bg-${type === 'success' ? 'green' : 'red'}-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slideInRight`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Category Filter
function filterCategory(category) {
    currentCategory = category;
    renderProducts(category);
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
}

// Event Listeners
function attachEventListeners() {
    const langToggleBtn = document.getElementById('langToggle');
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const closeCheckoutBtn = document.getElementById('closeCheckout');
    const checkoutForm = document.getElementById('checkoutForm');
    const closeSuccessBtn = document.getElementById('closeSuccess');
    
    if (langToggleBtn) langToggleBtn.addEventListener('click', toggleLanguage);
    if (cartBtn) cartBtn.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckout);
    if (checkoutForm) checkoutForm.addEventListener('submit', submitOrder);
    if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeSuccessModal);
    
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => filterCategory(btn.dataset.category));
    });
    
    // Close cart when clicking outside
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar) {
        document.addEventListener('click', (e) => {
            const cartBtn = document.getElementById('cartBtn');
            // Don't close if clicking inside the cart (including buttons)
            // Don't close if clicking the cart button
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                !e.target.closest('#cartSidebar') &&
                cartBtn && !cartBtn.contains(e.target)) {
                toggleCart();
            }
        });
    }
}

// ============================================
// AI IMAGE TO 3D CONVERTER FUNCTIONALITY
// ============================================

function initializeAIConverter() {
    const uploadArea = document.getElementById('uploadArea');
    const imageUpload = document.getElementById('imageUpload');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const removeImage = document.getElementById('removeImage');
    const convertBtn = document.getElementById('convertBtn');
    const downloadModel = document.getElementById('downloadModel');
    const orderCustomModel = document.getElementById('orderCustomModel');
    
    // Only initialize if AI converter elements exist (on converter page)
    if (!uploadArea || !imageUpload) {
        return;
    }
    
    // Click to upload
    console.log('Upload area initialized');
    uploadArea.addEventListener('click', (e) => {
        console.log('Upload area clicked', e.target);
        // Don't trigger if clicking on the remove button
        if (e.target.id === 'removeImage' || e.target.closest('#removeImage')) {
            console.log('Clicked on remove button, ignoring');
            return;
        }
        
        if (!imagePreview.classList.contains('hidden')) {
            console.log('Image preview visible, ignoring click');
            return;
        }
        
        console.log('Triggering file input click');
        imageUpload.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('border-accent', 'bg-orange-50');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('border-accent', 'bg-orange-50');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('border-accent', 'bg-orange-50');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
    });
    
    // File input change
    imageUpload.addEventListener('change', (e) => {
        console.log('File input changed', e.target.files);
        const file = e.target.files[0];
        if (file) {
            console.log('File selected:', file.name, file.type, file.size);
            handleImageUpload(file);
        } else {
            console.log('No file selected');
        }
    });
    
    // Remove image
    if (removeImage) {
        removeImage.addEventListener('click', (e) => {
            e.stopPropagation();
            resetUpload();
        });
    }
    
    // Convert button
    if (convertBtn) {
        console.log('Convert button found, attaching event listener');
        convertBtn.addEventListener('click', (e) => {
            console.log('Convert button clicked!');
            e.preventDefault();
            convertImageTo3D();
        });
    } else {
        console.log('Convert button not found');
    }
    
    // Download model
    if (downloadModel) {
        console.log('Download button found, attaching event listener');
        downloadModel.addEventListener('click', (e) => {
            console.log('Download button clicked!');
            e.preventDefault();
            downloadSTLFile();
        });
    }
    
    // Order custom model
    if (orderCustomModel) {
        console.log('Order button found, attaching event listener');
        orderCustomModel.addEventListener('click', (e) => {
            console.log('Order button clicked!');
            e.preventDefault();
            orderCustomPrint();
        });
    }
}

function handleImageUpload(file) {
    console.log('handleImageUpload called with file:', file.name);
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        console.log('File too large:', file.size);
        showNotification(
            currentLanguage === 'ar' ? 'حجم الملف كبير جداً (الحد الأقصى 10 ميجا)' : 'File too large (max 10MB)',
            'error'
        );
        return;
    }
    
    // Store the file object for backend upload
    uploadedImageFile = file;
    console.log('File stored in uploadedImageFile');
    
    // Read and display image preview
    const reader = new FileReader();
    reader.onload = (e) => {
        console.log('File read complete, displaying preview');
        uploadedImage = e.target.result;
        document.getElementById('previewImg').src = uploadedImage;
        document.getElementById('uploadPlaceholder').classList.add('hidden');
        document.getElementById('imagePreview').classList.remove('hidden');
        showNotification(
            currentLanguage === 'ar' ? 'تم رفع الصورة بنجاح!' : 'Image uploaded successfully!',
            'success'
        );
    };
    reader.readAsDataURL(file);
    console.log('Started reading file');
}

function resetUpload() {
    uploadedImage = null;
    uploadedImageFile = null;
    document.getElementById('imageUpload').value = '';
    document.getElementById('uploadPlaceholder').classList.remove('hidden');
    document.getElementById('imagePreview').classList.add('hidden');
    resetResultArea();
}

function resetResultArea() {
    document.getElementById('waitingState').classList.remove('hidden');
    document.getElementById('processingState').classList.add('hidden');
    document.getElementById('successState').classList.add('hidden');
}

async function convertImageTo3D() {
    console.log('convertImageTo3D called');
    console.log('uploadedImageFile:', uploadedImageFile);
    console.log('uploadedImage:', uploadedImage ? 'exists' : 'null');
    
    if (!uploadedImageFile && !uploadedImage) {
        console.log('No image uploaded');
        showNotification(
            currentLanguage === 'ar' ? 'الرجاء رفع صورة أولاً' : 'Please upload an image first',
            'error'
        );
        return;
    }
    
    const modelType = document.getElementById('modelType').value;
    const modelSize = document.getElementById('modelSize').value;
    console.log('Model type:', modelType, 'Size:', modelSize);
    
    // Show processing state
    document.getElementById('waitingState').classList.add('hidden');
    document.getElementById('processingState').classList.remove('hidden');
    document.getElementById('successState').classList.add('hidden');
    
    try {
        // Check if backend is available or use demo mode
        if (CONFIG.demoMode || window.location.hostname !== 'localhost') {
            await simulateAIProcessing();
        } else {
            // Real API call with backend server
            await callAIAPI(uploadedImageFile);
        }
        
        // Show success state
        document.getElementById('processingState').classList.add('hidden');
        document.getElementById('successState').classList.remove('hidden');
        
        // Load and display 3D model
        if (currentModelData && currentModelData.glbUrl) {
            try {
                await load3DModel(currentModelData.glbUrl);
            } catch (viewerError) {
                console.warn('3D viewer error (model still available for download):', viewerError);
                // Model is still downloadable even if viewer fails
            }
        }
        
        showNotification(
            currentLanguage === 'ar' ? 'تم إنشاء النموذج بنجاح!' : '3D model created successfully!',
            'success'
        );
        
    } catch (error) {
        console.error('Conversion error:', error);
        showNotification(
            currentLanguage === 'ar' ? `خطأ: ${error.message}` : `Error: ${error.message}`,
            'error'
        );
        resetResultArea();
    }
}

async function callAIAPI(imageFile) {
    // Upload image to backend server
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Step 1: Upload image to backend and create task
    const createResponse = await fetch(`${CONFIG.backendUrl}/api/convert-to-3d`, {
        method: 'POST',
        body: formData
    });
    
    if (!createResponse.ok) {
        const error = await createResponse.json();
        throw new Error(error.error || 'Failed to upload image');
    }
    
    const taskData = await createResponse.json();
    const taskId = taskData.taskId;
    
    console.log('3D Conversion Task Created:', taskId);
    
    // Step 2: Poll for completion
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max (5 second intervals)
    
    while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, CONFIG.pollInterval));
        
        const statusResponse = await fetch(`${CONFIG.backendUrl}/api/task-status/${taskId}`);
        
        if (!statusResponse.ok) {
            throw new Error('Status check failed');
        }
        
        const status = await statusResponse.json();
        console.log('Status:', status.status, '- Progress:', status.progress || 0);
        
        // Update progress display
        updateProgressDisplay(status.progress || 0);
        
        if (status.status === 'SUCCEEDED') {
            currentModelData = {
                modelUrl: status.model_urls?.glb || status.model_urls?.fbx,
                glbUrl: status.model_urls?.glb,
                fbxUrl: status.model_urls?.fbx,
                thumbnailUrl: status.thumbnail_url,
                format: 'glb',
                taskId: taskId
            };
            return currentModelData;
        }
        
        if (status.status === 'FAILED') {
            throw new Error('Model generation failed');
        }
        
        attempts++;
    }
    
    throw new Error('Timeout: Model generation took too long');
}

async function simulateAIProcessing() {
    // Simulate AI processing delay with progress updates
    return new Promise((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            updateProgressDisplay(progress);
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 300);
        
        setTimeout(() => {
            // Use a demo 3D model URL (a simple cube GLB file)
            currentModelData = {
                modelUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb',
                glbUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb',
                format: 'glb',
                size: document.getElementById('modelSize').value,
                type: document.getElementById('modelType').value,
                isDemo: true
            };
            resolve();
        }, 3000); // 3 seconds for demo
    });
}

function updateProgressDisplay(progress) {
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = `${Math.round(progress)}%`;
    }
}

function downloadSTLFile() {
    if (!currentModelData) {
        showNotification(
            currentLanguage === 'ar' ? 'لا يوجد نموذج للتحميل' : 'No model to download',
            'error'
        );
        return;
    }
    
    // Show demo mode message
    if (currentModelData.isDemo) {
        showNotification(
            currentLanguage === 'ar' ? 'هذا نموذج تجريبي. للحصول على نموذج حقيقي، يرجى التواصل معنا.' : 'This is a demo model. For real conversion, please contact us.',
            'info'
        );
    }
    
    // Download GLB model from Meshy AI
    if (currentModelData.glbUrl) {
        const link = document.createElement('a');
        link.href = currentModelData.glbUrl;
        link.download = `3d-model-${Date.now()}.glb`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification(
            currentLanguage === 'ar' ? 'جاري تحميل النموذج...' : 'Downloading model...',
            'success'
        );
    } else if (currentModelData.fbxUrl) {
        // Fallback to FBX if GLB not available
        window.open(currentModelData.fbxUrl, '_blank');
    } else {
        showNotification(
            currentLanguage === 'ar' ? 'رابط التحميل غير متوفر' : 'Download link not available',
            'error'
        );
    }
}

function createDemoSTL() {
    // Create a simple ASCII STL file for a cube (demo purposes)
    return `solid cube
  facet normal 0 0 1
    outer loop
      vertex 0 0 10
      vertex 10 0 10
      vertex 10 10 10
    endloop
  endfacet
  facet normal 0 0 1
    outer loop
      vertex 0 0 10
      vertex 10 10 10
      vertex 0 10 10
    endloop
  endfacet
  facet normal 0 0 -1
    outer loop
      vertex 0 0 0
      vertex 10 10 0
      vertex 10 0 0
    endloop
  endfacet
  facet normal 0 0 -1
    outer loop
      vertex 0 0 0
      vertex 0 10 0
      vertex 10 10 0
    endloop
  endfacet
endsolid cube`;
}

function orderCustomPrint() {
    if (!currentModelData) {
        showNotification(
            currentLanguage === 'ar' ? 'لا يوجد نموذج للطلب' : 'No model to order',
            'error'
        );
        return;
    }
    
    // Create custom order item
    const customProduct = {
        id: Date.now(),
        nameAr: 'تصميم مخصص من الذكاء الاصطناعي',
        nameEn: 'Custom AI-Generated Design',
        descriptionAr: `نموذج مخصص - ${document.getElementById('modelType').value} - ${document.getElementById('modelSize').value} سم`,
        descriptionEn: `Custom model - ${document.getElementById('modelType').value} - ${document.getElementById('modelSize').value} cm`,
        price: calculateCustomPrice(),
        image: uploadedImage || 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400',
        category: 'custom',
        quantity: 1
    };
    
    cart.push(customProduct);
    saveCart();
    updateCartUI();
    toggleCart();
    
    showNotification(
        currentLanguage === 'ar' ? 'تمت إضافة التصميم المخصص للسلة!' : 'Custom design added to cart!',
        'success'
    );
    
    // Scroll to cart
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function calculateCustomPrice() {
    const modelType = document.getElementById('modelType').value;
    const modelSize = parseInt(document.getElementById('modelSize').value);
    
    // Base prices in Iraqi Dinar
    const basePrices = {
        figure: 80000,
        relief: 60000,
        lithophane: 48000,
        keychain: 32000
    };
    
    const basePrice = basePrices[modelType] || 150;
    
    // Size multiplier (every 5cm adds 20%)
    const sizeMultiplier = 1 + (Math.floor(modelSize / 5) * 0.2);
    
    return Math.round(basePrice * sizeMultiplier);
}

// Progress Display
function updateProgressDisplay(progress) {
    const processingState = document.getElementById('processingState');
    let progressText = processingState.querySelector('.progress-text');
    
    if (!progressText) {
        progressText = document.createElement('div');
        progressText.className = 'progress-text mt-4';
        processingState.appendChild(progressText);
    }
    
    const percentage = Math.round(progress);
    progressText.innerHTML = `
        <div class="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div class="bg-primary h-4 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
        </div>
        <p class="text-sm text-gray-600">${percentage}% ${currentLanguage === 'ar' ? 'مكتمل' : 'Complete'}</p>
    `;
}

// 3D Model Viewer using Three.js
let scene, camera, renderer, controls, currentModel;

async function load3DModel(modelUrl) {
    return new Promise(async (resolve, reject) => {
        try {
            const canvas = document.getElementById('model3dCanvas');
            const container = canvas.parentElement;
            
            // Dynamic import of Three.js modules
            const THREE = await import('three');
            const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
            const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
            
            // Initialize Three.js scene
            scene = new THREE.Scene();
            const isDark = document.documentElement.classList.contains('dark');
            scene.background = new THREE.Color(isDark ? 0x1f2937 : 0xf0f0f0);
            
            // Camera
            const width = container.clientWidth;
            const height = container.clientWidth; // Square aspect ratio
            camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
            camera.position.set(0, 0, 5);
            
            // Renderer
            renderer = new THREE.WebGLRenderer({ 
                canvas: canvas,
                antialias: true,
                alpha: true 
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
            
            // Lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);
            
            const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight1.position.set(5, 5, 5);
            scene.add(directionalLight1);
            
            const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
            directionalLight2.position.set(-5, -5, -5);
            scene.add(directionalLight2);
            
            // Controls
            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 2;
            
            // Load GLB Model
            const loader = new GLTFLoader();
            loader.load(
                modelUrl,
                (gltf) => {
                    currentModel = gltf.scene;
                    
                    // Center and scale model
                    const box = new THREE.Box3().setFromObject(currentModel);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());
                    
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const scale = 2 / maxDim;
                    currentModel.scale.multiplyScalar(scale);
                    
                    currentModel.position.sub(center.multiplyScalar(scale));
                    
                    scene.add(currentModel);
                    
                    // Animation loop
                    function animate() {
                        requestAnimationFrame(animate);
                        controls.update();
                        renderer.render(scene, camera);
                    }
                    animate();
                    
                    resolve();
                },
                (progress) => {
                    if (progress.total > 0) {
                        console.log('Loading model:', (progress.loaded / progress.total * 100).toFixed(0) + '%');
                    }
                },
                (error) => {
                    console.error('Error loading model:', error);
                    reject(error);
                }
            );
            
            // Handle window resize
            window.addEventListener('resize', () => {
                const newWidth = container.clientWidth;
                camera.aspect = 1;
                camera.updateProjectionMatrix();
                renderer.setSize(newWidth, newWidth);
            });
        } catch (error) {
            console.error('3D viewer initialization error:', error);
            reject(error);
        }
    });
}

// Make functions globally accessible
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
