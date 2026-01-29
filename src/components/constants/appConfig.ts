export const APP_TIMING = {
  welcomePopupDelay: 500,
} as const;

export const APP_CLASSES = {
  container: 'w-full h-full',
} as const;

export const INITIAL_STATE = {
  showWelcome: true,
  showWelcomePopup: false,
  showPortfolioDetail: false,
  selectedPortfolioId: null,
  isDarkMode: false,
  unlockAchievementCallback: null,
  currentNotification: null,
  showSpotlight: false,
} as const;