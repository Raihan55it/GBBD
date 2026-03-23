import { StorageService } from '../utils/storage.js';

const RECENTLY_VIEWED_KEY = 'recentlyViewed';
const MAX_ITEMS = 10;

class RecentlyViewedService {
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
        this.listeners.forEach(callback => callback(this.items));
    }

    add(product) {
        // Remove if already exists (to move to front)
        this.items = this.items.filter(item => item.id !== product.id);
        
        // Add to front
        this.items.unshift({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            discountPrice: product.discountPrice,
            category: product.category,
            viewedAt: new Date().toISOString()
        });

        // Keep only max items
        if (this.items.length > MAX_ITEMS) {
            this.items = this.items.slice(0, MAX_ITEMS);
        }

        this.saveToStorage();
        this.notify();
    }

    getItems() {
        return this.items;
    }

    hasViewed(productId) {
        return this.items.some(item => item.id === productId);
    }

    clear() {
        this.items = [];
        this.saveToStorage();
        this.notify();
    }

    saveToStorage() {
        StorageService.set(RECENTLY_VIEWED_KEY, this.items);
    }

    loadFromStorage() {
        this.items = StorageService.get(RECENTLY_VIEWED_KEY, []);
        this.notify();
    }
}

export default RecentlyViewedService;
