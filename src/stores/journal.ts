import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { journalService } from '@/services/journal';
import type { JournalEntry, PaginatedResponse } from '@/types';

export const useJournalStore = defineStore('journal', () => {
  // State
  const entries = ref<JournalEntry[]>([]);
  const currentEntry = ref<JournalEntry | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Getters
  const recentEntries = computed(() => 
    entries.value
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  );

  const entriesThisWeek = computed(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return entries.value.filter(entry => 
      new Date(entry.createdAt) >= oneWeekAgo
    );
  });

  const entriesThisMonth = computed(() => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    
    return entries.value.filter(entry => 
      new Date(entry.createdAt) >= oneMonthAgo
    );
  });

  const totalEntries = computed(() => entries.value.length);
  const entriesWithAIResponse = computed(() => 
    entries.value.filter(entry => entry.aiResponse).length
  );

  const averageMoodImprovement = computed(() => {
    const entriesWithMoods = entries.value.filter(entry => 
      entry.moodBefore && entry.moodAfter
    );
    
    if (entriesWithMoods.length === 0) return 0;
    
    const totalImprovement = entriesWithMoods.reduce((acc, entry) => 
      acc + (entry.moodAfter - entry.moodBefore), 0
    );
    
    return Math.round((totalImprovement / entriesWithMoods.length) * 10) / 10;
  });

  // Actions
  async function createJournalEntry(entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      isLoading.value = true;
      error.value = null;
      const newEntry = await journalService.createJournalEntry(entryData);
      if (!entries.value) entries.value = [];
      entries.value.unshift(newEntry);
      return newEntry;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create journal entry';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchJournalEntries(page: number = 1, limit: number = 10, search?: string) {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await journalService.getJournalEntries(page, limit, search);
      entries.value = response.data;
      pagination.value = {
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages
      };
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch journal entries';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function getJournalEntry(id: string) {
    try {
      isLoading.value = true;
      error.value = null;
      const entry = await journalService.getJournalEntry(id);
      currentEntry.value = entry;
      return entry;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch journal entry';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateJournalEntry(id: string, entryData: Partial<JournalEntry>) {
    try {
      isLoading.value = true;
      error.value = null;
      const updatedEntry = await journalService.updateJournalEntry(id, entryData);
      const index = entries.value.findIndex(entry => entry.id === id);
      if (index !== -1) {
        entries.value[index] = updatedEntry;
      }
      if (currentEntry.value?.id === id) {
        currentEntry.value = updatedEntry;
      }
      return updatedEntry;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update journal entry';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteJournalEntry(id: string) {
    try {
      isLoading.value = true;
      error.value = null;
      await journalService.deleteJournalEntry(id);
      entries.value = entries.value.filter(entry => entry.id !== id);
      if (currentEntry.value?.id === id) {
        currentEntry.value = null;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete journal entry';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function regenerateAIResponse(id: string) {
    try {
      isLoading.value = true;
      error.value = null;
      const updatedEntry = await journalService.regenerateAIResponse(id);
      const index = entries.value.findIndex(entry => entry.id === id);
      if (index !== -1) {
        entries.value[index] = updatedEntry;
      }
      if (currentEntry.value?.id === id) {
        currentEntry.value = updatedEntry;
      }
      return updatedEntry;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to regenerate AI response';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function searchEntries(query: string, page: number = 1, limit: number = 10) {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await journalService.searchJournalEntries(query, page, limit);
      entries.value = response.data;
      pagination.value = {
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages
      };
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to search journal entries';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Draft functionality
  function saveDraft(content: string, moodBefore: number, moodAfter: number) {
    journalService.saveDraft(content, moodBefore, moodAfter);
  }

  function getDraft() {
    return journalService.getDraft();
  }

  function clearDraft() {
    journalService.clearDraft();
  }

  function clearError() {
    error.value = null;
  }

  function clearCurrentEntry() {
    currentEntry.value = null;
  }

  return {
    // State
    entries,
    currentEntry,
    isLoading,
    error,
    pagination,
    
    // Getters
    recentEntries,
    entriesThisWeek,
    entriesThisMonth,
    totalEntries,
    entriesWithAIResponse,
    averageMoodImprovement,
    
    // Actions
    createJournalEntry,
    fetchJournalEntries,
    getJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    regenerateAIResponse,
    searchEntries,
    saveDraft,
    getDraft,
    clearDraft,
    clearError,
    clearCurrentEntry
  };
});
