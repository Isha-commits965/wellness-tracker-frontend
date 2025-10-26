<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Habits</h1>
        <p class="mt-1 text-sm text-gray-500">Track your daily habits and build consistency</p>
      </div>
      <BaseButton @click="showCreateModal = true">
        <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Habit
      </BaseButton>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        title="Total Habits"
        :value="habitsStore.totalHabits"
        subtitle="All habits"
        icon="svg"
        color="primary"
      />
      <StatsCard
        title="Active Habits"
        :value="habitsStore.activeHabitsCount"
        subtitle="Currently tracking"
        icon="svg"
        color="success"
      />
      <StatsCard
        title="Today's Completion"
        :value="`${Math.round(habitsStore.completionRate)}%`"
        :subtitle="`${habitsStore.completedHabitsToday.length} of ${habitsStore.activeHabitsCount} completed`"
        icon="svg"
        color="info"
      />
    </div>
    
    <!-- Completion Progress Bar -->
    <BaseCard v-if="habitsStore.activeHabitsCount > 0">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-900">Today's Progress</h3>
          <span class="text-sm font-semibold" :class="habitsStore.completionRate >= 100 ? 'text-green-600' : habitsStore.completionRate >= 50 ? 'text-blue-600' : 'text-gray-600'">
            {{ Math.round(habitsStore.completionRate) }}%
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3">
          <div 
            class="h-3 rounded-full transition-all duration-500 ease-out"
            :class="habitsStore.completionRate >= 100 ? 'bg-green-500' : habitsStore.completionRate >= 50 ? 'bg-blue-500' : 'bg-gray-400'"
            :style="{ width: `${habitsStore.completionRate}%` }"
          ></div>
        </div>
        <p class="text-xs text-gray-500">
          {{ habitsStore.completedHabitsToday.length }} out of {{ habitsStore.activeHabitsCount }} habits completed today
        </p>
      </div>
    </BaseCard>

    <!-- Habits list -->
    <div class="space-y-4">
      <div v-if="habitsStore.isLoading" class="text-center py-8">
        <BaseLoading type="spinner" text="Loading habits..." />
      </div>
      
      <div v-else-if="!habitsStore.habits || habitsStore.habits.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No habits yet</h3>
        <p class="mt-1 text-sm text-gray-500">Get started by creating your first habit.</p>
        <BaseButton @click="showCreateModal = true" class="mt-4">
          Create your first habit
        </BaseButton>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="habit in validHabits"
          :key="habit.id"
          class="card hover:shadow-md transition-shadow duration-200"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">{{ habit.name }}</h3>
              <p v-if="habit.description" class="mt-1 text-sm text-gray-500">{{ habit.description }}</p>
              <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span class="flex items-center">
                  <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  {{ habit.frequency }}
                </span>
                <span class="flex items-center">
                  <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                  </svg>
                  {{ habit.category }}
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="toggleHabitStatus(habit.id, !habit.isActive)"
                :class="habit.isActive ? 'text-green-600' : 'text-gray-400'"
                class="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                @click="editHabit(habit)"
                class="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Streak info -->
          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center text-sm text-gray-500">
              <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd" />
              </svg>
              <span>{{ getHabitStreak(habit.id)?.currentStreak || 0 }} day streak</span>
            </div>
            
            <BaseButton
              v-if="habit.isActive"
              size="sm"
              :variant="isHabitCompletedToday(habit.id) ? 'secondary' : 'primary'"
              @click="toggleHabitCheckIn(habit.id)"
            >
              {{ isHabitCompletedToday(habit.id) ? 'Completed' : 'Check in' }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Habit Modal -->
    <BaseModal
      :is-open="showCreateModal || showEditModal"
      :title="showCreateModal ? 'Create New Habit' : 'Edit Habit'"
      @close="closeModal"
    >
      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <BaseInput
            v-model="habitForm.name"
            label="Habit Name"
            placeholder="e.g., Drink 8 glasses of water"
            :error="errors.name"
            required
          />
          
          <BaseInput
            v-model="habitForm.description"
            label="Description (Optional)"
            placeholder="Describe your habit..."
          />
          
          <div>
            <label class="label">Category</label>
            <select v-model="habitForm.category" class="input-field">
              <option value="health">Health</option>
              <option value="fitness">Fitness</option>
              <option value="mindfulness">Mindfulness</option>
              <option value="productivity">Productivity</option>
              <option value="learning">Learning</option>
              <option value="social">Social</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label class="label">Frequency</label>
            <select v-model="habitForm.frequency" class="input-field">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <BaseInput
              v-model.number="habitForm.targetValue"
              type="number"
              label="Target Value"
              placeholder="1"
              required
            />
            
            <BaseInput
              v-model="habitForm.unit"
              label="Unit"
              placeholder="times, glasses, minutes..."
              required
            />
          </div>
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200">
          <div class="flex justify-end space-x-3">
            <BaseButton variant="secondary" @click="closeModal">
              Cancel
            </BaseButton>
            <BaseButton type="submit" :loading="isSubmitting">
              {{ showCreateModal ? 'Create Habit' : 'Update Habit' }}
            </BaseButton>
          </div>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { useHabitsStore } from '@/stores/habits'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseLoading from '@/components/ui/BaseLoading.vue'
import StatsCard from '@/components/ui/StatsCard.vue'
import type { Habit } from '@/types'

const habitsStore = useHabitsStore()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const isSubmitting = ref(false)
const editingHabit = ref<Habit | null>(null)

const habitForm = reactive({
  name: '',
  description: '',
  category: 'health',
  frequency: 'daily',
  targetValue: 1,
  unit: 'times'
})

const errors = ref<{ [key: string]: string }>({})

const validHabits = computed(() => {
  return habitsStore.habits?.filter(habit => habit != null) || []
})

onMounted(async () => {
  try {
    await Promise.all([
      habitsStore.fetchHabits(),
      habitsStore.fetchCheckIns(),
      habitsStore.fetchStreaks()
    ])
  } catch (error) {
    console.error('Failed to load habits:', error)
  }
})

const getHabitStreak = (habitId: string) => {
  return habitsStore.getHabitStreak(habitId)
}

const isHabitCompletedToday = (habitId: string) => {
  return habitsStore.isHabitCompletedToday(habitId)
}

const toggleHabitStatus = async (habitId: string, isActive: boolean) => {
  try {
    await habitsStore.toggleHabitStatus(habitId, isActive)
    
    // Force reactivity update to ensure immediate UI changes
    await nextTick()
  } catch (error) {
    console.error('Failed to toggle habit status:', error)
  }
}

const toggleHabitCheckIn = async (habitId: string) => {
  try {
    if (isHabitCompletedToday(habitId)) {
      const checkIn = habitsStore.todayCheckIns.find(c => c.habitId === habitId)
      if (checkIn) {
        await habitsStore.deleteCheckIn(checkIn.id)
      }
    } else {
      await habitsStore.createCheckIn({
        habitId,
        value: 1,
        date: new Date().toISOString().split('T')[0]
      })
    }
    
    // Force reactivity update to ensure immediate UI changes
    await nextTick()
  } catch (error) {
    console.error('Failed to toggle habit check-in:', error)
  }
}

const editHabit = (habit: Habit) => {
  editingHabit.value = habit
  habitForm.name = habit.name
  habitForm.description = habit.description || ''
  habitForm.category = habit.category
  habitForm.frequency = habit.frequency
  habitForm.targetValue = habit.targetValue
  habitForm.unit = habit.unit
  showEditModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingHabit.value = null
  resetForm()
}

const resetForm = () => {
  habitForm.name = ''
  habitForm.description = ''
  habitForm.category = 'health'
  habitForm.frequency = 'daily'
  habitForm.targetValue = 1
  habitForm.unit = 'times'
  errors.value = {}
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    errors.value = {}
    
    if (showCreateModal.value) {
      const newHabit = await habitsStore.createHabit(habitForm)
      
      // Force immediate UI update by refreshing the habits list
      await habitsStore.fetchHabits()
      
      // Force reactivity update
      await nextTick()
      
      console.log('New habit created:', newHabit)
      console.log('Current habits:', habitsStore.habits)
    } else if (editingHabit.value) {
      await habitsStore.updateHabit(editingHabit.value.id, habitForm)
      
      // Force immediate UI update
      await habitsStore.fetchHabits()
      await nextTick()
    }
    
    closeModal()
  } catch (error: any) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      console.error('Failed to save habit:', error)
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
