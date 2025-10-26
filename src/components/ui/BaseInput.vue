<template>
  <div class="space-y-1">
    <label v-if="label" :for="inputId" class="label">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="inputId"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :value="modelValue"
        :class="inputClasses"
        @input="handleInput"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      
      <div v-if="error" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <p v-else-if="helpText" class="text-sm text-gray-500">{{ helpText }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  label?: string
  helpText?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const inputClasses = computed(() => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none transition-colors duration-200'
  
  const stateClasses = props.error
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
  
  const disabledClasses = props.disabled
    ? 'bg-gray-50 cursor-not-allowed'
    : 'bg-white'
  
  return [baseClasses, stateClasses, disabledClasses].join(' ')
})
</script>
