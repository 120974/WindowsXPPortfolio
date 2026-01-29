export interface AppState {
  showWelcome: boolean;
  showWelcomePopup: boolean;
  showPortfolioDetail: boolean;
  selectedPortfolioId: string | null;
  isDarkMode: boolean;
  unlockAchievementCallback: ((id: string) => void) | null;
  currentNotification: any;
  showGlitchTransition: boolean;
  showBlueScreen: boolean;
}

export interface AppHandlers {
  handleWelcomeComplete: () => void;
  handleWelcomePopupClose: () => void;
  handleOpenQuickVisit: () => void;
  handleOpenPortfolioDetail: (portfolioId: string) => void;
  handleClosePortfolioDetail: () => void;
  handleTurnOff: () => void;
  handleStartGlitchTransition: () => void;
  handleGlitchTransitionComplete: () => void;
  handleEscapeBlueScreen: () => void;
  handleBlueScreenVictoryDarkMode: () => void;
  handleBlueScreenVictoryLightMode: () => void;
}

export interface AchievementHandlers {
  unlockAchievement: (achievementId: string) => void;
  setCurrentNotification: (notification: any) => void;
  setUnlockAchievementCallback: (callback: ((id: string) => void) | null) => void;
}