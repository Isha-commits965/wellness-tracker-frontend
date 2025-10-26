import apiService from './api';
import type { MoodEntry, MoodTrends } from '@/types';

export const moodsService = {
  async createMoodEntry(moodData: Omit<MoodEntry, 'id' | 'createdAt'>): Promise<MoodEntry> {
    const response = await apiService.post<MoodEntry>('/moods/', moodData);
    return response.data;
  },

  async getMoodEntries(startDate?: string, endDate?: string): Promise<MoodEntry[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await apiService.get<MoodEntry[]>(`/moods/?${params.toString()}`);
    return response.data;
  },

  async getMoodEntry(id: string): Promise<MoodEntry> {
    const response = await apiService.get<MoodEntry>(`/moods/${id}`);
    return response.data;
  },

  async updateMoodEntry(id: string, moodData: Partial<MoodEntry>): Promise<MoodEntry> {
    const response = await apiService.put<MoodEntry>(`/moods/${id}`, moodData);
    return response.data;
  },

  async deleteMoodEntry(id: string): Promise<void> {
    await apiService.delete(`/moods/${id}`);
  },

  // Trends and Analytics
  async getMoodTrends(period: 'week' | 'month' | 'year' = 'month'): Promise<MoodTrends> {
    const response = await apiService.get<MoodTrends>(`/moods/trends/?period=${period}`);
    return response.data;
  },

  async getWeeklyStats(): Promise<any> {
    const response = await apiService.get('/moods/stats/weekly');
    return response.data;
  },

  async getMonthlyStats(): Promise<any> {
    const response = await apiService.get('/moods/stats/monthly');
    return response.data;
  },

  async getMoodDistribution(period: 'week' | 'month' | 'year' = 'month'): Promise<any> {
    const response = await apiService.get(`/moods/distribution?period=${period}`);
    return response.data;
  },

  async getMoodCorrelations(): Promise<any> {
    const response = await apiService.get('/moods/correlations');
    return response.data;
  },

  // Quick mood logging
  async logQuickMood(mood: number, energy: number, stress: number, notes?: string): Promise<MoodEntry> {
    const today = new Date().toISOString().split('T')[0];
    return this.createMoodEntry({
      mood,
      energy,
      stress,
      notes,
      date: today
    });
  }
};
