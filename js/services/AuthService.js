class AuthService {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.reload();
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem("authToken");
  }

  getAuthToken() {
    return localStorage.getItem("authToken");
  }

  async updateProfile(userData) {
    try {
      const response = await fetch(`${this.baseURL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Profile update failed");
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  }

  async addAddress(addressData) {
    try {
      const response = await fetch(`${this.baseURL}/auth/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add address");
      }

      return await response.json();
    } catch (error) {
      console.error("Add address error:", error);
      throw error;
    }
  }
}

export { AuthService };