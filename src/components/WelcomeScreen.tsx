import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface WelcomeScreenProps {
  onComplete: (version: 'full' | 'condensed') => void;
  isDarkMode?: boolean;
  onUnlockAchievement?: (id: string) => void;
}



export default function WelcomeScreen({ onComplete, isDarkMode = false, onUnlockAchievement }: WelcomeScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Starting Portfolio...');
  const [isExiting, setIsExiting] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<'full' | 'condensed' | null>(null);

  const handleVersionChoice = (version: 'full' | 'condensed') => {
    setIsExiting(true);
    // Wait for enhanced fade animation to complete before calling onComplete
    setTimeout(() => {
      onComplete(version);
    }, 1200);
  };

  useEffect(() => {
    const messages = isDarkMode ? [
      'Starting Portfolio (Dark Mode)...',
      'Loading dark theme...',
      'Initializing desktop...',
      'Welcome'
    ] : [
      'Starting Portfolio...',
      'Loading portfolio files...',
      'Initializing desktop...',
      'Welcome'
    ];

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1.5; // Changed from 2.5 to 1.5 to make it take ~4 seconds
        
        // Update loading text based on progress
        if (newProgress < 25) {
          setLoadingText(messages[0]);
        } else if (newProgress < 50) {
          setLoadingText(messages[1]);
        } else if (newProgress < 75) {
          setLoadingText(messages[2]);
        } else if (newProgress < 100) {
          setLoadingText(messages[3]);
        }

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowPrompt(true), 1000);
          return 100;
        }
        return newProgress;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete, isDarkMode]);

  // Different gradient for modes
  const backgroundGradient = isDarkMode 
    ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
    : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%)';

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center"
      style={{
        background: backgroundGradient,
        fontFamily: 'Tahoma, sans-serif'
      }}
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: isExiting ? 0 : 1,
        scale: isExiting ? 0.95 : 1,
        filter: isExiting ? 'blur(8px)' : 'blur(0px)'
      }}
      transition={{ 
        duration: 1.2, 
        ease: [0.25, 0.1, 0.25, 1.0],
        opacity: { duration: 1.2 },
        scale: { duration: 1.2, delay: 0.1 },
        filter: { duration: 0.8, delay: 0.2 }
      }}
    >
      <div className="flex w-full max-w-7xl mx-auto px-8 gap-16 items-center">
        {/* Loading Section - Left Side */}
        <motion.div 
          className="flex-1 flex flex-col items-center justify-center"
          initial={{ opacity: 1, x: 0 }}
          animate={{ 
            opacity: 1, 
            x: showPrompt ? -50 : 0 
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Windows XP Logo */}
          <motion.div 
            className="mb-12 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Microsoft Logo */}
            <motion.div 
              className="mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div 
                className="text-white mb-3"
                style={{ 
                  fontSize: '42px', 
                  fontWeight: 'normal',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                  fontFamily: 'Franklin Gothic Medium, Arial, sans-serif',
                  letterSpacing: '1px'
                }}
              >
                Rishith Chintala
              </div>
            </motion.div>

            {/* Windows XP Logo with Flag */}
            <motion.div 
              className="flex items-center justify-center mb-4"
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
            >
              {/* Windows Flag Logo */}
              <motion.div 
                className="mr-4 relative" 
                style={{ width: '64px', height: '64px' }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
            <div 
              className="absolute inset-0 rounded-lg shadow-2xl"
              style={{
                background: isDarkMode 
                  ? 'linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%)'
                  : 'linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%)',
                border: `2px solid ${isDarkMode ? '#555555' : '#c0c0c0'}`
              }}
            >
                {/* Windows Flag Pattern */}
                <div className="absolute inset-2 grid grid-cols-2 gap-1">
                  <motion.div 
                    className="rounded-sm"
                    style={{ 
                      background: isDarkMode 
                        ? 'linear-gradient(145deg, #ff4500 0%, #cc3300 100%)'
                        : 'linear-gradient(145deg, #ff6b35 0%, #f7931e 100%)' 
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                  ></motion.div>
                  <motion.div 
                    className="rounded-sm"
                    style={{ 
                      background: isDarkMode 
                        ? 'linear-gradient(145deg, #228b22 0%, #006400 100%)'
                        : 'linear-gradient(145deg, #7db46c 0%, #42b883 100%)' 
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                  ></motion.div>
                  <motion.div 
                    className="rounded-sm"
                    style={{ 
                      background: isDarkMode 
                        ? 'linear-gradient(145deg, #1e90ff 0%, #0066cc 100%)'
                        : 'linear-gradient(145deg, #4fc3f7 0%, #29b6f6 100%)' 
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                  ></motion.div>
                  <motion.div 
                    className="rounded-sm"
                    style={{ 
                      background: isDarkMode 
                        ? 'linear-gradient(145deg, #ffa500 0%, #cc8400 100%)'
                        : 'linear-gradient(145deg, #ffeb3b 0%, #ffc107 100%)' 
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                  ></motion.div>
                </div>
              </div>
            </motion.div>

              {/* Windows Text */}
              <motion.div 
                className="text-white"
                style={{ 
                  fontSize: '56px', 
                  fontWeight: 'bold',
                  textShadow: '3px 3px 6px rgba(0,0,0,0.7)',
                  fontFamily: 'Franklin Gothic Medium, Arial, sans-serif',
                  background: isDarkMode 
                    ? 'linear-gradient(45deg, #cccccc 0%, #888888 100%)'
                    : 'linear-gradient(45deg, #ffffff 0%, #e0e0e0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Portfolio
              </motion.div>
            </motion.div>

            {/* XP Professional */}
            <motion.div 
              className="text-white text-xl opacity-95 mb-2"
              style={{ 
                fontFamily: 'Tahoma, sans-serif',
                textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
                fontWeight: 'normal'
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.95 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              Professional {isDarkMode ? '(Dark Edition)' : ''}
            </motion.div>
            
            {/* Build Info */}
            <motion.div 
              className="text-white text-sm opacity-80"
              style={{ 
                fontFamily: 'Tahoma, sans-serif',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 0.8 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              Build 2025.portfolio_v9.1{isDarkMode ? '.dark' : ''}
            </motion.div>
          </motion.div>

          {/* Welcome Message - Made wider */}
          <motion.div 
            className="text-white text-2xl mb-8 transition-all duration-500 text-center max-w-2xl"
            style={{ 
              fontFamily: 'Tahoma, sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              fontWeight: 'normal'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.4 }}
          >
            {progress >= 100 ? 'Loading complete!' : loadingText}
          </motion.div>

          {/* Loading Animation */}
          <motion.div 
            className="flex space-x-2 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.6 }}
          >
            {[0, 0.4, 0.8].map((delay, index) => (
              <motion.div 
                key={index}
                className="w-3 h-3 rounded-full"
                style={{ 
                  background: isDarkMode 
                    ? 'linear-gradient(45deg, #cccccc 0%, #888888 100%)'
                    : 'linear-gradient(45deg, #ffffff 0%, #e0e0e0 100%)',
                  boxShadow: isDarkMode 
                    ? '0 0 8px rgba(255,255,255,0.3)'
                    : '0 0 8px rgba(255,255,255,0.5)'
                }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: delay
                }}
              ></motion.div>
            ))}
          </motion.div>

          {/* Progress Bar Container */}
          <motion.div 
            className="w-96 h-5 border shadow-inner mb-6"
            style={{
              background: isDarkMode 
                ? 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)'
                : 'linear-gradient(180deg, #f0f0f0 0%, #ffffff 100%)',
              borderColor: isDarkMode ? '#555555' : '#888888',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '384px', opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            {/* Progress Bar Fill */}
            <motion.div 
              className="h-full transition-all duration-300 ease-out relative"
              style={{ 
                width: `${progress}%`,
                background: isDarkMode 
                  ? 'linear-gradient(180deg, #ff6b35 0%, #cc3300 50%, #aa2200 100%)'
                  : 'linear-gradient(180deg, #4682b4 0%, #1e5a8a 50%, #2a5298 100%)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)'
              }}
            >
              {/* Progress Bar Highlight */}
              {progress > 0 && (
                <motion.div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)'
                  }}
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                ></motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Progress Text */}
          <motion.div 
            className="text-white text-sm opacity-90 mb-6"
            style={{ 
              fontFamily: 'Tahoma, sans-serif',
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.5, delay: 2.0 }}
          >
            {Math.round(progress)}% complete
          </motion.div>
        </motion.div>

        {/* Choice Prompt - Right Side */}
        {showPrompt && (
          <motion.div
            className="flex-1 flex flex-col items-center justify-center"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Prompt Text */}
            <motion.div
              className="text-white text-2xl mb-10 text-center"
              style={{
                fontFamily: 'Tahoma, sans-serif',
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                fontWeight: 'normal'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Choose your experience:
            </motion.div>

            {/* Button Container */}
            <motion.div
              className="flex flex-col gap-6 w-full max-w-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Full Version Button */}
              <motion.button
                onClick={() => handleVersionChoice('full')}
                onMouseEnter={() => setHoveredButton('full')}
                onMouseLeave={() => setHoveredButton(null)}
                className="relative px-8 py-4 rounded-sm cursor-pointer transition-all duration-200"
                style={{
                  background: hoveredButton === 'full'
                    ? (isDarkMode 
                      ? 'linear-gradient(180deg, #ff8c5a 0%, #ff6b35 50%, #cc3300 100%)'
                      : 'linear-gradient(180deg, #5a9fd4 0%, #2a5298 50%, #1e3c72 100%)')
                    : (isDarkMode
                      ? 'linear-gradient(180deg, #ff6b35 0%, #cc3300 50%, #aa2200 100%)'
                      : 'linear-gradient(180deg, #4682b4 0%, #2a5298 50%, #1e3c72 100%)'),
                  border: `2px solid ${isDarkMode ? '#aa2200' : '#1e3c72'}`,
                  boxShadow: hoveredButton === 'full'
                    ? '0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
                  transform: hoveredButton === 'full' ? 'translateY(-2px)' : 'translateY(0)',
                  fontFamily: 'Tahoma, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: '#ffffff',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                  outline: 'none',
                  userSelect: 'none'
                }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg mb-1">Full Version</span>
                  <span className="text-xs opacity-90" style={{ fontWeight: 'normal' }}>
                    Complete experience
                  </span>
                </div>
              </motion.button>

              {/* Condensed Build Button */}
              <motion.button
                onClick={() => handleVersionChoice('condensed')}
                onMouseEnter={() => setHoveredButton('condensed')}
                onMouseLeave={() => setHoveredButton(null)}
                className="relative px-8 py-4 rounded-sm cursor-pointer transition-all duration-200"
                style={{
                  background: hoveredButton === 'condensed'
                    ? (isDarkMode 
                      ? 'linear-gradient(180deg, #ff8c5a 0%, #ff6b35 50%, #cc3300 100%)'
                      : 'linear-gradient(180deg, #5a9fd4 0%, #2a5298 50%, #1e3c72 100%)')
                    : (isDarkMode
                      ? 'linear-gradient(180deg, #ff6b35 0%, #cc3300 50%, #aa2200 100%)'
                      : 'linear-gradient(180deg, #4682b4 0%, #2a5298 50%, #1e3c72 100%)'),
                  border: `2px solid ${isDarkMode ? '#aa2200' : '#1e3c72'}`,
                  boxShadow: hoveredButton === 'condensed'
                    ? '0 4px 12px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
                  transform: hoveredButton === 'condensed' ? 'translateY(-2px)' : 'translateY(0)',
                  fontFamily: 'Tahoma, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: '#ffffff',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                  outline: 'none',
                  userSelect: 'none'
                }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-lg mb-1">Condensed Build</span>
                  <span className="text-xs opacity-90" style={{ fontWeight: 'normal' }}>
                    Faster loading
                  </span>
                </div>
              </motion.button>
            </motion.div>

            {/* Helper Text */}
            <motion.div
              className="text-white text-sm opacity-75 mt-8 text-center"
              style={{
                fontFamily: 'Tahoma, sans-serif',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Both versions feature the full portfolio experience
            </motion.div>
          </motion.div>
        )}
      </div>



      {/* Decorative Elements */}
      <motion.div 
        className="absolute top-20 right-20 w-40 h-40 opacity-5 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(255,255,255,${isDarkMode ? '0.2' : '0.4'}) 0%, transparent 70%)`
        }}
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      ></motion.div>
      <motion.div 
        className="absolute bottom-32 left-20 w-32 h-32 opacity-5 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(255,255,255,${isDarkMode ? '0.15' : '0.3'}) 0%, transparent 70%)`
        }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.08, 0.05]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      ></motion.div>
    </motion.div>
  );
}