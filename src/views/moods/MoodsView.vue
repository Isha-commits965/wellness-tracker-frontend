<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold text-gradient mb-2">Mood Tracking 🌈</h1>
        <p class="text-lg text-gray-700 font-medium">Track your daily mood, energy, and stress levels</p>
      </div>
      <BaseButton 
        v-if="!moodsStore.todayMood"
        @click="showMoodModal = true" 
        class="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
      >
        <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Log Mood
      </BaseButton>
    </div>

    <!-- Today's mood -->
    <div v-if="moodsStore.todayMood" class="card">
      <h3 class="text-2xl font-bold text-gradient mb-8 text-center">Today's Mood Summary ✨</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center p-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300">
          <p class="text-sm font-semibold mb-3 text-white uppercase tracking-wide">😊 Mood</p>
          <div class="text-6xl mb-3 animate-bounce-slow">{{ moodsStore.getMoodEmoji(moodsStore.todayMood.mood) }}</div>
          <p class="text-2xl font-bold text-white">
            {{ moodsStore.todayMood.mood }}/10
          </p>
        </div>
        <div class="text-center p-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300">
          <p class="text-sm font-semibold mb-3 text-white uppercase tracking-wide">⚡ Energy</p>
          <div class="text-6xl mb-3 animate-pulse-slow">⚡</div>
          <p class="text-2xl font-bold text-white">{{ moodsStore.todayMood.energy }}/10</p>
        </div>
        <div class="text-center p-6 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl shadow-lg hover:scale-105 transition-all duration-300">
          <p class="text-sm font-semibold mb-3 text-white uppercase tracking-wide">😰 Stress</p>
          <div class="text-6xl mb-3 animate-pulse-slow">😰</div>
          <p class="text-2xl font-bold text-white">{{ moodsStore.todayMood.stress }}/10</p>
        </div>
      </div>
      <div v-if="moodsStore.todayMood.notes" class="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-l-4 border-purple-500">
        <p class="text-sm font-semibold mb-2 text-purple-800">📝 Notes:</p>
        <p class="text-sm text-purple-700">{{ moodsStore.todayMood.notes }}</p>
      </div>
      
      <!-- Update Mood Button -->
      <div class="mt-6 text-center">
        <BaseButton
          @click="showUpdateModal = true"
          class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Update Today's Mood
        </BaseButton>
      </div>
    </div>

    <!-- Quick mood logging -->
    <div v-else class="card">
      <h3 class="text-2xl font-bold text-gradient mb-8 text-center">How are you feeling today? 🌟</h3>
      <div class="space-y-8">
        <div class="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
          <h4 class="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <span class="text-2xl mr-2">😊</span>
            How are you feeling mood-wise?
          </h4>
          <MoodSlider
            v-model="quickMood.mood"
            type="mood"
          />
        </div>
        
        <div class="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
          <h4 class="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <span class="text-2xl mr-2">⚡</span>
            How energetic are you?
          </h4>
          <MoodSlider
            v-model="quickMood.energy"
            type="energy"
          />
        </div>
        
        <div class="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200">
          <h4 class="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <span class="text-2xl mr-2">😰</span>
            How stressed do you feel?
          </h4>
          <MoodSlider
            v-model="quickMood.stress"
            type="stress"
          />
        </div>
        
        <div class="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
          <label class="label text-purple-800">📝 Notes (Optional)</label>
          <textarea
            v-model="quickMood.notes"
            class="input-field"
            rows="3"
            placeholder="How are you feeling? What's on your mind?"
          ></textarea>
        </div>
        
        <BaseButton
          @click="logMood"
          :loading="isLoggingMood"
          class="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          <span class="text-lg">✨ Log Mood ✨</span>
        </BaseButton>
      </div>
    </div>

    <!-- Mood history -->
    <div class="card">
      <h3 class="text-2xl font-bold text-gradient mb-6 text-center">Recent Mood Entries 📊</h3>
      
      <div v-if="moodsStore.isLoading" class="text-center py-8">
        <BaseLoading type="spinner" text="Loading mood history..." />
      </div>
      
      <div v-else-if="!moodsStore.moodEntries || moodsStore.moodEntries.length === 0" class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No mood entries yet</h3>
        <p class="mt-1 text-sm text-gray-500">Start tracking your mood to see your patterns.</p>
      </div>
      
      <div v-else class="space-y-4">
        <div
          v-for="entry in validMoodEntries.slice(0, 10)"
          :key="entry.id"
          class="flex items-center justify-between p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-purple-300"
        >
          <div class="flex items-center space-x-6">
            <div class="text-4xl animate-bounce-slow">{{ moodsStore.getMoodEmoji(entry.mood) }}</div>
            <div>
              <p class="text-lg font-semibold text-gray-800">
                {{ new Date(entry.date).toLocaleDateString() }}
              </p>
              <div class="flex items-center space-x-4 mt-2">
                <span class="text-sm font-medium text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                  😊 Mood: {{ entry.mood }}/10
                </span>
                <span class="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  ⚡ Energy: {{ entry.energy }}/10
                </span>
                <span class="text-sm font-medium text-red-600 bg-red-100 px-3 py-1 rounded-full">
                  😰 Stress: {{ entry.stress }}/10
                </span>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="deleteMood(entry.id)"
              class="p-3 text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-full hover:scale-110 transition-all duration-300 shadow-lg"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mood logging modal -->
    <BaseModal
      :is-open="showMoodModal"
      title="Log Your Mood"
      @close="showMoodModal = false"
    >
      <div class="space-y-6">
        <MoodSlider
          v-model="modalMood.mood"
          label="Mood"
          type="mood"
        />
        
        <MoodSlider
          v-model="modalMood.energy"
          label="Energy Level"
          type="energy"
        />
        
        <MoodSlider
          v-model="modalMood.stress"
          label="Stress Level"
          type="stress"
        />
        
        <div>
          <label class="label">Notes (Optional)</label>
          <textarea
            v-model="modalMood.notes"
            class="input-field"
            rows="3"
            placeholder="How are you feeling? What's on your mind?"
          ></textarea>
        </div>
        
        <div>
          <label class="label">Date</label>
          <input
            v-model="modalMood.date"
            type="date"
            class="input-field"
          />
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="secondary" @click="showMoodModal = false">
            Cancel
          </BaseButton>
          <BaseButton @click="logModalMood" :loading="isLoggingMood">
            Log Mood
          </BaseButton>
        </div>
      </template>
    </BaseModal>
    
    <!-- Mood update modal -->
    <BaseModal
      :is-open="showUpdateModal"
      title="Update Today's Mood"
      @close="showUpdateModal = false"
    >
      <div class="space-y-6">
        <MoodSlider
          v-model="updateMood.mood"
          label="Mood"
          type="mood"
        />
        
        <MoodSlider
          v-model="updateMood.energy"
          label="Energy Level"
          type="energy"
        />
        
        <MoodSlider
          v-model="updateMood.stress"
          label="Stress Level"
          type="stress"
        />
        
        <div>
          <label class="label">Notes (Optional)</label>
          <textarea
            v-model="updateMood.notes"
            class="input-field"
            rows="3"
            placeholder="How are you feeling? What's on your mind?"
          ></textarea>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="secondary" @click="showUpdateModal = false">
            Cancel
          </BaseButton>
          <BaseButton @click="updateTodayMood" :loading="isLoggingMood">
            Update Mood
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, nextTick, watch } from 'vue'
import { useMoodsStore } from '@/stores/moods'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseLoading from '@/components/ui/BaseLoading.vue'
import MoodSlider from '@/components/ui/MoodSlider.vue'
import type { MoodEntry } from '@/types'

const moodsStore = useMoodsStore()

const showMoodModal = ref(false)
const showUpdateModal = ref(false)
const isLoggingMood = ref(false)

const quickMood = reactive({
  mood: 5,
  energy: 5,
  stress: 5,
  notes: ''
})

const modalMood = reactive({
  mood: 5,
  energy: 5,
  stress: 5,
  notes: '',
  date: new Date().toISOString().split('T')[0]
})

const updateMood = reactive({
  mood: 5,
  energy: 5,
  stress: 5,
  notes: ''
})

const validMoodEntries = computed(() => {
  return moodsStore.moodEntries?.filter(entry => entry != null) || []
})

onMounted(async () => {
  try {
    await moodsStore.fetchMoodEntries()
  } catch (error) {
    console.error('Failed to load mood entries:', error)
  }
})

const logMood = async () => {
  try {
    isLoggingMood.value = true
    const today = new Date().toISOString().split('T')[0]
    const existingEntry = moodsStore.todayMood
    
    if (existingEntry) {
      // Update existing entry
      await moodsStore.updateMoodEntry(existingEntry.id, {
        mood: quickMood.mood,
        energy: quickMood.energy,
        stress: quickMood.stress,
        notes: quickMood.notes,
        date: today
      })
    } else {
      // Create new entry
      await moodsStore.createMoodEntry({
        mood: quickMood.mood,
        energy: quickMood.energy,
        stress: quickMood.stress,
        notes: quickMood.notes,
        date: today
      })
    }
    
    // Force immediate UI update
    await moodsStore.fetchMoodEntries()
    await nextTick()
    
    // Reset form
    quickMood.mood = 5
    quickMood.energy = 5
    quickMood.stress = 5
    quickMood.notes = ''
  } catch (error) {
    console.error('Failed to log mood:', error)
  } finally {
    isLoggingMood.value = false
  }
}

const logModalMood = async () => {
  try {
    isLoggingMood.value = true
    await moodsStore.createMoodEntry({
      mood: modalMood.mood,
      energy: modalMood.energy,
      stress: modalMood.stress,
      notes: modalMood.notes,
      date: modalMood.date
    })
    
    // Force immediate UI update
    await moodsStore.fetchMoodEntries()
    await nextTick()
    
    showMoodModal.value = false
    
    // Reset form
    modalMood.mood = 5
    modalMood.energy = 5
    modalMood.stress = 5
    modalMood.notes = ''
    modalMood.date = new Date().toISOString().split('T')[0]
  } catch (error) {
    console.error('Failed to log mood:', error)
  } finally {
    isLoggingMood.value = false
  }
}

const deleteMood = async (id: string) => {
  if (confirm('Are you sure you want to delete this mood entry?')) {
    try {
      await moodsStore.deleteMoodEntry(id)
      
      // Force immediate UI update
      await moodsStore.fetchMoodEntries()
      await nextTick()
    } catch (error) {
      console.error('Failed to delete mood entry:', error)
    }
  }
}

const updateTodayMood = async () => {
  try {
    isLoggingMood.value = true
    const today = new Date().toISOString().split('T')[0]
    
    console.log('Updating mood for today:', today)
    console.log('Current todayMood:', moodsStore.todayMood)
    console.log('Update data:', {
      mood: updateMood.mood,
      energy: updateMood.energy,
      stress: updateMood.stress,
      notes: updateMood.notes,
      date: today
    })
    
    if (moodsStore.todayMood) {
      // Try update first
      try {
        const updatedEntry = await moodsStore.updateMoodEntry(moodsStore.todayMood.id, {
          mood: updateMood.mood,
          energy: updateMood.energy,
          stress: updateMood.stress,
          notes: updateMood.notes,
          date: today
        })
        console.log('Updated entry:', updatedEntry)
      } catch (updateError) {
        console.log('Update failed, trying delete and recreate:', updateError)
        // If update fails, delete and recreate
        await moodsStore.deleteMoodEntry(moodsStore.todayMood.id)
        await moodsStore.createMoodEntry({
          mood: updateMood.mood,
          energy: updateMood.energy,
          stress: updateMood.stress,
          notes: updateMood.notes,
          date: today
        })
        console.log('Recreated mood entry')
      }
    } else {
      console.error('No todayMood found to update')
    }
    
    // Force immediate UI update
    await moodsStore.fetchMoodEntries()
    await nextTick()
    
    showUpdateModal.value = false
  } catch (error) {
    console.error('Failed to update mood:', error)
  } finally {
    isLoggingMood.value = false
  }
}

// Watch for when update modal opens to populate current values
watch(showUpdateModal, (isOpen) => {
  if (isOpen && moodsStore.todayMood) {
    updateMood.mood = moodsStore.todayMood.mood
    updateMood.energy = moodsStore.todayMood.energy
    updateMood.stress = moodsStore.todayMood.stress
    updateMood.notes = moodsStore.todayMood.notes || ''
  }
})
</script>
