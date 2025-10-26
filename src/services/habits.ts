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
    const response = await apiService.get<any>(`/habits/${id}`);
    // Map backend snake_case to frontend camelCase
    return {
      id: response.id,
      name: response.name,
      description: response.description || '',
      category: response.category,
      frequency: response.target_frequency || response.frequency || 'daily',
      targetValue: response.target_value || 1,
      unit: response.unit || 'times',
      isActive: response.is_active !== undefined ? response.is_active : true,
      createdAt: response.created_at || response.createdAt,
      updatedAt: response.updated_at || response.updatedAt
    };
  },

  async createHabit(habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Habit> {
    const response = await apiService.post<any>('/habits/', habitData);
    // Map backend snake_case to frontend camelCase
    return {
      id: response.id,
      name: response.name,
      description: response.description || '',
      category: response.category,
      frequency: response.target_frequency || response.frequency || 'daily',
      targetValue: response.target_value || 1,
      unit: response.unit || 'times',
      isActive: response.is_active !== undefined ? response.is_active : true,
      createdAt: response.created_at || response.createdAt,
      updatedAt: response.updated_at || response.updatedAt
    };
  },

  async updateHabit(id: string, habitData: Partial<Habit>): Promise<Habit> {
    const response = await apiService.put<any>(`/habits/${id}`, habitData);
    // Map backend snake_case to frontend camelCase
    return {
      id: response.id,
      name: response.name,
      description: response.description || '',
      category: response.category,
      frequency: response.target_frequency || response.frequency || 'daily',
      targetValue: response.target_value || 1,
      unit: response.unit || 'times',
      isActive: response.is_active !== undefined ? response.is_active : true,
      createdAt: response.created_at || response.createdAt,
      updatedAt: response.updated_at || response.updatedAt
    };
  },

  async deleteHabit(id: string): Promise<void> {
    await apiService.delete(`/habits/${id}`);
  },

  async toggleHabitStatus(id: string, isActive: boolean): Promise<Habit> {
    const response = await apiService.patch<any>(`/habits/${id}/toggle`, { isActive });
    // Map backend snake_case to frontend camelCase
    return {
      id: response.id,
      name: response.name,
      description: response.description || '',
      category: response.category,
      frequency: response.target_frequency || response.frequency || 'daily',
      targetValue: response.target_value || 1,
      unit: response.unit || 'times',
      isActive: response.is_active !== undefined ? response.is_active : true,
      createdAt: response.created_at || response.createdAt,
      updatedAt: response.updated_at || response.updatedAt
    };
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
    
    const response = await apiService.get<any[]>(`/habits/check-ins/?${params.toString()}`);
    console.log('Raw check-ins response:', response);
    
    // The response is already the array, not wrapped in .data
    const checkInsArray = Array.isArray(response) ? response : [];
    
    // Map backend snake_case to frontend camelCase
    const mappedCheckIns = checkInsArray.map((checkIn: any) => ({
      id: checkIn.id,
      habitId: checkIn.habit_id,
      date: checkIn.date,
      value: checkIn.value,
      notes: checkIn.notes || '',
      createdAt: checkIn.created_at
    }));
    
    console.log('Mapped check-ins:', mappedCheckIns);
    return mappedCheckIns;
  },

  async updateCheckIn(id: string, checkInData: Partial<HabitCheckIn>): Promise<HabitCheckIn> {
    const response = await apiService.put<any>(`/habits/check-ins/${id}`, checkInData);
    // Map backend snake_case to frontend camelCase
    return {
      id: response.id,
      habitId: response.habit_id,
      date: response.date,
      value: response.value,
      notes: response.notes || '',
      createdAt: response.created_at
    };
  },

  async deleteCheckIn(id: string): Promise<void> {
    await apiService.delete(`/habits/check-ins/${id}`);
  },

  // Streaks
  async getStreaks(): Promise<HabitStreak[]> {
    const response = await apiService.get<any[]>('/habits/streaks/');
    // Map backend response to frontend format
    return response.map((streak: any) => ({
      habitId: streak.habit_id,
      habitName: streak.habit_name,
      currentStreak: streak.current_streak,
      longestStreak: streak.longest_streak,
      lastCompleted: streak.last_completed
    }));
  },

  async getHabitStreak(habitId: string): Promise<HabitStreak> {
    const response = await apiService.get<any>(`/habits/${habitId}/streak`);
    return response;
  },

  // Analytics
  async getHabitStats(habitId: string, period: 'week' | 'month' | 'year' = 'month') {
    const response = await apiService.get(`/habits/${habitId}/stats?period=${period}`);
    return response;
  },

  async getCompletionRate(habitId: string, startDate: string, endDate: string) {
    const response = await apiService.get(`/habits/${habitId}/completion-rate?start_date=${startDate}&end_date=${endDate}`);
    return response;
  }
};
