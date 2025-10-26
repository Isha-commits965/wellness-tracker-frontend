<template>
  <BaseCard :hover="clickable" @click="handleClick">
    <div class="flex items-center">
      <div :class="iconClasses">
        <component :is="icon" class="h-6 w-6" />
      </div>
      
      <div class="ml-4 flex-1">
        <p class="text-sm font-semibold text-gray-700 uppercase tracking-wide">{{ title }}</p>
        <div class="flex items-baseline">
          <p class="text-3xl font-bold text-gradient">{{ formattedValue }}</p>
          <p v-if="change !== undefined" :class="changeClasses" class="ml-2 text-sm font-medium">
            <component :is="changeIcon" class="h-4 w-4 inline mr-1" />
            {{ Math.abs(change) }}{{ changeType }}
          </p>
        </div>
        <p v-if="subtitle" class="text-sm text-gray-600 font-medium">{{ subtitle }}</p>
      </div>
    </div>
    
    <!-- Progress bar -->
    <div v-if="progress !== undefined" class="mt-6">
      <div class="flex justify-between text-sm font-semibold text-gray-700 mb-2">
        <span>Progress</span>
        <span class="text-gradient">{{ progress }}%</span>
      </div>
      <div class="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-3 shadow-inner">
        <div
          :class="progressBarClasses"
          :style="{ width: `${progress}%` }"
          class="h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
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
  const baseClasses = 'flex-shrink-0 p-4 rounded-2xl transition-all duration-300 hover:scale-110'
  
  const colorClasses = {
    primary: 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/25',
    success: 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-500/25',
    warning: 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-500/25',
    danger: 'bg-gradient-to-br from-red-400 to-red-600 text-white shadow-lg shadow-red-500/25',
    info: 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/25'
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
    primary: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
    success: 'bg-gradient-to-r from-green-400 to-green-600',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    danger: 'bg-gradient-to-r from-red-400 to-red-600',
    info: 'bg-gradient-to-r from-blue-400 to-blue-600'
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
