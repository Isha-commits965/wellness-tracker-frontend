<template>
  <div v-if="loading" :class="containerClasses">
    <div class="flex flex-col items-center justify-center space-y-4">
      <!-- Spinner -->
      <div v-if="type === 'spinner'" :class="spinnerClasses">
        <svg class="animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <!-- Dots -->
      <div v-else-if="type === 'dots'" class="flex space-x-1">
        <div v-for="i in 3" :key="i" :class="dotClasses" :style="{ animationDelay: `${(i - 1) * 0.1}s` }"></div>
      </div>
      
      <!-- Pulse -->
      <div v-else-if="type === 'pulse'" :class="pulseClasses"></div>
      
      <!-- Skeleton -->
      <div v-else-if="type === 'skeleton'" class="w-full space-y-3">
        <div v-for="i in lines" :key="i" :class="skeletonClasses" :style="{ width: i === lines ? '75%' : '100%' }"></div>
      </div>
      
      <!-- Text -->
      <p v-if="text" :class="textClasses">{{ text }}</p>
    </div>
  </div>
  
  <div v-else-if="skeleton" class="w-full space-y-3">
    <div v-for="i in lines" :key="i" :class="skeletonClasses" :style="{ width: i === lines ? '75%' : '100%' }"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  loading?: boolean
  skeleton?: boolean
  type?: 'spinner' | 'dots' | 'pulse' | 'skeleton'
  size?: 'sm' | 'md' | 'lg'
  text?: string
  lines?: number
  fullscreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  skeleton: false,
  type: 'spinner',
  size: 'md',
  lines: 3,
  fullscreen: false
})

const containerClasses = computed(() => {
  const baseClasses = 'flex items-center justify-center'
  
  if (props.fullscreen) {
    return `${baseClasses} fixed inset-0 bg-white bg-opacity-75 z-50`
  }
  
  return `${baseClasses} p-8`
})

const spinnerClasses = computed(() => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }
  
  return `${sizeClasses[props.size]} text-primary-600`
})

const dotClasses = computed(() => {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  }
  
  return `${sizeClasses[props.size]} bg-primary-600 rounded-full animate-bounce`
})

const pulseClasses = computed(() => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }
  
  return `${sizeClasses[props.size]} bg-primary-600 rounded-full animate-pulse`
})

const skeletonClasses = computed(() => {
  const heightClasses = {
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-6'
  }
  
  return `${heightClasses[props.size]} bg-gray-200 rounded animate-pulse`
})

const textClasses = computed(() => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }
  
  return `${sizeClasses[props.size]} text-gray-600`
})
</script>

<style scoped>
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
