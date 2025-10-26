import apiService from './api';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<any> {
    // The backend expects username, email, and password
    const loginPayload = {
      username: credentials.email, // Use email as username
      email: credentials.email,
      password: credentials.password,
    };
    
    const response = await apiService.post<any>('/auth/login', loginPayload);
    
    console.log('Login response:', response);
    
    // The response might be response.data or just response depending on axios config
    const data = response.data || response;
    
    // Store the access token
    if (data && data.access_token) {
      localStorage.setItem('auth_token', data.access_token);
      
      // Try to get user data from localStorage (set during registration)
      const storedUser = localStorage.getItem('user');
      
      // Return a properly formatted response for the store
      const formattedResponse = {
        token: data.access_token,
        user: storedUser ? JSON.parse(storedUser) : { email: credentials.email }
      };
      
      console.log('Returning formatted response:', formattedResponse);
      return formattedResponse;
    }
    
    console.error('Invalid login response:', response);
    throw new Error('Invalid response from server');
  },

  async register(userData: RegisterData): Promise<any> {
    // Preserve the original email and password for auto-login
    const email = userData.email;
    const password = userData.password;
    
    // Map fullName to username for backend compatibility
    const registerPayload = {
      username: userData.fullName,
      email: email,
      password: password,
    };
    
    const response = await apiService.post<any>('/auth/register', registerPayload);
    
    // The backend returns just the user object after registration
    // Now we need to login to get the token
    if (response.data) {
      // Store user data temporarily
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // Automatically login after successful registration
      try {
        const loginResponse = await this.login({
          email: email,
          password: password
        });
        return loginResponse;
      } catch (loginError) {
        console.error('Auto-login failed after registration:', loginError);
        // Still return the user data even if login fails
        return { user: response.data };
      }
    }
    
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const response = await apiService.post<{ token: string }>('/auth/refresh', { refreshToken });
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
};
