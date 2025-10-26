import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { analyticsService } from '@/services/analytics';
import type { DashboardStats, WeeklyStats, CalendarData } from '@/types';

export const useAnalyticsStore = defineStore('analytics', () => {
  // State
  const dashboardStats = ref<DashboardStats | null>(null);
  const weeklyStats = ref<WeeklyStats[]>([]);
  const calendarData = ref<CalendarData[]>([]);
  const habitAnalytics = ref<any>(null);
  const moodAnalytics = ref<any>(null);
  const journalAnalytics = ref<any>(null);
  const goalAnalytics = ref<any>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const currentWeekStats = computed(() => {
    if (weeklyStats.value.length === 0) return null;
    return weeklyStats.value[weeklyStats.value.length - 1];
  });

  const habitCompletionTrend = computed(() => {
    if (!habitAnalytics.value) return [];
    return habitAnalytics.value.completionTrend || [];
  });

  const moodTrend = computed(() => {
    if (!moodAnalytics.value) return [];
    return moodAnalytics.value.trend || [];
  });

  const wellnessScore = computed(() => {
    if (!dashboardStats.value) return 0;
    const { totalHabits, currentStreak, averageMood, journalEntriesThisWeek } = dashboardStats.value;
    
    // Simple wellness score calculation (0-100)
    const habitScore = Math.min((totalHabits / 10) * 30, 30); // Max 30 points for habits
    const streakScore = Math.min((currentStreak / 30) * 25, 25); // Max 25 points for streak
    const moodScore = (averageMood / 10) * 25; // Max 25 points for mood
    const journalScore = Math.min((journalEntriesThisWeek / 7) * 20, 20); // Max 20 points for journal
    
    return Math.round(habitScore + streakScore + moodScore + journalScore);
  });

  const monthlyCalendarData = computed(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    return calendarData.value.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === year && entryDate.getMonth() + 1 === month;
    });
  });

  // Actions
  async function fetchDashboardStats() {
    try {
      isLoading.value = true;
      error.value = null;
      const stats = await analyticsService.getDashboardStats();
      dashboardStats.value = stats;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch dashboard stats';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchWeeklyStats() {
    try {
      isLoading.value = true;
      error.value = null;
      const stats = await analyticsService.getWeeklyStats();
      weeklyStats.value = stats;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch weekly stats';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchCalendarData(year: number, month: number) {
    try {
      isLoading.value = true;
      error.value = null;
      const data = await analyticsService.getCalendarData(year, month);
      calendarData.value = data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch calendar data';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchHabitAnalytics(habitId?: string, period: 'week' | 'month' | 'year' = 'month') {
    try {
      isLoading.value = true;
      error.value = null;
      const analytics = await analyticsService.getHabitAnalytics(habitId, period);
      habitAnalytics.value = analytics;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch habit analytics';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchMoodAnalytics(period: 'week' | 'month' | 'year' = 'month') {
    try {
      isLoading.value = true;
      error.value = null;
      const analytics = await analyticsService.getMoodAnalytics(period);
      moodAnalytics.value = analytics;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch mood analytics';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchJournalAnalytics(period: 'week' | 'month' | 'year' = 'month') {
    try {
      isLoading.value = true;
      error.value = null;
      const analytics = await analyticsService.getJournalAnalytics(period);
      journalAnalytics.value = analytics;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch journal analytics';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchGoalAnalytics() {
    try {
      isLoading.value = true;
      error.value = null;
      const analytics = await analyticsService.getGoalAnalytics();
      goalAnalytics.value = analytics;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch goal analytics';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchAllAnalytics() {
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchWeeklyStats(),
        fetchHabitAnalytics(),
        fetchMoodAnalytics(),
        fetchJournalAnalytics(),
        fetchGoalAnalytics()
      ]);
    } catch (err) {
      console.error('Failed to fetch all analytics:', err);
    }
  }

  async function exportData(format: 'csv' | 'json' | 'pdf', startDate?: string, endDate?: string) {
    try {
      isLoading.value = true;
      error.value = null;
      const blob = await analyticsService.exportData(format, startDate, endDate);
      return blob;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to export data';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function getWellnessScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  }

  function getWellnessScoreLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  }

  function clearError() {
    error.value = null;
  }

  return {
    // State
    dashboardStats,
    weeklyStats,
    calendarData,
    habitAnalytics,
    moodAnalytics,
    journalAnalytics,
    goalAnalytics,
    isLoading,
    error,
    
    // Getters
    currentWeekStats,
    habitCompletionTrend,
    moodTrend,
    wellnessScore,
    monthlyCalendarData,
    
    // Actions
    fetchDashboardStats,
    fetchWeeklyStats,
    fetchCalendarData,
    fetchHabitAnalytics,
    fetchMoodAnalytics,
    fetchJournalAnalytics,
    fetchGoalAnalytics,
    fetchAllAnalytics,
    exportData,
    getWellnessScoreColor,
    getWellnessScoreLabel,
    clearError
  };
});
