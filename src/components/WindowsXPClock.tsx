import { useState, useEffect } from 'react';
import { formatTime, formatDate } from './utils/desktopUtils';

interface WindowsXPClockProps {
  isDarkMode?: boolean;
}

export default function WindowsXPClock({ isDarkMode = false }: WindowsXPClockProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const baseStyles = {
    background: isDarkMode 
      ? 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)'
      : 'linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%)',
    borderColor: isDarkMode ? '#444444' : '#c0c0c0',
    color: isDarkMode ? '#ffffff' : '#000000'
  };

  const tooltipStyles = {
    background: isDarkMode 
      ? 'linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%)'
      : 'linear-gradient(180deg, #ffffe1 0%, #ffffcc 100%)',
    borderColor: isDarkMode ? '#555555' : '#000000',
    color: isDarkMode ? '#ffffff' : '#000000'
  };

  return (
    <div className="relative">
      <div
        className="px-3 py-1 border-l cursor-pointer hover:bg-opacity-80 transition-all duration-150 active:brightness-90 flex items-center justify-center min-w-16"
        style={baseStyles}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        title={`${formatDate(currentTime)} ${formatTime(currentTime)}`}
      >
        <div className="text-center">
          <div 
            className="text-xs leading-tight"
            style={{ 
              fontFamily: 'Tahoma, sans-serif',
              fontSize: '11px',
              lineHeight: '1.2'
            }}
          >
            {formatTime(currentTime)}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute bottom-full right-0 mb-1 px-2 py-1 border text-xs whitespace-nowrap z-50 shadow-lg"
          style={{
            ...tooltipStyles,
            fontFamily: 'Tahoma, sans-serif',
            fontSize: '11px',
            borderRadius: '2px'
          }}
        >
          {formatDate(currentTime)}
        </div>
      )}
    </div>
  );
}