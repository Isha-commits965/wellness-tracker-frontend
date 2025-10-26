import apiService from './api';
import type { DashboardStats, WeeklyStats, CalendarData } from '@/types';

export const analyticsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiService.get<DashboardStats>('/analytics/dashboard');
    return response.data;
  },

  async getWeeklyStats(): Promise<WeeklyStats[]> {
    const response = await apiService.get<WeeklyStats[]>('/analytics/weekly-stats');
    return response.data;
  },

  async getCalendarData(year: number, month: number): Promise<CalendarData[]> {
    const response = await apiService.get<CalendarData[]>(`/analytics/calendar/${year}/${month}`);
    return response.data;
  },

  async getHabitAnalytics(habitId?: string, period: 'week' | 'month' | 'year' = 'month'): Promise<any> {
    const params = new URLSearchParams({ period });
    if (habitId) params.append('habit_id', habitId);
    
    const response = await apiService.get(`/analytics/habits?${params.toString()}`);
    return response.data;
  },

  async getMoodAnalytics(period: 'week' | 'month' | 'year' = 'month'): Promise<any> {
    const response = await apiService.get(`/analytics/moods?period=${period}`);
    return response.data;
  },

  async getJournalAnalytics(period: 'week' | 'month' | 'year' = 'month'): Promise<any> {
    const response = await apiService.get(`/analytics/journal?period=${period}`);
    return response.data;
  },

  async getGoalAnalytics(): Promise<any> {
    const response = await apiService.get('/analytics/goals');
    return response.data;
  },

  async getProductivityInsights(): Promise<any> {
    const response = await apiService.get('/analytics/productivity');
    return response.data;
  },

  async getWellnessScore(period: 'week' | 'month' | 'year' = 'month'): Promise<any> {
    const response = await apiService.get(`/analytics/wellness-score?period=${period}`);
    return response.data;
  },

  async getTrendsAnalysis(): Promise<any> {
    const response = await apiService.get('/analytics/trends');
    return response.data;
  },

  async getRecommendations(): Promise<any> {
    const response = await apiService.get('/analytics/recommendations');
    return response.data;
  },

  // Export functionality
  async exportData(format: 'csv' | 'json' | 'pdf', startDate?: string, endDate?: string): Promise<Blob> {
    const params = new URLSearchParams({ format });
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await apiService.get(`/analytics/export?${params.toString()}`, {
      responseType: 'blob'
    });
    
    return response as unknown as Blob;
  }
};
