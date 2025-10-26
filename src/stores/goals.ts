import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { goalsService } from '@/services/goals';
import type { Goal } from '@/types';

export const useGoalsStore = defineStore('goals', () => {
  // State
  const goals = ref<Goal[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const activeGoals = computed(() => goals.value?.filter(goal => goal && !goal.isCompleted) || []);
  const completedGoals = computed(() => goals.value?.filter(goal => goal && goal.isCompleted) || []);
  const overdueGoals = computed(() => {
    const today = new Date();
    return activeGoals.value.filter(goal => {
      if (!goal.targetDate) return false;
      const targetDate = new Date(goal.targetDate);
      return targetDate < today;
    });
  });

  const totalGoals = computed(() => goals.value?.length || 0);
  const completedGoalsCount = computed(() => completedGoals.value.length);
  const completionRate = computed(() => {
    if (totalGoals.value === 0) return 0;
    return Math.round((completedGoalsCount.value / totalGoals.value) * 100);
  });

  const upcomingDeadlines = computed(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return activeGoals.value
      .filter(goal => {
        if (!goal.targetDate) return false;
        const targetDate = new Date(goal.targetDate);
        return targetDate <= nextWeek && targetDate >= new Date();
      })
      .sort((a, b) => new Date(a.targetDate!).getTime() - new Date(b.targetDate!).getTime());
  });

  // Actions
  async function fetchGoals(completed?: boolean) {
    try {
      isLoading.value = true;
      error.value = null;
      const goalsData = await goalsService.getGoals(completed);
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
      await goalsService.completeGoal(id);
      // Update the goal in the store to mark it as completed
      const index = goals.value.findIndex(goal => goal.id === id);
      if (index !== -1) {
        goals.value[index].isCompleted = true;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to complete goal';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function getGoalById(id: string): Goal | undefined {
    return goals.value.find(goal => goal.id === id);
  }

  function getGoalsByStatus(completed: boolean): Goal[] {
    return goals.value.filter(goal => goal.isCompleted === completed);
  }

  function clearError() {
    error.value = null;
  }

  return {
    // State
    goals,
    isLoading,
    error,
    
    // Getters
    activeGoals,
    completedGoals,
    overdueGoals,
    totalGoals,
    completedGoalsCount,
    completionRate,
    upcomingDeadlines,
    
    // Actions
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    completeGoal,
    getGoalById,
    getGoalsByStatus,
    clearError
  };
});
