<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gradient">Therapy 💚</h1>
      <p class="mt-2 text-lg text-gray-600">Professional mental health support and guidance</p>
    </div>

    <!-- Coming Soon Section -->
    <div class="text-center py-20">
      <div class="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-16 max-w-2xl mx-auto">
        <!-- Animated Icon -->
        <div class="text-8xl mb-8 animate-bounce-slow">💚</div>
        
        <!-- Main Content -->
        <h2 class="text-4xl font-bold text-gradient mb-6">Therapy Coming Soon</h2>
        <p class="text-xl text-gray-700 mb-8 leading-relaxed">
          We're working on bringing you professional mental health support, 
          therapy sessions, and personalized wellness guidance.
        </p>
        
        <!-- Features Preview -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
            <div class="text-3xl mb-3">👨‍⚕️</div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">Professional Therapists</h3>
            <p class="text-sm text-gray-600">Connect with licensed mental health professionals</p>
          </div>
          
          <div class="bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
            <div class="text-3xl mb-3">📅</div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">Flexible Scheduling</h3>
            <p class="text-sm text-gray-600">Book sessions that fit your schedule</p>
          </div>
          
          <div class="bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
            <div class="text-3xl mb-3">🔒</div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">Secure & Private</h3>
            <p class="text-sm text-gray-600">HIPAA-compliant video sessions</p>
          </div>
          
          <div class="bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
            <div class="text-3xl mb-3">📊</div>
            <h3 class="text-lg font-bold text-gray-800 mb-2">Progress Tracking</h3>
            <p class="text-sm text-gray-600">Monitor your mental health journey</p>
          </div>
        </div>
        
        <!-- Call to Action -->
        <div class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
          <h3 class="text-xl font-bold mb-3">Stay Updated</h3>
          <p class="mb-4">Be the first to know when therapy services launch!</p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              class="px-4 py-3 rounded-xl text-gray-800 flex-1 max-w-sm"
              v-model="email"
            />
            <button
              @click="notifyMe"
              class="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Notify Me
            </button>
          </div>
        </div>
        
        <!-- Alternative Resources -->
        <div class="mt-8 pt-8 border-t border-green-200">
          <h3 class="text-lg font-bold text-gray-800 mb-4">In the meantime, explore:</h3>
          <div class="flex flex-wrap justify-center gap-4">
            <router-link
              to="/journal"
              class="bg-white/70 text-gray-700 px-4 py-2 rounded-xl hover:bg-white transition-colors"
            >
              📝 Journal Your Thoughts
            </router-link>
            <router-link
              to="/meditation"
              class="bg-white/70 text-gray-700 px-4 py-2 rounded-xl hover:bg-white transition-colors"
            >
              🧘 Guided Meditation
            </router-link>
            <router-link
              to="/moods"
              class="bg-white/70 text-gray-700 px-4 py-2 rounded-xl hover:bg-white transition-colors"
            >
              😊 Track Your Moods
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Crisis Resources -->
    <div class="bg-gradient-to-r from-red-100 to-pink-100 rounded-3xl p-8">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-red-800 mb-4">Need Immediate Support?</h2>
        <p class="text-red-700 mb-6">
          If you're experiencing a mental health crisis, please reach out to these resources:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white/70 rounded-xl p-4">
            <h3 class="font-bold text-red-800 mb-2">Crisis Text Line</h3>
            <p class="text-red-700 text-sm mb-2">Text HOME to 741741</p>
            <p class="text-xs text-gray-600">24/7 crisis support via text</p>
          </div>
          <div class="bg-white/70 rounded-xl p-4">
            <h3 class="font-bold text-red-800 mb-2">National Suicide Prevention Lifeline</h3>
            <p class="text-red-700 text-sm mb-2">988</p>
            <p class="text-xs text-gray-600">24/7 crisis support via phone</p>
          </div>
          <div class="bg-white/70 rounded-xl p-4">
            <h3 class="font-bold text-red-800 mb-2">Emergency Services</h3>
            <p class="text-red-700 text-sm mb-2">911</p>
            <p class="text-xs text-gray-600">For immediate life-threatening emergencies</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')

const notifyMe = () => {
  if (email.value) {
    alert(`Thank you! We'll notify you at ${email.value} when therapy services are available.`)
    email.value = ''
  } else {
    alert('Please enter your email address.')
  }
}
</script>
