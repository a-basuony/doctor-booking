// Authentication Helper
export const authHelper = {
  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem("authToken");
    return !!token;
  },

  // Get current auth token
  getToken(): string | null {
    return localStorage.getItem("authToken");
  },

  // Get user info
  getUser(): any {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Set auth token (for testing)
  setToken(token: string): void {
    localStorage.setItem("authToken", token);
  },

  // Clear auth
  clearAuth(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  // Log current auth status
  logAuthStatus(): void {
    const token = this.getToken();
    const user = this.getUser();
    
    console.log('🔐 Auth Status:');
    console.log('  - Token:', token ? `${token.substring(0, 20)}...` : 'None');
    console.log('  - User:', user?.name || 'Not logged in');
    console.log('  - Authenticated:', this.isAuthenticated());
  }
};

// For debugging in console
if (typeof window !== 'undefined') {
  (window as any).authHelper = authHelper;
}
