import type { Badge, Achievement, StreakData } from '@/types';

// Badge definitions
export const BADGE_DEFINITIONS: Omit<Badge, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'champ-1',
    name: 'Champ',
    description: 'Complete all habits for 1 day!',
    icon: '🏆',
    color: 'text-yellow-500',
    requirement: 1,
    category: 'streak'
  },
  {
    id: 'warrior-3',
    name: 'Warrior',
    description: 'Maintain your streak for 3 days!',
    icon: '⚔️',
    color: 'text-orange-500',
    requirement: 3,
    category: 'streak'
  },
  {
    id: 'champion-7',
    name: 'Champion',
    description: 'Amazing! 7 days of consistency!',
    icon: '👑',
    color: 'text-purple-500',
    requirement: 7,
    category: 'streak'
  },
  {
    id: 'legend-14',
    name: 'Legend',
    description: 'Incredible! 14 days of dedication!',
    icon: '🌟',
    color: 'text-pink-500',
    requirement: 14,
    category: 'streak'
  },
  {
    id: 'master-30',
    name: 'Master',
    description: 'Unstoppable! 30 days of excellence!',
    icon: '💎',
    color: 'text-blue-500',
    requirement: 30,
    category: 'streak'
  },
  {
    id: 'zen-master',
    name: 'Zen Master',
    description: 'Perfect mood tracking for 7 days!',
    icon: '🧘',
    color: 'text-green-500',
    requirement: 7,
    category: 'mood'
  },
  {
    id: 'journal-keeper',
    name: 'Journal Keeper',
    description: 'Write in your journal for 5 days!',
    icon: '📝',
    color: 'text-indigo-500',
    requirement: 5,
    category: 'journal'
  }
];

export const badgeService = {
  // Calculate current streak based on completed habits
  calculateStreak(completedDates: string[]): StreakData {
    if (completedDates.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        completedDates: []
      };
    }

    // Sort dates in descending order (most recent first)
    const sortedDates = completedDates
      .map(date => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1; // Start with 1 for the first date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if today is completed
    const todayStr = today.toISOString().split('T')[0];
    const hasToday = completedDates.includes(todayStr);
    
    // Calculate current streak starting from today or most recent date
    if (hasToday) {
      currentStreak = 1;
      // Count consecutive days backwards from today
      for (let i = 1; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const checkDateStr = checkDate.toISOString().split('T')[0];
        
        if (completedDates.includes(checkDateStr)) {
          currentStreak++;
        } else {
          break;
        }
      }
    } else {
      // If today is not completed, check if yesterday was completed
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (completedDates.includes(yesterdayStr)) {
        // If yesterday was completed, count backwards from yesterday
        currentStreak = 1;
        for (let i = 2; i < 365; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() - i);
          const checkDateStr = checkDate.toISOString().split('T')[0];
          
          if (completedDates.includes(checkDateStr)) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
      // If neither today nor yesterday was completed, current streak is 0
    }

    // Calculate longest streak
    tempStreak = 1;
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const currentDate = new Date(sortedDates[i]);
      const nextDate = new Date(sortedDates[i + 1]);
      
      const diffTime = currentDate.getTime() - nextDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      currentStreak,
      longestStreak,
      lastCompletedDate: sortedDates[0]?.toISOString().split('T')[0],
      completedDates: completedDates.sort()
    };
  },

  // Check for new badge achievements
  checkNewBadges(streak: number, moodDays: number, journalDays: number): Badge[] {
    console.log('Checking badges with:', { streak, moodDays, journalDays });
    const newBadges: Badge[] = [];
    const unlockedBadges = this.getUnlockedBadges();
    console.log('Currently unlocked badges:', unlockedBadges.map(b => b.id));

    for (const badgeDef of BADGE_DEFINITIONS) {
      const isAlreadyUnlocked = unlockedBadges.some(badge => badge.id === badgeDef.id);
      
      if (isAlreadyUnlocked) {
        console.log(`Badge ${badgeDef.id} already unlocked, skipping`);
        continue;
      }

      let shouldUnlock = false;
      
      switch (badgeDef.category) {
        case 'streak':
          shouldUnlock = streak >= badgeDef.requirement;
          console.log(`Streak badge ${badgeDef.id}: ${streak} >= ${badgeDef.requirement} = ${shouldUnlock}`);
          break;
        case 'mood':
          shouldUnlock = moodDays >= badgeDef.requirement;
          console.log(`Mood badge ${badgeDef.id}: ${moodDays} >= ${badgeDef.requirement} = ${shouldUnlock}`);
          break;
        case 'journal':
          shouldUnlock = journalDays >= badgeDef.requirement;
          console.log(`Journal badge ${badgeDef.id}: ${journalDays} >= ${badgeDef.requirement} = ${shouldUnlock}`);
          break;
      }

      if (shouldUnlock) {
        console.log(`Unlocking badge: ${badgeDef.name}`);
        const newBadge: Badge = {
          ...badgeDef,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
        newBadges.push(newBadge);
        this.unlockBadge(newBadge);
      }
    }

    console.log('New badges unlocked:', newBadges.map(b => b.name));
    return newBadges;
  },

  // Get all unlocked badges
  getUnlockedBadges(): Badge[] {
    const stored = localStorage.getItem('unlocked_badges');
    if (!stored) return [];
    
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  // Unlock a badge
  unlockBadge(badge: Badge): void {
    const unlockedBadges = this.getUnlockedBadges();
    const existingIndex = unlockedBadges.findIndex(b => b.id === badge.id);
    
    if (existingIndex >= 0) {
      unlockedBadges[existingIndex] = badge;
    } else {
      unlockedBadges.push(badge);
    }
    
    localStorage.setItem('unlocked_badges', JSON.stringify(unlockedBadges));
  },

  // Get badge by ID
  getBadgeById(id: string): Badge | undefined {
    const unlockedBadges = this.getUnlockedBadges();
    return unlockedBadges.find(badge => badge.id === id);
  },

  // Get all available badges (locked and unlocked)
  getAllBadges(): Badge[] {
    const unlockedBadges = this.getUnlockedBadges();
    const unlockedIds = new Set(unlockedBadges.map(b => b.id));
    
    return BADGE_DEFINITIONS.map(badgeDef => {
      const unlocked = unlockedIds.has(badgeDef.id);
      const unlockedBadge = unlockedBadges.find(b => b.id === badgeDef.id);
      
      return {
        ...badgeDef,
        unlocked,
        unlockedAt: unlockedBadge?.unlockedAt
      };
    });
  },

  // Clear all badges (for testing)
  clearAllBadges(): void {
    localStorage.removeItem('unlocked_badges');
  }
};
