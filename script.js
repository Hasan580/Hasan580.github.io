// ========================================
// DATA STORAGE
// ========================================
class DataStore {
    constructor(useFirebase = false) {
        this.useFirebase = useFirebase && typeof FirebaseDataStore !== 'undefined';
        
        if (this.useFirebase) {
            this.firebaseStore = new FirebaseDataStore();
            this.products = [];
            this.orders = [];
            console.log('Using Firebase for data storage');
        } else {
            this.products = this.loadData('products') || [];
            this.orders = this.loadData('orders') || [];
            this.initializeSampleData();
            console.log('Using localStorage for data storage');
        }
    }

    loadData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading data:', e);
            return null;
        }
    }

    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving data:', e);
        }
    }

    initializeSampleData() {
        if (this.products.length === 0) {
            this.products = [
                {
                    id: 1,
                    name: 'Floral Summer Dress',
                    category: 'Dresses',
                    price: 45.99,
                    stock: 15,
                    sales: 28,
                    image: '',
                    description: 'Beautiful floral print summer dress, perfect for casual outings'
                },
                {
                    id: 2,
                    name: 'Elegant Silk Blouse',
                    category: 'Tops',
                    price: 32.50,
                    stock: 22,
                    sales: 35,
                    image: '',
                    description: 'Luxurious silk blouse available in multiple colors'
                },
                {
                    id: 3,
                    name: 'High-Waist Jeans',
                    category: 'Bottoms',
                    price: 54.99,
                    stock: 8,
                    sales: 42,
                    image: '',
                    description: 'Comfortable high-waist denim jeans with stretch'
                },
                {
                    id: 4,
                    name: 'Leather Jacket',
                    category: 'Outerwear',
                    price: 89.99,
                    stock: 5,
                    sales: 18,
                    image: '',
                    description: 'Classic leather jacket for a stylish look'
                }
            ];
            this.saveProducts();
        }

        if (this.orders.length === 0) {
            this.orders = [
                {
                    id: 1001,
                    date: new Date().toISOString(),
                    customerName: 'Sarah Johnson',
                    customerPhone: '+1234567890',
                    productId: 2,
                    productName: 'Elegant Silk Blouse',
                    quantity: 2,
                    amount: 65.00,
                    status: 'delivered',
                    address: '123 Main St, New York, NY 10001'
                },
                {
                    id: 1002,
                    date: new Date().toISOString(),
                    customerName: 'Emily Davis',
                    customerPhone: '+1234567891',
                    productId: 3,
                    productName: 'High-Waist Jeans',
                    quantity: 1,
                    amount: 54.99,
                    status: 'shipped',
                    address: '456 Oak Ave, Los Angeles, CA 90001'
                },
                {
                    id: 1003,
                    date: new Date().toISOString(),
                    customerName: 'Jessica Williams',
                    customerPhone: '+1234567892',
                    productId: 1,
                    productName: 'Floral Summer Dress',
                    quantity: 1,
                    amount: 45.99,
                    status: 'pending',
                    address: '789 Pine Rd, Chicago, IL 60601'
                }
            ];
            this.saveOrders();
        }
    }

    saveProducts() {
        this.saveData('products', this.products);
    }

    saveOrders() {
        this.saveData('orders', this.orders);
    }

    async getProducts() {
        if (this.useFirebase) {
            this.products = await this.firebaseStore.getProducts();
        }
        return this.products;
    }

    async getOrders() {
        if (this.useFirebase) {
            this.orders = await this.firebaseStore.getOrders();
        }
        return this.orders;
    }

    async addProduct(product) {
        if (this.useFirebase) {
            const result = await this.firebaseStore.addProduct(product);
            if (result.success) {
                product.id = result.id;
                this.products.unshift(product);
                return product;
            }
            return null;
        } else {
            product.id = Date.now();
            product.sales = 0;
            this.products.push(product);
            this.saveProducts();
            return product;
        }
    }

    async updateProduct(id, updatedProduct) {
        if (this.useFirebase) {
            const result = await this.firebaseStore.updateProduct(id, updatedProduct);
            if (result.success) {
                const index = this.products.findIndex(p => p.id === id);
                if (index !== -1) {
                    this.products[index] = { ...this.products[index], ...updatedProduct };
                }
                return this.products[index];
            }
            return null;
        } else {
            const index = this.products.findIndex(p => p.id === id);
            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...updatedProduct };
                this.saveProducts();
                return this.products[index];
            }
            return null;
        }
    }

    async deleteProduct(id) {
        if (this.useFirebase) {
            await this.firebaseStore.deleteProduct(id);
        }
        this.products = this.products.filter(p => p.id !== id);
        if (!this.useFirebase) {
            this.saveProducts();
        }
    }

    async addOrder(order) {
        if (this.useFirebase) {
            const result = await this.firebaseStore.addOrder(order);
            if (result.success) {
                order.id = result.id;
                this.orders.unshift(order);
                
                // Update local product cache
                const product = this.products.find(p => p.id === order.productId);
                if (product) {
                    product.sales += order.quantity;
                    product.stock -= order.quantity;
                }
                
                return order;
            }
            return null;
        } else {
            order.id = 1000 + this.orders.length + 1;
            order.date = new Date().toISOString();
            this.orders.unshift(order);
            
            const product = this.products.find(p => p.id === order.productId);
            if (product) {
                product.sales += order.quantity;
                product.stock -= order.quantity;
                this.saveProducts();
            }
            
            this.saveOrders();
            return order;
        }
    }

    async updateOrder(id, updatedOrder) {
        if (this.useFirebase) {
            const result = await this.firebaseStore.updateOrder(id, updatedOrder);
            if (result.success) {
                const index = this.orders.findIndex(o => o.id === id);
                if (index !== -1) {
                    this.orders[index] = { ...this.orders[index], ...updatedOrder };
                }
                return this.orders[index];
            }
            return null;
        } else {
            const index = this.orders.findIndex(o => o.id === id);
            if (index !== -1) {
                this.orders[index] = { ...this.orders[index], ...updatedOrder };
                this.saveOrders();
                return this.orders[index];
            }
            return null;
        }
    }

    async deleteOrder(id) {
        if (this.useFirebase) {
            await this.firebaseStore.deleteOrder(id);
        }
        this.orders = this.orders.filter(o => o.id !== id);
        if (!this.useFirebase) {
            this.saveOrders();
        }
    }

    setupRealtimeListeners(onProductsChange, onOrdersChange) {
        if (this.useFirebase && this.firebaseStore) {
            this.firebaseStore.onProductsChange((products) => {
                this.products = products;
                onProductsChange(products);
            });
            
            this.firebaseStore.onOrdersChange((orders) => {
                this.orders = orders;
                onOrdersChange(orders);
            });
        }
    }
}

// ========================================
// DASHBOARD APP
// ========================================
class DashboardApp {
    constructor() {
        // Check if Firebase is available
        const useFirebase = typeof firebase !== 'undefined' && typeof FirebaseDataStore !== 'undefined';
        this.dataStore = new DataStore(useFirebase);
        this.currentPage = 'dashboard';
        this.currentEditProduct = null;
        this.currentEditOrder = null;
        this.currentLanguage = 'en';
        this.currentUser = null;
        this.checkAuth();
    }

    checkAuth() {
        const userSession = sessionStorage.getItem('currentUser');
        if (!userSession) {
            window.location.href = 'dashboard.html';
            return;
        }
        this.currentUser = JSON.parse(userSession);
        
        // Initialize immediately - Firebase auth is optional
        setTimeout(() => {
            this.init();
        }, 100);
    }

    async init() {
        this.setupUserInfo();
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupModals();
        this.setupForms();
        this.setupLanguageToggle();
        this.setupInlineEditing();
        this.setupLogout();
        this.applyPermissions();
        
        // Setup real-time listeners if using Firebase
        if (this.dataStore.useFirebase) {
            this.dataStore.setupRealtimeListeners(
                (products) => {
                    if (this.currentPage === 'products') this.renderProducts();
                    if (this.currentPage === 'dashboard') this.renderDashboard();
                    if (this.currentPage === 'analytics') this.renderAnalytics();
                },
                (orders) => {
                    if (this.currentPage === 'orders') this.renderOrders();
                    if (this.currentPage === 'dashboard') this.renderDashboard();
                    if (this.currentPage === 'analytics') this.renderAnalytics();
                }
            );
        }
        
        await this.renderDashboard();
        await this.renderProducts();
        await this.renderOrders();
        await this.renderAnalytics();
    }

    setupUserInfo() {
        // Add user info to sidebar
        const sidebar = document.getElementById('sidebar');
        const userInfoHTML = `
            <div class="user-info-sidebar">
                <i class="fas fa-user-circle"></i>
                <div class="user-details">
                    <strong>${this.currentUser.name}</strong>
                    <span>${this.currentUser.role === 'admin' ? 'Administrator' : 'User'}</span>
                </div>
                <button class="btn-logout" id="logoutBtn" title="Logout">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        `;
        sidebar.insertAdjacentHTML('beforeend', userInfoHTML);
    }

    setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to logout?')) {
                    sessionStorage.removeItem('currentUser');
                    window.location.href = 'login.html';
                }
            });
        }
    }

    applyPermissions() {
        if (this.currentUser.role !== 'admin') {
            // Hide product management for non-admin users
            const addProductBtn = document.getElementById('addProductBtn');
            if (addProductBtn) {
                addProductBtn.style.display = 'none';
            }

            // Disable editing and deleting products
            this.hideAdminFeatures();
        }
    }

    hideAdminFeatures() {
        // This will be applied when rendering tables
        this.isAdminMode = false;
    }

    // ========================================
    // NAVIGATION
    // ========================================
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateToPage(page);
                
                // Close mobile menu
                if (window.innerWidth <= 768) {
                    document.getElementById('sidebar').classList.remove('active');
                }
            });
        });
    }

    navigateToPage(page) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Show page
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        document.getElementById(page).classList.add('active');

        this.currentPage = page;

        // Refresh data
        if (page === 'dashboard') this.renderDashboard();
        if (page === 'products') this.renderProducts();
        if (page === 'orders') this.renderOrders();
        if (page === 'analytics') this.renderAnalytics();
    }

    setupMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');

        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }

    // ========================================
    // LANGUAGE TOGGLE
    // ========================================
    setupLanguageToggle() {
        const langToggle = document.getElementById('langToggle');
        const langToggleMobile = document.getElementById('langToggleMobile');

        const toggleLanguage = () => {
            this.currentLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
            document.body.classList.toggle('rtl', this.currentLanguage === 'ar');
            this.updateLanguage();
        };

        if (langToggle) {
            langToggle.addEventListener('click', toggleLanguage);
        }
        if (langToggleMobile) {
            langToggleMobile.addEventListener('click', toggleLanguage);
        }
    }

    updateLanguage() {
        const elements = document.querySelectorAll('[data-en][data-ar]');
        elements.forEach(el => {
            const text = this.currentLanguage === 'en' ? el.dataset.en : el.dataset.ar;
            el.textContent = text;
        });

        // Update language toggle button text
        const langText = document.querySelectorAll('.lang-text');
        langText.forEach(el => {
            el.textContent = this.currentLanguage === 'en' ? 'العربية' : 'EN';
        });

        // Re-render pages to apply translations
        if (this.currentPage === 'dashboard') this.renderDashboard();
        if (this.currentPage === 'products') this.renderProducts();
        if (this.currentPage === 'orders') this.renderOrders();
        if (this.currentPage === 'analytics') this.renderAnalytics();
    }

    // ========================================
    // INLINE EDITING
    // ========================================
    setupInlineEditing() {
        // This will be called after rendering tables
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('editable')) {
                this.startInlineEdit(e.target);
            }
        });
    }

    startInlineEdit(element) {
        // Check if user has permission
        if (this.currentUser.role !== 'admin' && element.dataset.type === 'product') {
            alert('Only administrators can edit products');
            return;
        }

        const field = element.dataset.field;
        const id = parseInt(element.dataset.id);
        const type = element.dataset.type;
        const currentValue = element.dataset.value || element.textContent.trim();

        element.classList.add('editing');

        let inputElement;
        
        if (field === 'status') {
            // Create select for status
            inputElement = document.createElement('select');
            inputElement.className = 'inline-edit-select';
            const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
            statuses.forEach(status => {
                const option = document.createElement('option');
                option.value = status;
                option.textContent = status.charAt(0).toUpperCase() + status.slice(1);
                option.selected = status === currentValue.toLowerCase();
                inputElement.appendChild(option);
            });
        } else {
            // Create input for other fields
            inputElement = document.createElement('input');
            inputElement.className = 'inline-edit-input';
            inputElement.value = currentValue.replace('$', '');
            inputElement.type = field === 'price' || field === 'stock' || field === 'quantity' ? 'number' : 'text';
            if (field === 'price') inputElement.step = '0.01';
        }

        const originalContent = element.innerHTML;
        element.innerHTML = '';
        element.appendChild(inputElement);
        inputElement.focus();

        const saveEdit = () => {
            const newValue = inputElement.value;
            element.classList.remove('editing');

            if (type === 'product') {
                this.updateProductField(id, field, newValue);
            } else if (type === 'order') {
                this.updateOrderField(id, field, newValue);
            }

            element.removeChild(inputElement);
        };

        const cancelEdit = () => {
            element.classList.remove('editing');
            element.innerHTML = originalContent;
        };

        inputElement.addEventListener('blur', saveEdit);
        inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') saveEdit();
            if (e.key === 'Escape') cancelEdit();
        });
    }

    updateProductField(id, field, value) {
        const product = this.dataStore.getProducts().find(p => p.id === id);
        if (!product) return;

        if (field === 'price') {
            product.price = parseFloat(value);
        } else if (field === 'stock') {
            product.stock = parseInt(value);
        }

        this.dataStore.updateProduct(id, product);
        this.renderProducts();
        this.renderDashboard();
    }

    updateOrderField(id, field, value) {
        const order = this.dataStore.getOrders().find(o => o.id === id);
        if (!order) return;

        if (field === 'status') {
            order.status = value;
        } else if (field === 'quantity') {
            order.quantity = parseInt(value);
            const product = this.dataStore.getProducts().find(p => p.id === order.productId);
            if (product) {
                order.amount = product.price * order.quantity;
            }
        }

        this.dataStore.updateOrder(id, order);
        this.renderOrders();
        this.renderDashboard();
    }

    // ========================================
    // DASHBOARD
    // ========================================
    async renderDashboard() {
        const products = await this.dataStore.getProducts();
        const orders = await this.dataStore.getOrders();

        // Update stats
        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('totalOrders').textContent = orders.length;
        
        const revenue = orders.reduce((sum, order) => 
            order.status !== 'cancelled' ? sum + order.amount : sum, 0
        );
        document.getElementById('totalRevenue').textContent = `$${revenue.toFixed(2)}`;
        
        const pending = orders.filter(o => o.status === 'pending').length;
        document.getElementById('pendingOrders').textContent = pending;

        // Recent orders
        this.renderRecentOrders(orders.slice(0, 5));

        // Top products
        this.renderTopProducts(products);
    }

    renderRecentOrders(orders) {
        const tbody = document.getElementById('recentOrdersBody');
        
        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No orders yet</td></tr>';
            return;
        }

        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.productName}</td>
                <td>$${order.amount.toFixed(2)}</td>
                <td><span class="badge badge-${order.status}">${order.status}</span></td>
            </tr>
        `).join('');
    }

    renderTopProducts(products) {
        const topProducts = [...products]
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);

        const container = document.getElementById('topProductsList');

        if (topProducts.length === 0 || topProducts[0].sales === 0) {
            container.innerHTML = '<p class="empty-state">No sales data available</p>';
            return;
        }

        container.innerHTML = topProducts.map((product, index) => `
            <div class="top-product-item">
                <div class="top-product-rank">${index + 1}</div>
                <div class="top-product-details">
                    <h4>${product.name}</h4>
                    <p>${product.category}</p>
                </div>
                <div class="top-product-sales">
                    <div class="sales-count">${product.sales}</div>
                    <div class="sales-label">Sales</div>
                </div>
            </div>
        `).join('');
    }

    // ========================================
    // PRODUCTS
    // ========================================
    async renderProducts() {
        const products = await this.dataStore.getProducts();
        const tbody = document.getElementById('productsTableBody');

        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state">No products yet. Add your first product!</td></tr>';
            return;
        }

        const isAdmin = this.currentUser && this.currentUser.role === 'admin';

        tbody.innerHTML = products.map(product => {
            const stockStatus = product.stock === 0 ? 'out-of-stock' : 
                               product.stock < 10 ? 'low-stock' : 'in-stock';
            const stockText = product.stock === 0 ? 'Out of Stock' : 
                            product.stock < 10 ? `Low (${product.stock})` : product.stock;

            return `
                <tr>
                    <td>
                        ${product.image ? 
                            `<img src="${product.image}" alt="${product.name}" class="product-img">` :
                            `<div class="product-img-placeholder"><i class="fas fa-tshirt"></i></div>`
                        }
                    </td>
                    <td><strong>${product.name}</strong></td>
                    <td>${product.category}</td>
                    <td>
                        <span class="${isAdmin ? 'editable' : ''}" 
                              ${isAdmin ? `data-field="price" 
                              data-id="${product.id}" 
                              data-type="product"
                              data-value="${product.price}"
                              title="Click to edit"` : ''}>
                            $${product.price.toFixed(2)}
                        </span>
                    </td>
                    <td class="stock-status ${stockStatus}">
                        <span class="${isAdmin ? 'editable' : ''}" 
                              ${isAdmin ? `data-field="stock" 
                              data-id="${product.id}" 
                              data-type="product"
                              data-value="${product.stock}"
                              title="Click to edit"` : ''}>
                            ${stockText}
                        </span>
                    </td>
                    <td>${product.sales}</td>
                    <td>
                        ${isAdmin ? `
                        <button class="btn btn-sm btn-secondary" onclick="app.editProduct(${product.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                        ` : '<span class="text-muted">View Only</span>'}
                    </td>
                </tr>
            `;
        }).join('');
    }

    editProduct(id) {
        if (this.currentUser.role !== 'admin') {
            alert('Only administrators can edit products');
            return;
        }

        const product = this.dataStore.getProducts().find(p => p.id === id);
        if (!product) return;

        this.currentEditProduct = product;
        
        document.getElementById('productModalTitle').textContent = 'Edit Product';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productImage').value = product.image || '';
        document.getElementById('productDescription').value = product.description || '';

        document.getElementById('productModal').classList.add('active');
    }

    deleteProduct(id) {
        if (this.currentUser.role !== 'admin') {
            alert('Only administrators can delete products');
            return;
        }

        if (confirm('Are you sure you want to delete this product?')) {
            this.dataStore.deleteProduct(id);
            this.renderProducts();
            this.renderDashboard();
            this.renderAnalytics();
        }
    }

    // ========================================
    // ORDERS
    // ========================================
    async renderOrders(filterStatus = 'all') {
        let orders = await this.dataStore.getOrders();
        
        if (filterStatus !== 'all') {
            orders = orders.filter(o => o.status === filterStatus);
        }

        const tbody = document.getElementById('ordersTableBody');

        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No orders found</td></tr>';
            return;
        }

        tbody.innerHTML = orders.map(order => {
            const date = new Date(order.date).toLocaleDateString();
            return `
                <tr>
                    <td><strong>#${order.id}</strong></td>
                    <td>${date}</td>
                    <td>${order.customerName}</td>
                    <td>${order.productName}</td>
                    <td>
                        <span class="editable" 
                              data-field="quantity" 
                              data-id="${order.id}" 
                              data-type="order"
                              data-value="${order.quantity}"
                              title="Click to edit">
                            ${order.quantity}
                        </span>
                    </td>
                    <td>$${order.amount.toFixed(2)}</td>
                    <td>
                        <span class="badge badge-${order.status} editable" 
                              data-field="status" 
                              data-id="${order.id}" 
                              data-type="order"
                              data-value="${order.status}"
                              title="Click to edit">
                            ${order.status}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-secondary" onclick="app.editOrder(${order.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteOrder(${order.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    editOrder(id) {
        const order = this.dataStore.getOrders().find(o => o.id === id);
        if (!order) return;

        this.currentEditOrder = order;
        
        document.getElementById('orderModalTitle').textContent = 'Edit Order';
        document.getElementById('orderId').value = order.id;
        document.getElementById('customerName').value = order.customerName;
        document.getElementById('customerPhone').value = order.customerPhone || '';
        document.getElementById('orderProduct').value = order.productId;
        document.getElementById('orderQuantity').value = order.quantity;
        document.getElementById('orderStatus').value = order.status;
        document.getElementById('orderAddress').value = order.address || '';

        document.getElementById('orderModal').classList.add('active');
    }

    deleteOrder(id) {
        if (confirm('Are you sure you want to delete this order?')) {
            this.dataStore.deleteOrder(id);
            this.renderOrders();
            this.renderDashboard();
            this.renderAnalytics();
        }
    }

    // ========================================
    // ANALYTICS
    // ========================================
    async renderAnalytics() {
        const products = await this.dataStore.getProducts();
        const orders = await this.dataStore.getOrders();

        // Best seller
        const bestSeller = [...products].sort((a, b) => b.sales - a.sales)[0];
        if (bestSeller && bestSeller.sales > 0) {
            document.getElementById('bestSellerName').textContent = bestSeller.name;
            document.getElementById('bestSellerSales').textContent = bestSeller.sales;
        } else {
            document.getElementById('bestSellerName').textContent = 'N/A';
            document.getElementById('bestSellerSales').textContent = '0';
        }

        // Average order value
        const completedOrders = orders.filter(o => o.status !== 'cancelled');
        const avgValue = completedOrders.length > 0 ? 
            completedOrders.reduce((sum, o) => sum + o.amount, 0) / completedOrders.length : 0;
        document.getElementById('avgOrderValue').textContent = `$${avgValue.toFixed(2)}`;

        // Conversion rate (simplified)
        const conversionRate = products.length > 0 ? 
            (orders.length / (products.length * 10) * 100).toFixed(1) : 0;
        document.getElementById('conversionRate').textContent = `${conversionRate}%`;

        // Product performance
        this.renderProductPerformance(products);
    }

    renderProductPerformance(products) {
        const sortedProducts = [...products].sort((a, b) => b.sales - a.sales);
        const maxSales = sortedProducts[0]?.sales || 1;
        
        const container = document.getElementById('productPerformanceList');
        const noDataMsg = document.getElementById('noPerformanceData');

        if (sortedProducts.length === 0 || maxSales === 0) {
            noDataMsg.style.display = 'block';
            container.innerHTML = '';
            return;
        }

        noDataMsg.style.display = 'none';
        container.innerHTML = sortedProducts.map(product => {
            const percentage = (product.sales / maxSales * 100).toFixed(0);
            const revenue = (product.sales * product.price).toFixed(2);
            
            return `
                <div class="performance-item">
                    <div class="performance-info">
                        <h4>${product.name}</h4>
                        <p>${product.sales} sales • $${revenue} revenue</p>
                    </div>
                    <div class="performance-bar">
                        <div class="performance-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ========================================
    // MODALS & FORMS
    // ========================================
    setupModals() {
        // Product modal
        document.getElementById('addProductBtn').addEventListener('click', () => {
            this.currentEditProduct = null;
            document.getElementById('productModalTitle').textContent = 'Add New Product';
            document.getElementById('productForm').reset();
            document.getElementById('productId').value = '';
            document.getElementById('productModal').classList.add('active');
        });

        document.getElementById('closeProductModal').addEventListener('click', () => {
            document.getElementById('productModal').classList.remove('active');
        });

        document.getElementById('cancelProduct').addEventListener('click', () => {
            document.getElementById('productModal').classList.remove('active');
        });

        // Order modal
        document.getElementById('addOrderBtn').addEventListener('click', () => {
            this.currentEditOrder = null;
            document.getElementById('orderModalTitle').textContent = 'Add New Order';
            document.getElementById('orderForm').reset();
            document.getElementById('orderId').value = '';
            this.populateProductSelect();
            document.getElementById('orderModal').classList.add('active');
        });

        document.getElementById('closeOrderModal').addEventListener('click', () => {
            document.getElementById('orderModal').classList.remove('active');
        });

        document.getElementById('cancelOrder').addEventListener('click', () => {
            document.getElementById('orderModal').classList.remove('active');
        });

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });

        // Order filter
        document.getElementById('orderStatusFilter').addEventListener('change', (e) => {
            this.renderOrders(e.target.value);
        });
    }

    setupForms() {
        // Product form
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProductSubmit();
        });

        // Order form
        document.getElementById('orderForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleOrderSubmit();
        });

        // Update order amount when product or quantity changes
        document.getElementById('orderProduct').addEventListener('change', () => {
            this.updateOrderAmount();
        });
        
        document.getElementById('orderQuantity').addEventListener('input', () => {
            this.updateOrderAmount();
        });
    }

    async handleProductSubmit() {
        const id = document.getElementById('productId').value;
        const productData = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            image: document.getElementById('productImage').value,
            description: document.getElementById('productDescription').value
        };

        if (id) {
            // Update existing product
            await this.dataStore.updateProduct(parseInt(id), productData);
        } else {
            // Add new product
            await this.dataStore.addProduct(productData);
        }

        document.getElementById('productModal').classList.remove('active');
        await this.renderProducts();
        await this.renderDashboard();
        await this.renderAnalytics();
    }

    async handleOrderSubmit() {
        const id = document.getElementById('orderId').value;
        const productId = parseInt(document.getElementById('orderProduct').value);
        const product = this.dataStore.getProducts().find(p => p.id === productId);
        const quantity = parseInt(document.getElementById('orderQuantity').value);

        const orderData = {
            customerName: document.getElementById('customerName').value,
            customerPhone: document.getElementById('customerPhone').value,
            productId: productId,
            productName: product.name,
            quantity: quantity,
            amount: product.price * quantity,
            status: document.getElementById('orderStatus').value,
            address: document.getElementById('orderAddress').value
        };

        if (id) {
            // Update existing order
            await this.dataStore.updateOrder(parseInt(id), orderData);
        } else {
            // Add new order
            await this.dataStore.addOrder(orderData);
        }

        document.getElementById('orderModal').classList.remove('active');
        await this.renderOrders();
        await this.renderDashboard();
        await this.renderAnalytics();
    }

    async populateProductSelect() {
        const products = await this.dataStore.getProducts();
        const select = document.getElementById('orderProduct');
        
        select.innerHTML = '<option value="">Select Product</option>' + 
            products.map(p => `<option value="${p.id}">${p.name} - $${p.price.toFixed(2)}</option>`).join('');
    }

    updateOrderAmount() {
        const productId = parseInt(document.getElementById('orderProduct').value);
        const quantity = parseInt(document.getElementById('orderQuantity').value) || 1;
        
        if (productId) {
            const product = this.dataStore.getProducts().find(p => p.id === productId);
            if (product) {
                const amount = product.price * quantity;
                // You can display this amount somewhere if needed
                console.log('Order amount:', amount);
            }
        }
    }
}

// ========================================
// INITIALIZE APP
// ========================================
let app;
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase if available
    if (typeof initializeFirebase !== 'undefined') {
        initializeFirebase();
    }
    
    app = new DashboardApp();
});
