<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-pink-600/20"></div>
      <div class="relative z-10">
        <h1 class="text-4xl font-bold mb-2 animate-pulse-slow">Analytics Dashboard 📊</h1>
        <p class="text-xl text-white/90">Track your wellness progress and insights</p>
        <div class="mt-4 flex items-center space-x-2">
          <div class="w-3 h-3 bg-yellow-300 rounded-full animate-bounce-slow"></div>
          <div class="w-3 h-3 bg-green-300 rounded-full animate-bounce-slow" style="animation-delay: 0.2s"></div>
          <div class="w-3 h-3 bg-blue-300 rounded-full animate-bounce-slow" style="animation-delay: 0.4s"></div>
        </div>
      </div>
    </div>

    <!-- Main Analytics Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Weekly Mood Trend Chart -->
      <BaseCard>
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
            <h3 class="text-xl font-bold text-gradient">Weekly Mood Trend 📈</h3>
          </div>
        </template>
        
        <div class="h-80 relative">
          <div class="flex items-end justify-between h-full space-x-3">
            <div v-for="(day, index) in moodChartData" :key="index" class="flex flex-col items-center space-y-3">
              <div 
                class="w-10 rounded-t-2xl transition-all duration-500 hover:scale-110 shadow-lg"
                :style="{ 
                  height: `${(day.mood / 10) * 100}%`,
                  background: `linear-gradient(to top, ${day.color}, ${day.color}80)`
                }"
              ></div>
              <span class="text-sm font-bold text-gray-700">{{ day.day }}</span>
              <span class="text-xs text-gray-500 font-semibold">{{ day.mood }}/10</span>
            </div>
          </div>
          <div class="absolute top-4 right-4 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-full shadow-lg">
            <span class="text-sm font-bold text-orange-700">Average: 7.2</span>
          </div>
        </div>
      </BaseCard>

      <!-- Habit Completion Chart -->
      <BaseCard>
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
            <h3 class="text-xl font-bold text-gradient">Habit Completion 🎯</h3>
          </div>
        </template>
        
        <div class="space-y-6">
          <div v-for="habit in habitStats" :key="habit.name" class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="font-bold text-gray-800 text-lg">{{ habit.name }}</span>
              <span class="text-lg font-bold text-gradient">{{ habit.completion }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-4 shadow-inner">
              <div 
                class="h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                :style="{ 
                  width: `${habit.completion}%`,
                  background: `linear-gradient(90deg, ${habit.color}, ${habit.color}80)`
                }"
              ></div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Additional Analytics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Mood Distribution -->
      <BaseCard>
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
            <h3 class="text-lg font-bold text-gradient">Mood Distribution 🎭</h3>
          </div>
        </template>
        
        <div class="space-y-4">
          <div v-for="mood in moodDistribution" :key="mood.range" class="flex items-center space-x-4">
            <div class="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg" :style="{ backgroundColor: mood.color }">
              {{ mood.emoji }}
            </div>
            <div class="flex-1">
              <div class="flex justify-between text-sm mb-2">
                <span class="font-bold text-gray-800">{{ mood.range }}</span>
                <span class="text-gray-600 font-semibold">{{ mood.count }} days</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                <div 
                  class="h-3 rounded-full transition-all duration-1000 ease-out"
                  :style="{ 
                    width: `${(mood.count / 30) * 100}%`,
                    backgroundColor: mood.color
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Streak Calendar -->
      <BaseCard>
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"></div>
            <h3 class="text-lg font-bold text-gradient">Streak Calendar 🔥</h3>
          </div>
        </template>
        
        <div class="grid grid-cols-7 gap-2">
          <div v-for="day in streakCalendar" :key="day.date" 
               class="w-8 h-8 rounded-xl text-xs flex items-center justify-center font-bold shadow-lg transition-all duration-200 hover:scale-110"
               :class="day.completed ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white' : 'bg-gray-200 text-gray-500'">
            {{ day.day }}
          </div>
        </div>
        <div class="mt-6 text-center">
          <span class="text-3xl font-bold text-gradient">{{ currentStreak }} day streak!</span>
          <p class="text-sm text-gray-600 mt-1">Keep it up! 🌟</p>
        </div>
      </BaseCard>

      <!-- Wellness Score -->
      <BaseCard>
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"></div>
            <h3 class="text-lg font-bold text-gradient">Wellness Score 💎</h3>
          </div>
        </template>
        
        <div class="text-center">
          <div class="relative w-40 h-40 mx-auto mb-6">
            <svg class="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="wellnessGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
                  <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="40" stroke="#e5e7eb" stroke-width="8" fill="none"/>
              <circle cx="50" cy="50" r="40" stroke="url(#wellnessGradient)" stroke-width="8" fill="none" 
                      stroke-dasharray="251.2" :stroke-dashoffset="251.2 - (wellnessScore / 100) * 251.2"
                      class="transition-all duration-1000 ease-out"/>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-4xl font-bold text-gradient">{{ wellnessScore }}</span>
            </div>
          </div>
          <p class="text-xl font-bold text-gray-800">Overall Wellness</p>
          <p class="text-sm text-gray-600 mt-2">Keep up the great work! 🌟</p>
        </div>
      </BaseCard>
    </div>

    <!-- Insights Section -->
    <BaseCard>
      <template #header>
        <div class="flex items-center space-x-3">
          <div class="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
          <h3 class="text-xl font-bold text-gradient">AI Insights 🤖</h3>
        </div>
      </template>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
          <div class="flex items-start space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
              <span class="text-white text-lg">💡</span>
            </div>
            <div>
              <h4 class="font-bold text-gray-800 mb-2">Mood Improvement</h4>
              <p class="text-sm text-gray-600">Your mood has improved by 15% this week compared to last week. Great job! 🎉</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div class="flex items-start space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
              <span class="text-white text-lg">🎯</span>
            </div>
            <div>
              <h4 class="font-bold text-gray-800 mb-2">Habit Consistency</h4>
              <p class="text-sm text-gray-600">You're maintaining a 85% completion rate on your habits. Consistency is key! 💪</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
          <div class="flex items-start space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
              <span class="text-white text-lg">📝</span>
            </div>
            <div>
              <h4 class="font-bold text-gray-800 mb-2">Journal Reflection</h4>
              <p class="text-sm text-gray-600">You've written 5 journal entries this week. Reflection helps with growth! ✨</p>
            </div>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
          <div class="flex items-start space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
              <span class="text-white text-lg">🏆</span>
            </div>
            <div>
              <h4 class="font-bold text-gray-800 mb-2">Achievement Unlocked</h4>
              <p class="text-sm text-gray-600">You've earned 3 new badges this month! Keep up the amazing work! 🎊</p>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHabitsStore } from '@/stores/habits'
import BaseCard from '@/components/ui/BaseCard.vue'

const habitsStore = useHabitsStore()

// Static analytics data
const moodChartData = ref([
  { day: 'Mon', mood: 7, color: '#10b981' },
  { day: 'Tue', mood: 8, color: '#3b82f6' },
  { day: 'Wed', mood: 6, color: '#8b5cf6' },
  { day: 'Thu', mood: 9, color: '#f59e0b' },
  { day: 'Fri', mood: 8, color: '#ec4899' },
  { day: 'Sat', mood: 7, color: '#06b6d4' },
  { day: 'Sun', mood: 8, color: '#84cc16' }
])

const habitStats = ref([
  { name: 'Exercise', completion: 85, color: '#10b981' },
  { name: 'Meditation', completion: 70, color: '#3b82f6' },
  { name: 'Reading', completion: 60, color: '#8b5cf6' },
  { name: 'Water Intake', completion: 90, color: '#06b6d4' }
])

const moodDistribution = ref([
  { range: '1-3', emoji: '😢', count: 2, color: '#ef4444' },
  { range: '4-6', emoji: '😐', count: 8, color: '#f59e0b' },
  { range: '7-8', emoji: '😊', count: 15, color: '#10b981' },
  { range: '9-10', emoji: '🤩', count: 5, color: '#8b5cf6' }
])

const streakCalendar = ref([
  { day: 1, date: '2024-01-01', completed: true },
  { day: 2, date: '2024-01-02', completed: true },
  { day: 3, date: '2024-01-03', completed: false },
  { day: 4, date: '2024-01-04', completed: true },
  { day: 5, date: '2024-01-05', completed: true },
  { day: 6, date: '2024-01-06', completed: true },
  { day: 7, date: '2024-01-07', completed: false },
  { day: 8, date: '2024-01-08', completed: true },
  { day: 9, date: '2024-01-09', completed: true },
  { day: 10, date: '2024-01-10', completed: true },
  { day: 11, date: '2024-01-11', completed: true },
  { day: 12, date: '2024-01-12', completed: true },
  { day: 13, date: '2024-01-13', completed: true },
  { day: 14, date: '2024-01-14', completed: true },
  { day: 15, date: '2024-01-15', completed: true },
  { day: 16, date: '2024-01-16', completed: true },
  { day: 17, date: '2024-01-17', completed: true },
  { day: 18, date: '2024-01-18', completed: true },
  { day: 19, date: '2024-01-19', completed: true },
  { day: 20, date: '2024-01-20', completed: true },
  { day: 21, date: '2024-01-21', completed: true },
  { day: 22, date: '2024-01-22', completed: true },
  { day: 23, date: '2024-01-23', completed: true },
  { day: 24, date: '2024-01-24', completed: true },
  { day: 25, date: '2024-01-25', completed: true },
  { day: 26, date: '2024-01-26', completed: true },
  { day: 27, date: '2024-01-27', completed: true },
  { day: 28, date: '2024-01-28', completed: true },
  { day: 29, date: '2024-01-29', completed: true },
  { day: 30, date: '2024-01-30', completed: true }
])

const wellnessScore = ref(87)

// Get current streak from habits store
const currentStreak = computed(() => habitsStore.currentStreak || 7)
</script>
