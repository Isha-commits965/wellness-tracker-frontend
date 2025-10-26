import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { goalsService } from '@/services/goals';
import type { Goal } from '@/types';

export const useGoalsStore = defineStore('goals', () => {
  // State
  const goals = ref<Goal[]>([]);
  const categories = ref<string[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const activeGoals = computed(() => goals.value?.filter(goal => goal && goal.status === 'in_progress') || []);
  const completedGoals = computed(() => goals.value?.filter(goal => goal && goal.status === 'completed') || []);
  const overdueGoals = computed(() => goals.value?.filter(goal => goal && goal.status === 'overdue') || []);

  const goalsByCategory = computed(() => {
    const categoriesMap: { [key: string]: Goal[] } = {};
    if (!goals.value) return categoriesMap;
    goals.value.forEach(goal => {
      if (!goal) return;
      if (!categoriesMap[goal.category]) {
        categoriesMap[goal.category] = [];
      }
      categoriesMap[goal.category].push(goal);
    });
    return categoriesMap;
  });

  const goalsByPriority = computed(() => {
    const priorityMap: { [key: string]: Goal[] } = {
      high: [],
      medium: [],
      low: []
    };
    if (!goals.value) return priorityMap;
    goals.value.forEach(goal => {
      if (!goal) return;
      priorityMap[goal.priority].push(goal);
    });
    return priorityMap;
  });

  const totalGoals = computed(() => goals.value?.length || 0);
  const completedGoalsCount = computed(() => completedGoals.value.length);
  const completionRate = computed(() => {
    if (totalGoals.value === 0) return 0;
    return Math.round((completedGoalsCount.value / totalGoals.value) * 100);
  });

  const averageProgress = computed(() => {
    if (!activeGoals.value || activeGoals.value.length === 0) return 0;
    const totalProgress = activeGoals.value.reduce((acc, goal) => acc + (goal?.progress || 0), 0);
    return Math.round(totalProgress / activeGoals.value.length);
  });

  const upcomingDeadlines = computed(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return activeGoals.value
      .filter(goal => {
        const targetDate = new Date(goal.targetDate);
        return targetDate <= nextWeek && targetDate >= new Date();
      })
      .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
  });

  // Actions
  async function fetchGoals(status?: string, category?: string) {
    try {
      isLoading.value = true;
      error.value = null;
      const goalsData = await goalsService.getGoals(status, category);
      goals.value = goalsData;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch goals';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function createGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      isLoading.value = true;
      error.value = null;
      const newGoal = await goalsService.createGoal(goalData);
      if (!goals.value) goals.value = [];
      goals.value.push(newGoal);
      return newGoal;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create goal';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateGoal(id: string, goalData: Partial<Goal>) {
    try {
      isLoading.value = true;
      error.value = null;
      const updatedGoal = await goalsService.updateGoal(id, goalData);
      const index = goals.value.findIndex(goal => goal.id === id);
      if (index !== -1) {
        goals.value[index] = updatedGoal;
      }
      return updatedGoal;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update goal';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteGoal(id: string) {
    try {
      isLoading.value = true;
      error.value = null;
      await goalsService.deleteGoal(id);
      goals.value = goals.value.filter(goal => goal.id !== id);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete goal';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function completeGoal(id: string) {
    try {
      isLoading.value = true;
      error.value = null;
      const completedGoal = await goalsService.completeGoal(id);
      const index = goals.value.findIndex(goal => goal.id === id);
      if (index !== -1) {
        goals.value[index] = completedGoal;
      }
      return completedGoal;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to complete goal';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateGoalProgress(id: string, progress: number) {
    try {
      isLoading.value = true;
      error.value = null;
      const updatedGoal = await goalsService.updateGoalProgress(id, progress);
      const index = goals.value.findIndex(goal => goal.id === id);
      if (index !== -1) {
        goals.value[index] = updatedGoal;
      }
      return updatedGoal;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update goal progress';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchCategories() {
    try {
      isLoading.value = true;
      error.value = null;
      const categoriesData = await goalsService.getGoalCategories();
      categories.value = categoriesData;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch categories';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function searchGoals(query: string) {
    try {
      isLoading.value = true;
      error.value = null;
      const searchResults = await goalsService.searchGoals(query);
      return searchResults;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to search goals';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function getGoalById(id: string): Goal | undefined {
    return goals.value.find(goal => goal.id === id);
  }

  function getGoalsByStatus(status: 'in_progress' | 'completed' | 'overdue'): Goal[] {
    return goals.value.filter(goal => goal.status === status);
  }

  function getGoalsByCategory(category: string): Goal[] {
    return goals.value.filter(goal => goal.category === category);
  }

  function getGoalsByPriority(priority: 'low' | 'medium' | 'high'): Goal[] {
    return goals.value.filter(goal => goal.priority === priority);
  }

  function getProgressColor(progress: number): string {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    if (progress >= 40) return 'text-orange-600';
    return 'text-red-600';
  }

  function getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    // State
    goals,
    categories,
    isLoading,
    error,
    
    // Getters
    activeGoals,
    completedGoals,
    overdueGoals,
    goalsByCategory,
    goalsByPriority,
    totalGoals,
    completedGoalsCount,
    completionRate,
    averageProgress,
    upcomingDeadlines,
    
    // Actions
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    completeGoal,
    updateGoalProgress,
    fetchCategories,
    searchGoals,
    getGoalById,
    getGoalsByStatus,
    getGoalsByCategory,
    getGoalsByPriority,
    getProgressColor,
    getPriorityColor,
    getStatusColor,
    clearError
  };
});
