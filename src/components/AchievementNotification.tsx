import React, { useState, useEffect } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  points: number;
  isSpecial?: boolean;
}

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export default function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to prevent stuttering
    requestAnimationFrame(() => {
      // Animate in
      setTimeout(() => setIsVisible(true), 100);
      
      // Auto-close after longer time for special achievements
      const closeDelay = achievement.isSpecial ? 8000 : 4000;
      const timer = setTimeout(() => {
        handleClose();
      }, closeDelay);

      return () => clearTimeout(timer);
    });
  }, [achievement.isSpecial]);

  const handleClose = () => {
    // Use requestAnimationFrame to prevent stuttering
    requestAnimationFrame(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300);
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return { bg: '#666666', border: '#444444' };
      case 'Uncommon': return { bg: '#00AA00', border: '#008800' };
      case 'Rare': return { bg: '#0066CC', border: '#004499' };
      case 'Epic': return { bg: '#AA00AA', border: '#880088' };
      case 'Legendary': return { bg: '#FF6600', border: '#CC5500' };
      default: return { bg: '#666666', border: '#444444' };
    }
  };

  const colors = getRarityColor(achievement.rarity);
  const isXPMaster = achievement.id === 'xp_master';

  return (
    <div 
      className={`fixed top-4 right-4 transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
      }`} 
      style={{ 
        zIndex: 10000,
        willChange: 'transform, opacity', // Optimize for animations
        backfaceVisibility: 'hidden' // Prevent flickering
      }}
    >
      <div 
        className={`border-2 rounded-lg shadow-2xl p-4 min-w-[300px] max-w-[400px] ${
          isXPMaster ? 'animate-pulse' : ''
        }`}
        style={{ 
          background: isXPMaster 
            ? 'linear-gradient(145deg, #fff9e6 0%, #ffe066 20%, #ffcc00 50%, #ffe066 80%, #fff9e6 100%)'
            : 'linear-gradient(145deg, #f8f8f8 0%, #e8e8e8 100%)',
          borderColor: isXPMaster ? '#cc9900' : colors.border,
          borderWidth: isXPMaster ? '3px' : '2px',
          fontFamily: 'Tahoma, sans-serif',
          boxShadow: isXPMaster 
            ? '0 0 20px rgba(255, 204, 0, 0.5), 0 8px 32px rgba(0, 0, 0, 0.3)'
            : undefined
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div 
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isXPMaster ? 'animate-bounce' : 'animate-pulse'
              }`}
              style={{ backgroundColor: isXPMaster ? '#cc9900' : colors.bg }}
            >
              <span className="text-white text-sm font-bold">
                {isXPMaster ? '👑' : '!'}
              </span>
            </div>
            <span 
              className={`font-bold text-sm ${isXPMaster ? 'animate-pulse' : ''}`} 
              style={{ color: isXPMaster ? '#cc9900' : colors.bg }}
            >
              {isXPMaster ? 'PORTFOLIO MASTER!' : 'ACHIEVEMENT UNLOCKED!'}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="w-5 h-5 flex items-center justify-center hover:bg-gray-300 rounded transition-colors"
            style={{ fontSize: '10px' }}
          >
            ×
          </button>
        </div>

        {/* Achievement Details */}
        <div className="flex items-start space-x-3">
          <div 
            className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center ${
              isXPMaster ? 'animate-spin' : 'animate-bounce'
            }`}
            style={{ 
              backgroundColor: isXPMaster ? '#ffcc00' : colors.bg,
              borderColor: isXPMaster ? '#cc9900' : colors.border,
              animation: isXPMaster ? 'spin 3s linear infinite' : undefined
            }}
          >
            <span className={`text-2xl filter drop-shadow ${
              isXPMaster ? 'animate-pulse' : ''
            }`}>{achievement.icon}</span>
          </div>
          <div className="flex-1">
            <h3 
              className={`font-bold text-sm mb-1 ${isXPMaster ? 'animate-pulse' : ''}`} 
              style={{ color: isXPMaster ? '#cc9900' : '#003c71' }}
            >
              {achievement.title}
            </h3>
            <p className={`text-xs leading-relaxed mb-2 ${
              isXPMaster ? 'text-orange-800' : 'text-gray-700'
            }`}>
              {achievement.description}
            </p>
            {isXPMaster && (
              <div className="mb-2 p-2 rounded" style={{ backgroundColor: 'rgba(255, 204, 0, 0.2)' }}>
                <p className="text-xs font-semibold text-orange-900 text-center animate-pulse">
                  🎉 Thank you for exploring every corner of this portfolio! 🎉
                </p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span 
                className="text-xs px-2 py-1 border rounded"
                style={{ 
                  backgroundColor: isXPMaster ? 'rgba(255, 204, 0, 0.3)' : 'white',
                  borderColor: isXPMaster ? '#cc9900' : colors.bg,
                  color: isXPMaster ? '#cc9900' : colors.bg,
                  fontWeight: 'bold'
                }}
              >
                {achievement.rarity}
              </span>
              <span 
                className={`text-sm font-bold ${isXPMaster ? 'animate-pulse' : ''}`} 
                style={{ color: isXPMaster ? '#cc9900' : '#0066CC' }}
              >
                +{achievement.points} pts
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar Animation */}
        <div className="mt-3 w-full bg-gray-300 rounded-full h-1 overflow-hidden">
          <div 
            className="h-full rounded-full transition-transform duration-2000 ease-out transform scale-x-0 origin-left"
            style={{ 
              backgroundColor: isXPMaster ? '#ffcc00' : colors.bg,
              animation: 'scaleX 2s ease-out forwards'
            }}
          />
        </div>

        {/* Enhanced Sparkle Effects for XP Master */}
        {isXPMaster ? (
          <>
            {/* Multiple sparkles for special achievement */}
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-2 h-2"
                style={{
                  top: `${10 + i * 15}%`,
                  right: `${5 + (i % 3) * 10}%`,
                }}
              >
                <div 
                  className="w-2 h-2 animate-ping rounded-full opacity-75"
                  style={{ 
                    backgroundColor: '#ffcc00',
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '1.5s'
                  }}
                />
              </div>
            ))}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="text-xs animate-bounce">✨</div>
            </div>
          </>
        ) : (
          <>
            {/* Standard sparkle effects */}
            <div className="absolute -top-1 -right-1 w-3 h-3">
              <div 
                className="w-3 h-3 animate-ping rounded-full opacity-75"
                style={{ backgroundColor: colors.bg }}
              />
            </div>
            <div className="absolute -bottom-1 -left-1 w-2 h-2">
              <div 
                className="w-2 h-2 animate-ping rounded-full opacity-60"
                style={{ 
                  backgroundColor: colors.bg,
                  animationDelay: '0.5s'
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Add the scaleX keyframe animation to the CSS if it doesn't exist
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes scaleX {
      from {
        transform: scaleX(0);
      }
      to {
        transform: scaleX(1);
      }
    }
  `;
  
  // Check if the keyframe already exists
  const existingStyles = Array.from(document.styleSheets).some(sheet => {
    try {
      const rules = Array.from(sheet.cssRules || []);
      return rules.some(rule => rule.type === CSSRule.KEYFRAMES_RULE && (rule as CSSKeyframesRule).name === 'scaleX');
    } catch {
      return false;
    }
  });
  
  if (!existingStyles) {
    document.head.appendChild(style);
  }
}