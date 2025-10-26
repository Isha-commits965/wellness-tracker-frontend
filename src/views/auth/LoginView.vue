<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 card">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 rounded-full flex items-center justify-center" style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);">
          <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-bold" style="color: #1a202c;">Welcome back</h2>
        <p class="mt-2 text-sm" style="color: #4a5568;">
          Sign in to your wellness tracker account
        </p>
      </div>

      <!-- Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
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
            placeholder="Enter your password"
            :error="errors.password"
            required
            :disabled="isLoading"
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              type="checkbox"
              class="h-4 w-4 rounded"
              style="accent-color: #10b981;"
            />
            <label for="remember-me" class="ml-2 block text-sm" style="color: #1a202c;">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium" style="color: #10b981;">
              Forgot your password?
            </a>
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
            Sign in
          </BaseButton>
        </div>

        <div class="text-center">
          <p class="text-sm" style="color: #4a5568;">
            Don't have an account?
            <router-link to="/register" class="font-medium" style="color: #10b981;">
              Sign up here
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import type { LoginCredentials } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

// Clear any previous errors when component mounts
onMounted(() => {
  authStore.clearError()
})

const form = reactive<LoginCredentials>({
  email: '',
  password: '',
  rememberMe: false
})

const errors = ref<{ [key: string]: string }>({})
const isLoading = computed(() => authStore.isLoading)
const error = computed(() => authStore.error)

const isFormValid = computed(() => {
  return form.email && form.password && form.email.includes('@')
})

const validateForm = () => {
  errors.value = {}
  
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
  
  return Object.keys(errors.value).length === 0
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  try {
    await authStore.login(form)
    router.push('/dashboard')
  } catch (err) {
    // Error is handled by the store
    console.error('Login failed:', err)
  }
}
</script>
