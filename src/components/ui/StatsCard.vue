<template>
  <BaseCard :hover="clickable" @click="handleClick">
    <div class="flex items-center">
      <div :class="iconClasses">
        <component :is="icon" class="h-6 w-6" />
      </div>
      
      <div class="ml-4 flex-1">
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        <div class="flex items-baseline">
          <p class="text-2xl font-semibold text-gray-900">{{ formattedValue }}</p>
          <p v-if="change !== undefined" :class="changeClasses" class="ml-2 text-sm font-medium">
            <component :is="changeIcon" class="h-4 w-4 inline mr-1" />
            {{ Math.abs(change) }}{{ changeType }}
          </p>
        </div>
        <p v-if="subtitle" class="text-sm text-gray-500">{{ subtitle }}</p>
      </div>
    </div>
    
    <!-- Progress bar -->
    <div v-if="progress !== undefined" class="mt-4">
      <div class="flex justify-between text-sm text-gray-600 mb-1">
        <span>Progress</span>
        <span>{{ progress }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          :class="progressBarClasses"
          :style="{ width: `${progress}%` }"
          class="h-2 rounded-full transition-all duration-300"
        ></div>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: string | number
  subtitle?: string
  icon: any
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  change?: number
  changeType?: 'percent' | 'absolute'
  progress?: number
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  changeType: 'percent',
  clickable: false
})

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString()
  }
  return props.value
})

const iconClasses = computed(() => {
  const baseClasses = 'flex-shrink-0 p-3 rounded-lg'
  
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    danger: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600'
  }
  
  return [baseClasses, colorClasses[props.color]].join(' ')
})

const changeClasses = computed(() => {
  if (props.change === undefined) return ''
  
  const baseClasses = 'flex items-center'
  
  if (props.change > 0) {
    return `${baseClasses} text-green-600`
  } else if (props.change < 0) {
    return `${baseClasses} text-red-600`
  }
  
  return `${baseClasses} text-gray-600`
})

const changeIcon = computed(() => {
  if (props.change === undefined) return null
  
  if (props.change > 0) {
    return 'svg' // Up arrow
  } else if (props.change < 0) {
    return 'svg' // Down arrow
  }
  
  return 'svg' // Minus
})

const progressBarClasses = computed(() => {
  const colorClasses = {
    primary: 'bg-primary-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
    info: 'bg-blue-600'
  }
  
  return colorClasses[props.color]
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>
