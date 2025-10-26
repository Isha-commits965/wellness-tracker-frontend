import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { moodsService } from '@/services/moods';
import type { MoodEntry, MoodTrends } from '@/types';

export const useMoodsStore = defineStore('moods', () => {
  // State
  const moodEntries = ref<MoodEntry[]>([]);
  const trends = ref<MoodTrends | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const todayMood = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return moodEntries.value.find(entry => entry.date === today);
  });

  const averageMood = computed(() => {
    if (moodEntries.value.length === 0) return 0;
    const sum = moodEntries.value.reduce((acc, entry) => acc + entry.mood, 0);
    return Math.round((sum / moodEntries.value.length) * 10) / 10;
  });

  const averageEnergy = computed(() => {
    if (moodEntries.value.length === 0) return 0;
    const sum = moodEntries.value.reduce((acc, entry) => acc + entry.energy, 0);
    return Math.round((sum / moodEntries.value.length) * 10) / 10;
  });

  const averageStress = computed(() => {
    if (moodEntries.value.length === 0) return 0;
    const sum = moodEntries.value.reduce((acc, entry) => acc + entry.stress, 0);
    return Math.round((sum / moodEntries.value.length) * 10) / 10;
  });

  const recentMoods = computed(() => {
    return moodEntries.value
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7);
  });

  const moodDistribution = computed(() => {
    const distribution: { [key: number]: number } = {};
    moodEntries.value.forEach(entry => {
      distribution[entry.mood] = (distribution[entry.mood] || 0) + 1;
    });
    return distribution;
  });

  const weeklyMoodData = computed(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const entry = moodEntries.value.find(e => e.date === date);
      return {
        date,
        mood: entry?.mood || null,
        energy: entry?.energy || null,
        stress: entry?.stress || null
      };
    });
  });

  // Actions
  async function createMoodEntry(moodData: Omit<MoodEntry, 'id' | 'createdAt'>) {
    try {
      isLoading.value = true;
      error.value = null;
      const newEntry = await moodsService.createMoodEntry(moodData);
      moodEntries.value.push(newEntry);
      return newEntry;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create mood entry';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchMoodEntries(startDate?: string, endDate?: string) {
    try {
      isLoading.value = true;
      error.value = null;
      const entries = await moodsService.getMoodEntries(startDate, endDate);
      moodEntries.value = entries;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch mood entries';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateMoodEntry(id: string, moodData: Partial<MoodEntry>) {
    try {
      isLoading.value = true;
      error.value = null;
      const updatedEntry = await moodsService.updateMoodEntry(id, moodData);
      const index = moodEntries.value.findIndex(entry => entry.id === id);
      if (index !== -1) {
        moodEntries.value[index] = updatedEntry;
      }
      return updatedEntry;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update mood entry';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteMoodEntry(id: string) {
    try {
      isLoading.value = true;
      error.value = null;
      await moodsService.deleteMoodEntry(id);
      moodEntries.value = moodEntries.value.filter(entry => entry.id !== id);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete mood entry';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchMoodTrends(period: 'week' | 'month' | 'year' = 'month') {
    try {
      isLoading.value = true;
      error.value = null;
      const trendsData = await moodsService.getMoodTrends(period);
      trends.value = trendsData;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch mood trends';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function logQuickMood(mood: number, energy: number, stress: number, notes?: string) {
    try {
      const entry = await moodsService.logQuickMood(mood, energy, stress, notes);
      moodEntries.value.push(entry);
      return entry;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to log mood';
      throw err;
    }
  }

  function getMoodEntryByDate(date: string): MoodEntry | undefined {
    return moodEntries.value.find(entry => entry.date === date);
  }

  function getMoodColor(mood: number): string {
    if (mood >= 8) return 'text-green-600';
    if (mood >= 6) return 'text-yellow-600';
    if (mood >= 4) return 'text-orange-600';
    return 'text-red-600';
  }

  function getMoodEmoji(mood: number): string {
    if (mood >= 9) return '😄';
    if (mood >= 7) return '😊';
    if (mood >= 5) return '😐';
    if (mood >= 3) return '😔';
    return '😢';
  }

  function clearError() {
    error.value = null;
  }

  return {
    // State
    moodEntries,
    trends,
    isLoading,
    error,
    
    // Getters
    todayMood,
    averageMood,
    averageEnergy,
    averageStress,
    recentMoods,
    moodDistribution,
    weeklyMoodData,
    
    // Actions
    createMoodEntry,
    fetchMoodEntries,
    updateMoodEntry,
    deleteMoodEntry,
    fetchMoodTrends,
    logQuickMood,
    getMoodEntryByDate,
    getMoodColor,
    getMoodEmoji,
    clearError
  };
});
