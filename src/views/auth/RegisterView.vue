<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Animated background -->
    <div class="absolute inset-0 bg-gradient-to-br from-purple-400 via-purple-300 to-purple-500"></div>
    <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-200/30 to-transparent"></div>
    
    <!-- Floating particles -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-300 rounded-full animate-float" style="animation-delay: 0s;"></div>
      <div class="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-300 rounded-full animate-float" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/6 w-1 h-1 bg-indigo-300 rounded-full animate-float" style="animation-delay: 4s;"></div>
      <div class="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-300 rounded-full animate-float" style="animation-delay: 1s;"></div>
    </div>

    <div class="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
      <!-- Left side - Text content -->
      <div class="space-y-8">
        <!-- Animated Text -->
        <div class="text-left">
          <h1 class="text-5xl font-bold mb-4 animate-text-reveal">
            <span class="text-gradient">Start Your</span>
          </h1>
          <h2 class="text-3xl font-bold mb-2 animate-text-reveal" style="animation-delay: 0.5s;">
            <span class="text-gradient">Wellness Journey</span>
          </h2>
          <h3 class="text-2xl font-bold mb-6 animate-text-reveal" style="animation-delay: 1s;">
            <span class="text-gradient">Today 🌟</span>
          </h3>
          <p class="text-xl text-gray-600 animate-fade-in" style="animation-delay: 1.5s;">
            Join thousands of people on their path to better health, mindfulness, and personal growth
          </p>
        </div>

      <!-- Form -->
      <div class="card">
        <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <BaseInput
            v-model="form.fullName"
            type="text"
            label="Full Name"
            placeholder="Enter your full name"
            :error="errors.fullName"
            required
            :disabled="isLoading"
          />
          
          <BaseInput
            v-model="form.email"
            type="email"
            label="Email address"
            placeholder="Enter your email"
            :error="errors.email"
            required
            :disabled="isLoading"
          />
          
          <BaseInput
            v-model="form.password"
            type="password"
            label="Password"
            placeholder="Create a password"
            :error="errors.password"
            required
            :disabled="isLoading"
          />
          
          <BaseInput
            v-model="form.confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            :error="errors.confirmPassword"
            required
            :disabled="isLoading"
          />
        </div>

        <!-- Terms and conditions -->
        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.acceptTerms"
            type="checkbox"
            class="h-4 w-4 rounded"
            style="accent-color: #f59e0b;"
            required
          />
          <label for="terms" class="ml-2 block text-sm" style="color: #1a202c;">
            I agree to the
            <a href="#" style="color: #f59e0b; font-weight: 500;">Terms of Service</a>
            and
            <a href="#" style="color: #f59e0b; font-weight: 500;">Privacy Policy</a>
          </label>
        </div>

        <!-- Success message -->
        <div v-if="successMessage" class="rounded-lg p-4" style="background-color: #d1fae5; border: 1px solid #10b981;">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5" style="color: #059669;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium" style="color: #065f46;">Success!</h3>
              <div class="mt-2 text-sm" style="color: #047857;">{{ successMessage }}</div>
            </div>
          </div>
        </div>

        <!-- Error message -->
        <div v-if="error" class="rounded-lg p-4" style="background-color: #fee2e2; border: 1px solid #ef4444;">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5" style="color: #dc2626;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium" style="color: #991b1b;">Error</h3>
              <div class="mt-2 text-sm" style="color: #b91c1c;">{{ error }}</div>
            </div>
          </div>
        </div>

        <div>
          <BaseButton
            type="submit"
            :loading="isLoading"
            :disabled="!isFormValid"
            class="w-full"
          >
            Create account
          </BaseButton>
        </div>

        <div class="text-center">
          <p class="text-sm" style="color: #4a5568;">
            Already have an account?
            <router-link to="/login" class="font-medium" style="color: #10b981;">
              Sign in here
            </router-link>
          </p>
        </div>
      </form>
      </div>
      </div>

      <!-- Right side - Animated Girl -->
      <div class="flex justify-center items-center">
        <div class="relative">
          <!-- Animated Girl SVG -->
          <svg width="400" height="400" viewBox="0 0 400 400" class="animate-breathe">
            <!-- Background circle -->
            <circle cx="200" cy="200" r="180" fill="url(#gradient1)" opacity="0.1" class="animate-pulse-slow"/>
            
            <!-- Girl's body (cross-legged position) -->
            <!-- Head -->
            <circle cx="200" cy="120" r="35" fill="#fbb6ce" stroke="#f472b6" stroke-width="2"/>
            
            <!-- Hair -->
            <path d="M 165 100 Q 200 80 235 100 Q 240 120 235 140 Q 200 130 165 140 Z" fill="#8b5cf6" opacity="0.8"/>
            
            <!-- Face -->
            <circle cx="190" cy="115" r="3" fill="#374151"/>
            <circle cx="210" cy="115" r="3" fill="#374151"/>
            <path d="M 190 130 Q 200 140 210 130" stroke="#374151" stroke-width="2" fill="none"/>
            
            <!-- Body -->
            <ellipse cx="200" cy="200" rx="45" ry="60" fill="#fbb6ce" stroke="#f472b6" stroke-width="2"/>
            
            <!-- Arms -->
            <ellipse cx="150" cy="180" rx="15" ry="40" fill="#fbb6ce" stroke="#f472b6" stroke-width="2" transform="rotate(-20 150 180)"/>
            <ellipse cx="250" cy="180" rx="15" ry="40" fill="#fbb6ce" stroke="#f472b6" stroke-width="2" transform="rotate(20 250 180)"/>
            
            <!-- Hands in meditation position -->
            <circle cx="140" cy="200" r="8" fill="#fbb6ce" stroke="#f472b6" stroke-width="1"/>
            <circle cx="260" cy="200" r="8" fill="#fbb6ce" stroke="#f472b6" stroke-width="1"/>
            
            <!-- Legs in cross-legged position -->
            <ellipse cx="180" cy="280" rx="25" ry="50" fill="#fbb6ce" stroke="#f472b6" stroke-width="2" transform="rotate(-30 180 280)"/>
            <ellipse cx="220" cy="280" rx="25" ry="50" fill="#fbb6ce" stroke="#f472b6" stroke-width="2" transform="rotate(30 220 280)"/>
            
            <!-- Meditation aura -->
            <circle cx="200" cy="200" r="100" fill="none" stroke="url(#gradient2)" stroke-width="3" opacity="0.6" class="animate-pulse-slow"/>
            <circle cx="200" cy="200" r="120" fill="none" stroke="url(#gradient3)" stroke-width="2" opacity="0.4" class="animate-pulse-slow" style="animation-delay: 1s;"/>
            
            <!-- Floating energy particles -->
            <circle cx="120" cy="150" r="3" fill="#a855f7" opacity="0.8" class="animate-float"/>
            <circle cx="280" cy="160" r="2" fill="#ec4899" opacity="0.8" class="animate-float" style="animation-delay: 0.5s;"/>
            <circle cx="150" cy="250" r="2" fill="#3b82f6" opacity="0.8" class="animate-float" style="animation-delay: 1s;"/>
            <circle cx="250" cy="240" r="3" fill="#10b981" opacity="0.8" class="animate-float" style="animation-delay: 1.5s;"/>
            
            <!-- Gradients -->
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#a855f7;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#ec4899;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#a855f7;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
              </linearGradient>
            </defs>
          </svg>
          
          <!-- Floating text around the girl -->
          <div class="absolute top-20 left-10 text-sm font-semibold text-purple-600 animate-float" style="animation-delay: 0.5s;">
            ✨ Begin
          </div>
          <div class="absolute top-40 right-10 text-sm font-semibold text-pink-600 animate-float" style="animation-delay: 1s;">
            🌱 Grow
          </div>
          <div class="absolute bottom-32 left-5 text-sm font-semibold text-blue-600 animate-float" style="animation-delay: 1.5s;">
            💚 Thrive
          </div>
          <div class="absolute bottom-20 right-5 text-sm font-semibold text-green-600 animate-float" style="animation-delay: 2s;">
            🎯 Achieve
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { RegisterData } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive<RegisterData & { acceptTerms: boolean }>({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const errors = ref<{ [key: string]: string }>({})
const successMessage = ref<string>('')
const isLoading = computed(() => authStore.isLoading)
const error = computed(() => authStore.error)

const isFormValid = computed(() => {
  return (
    form.fullName &&
    form.email &&
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword &&
    form.acceptTerms &&
    form.email.includes('@') &&
    form.password.length >= 6
  )
})

const validateForm = () => {
  errors.value = {}
  
  if (!form.fullName) {
    errors.value.fullName = 'Full name is required'
  } else if (form.fullName.length < 2) {
    errors.value.fullName = 'Full name must be at least 2 characters'
  }
  
  if (!form.email) {
    errors.value.email = 'Email is required'
  } else if (!form.email.includes('@')) {
    errors.value.email = 'Please enter a valid email address'
  }
  
  if (!form.password) {
    errors.value.password = 'Password is required'
  } else if (form.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }
  
  if (!form.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (form.password !== form.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  }
  
  if (!form.acceptTerms) {
    errors.value.acceptTerms = 'You must accept the terms and conditions'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  try {
    // Clear previous messages
    successMessage.value = ''
    authStore.clearError()
    
    await authStore.register(form)
    
    // Show success message
    successMessage.value = 'Account created successfully! Redirecting to dashboard...'
    
    // Redirect after a short delay to show the success message
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  } catch (err) {
    // Error is handled by the store
    console.error('Registration failed:', err)
    successMessage.value = '' // Clear success message on error
  }
}
</script>
