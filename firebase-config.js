// Firebase Configuration
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAlBONbChZopMI6z6Y9CbopkUKaq_DGjJ8",
    authDomain: "fourandmore-1f000.firebaseapp.com",
    projectId: "fourandmore-1f000",
    storageBucket: "fourandmore-1f000.firebasestorage.app",
    messagingSenderId: "210560181472",
    appId: "1:210560181472:web:34050e48db04a1dbcb1c85",
    measurementId: "G-1K70Q8J5N0"
};

// Initialize Firebase
let db;
let auth;

function initializeFirebase() {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        auth = firebase.auth();
        console.log('Firebase initialized successfully');
        return true;
    } else {
        console.error('Firebase SDK not loaded');
        return false;
    }
}

// ========================================
// FIREBASE DATA OPERATIONS
// ========================================

class FirebaseDataStore {
    constructor() {
        this.productsCollection = 'products';
        this.ordersCollection = 'orders';
        this.usersCollection = 'users';
        this.isOnline = navigator.onLine;
        
        // Monitor online/offline status
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('Back online - syncing data...');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('Offline mode - changes will sync when back online');
        });
    }

    // ========================================
    // AUTHENTICATION
    // ========================================
    async signIn(username, password) {
        try {
            // Use Firebase Authentication with email format
            const email = `${username}@4andmore.com`;
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            
            // Get user role from Firestore
            const userDoc = await db.collection(this.usersCollection).doc(userCredential.user.uid).get();
            
            if (userDoc.exists) {
                return {
                    success: true,
                    user: {
                        uid: userCredential.user.uid,
                        username: username,
                        role: userDoc.data().role,
                        name: userDoc.data().name
                    }
                };
            } else {
                throw new Error('User data not found');
            }
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    async createUser(username, password, role, name) {
        try {
            const email = `${username}@4andmore.com`;
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            
            // Store user data in Firestore
            await db.collection(this.usersCollection).doc(userCredential.user.uid).set({
                username: username,
                role: role,
                name: name,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { success: true, uid: userCredential.user.uid };
        } catch (error) {
            console.error('Create user error:', error);
            return { success: false, error: error.message };
        }
    }

    signOut() {
        return auth.signOut();
    }

    getCurrentUser() {
        return auth.currentUser;
    }

    // ========================================
    // PRODUCTS
    // ========================================
    async getProducts() {
        try {
            const snapshot = await db.collection(this.productsCollection)
                .orderBy('createdAt', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting products:', error);
            return [];
        }
    }

    async addProduct(product) {
        try {
            const docRef = await db.collection(this.productsCollection).add({
                ...product,
                sales: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { success: true, id: docRef.id, ...product };
        } catch (error) {
            console.error('Error adding product:', error);
            return { success: false, error: error.message };
        }
    }

    async updateProduct(id, updates) {
        try {
            await db.collection(this.productsCollection).doc(id).update({
                ...updates,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { success: true };
        } catch (error) {
            console.error('Error updating product:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteProduct(id) {
        try {
            await db.collection(this.productsCollection).doc(id).delete();
            return { success: true };
        } catch (error) {
            console.error('Error deleting product:', error);
            return { success: false, error: error.message };
        }
    }

    // ========================================
    // ORDERS
    // ========================================
    async getOrders() {
        try {
            const snapshot = await db.collection(this.ordersCollection)
                .orderBy('date', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date?.toDate?.() || new Date()
            }));
        } catch (error) {
            console.error('Error getting orders:', error);
            return [];
        }
    }

    async addOrder(order) {
        try {
            const docRef = await db.collection(this.ordersCollection).add({
                ...order,
                date: firebase.firestore.Timestamp.fromDate(new Date()),
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Update product sales and stock
            if (order.productId) {
                await this.incrementProductSales(order.productId, order.quantity);
            }
            
            return { success: true, id: docRef.id, ...order };
        } catch (error) {
            console.error('Error adding order:', error);
            return { success: false, error: error.message };
        }
    }

    async updateOrder(id, updates) {
        try {
            await db.collection(this.ordersCollection).doc(id).update({
                ...updates,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            return { success: true };
        } catch (error) {
            console.error('Error updating order:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteOrder(id) {
        try {
            await db.collection(this.ordersCollection).doc(id).delete();
            return { success: true };
        } catch (error) {
            console.error('Error deleting order:', error);
            return { success: false, error: error.message };
        }
    }

    async incrementProductSales(productId, quantity) {
        try {
            await db.collection(this.productsCollection).doc(productId).update({
                sales: firebase.firestore.FieldValue.increment(quantity),
                stock: firebase.firestore.FieldValue.increment(-quantity)
            });
        } catch (error) {
            console.error('Error updating product sales:', error);
        }
    }

    // ========================================
    // REAL-TIME LISTENERS
    // ========================================
    onProductsChange(callback) {
        return db.collection(this.productsCollection)
            .orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                const products = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(products);
            });
    }

    onOrdersChange(callback) {
        return db.collection(this.ordersCollection)
            .orderBy('date', 'desc')
            .onSnapshot(snapshot => {
                const orders = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date?.toDate?.() || new Date()
                }));
                callback(orders);
            });
    }
}

// Export for use in other scripts
window.FirebaseDataStore = FirebaseDataStore;
window.initializeFirebase = initializeFirebase;
