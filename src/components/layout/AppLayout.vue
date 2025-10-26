<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div :class="sidebarClasses">
      <div class="flex flex-col h-full bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50">
        <!-- Logo -->
        <div class="flex items-center px-6 py-6 border-b border-gradient-to-r from-purple-200 to-pink-200">
          <div class="flex items-center">
            <div class="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-slow">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div v-if="!isCollapsed" class="ml-4">
              <span class="text-2xl font-bold text-gradient">Wellness</span>
              <p class="text-xs text-gray-600 font-medium">Track & Thrive</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-3">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.href"
            :class="getNavClasses(item.href)"
            class="group flex items-center px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
          >
            <div :class="getIconClasses(item.href)" class="flex items-center justify-center w-8 h-8 rounded-xl mr-3">
              <span class="text-lg">{{ item.emoji }}</span>
            </div>
            <span v-if="!isCollapsed" class="flex-1">{{ item.name }}</span>
            <div v-if="!isCollapsed && item.badge" class="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse-slow">
              {{ item.badge }}
            </div>
          </router-link>
        </nav>

        <!-- Quick Stats -->
        <div v-if="!isCollapsed" class="px-4 py-4 border-t border-purple-200">
          <h3 class="text-sm font-bold text-gray-700 mb-3 flex items-center">
            <span class="text-lg mr-2">📊</span>
            Quick Stats
          </h3>
          <div class="space-y-3">
            <div class="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-3">
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-green-700">Streak</span>
                <span class="text-lg font-bold text-green-600">{{ quickStats.streak }} 🔥</span>
              </div>
              <div class="w-full bg-green-200 rounded-full h-2 mt-2">
                <div class="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" :style="{ width: `${Math.min(quickStats.streak * 10, 100)}%` }"></div>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl p-3">
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-blue-700">Mood</span>
                <span class="text-lg font-bold text-blue-600">{{ quickStats.mood }}/10 😊</span>
              </div>
              <div class="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div class="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full" :style="{ width: `${quickStats.mood * 10}%` }"></div>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-3">
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-purple-700">Habits</span>
                <span class="text-lg font-bold text-purple-600">{{ quickStats.habitsCompleted }}/{{ quickStats.totalHabits }} ✅</span>
              </div>
              <div class="w-full bg-purple-200 rounded-full h-2 mt-2">
                <div class="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full" :style="{ width: `${(quickStats.habitsCompleted / quickStats.totalHabits) * 100}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- User menu -->
        <div class="border-t border-purple-200 p-4 bg-gradient-to-r from-purple-50 to-pink-50">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span class="text-sm font-bold text-white">{{ userInitials }}</span>
              </div>
            </div>
            <div v-if="!isCollapsed" class="ml-3 flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-800 truncate">{{ user?.fullName }}</p>
              <p class="text-xs text-gray-600 truncate">{{ user?.email }}</p>
            </div>
            <div v-if="!isCollapsed" class="ml-3">
              <button
                @click="showUserMenu = !showUserMenu"
                class="text-gray-500 hover:text-purple-600 transition-colors p-2 rounded-xl hover:bg-purple-100"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- User dropdown -->
          <div v-if="showUserMenu && !isCollapsed" class="mt-3 bg-white rounded-2xl shadow-xl border border-purple-200 overflow-hidden">
            <div class="py-2">
              <router-link
                to="/profile"
                class="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200"
              >
                <span class="text-lg mr-3">👤</span>
                Profile
              </router-link>
              <router-link
                to="/settings"
                class="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200"
              >
                <span class="text-lg mr-3">⚙️</span>
                Settings
              </router-link>
              <button
                @click="handleLogout"
                class="flex items-center w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200"
              >
                <span class="text-lg mr-3">🚪</span>
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
        <div class="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
          <button
            @click="isCollapsed = !isCollapsed"
            class="text-white hover:text-purple-200 transition-colors p-2 rounded-xl hover:bg-white/20"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="text-lg font-bold text-white">{{ currentPageTitle }}</h1>
          <div class="w-6"></div> <!-- Spacer for centering -->
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
  { name: 'Dashboard', href: '/dashboard', emoji: '🏠', badge: null },
  { name: 'Habits', href: '/habits', emoji: '🎯', badge: '3' },
  { name: 'Moods', href: '/moods', emoji: '😊', badge: null },
  { name: 'Journal', href: '/journal', emoji: '📝', badge: '5' },
  { name: 'Analytics', href: '/analytics', emoji: '📊', badge: null },
  { name: 'Goals', href: '/goals', emoji: '🎯', badge: '2' }
]

// Quick stats data
const quickStats = ref({
  streak: 7,
  mood: 8,
  habitsCompleted: 3,
  totalHabits: 4
})

const currentPageTitle = computed(() => {
  const item = navigationItems.find(item => item.href === route.path)
  return item?.name || 'Wellness Tracker'
})

const sidebarClasses = computed(() => {
  const baseClasses = 'fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-purple-50 via-pink-50 to-blue-50 border-r border-purple-200 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0'
  
  if (isCollapsed.value) {
    return `${baseClasses} -translate-x-full`
  }
  
  return baseClasses
})

const getNavClasses = (href: string) => {
  const isActive = route.path === href
  const baseClasses = 'group flex items-center px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 hover:scale-105'
  
  if (isActive) {
    return `${baseClasses} bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg`
  }
  
  return `${baseClasses} text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-purple-700`
}

const getIconClasses = (href: string) => {
  const isActive = route.path === href
  
  if (isActive) {
    return 'bg-white/20 text-white'
  }
  
  return 'bg-gradient-to-br from-purple-200 to-pink-200 text-purple-600 group-hover:from-purple-300 group-hover:to-pink-300'
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
