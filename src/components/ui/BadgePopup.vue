<template>
  <BaseModal 
    :isOpen="isOpen" 
    @close="$emit('close')"
    size="md"
    :closable="true"
  >
    <div class="text-center py-8">
      <!-- Badge Icon -->
      <div class="mb-6">
        <div 
          :class="[
            'text-8xl mb-4 transform transition-all duration-500',
            isAnimating ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
          ]"
        >
          {{ badge?.icon }}
        </div>
        <div class="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
      </div>

      <!-- Badge Title -->
      <h2 class="text-3xl font-bold text-gray-900 mb-2">
        🎉 Badge Unlocked! 🎉
      </h2>
      
      <!-- Badge Name -->
      <h3 
        :class="[
          'text-4xl font-bold mb-4',
          badge?.color || 'text-gray-900'
        ]"
      >
        {{ badge?.name }}
      </h3>

      <!-- Badge Description -->
      <p class="text-lg text-gray-600 mb-6 max-w-md mx-auto">
        {{ badge?.description }}
      </p>

      <!-- Streak Info -->
      <div v-if="streak" class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
        <p class="text-sm text-gray-600 mb-1">Current Streak</p>
        <p class="text-2xl font-bold text-gray-900">{{ streak }} days</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-4 justify-center">
        <BaseButton 
          variant="primary" 
          @click="$emit('close')"
          class="px-8 py-3"
        >
          Awesome! 🚀
        </BaseButton>
        <BaseButton 
          variant="outline" 
          @click="$emit('viewAll')"
          class="px-8 py-3"
        >
          View All Badges
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import type { Badge } from '@/types'

interface Props {
  isOpen: boolean
  badge?: Badge
  streak?: number
}

const props = defineProps<Props>()

defineEmits<{
  close: []
  viewAll: []
}>()

const isAnimating = ref(false)

// Trigger animation when badge changes
watch(() => props.badge, () => {
  if (props.badge) {
    isAnimating.value = true
    setTimeout(() => {
      isAnimating.value = false
    }, 1000)
  }
}, { immediate: true })
</script>
