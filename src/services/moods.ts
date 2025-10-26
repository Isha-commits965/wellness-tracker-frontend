import apiService from './api';
import type { MoodEntry, MoodTrends } from '@/types';

export const moodsService = {
  async createMoodEntry(moodData: Omit<MoodEntry, 'id' | 'createdAt'>): Promise<MoodEntry> {
    // Map frontend field names to backend field names
    const backendPayload = {
      mood_score: moodData.mood,
      energy_level: moodData.energy,
      stress_level: moodData.stress,
      notes: moodData.notes || '',
      date: moodData.date
    };
    const response = await apiService.post<any>('/moods/', backendPayload);
    // Map response back to frontend format
    return {
      id: response.id,
      mood: response.mood_score,
      energy: response.energy_level,
      stress: response.stress_level,
      notes: response.notes || '',
      date: response.date,
      createdAt: response.created_at
    };
  },

  async getMoodEntries(startDate?: string, endDate?: string): Promise<MoodEntry[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await apiService.get<any[]>(`/moods/?${params.toString()}`);
    console.log('Raw moods response:', response);
    // The response is already the array, not wrapped in .data
    const moodsArray = Array.isArray(response) ? response : [];
    // Map backend snake_case to frontend camelCase
    const mappedMoods = moodsArray.map((entry: any) => ({
      id: entry.id,
      mood: entry.mood_score,
      energy: entry.energy_level,
      stress: entry.stress_level,
      notes: entry.notes || '',
      date: entry.date,
      createdAt: entry.created_at
    }));
    console.log('Mapped moods:', mappedMoods);
    return mappedMoods;
  },

  async getMoodEntry(id: string): Promise<MoodEntry> {
    const response = await apiService.get<any>(`/moods/${id}`);
    // Map response back to frontend format
    return {
      id: response.id,
      mood: response.mood_score,
      energy: response.energy_level,
      stress: response.stress_level,
      notes: response.notes || '',
      date: response.date,
      createdAt: response.created_at
    };
  },

  async updateMoodEntry(id: string, moodData: Partial<MoodEntry>): Promise<MoodEntry> {
    // Map frontend field names to backend field names
    const backendPayload: any = {};
    if (moodData.mood !== undefined) backendPayload.mood_score = moodData.mood;
    if (moodData.energy !== undefined) backendPayload.energy_level = moodData.energy;
    if (moodData.stress !== undefined) backendPayload.stress_level = moodData.stress;
    if (moodData.notes !== undefined) backendPayload.notes = moodData.notes;
    if (moodData.date !== undefined) backendPayload.date = moodData.date;
    
    console.log('Updating mood entry:', id, 'with payload:', backendPayload);
    
    const response = await apiService.put<any>(`/moods/${id}`, backendPayload);
    console.log('Update response:', response);
    
    // Map response back to frontend format
    return {
      id: response.id,
      mood: response.mood_score,
      energy: response.energy_level,
      stress: response.stress_level,
      notes: response.notes || '',
      date: response.date,
      createdAt: response.created_at
    };
  },

  async deleteMoodEntry(id: string): Promise<void> {
    await apiService.delete(`/moods/${id}`);
  },

  // Trends and Analytics
  async getMoodTrends(period: 'week' | 'month' | 'year' = 'month'): Promise<MoodTrends> {
    const response = await apiService.get<any>(`/moods/trends/?period=${period}`);
    return response;
  },

  async getWeeklyStats(): Promise<any> {
    const response = await apiService.get('/moods/stats/weekly');
    return response;
  },

  async getMonthlyStats(): Promise<any> {
    const response = await apiService.get('/moods/stats/monthly');
    return response;
  },

  async getMoodDistribution(period: 'week' | 'month' | 'year' = 'month'): Promise<any> {
    const response = await apiService.get(`/moods/distribution?period=${period}`);
    return response;
  },

  async getMoodCorrelations(): Promise<any> {
    const response = await apiService.get('/moods/correlations');
    return response;
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
