import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { habitsService } from '@/services/habits';
import { badgeService } from '@/services/badges';
import type { Habit, HabitCheckIn, HabitStreak, StreakData } from '@/types';

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

  // Streak calculations
  const completedDates = computed(() => {
    if (!checkIns.value || !activeHabits.value) return [];
    
    // Get all unique dates where all habits were completed
    const dateMap = new Map<string, number>();
    const totalActiveHabits = activeHabits.value.length;
    
    if (totalActiveHabits === 0) return [];
    
    checkIns.value.forEach(checkIn => {
      const date = checkIn.date;
      const currentCount = dateMap.get(date) || 0;
      dateMap.set(date, currentCount + 1);
    });
    
    // Return dates where all habits were completed
    return Array.from(dateMap.entries())
      .filter(([_, count]) => count === totalActiveHabits)
      .map(([date, _]) => date);
  });

  // Calculate overall streak from API data
  const currentStreak = computed(() => {
    if (!streaks.value || streaks.value.length === 0) {
      console.log('No streaks data available, returning 0')
      return 0;
    }
    
    // Find the maximum current streak among all habits
    const maxStreak = Math.max(...streaks.value.map(streak => streak.currentStreak));
    console.log('Calculated current streak:', maxStreak, 'from streaks:', streaks.value)
    return maxStreak;
  });

  const longestStreak = computed(() => {
    if (!streaks.value || streaks.value.length === 0) return 0;
    
    // Find the maximum longest streak among all habits
    const maxLongestStreak = Math.max(...streaks.value.map(streak => streak.longestStreak));
    return maxLongestStreak;
  });

  // Keep the old streak data for badge calculations (fallback)
  const streakData = computed((): StreakData => {
    return badgeService.calculateStreak(completedDates.value);
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

  async function fetchStreaks() {
    try {
      console.log('Fetching streaks from API...')
      const streaksData = await habitsService.getStreaks();
      console.log('Received streaks data:', streaksData)
      streaks.value = streaksData;
      console.log('Updated streaks in store:', streaks.value)
    } catch (err: any) {
      console.error('Error fetching streaks:', err)
      // Don't throw error for streaks, just log it
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
      
      // Trigger badge checking after check-in
      setTimeout(() => {
        checkForBadges();
      }, 100);
      
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

  // Badge checking function
  function checkForBadges() {
    try {
      // Import badge store dynamically to avoid circular dependency
      import('@/stores/badges').then(({ useBadgeStore }) => {
        const badgeStore = useBadgeStore();
        const streak = currentStreak.value;
        const moodDays = 0; // We'll get this from moods store if needed
        const journalDays = 0; // We'll get this from journal store if needed
        
        badgeStore.checkForNewBadges(streak, moodDays, journalDays);
      });
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  }

  // Get streak for a specific habit
  function getHabitStreak(habitId: string): HabitStreak | null {
    return streaks.value.find(streak => streak.habitId === habitId) || null;
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
    completedDates,
    streakData,
    currentStreak,
    longestStreak,
    
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
