import CartService from '../services/CartService.js';
import { Helpers } from '../utils/Helpers.js';
import Toast from './Toast.js';

class CartDrawer {
    constructor(cartService) {
        this.cart = cartService;
        this.toast = new Toast();
        this.drawer = document.getElementById('cartDrawer');
        this.overlay = document.getElementById('cartDrawerOverlay');
        this.body = document.getElementById('cartDrawerBody');
        this.footer = document.getElementById('cartDrawerFooter');
        this.totalEl = document.getElementById('cartTotalAmount');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.cart.subscribe(() => this.render());
        this.render();
    }

    bindEvents() {
        // Close button
        document.getElementById('cartDrawerClose')?.addEventListener('click', () => this.close());
        
        // Overlay click
        this.overlay?.addEventListener('click', () => this.close());
        
        // Checkout button
        document.getElementById('checkoutBtn')?.addEventListener('click', () => this.checkout());

        // Escape key
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

        const items = this.cart.getItems();
        
        if (items.length === 0) {
            this.body.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty-icon">🛒</div>
                    <p>Your cart is empty</p>
                    <button class="btn-continue-shopping" onclick="app.cartDrawer.close()">Continue Shopping</button>
                </div>
            `;
            this.updateTotal(0);
            this.footer.style.display = 'none';
            return;
        }

        this.footer.style.display = 'block';
        this.body.innerHTML = items.map(item => this.renderItem(item)).join('');
        this.updateTotal(this.cart.getSubtotal());

        // Bind quantity controls
        this.body.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = btn.dataset.id;
                const action = btn.dataset.action;
                const currentQty = this.cart.getItemQuantity(productId);
                
                if (action === 'increase') {
                    this.cart.addItem(item.product);
                } else if (action === 'decrease') {
                    this.cart.updateQuantity(productId, currentQty - 1);
                }
            });
        });

        // Bind remove buttons
        this.body.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = btn.dataset.id;
                this.cart.removeItem(productId);
                this.toast.success('Item removed from cart');
            });
        });
    }

    renderItem(item) {
        const product = item.product;
        const price = Helpers.getCurrentPrice(product);
        
        return `
            <div class="cart-item">
                <img src="${Helpers.escapeHtml(product.image)}" alt="${Helpers.escapeHtml(product.name)}" 
                     class="cart-item-image" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22><rect fill=%22%23f5f5f5%22 width=%2280%22 height=%2280%22/><text fill=%22%23999%22 x=%2240%22 y=%2240%22 text-anchor=%22middle%22>No Image</text></svg>'">
                <div class="cart-item-info">
                    <h4>${Helpers.escapeHtml(product.name)}</h4>
                    <p class="cart-item-price">${Helpers.formatCurrency(price)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" data-id="${product.id}" data-action="decrease">−</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-id="${product.id}" data-action="increase">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${product.id}" title="Remove">&times;</button>
            </div>
        `;
    }

    updateTotal(total) {
        if (this.totalEl) {
            this.totalEl.textContent = Helpers.formatCurrency(total);
        }
    }

    checkout() {
        const state = this.cart.getState();
        if (state.isEmpty) {
            this.toast.warning('Your cart is empty!');
            return;
        }

        const total = state.subtotal;
        const confirmCheckout = confirm(
            `Checkout Summary\n\n` +
            `Total Items: ${state.totalItems}\n` +
            `Total: ${Helpers.formatCurrency(total)}\n\n` +
            `Proceed with order?`
        );

        if (confirmCheckout) {
            this.toast.success('Order placed successfully! Thank you for your purchase.');
            this.cart.clearCart();
            this.close();
        }
    }
}

export default CartDrawer;
