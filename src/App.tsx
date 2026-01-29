import { ErrorBoundary } from './components/ErrorBoundary';
import WelcomeScreen from './components/WelcomeScreen';
import WindowsXPDesktop from './components/WindowsXPDesktop';
import WelcomePopup from './components/WelcomePopup';
import AchievementNotification from './components/AchievementNotification';
import PortfolioDetailView from './components/PortfolioDetailView';
import GlitchTransition from './components/GlitchTransition';
import BlueScreenError from './components/BlueScreenError';
import CondensedPortfolio from './components/CondensedPortfolio';
import { useAchievements } from './components/hooks/useAchievements';
import { useAppState } from './components/hooks/useAppState';
import { APP_CLASSES } from './components/constants/appConfig';
import { useState } from 'react';

export default function App() {
  const [portfolioVersion, setPortfolioVersion] = useState<'full' | 'condensed' | null>(null);

  const { 
    unlockAchievement, 
    setCurrentNotification, 
    setUnlockAchievementCallback 
  } = useAchievements();

  const {
    // State
    showWelcome,
    showWelcomePopup,
    showPortfolioDetail,
    selectedPortfolioId,
    isDarkMode,
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
  } = useAppState(unlockAchievement);

  const handleVersionChoice = (version: 'full' | 'condensed') => {
    setPortfolioVersion(version);
    handleWelcomeComplete();
  };

  return (
    <ErrorBoundary>
      <div 
        className={portfolioVersion === 'condensed' ? 'w-full h-full' : APP_CLASSES.container}
        style={portfolioVersion === 'condensed' ? { overflow: 'visible' } : undefined}
      >
        {showBlueScreen ? (
          <BlueScreenError 
            onEscape={handleEscapeBlueScreen} 
            onVictoryDarkMode={handleBlueScreenVictoryDarkMode}
            onVictoryLightMode={handleBlueScreenVictoryLightMode}
            onUnlockAchievement={unlockAchievement}
          />
        ) : showWelcome ? (
          <WelcomeScreen 
            onComplete={handleVersionChoice} 
            isDarkMode={isDarkMode} 
            onUnlockAchievement={unlockAchievement}
          />
        ) : portfolioVersion === 'condensed' ? (
          <CondensedPortfolio isDarkMode={isDarkMode} />
        ) : (
          <>
            <WindowsXPDesktop 
              onTurnOff={handleTurnOff} 
              isDarkMode={isDarkMode} 
              onSetUnlockAchievementCallback={setUnlockAchievementCallback}
              onUnlockAchievement={unlockAchievement}
              onStartGlitchTransition={handleStartGlitchTransition}
            />
            {showWelcomePopup && (
              <WelcomePopup 
                onClose={handleWelcomePopupClose} 
                isDarkMode={isDarkMode} 
              />
            )}
          </>
        )}
        
        {/* Glitch Transition */}
        {showGlitchTransition && (
          <GlitchTransition onComplete={handleGlitchTransitionComplete} />
        )}
        
        {/* Portfolio Detail View - Only for full version */}
        {portfolioVersion === 'full' && (
          <PortfolioDetailView 
            isOpen={showPortfolioDetail && !showBlueScreen}
            onClose={handleClosePortfolioDetail}
            portfolioId={selectedPortfolioId}
            isDarkMode={isDarkMode}
            onUnlockAchievement={unlockAchievement}
          />
        )}
        
        {/* Global Achievement Notification - Only for full version */}
        {portfolioVersion === 'full' && currentNotification && !showBlueScreen && (
          <AchievementNotification
            achievement={currentNotification}
            onClose={() => setCurrentNotification(null)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}