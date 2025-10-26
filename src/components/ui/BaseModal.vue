<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="handleBackdropClick"
      >
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <Transition
            enter-active-class="duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              :class="modalClasses"
              @click.stop
            >
              <!-- Header -->
              <div v-if="title || closable" class="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 v-if="title" class="text-lg font-semibold text-gray-900">
                  {{ title }}
                </h3>
                <button
                  v-if="closable"
                  @click="$emit('close')"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <!-- Content -->
              <div class="p-6">
                <slot />
              </div>
              
              <!-- Footer -->
              <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200">
                <slot name="footer" />
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isOpen: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  size: 'md',
  closable: true
})

const emit = defineEmits<{
  close: []
}>()

const modalClasses = computed(() => {
  const baseClasses = 'relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all'
  
  const sizeClasses = {
    sm: 'w-full max-w-md',
    md: 'w-full max-w-lg',
    lg: 'w-full max-w-2xl',
    xl: 'w-full max-w-4xl'
  }
  
  return [baseClasses, sizeClasses[props.size]].join(' ')
})

const handleBackdropClick = () => {
  if (props.closable) {
    emit('close')
  }
}
</script>
