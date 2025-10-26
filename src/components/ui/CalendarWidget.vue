<template>
  <BaseCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900">{{ monthYear }}</h3>
        <div class="flex space-x-2">
          <button
            @click="previousMonth"
            class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            @click="nextMonth"
            class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </template>
    
    <div class="grid grid-cols-7 gap-1">
      <!-- Day headers -->
      <div
        v-for="day in dayHeaders"
        :key="day"
        class="text-center text-sm font-medium text-gray-500 py-2"
      >
        {{ day }}
      </div>
      
      <!-- Calendar days -->
      <div
        v-for="day in calendarDays"
        :key="`${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`"
        :class="dayClasses(day)"
        @click="selectDate(day.date)"
      >
        <div class="text-sm font-medium">{{ day.date.getDate() }}</div>
        
        <!-- Indicators -->
        <div v-if="day.indicators.length > 0 || day.hasStreak" class="flex justify-center mt-1 space-x-1">
          <!-- Streak indicator (priority) -->
          <div
            v-if="day.hasStreak"
            class="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
            title="All habits completed! 🎉"
          >
            <svg class="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
          
          <!-- Other indicators -->
          <div
            v-for="(indicator, index) in day.indicators.slice(0, day.hasStreak ? 2 : 3)"
            :key="index"
            :class="indicatorClasses(indicator)"
            class="w-1.5 h-1.5 rounded-full"
          ></div>
          <div
            v-if="day.indicators.length > (day.hasStreak ? 2 : 3)"
            class="w-1.5 h-1.5 rounded-full bg-gray-300"
          ></div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  indicators: CalendarIndicator[]
  hasStreak: boolean
}

interface CalendarIndicator {
  type: 'habit' | 'mood' | 'journal' | 'goal'
  color: string
}

interface Props {
  selectedDate?: Date
  data?: { [key: string]: CalendarIndicator[] }
  streakDates?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  selectedDate: () => new Date(),
  data: () => ({}),
  streakDates: () => []
})

const currentDate = ref(new Date())
const selectedDate = ref(props.selectedDate)

const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const monthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
})

const calendarDays = computed((): CalendarDay[] => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // First day of the month
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  // Start from Sunday of the first week
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days: CalendarDay[] = []
  const today = new Date()
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    const isCurrentMonth = date.getMonth() === month
    const isToday = date.toDateString() === today.toDateString()
    const isSelected = selectedDate.value && date.toDateString() === selectedDate.value.toDateString()
    
    const dateKey = date.toISOString().split('T')[0]
    const indicators = props.data[dateKey] || []
    const hasStreak = props.streakDates.includes(dateKey)
    
    days.push({
      date,
      isCurrentMonth,
      isToday,
      isSelected,
      indicators,
      hasStreak
    })
  }
  
  return days
})

const dayClasses = (day: CalendarDay) => {
  const baseClasses = 'relative p-2 text-center cursor-pointer rounded-lg transition-colors duration-200'
  
  let classes = baseClasses
  
  if (!day.isCurrentMonth) {
    classes += ' text-gray-400'
  } else if (day.isToday) {
    classes += ' bg-primary-100 text-primary-900 font-semibold'
  } else if (day.isSelected) {
    classes += ' bg-primary-600 text-white'
  } else {
    classes += ' text-gray-900 hover:bg-gray-100'
  }
  
  return classes
}

const indicatorClasses = (indicator: CalendarIndicator) => {
  const colorClasses = {
    habit: 'bg-green-500',
    mood: 'bg-blue-500',
    journal: 'bg-purple-500',
    goal: 'bg-yellow-500'
  }
  
  return colorClasses[indicator.type] || 'bg-gray-400'
}

const emit = defineEmits<{
  'date-selected': [date: Date]
  'month-changed': [date: Date]
}>()

const selectDate = (date: Date) => {
  selectedDate.value = date
  emit('date-selected', date)
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  emit('month-changed', currentDate.value)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  emit('month-changed', currentDate.value)
}
</script>
