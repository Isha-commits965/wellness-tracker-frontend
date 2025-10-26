import apiService from './api';
import type { Habit, HabitCheckIn, HabitStreak, PaginatedResponse } from '@/types';

export const habitsService = {
  async getHabits(): Promise<Habit[]> {
    const response = await apiService.get<any[]>('/habits/');
    console.log('Raw habits response:', response);
    // The response is already the array, not wrapped in .data
    const habitsArray = Array.isArray(response) ? response : [];
    // Map backend snake_case to frontend camelCase
    const mappedHabits = habitsArray.map((habit: any) => ({
      id: habit.id,
      name: habit.name,
      description: habit.description || '',
      category: habit.category,
      frequency: habit.target_frequency || habit.frequency || 'daily',
      targetValue: habit.target_value || 1,
      unit: habit.unit || 'times',
      isActive: habit.is_active !== undefined ? habit.is_active : true,
      createdAt: habit.created_at || habit.createdAt,
      updatedAt: habit.updated_at || habit.updatedAt
    }));
    console.log('Mapped habits:', mappedHabits);
    return mappedHabits;
  },

  async getHabit(id: string): Promise<Habit> {
    const response = await apiService.get<Habit>(`/habits/${id}`);
    return response.data;
  },

  async createHabit(habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Habit> {
    const response = await apiService.post<Habit>('/habits/', habitData);
    return response.data;
  },

  async updateHabit(id: string, habitData: Partial<Habit>): Promise<Habit> {
    const response = await apiService.put<Habit>(`/habits/${id}`, habitData);
    return response.data;
  },

  async deleteHabit(id: string): Promise<void> {
    await apiService.delete(`/habits/${id}`);
  },

  async toggleHabitStatus(id: string, isActive: boolean): Promise<Habit> {
    const response = await apiService.patch<Habit>(`/habits/${id}/toggle`, { isActive });
    return response.data;
  },

  // Check-ins
  async createCheckIn(checkInData: Omit<HabitCheckIn, 'id' | 'createdAt'>): Promise<HabitCheckIn> {
    // Map frontend camelCase to backend snake_case
    const backendPayload = {
      habit_id: checkInData.habitId,
      date: checkInData.date,
      value: checkInData.value || 1,
      notes: checkInData.notes || ''
    };
    const response = await apiService.post<any>('/habits/check-ins/', backendPayload);
    // Map response back to frontend format
    return {
      id: response.id,
      habitId: response.habit_id,
      date: response.date,
      value: response.value,
      notes: response.notes || '',
      createdAt: response.created_at
    };
  },

  async getCheckIns(habitId?: string, date?: string): Promise<HabitCheckIn[]> {
    const params = new URLSearchParams();
    if (habitId) params.append('habit_id', habitId);
    if (date) params.append('date', date);
    
    const response = await apiService.get<HabitCheckIn[]>(`/habits/check-ins/?${params.toString()}`);
    return response.data;
  },

  async updateCheckIn(id: string, checkInData: Partial<HabitCheckIn>): Promise<HabitCheckIn> {
    const response = await apiService.put<HabitCheckIn>(`/habits/check-ins/${id}`, checkInData);
    return response.data;
  },

  async deleteCheckIn(id: string): Promise<void> {
    await apiService.delete(`/habits/check-ins/${id}`);
  },

  // Streaks
  async getStreaks(): Promise<HabitStreak[]> {
    const response = await apiService.get<HabitStreak[]>('/habits/streaks/');
    return response.data;
  },

  async getHabitStreak(habitId: string): Promise<HabitStreak> {
    const response = await apiService.get<HabitStreak>(`/habits/${habitId}/streak`);
    return response.data;
  },

  // Analytics
  async getHabitStats(habitId: string, period: 'week' | 'month' | 'year' = 'month') {
    const response = await apiService.get(`/habits/${habitId}/stats?period=${period}`);
    return response.data;
  },

  async getCompletionRate(habitId: string, startDate: string, endDate: string) {
    const response = await apiService.get(`/habits/${habitId}/completion-rate?start_date=${startDate}&end_date=${endDate}`);
    return response.data;
  }
};
