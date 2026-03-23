import { StorageService } from '../utils/storage.js';
import { Helpers } from '../utils/Helpers.js';

const CART_STORAGE_KEY = 'cart';

class CartService {
    constructor() {
        this.items = [];
        this.listeners = [];
        this.loadFromStorage();
    }

    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notify() {
        this.listeners.forEach(callback => callback(this.getState()));
    }

    getState() {
        return {
            items: this.items,
            totalItems: this.items.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: this.items.reduce((sum, item) => sum + (Helpers.getCurrentPrice(item.product) * item.quantity), 0),
            isEmpty: this.items.length === 0
        };
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        
        if (existingItem) {
            const maxStock = product.inventory?.quantity || 99;
            if (existingItem.quantity >= maxStock) {
                return { success: false, message: 'Maximum stock reached!' };
            }
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                product: Helpers.enrichProduct(product),
                quantity: quantity
            });
        }
        
        this.saveToStorage();
        this.notify();
        return { success: true, message: `${product.name} added to cart!` };
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.product.id !== productId);
        this.saveToStorage();
        this.notify();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.product.id === productId);
        
        if (!item) return { success: false, message: 'Item not found' };
        
        if (quantity <= 0) {
            return this.removeItem(productId);
        }
        
        const maxStock = item.product.inventory?.quantity || 99;
        if (quantity > maxStock) {
            return { success: false, message: 'Maximum stock reached!' };
        }
        
        item.quantity = quantity;
        this.saveToStorage();
        this.notify();
        return { success: true, message: 'Quantity updated' };
    }

    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.notify();
    }

    getItems() {
        return this.items;
    }

    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    getSubtotal() {
        return this.items.reduce((sum, item) => {
            return sum + (Helpers.getCurrentPrice(item.product) * item.quantity);
        }, 0);
    }

    isInCart(productId) {
        return this.items.some(item => item.product.id === productId);
    }

    getItemQuantity(productId) {
        const item = this.items.find(item => item.product.id === productId);
        return item ? item.quantity : 0;
    }

    saveToStorage() {
        const cartData = this.items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity
        }));
        StorageService.set(CART_STORAGE_KEY, cartData);
    }

    loadFromStorage() {
        const cartData = StorageService.get(CART_STORAGE_KEY, []);
        
        if (cartData.length > 0 && typeof window !== 'undefined' && window.productsData) {
            this.items = cartData.map(item => {
                const product = window.productsData.find(p => p.id === item.productId);
                if (product) {
                    return {
                        product: Helpers.enrichProduct(product),
                        quantity: item.quantity
                    };
                }
                return null;
            }).filter(Boolean);
        }
        
        this.notify();
    }
}

export default CartService;
