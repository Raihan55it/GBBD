// API Configuration
export const API_BASE_URL = "http://localhost:5000/api";

// CSS Selectors
export const SELECTORS = {
  PRODUCT_CONTAINER: "#allProduct",
  CART_ICON: ".cart-icon",
  SEARCH_INPUT: "#search-input",
  SCROLL_BUTTON: "#myBtn",
  CATEGORY_BUTTONS: ".pro-cat-li li",
  BANNER: ".baner-with-pic",
  ORDER_SECTION: ".order-sec",
  FILTER_ITEM: ".filter-item",
  SEARCH_ICON: ".search-icon",
  USER_ACCOUNT: ".user-account",
  NEWSLETTER_EMAIL: "#newsletter-email",
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH_ON_DELIVERY: "cash_on_delivery",
  MOBILE_BANKING: "mobile_banking",
  BANK_TRANSFER: "bank_transfer",
};

// Categories
export const CATEGORIES = {
  ALL: "All",
  DATES: "Dates",
  FUN_FOOD: "Fun Food",
  GHEE: "Ghee",
  HONEY: "Honey",
  MASALA: "Masala",
  NUTS: "Nuts",
  OIL: "Oil",
  TEA_COFFEE: "Tea Coffee",
  KHEJUR_GUR: "Khejur Gur",
};

// Shipping Rates (BDT)
export const SHIPPING_RATES = {
  "Dhaka": 60,
  "Chittagong": 80,
  "Sylhet": 90,
  "Rajshahi": 100,
  "Khulna": 85,
  "Barisal": 95,
  "Rangpur": 110,
  "Mymensingh": 105,
  "default": 120,
};

// Free Shipping Threshold
export const FREE_SHIPPING_THRESHOLD = 1000;

// Tax Rate
export const TAX_RATE = 0.05; // 5%

// Rating Defaults
export const DEFAULT_RATING = {
  average: 4.0,
  count: 0,
};

// Stock Threshold for Low Stock Warning
export const LOW_STOCK_THRESHOLD = 10;

// Modal Classes
export const MODAL_CLASSES = {
  AUTH: "auth-modal",
  CHECKOUT: "checkout-modal",
  PRODUCT: "product-modal",
  INFO: "info-modal",
  USER_ACTIONS: "user-actions-modal",
};

// Error Messages
export const ERROR_MESSAGES = {
  LOGIN_FAILED: "Login failed. Please check your credentials.",
  REGISTRATION_FAILED: "Registration failed. Please try again.",
  ORDER_FAILED: "Order failed. Please try again.",
  CART_EMPTY: "Your cart is empty!",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid Bangladeshi phone number",
  PASSWORD_SHORT: "Password must be at least 6 characters",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful!",
  REGISTRATION_SUCCESS: "Registration successful!",
  ORDER_SUCCESS: "Order placed successfully!",
  ADDED_TO_CART: "Product added to cart!",
  SUBSCRIPTION_SUCCESS: "Thank you for subscribing to our newsletter!",
};

// Animation Durations (ms)
export const ANIMATION_DURATION = {
  NOTIFICATION: 3000,
  DEBOUNCE_DELAY: 300,
  MODAL_FADE: 300,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
};

// Image Configurations
export const IMAGE_CONFIG = {
  QUALITY: 80,
  PLACEHOLDER: "imageForGBBD/logo.webp",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER: "user",
  CART: "cart",
  WISHLIST: "wishlist",
  RECENTLY_VIEWED: "recentlyViewed",
};

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^01[3-9]\d{8}$/,
  PASSWORD: /.{6,}/,
};

// Colors (for dynamic styling)
export const COLORS = {
  PRIMARY: "#28a745",
  SECONDARY: "#007bff",
  DANGER: "#dc3545",
  WARNING: "#ffc107",
  INFO: "#17a2b8",
  SUCCESS: "#28a745",
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  MOBILE: 576,
  TABLET: 768,
  DESKTOP: 992,
  LARGE_DESKTOP: 1200,
};

export default {
  API_BASE_URL,
  SELECTORS,
  PAYMENT_METHODS,
  CATEGORIES,
  SHIPPING_RATES,
  FREE_SHIPPING_THRESHOLD,
  TAX_RATE,
  DEFAULT_RATING,
  LOW_STOCK_THRESHOLD,
  MODAL_CLASSES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ANIMATION_DURATION,
  PAGINATION,
  IMAGE_CONFIG,
  STORAGE_KEYS,
  VALIDATION_PATTERNS,
  COLORS,
  BREAKPOINTS,
};