import apiService from './api';
import type { Goal, PaginatedResponse } from '@/types';

export const goalsService = {
  async getGoals(status?: string, category?: string): Promise<Goal[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (category) params.append('category', category);
    
    const response = await apiService.get<Goal[]>(`/goals/?${params.toString()}`);
    return response.data;
  },

  async getGoal(id: string): Promise<Goal> {
    const response = await apiService.get<Goal>(`/goals/${id}`);
    return response.data;
  },

  async createGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
    const response = await apiService.post<Goal>('/goals/', goalData);
    return response.data;
  },

  async updateGoal(id: string, goalData: Partial<Goal>): Promise<Goal> {
    const response = await apiService.put<Goal>(`/goals/${id}`, goalData);
    return response.data;
  },

  async deleteGoal(id: string): Promise<void> {
    await apiService.delete(`/goals/${id}`);
  },

  async completeGoal(id: string): Promise<Goal> {
    const response = await apiService.post<Goal>(`/goals/${id}/complete`);
    return response.data;
  },

  async updateGoalProgress(id: string, progress: number): Promise<Goal> {
    const response = await apiService.patch<Goal>(`/goals/${id}/progress`, { progress });
    return response.data;
  },

  // Categories and priorities
  async getGoalCategories(): Promise<string[]> {
    const response = await apiService.get<string[]>('/goals/categories');
    return response.data;
  },

  // Analytics
  async getGoalStats(): Promise<any> {
    const response = await apiService.get('/goals/stats');
    return response.data;
  },

  async getGoalProgress(id: string): Promise<any> {
    const response = await apiService.get(`/goals/${id}/progress`);
    return response.data;
  },

  // Milestones
  async addMilestone(goalId: string, milestone: { title: string; description?: string; targetDate?: string }): Promise<any> {
    const response = await apiService.post(`/goals/${goalId}/milestones`, milestone);
    return response.data;
  },

  async updateMilestone(goalId: string, milestoneId: string, milestone: any): Promise<any> {
    const response = await apiService.put(`/goals/${goalId}/milestones/${milestoneId}`, milestone);
    return response.data;
  },

  async deleteMilestone(goalId: string, milestoneId: string): Promise<void> {
    await apiService.delete(`/goals/${goalId}/milestones/${milestoneId}`);
  },

  async completeMilestone(goalId: string, milestoneId: string): Promise<any> {
    const response = await apiService.post(`/goals/${goalId}/milestones/${milestoneId}/complete`);
    return response.data;
  },

  // Search and filter
  async searchGoals(query: string): Promise<Goal[]> {
    const response = await apiService.get<Goal[]>(`/goals/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  async getGoalsByDateRange(startDate: string, endDate: string): Promise<Goal[]> {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
    });
    
    const response = await apiService.get<Goal[]>(`/goals/by-date-range?${params.toString()}`);
    return response.data;
  }
};
