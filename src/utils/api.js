const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.accessToken = localStorage.getItem("accessToken");
    this.refreshToken = localStorage.getItem("refreshToken");
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if we have an access token
    if (this.accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Handle token expiration
      if (response.status === 401 && data.code === "TOKEN_EXPIRED") {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the original request with new token
          config.headers.Authorization = `Bearer ${this.accessToken}`;
          const retryResponse = await fetch(url, config);
          return await retryResponse.json();
        } else {
          // Refresh failed, redirect to login
          this.clearTokens();
          window.location.href = "/";
          throw new Error("Session expired. Please log in again.");
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async refreshAccessToken() {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setTokens(
          data.data.tokens.accessToken,
          data.data.tokens.refreshToken
        );
        return true;
      } else {
        this.clearTokens();
        return false;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.clearTokens();
      return false;
    }
  }

  // Auth endpoints
  async register(userData) {
    const response = await this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.success && response.data.tokens) {
      this.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
      localStorage.setItem("currentUser", JSON.stringify(response.data.user));
    }

    return response;
  }

  async login(credentials) {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data.tokens) {
      this.setTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken
      );
      localStorage.setItem("currentUser", JSON.stringify(response.data.user));
    }

    return response;
  }

  async logout() {
    try {
      await this.request("/auth/logout", {
        method: "POST",
        body: JSON.stringify({
          refreshToken: this.refreshToken,
        }),
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      this.clearTokens();
    }
  }



  async getCurrentUser() {
    return await this.request("/auth/me");
  }

  async updateProfile(userData) {
    const response = await this.request("/auth/me", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
    
    // Update localStorage with new user data if successful
    if (response.success && response.data.user) {
      localStorage.setItem("currentUser", JSON.stringify(response.data.user));
    }
    
    return response;
  }

  async changePassword(passwordData) {
    return await this.request("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    });
  }

  // Utility methods
  isAuthenticated() {
    return !!this.accessToken;
  }

  getCurrentUserFromStorage() {
    const userStr = localStorage.getItem("currentUser");
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default new ApiClient();
