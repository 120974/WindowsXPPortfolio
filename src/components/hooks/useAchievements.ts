import { useState, useCallback } from 'react';
import { ACHIEVEMENT_DEFINITIONS } from '../constants/achievements';
import { AchievementHandlers } from '../types/app';

export function useAchievements(): AchievementHandlers {
  const [unlockAchievementCallback, setUnlockAchievementCallback] = useState<((id: string) => void) | null>(null);
  const [currentNotification, setCurrentNotification] = useState<any>(null);

  const unlockAchievement = useCallback((achievementId: string) => {
    const achievement = ACHIEVEMENT_DEFINITIONS.find(a => a.id === achievementId);
    if (achievement) {
      // Use requestAnimationFrame to prevent stuttering
      requestAnimationFrame(() => {
        setCurrentNotification(achievement);
        
        // Always call the desktop callback to update the achievement list
        if (unlockAchievementCallback) {
          unlockAchievementCallback(achievementId);
        }
      });
    }
  }, [unlockAchievementCallback]);

  return {
    unlockAchievement,
    setCurrentNotification,
    setUnlockAchievementCallback,
  };
}