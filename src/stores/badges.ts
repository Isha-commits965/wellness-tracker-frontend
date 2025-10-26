import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { badgeService } from '@/services/badges';
import type { Badge, StreakData } from '@/types';

export const useBadgeStore = defineStore('badges', () => {
  // State
  const badges = ref<Badge[]>([]);
  const newBadge = ref<Badge | null>(null);
  const showBadgePopup = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const unlockedBadges = computed(() => 
    badges.value.filter(badge => badge.unlocked)
  );

  const lockedBadges = computed(() => 
    badges.value.filter(badge => !badge.unlocked)
  );

  const badgesByCategory = computed(() => {
    const categories = {
      streak: badges.value.filter(b => b.category === 'streak'),
      mood: badges.value.filter(b => b.category === 'mood'),
      journal: badges.value.filter(b => b.category === 'journal'),
      habits: badges.value.filter(b => b.category === 'habits')
    };
    return categories;
  });

  const totalBadges = computed(() => badges.value.length);
  const unlockedCount = computed(() => unlockedBadges.value.length);
  const completionRate = computed(() => 
    totalBadges.value > 0 ? Math.round((unlockedCount.value / totalBadges.value) * 100) : 0
  );

  // Actions
  async function loadBadges() {
    try {
      isLoading.value = true;
      error.value = null;
      badges.value = badgeService.getAllBadges();
    } catch (err: any) {
      error.value = err.message || 'Failed to load badges';
      console.error('Error loading badges:', err);
    } finally {
      isLoading.value = false;
    }
  }

  function checkForNewBadges(streak: number, moodDays: number, journalDays: number) {
    try {
      const newBadges = badgeService.checkNewBadges(streak, moodDays, journalDays);
      
      if (newBadges.length > 0) {
        // Show the first new badge
        newBadge.value = newBadges[0];
        showBadgePopup.value = true;
        
        // Reload badges to update the store
        loadBadges();
        
        return newBadges;
      }
      
      return [];
    } catch (err: any) {
      error.value = err.message || 'Failed to check for new badges';
      console.error('Error checking badges:', err);
      return [];
    }
  }

  function closeBadgePopup() {
    showBadgePopup.value = false;
    newBadge.value = null;
  }

  function viewAllBadges() {
    showBadgePopup.value = false;
    // Navigate to badges page or show all badges modal
    console.log('Navigate to all badges view');
  }

  function getBadgeById(id: string): Badge | undefined {
    return badges.value.find(badge => badge.id === id);
  }

  function getUnlockedBadgeById(id: string): Badge | undefined {
    return unlockedBadges.value.find(badge => badge.id === id);
  }

  function clearAllBadges() {
    badgeService.clearAllBadges();
    loadBadges();
  }

  function unlockBadge(badge: Badge) {
    badgeService.unlockBadge(badge);
    loadBadges();
  }

  function clearError() {
    error.value = null;
  }

  return {
    // State
    badges,
    newBadge,
    showBadgePopup,
    isLoading,
    error,
    
    // Getters
    unlockedBadges,
    lockedBadges,
    badgesByCategory,
    totalBadges,
    unlockedCount,
    completionRate,
    
    // Actions
    loadBadges,
    checkForNewBadges,
    closeBadgePopup,
    viewAllBadges,
    getBadgeById,
    getUnlockedBadgeById,
    clearAllBadges,
    unlockBadge,
    clearError
  };
});
