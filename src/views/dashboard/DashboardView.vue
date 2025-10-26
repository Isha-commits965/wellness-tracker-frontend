<template>
  <div class="space-y-6">
    <!-- Welcome section -->
    <div class="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl p-8 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
      <div class="relative z-10 flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold mb-2 animate-pulse-slow">Welcome back, {{ user?.fullName }}! 👋</h1>
          <p class="text-xl text-white/90">Ready to continue your wellness journey?</p>
          <div class="mt-4 flex items-center space-x-2">
            <div class="w-3 h-3 bg-yellow-400 rounded-full animate-bounce-slow"></div>
            <div class="w-3 h-3 bg-green-400 rounded-full animate-bounce-slow" style="animation-delay: 0.2s"></div>
            <div class="w-3 h-3 bg-blue-400 rounded-full animate-bounce-slow" style="animation-delay: 0.4s"></div>
          </div>
        </div>
        <button
          @click="handleLogout"
          class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/30"
          title="Sign out"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Quick stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Habits"
        :value="dashboardStats?.totalHabits || 0"
        subtitle="Active habits"
        icon="svg"
        color="primary"
        clickable
        @click="$router.push('/habits')"
      />
      
      <StatsCard
        title="Current Streak"
        :value="dashboardStats?.currentStreak || 0"
        subtitle="Days in a row"
        icon="svg"
        color="success"
      />
      
      <StatsCard
        title="Average Mood"
        :value="dashboardStats?.averageMood || 0"
        subtitle="Out of 10"
        icon="svg"
        color="info"
        clickable
        @click="$router.push('/moods')"
      />
      
      <StatsCard
        title="Journal Entries"
        :value="dashboardStats?.journalEntriesThisWeek || 0"
        subtitle="This week"
        icon="svg"
        color="warning"
        clickable
        @click="$router.push('/journal')"
      />
    </div>

    <!-- Quick actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Quick check-in -->
      <BaseCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Quick Check-in</h3>
            <div v-if="activeHabits.length > 0" class="text-sm font-medium" :class="habitsStore.completionRate >= 50 ? 'text-green-600' : 'text-gray-500'">
              {{ Math.round(habitsStore.completionRate) }}% Complete
            </div>
          </div>
        </template>
        
        <div class="space-y-4">
          <p class="text-sm text-gray-600">Complete your habits for today</p>
          
          <div v-if="activeHabits.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p class="mt-2 text-sm text-gray-500">No habits yet</p>
            <BaseButton @click="$router.push('/habits')" class="mt-4">
              Create your first habit
            </BaseButton>
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="habit in (activeHabits || []).filter(h => h != null).slice(0, 3)"
              :key="habit.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center">
                <div class="h-3 w-3 bg-primary-600 rounded-full mr-3"></div>
                <span class="text-sm font-medium text-gray-900">{{ habit.name }}</span>
              </div>
              <BaseButton
                size="sm"
                :variant="isHabitCompletedToday(habit.id) ? 'secondary' : 'primary'"
                @click="toggleHabitCheckIn(habit.id)"
              >
                {{ isHabitCompletedToday(habit.id) ? 'Completed' : 'Check in' }}
              </BaseButton>
            </div>
            
            <div v-if="activeHabits.length > 3" class="text-center">
              <BaseButton variant="outline" size="sm" @click="$router.push('/habits')">
                View all habits
              </BaseButton>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Quick mood log -->
      <BaseCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900">How are you feeling?</h3>
        </template>
        
        <div class="space-y-4">
          <p class="text-sm text-gray-600">Log your mood for today</p>
          
          <div v-if="todayMood" class="p-4 bg-green-50 rounded-lg">
            <div class="flex items-center">
              <svg class="h-5 w-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm font-medium text-green-800">
                Mood logged: {{ todayMood.mood }}/10
              </span>
            </div>
            <p class="mt-1 text-sm text-green-700">
              Energy: {{ todayMood.energy }}/10 | Stress: {{ todayMood.stress }}/10
            </p>
          </div>
          
          <div v-else class="space-y-4">
            <MoodSlider
              v-model="quickMood.mood"
              label="Mood"
              type="mood"
            />
            
            <MoodSlider
              v-model="quickMood.energy"
              label="Energy Level"
              type="energy"
            />
            
            <MoodSlider
              v-model="quickMood.stress"
              label="Stress Level"
              type="stress"
            />
            
            <BaseButton
              @click="logQuickMood"
              :loading="isLoggingMood"
              class="w-full"
            >
              Log Mood
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Recent activity and calendar -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent activity -->
      <BaseCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </template>
        
        <div class="space-y-4">
          <div v-if="recentActivity.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="mt-2 text-sm text-gray-500">No recent activity</p>
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="activity in recentActivity"
              :key="activity.id"
              class="flex items-center p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex-shrink-0">
                <div :class="activity.iconClasses" class="h-8 w-8 rounded-full flex items-center justify-center">
                  <component :is="activity.icon" class="h-4 w-4" />
                </div>
              </div>
              <div class="ml-3 flex-1">
                <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                <p class="text-xs text-gray-500">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Calendar widget -->
      <CalendarWidget
        :data="calendarData"
        :streakDates="habitsStore.completedDates"
        @date-selected="handleDateSelected"
        @month-changed="handleMonthChanged"
      />
    </div>

  </div>
  
    <!-- Badge Popup -->
    <BadgePopup
      :isOpen="badgeStore.showBadgePopup"
      :badge="badgeStore.newBadge"
      :streak="habitsStore.currentStreak"
      @close="badgeStore.closeBadgePopup"
      @viewAll="badgeStore.viewAllBadges"
    />
    
    <!-- Test Badge Button (for development) -->
    <div v-if="isDevelopment" class="fixed bottom-4 right-4 z-50">
      <BaseButton 
        @click="testBadge" 
        variant="primary"
        class="shadow-lg"
      >
        Test Badge 🏆
      </BaseButton>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useHabitsStore } from '@/stores/habits'
import { useMoodsStore } from '@/stores/moods'
import { useJournalStore } from '@/stores/journal'
import { useAnalyticsStore } from '@/stores/analytics'
import { useBadgeStore } from '@/stores/badges'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import StatsCard from '@/components/ui/StatsCard.vue'
import MoodSlider from '@/components/ui/MoodSlider.vue'
import CalendarWidget from '@/components/ui/CalendarWidget.vue'
import BadgePopup from '@/components/ui/BadgePopup.vue'

const router = useRouter()
const authStore = useAuthStore()
const habitsStore = useHabitsStore()
const moodsStore = useMoodsStore()
const journalStore = useJournalStore()
const analyticsStore = useAnalyticsStore()
const badgeStore = useBadgeStore()

const quickMood = ref({
  mood: 5,
  energy: 5,
  stress: 5
})

const isLoggingMood = ref(false)

const user = computed(() => authStore.user)
const activeHabits = computed(() => habitsStore.activeHabits)
const todayMood = computed(() => moodsStore.todayMood)
const calendarData = computed(() => analyticsStore.monthlyCalendarData)
const isDevelopment = computed(() => import.meta.env.DEV)

// Calculate real dashboard stats from store data
const dashboardStats = computed(() => {
  // Use streak data from habits store
  const currentStreak = habitsStore.currentStreak
  
  // Calculate journal entries this week
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const journalEntriesThisWeek = journalStore.entries?.filter(entry => 
    new Date(entry.createdAt) >= oneWeekAgo
  ).length || 0
  
  return {
    totalHabits: habitsStore.totalHabits || 0,
    currentStreak,
    averageMood: moodsStore.averageMood || 0,
    journalEntriesThisWeek
  }
})

const recentActivity = computed(() => {
  // This would be populated from various stores
  return []
})


onMounted(async () => {
  try {
    await Promise.all([
      habitsStore.fetchHabits(),
      habitsStore.fetchCheckIns(),
      habitsStore.fetchStreaks(),
      moodsStore.fetchMoodEntries(),
      journalStore.fetchJournalEntries(),
      badgeStore.loadBadges()
    ])
    
    // Check for new badge achievements
    const streak = habitsStore.currentStreak
    const moodDays = moodsStore.moodEntries?.length || 0
    const journalDays = journalStore.entries?.length || 0
    
    badgeStore.checkForNewBadges(streak, moodDays, journalDays)
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
})

// Watch for changes in habits and moods to ensure immediate UI updates
watch(
  () => [habitsStore.checkIns, moodsStore.moodEntries],
  () => {
    // Force reactivity update when habits or moods change
    nextTick(() => {
      // This will trigger computed properties to re-evaluate
    })
  },
  { deep: true }
)

const isHabitCompletedToday = (habitId: string) => {
  return habitsStore.isHabitCompletedToday(habitId)
}

const toggleHabitCheckIn = async (habitId: string) => {
  try {
    if (isHabitCompletedToday(habitId)) {
      // Remove check-in
      const checkIn = habitsStore.todayCheckIns.find(c => c.habitId === habitId)
      if (checkIn) {
        await habitsStore.deleteCheckIn(checkIn.id)
      }
    } else {
      // Add check-in
      await habitsStore.createCheckIn({
        habitId,
        value: 1,
        date: new Date().toISOString().split('T')[0]
      })
    }
    
    // Force reactivity update
    await nextTick()
    
    // Check for badges after any habit change
    setTimeout(() => {
      const streak = habitsStore.currentStreak
      const moodDays = moodsStore.moodEntries?.length || 0
      const journalDays = journalStore.entries?.length || 0
      
      badgeStore.checkForNewBadges(streak, moodDays, journalDays)
    }, 200)
  } catch (error) {
    console.error('Failed to toggle habit check-in:', error)
  }
}

const logQuickMood = async () => {
  try {
    isLoggingMood.value = true
    await moodsStore.logQuickMood(
      quickMood.value.mood,
      quickMood.value.energy,
      quickMood.value.stress
    )
    
    // Force reactivity update
    await nextTick()
    
    // Reset form
    quickMood.value = { mood: 5, energy: 5, stress: 5 }
  } catch (error) {
    console.error('Failed to log mood:', error)
  } finally {
    isLoggingMood.value = false
  }
}

const handleLogout = async () => {
  try {
    if (confirm('Are you sure you want to sign out?')) {
      await authStore.logout()
      router.push('/login')
    }
  } catch (error) {
    console.error('Logout failed:', error)
    router.push('/login')
  }
}

const handleDateSelected = (date: Date) => {
  console.log('Date selected:', date)
}

const handleMonthChanged = (date: Date) => {
  analyticsStore.fetchCalendarData(date.getFullYear(), date.getMonth() + 1)
}

// Test function for badges
const testBadge = () => {
  console.log('Testing badge system...')
  const streak = habitsStore.currentStreak
  const moodDays = moodsStore.moodEntries?.length || 0
  const journalDays = journalStore.entries?.length || 0
  
  console.log('Current stats:', { streak, moodDays, journalDays })
  console.log('Habits data:', {
    totalHabits: habitsStore.totalHabits,
    activeHabits: habitsStore.activeHabitsCount,
    completedToday: habitsStore.completedHabitsToday.length,
    checkIns: habitsStore.checkIns.length,
    completedDates: habitsStore.completedDates
  })
  
  // For testing, let's also try with mood/journal streaks
  const moodStreak = Math.min(moodDays, 7) // Cap at 7 for testing
  const journalStreak = Math.min(journalDays, 5) // Cap at 5 for testing
  
  console.log('Testing with mood/journal streaks:', { moodStreak, journalStreak })
  badgeStore.checkForNewBadges(streak, moodStreak, journalStreak)
  
  // If no badges unlocked, try to unlock the first one manually for testing
  if (badgeStore.unlockedCount === 0) {
    console.log('No badges unlocked yet, manually unlocking Champ badge for testing...')
    const testBadge = {
      id: 'champ-1',
      name: 'Champ',
      description: 'Complete all habits for 1 day!',
      icon: '🏆',
      color: 'text-yellow-500',
      requirement: 1,
      category: 'streak' as const,
      unlocked: true,
      unlockedAt: new Date().toISOString()
    }
    badgeStore.unlockBadge(testBadge)
    badgeStore.newBadge = testBadge
    badgeStore.showBadgePopup = true
  }
}
</script>
