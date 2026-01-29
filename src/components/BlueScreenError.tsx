import { useState, useEffect } from 'react';

interface BlueScreenErrorProps {
  onEscape: () => void;
  onVictoryDarkMode: () => void;
  onVictoryLightMode: () => void;
  onUnlockAchievement?: (achievementId: string) => void;
}

export default function BlueScreenError({ 
  onEscape, 
  onVictoryDarkMode, 
  onVictoryLightMode,
  onUnlockAchievement
}: BlueScreenErrorProps) {
  const [showCursor, setShowCursor] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Unlock blue screen achievement when component mounts
  useEffect(() => {
    if (onUnlockAchievement) {
      onUnlockAchievement('blue_screen_master');
    }
  }, [onUnlockAchievement]);

  // Track scrolling for technical support achievement
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.scrollTop > 50 && !hasScrolled) {
        setHasScrolled(true);
        if (onUnlockAchievement) {
          onUnlockAchievement('technical_support');
        }
      }
    };

    const container = document.querySelector('.bsod-container');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [hasScrolled, onUnlockAchievement]);

  // Auto-show options after countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowOptions(true);
    }
  }, [countdown]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        onEscape();
      }
      
      // Any key press shows options early
      if (!showOptions && countdown > 0) {
        setShowOptions(true);
        setCountdown(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, showOptions, countdown]);

  const handleOptionSelect = (option: string) => {
    switch (option) {
      case 'dark':
        // Unlock Safe Mode achievement
        if (onUnlockAchievement) {
          onUnlockAchievement('system_recovery_dark');
        }
        onVictoryDarkMode();
        break;
      case 'light':
        // Unlock System Restore achievement
        if (onUnlockAchievement) {
          onUnlockAchievement('system_restoration');
        }
        onVictoryLightMode();
        break;
      case 'desktop':
        onEscape();
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-blue-800 text-white font-mono z-50 overflow-hidden">
      {/* Blue screen background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
        }} />
      </div>

      {/* Content container with conditional scrolling */}
      <div className={`bsod-container relative z-10 h-full flex flex-col justify-center ${showOptions ? 'overflow-auto' : 'overflow-hidden'}`}>
        <div className="max-w-4xl mx-auto p-8 text-center">
          {/* Error Header */}
          <div className="mb-6">
            <div className="text-6xl font-bold mb-4 tracking-wider">:(</div>
            <div className="text-2xl mb-4 tracking-wide">
              Your PC ran into a problem and needs to restart.
            </div>
          </div>

          {/* Error Details - Condensed */}
          <div className="text-left mb-6 bg-blue-900 bg-opacity-50 p-4 rounded border border-blue-600">
            <div className="mb-3">
              <span className="text-white font-bold">PORTFOLIO_NOT_FOUND</span>
            </div>
            
            <div className="text-sm leading-relaxed">
              <div>*** STOP: 0x00000404 (0xC0FFEE00, 0xDEADBEEF, 0x1337C0DE, 0xBADCAFE)</div>
              <div className="mt-3">
                <div>Error Details:</div>
                <div className="ml-4 mt-1 space-y-0.5">
                  <div>• Portfolio system encountered an unexpected shutdown</div>
                  <div>• Creative process buffer overflow detected</div>
                  <div>• Inspiration.exe has stopped responding</div>
                  <div>• Memory dump: 404 projects not found in current directory</div>
                </div>
              </div>
            </div>
          </div>

          {/* System Information - Condensed */}
          <div className="text-left mb-6 text-sm bg-blue-900 bg-opacity-30 p-3 rounded border border-blue-600">
            <div>System Information:</div>
            <div className="ml-4 space-y-0.5">
              <div>Windows XP Professional (Build 2600.xpsp3_gdr.121217-1234)</div>
              <div>Intel(R) Pentium(R) 4 CPU 3.00GHz | 1024 MB RAM | NVIDIA GeForce FX 5200</div>
              <div>Error occurred at: {new Date().toLocaleString()}</div>
            </div>
          </div>

          {/* Recovery Options */}
          {!showOptions ? (
            <div className="text-center">
              <div className="text-lg mb-4">
                Collecting error information... {Math.max(0, countdown * 10)}%
              </div>
              <div className="text-sm text-blue-200">
                We'll automatically show recovery options in {countdown} seconds
              </div>
              <div className="text-xs text-blue-300 mt-2">
                (Press any key to continue now)
              </div>
              <div className="inline-block w-3 h-6 bg-white ml-1" style={{
                opacity: showCursor ? 1 : 0,
                transition: 'opacity 0.1s'
              }} />
            </div>
          ) : (
            <div className="text-center">
              <div className="text-lg mb-6 text-yellow-300">
                ⚠️ Recovery Options Available
              </div>
              
              <div className="space-y-4 max-w-2xl mx-auto">
                <button 
                  onClick={() => handleOptionSelect('dark')}
                  className="w-full bg-blue-700 hover:bg-blue-600 border border-blue-500 text-white px-6 py-4 rounded text-left transition-colors"
                >
                  <div className="font-bold">🌙 Enable Safe Mode (Dark Theme)</div>
                  <div className="text-sm text-blue-200 mt-1">
                    Start Windows XP with minimal drivers and dark theme enabled
                  </div>
                </button>
                
                <button 
                  onClick={() => handleOptionSelect('light')}
                  className="w-full bg-blue-700 hover:bg-blue-600 border border-blue-500 text-white px-6 py-4 rounded text-left transition-colors"
                >
                  <div className="font-bold">☀️ Last Known Good Configuration</div>
                  <div className="text-sm text-blue-200 mt-1">
                    Restore previous working state with light theme
                  </div>
                </button>
                
                <button 
                  onClick={() => handleOptionSelect('desktop')}
                  className="w-full bg-blue-700 hover:bg-blue-600 border border-blue-500 text-white px-6 py-4 rounded text-left transition-colors"
                >
                  <div className="font-bold">🏠 Restart Computer</div>
                  <div className="text-sm text-blue-200 mt-1">
                    Return to Windows XP desktop and try again
                  </div>
                </button>
              </div>
              
              <div className="text-xs text-blue-300 mt-6">
                Use arrow keys and Enter to select, or click with mouse
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}