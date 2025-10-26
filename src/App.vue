<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'

const route = useRoute()
const authStore = useAuthStore()

// Initialize auth state
authStore.initializeAuth()

const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register'
})
</script>

<template>
  <div id="app">
    <AppLayout v-if="!isAuthPage" />
    <RouterView v-else />
  </div>
</template>

<style>
#app {
  font-family: 'Inter', system-ui, sans-serif;
}
</style>
