<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div :class="sidebarClasses">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center px-6 py-4 border-b border-gray-200">
          <div class="flex items-center">
            <div class="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span v-if="!isCollapsed" class="ml-3 text-xl font-bold text-gray-900">Wellness</span>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.href"
            :class="getNavClasses(item.href)"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
          >
            <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
            <span v-if="!isCollapsed" class="ml-3">{{ item.name }}</span>
          </router-link>
        </nav>

        <!-- User menu -->
        <div class="border-t border-gray-200 p-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-primary-600">{{ userInitials }}</span>
              </div>
            </div>
            <div v-if="!isCollapsed" class="ml-3 flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ user?.fullName }}</p>
              <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
            </div>
            <div v-if="!isCollapsed" class="ml-3">
              <button
                @click="showUserMenu = !showUserMenu"
                class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- User dropdown -->
          <div v-if="showUserMenu && !isCollapsed" class="mt-2 bg-white rounded-lg shadow-lg border border-gray-200">
            <div class="py-1">
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </router-link>
              <router-link
                to="/settings"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </router-link>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Mobile menu button -->
      <div class="sticky top-0 z-40 lg:hidden">
        <div class="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <button
            @click="isCollapsed = !isCollapsed"
            class="text-gray-500 hover:text-gray-600"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="text-lg font-semibold text-gray-900">{{ currentPageTitle }}</h1>
        </div>
      </div>

      <!-- Page content -->
      <main class="flex-1">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <router-view />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isCollapsed = ref(false)
const showUserMenu = ref(false)

const user = computed(() => authStore.user)
const userInitials = computed(() => authStore.userInitials)

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: 'svg' },
  { name: 'Habits', href: '/habits', icon: 'svg' },
  { name: 'Moods', href: '/moods', icon: 'svg' },
  { name: 'Journal', href: '/journal', icon: 'svg' },
  { name: 'Analytics', href: '/analytics', icon: 'svg' },
  { name: 'Goals', href: '/goals', icon: 'svg' }
]

const currentPageTitle = computed(() => {
  const item = navigationItems.find(item => item.href === route.path)
  return item?.name || 'Wellness Tracker'
})

const sidebarClasses = computed(() => {
  const baseClasses = 'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0'
  
  if (isCollapsed.value) {
    return `${baseClasses} -translate-x-full`
  }
  
  return baseClasses
})

const getNavClasses = (href: string) => {
  const isActive = route.path === href
  const baseClasses = 'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200'
  
  if (isActive) {
    return `${baseClasses} bg-primary-100 text-primary-700`
  }
  
  return `${baseClasses} text-gray-700 hover:bg-gray-100 hover:text-gray-900`
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (showUserMenu.value) {
    const target = event.target as HTMLElement
    if (!target.closest('.user-menu')) {
      showUserMenu.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
