class ModalManager {
  constructor(cartService, authService, checkoutService) {
    this.cart = cartService;
    this.auth = authService;
    this.checkout = checkoutService;
  }

  showLoginModal() {
    const existingModal = document.querySelector(".auth-modal");
    if (existingModal) existingModal.remove();

    const modal = document.createElement("div");
    modal.className = "auth-modal";
    modal.innerHTML = `
        <div class="auth-modal-content">
            <div class="auth-header">
                <h3>Login to Continue</h3>
                <button onclick="this.closest('.auth-modal').remove()" class="close-btn">&times;</button>
            </div>
            <form onsubmit="handleLogin(event)">
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" required>
                </div>
                <div class="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" required>
                </div>
                <button type="submit" class="auth-submit-btn">Login</button>
                <p>Don't have an account? <a href="#" onclick="modalManager.showRegisterModal()">Register</a></p>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
  }

  showRegisterModal() {
    const existingModal = document.querySelector(".auth-modal");
    if (existingModal) existingModal.remove();

    const modal = document.createElement("div");
    modal.className = "auth-modal";
    modal.innerHTML = `
        <div class="auth-modal-content">
            <div class="auth-header">
                <h3>Create Account</h3>
                <button onclick="this.closest('.auth-modal').remove()" class="close-btn">&times;</button>
            </div>
            <form onsubmit="handleRegister(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label>First Name:</label>
                        <input type="text" name="firstName" required>
                    </div>
                    <div class="form-group">
                        <label>Last Name:</label>
                        <input type="text" name="lastName" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" required>
                </div>
                <div class="form-group">
                    <label>Phone:</label>
                    <input type="tel" name="phone" pattern="01[3-9]\\d{8}" placeholder="01xxxxxxxxx" required>
                </div>
                <div class="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" minlength="6" required>
                </div>
                <button type="submit" class="auth-submit-btn">Register</button>
                <p>Already have an account? <a href="#" onclick="modalManager.showLoginModal()">Login</a></p>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
  }

  showCheckoutModal(cartItems, subtotal) {
    const existingModal = document.querySelector(".checkout-modal");
    if (existingModal) existingModal.remove();

    const user = this.auth.getCurrentUser();
    const shipping = subtotal >= 1000 ? 0 : 60;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    const itemsHtml = cartItems
      .map(
        (item) => `
        <div class="checkout-item">
            <img src="${item.product.image}" alt="${item.product.name}">
            <div class="item-details">
                <h4>${item.product.name}</h4>
                <p>৳${item.product.currentPrice} × ${item.quantity}</p>
            </div>
            <div class="item-total">
                ৳${(item.product.currentPrice * item.quantity).toFixed(2)}
            </div>
        </div>
    `,
      )
      .join("");

    const modal = document.createElement("div");
    modal.className = "checkout-modal";
    modal.innerHTML = `
        <div class="checkout-modal-content">
            <div class="checkout-header">
                <h3>Checkout</h3>
                <button onclick="this.closest('.checkout-modal').remove()" class="close-btn">&times;</button>
            </div>
            <div class="checkout-body">
                <div class="checkout-section">
                    <h4>Order Summary</h4>
                    <div class="order-items">
                        ${itemsHtml}
                    </div>
                    <div class="order-totals">
                        <div class="total-row">
                            <span>Subtotal:</span>
                            <span>৳${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="total-row">
                            <span>Shipping:</span>
                            <span>৳${shipping.toFixed(2)}</span>
                        </div>
                        <div class="total-row">
                            <span>Tax (5%):</span>
                            <span>৳${tax.toFixed(2)}</span>
                        </div>
                        <div class="total-row grand-total">
                            <span>Total:</span>
                            <span>৳${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div class="checkout-section">
                    <h4>Shipping Information</h4>
                    <form id="checkout-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>First Name:</label>
                                <input type="text" name="firstName" value="${user && user.firstName ? user.firstName : ""}" required>
                            </div>
                            <div class="form-group">
                                <label>Last Name:</label>
                                <input type="text" name="lastName" value="${user && user.lastName ? user.lastName : ""}" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Phone:</label>
                            <input type="tel" name="phone" value="${user && user.phone ? user.phone : ""}" pattern="01[3-9]\\d{8}" required>
                        </div>
                        <div class="form-group">
                            <label>Street Address:</label>
                            <input type="text" name="street" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>City:</label>
                                <input type="text" name="city" required>
                            </div>
                            <div class="form-group">
                                <label>District:</label>
                                <input type="text" name="district" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Postal Code (Optional):</label>
                            <input type="text" name="postalCode">
                        </div>
                        
                        <h4>Payment Method</h4>
                        <div class="payment-methods">
                            <label>
                                <input type="radio" name="paymentMethod" value="cash_on_delivery" checked>
                                Cash on Delivery
                            </label>
                            <label>
                                <input type="radio" name="paymentMethod" value="mobile_banking">
                                Mobile Banking
                            </label>
                            <label>
                                <input type="radio" name="paymentMethod" value="bank_transfer">
                                Bank Transfer
                            </label>
                        </div>

                        <div class="form-group">
                            <label>Order Notes (Optional):</label>
                            <textarea name="notes" rows="3"></textarea>
                        </div>

                        <button type="submit" class="place-order-btn">Place Order</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Handle form submission
    document.getElementById("checkout-form").addEventListener("submit", (e) => {
      this.handleCheckoutSubmit(e, cartItems);
    });
  }

  showProductModal(product) {
    const existingModal = document.querySelector(".product-modal");
    if (existingModal) existingModal.remove();

    const modal = document.createElement("div");
    modal.className = "product-modal";
    modal.innerHTML = `
        <div class="product-modal-content">
            <div class="product-modal-header">
                <h3>${product.name}</h3>
                <button onclick="this.closest('.product-modal').remove()" class="close-btn">&times;</button>
            </div>
            <div class="product-modal-body">
                <div class="product-image-section">
                    <img src="${product.image}" alt="${product.name}" class="product-modal-image">
                </div>
                <div class="product-details-section">
                    <div class="product-modal-price">
                        ${
                          product.hasDiscount
                            ? `
                            <span class="original-price">৳${product.price}</span>
                            <span class="current-price">৳${product.currentPrice}</span>
                            <span class="discount-badge">${product.discountPercentage}% OFF</span>
                        `
                            : `
                            <span class="current-price">৳${product.currentPrice}</span>
                        `
                        }
                    </div>
                    
                    <div class="product-modal-rating">
                        <span class="stars">${"★".repeat(Math.floor(product.rating.average))}${"☆".repeat(5 - Math.floor(product.rating.average))}</span>
                        <span class="rating-count">(${product.rating.count} reviews)</span>
                    </div>

                    <div class="product-modal-description">
                        <h4>Description</h4>
                        <p>${product.description}</p>
                    </div>

                    <div class="product-modal-meta">
                        <p><strong>SKU:</strong> ${product.sku}</p>
                        <p><strong>Category:</strong> ${product.category}</p>
                        <p><strong>Availability:</strong> <span style="color: ${product.inStock ? "#28a745" : "#dc3545"}">${product.inStock ? "In Stock" : "Out of Stock"}</span></p>
                    </div>

                    <div class="product-modal-actions">
                        <button onclick="cart.addItem(window.productManager.getProductById('${product.id}'))" class="add-to-cart-btn" ${!product.inStock ? "disabled" : ""}>
                            ${product.inStock ? "Add to Cart" : "Out of Stock"}
                        </button>
                        <button onclick="checkoutWithProduct('${product.id}')" class="buy-now-btn" ${!product.inStock ? "disabled" : ""}>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
  }

  showInfoModal(title, content) {
    const existingModal = document.querySelector(".info-modal");
    if (existingModal) existingModal.remove();

    const modal = document.createElement("div");
    modal.className = "info-modal";
    modal.innerHTML = `
        <div class="info-modal-content">
            <div class="info-modal-header">
                <h3>${title}</h3>
                <button onclick="this.closest('.info-modal').remove()" class="close-btn">&times;</button>
            </div>
            <div class="info-modal-body">
                ${content}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
  }

  showUserActionsModal(user) {
    const existingModal = document.querySelector(".user-actions-modal");
    if (existingModal) existingModal.remove();

    const modal = document.createElement("div");
    modal.className = "user-actions-modal";
    modal.innerHTML = `
        <div class="user-actions-content">
            <div class="user-actions-header">
                <h3>Welcome, ${user.firstName}!</h3>
                <button onclick="this.closest('.user-actions-modal').remove()" class="close-btn">&times;</button>
            </div>
            <div class="user-actions-body">
                <div class="user-info">
                    <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.phone}</p>
                </div>
                <div class="user-menu-items">
                    <button onclick="showMyOrders()" class="user-menu-btn">📦 My Orders</button>
                    <button onclick="showMyProfile()" class="user-menu-btn">👤 My Profile</button>
                    <button onclick="showMyWishlist()" class="user-menu-btn">❤️ My Wishlist</button>
                    <button onclick="logout()" class="user-menu-btn logout-btn">🚪 Logout</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
  }

  async handleCheckoutSubmit(event, cartItems) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const orderData = {
      items: cartItems.map((item) => ({
        product: item.product.id,
        quantity: item.quantity,
      })),
      shippingAddress: {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        phone: formData.get("phone"),
        street: formData.get("street"),
        city: formData.get("city"),
        district: formData.get("district"),
        postalCode: formData.get("postalCode"),
      },
      paymentMethod: formData.get("paymentMethod"),
      notes: formData.get("notes"),
    };

    try {
      const result = await this.checkout.createOrder(orderData);
      document.querySelector(".checkout-modal").remove();
      this.cart.clearCart();
      this.cart.showNotification(
        "Order placed successfully! Order #" + result.order.orderNumber,
      );
    } catch (error) {
      this.cart.showNotification("Order failed: " + error.message);
    }
  }
}

export { ModalManager };