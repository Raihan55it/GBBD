import { Helpers } from '../utils/Helpers.js';

class ProductCard {
    constructor(product, options = {}) {
        this.product = product;
        this.onAddToCart = options.onAddToCart || (() => {});
        this.onQuickView = options.onQuickView || (() => {});
        this.onToggleWishlist = options.onToggleWishlist || (() => {});
        this.isInWishlist = options.isInWishlist || false;
    }

    render() {
        const p = this.product;
        
        const card = document.createElement('div');
        card.className = 'card-pro';
        card.dataset.productId = p.id;

        card.innerHTML = `
            <div class="card-image-container">
                <img src="${Helpers.escapeHtml(p.image)}" 
                     alt="${Helpers.escapeHtml(p.name)}" 
                     class="card-img" 
                     loading="lazy"
                     onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><rect fill=%22%23f5f5f5%22 width=%22200%22 height=%22200%22/><text fill=%22%23999%22 x=%22100%22 y=%22100%22 text-anchor=%22middle%22>No Image</text></svg>'">
                ${p.hasDiscount ? `<span class="discount-badge">${p.discountPercentage}% OFF</span>` : ''}
                <button class="wishlist-btn ${this.isInWishlist ? 'active' : ''}" data-id="${p.id}" title="${this.isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}">
                    ${this.isInWishlist ? '❤️' : '🤍'}
                </button>
                ${!p.inStock ? '<div class="out-of-stock-overlay">Out of Stock</div>' : ''}
            </div>
            <div class="des-div">
                <h3 class="product-name" title="${Helpers.escapeHtml(p.name)}">${Helpers.escapeHtml(p.name)}</h3>
                <div class="category-tag">${Helpers.escapeHtml(p.category)}</div>
                <div class="price-container">
                    ${p.hasDiscount ? `<span class="original-price">${Helpers.formatCurrency(p.price)}</span>` : ''}
                    <span class="current-price">${Helpers.formatCurrency(p.currentPrice)}</span>
                </div>
                <div class="rating-container">
                    <span class="stars">${p.ratingStars}</span>
                    <span class="rating-count">(${p.rating?.count || 0})</span>
                </div>
                <div class="stock-status ${p.inStock ? 'in-stock' : 'out-of-stock'}">
                    ${p.inStock ? `In Stock (${p.inventory?.quantity || 0})` : 'Out of Stock'}
                </div>
                <div class="btn-div">
                    <button class="add-cart ${!p.inStock ? 'disabled' : ''}" ${!p.inStock ? 'disabled' : ''}>
                        Add to Cart
                    </button>
                    <button class="quick-view-btn">Quick View</button>
                </div>
            </div>
        `;

        // Bind events
        this.bindEvents(card);

        return card;
    }

    bindEvents(card) {
        // Add to cart button
        const addToCartBtn = card.querySelector('.add-cart');
        addToCartBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onAddToCart(this.product);
        });

        // Quick view button
        const quickViewBtn = card.querySelector('.quick-view-btn');
        quickViewBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onQuickView(this.product);
        });

        // Wishlist button
        const wishlistBtn = card.querySelector('.wishlist-btn');
        wishlistBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onToggleWishlist(this.product);
        });

        // Product name click - quick view
        const productName = card.querySelector('.product-name');
        productName?.addEventListener('click', () => {
            this.onQuickView(this.product);
        });
    }
}

export default ProductCard;
