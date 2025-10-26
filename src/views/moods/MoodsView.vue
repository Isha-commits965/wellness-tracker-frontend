<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Mood Tracking</h1>
        <p class="mt-1 text-sm text-gray-500">Track your daily mood, energy, and stress levels</p>
      </div>
      <BaseButton @click="showMoodModal = true">
        <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Log Mood
      </BaseButton>
    </div>

    <!-- Today's mood -->
    <div v-if="moodsStore.todayMood" class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Today's Mood</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-3xl mb-2">{{ moodsStore.getMoodEmoji(moodsStore.todayMood.mood) }}</div>
          <p class="text-sm text-gray-500">Mood</p>
          <p class="text-xl font-semibold" :class="moodsStore.getMoodColor(moodsStore.todayMood.mood)">
            {{ moodsStore.todayMood.mood }}/10
          </p>
        </div>
        <div class="text-center">
          <div class="text-3xl mb-2">⚡</div>
          <p class="text-sm text-gray-500">Energy</p>
          <p class="text-xl font-semibold text-blue-600">{{ moodsStore.todayMood.energy }}/10</p>
        </div>
        <div class="text-center">
          <div class="text-3xl mb-2">😌</div>
          <p class="text-sm text-gray-500">Stress</p>
          <p class="text-xl font-semibold text-orange-600">{{ moodsStore.todayMood.stress }}/10</p>
        </div>
      </div>
      <div v-if="moodsStore.todayMood.notes" class="mt-4 p-3 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-700">{{ moodsStore.todayMood.notes }}</p>
      </div>
    </div>

    <!-- Quick mood logging -->
    <div v-else class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">How are you feeling today?</h3>
      <div class="space-y-6">
        <MoodSlider
          v-model="quickMood.mood"
          label="Mood"
          type="mood"
        />
        
        <MoodSlider
          v-model="quickMood.energy"
          label="Energy Level"
          type="energy"
        />
        
        <MoodSlider
          v-model="quickMood.stress"
          label="Stress Level"
          type="stress"
        />
        
        <div>
          <label class="label">Notes (Optional)</label>
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
          class="w-full"
        >
          Log Mood
        </BaseButton>
      </div>
    </div>

    <!-- Mood history -->
    <div class="card">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Mood Entries</h3>
      
      <div v-if="moodsStore.isLoading" class="text-center py-8">
        <BaseLoading type="spinner" text="Loading mood history..." />
      </div>
      
      <div v-else-if="moodsStore.moodEntries.length === 0" class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No mood entries yet</h3>
        <p class="mt-1 text-sm text-gray-500">Start tracking your mood to see your patterns.</p>
      </div>
      
      <div v-else class="space-y-3">
        <div
          v-for="entry in moodsStore.moodEntries.slice(0, 10)"
          :key="entry.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div class="flex items-center space-x-4">
            <div class="text-2xl">{{ moodsStore.getMoodEmoji(entry.mood) }}</div>
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ new Date(entry.date).toLocaleDateString() }}
              </p>
              <p class="text-xs text-gray-500">
                Mood: {{ entry.mood }}/10 • Energy: {{ entry.energy }}/10 • Stress: {{ entry.stress }}/10
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="editMood(entry)"
              class="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="deleteMood(entry.id)"
              class="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useMoodsStore } from '@/stores/moods'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseLoading from '@/components/ui/BaseLoading.vue'
import MoodSlider from '@/components/ui/MoodSlider.vue'
import type { MoodEntry } from '@/types'

const moodsStore = useMoodsStore()

const showMoodModal = ref(false)
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
    await moodsStore.createMoodEntry({
      mood: quickMood.mood,
      energy: quickMood.energy,
      stress: quickMood.stress,
      notes: quickMood.notes,
      date: new Date().toISOString().split('T')[0]
    })
    
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

const editMood = (entry: MoodEntry) => {
  // TODO: Implement edit functionality
  console.log('Edit mood:', entry)
}

const deleteMood = async (id: string) => {
  if (confirm('Are you sure you want to delete this mood entry?')) {
    try {
      await moodsStore.deleteMoodEntry(id)
    } catch (error) {
      console.error('Failed to delete mood entry:', error)
    }
  }
}
</script>
