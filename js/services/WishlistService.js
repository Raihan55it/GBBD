import { StorageService } from '../utils/storage.js';

const WISHLIST_STORAGE_KEY = 'wishlist';

class WishlistService {
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
            count: this.items.length,
            isEmpty: this.items.length === 0
        };
    }

    add(product) {
        if (this.isInWishlist(product.id)) {
            return { success: false, message: 'Already in wishlist' };
        }

        this.items.push({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            discountPrice: product.discountPrice,
            category: product.category,
            addedAt: new Date().toISOString()
        });

        this.saveToStorage();
        this.notify();
        return { success: true, message: 'Added to wishlist' };
    }

    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.notify();
        return { success: true, message: 'Removed from wishlist' };
    }

    toggle(product) {
        if (this.isInWishlist(product.id)) {
            return this.remove(product.id);
        } else {
            return this.add(product);
        }
    }

    isInWishlist(productId) {
        return this.items.some(item => item.id === productId);
    }

    getItems() {
        return this.items;
    }

    getCount() {
        return this.items.length;
    }

    clear() {
        this.items = [];
        this.saveToStorage();
        this.notify();
    }

    saveToStorage() {
        StorageService.set(WISHLIST_STORAGE_KEY, this.items);
    }

    loadFromStorage() {
        this.items = StorageService.get(WISHLIST_STORAGE_KEY, []);
        this.notify();
    }
}

export default WishlistService;
