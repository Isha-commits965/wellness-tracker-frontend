<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 card">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 rounded-full flex items-center justify-center" style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);">
          <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-bold" style="color: #1a202c;">Create your account</h2>
        <p class="mt-2 text-sm" style="color: #4a5568;">
          Start your wellness journey today
        </p>
      </div>

      <!-- Form -->
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
    await authStore.register(form)
    router.push('/dashboard')
  } catch (err) {
    // Error is handled by the store
    console.error('Registration failed:', err)
  }
}
</script>
