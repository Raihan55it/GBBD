class CheckoutService {
  constructor(baseURL, authToken) {
    this.baseURL = baseURL;
    this.authToken = authToken;
  }

  async createOrder(orderData) {
    try {
      const response = await fetch(`${this.baseURL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.authToken}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create order");
      }

      return await response.json();
    } catch (error) {
      console.error("Create order error:", error);
      throw error;
    }
  }

  async getUserOrders() {
    try {
      const response = await fetch(`${this.baseURL}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch orders");
      return await response.json();
    } catch (error) {
      console.error("Get orders error:", error);
      throw error;
    }
  }

  async getOrderById(orderId) {
    try {
      const response = await fetch(`${this.baseURL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch order");
      return await response.json();
    } catch (error) {
      console.error("Get order error:", error);
      throw error;
    }
  }

  async cancelOrder(orderId) {
    try {
      const response = await fetch(`${this.baseURL}/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to cancel order");
      return await response.json();
    } catch (error) {
      console.error("Cancel order error:", error);
      throw error;
    }
  }

  async confirmPayment(orderId) {
    try {
      const response = await fetch(`${this.baseURL}/orders/${orderId}/payment-confirm`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });

      if (!response.ok) throw new Error("Failed to confirm payment");
      return await response.json();
    } catch (error) {
      console.error("Payment confirmation error:", error);
      throw error;
    }
  }

  calculateShipping(subtotal, city) {
    // Free shipping for orders over 1000 BDT
    if (subtotal >= 1000) return 0;
    
    // Different shipping rates for different cities
    const shippingRates = {
      "Dhaka": 60,
      "Chittagong": 80,
      "Sylhet": 90,
      "Rajshahi": 100,
      "Khulna": 85,
      "Barisal": 95,
      "Rangpur": 110,
      "Mymensingh": 105,
    };
    
    return shippingRates[city] || 120; // Default rate for other cities
  }

  calculateTax(subtotal) {
    return subtotal * 0.05; // 5% tax
  }

  calculateOrderTotal(subtotal, shipping, tax) {
    return subtotal + shipping + tax;
  }

  validateOrderData(orderData) {
    const errors = [];
    
    if (!orderData.items || orderData.items.length === 0) {
      errors.push("Order must contain at least one item");
    }
    
    if (!orderData.shippingAddress) {
      errors.push("Shipping address is required");
    } else {
      const { firstName, lastName, phone, street, city, district } = orderData.shippingAddress;
      if (!firstName || !lastName || !phone || !street || !city || !district) {
        errors.push("All shipping address fields are required");
      }
    }
    
    if (!orderData.paymentMethod) {
      errors.push("Payment method is required");
    }
    
    return errors;
  }
}

export { CheckoutService };