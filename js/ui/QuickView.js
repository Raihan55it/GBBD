import { Helpers } from '../utils/Helpers.js';

class QuickView {
    constructor(options = {}) {
        this.onAddToCart = options.onAddToCart || (() => {});
        this.onToggleWishlist = options.onToggleWishlist || (() => {});
        this.modal = document.getElementById('quickViewModal');
        this.body = document.getElementById('quickViewBody');
        
        this.init();
    }

    init() {
        // Close button
        document.getElementById('quickViewClose')?.addEventListener('click', () => this.close());
        
        // Overlay click to close
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    isOpen() {
        return this.modal?.classList.contains('active');
    }

    open(product) {
        if (!this.modal || !this.body) return;
        
        this.render(product);
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        if (!this.modal) return;
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    render(product) {
        const p = product;
        
        this.body.innerHTML = `
            <div class="quick-view-grid">
                <div class="quick-view-image">
                    <img src="${Helpers.escapeHtml(p.image)}" 
                         alt="${Helpers.escapeHtml(p.name)}"
                         onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22><rect fill=%22%23f5f5f5%22 width=%22400%22 height=%22400%22/><text fill=%22%23999%22 x=%22200%22 y=%22200%22 text-anchor=%22middle%22>No Image</text></svg>'">
                    ${p.hasDiscount ? `<span class="discount-badge">${p.discountPercentage}% OFF</span>` : ''}
                </div>
                <div class="quick-view-details">
                    <span class="quick-view-category">${Helpers.escapeHtml(p.category)}</span>
                    <h2>${Helpers.escapeHtml(p.name)}</h2>
                    
                    <div class="quick-view-price">
                        ${p.hasDiscount ? `<span class="original-price">${Helpers.formatCurrency(p.price)}</span>` : ''}
                        <span class="current-price">${Helpers.formatCurrency(p.currentPrice)}</span>
                    </div>
                    
                    <div class="quick-view-rating">
                        <span class="stars">${p.ratingStars}</span>
                        <span>(${p.rating?.count || 0} reviews)</span>
                    </div>
                    
                    <p class="quick-view-description">${Helpers.escapeHtml(p.description)}</p>
                    
                    <div class="quick-view-stock ${p.inStock ? 'in-stock' : 'out-of-stock'}">
                        ${p.inStock ? `✓ In Stock (${p.inventory?.quantity} available)` : '✕ Out of Stock'}
                    </div>
                    
                    <div class="quick-view-sku">
                        <span>SKU: ${Helpers.escapeHtml(p.sku || 'N/A')}</span>
                    </div>
                    
                    <div class="quick-view-quantity">
                        <label>Quantity:</label>
                        <div class="quantity-selector">
                            <button class="qty-btn" id="qv-decrease">−</button>
                            <input type="number" id="qv-quantity" value="1" min="1" max="${p.inventory?.quantity || 10}">
                            <button class="qty-btn" id="qv-increase">+</button>
                        </div>
                    </div>
                    
                    <div class="quick-view-actions">
                        <button class="btn-add-to-cart ${!p.inStock ? 'disabled' : ''}" 
                                ${!p.inStock ? 'disabled' : ''}>
                            ${p.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <button class="btn-buy-now ${!p.inStock ? 'disabled' : ''}"
                                ${!p.inStock ? 'disabled' : ''}>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents(p);
    }

    bindEvents(product) {
        // Quantity controls
        const qtyInput = document.getElementById('qv-quantity');
        const decreaseBtn = document.getElementById('qv-decrease');
        const increaseBtn = document.getElementById('qv-increase');

        decreaseBtn?.addEventListener('click', () => {
            const current = parseInt(qtyInput?.value || 1);
            if (current > 1) {
                qtyInput.value = current - 1;
            }
        });

        increaseBtn?.addEventListener('click', () => {
            const current = parseInt(qtyInput?.value || 1);
            const max = product.inventory?.quantity || 10;
            if (current < max) {
                qtyInput.value = current + 1;
            }
        });

        // Add to cart button
        const addToCartBtn = this.body.querySelector('.btn-add-to-cart');
        addToCartBtn?.addEventListener('click', () => {
            const quantity = parseInt(qtyInput?.value || 1);
            this.onAddToCart(product, quantity);
            this.close();
        });

        // Buy now button
        const buyNowBtn = this.body.querySelector('.btn-buy-now');
        buyNowBtn?.addEventListener('click', () => {
            const quantity = parseInt(qtyInput?.value || 1);
            this.onAddToCart(product, quantity);
            this.close();
            // Open cart drawer - will be handled by app
            window.dispatchEvent(new CustomEvent('openCartDrawer'));
        });
    }
}

export default QuickView;
