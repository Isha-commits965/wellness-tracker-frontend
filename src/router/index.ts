import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/habits',
      name: 'habits',
      component: () => import('@/views/habits/HabitsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/habits/:id',
      name: 'habit-detail',
      component: () => import('@/views/habits/HabitDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/moods',
      name: 'moods',
      component: () => import('@/views/moods/MoodsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/journal',
      name: 'journal',
      component: () => import('@/views/journal/JournalView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/journal/:id',
      name: 'journal-entry',
      component: () => import('@/views/journal/JournalEntryView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/meditation',
      name: 'meditation',
      component: () => import('@/views/meditation/MeditationView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/therapy',
      name: 'therapy',
      component: () => import('@/views/therapy/TherapyView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('@/views/analytics/AnalyticsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/goals',
      name: 'goals',
      component: () => import('@/views/goals/GoalsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/goals/:id',
      name: 'goal-detail',
      component: () => import('@/views/goals/GoalDetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ],
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth state if not already done
  if (!authStore.isAuthenticated) {
    authStore.initializeAuth()
  }
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  
  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
