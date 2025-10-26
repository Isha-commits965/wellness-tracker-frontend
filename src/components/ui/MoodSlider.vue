<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span class="text-gray-500 ml-1">({{ value }}/10)</span>
    </label>
    
    <div class="relative">
      <input
        :id="inputId"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        :disabled="disabled"
        :class="sliderClasses"
        @input="handleInput"
        @change="handleChange"
      />
      
      <!-- Value indicators -->
      <div class="flex justify-between text-xs text-gray-500 mt-1">
        <span>{{ min }}</span>
        <span>{{ max }}</span>
      </div>
      
      <!-- Current value indicator -->
      <div
        :style="{ left: `${((modelValue - min) / (max - min)) * 100}%` }"
        class="absolute -top-8 transform -translate-x-1/2"
      >
        <div class="bg-primary-600 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
          {{ modelValue }}
        </div>
      </div>
    </div>
    
    <!-- Mood emoji indicator -->
    <div v-if="showEmoji" class="flex justify-center">
      <span class="text-2xl">{{ getMoodEmoji(modelValue) }}</span>
    </div>
    
    <!-- Mood description -->
    <div v-if="showDescription" class="text-center">
      <span class="text-sm text-gray-600">{{ getMoodDescription(modelValue) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: number
  label?: string
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  showEmoji?: boolean
  showDescription?: boolean
  type?: 'mood' | 'energy' | 'stress'
}

const props = withDefaults(defineProps<Props>(), {
  min: 1,
  max: 10,
  step: 1,
  disabled: false,
  showEmoji: true,
  showDescription: true,
  type: 'mood'
})

const inputId = computed(() => `slider-${Math.random().toString(36).substr(2, 9)}`)

const sliderClasses = computed(() => {
  const baseClasses = 'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
  const disabledClasses = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  return [baseClasses, disabledClasses].join(' ')
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: number]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', parseInt(target.value))
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('change', parseInt(target.value))
}

const getMoodEmoji = (value: number): string => {
  if (props.type === 'energy') {
    if (value >= 9) return '⚡'
    if (value >= 7) return '🔋'
    if (value >= 5) return '🔌'
    if (value >= 3) return '🪫'
    return '💤'
  }
  
  if (props.type === 'stress') {
    if (value >= 9) return '😰'
    if (value >= 7) return '😟'
    if (value >= 5) return '😐'
    if (value >= 3) return '😌'
    return '😌'
  }
  
  // Default mood
  if (value >= 9) return '😄'
  if (value >= 7) return '😊'
  if (value >= 5) return '😐'
  if (value >= 3) return '😔'
  return '😢'
}

const getMoodDescription = (value: number): string => {
  if (props.type === 'energy') {
    if (value >= 9) return 'Very High Energy'
    if (value >= 7) return 'High Energy'
    if (value >= 5) return 'Moderate Energy'
    if (value >= 3) return 'Low Energy'
    return 'Very Low Energy'
  }
  
  if (props.type === 'stress') {
    if (value >= 9) return 'Very Stressed'
    if (value >= 7) return 'Stressed'
    if (value >= 5) return 'Moderate Stress'
    if (value >= 3) return 'Low Stress'
    return 'Very Low Stress'
  }
  
  // Default mood
  if (value >= 9) return 'Excellent'
  if (value >= 7) return 'Good'
  if (value >= 5) return 'Okay'
  if (value >= 3) return 'Poor'
  return 'Very Poor'
}
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #10b981;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

input[type="range"]::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #10b981;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

input[type="range"]::-ms-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #10b981;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
