import { useState, useEffect } from "react";

interface WelcomePopupProps {
  onClose: () => void;
  isDarkMode: boolean;
}

export default function WelcomePopup({
  onClose,
  isDarkMode,
}: WelcomePopupProps) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsButtonEnabled(true);
    }
  }, [timeLeft]);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 400); // Match the popupPopOut animation duration
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Darker Glassmorphism Backdrop with gradual blackening/fade out */}
      <div
        className={isClosing ? "absolute inset-0 backdrop-fade-out" : "absolute inset-0 backdrop-darken"}
        style={{
          background: isDarkMode
            ? "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.9) 100%)"
            : "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.85) 100%)",
        }}
      ></div>

      {/* Popup Window - Centered design with pop-in/pop-out animation */}
      <div
        className={`relative w-[500px] h-[540px] border-2 shadow-2xl overflow-hidden ${isClosing ? 'popup-pop-out' : 'popup-pop-in'}`}
        style={{
          background: isDarkMode
            ? "linear-gradient(180deg, #4a5568 0%, #2d3748 100%)"
            : "linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%)",
          borderColor: isDarkMode ? "#718096" : "#c0c0c0",
          borderRadius: "4px",
          fontFamily: "Tahoma, sans-serif",
        }}
      >
        {/* Title Bar */}
        <div
          className="h-8 border-b flex items-center justify-between px-2"
          style={{
            background: isDarkMode
              ? "linear-gradient(180deg, #4299e1 0%, #3182ce 100%)"
              : "linear-gradient(180deg, #0078d4 0%, #106ebe 100%)",
            borderColor: isDarkMode ? "#2d3748" : "#c0c0c0",
          }}
        >
          <div className="flex items-center space-x-1">
            <div
              className="w-4 h-4 border flex items-center justify-center text-xs"
              style={{
                background: isDarkMode ? "#2d3748" : "white",
                borderColor: isDarkMode ? "#666666" : "#808080",
                borderRadius: "1px",
                color: isDarkMode ? "#4299e1" : "#0078d4",
              }}
            >
              ℹ️
            </div>
            <span className="text-xs text-white font-semibold tracking-wide">
              Welcome to Windows XP Portfolio Experience
            </span>
          </div>
        </div>

        {/* Content - Properly contained within window */}
        <div className="h-[calc(100%-32px)] flex flex-col items-center justify-between text-center overflow-hidden p-[17px] m-[0px]">
          {/* Top section - Icon and main message */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div
              className="w-16 h-16 border-2 flex items-center justify-center mb-4"
              style={{
                background: isDarkMode
                  ? "linear-gradient(145deg, #4a4a4a 0%, #2a2a2a 100%)"
                  : "linear-gradient(145deg, #e0e0e0 0%, #a0a0a0 100%)",
                borderColor: isDarkMode ? "#666666" : "#808080",
                borderRadius: "3px",
              }}
            >
              <span className="text-3xl">👋</span>
            </div>

            <h2
              className="text-xl font-bold mb-3"
              style={{
                color: isDarkMode ? "#f7fafc" : "#003c71",
              }}
            >
              Welcome to Rishith's Portfolio!
            </h2>

            <p
              className="text-sm leading-relaxed mb-4 max-w-sm"
              style={{
                color: isDarkMode ? "#e2e8f0" : "#4a5568",
              }}
            >
              {isDarkMode ? (
                <>
                  Welcome to Dark Mode! Experience enhanced visuals with darker desktop icons, 
                  improved contrast, and a sleek modern aesthetic while maintaining the 
                  classic XP experience.
                </>
              ) : (
                <>
                  Experience an authentic Windows XP interface
                  showcasing creative work with interactive desktop
                  programs and games.
                </>
              )}
            </p>
          </div>

          {/* Middle section - Quick tips */}
          <div
            className="border-2 p-5 w-full max-w-lg flex-shrink-0 relative overflow-hidden"
            style={{
              background: isDarkMode
                ? "linear-gradient(135deg, #2d3748 0%, #1a202c 50%, #2d3748 100%)"
                : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)",
              borderColor: isDarkMode ? "#4299e1" : "#1976d2",
              borderRadius: "8px",
              boxShadow: isDarkMode
                ? "0 8px 24px rgba(66, 153, 225, 0.3), 0 0 0 1px rgba(66, 153, 225, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                : "0 8px 24px rgba(25, 118, 210, 0.25), 0 0 0 1px rgba(25, 118, 210, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
              animation:
                "portfolioGlow 3s ease-in-out infinite",
            }}
          >
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background: isDarkMode
                  ? "radial-gradient(circle at 20% 50%, rgba(66, 153, 225, 0.3) 0%, transparent 50%)"
                  : "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.6) 0%, transparent 50%)",
              }}
            />
            <div className="relative z-10">
              <h3
                className="font-bold mb-3"
                style={{
                  color: isDarkMode ? "#63b3ed" : "#0d47a1",
                  fontSize: "18px",
                  textShadow: isDarkMode
                    ? "0 2px 4px rgba(0, 0, 0, 0.5), 0 0 8px rgba(66, 153, 225, 0.3)"
                    : "0 1px 2px rgba(255, 255, 255, 0.8), 0 0 8px rgba(25, 118, 210, 0.2)",
                }}
              >
                {isDarkMode ? "🌙 Dark Mode Tips:" : "💡 Quick Tips:"}
              </h3>
              <div
                className="space-y-2"
                style={{
                  color: isDarkMode ? "#e2e8f0" : "#0d47a1",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {isDarkMode ? (
                  <>
                    <div
                      style={{
                        padding: "6px 8px",
                        background: "rgba(66, 153, 225, 0.1)",
                        borderRadius: "4px",
                        borderLeft: `3px solid #4299e1`,
                      }}
                    >
                      🌟 Enhanced icon contrast & visibility
                    </div>
                    <div
                      style={{
                        padding: "6px 8px",
                        background: "rgba(66, 153, 225, 0.1)",
                        borderRadius: "4px",
                        borderLeft: `3px solid #4299e1`,
                      }}
                    >
                      🎨 Darker themes for all programs
                    </div>
                    <div
                      style={{
                        padding: "6px 8px",
                        background: "rgba(66, 153, 225, 0.1)",
                        borderRadius: "4px",
                        borderLeft: `3px solid #4299e1`,
                      }}
                    >
                      👁️ Reduced eye strain for long sessions
                    </div>
                    <div
                      style={{
                        padding: "6px 8px",
                        background: "rgba(66, 153, 225, 0.1)",
                        borderRadius: "4px",
                        borderLeft: `3px solid #4299e1`,
                      }}
                    >
                      ⚡ Control Panel to switch back anytime
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        padding: "6px 8px",
                        background: "rgba(255, 255, 255, 0.4)",
                        borderRadius: "4px",
                        borderLeft: `3px solid #1976d2`,
                      }}
                    >
                      🖱️ Double-click desktop icons to open
                    </div>
                    <div
                      style={{
                        padding: "6px 8px",
                        background: "rgba(255, 255, 255, 0.4)",
                        borderRadius: "4px",
                        borderLeft: `3px solid #1976d2`,
                      }}
                    >
                      📁 10 portfolio programs on the left
                    </div>
                    <div
                      style={{
                        padding: "6px 8px",
                        background: "rgba(255, 255, 255, 0.4)",
                        borderRadius: "4px",
                        borderLeft: `3px solid #1976d2`,
                      }}
                    >
                      🏆 Achievement system tracks progress
                    </div>
                    <div
                      style={{
                        padding: "6px 8px",
                        background: "rgba(255, 255, 255, 0.4)",
                        borderRadius: "4px",
                        borderLeft: `3px solid #1976d2`,
                      }}
                    >
                      🎮 Hidden games & easter eggs
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bottom section - Close button */}
          <div className="w-full max-w-sm flex-shrink-0">
            <button
              onClick={isButtonEnabled ? handleClose : undefined}
              disabled={!isButtonEnabled}
              className="px-6 py-3 text-base border transition-all duration-200 font-semibold w-full flex items-center justify-center"
              style={{
                background: isButtonEnabled
                  ? isDarkMode
                    ? "linear-gradient(180deg, #4299e1 0%, #3182ce 100%)"
                    : "linear-gradient(180deg, #0078d4 0%, #106ebe 100%)"
                  : isDarkMode
                    ? "#4a5568"
                    : "#d0d0d0",
                borderColor: isButtonEnabled
                  ? isDarkMode
                    ? "#3182ce"
                    : "#106ebe"
                  : isDarkMode
                    ? "#666666"
                    : "#999999",
                borderRadius: "2px",
                color: isButtonEnabled
                  ? "white"
                  : isDarkMode
                    ? "#a0a0a0"
                    : "#808080",
                cursor: isButtonEnabled
                  ? "pointer"
                  : "not-allowed",
              }}
            >
              {isButtonEnabled ? (
                <>Continue to Desktop</>
              ) : (
                <>Please read... {timeLeft}s</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}