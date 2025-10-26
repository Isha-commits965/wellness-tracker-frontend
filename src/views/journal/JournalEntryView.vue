<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <BaseButton variant="outline" size="sm" @click="$router.back()">
          <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </BaseButton>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Journal Entry</h1>
          <p v-if="entry" class="mt-1 text-sm text-gray-500">
            {{ new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
          </p>
        </div>
      </div>
      <div v-if="entry" class="flex items-center space-x-2">
        <BaseButton variant="outline" size="sm" @click="editEntry">
          <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </BaseButton>
        <BaseButton variant="outline" size="sm" @click="deleteEntry">
          <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </BaseButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <BaseLoading type="spinner" text="Loading entry..." />
    </div>

    <!-- Entry Content -->
    <div v-else-if="entry" class="space-y-6">
      <!-- Mood Scores -->
      <BaseCard>
        <div class="grid grid-cols-2 gap-6">
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">Mood Before</h3>
            <div class="flex items-center space-x-2">
              <span class="text-3xl">{{ getMoodEmoji(entry.moodBefore) }}</span>
              <span class="text-2xl font-bold text-gray-900">{{ entry.moodBefore }}/10</span>
            </div>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-500 mb-2">Mood After</h3>
            <div class="flex items-center space-x-2">
              <span class="text-3xl">{{ getMoodEmoji(entry.moodAfter) }}</span>
              <span class="text-2xl font-bold text-gray-900">{{ entry.moodAfter }}/10</span>
            </div>
          </div>
        </div>
        <div v-if="moodChange !== 0" class="mt-4 pt-4 border-t border-gray-200">
          <div class="flex items-center justify-center">
            <span :class="moodChange > 0 ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
              {{ moodChange > 0 ? '↑' : '↓' }} {{ Math.abs(moodChange) }} point{{ Math.abs(moodChange) !== 1 ? 's' : '' }} {{ moodChange > 0 ? 'improvement' : 'decline' }}
            </span>
          </div>
        </div>
      </BaseCard>

      <!-- Your Journal Entry -->
      <BaseCard>
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900">Your Journal Entry</h3>
        </template>
        <div class="prose max-w-none">
          <p class="text-gray-700 whitespace-pre-wrap">{{ entry.content }}</p>
        </div>
      </BaseCard>

      <!-- AI Conversation -->
      <BaseCard>
        <template #header>
          <div class="flex items-center space-x-2">
            <svg class="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <h3 class="text-lg font-semibold text-gray-900">AI Conversation</h3>
          </div>
        </template>
        
        <!-- Conversation Thread -->
        <div class="space-y-4 max-h-96 overflow-y-auto mb-4">
          <!-- Initial AI Response -->
          <div v-if="entry.aiResponse" class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg class="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <div class="bg-blue-50 rounded-lg p-4">
                <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ entry.aiResponse }}</p>
              </div>
              <p class="text-xs text-gray-500 mt-1">AI Assistant</p>
            </div>
          </div>
          
          <!-- Conversation Messages -->
          <div 
            v-for="(message, index) in conversation" 
            :key="index" 
            :class="message.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
            class="flex items-start space-x-3"
          >
            <div class="flex-shrink-0">
              <div 
                :class="message.role === 'user' ? 'bg-emerald-100' : 'bg-blue-100'"
                class="h-8 w-8 rounded-full flex items-center justify-center"
              >
                <svg v-if="message.role === 'user'" class="h-5 w-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
                <svg v-else class="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <div 
                :class="message.role === 'user' ? 'bg-emerald-50' : 'bg-blue-50'"
                class="rounded-lg p-4"
              >
                <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ message.content }}</p>
              </div>
              <p class="text-xs text-gray-500 mt-1">{{ message.role === 'user' ? 'You' : 'AI Assistant' }}</p>
            </div>
          </div>
          
          <!-- Loading indicator -->
          <div v-if="isAIResponding" class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg class="h-5 w-5 text-blue-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <div class="bg-blue-50 rounded-lg p-4">
                <p class="text-sm text-gray-500 italic">AI is thinking...</p>
              </div>
            </div>
          </div>
          
          <!-- No AI Response Yet -->
          <div v-if="!entry.aiResponse && conversation.length === 0 && !isAIResponding" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Start a conversation</h3>
            <p class="mt-1 text-sm text-gray-500">Ask the AI for insights or guidance about your journal entry.</p>
          </div>
        </div>
        
        <!-- AI Suggestions -->
        <div v-if="entry.suggestions && entry.suggestions.length > 0" class="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div class="flex items-start space-x-2">
            <svg class="h-5 w-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <div class="flex-1">
              <h4 class="text-sm font-medium text-yellow-800 mb-2">AI Suggestions</h4>
              <ul class="space-y-1">
                <li v-for="(suggestion, index) in entry.suggestions" :key="index" class="text-sm text-yellow-700">
                  • {{ suggestion }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Message Input -->
        <div class="border-t border-gray-200 pt-4">
          <div class="flex space-x-3">
            <textarea
              v-model="newMessage"
              @keydown.enter.prevent="sendMessage"
              placeholder="Ask AI about your journal entry, request advice, or continue the conversation..."
              rows="3"
              class="flex-1 input-field resize-none"
              :disabled="isAIResponding"
            ></textarea>
            <div class="flex flex-col space-y-2">
              <BaseButton 
                @click="sendMessage" 
                :disabled="!newMessage.trim() || isAIResponding"
                :loading="isAIResponding"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </BaseButton>
            </div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Press Enter to send or Shift+Enter for new line</p>
        </div>
      </BaseCard>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">Entry Not Found</h3>
      <p class="mt-1 text-sm text-gray-500">The journal entry could not be loaded.</p>
      <div class="mt-6">
        <BaseButton @click="$router.push('/journal')">
          Back to Journal
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJournalStore } from '@/stores/journal'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseLoading from '@/components/ui/BaseLoading.vue'
import type { JournalEntry } from '@/types'

const route = useRoute()
const router = useRouter()
const journalStore = useJournalStore()

const entry = ref<JournalEntry | null>(null)
const isLoading = ref(false)
const conversation = ref<{ role: 'user' | 'assistant'; content: string }[]>([])
const newMessage = ref('')
const isAIResponding = ref(false)

const moodChange = computed(() => {
  if (!entry.value) return 0
  return entry.value.moodAfter - entry.value.moodBefore
})

onMounted(async () => {
  const entryId = route.params.id as string
  if (entryId) {
    try {
      isLoading.value = true
      // Find the entry in the store first
      const foundEntry = journalStore.entries.find(e => e.id.toString() === entryId)
      if (foundEntry) {
        entry.value = foundEntry
      } else {
        // If not found, fetch from API
        await journalStore.getJournalEntry(entryId)
        entry.value = journalStore.currentEntry
      }
    } catch (error) {
      console.error('Failed to load journal entry:', error)
    } finally {
      isLoading.value = false
    }
  }
})

const getMoodEmoji = (value: number): string => {
  if (value >= 9) return '😄'
  if (value >= 7) return '😊'
  if (value >= 5) return '😐'
  if (value >= 3) return '😔'
  return '😢'
}

const editEntry = () => {
  // Navigate back to journal list with edit modal
  router.push({ path: '/journal', query: { edit: entry.value?.id } })
}

const deleteEntry = async () => {
  if (!entry.value) return
  
  if (confirm('Are you sure you want to delete this journal entry?')) {
    try {
      await journalStore.deleteJournalEntry(entry.value.id.toString())
      router.push('/journal')
    } catch (error) {
      console.error('Failed to delete journal entry:', error)
    }
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || isAIResponding.value || !entry.value) return
  
  const userMessage = newMessage.value.trim()
  newMessage.value = ''
  
  // Add user message to conversation
  conversation.value.push({
    role: 'user',
    content: userMessage
  })
  
  isAIResponding.value = true
  
  try {
    // Call the real API for conversation
    const response = await journalStore.sendConversationMessage(entry.value.id, userMessage)
    
    conversation.value.push({
      role: 'assistant',
      content: response.ai_response
    })
    
    // Update suggestions if provided
    if (response.suggestions && response.suggestions.length > 0) {
      // You could store suggestions in a separate ref or display them
      console.log('AI suggestions:', response.suggestions)
    }
  } catch (error) {
    console.error('Failed to get AI response:', error)
    conversation.value.push({
      role: 'assistant',
      content: 'I apologize, but I encountered an error. Please try again.'
    })
  } finally {
    isAIResponding.value = false
  }
}
</script>
