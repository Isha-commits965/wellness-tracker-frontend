<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gradient">Meditation 🧘</h1>
      <p class="mt-2 text-lg text-gray-600">Find peace and mindfulness with guided meditation</p>
    </div>

    <!-- Categories -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="category in meditationCategories"
        :key="category.id"
        class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
      >
        <div class="flex items-center space-x-4 mb-4">
          <div :class="category.iconBg" class="w-12 h-12 rounded-2xl flex items-center justify-center">
            <span class="text-2xl">{{ category.icon }}</span>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">{{ category.name }}</h3>
            <p class="text-sm text-gray-600">{{ category.videos.length }} videos</p>
          </div>
        </div>
        
        <p class="text-gray-600 mb-4">{{ category.description }}</p>
        
        <div class="space-y-3">
          <div
            v-for="video in category.videos.slice(0, 3)"
            :key="video.id"
            class="group cursor-pointer"
            @click="openVideo(video)"
          >
            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-800 group-hover:text-indigo-700 truncate">{{ video.title }}</p>
                <p class="text-xs text-gray-600">{{ video.duration }}</p>
              </div>
            </div>
          </div>
          
          <button
            v-if="category.videos.length > 3"
            @click="showAllVideos(category)"
            class="w-full text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium py-2"
          >
            View {{ category.videos.length - 3 }} more videos
          </button>
        </div>
      </div>
    </div>

    <!-- Featured Videos -->
    <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8">
      <h2 class="text-2xl font-bold text-gradient mb-6 flex items-center">
        <span class="text-3xl mr-3">⭐</span>
        Featured Meditation Videos
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="video in featuredVideos"
          :key="video.id"
          class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
          @click="openVideo(video)"
        >
          <div class="relative mb-4">
            <div class="w-full h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
              <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            <div class="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {{ video.duration }}
            </div>
          </div>
          
          <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-700">{{ video.title }}</h3>
          <p class="text-sm text-gray-600 mb-3">{{ video.description }}</p>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span class="text-xs">⭐</span>
              </div>
              <span class="text-sm font-semibold text-gray-700">{{ video.rating }}</span>
            </div>
            <span class="text-xs text-gray-500">{{ video.views }} views</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Start -->
    <div class="bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl p-8">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-green-800 mb-2">Quick Start Your Day</h2>
          <p class="text-green-700 mb-4">Begin with a 5-minute breathing exercise to center yourself</p>
          <button
            @click="startQuickMeditation"
            class="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105"
          >
            Start 5-Minute Session
          </button>
        </div>
        <div class="text-6xl">🌅</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const meditationCategories = ref([
  {
    id: 1,
    name: 'Morning Meditation',
    icon: '🌅',
    iconBg: 'bg-gradient-to-br from-yellow-100 to-orange-200',
    description: 'Start your day with mindfulness and intention',
    videos: [
      { id: 1, title: '10-Minute Morning Meditation', duration: '10 min', url: 'https://www.youtube.com/watch?v=ZToicYcHIOU' },
      { id: 2, title: 'Sunrise Mindfulness', duration: '15 min', url: 'https://www.youtube.com/watch?v=tybOi4hjZFQ' },
      { id: 3, title: 'Gentle Wake-up Meditation', duration: '8 min', url: 'https://www.youtube.com/watch?v=86HUcX8ZtGA' },
      { id: 4, title: 'Energy Boost Meditation', duration: '12 min', url: 'https://www.youtube.com/watch?v=1ZYbU82GVz4' }
    ]
  },
  {
    id: 2,
    name: 'Stress Relief',
    icon: '😌',
    iconBg: 'bg-gradient-to-br from-blue-100 to-cyan-200',
    description: 'Calm your mind and release tension',
    videos: [
      { id: 5, title: '5-Minute Stress Relief', duration: '5 min', url: 'https://www.youtube.com/watch?v=O-6f5wQXSu8' },
      { id: 6, title: 'Deep Relaxation', duration: '20 min', url: 'https://www.youtube.com/watch?v=6p_yaNFSYao' },
      { id: 7, title: 'Anxiety Relief Meditation', duration: '15 min', url: 'https://www.youtube.com/watch?v=ZToicYcHIOU' }
    ]
  },
  {
    id: 3,
    name: 'Sleep Meditation',
    icon: '😴',
    iconBg: 'bg-gradient-to-br from-purple-100 to-indigo-200',
    description: 'Drift off peacefully with guided sleep sessions',
    videos: [
      { id: 8, title: 'Sleep Meditation', duration: '20 min', url: 'https://www.youtube.com/watch?v=1ZYbU82GVz4' },
      { id: 9, title: 'Body Scan for Sleep', duration: '25 min', url: 'https://www.youtube.com/watch?v=86HUcX8ZtGA' },
      { id: 10, title: 'Deep Sleep Stories', duration: '30 min', url: 'https://www.youtube.com/watch?v=tybOi4hjZFQ' }
    ]
  },
  {
    id: 4,
    name: 'Breathing Exercises',
    icon: '🫁',
    iconBg: 'bg-gradient-to-br from-green-100 to-emerald-200',
    description: 'Focus on your breath for instant calm',
    videos: [
      { id: 11, title: '5-Minute Breathing Exercise', duration: '5 min', url: 'https://www.youtube.com/watch?v=tybOi4hjZFQ' },
      { id: 12, title: 'Box Breathing Technique', duration: '8 min', url: 'https://www.youtube.com/watch?v=O-6f5wQXSu8' },
      { id: 13, title: '4-7-8 Breathing Method', duration: '6 min', url: 'https://www.youtube.com/watch?v=6p_yaNFSYao' }
    ]
  },
  {
    id: 5,
    name: 'Mindfulness',
    icon: '🎯',
    iconBg: 'bg-gradient-to-br from-pink-100 to-rose-200',
    description: 'Cultivate present-moment awareness',
    videos: [
      { id: 14, title: 'Mindfulness for Beginners', duration: '8 min', url: 'https://www.youtube.com/watch?v=6p_yaNFSYao' },
      { id: 15, title: 'Walking Meditation', duration: '12 min', url: 'https://www.youtube.com/watch?v=ZToicYcHIOU' },
      { id: 16, title: 'Mindful Eating Practice', duration: '10 min', url: 'https://www.youtube.com/watch?v=86HUcX8ZtGA' }
    ]
  },
  {
    id: 6,
    name: 'Body Scan',
    icon: '🧘',
    iconBg: 'bg-gradient-to-br from-indigo-100 to-purple-200',
    description: 'Connect with your body through guided awareness',
    videos: [
      { id: 17, title: 'Body Scan Meditation', duration: '15 min', url: 'https://www.youtube.com/watch?v=86HUcX8ZtGA' },
      { id: 18, title: 'Progressive Relaxation', duration: '18 min', url: 'https://www.youtube.com/watch?v=1ZYbU82GVz4' },
      { id: 19, title: 'Full Body Awareness', duration: '22 min', url: 'https://www.youtube.com/watch?v=tybOi4hjZFQ' }
    ]
  }
])

const featuredVideos = ref([
  {
    id: 1,
    title: '10-Minute Morning Meditation',
    description: 'Perfect way to start your day with mindfulness and intention',
    duration: '10 min',
    rating: '4.9',
    views: '2.3M',
    url: 'https://www.youtube.com/watch?v=ZToicYcHIOU'
  },
  {
    id: 2,
    title: '5-Minute Stress Relief',
    description: 'Quick meditation to calm your mind during busy moments',
    duration: '5 min',
    rating: '4.8',
    views: '1.8M',
    url: 'https://www.youtube.com/watch?v=O-6f5wQXSu8'
  },
  {
    id: 3,
    title: 'Sleep Meditation',
    description: 'Drift off peacefully with this calming bedtime meditation',
    duration: '20 min',
    rating: '4.9',
    views: '3.1M',
    url: 'https://www.youtube.com/watch?v=1ZYbU82GVz4'
  }
])

const openVideo = (video: any) => {
  window.open(video.url, '_blank', 'noopener,noreferrer')
}

const showAllVideos = (category: any) => {
  // In a real app, this would navigate to a category page or show a modal
  console.log('Show all videos for category:', category.name)
}

const startQuickMeditation = () => {
  // In a real app, this would start a timer and play audio
  window.open('https://www.youtube.com/watch?v=tybOi4hjZFQ', '_blank', 'noopener,noreferrer')
}
</script>
