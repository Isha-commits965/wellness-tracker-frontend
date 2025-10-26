import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '@/services/auth';
import type { User, LoginCredentials, RegisterData } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userInitials = computed(() => {
    if (!user.value?.fullName) return '';
    return user.value.fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase();
  });

  // Actions
  async function login(credentials: LoginCredentials) {
    try {
      isLoading.value = true;
      error.value = null;
      
      const response = await authService.login(credentials);
      
      // Make sure we have the required data
      if (response && response.token) {
        user.value = response.user;
        token.value = response.token;
        error.value = null; // Clear any previous errors
        return response;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      error.value = errorMessage;
      console.error('Login error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function register(userData: RegisterData) {
    try {
      isLoading.value = true;
      error.value = null;
      
      const response = await authService.register(userData);
      
      // Make sure we have the required data
      if (response && (response.user || response.token)) {
        user.value = response.user;
        token.value = response.token;
        error.value = null; // Clear any previous errors
        return response;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      error.value = errorMessage;
      console.error('Registration error:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function logout() {
    try {
      await authService.logout();
    } finally {
      user.value = null;
      token.value = null;
      error.value = null;
    }
  }

  async function fetchCurrentUser() {
    try {
      isLoading.value = true;
      const currentUser = await authService.getCurrentUser();
      user.value = currentUser;
      return currentUser;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch user';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function initializeAuth() {
    const storedUser = authService.getStoredUser();
    const storedToken = authService.getToken();
    
    if (storedUser && storedToken) {
      user.value = storedUser;
      token.value = storedToken;
    }
  }

  function clearError() {
    error.value = null;
  }

  function updateUser(updatedUser: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(user.value));
    }
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    userInitials,
    
    // Actions
    login,
    register,
    logout,
    fetchCurrentUser,
    initializeAuth,
    clearError,
    updateUser
  };
});
