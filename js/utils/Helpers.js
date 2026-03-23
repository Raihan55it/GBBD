import { VALIDATION_PATTERNS, ERROR_MESSAGES } from './Constants.js';

// Utility Functions
class Helpers {
  // Debounce function to limit function calls
  static debounce(func, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }

  // Throttle function to limit function calls
  static throttle(func, limit) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Escape HTML to prevent XSS
  static escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }

  // Format currency
  static formatCurrency(amount, currency = "৳") {
    return `${currency}${Number(amount).toLocaleString('en-BD')}`;
  }

  // Get current price (discount or regular)
  static getCurrentPrice(product) {
    return product.discountPrice && product.discountPrice < product.price 
        ? product.discountPrice 
        : product.price;
  }

  // Check if product is in stock
  static isInStock(product) {
    return product && product.inventory && product.inventory.quantity > 0;
  }

  // Enrich product with computed properties
  static enrichProduct(product) {
    return {
        ...product,
        hasDiscount: product.discountPrice && product.discountPrice < product.price,
        currentPrice: this.getCurrentPrice(product),
        discountPercentage: this.calculateDiscountPercentage(product.price, product.discountPrice),
        inStock: this.isInStock(product),
        ratingStars: this.generateStarRating(product.rating?.average || 0)
    };
  }

  // Format date
  static formatDate(date, options = {}) {
    const defaultOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const finalOptions = { ...defaultOptions, ...options };
    return new Date(date).toLocaleDateString("en-US", finalOptions);
  }

  // Validate email
  static validateEmail(email) {
    return VALIDATION_PATTERNS.EMAIL.test(email);
  }

  // Validate phone number (Bangladeshi format)
  static validatePhone(phone) {
    return VALIDATION_PATTERNS.PHONE.test(phone);
  }

  // Validate password
  static validatePassword(password) {
    return VALIDATION_PATTERNS.PASSWORD.test(password);
  }

  // Generate random ID
  static generateId(prefix = "") {
    return `${prefix}${Math.random().toString(36).substr(2, 9)}`;
  }

  // Capitalize first letter
  static capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  // Truncate text
  static truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  }

  // Get URL parameters
  static getUrlParams() {
    const params = {};
    const urlParams = new URLSearchParams(window.location.search);
    for (const [key, value] of urlParams) {
      params[key] = value;
    }
    return params;
  }

  // Set URL parameter
  static setUrlParam(key, value) {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.replaceState({}, "", url);
  }

  // Remove URL parameter
  static removeUrlParam(key) {
    const url = new URL(window.location);
    url.searchParams.delete(key);
    window.history.replaceState({}, "", url);
  }

  // Copy to clipboard
  static async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Failed to copy text: ", err);
      return false;
    }
  }

  // Download data as file
  static downloadFile(data, filename, type = "text/plain") {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // Check if element is in viewport
  static isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Smooth scroll to element
  static scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  // Get element's offset from top of document
  static getElementOffset(element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return rect.top + scrollTop;
  }

  // Check if device is mobile
  static isMobile() {
    return window.innerWidth <= 768;
  }

  // Check if device is tablet
  static isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
  }

  // Check if device is desktop
  static isDesktop() {
    return window.innerWidth > 1024;
  }

  // Get device type
  static getDeviceType() {
    if (this.isMobile()) return "mobile";
    if (this.isTablet()) return "tablet";
    return "desktop";
  }

  // Local storage helpers
  static setLocalStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Failed to set localStorage:", error);
      return false;
    }
  }

  static getLocalStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Failed to get localStorage:", error);
      return defaultValue;
    }
  }

  static removeLocalStorage(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Failed to remove localStorage:", error);
      return false;
    }
  }

  static clearLocalStorage() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
      return false;
    }
  }

  // Session storage helpers
  static setSessionStorage(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Failed to set sessionStorage:", error);
      return false;
    }
  }

  static getSessionStorage(key, defaultValue = null) {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Failed to getSessionStorage:", error);
      return defaultValue;
    }
  }

  // Form validation helper
  static validateForm(formData, rules) {
    const errors = {};
    
    for (const [field, rule] of Object.entries(rules)) {
      const value = formData[field];
      
      if (rule.required && (!value || value.trim() === "")) {
        errors[field] = `${this.capitalize(field)} is required`;
        continue;
      }
      
      if (value && rule.type === "email" && !this.validateEmail(value)) {
        errors[field] = ERROR_MESSAGES.INVALID_EMAIL;
      }
      
      if (value && rule.type === "phone" && !this.validatePhone(value)) {
        errors[field] = ERROR_MESSAGES.INVALID_PHONE;
      }
      
      if (value && rule.type === "password" && !this.validatePassword(value)) {
        errors[field] = ERROR_MESSAGES.PASSWORD_SHORT;
      }
      
      if (value && rule.minLength && value.length < rule.minLength) {
        errors[field] = `${this.capitalize(field)} must be at least ${rule.minLength} characters`;
      }
      
      if (value && rule.maxLength && value.length > rule.maxLength) {
        errors[field] = `${this.capitalize(field)} must not exceed ${rule.maxLength} characters`;
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  // Calculate discount percentage
  static calculateDiscountPercentage(originalPrice, discountedPrice) {
    if (!originalPrice || originalPrice <= discountedPrice) return 0;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  }

  // Generate star rating HTML
  static generateStarRating(rating, maxRating = 5) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = maxRating - fullStars - halfStar;
    
    let stars = "";
    stars += "★".repeat(fullStars);
    if (halfStar) stars += "☆";
    stars += "☆".repeat(emptyStars);
    
    return stars;
  }

  // Show loading spinner
  static showLoading(container, message = "Loading...") {
    container.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>${message}</p>
      </div>
    `;
  }

  // Show error message
  static showError(container, message, retryCallback = null) {
    container.innerHTML = `
      <div class="error-container">
        <div class="error-icon">⚠️</div>
        <p>${message}</p>
        ${retryCallback ? `<button onclick="${retryCallback}" class="retry-btn">Retry</button>` : ""}
      </div>
    `;
  }

  // Create notification
  static showNotification(message, type = "info", duration = 3000) {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, duration);
  }
}

export { Helpers };