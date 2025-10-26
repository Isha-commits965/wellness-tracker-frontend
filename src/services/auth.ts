import apiService from './api';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    
    // Store tokens and user data
    if (response.success) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('refresh_token', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', userData);
    
    // Store tokens and user data
    if (response.success) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('refresh_token', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
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
