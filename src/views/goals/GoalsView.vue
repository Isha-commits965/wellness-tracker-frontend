<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gradient">Goals 🎯</h1>
        <p class="mt-2 text-lg text-gray-600">Set and track your wellness goals</p>
      </div>
      <BaseButton @click="showCreateModal = true" class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
        <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        New Goal
      </BaseButton>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-600 font-semibold">Total Goals</p>
            <p class="text-3xl font-bold text-blue-800">{{ goalsStore.totalGoals }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <span class="text-2xl">🎯</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-green-600 font-semibold">Completed</p>
            <p class="text-3xl font-bold text-green-800">{{ goalsStore.completedGoalsCount }}</p>
          </div>
          <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <span class="text-2xl">✅</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-orange-600 font-semibold">Active</p>
            <p class="text-3xl font-bold text-orange-800">{{ goalsStore.activeGoals.length }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
            <span class="text-2xl">🔥</span>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-red-100 to-red-200 rounded-2xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-red-600 font-semibold">Overdue</p>
            <p class="text-3xl font-bold text-red-800">{{ goalsStore.overdueGoals.length }}</p>
          </div>
          <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
            <span class="text-2xl">⚠️</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex space-x-1 bg-gray-100 p-1 rounded-xl">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition-all duration-200',
          activeTab === tab.key
            ? 'bg-white text-purple-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        {{ tab.label }}
        <span v-if="tab.count !== undefined" class="ml-2 px-2 py-1 bg-gray-200 rounded-full text-xs">
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Goals List -->
    <div class="space-y-4">
      <div v-if="goalsStore.isLoading" class="text-center py-8">
        <BaseLoading type="spinner" text="Loading goals..." />
      </div>
      
      <div v-else-if="filteredGoals.length === 0" class="text-center py-16">
        <div class="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-12 max-w-md mx-auto">
          <div class="text-8xl mb-6 animate-bounce-slow">🎯</div>
          <h3 class="text-2xl font-bold text-gradient mb-4">No goals yet</h3>
          <p class="text-lg text-gray-600 mb-8">Start your wellness journey by setting your first goal.</p>
          <BaseButton @click="showCreateModal = true" class="bg-gradient-to-r from-purple-500 to-pink-500">
            Create Your First Goal
          </BaseButton>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="goal in filteredGoals"
          :key="goal.id"
          class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="text-xl font-bold text-gray-900">{{ goal.title }}</h3>
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    goal.isCompleted
                      ? 'bg-green-100 text-green-800'
                      : goalStore.isOverdue(goal)
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  ]"
                >
                  {{ goal.isCompleted ? 'Completed' : goalStore.isOverdue(goal) ? 'Overdue' : 'Active' }}
                </span>
              </div>
              
              <p v-if="goal.description" class="text-gray-600 mb-4">{{ goal.description }}</p>
              
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <div v-if="goal.targetDate" class="flex items-center space-x-1">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ formatDate(goal.targetDate) }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ formatDate(goal.createdAt) }}</span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-2 ml-4">
              <button
                v-if="!goal.isCompleted"
                @click="completeGoal(goal.id)"
                class="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                title="Mark as complete"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              
              <button
                @click="editGoal(goal)"
                class="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                title="Edit goal"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              <button
                @click="deleteGoal(goal.id)"
                class="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                title="Delete goal"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Goal Modal -->
    <BaseModal
      :isOpen="showCreateModal || showEditModal"
      @close="closeModal"
      :title="showCreateModal ? 'Create New Goal' : 'Edit Goal'"
    >
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="label">Goal Title</label>
          <input
            v-model="goalForm.title"
            type="text"
            class="input-field"
            placeholder="e.g., Lose 10 pounds"
            required
          />
        </div>

        <div>
          <label class="label">Description (Optional)</label>
          <textarea
            v-model="goalForm.description"
            class="input-field"
            rows="3"
            placeholder="Describe your goal and how you plan to achieve it..."
          />
        </div>

        <div>
          <label class="label">Target Date (Optional)</label>
          <input
            v-model="goalForm.targetDate"
            type="date"
            class="input-field"
          />
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="secondary" @click="closeModal">
            Cancel
          </BaseButton>
          <BaseButton type="submit" :loading="isSubmitting" @click="handleSubmit">
            {{ showCreateModal ? 'Create Goal' : 'Update Goal' }}
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useGoalsStore } from '@/stores/goals'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseLoading from '@/components/ui/BaseLoading.vue'
import type { Goal } from '@/types'

const goalsStore = useGoalsStore()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const isSubmitting = ref(false)
const editingGoal = ref<Goal | null>(null)
const activeTab = ref('all')

const goalForm = reactive({
  title: '',
  description: '',
  targetDate: ''
})

const tabs = computed(() => [
  { key: 'all', label: 'All Goals', count: goalsStore.totalGoals },
  { key: 'active', label: 'Active', count: goalsStore.activeGoals.length },
  { key: 'completed', label: 'Completed', count: goalsStore.completedGoalsCount },
  { key: 'overdue', label: 'Overdue', count: goalsStore.overdueGoals.length }
])

const filteredGoals = computed(() => {
  switch (activeTab.value) {
    case 'active':
      return goalsStore.activeGoals
    case 'completed':
      return goalsStore.completedGoals
    case 'overdue':
      return goalsStore.overdueGoals
    default:
      return goalsStore.goals
  }
})

const goalStore = {
  isOverdue(goal: Goal): boolean {
    if (!goal.targetDate || goal.isCompleted) return false
    return new Date(goal.targetDate) < new Date()
  }
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const resetForm = () => {
  goalForm.title = ''
  goalForm.description = ''
  goalForm.targetDate = ''
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingGoal.value = null
  resetForm()
}

const editGoal = (goal: Goal) => {
  editingGoal.value = goal
  goalForm.title = goal.title
  goalForm.description = goal.description || ''
  goalForm.targetDate = goal.targetDate || ''
  showEditModal.value = true
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    
    if (showCreateModal.value) {
      await goalsStore.createGoal({
        title: goalForm.title,
        description: goalForm.description || undefined,
        targetDate: goalForm.targetDate || undefined,
        isCompleted: false
      })
    } else if (editingGoal.value) {
      await goalsStore.updateGoal(editingGoal.value.id, {
        title: goalForm.title,
        description: goalForm.description || undefined,
        targetDate: goalForm.targetDate || undefined
      })
    }
    
    closeModal()
  } catch (error) {
    console.error('Failed to save goal:', error)
  } finally {
    isSubmitting.value = false
  }
}

const completeGoal = async (goalId: string) => {
  try {
    await goalsStore.completeGoal(goalId)
  } catch (error) {
    console.error('Failed to complete goal:', error)
  }
}

const deleteGoal = async (goalId: string) => {
  if (confirm('Are you sure you want to delete this goal?')) {
    try {
      await goalsStore.deleteGoal(goalId)
    } catch (error) {
      console.error('Failed to delete goal:', error)
    }
  }
}

onMounted(async () => {
  try {
    await goalsStore.fetchGoals()
  } catch (error) {
    console.error('Failed to load goals:', error)
  }
})
</script>
