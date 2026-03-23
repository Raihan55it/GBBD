class APIService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async getProducts(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${this.baseURL}/products?${queryString}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      // Fallback to local data will be handled by the calling code
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const response = await fetch(`${this.baseURL}/products/${id}`);
      if (!response.ok) throw new Error("Product not found");
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async getProductsByCategory(category) {
    try {
      const response = await fetch(`${this.baseURL}/products/category/${category}`);
      if (!response.ok) throw new Error("Failed to fetch products by category");
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async searchProducts(query) {
    try {
      const response = await fetch(`${this.baseURL}/products/search/${query}`);
      if (!response.ok) throw new Error("Failed to search products");
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async getFeaturedProducts() {
    try {
      const response = await fetch(`${this.baseURL}/products/featured/all`);
      if (!response.ok) throw new Error("Failed to fetch featured products");
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async addProductReview(productId, reviewData) {
    try {
      const response = await fetch(`${this.baseURL}/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) throw new Error("Failed to add review");
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async getCategories() {
    try {
      const response = await fetch(`${this.baseURL}/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async getAnalyticsData(eventData) {
    try {
      const response = await fetch(`${this.baseURL}/analytics/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) throw new Error("Failed to track analytics");
      return await response.json();
    } catch (error) {
      console.error("Analytics Error:", error);
      // Analytics errors shouldn't break the app
      return null;
    }
  }

  // Generic API request method
  async makeRequest(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const defaultOptions = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const finalOptions = { ...defaultOptions, ...options };

      const response = await fetch(url, finalOptions);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request to ${endpoint} failed:`, error);
      throw error;
    }
  }
}

export { APIService };