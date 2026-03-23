// BD eBazar - Professional E-commerce Application
import { productsData } from './data/productsData.js';
import ProductService from './services/ProductService.js';
import CartService from './services/CartService.js';
import WishlistService from './services/WishlistService.js';
import RecentlyViewedService from './services/RecentlyViewedService.js';
import ProductCard from './ui/ProductCard.js';
import CartDrawer from './ui/CartDrawer.js';
import WishlistDrawer from './ui/WishlistDrawer.js';
import QuickView from './ui/QuickView.js';
import Toast from './ui/Toast.js';
import { Helpers } from './utils/Helpers.js';
import { debounce } from './utils/debounce.js';

class App {
    constructor() {
        this.productService = null;
        this.cartService = null;
        this.wishlistService = null;
        this.recentlyViewedService = null;
        this.toast = null;
        this.cartDrawer = null;
        this.wishlistDrawer = null;
        this.quickView = null;
        
        this.container = document.getElementById('allProduct');
        this.currentCategory = 'All';
        
        this.init();
    }

    async init() {
        try {
            console.log('Initializing BD eBazar...');
            
            // Make productsData available globally for CartService to load from storage
            window.productsData = productsData;
            console.log('Products loaded:', productsData.length);
            
            // Initialize services
            this.initializeServices();
            console.log('Services initialized');
            
            // Initialize UI components
            this.initializeUI();
            console.log('UI initialized');
            
            // Setup event listeners
            this.setupEventListeners();
            console.log('Events setup');
            
            // Render initial products
            this.renderProducts();
            console.log('Products rendered:', this.productService.getProducts().length);
            
            // Update cart count
            this.updateCartCount();
            
            console.log('BD eBazar initialized successfully!');
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showError('Failed to initialize application: ' + error.message);
        }
    }

    initializeServices() {
        this.productService = new ProductService(productsData);
        this.cartService = new CartService();
        this.wishlistService = new WishlistService();
        this.recentlyViewedService = new RecentlyViewedService();
        this.toast = new Toast();
    }

    initializeUI() {
        this.cartDrawer = new CartDrawer(this.cartService);
        this.wishlistDrawer = new WishlistDrawer(this.wishlistService, {
            onAddToCart: (productId) => this.handleAddToCart(productId),
            onQuickView: (product) => this.showQuickView(product)
        });
        
        this.quickView = new QuickView({
            onAddToCart: (product, quantity) => this.handleAddToCartWithQuantity(product, quantity),
            onToggleWishlist: (product) => this.handleToggleWishlist(product)
        });
    }

    setupEventListeners() {
        // Cart icons
        document.getElementById('cartIcon')?.addEventListener('click', () => this.cartDrawer.open());
        document.getElementById('cartIconDesktop')?.addEventListener('click', () => this.cartDrawer.open());
        
        // Wishlist icons
        document.getElementById('wishlistIcon')?.addEventListener('click', () => this.wishlistDrawer.open());
        document.getElementById('wishlistIconDesktop')?.addEventListener('click', () => this.wishlistDrawer.open());
        
        // Category buttons
        document.querySelectorAll('.pro-cat-li li').forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                this.filterByCategory(category);
                this.updateActiveCategory(btn);
            });
        });
        
        // Mobile menu links
        document.querySelectorAll('.menu-links li').forEach(link => {
            link.addEventListener('click', () => {
                const category = link.dataset.category;
                this.filterByCategory(category);
                this.closeMobileMenu();
            });
        });
        
        // Sort dropdown
        document.getElementById('product-sort')?.addEventListener('change', (e) => {
            this.sortProducts(e.target.value);
        });
        
        // Search - with debounce
        const debouncedSearch = debounce((query) => this.handleSearch(query), 300);
        
        document.getElementById('search-input')?.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
        
        document.getElementById('search-input-mobile')?.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
            // Hide banner on mobile search
            const banner = document.querySelector('.baner-with-pic');
            const orderSec = document.querySelector('.order-sec');
            if (banner) banner.style.display = 'none';
            if (orderSec) orderSec.display = 'none';
        });
        
        // Mobile menu
        this.setupMobileMenu();
        
        // Scroll to top button
        document.getElementById('myBtn')?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Show/hide scroll button
        window.addEventListener('scroll', () => {
            const btn = document.getElementById('myBtn');
            if (btn) {
                btn.style.display = window.scrollY > 300 ? 'block' : 'none';
            }
        });
        
        // Search toggle on scroll for mobile
        this.setupSearchToggleOnScroll();
        
        // Global events
        window.addEventListener('openCartDrawer', () => this.cartDrawer.open());
        
        // Footer links
        this.setupFooterLinks();
        
        // Newsletter
        this.setupNewsletter();
    }

    setupMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        const closeMenu = document.getElementById('closeMenu');

        const openMenu = () => {
            mobileMenu?.classList.add('active');
            menuOverlay?.classList.add('active');
            hamburger?.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeMenuFunc = () => {
            mobileMenu?.classList.remove('active');
            menuOverlay?.classList.remove('active');
            hamburger?.classList.remove('active');
            document.body.style.overflow = '';
        };

        hamburger?.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            isExpanded ? closeMenuFunc() : openMenu();
        });

        closeMenu?.addEventListener('click', closeMenuFunc);
        menuOverlay?.addEventListener('click', closeMenuFunc);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMenuFunc();
                this.quickView?.close();
            }
        });
    }

    setupSearchToggleOnScroll() {
        const headerMobile = document.querySelector('.header-mobile');
        const searchToggle = document.getElementById('searchToggle');
        let lastScrollY = 0;
        let searchVisible = true;

        window.addEventListener('scroll', debounce(() => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY <= 10) {
                headerMobile?.classList.remove('hide');
                searchToggle?.classList.remove('show');
                searchVisible = true;
                return;
            }
            
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                if (searchVisible) {
                    headerMobile?.classList.add('hide');
                    searchToggle?.classList.add('show');
                    searchVisible = false;
                }
            } else if (currentScrollY < lastScrollY) {
                if (!searchVisible) {
                    headerMobile?.classList.remove('hide');
                    searchToggle?.classList.remove('show');
                    searchVisible = true;
                }
            }
            
            lastScrollY = currentScrollY;
        }, 100));

        searchToggle?.addEventListener('click', () => {
            const searchInput = document.getElementById('search-input-mobile');
            if (searchInput) {
                searchInput.focus();
            }
        });
    }

    setupFooterLinks() {
        window.filterByCategory = (category) => {
            const btn = document.querySelector(`.pro-cat-li li[data-category="${category}"]`);
            if (btn) {
                this.filterByCategory(category);
                this.updateActiveCategory(btn);
            }
        };

        window.showHelpCenter = () => {
            alert('Help Center\n\nFAQs:\n\nHow do I place an order?\nBrowse products, add to cart, and checkout.\n\nPayment Methods:\nCash on Delivery, bKash, Nagad, Bank Transfer\n\nDelivery:\nDhaka: 1-2 days, Other cities: 3-5 days');
        };

        window.showShippingInfo = () => {
            alert('Shipping Information\n\nDelivery Areas:\nAll major cities in Bangladesh\n\nDelivery Charges:\nOrders over ৳1000: Free\nOrders under ৳1000: ৳60');
        };

        window.showReturnPolicy = () => {
            alert('Return Policy\n\nReturn within 7 days.\nProduct must be unused.\nOriginal packaging required.');
        };

        window.showTerms = () => {
            alert('Terms & Conditions\n\n1. Product info may vary\n2. Prices in BDT\n3. Payment required at order\n4. Order cancellation before shipping');
        };

        window.showUserMenu = () => {
            this.toast.info('Login/Register coming soon!');
        };
    }

    setupNewsletter() {
        window.subscribeNewsletter = () => {
            const email = document.getElementById('newsletter-email');
            if (!email?.value) {
                this.toast.warning('Please enter your email!');
                return;
            }
            
            if (!email.value.includes('@')) {
                this.toast.warning('Please enter a valid email!');
                return;
            }
            
            this.toast.success('Thank you for subscribing!');
            email.value = '';
        };
    }

    renderProducts() {
        if (!this.container) {
            console.error('Container not found!');
            return;
        }
        
        console.log('Rendering products, container:', this.container);
        
        const products = this.productService.getProducts();
        console.log('Products to render:', products.length);
        
        if (products.length === 0) {
            this.container.innerHTML = `
                <div class="no-products">
                    <p>No products found</p>
                    <button onclick="app.resetFilters()">Show All Products</button>
                </div>
            `;
            return;
        }

        this.container.innerHTML = '';
        
        products.forEach(product => {
            const card = new ProductCard(product, {
                onAddToCart: (p) => this.handleAddToCart(p),
                onQuickView: (p) => this.showQuickView(p),
                onToggleWishlist: (p) => this.handleToggleWishlist(p),
                isInWishlist: this.wishlistService.isInWishlist(product.id)
            });
            
            this.container.appendChild(card.render());
        });
        
        console.log('Products rendered successfully');
    }

    filterByCategory(category) {
        this.currentCategory = category;
        this.productService.filterByCategory(category);
        this.renderProducts();
        
        // Hide banner when filtering
        const banner = document.querySelector('.baner-with-pic');
        const orderSec = document.querySelector('.order-sec');
        if (banner) banner.style.display = 'none';
        if (orderSec) orderSec.style.display = 'none';
        
        // Update URL
        if (category !== 'All') {
            Helpers.setUrlParam('category', category);
        } else {
            Helpers.removeUrlParam('category');
        }
    }

    sortProducts(sortBy) {
        this.productService.sortProducts(sortBy);
        this.renderProducts();
    }

    handleSearch(query) {
        this.productService.filterBySearch(query);
        this.renderProducts();
        
        if (!query) {
            // Restore banner if search is cleared and no category selected
            if (this.currentCategory === 'All') {
                const banner = document.querySelector('.baner-with-pic');
                const orderSec = document.querySelector('.order-sec');
                if (banner) banner.style.display = '';
                if (orderSec) orderSec.style.display = '';
            }
        }
    }

    resetFilters() {
        this.productService.resetFilters();
        this.currentCategory = 'All';
        
        // Reset UI
        document.querySelectorAll('.pro-cat-li li').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === 'All');
        });
        
        // Reset sort
        const sortSelect = document.getElementById('product-sort');
        if (sortSelect) sortSelect.value = 'default';
        
        // Reset search
        const searchInputs = ['search-input', 'search-input-mobile'];
        searchInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) input.value = '';
        });
        
        // Show banner
        const banner = document.querySelector('.baner-with-pic');
        const orderSec = document.querySelector('.order-sec');
        if (banner) banner.style.display = '';
        if (orderSec) orderSec.style.display = '';
        
        this.renderProducts();
    }

    updateActiveCategory(activeBtn) {
        document.querySelectorAll('.pro-cat-li li').forEach(btn => {
            btn.classList.toggle('active', btn === activeBtn);
        });
    }

    updateCartCount() {
        const count = this.cartService.getTotalItems();
        
        const cartIcon = document.getElementById('cartIcon');
        const cartIconDesktop = document.getElementById('cartIconDesktop');
        
        if (cartIcon) {
            cartIcon.innerHTML = `🛒 Cart (${count})`;
            cartIcon.classList.add('cart-iconn');
        }
        
        if (cartIconDesktop) {
            cartIconDesktop.innerHTML = `🛒 Cart (${count})`;
            cartIconDesktop.classList.add('cart-iconn');
        }
    }

    handleAddToCart(product) {
        const result = this.cartService.addItem(product);
        
        if (result.success) {
            this.toast.success(result.message);
            // Add animation to cart icon
            this.animateCartIcon();
        } else {
            this.toast.warning(result.message);
        }
    }

    handleAddToCartWithQuantity(product, quantity) {
        for (let i = 0; i < quantity; i++) {
            this.cartService.addItem(product);
        }
        this.toast.success(`${quantity}x ${product.name} added to cart!`);
        this.animateCartIcon();
    }

    animateCartIcon() {
        const icons = ['cartIcon', 'cartIconDesktop'];
        icons.forEach(id => {
            const icon = document.getElementById(id);
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }

    showQuickView(product) {
        // Add to recently viewed
        this.recentlyViewedService.add(product);
        
        // Open quick view
        this.quickView.open(product);
    }

    handleToggleWishlist(product) {
        const result = this.wishlistService.toggle(product);
        
        if (result.success) {
            this.toast.success(result.message);
        } else {
            this.toast.info(result.message);
        }
        
        // Re-render products to update wishlist button states
        this.renderProducts();
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        const hamburger = document.getElementById('hamburger');
        
        mobileMenu?.classList.remove('active');
        menuOverlay?.classList.remove('active');
        hamburger?.classList.remove('active');
        document.body.style.overflow = '';
    }

    showError(message) {
        if (this.container) {
            this.container.innerHTML = `
                <div class="error-state">
                    <p>${message}</p>
                    <button onclick="location.reload()">Reload Page</button>
                </div>
            `;
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    try {
        window.app = new App();
    } catch (e) {
        console.error('Fatal error:', e);
    }
});

export default App;
