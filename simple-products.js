// Simple product display with cart functionality
document.addEventListener('DOMContentLoaded', function() {
    const products = [
        { id: "dates1", name: "Premium Medjool Dates", image: "imageForGBBD/dates1.jpg", category: "Dates", price: 450, discountPrice: 399, description: "Premium quality Medjool dates from Saudi Arabia", rating: { average: 4.5, count: 23 }, inventory: { quantity: 150 } },
        { id: "dates2", name: "Sukkari Dates", image: "imageForGBBD/dates2.jpg", category: "Dates", price: 380, description: "Sweet and soft Sukkari dates", rating: { average: 4.3, count: 18 }, inventory: { quantity: 200 } },
        { id: "dates3", name: "Ajwa Dates", image: "imageForGBBD/dates3.jpg", category: "Dates", price: 520, discountPrice: 479, description: "Premium Ajwa dates from Medina", rating: { average: 4.7, count: 31 }, inventory: { quantity: 75 } },
        { id: "funfood1", name: "Mixed Nuts Pack", image: "imageForGBBD/funfood1.jpg", category: "Fun Food", price: 650, discountPrice: 599, description: "Premium mixed nuts with dried fruits", rating: { average: 4.4, count: 45 }, inventory: { quantity: 120 } },
        { id: "funfood2", name: "Healthy Trail Mix", image: "imageForGBBD/funfood2.jpg", category: "Fun Food", price: 420, description: "Energy-boosting trail mix for active lifestyle", rating: { average: 4.2, count: 28 }, inventory: { quantity: 90 } },
        { id: "funfood3", name: "Chocolate Covered Almonds", image: "imageForGBBD/funfood3.jpg", category: "Fun Food", price: 380, description: "Premium almonds covered in dark chocolate", rating: { average: 4.6, count: 52 }, inventory: { quantity: 60 } },
        { id: "funfood4", name: "Fruit and Nut Bar", image: "imageForGBBD/funfood4.jpg", category: "Fun Food", price: 280, description: "Natural fruit and nut energy bars", rating: { average: 4.1, count: 19 }, inventory: { quantity: 180 } },
        { id: "ghee1", name: "Pure Desi Ghee", image: "imageForGBBD/ghee1.jpg", category: "Ghee", price: 850, description: "Pure cow ghee made from traditional methods", rating: { average: 4.8, count: 67 }, inventory: { quantity: 45 } },
        { id: "ghee2", name: "Buffalo Ghee", image: "imageForGBBD/ghee2.jpg", category: "Ghee", price: 750, discountPrice: 699, description: "Premium quality buffalo ghee", rating: { average: 4.5, count: 34 }, inventory: { quantity: 55 } },
        { id: "ghee3", name: "Organic Ghee", image: "imageForGBBD/ghee3.jpg", category: "Ghee", price: 950, description: "Certified organic ghee from grass-fed cows", rating: { average: 4.7, count: 29 }, inventory: { quantity: 30 } },
        { id: "ghee4", name: "A2 Desi Ghee", image: "imageForGBBD/ghee4.jpg", category: "Ghee", price: 1200, description: "Premium A2 desi ghee from indigenous cows", rating: { average: 4.9, count: 41 }, inventory: { quantity: 25 } },
        { id: "honey1", name: "Wildflower Honey", image: "imageForGBBD/honey1.jpg", category: "Honey", price: 450, description: "Pure wildflower honey from Sundarbans", rating: { average: 4.4, count: 56 }, inventory: { quantity: 80 } },
        { id: "honey2", name: "Mustard Honey", image: "imageForGBBD/honey2.jpg", category: "Honey", price: 380, description: "Premium mustard flower honey", rating: { average: 4.3, count: 38 }, inventory: { quantity: 95 } },
        { id: "honey3", name: "Litchi Honey", image: "imageForGBBD/honey3.jpg", category: "Honey", price: 520, discountPrice: 479, description: "Sweet litchi flower honey from Rajshahi", rating: { average: 4.6, count: 42 }, inventory: { quantity: 65 } },
        { id: "khejurgur1", name: "Premium Khejur Gur", image: "imageForGBBD/khejurgur1.jpg", category: "Khejur Gur", price: 320, description: "Traditional date palm jaggery", rating: { average: 4.5, count: 27 }, inventory: { quantity: 110 } },
        { id: "khejurgur2", name: "Liquid Khejur Gur", image: "imageForGBBD/khejurgur2.jpg", category: "Khejur Gur", price: 280, description: "Liquid form of date palm jaggery", rating: { average: 4.2, count: 18 }, inventory: { quantity: 130 } },
        { id: "khejurgur3", name: "Organic Khejur Gur", image: "imageForGBBD/khejurgur3.jpg", category: "Khejur Gur", price: 450, description: "Organic certified date palm jaggery", rating: { average: 4.7, count: 33 }, inventory: { quantity: 70 } },
        { id: "masala1", name: "Garam Masala", image: "imageForGBBD/masala1.jpg", category: "Masala", price: 180, description: "Traditional blend of aromatic spices", rating: { average: 4.3, count: 48 }, inventory: { quantity: 200 } },
        { id: "masala2", name: "Biryani Masala", image: "imageForGBBD/masala2.jpg", category: "Masala", price: 220, description: "Perfect spice mix for authentic biryani", rating: { average: 4.5, count: 62 }, inventory: { quantity: 150 } },
        { id: "masala3", name: "Tandoori Masala", image: "imageForGBBD/masala3.jpg", category: "Masala", price: 195, description: "Traditional tandoori spice blend", rating: { average: 4.4, count: 39 }, inventory: { quantity: 175 } },
        { id: "nuts1", name: "Premium Almonds", image: "imageForGBBD/nuts1.jpg", category: "Nuts", price: 580, discountPrice: 529, description: "California almonds, premium quality", rating: { average: 4.6, count: 71 }, inventory: { quantity: 85 } },
        { id: "nuts2", name: "Cashew Nuts", image: "imageForGBBD/nuts2.jpg", category: "Nuts", price: 650, description: "Premium cashew nuts from Vietnam", rating: { average: 4.5, count: 53 }, inventory: { quantity: 95 } },
        { id: "nuts3", name: "Walnuts", image: "imageForGBBD/nuts3.jpg", category: "Nuts", price: 720, description: "Premium walnuts from Chile", rating: { average: 4.4, count: 41 }, inventory: { quantity: 60 } },
        { id: "nuts4", name: "Pistachios", image: "imageForGBBD/nuts4.jpg", category: "Nuts", price: 850, description: "Premium pistachios from Iran", rating: { average: 4.7, count: 38 }, inventory: { quantity: 50 } },
        { id: "oil1", name: "Mustard Oil", image: "imageForGBBD/oil1.jpg", category: "Oil", price: 280, description: "Pure mustard oil, cold pressed", rating: { average: 4.3, count: 46 }, inventory: { quantity: 140 } },
        { id: "oil2", name: "Coconut Oil", image: "imageForGBBD/oil2.jpg", category: "Oil", price: 420, description: "Virgin coconut oil, cold pressed", rating: { average: 4.5, count: 58 }, inventory: { quantity: 75 } },
        { id: "oil3", name: "Olive Oil", image: "imageForGBBD/oil3.jpg", category: "Oil", price: 980, discountPrice: 899, description: "Extra virgin olive oil from Spain", rating: { average: 4.7, count: 69 }, inventory: { quantity: 45 } },
        { id: "teacoffee1", name: "Darjeeling Tea", image: "imageForGBBD/teacoffee1.jpg", category: "Tea Coffee", price: 450, description: "Premium Darjeeling black tea", rating: { average: 4.6, count: 84 }, inventory: { quantity: 100 } },
        { id: "teacoffee2", name: "Sylhet Tea", image: "imageForGBBD/teacoffee2.jpg", category: "Tea Coffee", price: 320, description: "Finest CTC tea from Sylhet gardens", rating: { average: 4.2, count: 57 }, inventory: { quantity: 180 } },
        { id: "teacoffee3", name: "Premium Coffee", image: "imageForGBBD/teacoffee3.jpg", category: "Tea Coffee", price: 680, description: "Arabica coffee beans, medium roast", rating: { average: 4.5, count: 43 }, inventory: { quantity: 65 } },
    ];

    const STORAGE_KEY = 'gbbd_cart';
    let cart = loadCart();
    let currentCategory = 'All';
    
    const container = document.getElementById('allProduct');
    const cartIcon = document.getElementById('cartIcon');
    const cartIconDesktop = document.getElementById('cartIconDesktop');

    function loadCart() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error loading cart:', e);
            return [];
        }
    }

    function saveCart() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch (e) {
            console.error('Error saving cart:', e);
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartIcon) {
            cartIcon.innerHTML = `🛒 Cart (${count})`;
            cartIcon.classList.add('cart-iconn');
        }
        if (cartIconDesktop) {
            cartIconDesktop.innerHTML = `🛒 Cart (${count})`;
            cartIconDesktop.classList.add('cart-iconn');
        }
    }

    function showNotification(message) {
        const existing = document.querySelector('.notification-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: #28a745; color: white;
            padding: 12px 24px; border-radius: 8px; z-index: 10000;
            animation: slideIn 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const inStock = product.inventory && product.inventory.quantity > 0;
        if (!inStock) {
            showNotification('This item is out of stock!');
            return;
        }
        
        const existing = cart.find(item => item.id === productId);
        if (existing) {
            if (existing.quantity < product.inventory.quantity) {
                existing.quantity++;
            } else {
                showNotification('Maximum stock reached!');
                return;
            }
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        saveCart();
        updateCartCount();
        showNotification(`${escapeHtml(product.name)} added to cart!`);
    };

    function showCartModal() {
        const existing = document.querySelector('.cart-modal');
        if (existing) existing.remove();
        
        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        
        const total = cart.reduce((sum, item) => {
            const price = item.discountPrice || item.price;
            return sum + (price * item.quantity);
        }, 0);
        
        let itemsHtml = cart.length > 0 ? cart.map(item => {
            const price = item.discountPrice || item.price;
            return `
                <div class="cart-item">
                    <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="cart-item-image" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><rect fill=%22%23ddd%22 width=%22100%22 height=%22100%22/><text fill=%22%23999%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22>No Image</text></svg>'">
                    <div class="cart-item-details">
                        <h4>${escapeHtml(item.name)}</h4>
                        <p>৳${price} × ${item.quantity}</p>
                    </div>
                    <div class="cart-item-controls">
                        <input type="number" value="${item.quantity}" min="1" max="${item.inventory?.quantity || 99}" 
                            onchange="window.addToCartFromModal('${item.id}', parseInt(this.value))">
                        <button onclick="window.removeFromCart('${item.id}')" class="remove-btn">×</button>
                    </div>
                </div>
            `;
        }).join('') : '<p style="text-align:center;padding:20px;">Your cart is empty</p>';
        
        modal.innerHTML = `
            <div class="cart-modal-content">
                <div class="cart-header">
                    <h3>Your Cart</h3>
                    <button onclick="this.closest('.cart-modal').remove()" class="close-btn">&times;</button>
                </div>
                <div class="cart-items">${itemsHtml}</div>
                <div class="cart-footer">
                    <div class="cart-total"><strong>Total: ৳${total}</strong></div>
                    <div class="cart-actions">
                        <button onclick="window.clearCart()" class="clear-btn">Clear Cart</button>
                        <button onclick="window.checkout()" class="checkout-btn" ${cart.length === 0 ? 'disabled' : ''}>Checkout</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    window.addToCartFromModal = function(productId, quantity) {
        const existing = cart.find(item => item.id === productId);
        const product = products.find(p => p.id === productId);
        
        if (quantity <= 0) {
            window.removeFromCart(productId);
            return;
        }
        
        if (product && quantity > product.inventory?.quantity) {
            showNotification('Maximum stock reached!');
            showCartModal();
            return;
        }
        
        if (existing) {
            existing.quantity = quantity;
            saveCart();
            updateCartCount();
            showCartModal();
        }
    };

    window.removeFromCart = function(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartCount();
        showCartModal();
    };

    window.clearCart = function() {
        cart = [];
        saveCart();
        updateCartCount();
        showCartModal();
    };

    window.checkout = function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        const total = cart.reduce((sum, item) => sum + ((item.discountPrice || item.price) * item.quantity), 0);
        alert(`Checkout!\n\nTotal: ৳${total}\n\nThank you for your order!`);
        cart = [];
        saveCart();
        updateCartCount();
        document.querySelector('.cart-modal')?.remove();
    };

    window.viewDetails = function(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const inStock = product.inventory?.quantity > 0;
            alert(`Product Details:\n\nName: ${product.name}\nPrice: ৳${product.discountPrice || product.price}\n${product.discountPrice ? `Original: ৳${product.price}\n` : ''}Category: ${product.category}\n\n${product.description}\n\nStock: ${inStock ? `In Stock (${product.inventory.quantity} available)` : 'Out of Stock'}`);
        }
    };

    function createProductCard(product) {
        const hasDiscount = product.discountPrice && product.discountPrice < product.price;
        const currentPrice = hasDiscount ? product.discountPrice : product.price;
        const inStock = product.inventory && product.inventory.quantity > 0;
        
        const card = document.createElement('div');
        card.className = 'card-pro';
        card.innerHTML = `
            <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" class="card-img" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22><rect fill=%22%23f5f5f5%22 width=%22200%22 height=%22200%22/><text fill=%22%23999%22 x=%22100%22 y=%22100%22 text-anchor=%22middle%22>No Image</text></svg>'">
            <div class="des-div">
                <h3>${escapeHtml(product.name)}</h3>
                <div class="price-container">
                    ${hasDiscount ? `<span class="original-price">৳${product.price}</span>` : ''}
                    <span class="current-price">৳${currentPrice}</span>
                    ${hasDiscount ? `<span class="discount-badge">${Math.round(((product.price - currentPrice) / product.price) * 100)}% OFF</span>` : ''}
                </div>
                <div class="rating-container">
                    <span class="stars">${'★'.repeat(Math.floor(product.rating.average))}${'☆'.repeat(5 - Math.floor(product.rating.average))}</span>
                    <span class="rating-count">(${product.rating.count})</span>
                </div>
                <div class="stock-status" style="color: ${inStock ? '#28a745' : '#dc3545'}">
                    ${inStock ? 'In Stock' : 'Out of Stock'}
                </div>
                <div class="btn-div">
                    <button class="add-cart" ${!inStock ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>ADD to Cart</button>
                    <button class="order-now-btn">Order Now</button>
                </div>
            </div>
        `;
        
        const addBtn = card.querySelector('.add-cart');
        addBtn.addEventListener('click', () => window.addToCart(product.id));
        
        const orderBtn = card.querySelector('.order-now-btn');
        orderBtn.addEventListener('click', () => {
            if (inStock) {
                window.addToCart(product.id);
            } else {
                showNotification('This item is out of stock!');
            }
        });
        
        return card;
    }

    function displayProducts(filteredProducts = null) {
        if (!container) return;
        
        container.innerHTML = '';
        const productsToDisplay = filteredProducts || products;
        
        productsToDisplay.forEach(product => {
            container.appendChild(createProductCard(product));
        });
    }

    window.filterByCategory = function(category) {
        currentCategory = category;
        const categoryButtons = document.querySelectorAll('.pro-cat-li li');
        const menuLinks = document.querySelectorAll('.menu-links li');
        
        categoryButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-category') === category);
        });
        
        menuLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-category') === category);
        });

        const banner = document.querySelector('.baner-with-pic');
        const orderSec = document.querySelector('.order-sec');
        if (banner) banner.style.display = 'none';
        if (orderSec) orderSec.style.display = 'none';
        
        if (category === 'All') {
            displayProducts();
        } else {
            const filtered = products.filter(p => p.category === category);
            displayProducts(filtered);
        }
    };

    if (cartIcon) {
        cartIcon.addEventListener('click', showCartModal);
    }
    
    if (cartIconDesktop) {
        cartIconDesktop.addEventListener('click', showCartModal);
    }

    // Category buttons
    document.querySelectorAll('.pro-cat-li li').forEach(btn => {
        btn.addEventListener('click', () => {
            window.filterByCategory(btn.getAttribute('data-category'));
        });
    });

    // Mobile Menu links
    document.querySelectorAll('.menu-links li').forEach(link => {
        link.addEventListener('click', () => {
            window.filterByCategory(link.getAttribute('data-category'));
            closeMenuFunc();
        });
    });

    // Mobile Menu functionality
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMenu = document.getElementById('closeMenu');

    function lockBodyScroll() {
        document.body.style.overflow = 'hidden';
    }

    function unlockBodyScroll() {
        document.body.style.overflow = '';
    }

    function openMenu() {
        if (mobileMenu) {
            mobileMenu.classList.add('active');
            mobileMenu.setAttribute('aria-expanded', 'true');
        }
        if (menuOverlay) {
            menuOverlay.classList.add('active');
        }
        if (hamburger) {
            hamburger.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
        }
        lockBodyScroll();
    }

    function closeMenuFunc() {
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-expanded', 'false');
        }
        if (menuOverlay) {
            menuOverlay.classList.remove('active');
        }
        if (hamburger) {
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
        unlockBodyScroll();
    }

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                closeMenuFunc();
            } else {
                openMenu();
            }
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', closeMenuFunc);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenuFunc);
    }

    // Fixed Escape key handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                closeMenuFunc();
            }
            const cartModal = document.querySelector('.cart-modal');
            if (cartModal) {
                cartModal.remove();
            }
        }
    });

    // Search Bar Toggle on Scroll
    const headerMobile = document.querySelector('.header-mobile');
    const searchToggle = document.getElementById('searchToggle');
    let lastScrollY = 0;
    let searchVisible = true;
    let ticking = false;
    const SCROLL_THRESHOLD = 100;

    function toggleSearchBar(show) {
        if (!headerMobile) return;
        
        if (show && !searchVisible) {
            headerMobile.classList.remove('hide');
            searchToggle.classList.remove('show');
            searchVisible = true;
        } else if (!show && searchVisible) {
            headerMobile.classList.add('hide');
            searchToggle.classList.add('show');
            searchVisible = false;
        }
    }

    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY <= 10) {
            toggleSearchBar(true);
            ticking = false;
            return;
        }
        
        if (currentScrollY > lastScrollY && currentScrollY > SCROLL_THRESHOLD) {
            toggleSearchBar(false);
        } else if (currentScrollY < lastScrollY) {
            toggleSearchBar(true);
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleScroll();
            });
            ticking = true;
        }
    });

    if (searchToggle) {
        searchToggle.addEventListener('click', function() {
            toggleSearchBar(!searchVisible);
            if (!searchVisible) {
                const searchInput = document.getElementById('search-input-mobile');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        });
    }

    // Mobile search functionality
    const searchInputMobile = document.getElementById('search-input-mobile');
    if (searchInputMobile) {
        searchInputMobile.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            const banner = document.querySelector('.baner-with-pic');
            const orderSec = document.querySelector('.order-sec');
            if (banner) banner.style.display = 'none';
            if (orderSec) orderSec.style.display = 'none';
            
            if (query === '') {
                displayProducts();
            } else {
                const filtered = products.filter(p => 
                    p.name.toLowerCase().includes(query) || 
                    p.category.toLowerCase().includes(query)
                );
                displayProducts(filtered);
            }
        });
    }

    // Desktop search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            const banner = document.querySelector('.baner-with-pic');
            const orderSec = document.querySelector('.order-sec');
            if (banner) banner.style.display = 'none';
            if (orderSec) orderSec.style.display = 'none';
            
            if (query === '') {
                displayProducts();
            } else {
                const filtered = products.filter(p => 
                    p.name.toLowerCase().includes(query) || 
                    p.category.toLowerCase().includes(query)
                );
                displayProducts(filtered);
            }
        });
    }

    // Missing functions from HTML
    window.showUserMenu = function() {
        showNotification('Login/Register feature coming soon!');
    };

    window.showHelpCenter = function() {
        alert(`Help Center\n\nFrequently Asked Questions:\n\nHow do I place an order?\nBrowse products, add to cart, and checkout with your delivery details.\n\nWhat payment methods do you accept?\nWe accept Cash on Delivery, bKash, Nagad, and Bank Transfer.\n\nHow long does delivery take?\nDhaka: 1-2 days, Other cities: 3-5 days.`);
    };

    window.showShippingInfo = function() {
        alert(`Shipping Information\n\nDelivery Areas:\nWe deliver to all major cities and towns in Bangladesh.\n\nDelivery Charges:\nOrders over ৳1000: Free delivery\nOrders under ৳1000: ৳60 delivery charge`);
    };

    window.showReturnPolicy = function() {
        alert(`Return Policy\n\nWe want you to be completely satisfied with your purchase.\n\nReturn within 7 days of delivery.\nProduct must be unused and in original packaging.\nPerishable items (honey, ghee, etc.) may not be eligible for return.`);
    };

    window.showTerms = function() {
        alert(`Terms & Conditions\n\n1. Product Information: We strive to provide accurate product descriptions.\n\n2. Pricing: All prices are in Bangladeshi Taka (BDT).\n\n3. Payment: Payment must be made at the time of order or upon delivery for COD.\n\n4. Privacy: We respect your privacy and protect your personal information.`);
    };

    window.subscribeNewsletter = function() {
        const email = document.getElementById('newsletter-email');
        if (email && email.value) {
            if (email.value.includes('@')) {
                showNotification('Thank you for subscribing!');
                email.value = '';
            } else {
                showNotification('Please enter a valid email!');
            }
        } else {
            showNotification('Please enter your email!');
        }
    };

    // Initialize
    updateCartCount();
    displayProducts();
});
