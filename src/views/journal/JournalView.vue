<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-pink-600/20"></div>
      <div class="relative z-10 flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-bold mb-2 animate-pulse-slow">AI Journal 📝</h1>
          <p class="text-xl text-white/90">Reflect on your day with AI-powered insights</p>
          <div class="mt-4 flex items-center space-x-2">
            <div class="w-3 h-3 bg-yellow-300 rounded-full animate-bounce-slow"></div>
            <div class="w-3 h-3 bg-green-300 rounded-full animate-bounce-slow" style="animation-delay: 0.2s"></div>
            <div class="w-3 h-3 bg-blue-300 rounded-full animate-bounce-slow" style="animation-delay: 0.4s"></div>
          </div>
        </div>
        <BaseButton 
          @click="showCreateModal = true"
          class="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 backdrop-blur-sm"
        >
          <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Entry
        </BaseButton>
      </div>
    </div>

    <!-- Journal entries -->
    <div class="space-y-4">
      <div v-if="journalStore.isLoading" class="text-center py-8">
        <BaseLoading type="spinner" text="Loading journal entries..." />
      </div>
      
      <div v-else-if="journalStore.entries.length === 0" class="text-center py-16">
        <div class="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-12 max-w-md mx-auto">
          <div class="text-8xl mb-6 animate-bounce-slow">📝</div>
          <h3 class="text-2xl font-bold text-gradient mb-4">No journal entries yet</h3>
          <p class="text-lg text-gray-600 mb-8">Start your wellness journey by writing your first entry.</p>
          <BaseButton 
            @click="showCreateModal = true" 
            class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            ✨ Write your first entry ✨
          </BaseButton>
        </div>
      </div>
      
      <div v-else class="space-y-4">
        <div
          v-for="entry in validEntries"
          :key="entry.id"
          class="card hover:shadow-xl transition-all duration-300 cursor-pointer group"
          @click="viewEntry(entry)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-3">
                <h3 class="text-xl font-bold text-gradient">
                  {{ new Date(entry.createdAt).toLocaleDateString() }}
                </h3>
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse-slow"></div>
                  <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse-slow" style="animation-delay: 0.2s"></div>
                  <div class="w-2 h-2 bg-purple-400 rounded-full animate-pulse-slow" style="animation-delay: 0.4s"></div>
                </div>
              </div>
              <p class="text-gray-700 line-clamp-3 leading-relaxed">
                {{ entry.content }}
              </p>
              <div class="mt-4 flex items-center space-x-6 text-sm">
                <div class="flex items-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-3 py-2 rounded-full">
                  <span class="text-lg">😊</span>
                  <span class="font-semibold text-orange-700">Mood: {{ entry.moodBefore }} → {{ entry.moodAfter }}</span>
                </div>
                <div v-if="entry.aiResponse" class="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-2 rounded-full">
                  <span class="text-lg">🤖</span>
                  <span class="font-semibold text-blue-700">AI Response</span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click.stop="editEntry(entry)"
                class="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-200 hover:scale-110"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click.stop="deleteEntry(entry.id)"
                class="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-all duration-200 hover:scale-110"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Entry Modal -->
    <BaseModal
      :is-open="showCreateModal || showEditModal"
      :title="showCreateModal ? 'New Journal Entry' : 'Edit Entry'"
      size="lg"
      @close="closeModal"
    >
      <div class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Mood Before</label>
            <MoodSlider
              v-model="entryForm.moodBefore"
              type="mood"
              :show-emoji="true"
              :show-description="false"
            />
          </div>
          <div>
            <label class="label">Mood After</label>
            <MoodSlider
              v-model="entryForm.moodAfter"
              type="mood"
              :show-emoji="true"
              :show-description="false"
            />
          </div>
        </div>
        
        <div>
          <label class="label">What's on your mind?</label>
          <textarea
            v-model="entryForm.content"
            class="input-field"
            rows="8"
            placeholder="Write about your day, thoughts, feelings, or anything you'd like to reflect on..."
            required
          ></textarea>
        </div>
      </div>
      
      <template #footer>
        <div class="flex justify-between">
          <BaseButton
            v-if="journalStore.getDraft()"
            variant="outline"
            @click="loadDraft"
          >
            Load Draft
          </BaseButton>
          <div class="flex space-x-3">
            <BaseButton variant="secondary" @click="saveDraft">
              Save Draft
            </BaseButton>
            <BaseButton variant="secondary" @click="closeModal">
              Cancel
            </BaseButton>
            <BaseButton @click="handleSubmit" :loading="isSubmitting">
              {{ showCreateModal ? 'Create Entry' : 'Update Entry' }}
            </BaseButton>
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useJournalStore } from '@/stores/journal'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import BaseLoading from '@/components/ui/BaseLoading.vue'
import MoodSlider from '@/components/ui/MoodSlider.vue'
import type { JournalEntry } from '@/types'

const router = useRouter()
const journalStore = useJournalStore()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const isSubmitting = ref(false)
const editingEntry = ref<JournalEntry | null>(null)

const entryForm = reactive({
  content: '',
  moodBefore: 5,
  moodAfter: 5,
  date: new Date().toISOString().split('T')[0]
})

const validEntries = computed(() => {
  return journalStore.entries?.filter(entry => entry != null) || []
})

onMounted(async () => {
  try {
    await journalStore.fetchJournalEntries()
  } catch (error) {
    console.error('Failed to load journal entries:', error)
  }
})

const viewEntry = (entry: JournalEntry) => {
  router.push(`/journal/${entry.id}`)
}

const editEntry = (entry: JournalEntry) => {
  editingEntry.value = entry
  entryForm.content = entry.content
  entryForm.moodBefore = entry.moodBefore
  entryForm.moodAfter = entry.moodAfter
  showEditModal.value = true
}

const deleteEntry = async (id: string) => {
  if (confirm('Are you sure you want to delete this journal entry?')) {
    try {
      await journalStore.deleteJournalEntry(id)
    } catch (error) {
      console.error('Failed to delete journal entry:', error)
    }
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingEntry.value = null
  resetForm()
}

const resetForm = () => {
  entryForm.content = ''
  entryForm.moodBefore = 5
  entryForm.moodAfter = 5
  entryForm.date = new Date().toISOString().split('T')[0]
}

const saveDraft = () => {
  journalStore.saveDraft(entryForm.content, entryForm.moodBefore, entryForm.moodAfter)
}

const loadDraft = () => {
  const draft = journalStore.getDraft()
  if (draft) {
    entryForm.content = draft.content
    entryForm.moodBefore = draft.moodBefore
    entryForm.moodAfter = draft.moodAfter
  }
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    
    if (showCreateModal.value) {
      await journalStore.createJournalEntry(entryForm)
    } else if (editingEntry.value) {
      await journalStore.updateJournalEntry(editingEntry.value.id, entryForm)
    }
    
    closeModal()
  } catch (error) {
    console.error('Failed to save journal entry:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
