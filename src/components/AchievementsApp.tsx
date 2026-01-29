import React, { useState, useEffect, useMemo } from 'react';
import { 
  ACHIEVEMENT_DEFINITIONS, 
  ACHIEVEMENT_CATEGORIES, 
  RARITY_COLORS,
  getTotalPossiblePoints,
  calculateCompletionPercentage,
  type Achievement 
} from './constants/achievements';

interface AchievementsAppProps {
  unlockedAchievements: string[];
}

interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  unlockedAt?: Date;
}

export default function AchievementsApp({ unlockedAchievements }: AchievementsAppProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showGuide, setShowGuide] = useState(false);

  // Memoize achievements with unlock status
  const achievements = useMemo((): AchievementWithStatus[] => {
    return ACHIEVEMENT_DEFINITIONS.map(achievement => ({
      ...achievement,
      unlocked: unlockedAchievements.includes(achievement.id),
      unlockedAt: unlockedAchievements.includes(achievement.id) ? new Date() : undefined
    }));
  }, [unlockedAchievements]);

  // Calculate stats
  const totalPoints = useMemo(() => {
    return achievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.points, 0);
  }, [achievements]);

  const totalPossiblePoints = getTotalPossiblePoints();
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = calculateCompletionPercentage(unlockedAchievements);

  // Get available categories
  const categories = ['All', ...Object.keys(ACHIEVEMENT_CATEGORIES)];
  
  // Filter achievements by category
  const filteredAchievements = useMemo(() => {
    if (selectedCategory === 'All') return achievements;
    return achievements.filter(a => a.category === selectedCategory);
  }, [selectedCategory, achievements]);

  return (
    <div className="h-full flex flex-col bg-[#ECE9D8] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b-2 border-[#316AC5] bg-gradient-to-b from-[#0054E3] to-[#0040B5]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🏆</div>
            <div>
              <h2 className="text-white font-bold text-lg">Achievement Center</h2>
              <p className="text-white/90 text-xs">Track Your Portfolio Exploration</p>
            </div>
          </div>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded border border-white/30 text-xs transition-colors"
          >
            {showGuide ? '📊 Stats' : '💡 Hints'}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3 bg-white/20 rounded-full h-6 overflow-hidden border border-white/30">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 flex items-center justify-center"
            style={{ width: `${completionPercentage}%` }}
          >
            {completionPercentage > 10 && (
              <span className="text-xs font-bold text-white drop-shadow">
                {completionPercentage}%
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-2 flex gap-4 text-white/90 text-xs">
          <span>🎯 {unlockedCount}/{totalCount} Unlocked</span>
          <span>⭐ {totalPoints.toLocaleString()}/{totalPossiblePoints.toLocaleString()} Points</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 p-2 bg-[#D4D0C8] border-b border-[#ACA899] overflow-x-auto">
        {categories.map(category => {
          const categoryInfo = category === 'All' 
            ? { icon: '🎯', color: '#316AC5' } 
            : ACHIEVEMENT_CATEGORIES[category as keyof typeof ACHIEVEMENT_CATEGORIES];
          
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === category
                  ? 'bg-white shadow-[inset_-1px_-1px_0_#808080,inset_1px_1px_0_#fff]'
                  : 'bg-[#ECE9D8] shadow-[inset_-1px_-1px_0_#000,inset_1px_1px_0_#fff] hover:bg-[#F5F1E7]'
              }`}
              style={{ 
                color: selectedCategory === category ? categoryInfo.color : '#000',
                borderColor: selectedCategory === category ? categoryInfo.color : 'transparent'
              }}
            >
              <span>{categoryInfo.icon}</span>
              <span>{category}</span>
              <span className="text-[10px] opacity-70">
                ({filteredAchievements.filter(a => a.unlocked).length}/{filteredAchievements.length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto xp-scrollbar">
        {showGuide ? (
          // Hints/Guide View
          <div className="p-4 space-y-3">
            <div className="bg-[#FFFFCC] border-2 border-[#FFD700] rounded p-3 mb-4">
              <div className="flex items-start gap-2">
                <span className="text-2xl">💡</span>
                <div>
                  <h3 className="font-bold text-sm mb-1">Achievement Hints</h3>
                  <p className="text-xs text-gray-700">
                    Explore the portfolio to discover hidden achievements! Here are some hints to help you on your journey.
                  </p>
                </div>
              </div>
            </div>

            {filteredAchievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-3 rounded border-2 ${
                  achievement.unlocked
                    ? 'bg-green-50 border-green-500'
                    : 'bg-white border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl opacity-60">{achievement.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm">{achievement.title}</h4>
                      {achievement.unlocked && <span className="text-xs text-green-600">✓ Unlocked</span>}
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 mb-1">{achievement.description}</p>
                    {achievement.hint && (
                      <p className="text-xs text-gray-500 italic">
                        💡 {achievement.hint}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Achievement Grid View
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-white to-gray-50 border-gray-400 shadow-md'
                      : 'bg-gray-100 border-gray-300 opacity-60'
                  }`}
                  style={{
                    borderColor: achievement.unlocked 
                      ? RARITY_COLORS[achievement.rarity] 
                      : undefined
                  }}
                >
                  {/* Rarity Badge */}
                  <div 
                    className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold text-white"
                    style={{ backgroundColor: RARITY_COLORS[achievement.rarity] }}
                  >
                    {achievement.rarity}
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`text-4xl ${!achievement.unlocked && 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm mb-1">{achievement.title}</h3>
                      <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold" style={{ 
                          color: RARITY_COLORS[achievement.rarity] 
                        }}>
                          +{achievement.points} XP
                        </span>
                        
                        {achievement.unlocked && achievement.category && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                            {ACHIEVEMENT_CATEGORIES[achievement.category]?.icon} {achievement.category}
                          </span>
                        )}
                      </div>

                      {achievement.unlocked && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <span className="text-[10px] text-green-600 font-medium">
                            ✓ Unlocked!
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAchievements.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-2">🏆</div>
                <p className="text-sm">No achievements in this category yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t-2 border-[#ACA899] bg-[#D4D0C8] text-xs text-gray-700">
        <div className="flex items-center justify-between">
          <span>💫 Keep exploring to unlock all {totalCount} achievements!</span>
          <span className="font-mono">{completionPercentage}% Complete</span>
        </div>
      </div>
    </div>
  );
}
