import WishlistService from '../services/WishlistService.js';
import { Helpers } from '../utils/Helpers.js';
import Toast from './Toast.js';

class WishlistDrawer {
    constructor(wishlistService, options = {}) {
        this.wishlist = wishlistService;
        this.onAddToCart = options.onAddToCart || (() => {});
        this.onQuickView = options.onQuickView || (() => {});
        this.toast = new Toast();
        
        this.drawer = document.getElementById('wishlistDrawer');
        this.overlay = document.getElementById('wishlistDrawerOverlay');
        this.body = document.getElementById('wishlistDrawerBody');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.wishlist.subscribe(() => this.render());
        this.render();
    }

    bindEvents() {
        document.getElementById('wishlistDrawerClose')?.addEventListener('click', () => this.close());
        this.overlay?.addEventListener('click', () => this.close());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    isOpen() {
        return this.drawer?.classList.contains('active');
    }

    open() {
        if (!this.drawer || !this.overlay) return;
        this.drawer.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        if (!this.drawer || !this.overlay) return;
        this.drawer.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggle() {
        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    }

    render() {
        if (!this.body) return;

        const items = this.wishlist.getItems();

        if (items.length === 0) {
            this.body.innerHTML = `
                <div class="wishlist-empty">
                    <div class="wishlist-empty-icon">❤️</div>
                    <p>Your wishlist is empty</p>
                    <button class="btn-browse" onclick="app.wishlistDrawer.close()">Browse Products</button>
                </div>
            `;
            return;
        }

        this.body.innerHTML = items.map(item => this.renderItem(item)).join('');

        // Bind events
        this.body.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = btn.dataset.id;
                this.onAddToCart(productId);
            });
        });

        this.body.querySelectorAll('.remove-wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = btn.dataset.id;
                this.wishlist.remove(productId);
                this.toast.success('Removed from wishlist');
            });
        });
    }

    renderItem(item) {
        const price = item.discountPrice || item.price;
        
        return `
            <div class="wishlist-item">
                <img src="${Helpers.escapeHtml(item.image)}" 
                     alt="${Helpers.escapeHtml(item.name)}" 
                     class="wishlist-item-image"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22><rect fill=%22%23f5f5f5%22 width=%2280%22 height=%2280%22/><text fill=%22%23999%22 x=%2240%22 y=%2240%22 text-anchor=%22middle%22>No Image</text></svg>'">
                <div class="wishlist-item-info">
                    <h4>${Helpers.escapeHtml(item.name)}</h4>
                    <p class="wishlist-item-price">${Helpers.formatCurrency(price)}</p>
                    <p class="wishlist-item-category">${Helpers.escapeHtml(item.category)}</p>
                </div>
                <div class="wishlist-item-actions">
                    <button class="add-to-cart-btn" data-id="${item.id}">Add to Cart</button>
                    <button class="remove-wishlist-btn" data-id="${item.id}">&times;</button>
                </div>
            </div>
        `;
    }
}

export default WishlistDrawer;
