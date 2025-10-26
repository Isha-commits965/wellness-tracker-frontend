import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { habitsService } from '@/services/habits';
import type { Habit, HabitCheckIn, HabitStreak } from '@/types';

export const useHabitsStore = defineStore('habits', () => {
  // State
  const habits = ref<Habit[]>([]);
  const checkIns = ref<HabitCheckIn[]>([]);
  const streaks = ref<HabitStreak[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const activeHabits = computed(() => habits.value?.filter(habit => habit && habit.isActive) || []);
  const habitsByCategory = computed(() => {
    const categories: { [key: string]: Habit[] } = {};
    if (!habits.value) return categories;
    habits.value.forEach(habit => {
      if (!habit) return;
      if (!categories[habit.category]) {
        categories[habit.category] = [];
      }
      categories[habit.category].push(habit);
    });
    return categories;
  });

  const totalHabits = computed(() => habits.value?.length || 0);
  const activeHabitsCount = computed(() => activeHabits.value?.length || 0);

  const todayCheckIns = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return checkIns.value?.filter(checkIn => checkIn.date === today) || [];
  });

  const completedHabitsToday = computed(() => {
    return activeHabits.value?.filter(habit => 
      todayCheckIns.value.some(checkIn => checkIn.habitId === habit.id)
    ) || [];
  });

  const completionRate = computed(() => {
    if (!activeHabits.value || activeHabits.value.length === 0) return 0;
    return (completedHabitsToday.value.length / activeHabits.value.length) * 100;
  });

  // Actions
  async function fetchHabits() {
    try {
      isLoading.value = true;
      error.value = null;
      const habitsData = await habitsService.getHabits();
      console.log('Setting habits in store:', habitsData);
      habits.value = habitsData;
      console.log('Habits value after setting:', habits.value);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch habits';
      console.error('Error fetching habits:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function createHabit(habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      isLoading.value = true;
      error.value = null;
      const newHabit = await habitsService.createHabit(habitData);
      if (!habits.value) habits.value = [];
      habits.value.push(newHabit);
      return newHabit;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create habit';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateHabit(id: string, habitData: Partial<Habit>) {
    try {
      isLoading.value = true;
      error.value = null;
      const updatedHabit = await habitsService.updateHabit(id, habitData);
      const index = habits.value.findIndex(habit => habit.id === id);
      if (index !== -1) {
        habits.value[index] = updatedHabit;
      }
      return updatedHabit;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update habit';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteHabit(id: string) {
    try {
      isLoading.value = true;
      error.value = null;
      await habitsService.deleteHabit(id);
      habits.value = habits.value.filter(habit => habit.id !== id);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete habit';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function toggleHabitStatus(id: string, isActive: boolean) {
    try {
      const updatedHabit = await habitsService.toggleHabitStatus(id, isActive);
      const index = habits.value.findIndex(habit => habit.id === id);
      if (index !== -1) {
        habits.value[index] = updatedHabit;
      }
      return updatedHabit;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to toggle habit status';
      throw err;
    }
  }

  // Check-ins
  async function createCheckIn(checkInData: Omit<HabitCheckIn, 'id' | 'createdAt'>) {
    try {
      isLoading.value = true;
      error.value = null;
      const newCheckIn = await habitsService.createCheckIn(checkInData);
      if (!checkIns.value) checkIns.value = [];
      checkIns.value.push(newCheckIn);
      return newCheckIn;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create check-in';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchCheckIns(habitId?: string, date?: string) {
    try {
      isLoading.value = true;
      error.value = null;
      const checkInsData = await habitsService.getCheckIns(habitId, date);
      checkIns.value = checkInsData;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch check-ins';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function updateCheckIn(id: string, checkInData: Partial<HabitCheckIn>) {
    try {
      isLoading.value = true;
      error.value = null;
      const updatedCheckIn = await habitsService.updateCheckIn(id, checkInData);
      const index = checkIns.value.findIndex(checkIn => checkIn.id === id);
      if (index !== -1) {
        checkIns.value[index] = updatedCheckIn;
      }
      return updatedCheckIn;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update check-in';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteCheckIn(id: string) {
    try {
      isLoading.value = true;
      error.value = null;
      await habitsService.deleteCheckIn(id);
      checkIns.value = checkIns.value.filter(checkIn => checkIn.id !== id);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete check-in';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  // Streaks
  async function fetchStreaks() {
    try {
      isLoading.value = true;
      error.value = null;
      const streaksData = await habitsService.getStreaks();
      streaks.value = streaksData;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch streaks';
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  function getHabitStreak(habitId: string): HabitStreak | undefined {
    return streaks.value?.find(streak => streak.habitId === habitId);
  }

  function isHabitCompletedToday(habitId: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return todayCheckIns.value?.some(checkIn => checkIn.habitId === habitId) || false;
  }

  function clearError() {
    error.value = null;
  }

  return {
    // State
    habits,
    checkIns,
    streaks,
    isLoading,
    error,
    
    // Getters
    activeHabits,
    habitsByCategory,
    totalHabits,
    activeHabitsCount,
    todayCheckIns,
    completedHabitsToday,
    completionRate,
    
    // Actions
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitStatus,
    createCheckIn,
    fetchCheckIns,
    updateCheckIn,
    deleteCheckIn,
    fetchStreaks,
    getHabitStreak,
    isHabitCompletedToday,
    clearError
  };
});
