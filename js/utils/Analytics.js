import { API_BASE_URL } from './Constants.js';
import { Helpers } from './Helpers.js';

class Analytics {
  constructor() {
    this.apiEndpoint = API_BASE_URL;
    this.enabled = true;
    this.sessionId = this.generateSessionId();
    this.init();
  }

  init() {
    // Track page view on load
    this.trackPageView(window.location.pathname);
    
    // Track user engagement
    this.trackUserEngagement();
    
    // Track form interactions
    this.trackFormInteractions();
    
    // Track scroll depth
    this.trackScrollDepth();
    
    // Track time on page
    this.trackTimeOnPage();
  }

  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  // Track page views
  trackPageView(page, properties = {}) {
    const eventData = {
      event: 'page_view',
      page: page || window.location.pathname,
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      deviceType: Helpers.getDeviceType(),
      ...properties
    };

    this.sendToAnalytics(eventData);
  }

  // Track user interactions
  trackInteraction(action, element, properties = {}) {
    const eventData = {
      event: 'user_interaction',
      action: action,
      element: element,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      ...properties
    };

    this.sendToAnalytics(eventData);
  }

  // Track product interactions
  trackProductEvent(eventName, product, properties = {}) {
    const eventData = {
      event: eventName,
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      price: product.currentPrice,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      ...properties
    };

    this.sendToAnalytics(eventData);
  }

  // Track search events
  trackSearch(query, resultsCount = 0) {
    const eventData = {
      event: 'search',
      query: query,
      results_count: resultsCount,
      timestamp: Date.now(),
      sessionId: this.sessionId
    };

    this.sendToAnalytics(eventData);
  }

  // Track category filter
  trackCategoryFilter(category) {
    const eventData = {
      event: 'category_filter',
      category: category,
      timestamp: Date.now(),
      sessionId: this.sessionId
    };

    this.sendToAnalytics(eventData);
  }

  // Track cart events
  trackCartEvent(eventName, product, quantity = 1, properties = {}) {
    const eventData = {
      event: eventName,
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      price: product.currentPrice,
      quantity: quantity,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      ...properties
    };

    this.sendToAnalytics(eventData);
  }

  // Track checkout events
  trackCheckoutEvent(eventName, properties = {}) {
    const eventData = {
      event: eventName,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      ...properties
    };

    this.sendToAnalytics(eventData);
  }

  // Track order completion
  trackOrderCompleted(orderData, items) {
    const eventData = {
      event: 'order_completed',
      order_id: orderData.id || orderData.orderNumber,
      total_amount: orderData.total,
      currency: 'BDT',
      payment_method: orderData.paymentMethod,
      items: items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        category: item.product.category,
        price: item.product.currentPrice,
        quantity: item.quantity
      })),
      timestamp: Date.now(),
      sessionId: this.sessionId
    };

    this.sendToAnalytics(eventData);
  }

  // Track form submissions
  trackFormSubmission(formName, success = true, errors = []) {
    const eventData = {
      event: 'form_submission',
      form_name: formName,
      success: success,
      errors: errors,
      timestamp: Date.now(),
      sessionId: this.sessionId
    };

    this.sendToAnalytics(eventData);
  }

  // Track errors
  trackError(error, context = '') {
    const eventData = {
      event: 'error',
      error_message: error.message || error,
      error_stack: error.stack,
      context: context,
      url: window.location.href,
      timestamp: Date.now(),
      sessionId: this.sessionId
    };

    this.sendToAnalytics(eventData);
  }

  // Track performance metrics
  trackPerformance() {
    if ('performance' in window) {
      const timing = performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      
      const eventData = {
        event: 'performance',
        load_time: loadTime,
        dom_content_loaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        first_paint: performance.getEntriesByType('paint')[0]?.startTime || 0,
        first_contentful_paint: performance.getEntriesByType('paint')[1]?.startTime || 0,
        timestamp: Date.now(),
        sessionId: this.sessionId
      };

      this.sendToAnalytics(eventData);
    }
  }

  // Send data to analytics endpoint
  async sendToAnalytics(eventData) {
    if (!this.enabled) return;

    try {
      await fetch(`${this.apiEndpoint}/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
      // Fail silently to not break user experience
    }
  }

  // Track user engagement events
  trackUserEngagement() {
    // Track click events on important elements
    document.addEventListener('click', (e) => {
      const target = e.target;

      // Track add to cart clicks
      if (target.classList.contains('add-cart') || target.closest('.add-cart')) {
        this.trackInteraction('add_to_cart', 'button', {
          position: 'product_card'
        });
      }

      // Track buy now clicks
      if (target.classList.contains('order-now-btn') || target.closest('.order-now-btn')) {
        this.trackInteraction('view_product', 'button', {
          position: 'product_card'
        });
      }

      // Track category clicks
      if (target.classList.contains('pro-cat-li') || target.closest('.pro-cat-li li')) {
        const category = target.getAttribute('data-category') || 
                       target.closest('li').getAttribute('data-category');
        this.trackCategoryFilter(category);
      }

      // Track search
      if (target.id === 'search-input') {
        target.addEventListener('search', (e) => {
          if (e.target.value.trim()) {
            this.trackSearch(e.target.value);
          }
        });
      }

      // Track cart icon clicks
      if (target.classList.contains('cart-icon') || target.closest('.cart-icon')) {
        this.trackInteraction('view_cart', 'button', {
          position: 'header'
        });
      }

      // Track user account clicks
      if (target.classList.contains('user-account') || target.closest('.user-account')) {
        this.trackInteraction('view_account', 'button', {
          position: 'header'
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      let formName = 'unknown';

      if (form.id === 'checkout-form') {
        formName = 'checkout';
      } else if (form.classList.contains('auth-modal-content')) {
        formName = 'authentication';
      } else if (form.id === 'newsletter-form') {
        formName = 'newsletter';
      }

      this.trackFormSubmission(formName, true);
    });
  }

  // Track scroll depth
  trackScrollDepth() {
    const maxScroll = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    ) - window.innerHeight;

    const thresholds = [25, 50, 75, 90, 100];
    const trackedThresholds = new Set();

    window.addEventListener('scroll', Helpers.throttle(() => {
      const scrollPercent = Math.round((window.scrollY / maxScroll) * 100);

      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
          trackedThresholds.add(threshold);
          this.trackInteraction('scroll_depth', 'page', {
            depth_percent: threshold
          });
        }
      });
    }, 1000));
  }

  // Track time on page
  trackTimeOnPage() {
    let startTime = Date.now();
    let isActive = true;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isActive = false;
        const timeSpent = Date.now() - startTime;
        this.trackInteraction('time_on_page', 'page', {
          duration_ms: timeSpent,
          duration_seconds: Math.round(timeSpent / 1000)
        });
      } else {
        isActive = true;
        startTime = Date.now();
      }
    });

    // Track time on page before leaving
    window.addEventListener('beforeunload', () => {
      if (isActive) {
        const timeSpent = Date.now() - startTime;
        this.trackInteraction('time_on_page', 'page', {
          duration_ms: timeSpent,
          duration_seconds: Math.round(timeSpent / 1000)
        });
      }
    });
  }

  // Enable/disable analytics
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  // Get current session ID
  getSessionId() {
    return this.sessionId;
  }
}

export { Analytics };