import apiService from './api';
import type { Goal } from '@/types';

export const goalsService = {
  async getGoals(completed?: boolean): Promise<Goal[]> {
    const params = new URLSearchParams();
    if (completed !== undefined) params.append('completed', completed.toString());
    
    const response = await apiService.get<any[]>(`/goals/?${params.toString()}`);
    // Map backend snake_case to frontend camelCase
    return response.map((goal: any) => ({
      id: goal.id.toString(),
      title: goal.title,
      description: goal.description || '',
      targetDate: goal.target_date,
      isCompleted: goal.is_completed,
      createdAt: goal.created_at,
      updatedAt: goal.updated_at || goal.created_at
    }));
  },

  async getGoal(id: string): Promise<Goal> {
    const response = await apiService.get<any>(`/goals/${id}`);
    // Map backend snake_case to frontend camelCase
    return {
      id: response.id.toString(),
      title: response.title,
      description: response.description || '',
      targetDate: response.target_date,
      isCompleted: response.is_completed,
      createdAt: response.created_at,
      updatedAt: response.updated_at || response.created_at
    };
  },

  async createGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
    // Map frontend camelCase to backend snake_case
    const backendPayload = {
      title: goalData.title,
      description: goalData.description || '',
      target_date: goalData.targetDate
    };
    
    const response = await apiService.post<any>('/goals/', backendPayload);
    // Map backend snake_case to frontend camelCase
    return {
      id: response.id.toString(),
      title: response.title,
      description: response.description || '',
      targetDate: response.target_date,
      isCompleted: response.is_completed,
      createdAt: response.created_at,
      updatedAt: response.updated_at || response.created_at
    };
  },

  async updateGoal(id: string, goalData: Partial<Goal>): Promise<Goal> {
    // Map frontend camelCase to backend snake_case
    const backendPayload: any = {};
    if (goalData.title !== undefined) backendPayload.title = goalData.title;
    if (goalData.description !== undefined) backendPayload.description = goalData.description;
    if (goalData.targetDate !== undefined) backendPayload.target_date = goalData.targetDate;
    if (goalData.isCompleted !== undefined) backendPayload.is_completed = goalData.isCompleted;
    
    const response = await apiService.put<any>(`/goals/${id}`, backendPayload);
    // Map backend snake_case to frontend camelCase
    return {
      id: response.id.toString(),
      title: response.title,
      description: response.description || '',
      targetDate: response.target_date,
      isCompleted: response.is_completed,
      createdAt: response.created_at,
      updatedAt: response.updated_at || response.created_at
    };
  },

  async deleteGoal(id: string): Promise<void> {
    await apiService.delete(`/goals/${id}`);
  },

  async completeGoal(id: string): Promise<void> {
    await apiService.post(`/goals/${id}/complete`);
  },

  async getGoalStats(): Promise<any> {
    const response = await apiService.get('/goals/stats/overview');
    return response;
  }
};
