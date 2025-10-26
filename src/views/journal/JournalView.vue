<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">AI Journal</h1>
        <p class="mt-1 text-sm text-gray-500">Reflect on your day with AI-powered insights</p>
      </div>
      <BaseButton @click="showCreateModal = true">
        <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        New Entry
      </BaseButton>
    </div>

    <!-- Journal entries -->
    <div class="space-y-4">
      <div v-if="journalStore.isLoading" class="text-center py-8">
        <BaseLoading type="spinner" text="Loading journal entries..." />
      </div>
      
      <div v-else-if="journalStore.entries.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No journal entries yet</h3>
        <p class="mt-1 text-sm text-gray-500">Start your wellness journey by writing your first entry.</p>
        <BaseButton @click="showCreateModal = true" class="mt-4">
          Write your first entry
        </BaseButton>
      </div>
      
      <div v-else class="space-y-4">
        <div
          v-for="entry in journalStore.entries"
          :key="entry.id"
          class="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
          @click="viewEntry(entry)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ new Date(entry.createdAt).toLocaleDateString() }}
              </h3>
              <p class="mt-2 text-sm text-gray-600 line-clamp-3">
                {{ entry.content }}
              </p>
              <div class="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                <span>Mood: {{ entry.moodBefore }} → {{ entry.moodAfter }}</span>
                <span v-if="entry.aiResponse" class="flex items-center">
                  <svg class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  AI Response
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click.stop="editEntry(entry)"
                class="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click.stop="deleteEntry(entry.id)"
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
import { ref, reactive, onMounted } from 'vue'
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
  moodAfter: 5
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
