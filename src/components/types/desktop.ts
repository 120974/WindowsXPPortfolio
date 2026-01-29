export interface WindowsXPDesktopProps {
  onTurnOff: () => void;
  isDarkMode: boolean;
  onSetUnlockAchievementCallback?: (callback: (achievementId: string) => void) => void;
  onUnlockAchievement?: (achievementId: string) => void;
  onStartGlitchTransition?: () => void;
}

export interface Window {
  id: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface DesktopIcon {
  id: string;
  title: string;
  type: 'about' | 'portfolio' | 'system' | 'achievements' | 'game';
  category?: string;
  x: number;
  y: number;
  isSystemApp?: boolean;
}

export interface RecycledProgram {
  id: string;
  title: string;
  type: 'about' | 'achievements' | 'art' | 'game';
  deletedAt: Date;
}