<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClass"
    :style="buttonStyle"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" style="margin-right: 0.5rem;">
      <svg style="animation: spin 1s linear infinite; height: 1rem; width: 1rem; display: inline-block;" fill="none" viewBox="0 0 24 24">
        <circle style="opacity: 0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path style="opacity: 0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button'
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClass = computed(() => {
  return 'btn-' + props.variant
})

const buttonStyle = computed(() => {
  const sizes = {
    sm: { padding: '0.375rem 0.75rem', fontSize: '0.875rem' },
    md: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    lg: { padding: '0.75rem 1.5rem', fontSize: '1rem' }
  }
  
  const sizeStyle = sizes[props.size]
  
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
    cursor: props.disabled || props.loading ? 'not-allowed' : 'pointer',
    opacity: props.disabled || props.loading ? '0.5' : '1',
    ...sizeStyle
  }
})

</script>
