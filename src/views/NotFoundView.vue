<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="mx-auto h-24 w-24 text-gray-400">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 class="mt-4 text-3xl font-bold text-gray-900">404</h1>
      <p class="mt-2 text-lg text-gray-600">Page not found</p>
      <p class="mt-1 text-sm text-gray-500">The page you're looking for doesn't exist.</p>
      <div class="mt-6">
        <router-link to="/dashboard" class="btn-primary">
          Go to Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404 Not Found view
</script>
