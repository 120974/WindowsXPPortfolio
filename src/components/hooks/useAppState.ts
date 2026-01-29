import { useState, useEffect } from 'react';
import { AppState, AppHandlers } from '../types/app';
import { INITIAL_STATE, APP_TIMING } from '../constants/appConfig';

export function useAppState(unlockAchievement: (id: string) => void): AppState & AppHandlers {
  const [showWelcome, setShowWelcome] = useState(INITIAL_STATE.showWelcome);
  const [showWelcomePopup, setShowWelcomePopup] = useState(INITIAL_STATE.showWelcomePopup);
  const [showPortfolioDetail, setShowPortfolioDetail] = useState(INITIAL_STATE.showPortfolioDetail);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(INITIAL_STATE.selectedPortfolioId);
  const [isDarkMode, setIsDarkMode] = useState(INITIAL_STATE.isDarkMode);
  const [unlockAchievementCallback, setUnlockAchievementCallback] = useState<((id: string) => void) | null>(INITIAL_STATE.unlockAchievementCallback);
  const [currentNotification, setCurrentNotification] = useState<any>(INITIAL_STATE.currentNotification);
  const [showGlitchTransition, setShowGlitchTransition] = useState(false);
  const [showBlueScreen, setShowBlueScreen] = useState(false);

  // Apply dark class to document when in dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle portfolio detail navigation
  useEffect(() => {
    const handlePortfolioDetailNavigation = (event: CustomEvent) => {
      const { portfolioId } = event.detail;
      setSelectedPortfolioId(portfolioId);
    };

    window.addEventListener('openPortfolioDetail', handlePortfolioDetailNavigation as EventListener);
    
    return () => {
      window.removeEventListener('openPortfolioDetail', handlePortfolioDetailNavigation as EventListener);
    };
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    // Show welcome popup after a brief delay for better UX
    setTimeout(() => {
      setShowWelcomePopup(true);
    }, APP_TIMING.welcomePopupDelay);
  };

  const handleWelcomePopupClose = () => {
    setShowWelcomePopup(false);
  };

  const handleOpenPortfolioDetail = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId);
    setShowPortfolioDetail(true);
    // Achievement unlocked by PortfolioDetailView when using fullscreen
  };

  const handleClosePortfolioDetail = () => {
    setShowPortfolioDetail(false);
    setSelectedPortfolioId(null);
  };

  const handleTurnOff = () => {
    // Simple dark mode toggle without achievement unlocking
    setIsDarkMode(!isDarkMode);
    setShowWelcome(true);
    setShowWelcomePopup(false);
    setShowPortfolioDetail(false);
    setSelectedPortfolioId(null);
  };

  const handleStartGlitchTransition = () => {
    setShowGlitchTransition(true);
  };

  const handleGlitchTransitionComplete = () => {
    setShowGlitchTransition(false);
    setShowBlueScreen(true);
    // Achievement will be unlocked by BlueScreenError component
  };

  const handleEscapeBlueScreen = () => {
    setShowBlueScreen(false);
    // Reset to welcome screen
    setShowWelcome(true);
    setIsDarkMode(false);
    setShowWelcomePopup(false);
    setShowPortfolioDetail(false);
    setSelectedPortfolioId(null);
  };

  const handleBlueScreenVictoryDarkMode = () => {
    setShowBlueScreen(false);
    setIsDarkMode(true);
    setShowWelcome(true);
    setShowWelcomePopup(false);
    setShowPortfolioDetail(false);
    setSelectedPortfolioId(null);
    // Achievement unlocked by BlueScreenError component
  };

  const handleBlueScreenVictoryLightMode = () => {
    setShowBlueScreen(false);
    setIsDarkMode(false);
    setShowWelcome(true);
    setShowWelcomePopup(false);
    setShowPortfolioDetail(false);
    setSelectedPortfolioId(null);
    // Achievement unlocked by BlueScreenError component
  };



  return {
    // State
    showWelcome,
    showWelcomePopup,
    showPortfolioDetail,
    selectedPortfolioId,
    isDarkMode,
    unlockAchievementCallback,
    currentNotification,
    showGlitchTransition,
    showBlueScreen,
    // Handlers
    handleWelcomeComplete,
    handleWelcomePopupClose,
    handleOpenPortfolioDetail,
    handleClosePortfolioDetail,
    handleTurnOff,
    handleStartGlitchTransition,
    handleGlitchTransitionComplete,
    handleEscapeBlueScreen,
    handleBlueScreenVictoryDarkMode,
    handleBlueScreenVictoryLightMode,
  };
}