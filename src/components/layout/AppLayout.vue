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

        <!-- Meditation Section -->
        <div class="px-4 py-4 border-t border-purple-200">
          <h3 v-if="!isCollapsed" class="text-sm font-bold text-gray-700 mb-3 flex items-center">
            <span class="text-lg mr-2">🧘</span>
            Guided Meditation
          </h3>
          <div v-if="!isCollapsed" class="space-y-2">
            <a
              v-for="meditation in meditationVideos"
              :key="meditation.id"
              :href="meditation.url"
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl hover:from-indigo-200 hover:to-purple-200 transition-all duration-300 hover:scale-105"
            >
              <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <div class="ml-3 flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-800 group-hover:text-indigo-700 truncate">{{ meditation.title }}</p>
                <p class="text-xs text-gray-600 truncate">{{ meditation.duration }}</p>
              </div>
            </a>
          </div>
          <!-- Collapsed meditation section -->
          <div v-else class="flex flex-col items-center space-y-2">
            <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span class="text-lg">🧘</span>
            </div>
            <a
              v-for="meditation in meditationVideos.slice(0, 3)"
              :key="meditation.id"
              :href="meditation.url"
              target="_blank"
              rel="noopener noreferrer"
              class="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 hover:scale-110"
              :title="meditation.title"
            >
              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </a>
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
        
        <!-- Always visible logout button -->
        <div v-if="authStore.isAuthenticated" class="px-4 py-4 border-t border-purple-200">
          <button
            @click="handleLogout"
            class="w-full flex items-center justify-center px-4 py-3 text-sm font-semibold text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-2xl transition-all duration-200 hover:scale-105"
          >
            <span class="text-lg mr-3">🚪</span>
            <span v-if="!isCollapsed">Sign Out</span>
          </button>
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
          <button
            @click="handleLogout"
            class="text-white hover:text-red-200 transition-colors p-2 rounded-xl hover:bg-red-500/20"
            title="Sign out"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
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
import { useHabitsStore } from '@/stores/habits'
import { useMoodsStore } from '@/stores/moods'
import { useJournalStore } from '@/stores/journal'
import { useGoalsStore } from '@/stores/goals'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const habitsStore = useHabitsStore()
const moodsStore = useMoodsStore()
const journalStore = useJournalStore()
const goalsStore = useGoalsStore()

const isCollapsed = ref(false)
const showUserMenu = ref(false)

const user = computed(() => authStore.user)
const userInitials = computed(() => authStore.userInitials)

// Meditation videos data
const meditationVideos = ref([
  {
    id: 1,
    title: "10-Minute Morning Meditation",
    duration: "10 min",
    url: "https://www.youtube.com/watch?v=ZToicYcHIOU"
  },
  {
    id: 2,
    title: "5-Minute Breathing Exercise",
    duration: "5 min",
    url: "https://www.youtube.com/watch?v=tybOi4hjZFQ"
  },
  {
    id: 3,
    title: "Body Scan Meditation",
    duration: "15 min",
    url: "https://www.youtube.com/watch?v=86HUcX8ZtGA"
  },
  {
    id: 4,
    title: "Sleep Meditation",
    duration: "20 min",
    url: "https://www.youtube.com/watch?v=1ZYbU82GVz4"
  },
  {
    id: 5,
    title: "Stress Relief Meditation",
    duration: "12 min",
    url: "https://www.youtube.com/watch?v=O-6f5wQXSu8"
  },
  {
    id: 6,
    title: "Mindfulness for Beginners",
    duration: "8 min",
    url: "https://www.youtube.com/watch?v=6p_yaNFSYao"
  }
])

// Dynamic navigation items with real data
const navigationItems = computed(() => [
  { name: 'Dashboard', href: '/dashboard', emoji: '🏠', badge: null },
  { name: 'Habits', href: '/habits', emoji: '🎯', badge: habitsStore.totalHabits?.toString() || '0' },
  { name: 'Moods', href: '/moods', emoji: '😊', badge: null },
  { name: 'Journal', href: '/journal', emoji: '📝', badge: journalStore.entries?.length?.toString() || '0' },
  { name: 'Meditation', href: '/meditation', emoji: '🧘', badge: null },
  { name: 'Therapy', href: '/therapy', emoji: '💚', badge: null },
  { name: 'Analytics', href: '/analytics', emoji: '📊', badge: null },
  { name: 'Goals', href: '/goals', emoji: '🎯', badge: goalsStore.totalGoals?.toString() || '0' }
])

// Dynamic quick stats with real data
const quickStats = computed(() => ({
  streak: habitsStore.currentStreak || 0,
  mood: moodsStore.averageMood || 0,
  habitsCompleted: habitsStore.completedHabitsToday?.length || 0,
  totalHabits: habitsStore.totalHabits || 0
}))

const currentPageTitle = computed(() => {
  const item = navigationItems.value.find(item => item.href === route.path)
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
    // Show confirmation dialog
    if (confirm('Are you sure you want to sign out?')) {
      await authStore.logout()
      router.push('/login')
    }
  } catch (error) {
    console.error('Logout failed:', error)
    // Even if logout fails, redirect to login
    router.push('/login')
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

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  
  // Fetch data for sidebar stats
  try {
    await Promise.all([
      habitsStore.fetchHabits(),
      habitsStore.fetchCheckIns(),
      habitsStore.fetchStreaks(),
      moodsStore.fetchMoodEntries(),
      journalStore.fetchJournalEntries(),
      goalsStore.fetchGoals()
    ])
  } catch (error) {
    console.error('Failed to load sidebar data:', error)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
