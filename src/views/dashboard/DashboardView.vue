<template>
  <div class="space-y-6">
    <!-- Welcome section -->
    <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
      <h1 class="text-2xl font-bold">Welcome back, {{ user?.fullName }}! 👋</h1>
      <p class="mt-2 text-primary-100">Ready to continue your wellness journey?</p>
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
          <h3 class="text-lg font-semibold text-gray-900">Quick Check-in</h3>
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
        @date-selected="handleDateSelected"
        @month-changed="handleMonthChanged"
      />
    </div>

    <!-- Weekly mood chart -->
    <BaseCard>
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Weekly Mood Trend</h3>
      </template>
      
      <div class="h-64">
        <!-- Chart will be implemented here -->
        <div class="flex items-center justify-center h-full text-gray-500">
          <p>Mood chart will be displayed here</p>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useHabitsStore } from '@/stores/habits'
import { useMoodsStore } from '@/stores/moods'
import { useAnalyticsStore } from '@/stores/analytics'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import StatsCard from '@/components/ui/StatsCard.vue'
import MoodSlider from '@/components/ui/MoodSlider.vue'
import CalendarWidget from '@/components/ui/CalendarWidget.vue'

const authStore = useAuthStore()
const habitsStore = useHabitsStore()
const moodsStore = useMoodsStore()
const analyticsStore = useAnalyticsStore()

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

// Calculate real dashboard stats from store data
const dashboardStats = computed(() => {
  // Calculate current streak based on mood entries
  let currentStreak = 0
  if (moodsStore.moodEntries && moodsStore.moodEntries.length > 0) {
    const sortedEntries = [...moodsStore.moodEntries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Check if there's an entry today
    const todayStr = today.toISOString().split('T')[0]
    const hasToday = sortedEntries.some(e => e.date === todayStr)
    
    if (hasToday) {
      currentStreak = 1
      // Count consecutive days backwards
      for (let i = 1; i < 365; i++) {
        const checkDate = new Date(today)
        checkDate.setDate(checkDate.getDate() - i)
        const checkDateStr = checkDate.toISOString().split('T')[0]
        
        if (sortedEntries.some(e => e.date === checkDateStr)) {
          currentStreak++
        } else {
          break
        }
      }
    }
  }
  
  return {
    totalHabits: habitsStore.totalHabits || 0,
    currentStreak,
    averageMood: moodsStore.averageMood || 0,
    journalEntriesThisWeek: 0 // TODO: Calculate from journal entries
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
      moodsStore.fetchMoodEntries()
    ])
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
})

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
    
    // Reset form
    quickMood.value = { mood: 5, energy: 5, stress: 5 }
  } catch (error) {
    console.error('Failed to log mood:', error)
  } finally {
    isLoggingMood.value = false
  }
}

const handleDateSelected = (date: Date) => {
  console.log('Date selected:', date)
}

const handleMonthChanged = (date: Date) => {
  analyticsStore.fetchCalendarData(date.getFullYear(), date.getMonth() + 1)
}
</script>
