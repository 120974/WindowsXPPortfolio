import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import confetti from 'canvas-confetti';
import DraggableWindow from './DraggableWindow';
import AboutApp from './AboutApp';
import AchievementsApp from './AchievementsApp';
import AchievementNotification from './AchievementNotification';
import ArtShowcaseApp from './ArtShowcaseApp';
import RecycleBinApp from './RecycleBinApp';
import InternetExplorerApp from './InternetExplorerApp';
import FileExplorerApp from './FileExplorerApp';
import MyPicturesApp from './MyPicturesApp';
import MyMusicApp from './MyMusicApp';
import ControlPanelApp from './ControlPanelApp';
import SolitaireApp from './SolitaireApp';
import MinesweeperApp from './MinesweeperApp';
import PacmanApp from './PacmanApp';
import SnakeApp from './SnakeApp';

import WindowsXPClock from './WindowsXPClock';

// Imports from refactored files
import { portfolioData } from './constants/artData';
import { ACHIEVEMENT_DEFINITIONS } from './constants/achievements';
import { ICON_WIDTH, ICON_HEIGHT, TASKBAR_HEIGHT, DRAG_THRESHOLD, getDarkModeStyles } from './constants/layout';
import { Window, WindowsXPDesktopProps, DesktopIcon, RecycledProgram } from './types/desktop';
import {
  loadWindowPositions, loadRecycledPrograms, findNearestAvailablePosition,
  isPositionOverRecycleBin, getCenteredPosition, getPortfolioCenteredPosition, getGameWindowPosition, getMusicAppPosition, formatTime, formatDate
} from './utils/desktopUtils';

export default function WindowsXPDesktop({ 
  onTurnOff, 
  isDarkMode, 
  onSetUnlockAchievementCallback, 
  onUnlockAchievement,
  onStartGlitchTransition
}: WindowsXPDesktopProps) {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  // Clock functionality moved to WindowsXPClock component
  // const [currentTime, setCurrentTime] = useState(new Date());
  const [highestZIndex, setHighestZIndex] = useState(1000);
  const [isDraggingIcon, setIsDraggingIcon] = useState(false);
  const [draggedIcon, setDraggedIcon] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [recycledPrograms, setRecycledPrograms] = useState<RecycledProgram[]>([]);
  const [isOverRecycleBin, setIsOverRecycleBin] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [mouseDownPosition, setMouseDownPosition] = useState<{ x: number; y: number } | null>(null);
  const [isPotentialDrag, setIsPotentialDrag] = useState(false);
  const [savedIconPositions, setSavedIconPositions] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [showConfettiScreen, setShowConfettiScreen] = useState(false);
  const [showChickenNuggetScreen, setShowChickenNuggetScreen] = useState(false);
  const [showWindowsLogoScreen, setShowWindowsLogoScreen] = useState(false);
  const [confettiFadingOut, setConfettiFadingOut] = useState(false);
  const [nuggetFadingOut, setNuggetFadingOut] = useState(false);
  const [logoFadingOut, setLogoFadingOut] = useState(false);
  const [showGames, setShowGames] = useState(false); // Toggle for showing game programs


  // Achievement system state
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('xp-achievements');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [currentNotification, setCurrentNotification] = useState<any>(null);
  const [hasMovedWindow, setHasMovedWindow] = useState(false);
  const [hasUsedTaskbar, setHasUsedTaskbar] = useState(false);
  const [playedGames, setPlayedGames] = useState<Set<string>>(new Set());
  const [viewedPortfolioCategories, setViewedPortfolioCategories] = useState<Set<string>>(new Set());
  const [openedApps, setOpenedApps] = useState<Set<string>>(new Set());

  const [savedPositions] = useState(loadWindowPositions());
  const darkModeStyles = getDarkModeStyles(isDarkMode);

  // Achievement unlock function - optimized to prevent stuttering
  const unlockAchievement = (achievementId: string) => {
    if (!unlockedAchievements.includes(achievementId)) {
      const achievement = ACHIEVEMENT_DEFINITIONS.find(a => a.id === achievementId);
      if (achievement) {
        const newUnlocked = [...unlockedAchievements, achievementId];
        setUnlockedAchievements(newUnlocked);
        try {
          localStorage.setItem('xp-achievements', JSON.stringify(newUnlocked));
        } catch { /* ignore errors */ }
        
        // Use requestAnimationFrame to prevent stuttering
        requestAnimationFrame(() => {
          // Show local notification
          setCurrentNotification(achievement);
          
          // Also call global notification if available
          if (onUnlockAchievement) {
            onUnlockAchievement(achievementId);
          }
        });
        
        // Check for XP Master achievement after this unlock
        if (achievementId !== 'xp_master') {
          checkForXPMaster(newUnlocked);
        }
      }
    }
  };

  // Check for XP Master achievement when reaching 96% completion
  const checkForXPMaster = (currentUnlocked: string[]) => {
    if (currentUnlocked.includes('xp_master')) return; // Already unlocked
    
    // Calculate total possible points (excluding XP Master itself)
    const totalPossiblePoints = ACHIEVEMENT_DEFINITIONS
      .filter(a => a.id !== 'xp_master')
      .reduce((sum, achievement) => sum + achievement.points, 0);
    
    // Calculate current points
    const currentPoints = ACHIEVEMENT_DEFINITIONS
      .filter(a => currentUnlocked.includes(a.id) && a.id !== 'xp_master')
      .reduce((sum, achievement) => sum + achievement.points, 0);
    
    // Check if reached 96% completion
    const completionPercentage = (currentPoints / totalPossiblePoints) * 100;
    
    if (completionPercentage >= 96) {
      // Unlock XP Master with special handling
      const xpMasterAchievement = ACHIEVEMENT_DEFINITIONS.find(a => a.id === 'xp_master');
      if (xpMasterAchievement) {
        const finalUnlocked = [...currentUnlocked, 'xp_master'];
        setUnlockedAchievements(finalUnlocked);
        try {
          localStorage.setItem('xp-achievements', JSON.stringify(finalUnlocked));
        } catch { /* ignore errors */ }
        
        // Show special XP Master notification after a brief delay
        setTimeout(() => {
          const specialAchievement = {
            ...xpMasterAchievement,
            isSpecial: true // Mark as special for enhanced notification
          };
          setCurrentNotification(specialAchievement);
          
          // Also call global notification if available
          if (onUnlockAchievement) {
            onUnlockAchievement('xp_master');
          }
        }, 1000);
      }
    }
  };

  // Clear icon positions and load recycled programs
  useEffect(() => {
    localStorage.removeItem('xp-icon-positions');
    setSavedIconPositions({});
    setRecycledPrograms(loadRecycledPrograms());
    // Unlock first boot achievement
    unlockAchievement('first_boot');
    // Set unlock achievement callback for parent component
    if (onSetUnlockAchievementCallback) {
      onSetUnlockAchievementCallback(unlockAchievement);
    }
    // Check for XP Master on initial load in case user already qualifies
    setTimeout(() => {
      checkForXPMaster(unlockedAchievements);
    }, 1000);
  }, []);

  // Check for XP Master when unlocked achievements change (from localStorage)
  useEffect(() => {
    if (unlockedAchievements.length > 0) {
      checkForXPMaster(unlockedAchievements);
    }
  }, [unlockedAchievements]);

  // Check for gaming legend achievement
  useEffect(() => {
    if (playedGames.size === 4) {
      unlockAchievement('gaming_legend');
    }
  }, [playedGames]);

  // Check for design admirer achievement
  useEffect(() => {
    const has2D = Array.from(viewedPortfolioCategories).some(cat => cat.includes('2d'));
    const has3D = Array.from(viewedPortfolioCategories).some(cat => cat.includes('3d'));
    if (has2D && has3D) {
      unlockAchievement('design_admirer');
    }
  }, [viewedPortfolioCategories]);

  // Remove local time management since WindowsXPClock handles it
  // useEffect(() => {
  //   const timer = setInterval(() => setCurrentTime(new Date()), 1000);
  //   return () => clearInterval(timer);
  // }, []);

  // Clear selection when clicking on desktop
  useEffect(() => {
    const handleDesktopClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.desktop-icon') && !target.closest('.taskbar')) {
        setSelectedIcon(null);
      }
    };
    document.addEventListener('click', handleDesktopClick);
    return () => document.removeEventListener('click', handleDesktopClick);
  }, []);

  // Window management state
  const [windows, setWindows] = useState<{ [key: string]: Window }>(() => {
    const windowIds = ['about', 'achievements', ...portfolioData.map(item => item.id), 'recycle', 'ie', 'mydocs', 'mypics', 'mymusic', 'controlpanel', 'solitaire', 'minesweeper', 'pacman', 'snake'];
    const windowsState: { [key: string]: Window } = {};
    windowIds.forEach((id) => {
      const isPortfolio = portfolioData.some(item => item.id === id);
      const isGame = ['solitaire', 'minesweeper', 'pacman', 'snake'].includes(id);
      let position;
      
      if (savedPositions[id]) {
        position = savedPositions[id];
      } else if (isPortfolio) {
        position = getPortfolioCenteredPosition();
      } else if (isGame) {
        position = getGameWindowPosition(id);
      } else if (id === 'mymusic') {
        position = getMusicAppPosition();
      } else {
        position = getCenteredPosition();
      }
      
      windowsState[id] = {
        id,
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        zIndex: 1000,
        position
      };
    });
    return windowsState;
  });

  // Window management functions
  const openWindow = (windowId: string) => {
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    const isPortfolio = portfolioData.some(item => item.id === windowId);
    const isGame = ['solitaire', 'minesweeper', 'pacman', 'snake'].includes(windowId);
    
    let position;
    if (savedPositions[windowId]) {
      position = savedPositions[windowId];
    } else if (isPortfolio) {
      position = getPortfolioCenteredPosition();
    } else if (isGame) {
      position = getGameWindowPosition(windowId);
    } else if (windowId === 'mymusic') {
      position = getMusicAppPosition();
    } else {
      position = getCenteredPosition();
    }
    
    setWindows(prev => ({
      ...prev,
      [windowId]: {
        ...prev[windowId],
        isOpen: true,
        isMinimized: false,
        zIndex: newZIndex,
        position
      }
    }));

    // Track achievement unlocks
    trackAppOpening(windowId);
    
    // Check for first app opening
    if (!openedApps.has(windowId)) {
      setOpenedApps(prev => new Set([...prev, windowId]));
      if (openedApps.size === 0) {
        unlockAchievement('desktop_explorer');
      }
    }
  };

  // Track app opening for achievements
  const trackAppOpening = (appId: string) => {
    switch (appId) {
      case 'about':
        unlockAchievement('about_reader');
        break;
      case 'achievements':
        unlockAchievement('achievement_hunter');
        break;
      case 'solitaire':
        unlockAchievement('solitaire_player');
        setPlayedGames(prev => new Set([...prev, 'solitaire']));
        break;
      case 'minesweeper':
        unlockAchievement('minesweeper_brave');
        setPlayedGames(prev => new Set([...prev, 'minesweeper']));
        break;
      case 'pacman':
        unlockAchievement('pacman_chomper');
        setPlayedGames(prev => new Set([...prev, 'pacman']));
        break;
      case 'snake':
        unlockAchievement('snake_slitherer');
        setPlayedGames(prev => new Set([...prev, 'snake']));
        break;
      case 'mypics':
        unlockAchievement('media_explorer');
        break;
      case 'mymusic':
        // Music app - no specific achievement
        break;
      case 'mydocs':
        unlockAchievement('file_manager');
        break;
      case 'ie':
        unlockAchievement('web_surfer');
        break;
      case 'controlpanel':
        unlockAchievement('system_admin');
        break;
      case 'recycle':
        unlockAchievement('recycle_bin_cleaner');
        break;
    }

    // Track portfolio viewing
    const portfolioItem = portfolioData.find(item => item.id === appId);
    if (portfolioItem) {
      unlockAchievement('portfolio_viewer');
      setViewedPortfolioCategories(prev => new Set([...prev, portfolioItem.category]));
      if (portfolioItem.category === 'photography') {
        unlockAchievement('photo_enthusiast');
      }
    }
  };

  const closeWindow = (windowId: string) => {
    setWindows(prev => ({ ...prev, [windowId]: { ...prev[windowId], isOpen: false } }));
  };

  const minimizeWindow = (windowId: string) => {
    setWindows(prev => ({ ...prev, [windowId]: { ...prev[windowId], isMinimized: true } }));
  };

  const maximizeWindow = (windowId: string) => {
    setWindows(prev => ({ ...prev, [windowId]: { ...prev[windowId], isMaximized: !prev[windowId].isMaximized } }));
  };

  const focusWindow = (windowId: string) => {
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    setWindows(prev => ({ ...prev, [windowId]: { ...prev[windowId], zIndex: newZIndex } }));
    
    // Track taskbar usage
    if (!hasUsedTaskbar) {
      setHasUsedTaskbar(true);
      unlockAchievement('taskbar_master');
    }
  };

  const handlePositionChange = (windowId: string, position: { x: number; y: number; width: number; height: number }) => {
    setWindows(prev => ({ ...prev, [windowId]: { ...prev[windowId], position } }));
    try {
      const saved = loadWindowPositions();
      saved[windowId] = position;
      localStorage.setItem('xp-window-positions', JSON.stringify(saved));
    } catch { /* ignore errors */ }

    // Track window moving achievement
    if (!hasMovedWindow) {
      setHasMovedWindow(true);
      unlockAchievement('window_mover');
    }
  };

  // System app handlers
  const handleSystemAppClick = (appId: string) => {
    openWindow(appId);
  };

  const handleLogOff = () => {
    if (onStartGlitchTransition) {
      onStartGlitchTransition();
    } else {
      window.location.reload();
    }
  };

  // Control Panel handlers
  const handleDarkModeToggle = () => {
    onTurnOff(); // This will trigger dark mode toggle in App.tsx
  };

  const handleOpenMediaPlayer = () => {
    openWindow('mymusic');
  };

  const handleModernVersionLaunch = () => {
    // This feature has been removed - redirect to site refresh
    handleSiteRefresh();
  };

  const handleSiteRefresh = () => {
    window.location.reload();
  };

  // Screen effect handlers
  const triggerConfettiScreen = () => {
    if (showConfettiScreen) return; // Prevent multiple triggers
    
    // Unlock achievement
    unlockAchievement('confetti_celebrator');
    
    setShowConfettiScreen(true);
    setConfettiFadingOut(false);
    
    // Launch confetti from multiple points
    const duration = 2500;
    const animationEnd = Date.now() + duration;
    const colors = ['#90EE90', '#32CD32', '#FFD700', '#FF6347', '#87CEEB', '#DDA0DD'];

    const frame = () => {
      confetti({
        particleCount: 15,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 15,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Start fade out animation
    setTimeout(() => {
      setConfettiFadingOut(true);
      // Hide completely after fade out animation
      setTimeout(() => {
        setShowConfettiScreen(false);
        setConfettiFadingOut(false);
      }, 600);
    }, duration);
  };

  const triggerChickenNuggetScreen = () => {
    if (showChickenNuggetScreen) return; // Prevent multiple triggers
    
    // Unlock achievement
    unlockAchievement('nugget_lover');
    
    setShowChickenNuggetScreen(true);
    setNuggetFadingOut(false);
    
    setTimeout(() => {
      setNuggetFadingOut(true);
      setTimeout(() => {
        setShowChickenNuggetScreen(false);
        setNuggetFadingOut(false);
      }, 600);
    }, 3500);
  };

  const triggerWindowsLogoScreen = () => {
    if (showWindowsLogoScreen) return; // Prevent multiple triggers
    
    // Unlock achievement
    unlockAchievement('logo_admirer');
    
    setShowWindowsLogoScreen(true);
    setLogoFadingOut(false);
    
    setTimeout(() => {
      setLogoFadingOut(true);
      setTimeout(() => {
        setShowWindowsLogoScreen(false);
        setLogoFadingOut(false);
      }, 600);
    }, 2500);
  };

  // Recycle bin functions
  const recycleProgram = (iconId: string) => {
    const icon = getDesktopIcons().find(i => i.id === iconId);
    if (icon && (icon.type === 'about' || icon.type === 'achievements' || icon.type === 'portfolio' || icon.type === 'game')) {
      const recycledProgram: RecycledProgram = {
        id: iconId,
        title: icon.title,
        type: icon.type === 'about' ? 'about' : icon.type === 'achievements' ? 'achievements' : icon.type === 'game' ? 'game' : 'art',
        deletedAt: new Date()
      };
      
      const newRecycledPrograms = [...recycledPrograms, recycledProgram];
      setRecycledPrograms(newRecycledPrograms);
      try {
        localStorage.setItem('xp-recycled-programs', JSON.stringify(newRecycledPrograms));
      } catch { /* ignore errors */ }
      
      // Close the window if it's open
      closeWindow(iconId);
      
      // Remove from saved icon positions
      const newPositions = { ...savedIconPositions };
      delete newPositions[iconId];
      setSavedIconPositions(newPositions);
      localStorage.setItem('xp-icon-positions', JSON.stringify(newPositions));
    }
  };

  const restoreProgram = (programId: string) => {
    const program = recycledPrograms.find(p => p.id === programId);
    if (program) {
      // Remove from recycled programs
      const newRecycledPrograms = recycledPrograms.filter(p => p.id !== programId);
      setRecycledPrograms(newRecycledPrograms);
      try {
        localStorage.setItem('xp-recycled-programs', JSON.stringify(newRecycledPrograms));
      } catch { /* ignore errors */ }
      
      // Restore to original spawn location
      let originalPosition;
      const columnWidth = ICON_WIDTH + 20;
      const screenCenterX = (window.innerWidth / 2) - (ICON_WIDTH / 2);
      
      if (programId === 'about') {
        // About: top right corner (default when games are hidden)
        originalPosition = {
          x: window.innerWidth - ICON_WIDTH - 16,
          y: 16
        };
      } else if (programId === 'achievements') {
        // Achievements: below About in top right
        originalPosition = {
          x: window.innerWidth - ICON_WIDTH - 16,
          y: 16 + ICON_HEIGHT
        };
      } else if (['solitaire', 'minesweeper', 'pacman', 'snake'].includes(programId)) {
        // Games: top right (when shown)
        const gameIds = ['solitaire', 'minesweeper', 'pacman', 'snake'];
        const gameIndex = gameIds.indexOf(programId);
        originalPosition = {
          x: window.innerWidth - ICON_WIDTH - 16,
          y: 16 + (gameIndex * ICON_HEIGHT)
        };
      } else {
        // Find original position based on category
        const portfolioItem = portfolioData.find(item => item.id === programId);
        if (portfolioItem) {
          const categoryItems = portfolioData.filter(item => item.category === portfolioItem.category);
          const indexInCategory = categoryItems.findIndex(item => item.id === programId);
          
          let columnIndex = 0;
          if (portfolioItem.category === '3d') columnIndex = 1;
          else if (portfolioItem.category === '2d') columnIndex = 2;
          
          originalPosition = {
            x: 16 + (columnIndex * columnWidth),
            y: 16 + (indexInCategory * ICON_HEIGHT)
          };
        } else {
          // Fallback for other programs
          originalPosition = findNearestAvailablePosition(100, 100, getDesktopIcons());
        }
      }
      
      const newPositions = { ...savedIconPositions, [programId]: originalPosition };
      setSavedIconPositions(newPositions);
      localStorage.setItem('xp-icon-positions', JSON.stringify(newPositions));
    }
  };

  const emptyRecycleBin = () => {
    setRecycledPrograms([]);
    try {
      localStorage.setItem('xp-recycled-programs', JSON.stringify([]));
    } catch { /* ignore errors */ }
  };

  // Icon management with repositioned columns and centered About
  const getDesktopIcons = (): DesktopIcon[] => {
    const icons: DesktopIcon[] = [];
    const columnWidth = ICON_WIDTH + 20; // 20px spacing between columns
    const iconsPerColumn = Math.floor((window.innerHeight - TASKBAR_HEIGHT - 40) / ICON_HEIGHT);
    const screenCenterX = (window.innerWidth / 2) - (ICON_WIDTH / 2);

    // Column 1: Photography (leftmost)
    const photographyPrograms = portfolioData
      .filter(item => item.category === 'photography')
      .filter(program => !recycledPrograms.some(recycled => recycled.id === program.id))
      .map(item => ({ 
        id: item.id, 
        title: item.title, 
        type: 'portfolio' as const, 
        category: item.category 
      }));

    photographyPrograms.forEach((program, index) => {
      const columnIndex = 0;
      const rowIndex = index;
      const defaultX = 16 + (columnIndex * columnWidth);
      const defaultY = 16 + (rowIndex * ICON_HEIGHT);

      if (isDraggingIcon && draggedIcon === program.id) {
        icons.push({ ...program, x: dragPosition.x, y: dragPosition.y });
      } else {
        const savedPos = savedIconPositions[program.id];
        icons.push({ 
          ...program, 
          x: savedPos?.x ?? defaultX, 
          y: savedPos?.y ?? defaultY 
        });
      }
    });

    // Column 2: 3D Design
    const threeDPrograms = portfolioData
      .filter(item => item.category === '3d')
      .filter(program => !recycledPrograms.some(recycled => recycled.id === program.id))
      .map(item => ({ 
        id: item.id, 
        title: item.title, 
        type: 'portfolio' as const, 
        category: item.category 
      }));

    threeDPrograms.forEach((program, index) => {
      const columnIndex = 1;
      const rowIndex = index;
      const defaultX = 16 + (columnIndex * columnWidth);
      const defaultY = 16 + (rowIndex * ICON_HEIGHT);

      if (isDraggingIcon && draggedIcon === program.id) {
        icons.push({ ...program, x: dragPosition.x, y: dragPosition.y });
      } else {
        const savedPos = savedIconPositions[program.id];
        icons.push({ 
          ...program, 
          x: savedPos?.x ?? defaultX, 
          y: savedPos?.y ?? defaultY 
        });
      }
    });

    // Column 3: 2D Design
    const twoDPrograms = portfolioData
      .filter(item => item.category === '2d')
      .filter(program => !recycledPrograms.some(recycled => recycled.id === program.id))
      .map(item => ({ 
        id: item.id, 
        title: item.title, 
        type: 'portfolio' as const, 
        category: item.category 
      }));

    twoDPrograms.forEach((program, index) => {
      const columnIndex = 2;
      const rowIndex = index;
      const defaultX = 16 + (columnIndex * columnWidth);
      const defaultY = 16 + (rowIndex * ICON_HEIGHT);

      if (isDraggingIcon && draggedIcon === program.id) {
        icons.push({ ...program, x: dragPosition.x, y: dragPosition.y });
      } else {
        const savedPos = savedIconPositions[program.id];
        icons.push({ 
          ...program, 
          x: savedPos?.x ?? defaultX, 
          y: savedPos?.y ?? defaultY 
        });
      }
    });

    // About Program: Top right if games are hidden, center if games are shown
    const aboutPrograms = [
      { id: 'about', title: 'About', type: 'about' as const, category: 'about' }
    ].filter(program => !recycledPrograms.some(recycled => recycled.id === program.id));

    aboutPrograms.forEach((program) => {
      let defaultX, defaultY;
      if (showGames) {
        // Center of screen when games are visible
        defaultX = screenCenterX;
        defaultY = (window.innerHeight / 2) - TASKBAR_HEIGHT - (ICON_HEIGHT / 2);
      } else {
        // Top right corner when games are hidden
        defaultX = window.innerWidth - ICON_WIDTH - 16;
        defaultY = 16;
      }

      if (isDraggingIcon && draggedIcon === program.id) {
        icons.push({ ...program, x: dragPosition.x, y: dragPosition.y });
      } else {
        const savedPos = savedIconPositions[program.id];
        icons.push({ 
          ...program, 
          x: savedPos?.x ?? defaultX, 
          y: savedPos?.y ?? defaultY 
        });
      }
    });

    // Achievements Program: Below About program in both layouts
    const achievementsPrograms = [
      { id: 'achievements', title: 'Achievements', type: 'achievements' as const, category: 'achievements' }
    ].filter(program => !recycledPrograms.some(recycled => recycled.id === program.id));

    achievementsPrograms.forEach((program) => {
      let defaultX, defaultY;
      if (showGames) {
        // Below About in center when games are visible
        defaultX = screenCenterX;
        defaultY = (window.innerHeight / 2) - TASKBAR_HEIGHT - (ICON_HEIGHT / 2) + 80; // 80px below About
      } else {
        // Below About in top right when games are hidden
        defaultX = window.innerWidth - ICON_WIDTH - 16;
        defaultY = 16 + ICON_HEIGHT; // One icon height below About
      }

      if (isDraggingIcon && draggedIcon === program.id) {
        icons.push({ ...program, x: dragPosition.x, y: dragPosition.y });
      } else {
        const savedPos = savedIconPositions[program.id];
        icons.push({ 
          ...program, 
          x: savedPos?.x ?? defaultX, 
          y: savedPos?.y ?? defaultY 
        });
      }
    });

    // Add game programs in center (only if showGames is true)
    if (showGames) {
      const gamePrograms = [
        { id: 'solitaire', title: 'Solitaire', type: 'game' as const },
        { id: 'minesweeper', title: 'Minesweeper', type: 'game' as const },
        { id: 'pacman', title: 'PAC-MAN', type: 'game' as const },
        { id: 'snake', title: 'Snake', type: 'game' as const }
      ].filter(program => !recycledPrograms.some(recycled => recycled.id === program.id));

      gamePrograms.forEach((program, index) => {
        // Position games in top right, starting from the top
        const defaultX = window.innerWidth - ICON_WIDTH - 16;
        const defaultY = 16 + (index * ICON_HEIGHT);

        if (isDraggingIcon && draggedIcon === program.id) {
          icons.push({ ...program, x: dragPosition.x, y: dragPosition.y });
        } else {
          const savedPos = savedIconPositions[program.id];
          icons.push({ 
            ...program, 
            x: savedPos?.x ?? defaultX, 
            y: savedPos?.y ?? defaultY 
          });
        }
      });
    }

    // Add Recycle Bin at bottom right (fixed position)
    const recycleBinDefaultX = window.innerWidth - ICON_WIDTH - 16;
    const recycleBinDefaultY = window.innerHeight - TASKBAR_HEIGHT - ICON_HEIGHT - 16;
    const recycleBinPosition = (isDraggingIcon && draggedIcon === 'recycle') 
      ? { x: dragPosition.x, y: dragPosition.y }
      : { x: recycleBinDefaultX, y: recycleBinDefaultY };

    icons.push({ id: 'recycle', title: 'Recycle Bin', type: 'system', ...recycleBinPosition });
    return icons;
  };

  const desktopIcons = getDesktopIcons();

  const getFullIconTitle = (iconId: string) => {
    if (iconId === 'about') return 'About Rishith Chintala';
    if (iconId === 'achievements') return 'Achievement Center - Track Your Progress';
    if (iconId === 'recycle') return 'Recycle Bin';
    if (iconId === 'solitaire') return 'Solitaire - Classic Card Game';
    if (iconId === 'minesweeper') return 'Minesweeper - Classic Puzzle Game';
    if (iconId === 'pacman') return 'PAC-MAN - Classic Arcade Game';
    if (iconId === 'snake') return 'Snake - Classic Retro Game';
    const portfolio = portfolioData.find(p => p.id === iconId);
    return portfolio ? `${portfolio.title} - ${portfolio.type}` : '';
  };

  const getIconStyling = (icon: DesktopIcon) => {
    const isSelected = selectedIcon === icon.id;
    let iconColor = '#666666';
    let emoji = '📁';

    if (icon.id === 'about') {
      iconColor = isDarkMode ? '#63b3ed' : '#3182ce';
      emoji = 'i';
    } else if (icon.id === 'achievements') {
      iconColor = isDarkMode ? '#fbb6ce' : '#d53f8c';
      emoji = '🏆';
    } else if (icon.id === 'recycle') {
      iconColor = isDarkMode ? '#a0aec0' : '#718096';
      emoji = '🗑';
    } else if (icon.type === 'game') {
      switch (icon.id) {
        case 'solitaire':
          iconColor = isDarkMode ? '#f56565' : '#e53e3e';
          emoji = '🃏';
          break;
        case 'minesweeper':
          iconColor = isDarkMode ? '#fbb6ce' : '#d53f8c';
          emoji = '💣';
          break;
        case 'pacman':
          iconColor = isDarkMode ? '#fbb74a' : '#f6ad55';
          emoji = '🟡';
          break;
        case 'snake':
          iconColor = isDarkMode ? '#68d391' : '#38a169';
          emoji = '🐍';
          break;
      }
    } else if (icon.type === 'portfolio') {
      const portfolio = portfolioData.find(p => p.id === icon.id);
      if (portfolio) {
        switch (portfolio.category) {
          case 'photography':
            iconColor = isDarkMode ? '#60a5fa' : '#3b82f6';
            emoji = '📸';
            break;
          case '3d':
            iconColor = isDarkMode ? '#f87171' : '#ef4444';
            emoji = '🎯';
            break;
          case '2d':
            iconColor = isDarkMode ? '#4ade80' : '#22c55e';
            emoji = '🎨';
            break;
        }
      }
    }

    return { isSelected, iconColor, emoji };
  };

  // Icon interaction handlers
  const handleIconMouseDown = (e: React.MouseEvent, iconId: string, iconX: number, iconY: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIcon(iconId);
    setMouseDownPosition({ x: e.clientX, y: e.clientY });
    setIsPotentialDrag(true);
    setDraggedIcon(iconId);
    setDragOffset({ x: e.clientX - iconX, y: e.clientY - iconY });
    setDragPosition({ x: iconX, y: iconY });
  };

  const handleIconClick = (e: React.MouseEvent, iconId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIcon(iconId);
  };

  const handleIconDoubleClick = (iconId: string, iconType: string, isSystemApp?: boolean) => {
    if (!isDraggingIcon) {
      if (isSystemApp) {
        handleSystemAppClick(iconId);
      } else if (iconType !== 'system' || iconId === 'recycle') {
        openWindow(iconId);
      }
    }
  };

  // Drag handling effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPotentialDrag && !isDraggingIcon && mouseDownPosition && draggedIcon) {
        const deltaX = Math.abs(e.clientX - mouseDownPosition.x);
        const deltaY = Math.abs(e.clientY - mouseDownPosition.y);
        if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
          setIsDraggingIcon(true);
          setIsPotentialDrag(false);
        }
      }
      
      if (isDraggingIcon && draggedIcon) {
        const newX = Math.max(0, Math.min(window.innerWidth - ICON_WIDTH, e.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - TASKBAR_HEIGHT - ICON_HEIGHT, e.clientY - dragOffset.y));
        setDragPosition({ x: newX, y: newY });
        setIsOverRecycleBin(isPositionOverRecycleBin(newX + ICON_WIDTH/2, newY + ICON_HEIGHT/2, desktopIcons));
      }
    };

    const handleMouseUp = () => {
      if (isDraggingIcon && draggedIcon) {
        if (isOverRecycleBin && draggedIcon !== 'recycle') {
          recycleProgram(draggedIcon);
        } else {
          const finalPosition = findNearestAvailablePosition(dragPosition.x, dragPosition.y, desktopIcons, draggedIcon);
          const newPositions = { ...savedIconPositions, [draggedIcon]: finalPosition };
          setSavedIconPositions(newPositions);
          localStorage.setItem('xp-icon-positions', JSON.stringify(newPositions));
        }
      }
      
      setIsDraggingIcon(false);
      setIsPotentialDrag(false);
      setDraggedIcon(null);
      setMouseDownPosition(null);
      setIsOverRecycleBin(false);
    };

    if (isPotentialDrag || isDraggingIcon) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPotentialDrag, isDraggingIcon, draggedIcon, dragOffset, dragPosition, isOverRecycleBin, mouseDownPosition, desktopIcons, savedIconPositions]);

  // Render the desktop UI
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ fontFamily: 'Tahoma, sans-serif' }}>
      {/* Desktop Background */}
      <div 
        className="desktop absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/d/1D7tqgr9831287MHM0h0X3WaATO70ssqd?w=1920&h=1200&fit=crop')`
        }}
      >
        <div className="absolute inset-0" style={darkModeStyles.desktop}></div>
      </div>

      {/* Selected Icon Info Display */}
      {selectedIcon && (
        <div 
          className="fixed bottom-16 left-4 max-w-xs p-3 border-2 shadow-2xl z-40"
          style={{
            background: isDarkMode ? 'linear-gradient(180deg, #4a5568 0%, #2d3748 100%)' : 'linear-gradient(180deg, #f7fafc 0%, #edf2f7 100%)',
            borderColor: isDarkMode ? '#718096' : '#cbd5e0',
            borderRadius: '6px'
          }}
        >
          <div className="text-sm font-medium" style={{ color: isDarkMode ? '#f7fafc' : '#2d3748' }}>
            {getFullIconTitle(selectedIcon)}
          </div>
        </div>
      )}

      {/* Desktop Icons */}
      <div className="absolute inset-0" style={{ paddingBottom: '50px' }}>
        {desktopIcons.map((icon) => {
          const { isSelected, iconColor, emoji } = getIconStyling(icon);
          
          // Determine if this icon should animate
          const isAboutOrAchievements = icon.id === 'about' || icon.id === 'achievements';
          const isGame = icon.type === 'game';
          
          // Calculate animation props
          let animateProps = {};
          if (isAboutOrAchievements && !isDraggingIcon) {
            // Sliding animation for About/Achievements when games toggle
            animateProps = {
              left: icon.x,
              top: icon.y,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.5
              }
            };
          } else if (isGame && !isDraggingIcon) {
            // Pop-in animation for games
            animateProps = {
              left: icon.x,
              top: icon.y,
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 25,
                delay: 0.1
              }
            };
          }
          
          return (
            <motion.div 
              key={icon.id}
              className={`desktop-icon absolute flex flex-col items-center w-20 cursor-pointer group select-none ${
                isDraggingIcon && draggedIcon === icon.id ? 'scale-110 z-50' : ''
              } ${isSelected ? 'z-30 selected' : ''}`}
              data-icon-type={icon.type}
              data-icon-category={icon.category}
              style={{ 
                left: icon.x, 
                top: icon.y,
                opacity: isDraggingIcon && draggedIcon === icon.id ? 0.8 : 1
              }}
              initial={isGame ? { scale: 0, opacity: 0 } : false}
              animate={animateProps}
              data-icon-id={icon.id}
              onMouseDown={(e) => handleIconMouseDown(e, icon.id, icon.x, icon.y)}
              onClick={(e) => handleIconClick(e, icon.id)}
              onDoubleClick={() => handleIconDoubleClick(icon.id, icon.type, icon.isSystemApp || icon.type === 'game')}
            >
              <div 
                className={`desktop-icon-container w-12 h-12 shadow-lg flex items-center justify-center mb-1 transition-all duration-200 group-hover:shadow-xl border-2 ${
                  isSelected ? 'shadow-xl ring-2 ring-blue-400 ring-opacity-50' : ''
                }`}
                style={{
                  background: isDarkMode 
                    ? (isSelected 
                        ? 'linear-gradient(145deg, #1a4d80 0%, #0f3a5f 100%)' 
                        : 'linear-gradient(145deg, #1a1a1a 0%, #000000 100%)')
                    : (isSelected 
                        ? 'linear-gradient(145deg, #dbeafe 0%, #bfdbfe 100%)' 
                        : 'linear-gradient(145deg, #e0e0e0 0%, #a0a0a0 100%)'),
                  borderColor: (() => {
                    // Special program colors
                    if (icon.id === 'about') {
                      return isDarkMode ? '#facc15' : '#eab308'; // Yellow/Gold
                    }
                    if (icon.id === 'achievements') {
                      return isDarkMode ? '#facc15' : '#eab308'; // Yellow/Gold
                    }
                    if (icon.id === 'recycle') {
                      return isDarkMode ? '#1a1a1a' : '#000000'; // Black
                    }
                    // Portfolio programs get category-specific colors
                    if (icon.type === 'portfolio') {
                      const portfolio = portfolioData.find(p => p.id === icon.id);
                      if (portfolio) {
                        switch (portfolio.category) {
                          case 'photography':
                            return isDarkMode ? '#60a5fa' : '#3b82f6'; // Blue
                          case '3d':
                            return isDarkMode ? '#f87171' : '#ef4444'; // Red
                          case '2d':
                            return isDarkMode ? '#4ade80' : '#22c55e'; // Green
                        }
                      }
                    }
                    // Default border color for non-portfolio items
                    return isSelected ? (isDarkMode ? '#2563eb' : '#2563eb') : (isDarkMode ? '#2a2a2a' : '#808080');
                  })(),
                  borderRadius: '3px',
                  boxShadow: isDarkMode 
                    ? (isSelected 
                        ? '0 0 10px rgba(37, 99, 235, 0.6), 0 4px 6px rgba(0, 0, 0, 0.8)' 
                        : '0 2px 4px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.05)')
                    : (isSelected 
                        ? '0 0 8px rgba(37, 99, 235, 0.4), 0 4px 6px rgba(0, 0, 0, 0.1)' 
                        : '0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)')
                }}
              >
                <div 
                  className="desktop-icon-inner w-8 h-8 border flex items-center justify-center text-xs" 
                  style={{ 
                    background: isDarkMode 
                      ? (isSelected 
                          ? 'linear-gradient(145deg, #1a4d80 0%, #0f3a5f 100%)' 
                          : 'linear-gradient(145deg, #0a0a0a 0%, #000000 100%)') 
                      : (isSelected 
                          ? 'linear-gradient(145deg, #dbeafe 0%, #bfdbfe 100%)' 
                          : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'), 
                    borderColor: isDarkMode 
                      ? (isSelected ? '#2563eb' : '#1a1a1a') 
                      : (isSelected ? '#2563eb' : '#9ca3af'),
                    borderRadius: '2px',
                    color: isSelected 
                      ? (isDarkMode ? '#ffffff' : '#1e40af')
                      : iconColor,
                    boxShadow: isDarkMode 
                      ? 'inset 0 1px 2px rgba(0, 0, 0, 0.9), 0 1px 2px rgba(255, 255, 255, 0.03)' 
                      : 'inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <span style={{ fontWeight: icon.id === 'about' ? 'bold' : 'normal' }}>
                    {emoji}
                  </span>
                </div>
              </div>
              <span 
                className={`desktop-icon-label text-xs text-center px-1 py-0.5 shadow-md leading-tight ${isSelected ? 'shadow-lg' : ''}`}
                style={{ 
                  background: isSelected 
                    ? (isDarkMode ? 'rgba(37, 99, 235, 0.95)' : 'rgba(37, 99, 235, 0.9)')
                    : (isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 60, 113, 0.85)'), 
                  border: `1px solid ${isDarkMode 
                    ? (isSelected ? 'rgba(37, 99, 235, 0.8)' : 'rgba(26, 26, 26, 0.8)') 
                    : (isSelected ? 'rgba(37, 99, 235, 0.4)' : 'rgba(255, 255, 255, 0.3)')}`,
                  borderRadius: '3px',
                  maxWidth: '76px',
                  wordWrap: 'break-word',
                  color: isDarkMode 
                    ? (isSelected ? '#ffffff' : '#e0e0e0') 
                    : (isSelected ? 'white' : 'white'),
                  textShadow: isDarkMode 
                    ? '0 1px 2px rgba(0, 0, 0, 1)' 
                    : '0 1px 2px rgba(0, 0, 0, 0.6)',
                  boxShadow: isDarkMode 
                    ? '0 2px 4px rgba(0, 0, 0, 0.9)' 
                    : '0 1px 3px rgba(0, 0, 0, 0.3)'
                }}
              >
                {icon.title.length > 12 ? icon.title.substring(0, 12) + '...' : icon.title}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Windows - About Window */}
      <DraggableWindow
        title="About - Rishith Chintala"
        icon={<div className="w-4 h-4 border flex items-center justify-center text-xs" style={{ background: isDarkMode ? '#2d3748' : 'white', borderColor: isDarkMode ? '#718096' : '#cbd5e0', borderRadius: '1px', color: isDarkMode ? '#63b3ed' : '#3182ce' }}>i</div>}
        isOpen={windows.about.isOpen && !windows.about.isMinimized}
        onClose={() => closeWindow('about')}
        onMinimize={() => minimizeWindow('about')}
        onMaximize={() => maximizeWindow('about')}
        isMaximized={windows.about.isMaximized}
        zIndex={windows.about.zIndex}
        onFocus={() => focusWindow('about')}
        windowId="about"
        onPositionChange={handlePositionChange}
        initialPosition={windows.about.position}
      >
        <AboutApp isDarkMode={isDarkMode} />
      </DraggableWindow>

      {/* Achievements Window */}
      <DraggableWindow
        title="Achievement Center"
        icon={<div className="w-4 h-4 border flex items-center justify-center text-xs" style={{ background: isDarkMode ? '#2d3748' : 'white', borderColor: isDarkMode ? '#718096' : '#cbd5e0', borderRadius: '1px', color: isDarkMode ? '#fbb6ce' : '#d53f8c' }}>🏆</div>}
        isOpen={windows.achievements.isOpen && !windows.achievements.isMinimized}
        onClose={() => closeWindow('achievements')}
        onMinimize={() => minimizeWindow('achievements')}
        onMaximize={() => maximizeWindow('achievements')}
        isMaximized={windows.achievements.isMaximized}
        zIndex={windows.achievements.zIndex}
        onFocus={() => focusWindow('achievements')}
        windowId="achievements"
        onPositionChange={handlePositionChange}
        initialPosition={windows.achievements.position}
      >
        <AchievementsApp unlockedAchievements={unlockedAchievements} />
      </DraggableWindow>

      {/* Portfolio Windows */}
      {portfolioData.map((portfolio) => (
        <DraggableWindow
          key={portfolio.id}
          title={`${portfolio.title} - ${portfolio.type}`}
          icon={<div className="w-4 h-4 border flex items-center justify-center text-xs" style={{ background: isDarkMode ? '#2d3748' : 'white', borderColor: isDarkMode ? '#718096' : '#cbd5e0', borderRadius: '1px', color: portfolio.category === 'photography' ? (isDarkMode ? '#60a5fa' : '#3b82f6') : portfolio.category === '3d' ? (isDarkMode ? '#f87171' : '#ef4444') : (isDarkMode ? '#4ade80' : '#22c55e') }}>{portfolio.category === 'photography' ? '📸' : portfolio.category === '3d' ? '🎯' : '🎨'}</div>}
          isOpen={windows[portfolio.id] && windows[portfolio.id].isOpen && !windows[portfolio.id].isMinimized}
          onClose={() => closeWindow(portfolio.id)}
          onMinimize={() => minimizeWindow(portfolio.id)}
          onMaximize={() => maximizeWindow(portfolio.id)}
          isMaximized={windows[portfolio.id] && windows[portfolio.id].isMaximized}
          zIndex={windows[portfolio.id] && windows[portfolio.id].zIndex}
          onFocus={() => focusWindow(portfolio.id)}
          windowId={portfolio.id}
          onPositionChange={handlePositionChange}
          initialPosition={windows[portfolio.id] && windows[portfolio.id].position}
        >
          <ArtShowcaseApp {...portfolio} isDarkMode={isDarkMode} />
        </DraggableWindow>
      ))}

      {/* Control Panel Window */}
      <DraggableWindow
        title="Control Panel"
        icon={<div className="w-4 h-4 border flex items-center justify-center text-xs" style={{ background: isDarkMode ? '#2d3748' : 'white', borderColor: isDarkMode ? '#718096' : '#cbd5e0', borderRadius: '1px', color: isDarkMode ? '#a0aec0' : '#718096' }}>⚙️</div>}
        isOpen={windows.controlpanel.isOpen && !windows.controlpanel.isMinimized}
        onClose={() => closeWindow('controlpanel')}
        onMinimize={() => minimizeWindow('controlpanel')}
        onMaximize={() => maximizeWindow('controlpanel')}
        isMaximized={windows.controlpanel.isMaximized}
        zIndex={windows.controlpanel.zIndex}
        onFocus={() => focusWindow('controlpanel')}
        windowId="controlpanel"
        onPositionChange={handlePositionChange}
        initialPosition={windows.controlpanel.position}
      >
        <ControlPanelApp 
          onDarkModeToggle={handleDarkModeToggle}
          onOpenMediaPlayer={handleOpenMediaPlayer}
          onModernVersionLaunch={handleModernVersionLaunch}
          onSiteRefresh={handleSiteRefresh}
        />
      </DraggableWindow>

      {/* System Application Windows */}
      {['ie', 'mydocs', 'mypics', 'mymusic'].map((appId) => {
        const appConfigs = {
          ie: { title: 'Internet Explorer', icon: '🌐', color: isDarkMode ? '#68d391' : '#38a169', component: InternetExplorerApp },
          mydocs: { title: 'File Explorer', icon: '📁', color: isDarkMode ? '#f6ad55' : '#ed8936', component: FileExplorerApp },
          mypics: { title: 'My Pictures', icon: '🖼️', color: isDarkMode ? '#fc8181' : '#e53e3e', component: MyPicturesApp },
          mymusic: { title: 'Windows Media Player', icon: '🎵', color: isDarkMode ? '#9f7aea' : '#805ad5', component: MyMusicApp }
        };
        
        const config = appConfigs[appId as keyof typeof appConfigs];
        const Component = config.component;
        
        return (
          <DraggableWindow
            key={appId}
            title={config.title}
            icon={<div className="w-4 h-4 border flex items-center justify-center text-xs" style={{ background: isDarkMode ? '#2d3748' : 'white', borderColor: isDarkMode ? '#718096' : '#cbd5e0', borderRadius: '1px', color: config.color }}>{config.icon}</div>}
            isOpen={windows[appId].isOpen && !windows[appId].isMinimized}
            onClose={() => closeWindow(appId)}
            onMinimize={() => minimizeWindow(appId)}
            onMaximize={() => maximizeWindow(appId)}
            isMaximized={windows[appId].isMaximized}
            zIndex={windows[appId].zIndex}
            onFocus={() => focusWindow(appId)}
            windowId={appId}
            onPositionChange={handlePositionChange}
            initialPosition={windows[appId].position}
          >
            <Component isDarkMode={isDarkMode} />
          </DraggableWindow>
        );
      })}

      {/* Game Application Windows */}
      {['solitaire', 'minesweeper', 'pacman', 'snake'].map((gameId) => {
        const gameConfigs = {
          solitaire: { title: 'Solitaire', icon: '🃏', color: isDarkMode ? '#f56565' : '#e53e3e', component: SolitaireApp },
          minesweeper: { title: 'Minesweeper', icon: '💣', color: isDarkMode ? '#fbb6ce' : '#d53f8c', component: MinesweeperApp },
          pacman: { title: 'PAC-MAN', icon: '🟡', color: isDarkMode ? '#fbb74a' : '#f6ad55', component: PacmanApp },
          snake: { title: 'Snake', icon: '🐍', color: isDarkMode ? '#68d391' : '#38a169', component: SnakeApp }
        };
        
        const config = gameConfigs[gameId as keyof typeof gameConfigs];
        const Component = config.component;
        
        return (
          <DraggableWindow
            key={gameId}
            title={config.title}
            icon={<div className="w-4 h-4 border flex items-center justify-center text-xs" style={{ background: isDarkMode ? '#2d3748' : 'white', borderColor: isDarkMode ? '#718096' : '#cbd5e0', borderRadius: '1px', color: config.color }}>{config.icon}</div>}
            isOpen={windows[gameId].isOpen && !windows[gameId].isMinimized}
            onClose={() => closeWindow(gameId)}
            onMinimize={() => minimizeWindow(gameId)}
            onMaximize={() => maximizeWindow(gameId)}
            isMaximized={windows[gameId].isMaximized}
            zIndex={windows[gameId].zIndex}
            onFocus={() => focusWindow(gameId)}
            windowId={gameId}
            onPositionChange={handlePositionChange}
            initialPosition={windows[gameId].position}
          >
            <Component />
          </DraggableWindow>
        );
      })}

      {/* Recycle Bin Window */}
      <DraggableWindow
        title="Recycle Bin"
        icon={<div className="w-4 h-4 border flex items-center justify-center text-xs" style={{ background: isDarkMode ? '#2d3748' : 'white', borderColor: isDarkMode ? '#718096' : '#a0aec0', borderRadius: '1px', color: isDarkMode ? '#a0aec0' : '#718096' }}>🗑</div>}
        isOpen={windows.recycle.isOpen && !windows.recycle.isMinimized}
        onClose={() => closeWindow('recycle')}
        onMinimize={() => minimizeWindow('recycle')}
        onMaximize={() => maximizeWindow('recycle')}
        isMaximized={windows.recycle.isMaximized}
        zIndex={windows.recycle.zIndex}
        onFocus={() => focusWindow('recycle')}
        windowId="recycle"
        onPositionChange={handlePositionChange}
        initialPosition={windows.recycle.position}
      >
        <RecycleBinApp 
          recycledPrograms={recycledPrograms}
          onRestore={restoreProgram}
          onEmptyRecycleBin={emptyRecycleBin}
        />
      </DraggableWindow>

      {/* Start Menu */}
      {startMenuOpen && (
        <div 
          className="fixed bottom-14 left-0 w-96 shadow-2xl border-2"
          style={{
            height: 'calc(100vh - 120px)',
            maxHeight: '600px',
            background: isDarkMode 
              ? 'linear-gradient(180deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)'
              : 'linear-gradient(180deg, #f0f8ff 0%, #e6f3ff 50%, #cce7ff 100%)',
            borderColor: isDarkMode ? '#718096' : '#4682b4',
            borderRadius: '0 8px 0 0',
            fontFamily: 'Tahoma, sans-serif',
            zIndex: 9999
          }}
        >
          {/* Start Menu Header */}
          <div 
            className="h-16 flex items-center px-4 text-white"
            style={{
              background: isDarkMode 
                ? 'linear-gradient(90deg, #4a5568 0%, #718096 50%, #a0aec0 100%)'
                : 'linear-gradient(90deg, #4682b4 0%, #5a9fd4 50%, #6bb6df 100%)',
              borderRadius: '0 6px 0 0',
              borderBottom: `2px solid ${isDarkMode ? '#a0aec0' : '#2e5984'}`
            }}
          >
            <div 
              className="w-12 h-12 rounded-full mr-3 flex items-center justify-center border-2 shadow-inner"
              style={{ background: isDarkMode ? '#2d3748' : 'white', borderColor: isDarkMode ? '#a0aec0' : '#87ceeb' }}
            >
              <div className="w-8 h-8 rounded-full" style={{ background: isDarkMode ? 'linear-gradient(45deg, #718096 0%, #a0aec0 100%)' : 'linear-gradient(45deg, #4682b4 0%, #87ceeb 100%)' }}></div>
            </div>
            <div>
              <div className="text-lg font-semibold">User</div>
              <div className="text-xs opacity-90">Administrator {isDarkMode ? '(Dark Mode)' : ''}</div>
            </div>
          </div>

          {/* Start Menu Content - Scrollable */}
          <div className="flex" style={{ height: 'calc(100% - 112px)' }}>
            <div 
              className="flex-1 overflow-y-auto xp-scrollbar"
              style={{ 
                background: isDarkMode ? '#2d3748' : 'white',
                borderRight: `1px solid ${isDarkMode ? '#4a5568' : '#c0c0c0'}`
              }}
            >
              <div className="p-2">
                {/* System Applications */}
                <div className="mb-3">
                  <div className="text-xs mb-2 px-2" style={{ color: isDarkMode ? '#e2e8f0' : '#666666' }}>System Applications</div>
                  {[
                    { id: 'ie', title: 'Internet Explorer', icon: '🌐' },
                    { id: 'mydocs', title: 'My Documents', icon: '📁' },
                    { id: 'mypics', title: 'My Pictures', icon: '🖼️' },
                    { id: 'mymusic', title: 'My Music', icon: '🎵' },
                    { id: 'controlpanel', title: 'Control Panel', icon: '⚙️' }
                  ].map((app) => (
                    <div 
                      key={app.id}
                      className="flex items-center p-2 cursor-pointer transition-colors rounded"
                      onClick={() => { 
                        if (app.id === 'controlpanel') {
                          handleSystemAppClick(app.id);
                        } else {
                          openWindow(app.id);
                        }
                        setStartMenuOpen(false); 
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#4a5568' : '#e8f0fe'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div className="w-8 h-8 mr-3 border flex items-center justify-center" style={{ background: isDarkMode ? 'linear-gradient(145deg, #718096 0%, #4a5568 100%)' : 'linear-gradient(145deg, #e0e0e0 0%, #a0a0a0 100%)', borderColor: isDarkMode ? '#a0aec0' : '#808080', borderRadius: '2px' }}>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>{app.icon}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: isDarkMode ? '#f7fafc' : 'black' }}>{app.title}</div>
                        <div className="text-xs" style={{ color: isDarkMode ? '#cbd5e0' : '#666666' }}>System application</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Separator */}
                <div className="mx-2 mb-3" style={{ borderTop: `1px solid ${isDarkMode ? '#4a5568' : '#e0e0e0'}` }}></div>

                {/* Portfolio Programs */}
                <div className="mb-3">
                  <div className="text-xs mb-2 px-2" style={{ color: isDarkMode ? '#e2e8f0' : '#666666' }}>Portfolio Programs</div>
                  
                  {/* About */}
                  <div 
                    className="flex items-center p-2 cursor-pointer transition-colors rounded"
                    onClick={() => { openWindow('about'); setStartMenuOpen(false); }}
                    onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#4a5568' : '#e8f0fe'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div className="w-8 h-8 mr-3 border flex items-center justify-center" style={{ background: isDarkMode ? 'linear-gradient(145deg, #718096 0%, #4a5568 100%)' : 'linear-gradient(145deg, #e0e0e0 0%, #a0a0a0 100%)', borderColor: isDarkMode ? '#a0aec0' : '#808080', borderRadius: '2px' }}>
                      <span className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} style={{ fontWeight: 'bold' }}>i</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: isDarkMode ? '#f7fafc' : 'black' }}>About</div>
                      <div className="text-xs" style={{ color: isDarkMode ? '#cbd5e0' : '#666666' }}>About Rishith</div>
                    </div>
                  </div>

                  {/* Portfolio Categories in Order */}
                  {[
                    { category: 'photography', label: 'Photography', icon: '📸', color: isDarkMode ? '#60a5fa' : '#3b82f6' },
                    { category: '3d', label: '3D Design', icon: '🎯', color: isDarkMode ? '#f87171' : '#ef4444' },
                    { category: '2d', label: '2D Design', icon: '🎨', color: isDarkMode ? '#4ade80' : '#22c55e' }
                  ].map(categoryInfo => {
                    const categoryItems = portfolioData.filter(item => item.category === categoryInfo.category && !recycledPrograms.some(r => r.id === item.id));
                    if (categoryItems.length === 0) return null;

                    return (
                      <div key={categoryInfo.category} className="mb-2">
                        <div className="text-xs mb-1 px-2 font-medium" style={{ color: categoryInfo.color }}>
                          {categoryInfo.icon} {categoryInfo.label}
                        </div>
                        {categoryItems.map((item) => (
                          <div 
                            key={item.id}
                            className="flex items-center p-2 ml-2 cursor-pointer transition-colors rounded"
                            onClick={() => { openWindow(item.id); setStartMenuOpen(false); }}
                            onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#4a5568' : '#e8f0fe'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <div className="w-6 h-6 mr-2 border flex items-center justify-center" style={{ background: isDarkMode ? 'linear-gradient(145deg, #718096 0%, #4a5568 100%)' : 'linear-gradient(145deg, #e0e0e0 0%, #a0a0a0 100%)', borderColor: isDarkMode ? '#a0aec0' : '#808080', borderRadius: '1px' }}>
                              <span className="text-xs" style={{ color: categoryInfo.color }}>{categoryInfo.icon}</span>
                            </div>
                            <div>
                              <div className="text-sm" style={{ color: isDarkMode ? '#f7fafc' : 'black' }}>{item.title}</div>
                              <div className="text-xs" style={{ color: isDarkMode ? '#cbd5e0' : '#666666' }}>{item.type}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Side - Recently Used */}
            <div className="w-40 p-3" style={{ background: isDarkMode ? '#4a5568' : '#e6f3ff' }}>
              <div className="space-y-3">
                <div className="text-xs mb-3" style={{ color: isDarkMode ? '#e2e8f0' : '#666666' }}>Recently Used</div>
                {[
                  { icon: '🌐', label: 'Internet', onClick: () => openWindow('ie') },
                  { icon: '📁', label: 'Documents', onClick: () => openWindow('mydocs') },
                  { icon: '🖼️', label: 'Pictures', onClick: () => openWindow('mypics') },
                  { icon: '🎵', label: 'Music', onClick: () => openWindow('mymusic') }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-2 text-xs cursor-pointer transition-colors rounded" 
                    style={{ color: isDarkMode ? '#f7fafc' : '#2f4f4f' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#718096' : '#f0f8ff'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => { item.onClick(); }}
                  >
                    <div className="w-6 h-6 mr-2 border text-xs flex items-center justify-center" style={{ background: isDarkMode ? 'linear-gradient(145deg, #718096 0%, #4a5568 100%)' : 'linear-gradient(145deg, #e0e0e0 0%, #a0a0a0 100%)', borderColor: isDarkMode ? '#a0aec0' : '#808080', borderRadius: '2px' }}>
                      {item.icon}
                    </div>
                    {item.label}
                  </div>
                ))}
                
                {/* Separator */}
                <div className="my-2" style={{ borderTop: `1px solid ${isDarkMode ? '#718096' : '#d0d0d0'}` }}></div>
                
                {/* Games Toggle Button */}
                <div 
                  className="flex items-center p-2 text-xs cursor-pointer transition-colors rounded" 
                  style={{ color: isDarkMode ? '#f7fafc' : '#2f4f4f' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#718096' : '#f0f8ff'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  onClick={() => {
                    setShowGames(!showGames);
                    // Clear saved positions when toggling
                    const newPositions = { ...savedIconPositions };
                    delete newPositions['about'];
                    delete newPositions['achievements'];
                    if (!showGames) {
                      // Clearing game positions when showing them
                      ['solitaire', 'minesweeper', 'pacman', 'snake'].forEach(id => {
                        delete newPositions[id];
                      });
                    }
                    setSavedIconPositions(newPositions);
                    localStorage.setItem('xp-icon-positions', JSON.stringify(newPositions));
                  }}
                >
                  <div className="w-6 h-6 mr-2 border text-xs flex items-center justify-center" style={{ background: showGames ? (isDarkMode ? 'linear-gradient(145deg, #68d391 0%, #38a169 100%)' : 'linear-gradient(145deg, #90EE90 0%, #32CD32 100%)') : (isDarkMode ? 'linear-gradient(145deg, #718096 0%, #4a5568 100%)' : 'linear-gradient(145deg, #e0e0e0 0%, #a0a0a0 100%)'), borderColor: isDarkMode ? '#a0aec0' : '#808080', borderRadius: '2px' }}>
                    🎮
                  </div>
                  <div>
                    <div style={{ fontWeight: '500' }}>{showGames ? 'Hide Games' : 'Show Games'}</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>Toggle visibility</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Start Menu Footer */}
          <div 
            className="h-12 flex items-center justify-between px-4 border-t-2"
            style={{ 
              background: isDarkMode 
                ? 'linear-gradient(180deg, #4a5568 0%, #2d3748 100%)' 
                : 'linear-gradient(180deg, #cce7ff 0%, #b3d9ff 100%)', 
              borderTopColor: isDarkMode ? '#718096' : '#4682b4'
            }}
          >
            <button 
              className="flex items-center text-xs px-2 py-1 rounded transition-colors" 
              style={{ color: isDarkMode ? '#f7fafc' : '#2f4f4f' }}
              onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#718096' : '#e8f0fe'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              onClick={handleLogOff}
            >
              <div className="w-5 h-5 mr-2 border" style={{ background: isDarkMode ? 'linear-gradient(45deg, #fc8181 0%, #e53e3e 100%)' : 'linear-gradient(45deg, #ff6347 0%, #ff4500 100%)', borderColor: isDarkMode ? '#e53e3e' : '#cd5c5c', borderRadius: '2px' }}></div>
              Log Off
            </button>
            <button 
              className="flex items-center text-xs px-2 py-1 rounded transition-colors" 
              style={{ color: isDarkMode ? '#f7fafc' : '#2f4f4f' }}
              onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#718096' : '#e8f0fe'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              onClick={() => {
                setStartMenuOpen(false);
                onTurnOff();
              }}
            >
              <div className="w-5 h-5 mr-2 border" style={{ 
                background: isDarkMode 
                  ? 'linear-gradient(45deg, #38a169 0%, #48bb78 100%)' 
                  : 'linear-gradient(45deg, #696969 0%, #2f4f4f 100%)', 
                borderColor: isDarkMode ? '#38a169' : '#2f4f4f', 
                borderRadius: '2px' 
              }}></div>
              {isDarkMode ? 'Turn On Computer' : 'Turn Off Computer'}
            </button>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div 
        className="taskbar fixed bottom-0 left-0 right-0 h-14 shadow-lg flex items-center border-t-2"
        style={{ ...darkModeStyles.taskbar, fontFamily: 'Tahoma, sans-serif', zIndex: 9000 }}
      >
        {/* Start Button */}
        <button 
          className={`start-button h-10 px-6 mx-1 shadow-md flex items-center space-x-2 transition-all border-2 ${startMenuOpen ? 'shadow-inner' : 'shadow-lg'}`}
          onClick={() => setStartMenuOpen(!startMenuOpen)}
          style={{
            background: startMenuOpen ? darkModeStyles.startButton.backgroundPressed : darkModeStyles.startButton.backgroundNormal,
            borderColor: startMenuOpen ? (isDarkMode ? '#4a5568' : '#1e3f5a') : darkModeStyles.startButton.borderColor,
            borderRadius: '3px'
          }}
        >
          <div 
            className="w-6 h-6 flex items-center justify-center border"
            style={{ background: isDarkMode ? '#2d3748' : 'white', borderColor: isDarkMode ? '#718096' : '#ccc', borderRadius: '2px' }}
          >
            <div className="w-4 h-4 grid grid-cols-2 gap-0.5" style={{ borderRadius: '1px' }}>
              <div style={{ background: isDarkMode ? '#dd6b20' : '#ff6b35', borderRadius: '1px' }}></div>
              <div style={{ background: isDarkMode ? '#38a169' : '#7db46c', borderRadius: '1px' }}></div>
              <div style={{ background: isDarkMode ? '#3182ce' : '#4fc3f7', borderRadius: '1px' }}></div>
              <div style={{ background: isDarkMode ? '#ed8936' : '#ffeb3b', borderRadius: '1px' }}></div>
            </div>
          </div>
          <span className="text-white text-sm font-semibold">Start</span>
        </button>

        {/* Quick Launch - System Apps */}
        <div className="flex items-center space-x-1 ml-2 mr-4">
          {[
            { id: 'ie', icon: '🌐', title: 'Internet Explorer' },
            { id: 'mydocs', icon: '📁', title: 'My Documents' },
            { id: 'mypics', icon: '🖼️', title: 'My Pictures' },
            { id: 'mymusic', icon: '🎵', title: 'My Music' },
            { id: 'controlpanel', icon: '⚙️', title: 'Control Panel' }
          ].map((app) => (
            <div 
              key={app.id}
              className="w-9 h-9 border cursor-pointer hover:shadow-lg transition-shadow flex items-center justify-center"
              style={{ 
                background: isDarkMode ? 'linear-gradient(145deg, #4a5568 0%, #2d3748 100%)' : 'linear-gradient(145deg, #e6f3ff 0%, #4682b4 100%)', 
                borderColor: isDarkMode ? '#718096' : '#2e5984',
                borderRadius: '2px'
              }}
              onClick={() => handleSystemAppClick(app.id)}
              title={app.title}
            >
              <div className="text-white text-sm">{app.icon}</div>
            </div>
          ))}
        </div>

        {/* Taskbar Applications */}
        <div className="taskbar-window-buttons flex-1 flex items-center space-x-1 overflow-x-auto">
          {Object.entries(windows)
            .filter(([_, window]) => window.isOpen)
            .sort(([, a], [, b]) => a.zIndex - b.zIndex) // Sort by z-index to maintain order
            .map(([windowId, window]) => {
              const isAbout = windowId === 'about';
              const isAchievements = windowId === 'achievements';
              const isRecycle = windowId === 'recycle';
              const isGame = ['solitaire', 'minesweeper', 'pacman', 'snake'].includes(windowId);
              const isSystemApp = ['ie', 'mydocs', 'mypics', 'mymusic', 'controlpanel'].includes(windowId);
              const portfolioPiece = !isAbout && !isAchievements && !isRecycle && !isSystemApp && !isGame ? portfolioData.find(p => p.id === windowId) : null;
              
              // Determine if this window is currently active (has highest z-index)
              const allOpenWindows = Object.entries(windows).filter(([_, w]) => w.isOpen);
              const highestZ = Math.max(...allOpenWindows.map(([_, w]) => w.zIndex));
              const isActive = window.zIndex === highestZ && !window.isMinimized;
              
              let title = windowId;
              let icon = '📁';
              
              if (isAbout) {
                title = 'About';
                icon = 'i';
              } else if (isAchievements) {
                title = 'Achievements';
                icon = '🏆';
              } else if (isRecycle) {
                title = 'Recycle Bin';
                icon = '🗑';
              } else if (windowId === 'ie') {
                title = 'Internet Explorer';
                icon = '🌐';
              } else if (windowId === 'mydocs') {
                title = 'My Documents';
                icon = '📁';
              } else if (windowId === 'mypics') {
                title = 'My Pictures';
                icon = '🖼️';
              } else if (windowId === 'mymusic') {
                title = 'Windows Media Player';
                icon = '🎵';
              } else if (windowId === 'controlpanel') {
                title = 'Control Panel';
                icon = '⚙️';
              } else if (windowId === 'solitaire') {
                title = 'Solitaire';
                icon = '🃏';
              } else if (windowId === 'minesweeper') {
                title = 'Minesweeper';
                icon = '💣';
              } else if (windowId === 'pacman') {
                title = 'PAC-MAN';
                icon = '🟡';
              } else if (windowId === 'snake') {
                title = 'Snake';
                icon = '🐍';
              } else if (portfolioPiece) {
                title = portfolioPiece.title;
                icon = portfolioPiece.category === 'photography' ? '📸' : portfolioPiece.category === '3d' ? '🎯' : '🎨';
              }
              
              return (
                <div
                  key={windowId}
                  className={`h-9 px-2 text-xs text-white border-2 flex items-center transition-all flex-shrink-0 group ${
                    window.isMinimized ? 'opacity-80' : 'opacity-100'
                  } ${isActive ? 'shadow-inner' : 'shadow-md'}`}
                  style={{
                    background: isActive
                      ? (isDarkMode 
                        ? 'linear-gradient(180deg, #4a5568 0%, #2d3748 50%, #1a202c 100%)' 
                        : 'linear-gradient(180deg, #2e5984 0%, #1e4f7a 50%, #0d3f5a 100%)')
                      : window.isMinimized
                      ? (isDarkMode 
                        ? 'linear-gradient(180deg, #2d3748 0%, #1a202c 100%)' 
                        : 'linear-gradient(180deg, #4682b4 0%, #2e5984 100%)')
                      : (isDarkMode 
                        ? 'linear-gradient(180deg, #718096 0%, #4a5568 100%)' 
                        : 'linear-gradient(180deg, #6ba3d4 0%, #5a9fd4 100%)'),
                    borderColor: isActive 
                      ? (isDarkMode ? '#2d3748' : '#0d3f5a')
                      : (isDarkMode ? '#a0aec0' : '#87ceeb'),
                    borderRadius: '3px',
                    minWidth: '140px',
                    maxWidth: '180px',
                    boxShadow: isActive 
                      ? 'inset 0 2px 4px rgba(0, 0, 0, 0.3)' 
                      : '0 2px 4px rgba(0, 0, 0, 0.2)',
                    borderBottomWidth: isActive ? '1px' : '2px',
                    borderTopWidth: isActive ? '2px' : '1px'
                  }}
                >
                  <button
                    className="flex items-center space-x-2 flex-1 min-w-0"
                    onClick={() => {
                      if (window.isMinimized) {
                        // Restore from minimized
                        setWindows(prev => ({ ...prev, [windowId]: { ...prev[windowId], isMinimized: false } }));
                        focusWindow(windowId);
                      } else if (isActive) {
                        // If already active, minimize it (like real Windows XP)
                        minimizeWindow(windowId);
                      } else {
                        // Bring to front
                        focusWindow(windowId);
                      }
                    }}
                  >
                    <div 
                      className={`w-6 h-6 border flex items-center justify-center flex-shrink-0`}
                      style={{ 
                        background: isDarkMode 
                          ? 'linear-gradient(145deg, #718096 0%, #4a5568 100%)' 
                          : 'linear-gradient(145deg, #f0f0f0 0%, #d0d0d0 100%)',
                        borderColor: isDarkMode ? '#a0aec0' : '#999',
                        borderRadius: '2px',
                        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <span className="text-sm" style={{ 
                        color: isAbout ? (isDarkMode ? '#63b3ed' : '#3182ce') : (isDarkMode ? '#e0e0e0' : '#2d3748'),
                        fontWeight: isAbout ? 'bold' : 'normal'
                      }}>
                        {icon}
                      </span>
                    </div>
                    <span className="truncate flex-1 text-left">{title}</span>
                  </button>
                  <button
                    className="w-4 h-4 flex items-center justify-center flex-shrink-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 rounded"
                    style={{
                      background: 'transparent',
                      border: 'none'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      closeWindow(windowId);
                    }}
                    title="Close"
                  >
                    <span className="text-white text-xs leading-none" style={{ fontWeight: 'bold' }}>×</span>
                  </button>
                </div>
              );
            })}
        </div>

        {/* System Tray */}
        <div className="system-tray flex items-center space-x-2 mr-2">
          <div className="flex items-center space-x-1">
            {[
              { 
                color: isDarkMode ? 'linear-gradient(45deg, #a0aec0 0%, #718096 100%)' : 'linear-gradient(45deg, #d3d3d3 0%, #a9a9a9 100%)', 
                border: isDarkMode ? '#4a5568' : '#696969', 
                title: 'Chicken Nugget Screen',
                onClick: triggerChickenNuggetScreen
              },
              { 
                color: isDarkMode ? 'linear-gradient(45deg, #38a169 0%, #2f855a 100%)' : 'linear-gradient(45deg, #90ee90 0%, #32cd32 100%)', 
                border: isDarkMode ? '#2f855a' : '#228b22', 
                title: 'Confetti Screen',
                onClick: triggerConfettiScreen
              },
              { 
                color: isDarkMode ? 'linear-gradient(45deg, #3182ce 0%, #2c5282 100%)' : 'linear-gradient(45deg, #87ceeb 0%, #4682b4 100%)', 
                border: isDarkMode ? '#2c5282' : '#2e5984', 
                title: 'Windows Logo Screen',
                onClick: triggerWindowsLogoScreen
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="w-5 h-5 border cursor-pointer hover:opacity-80 transition-opacity hover:scale-110"
                style={{ background: item.color, borderColor: item.border, borderRadius: '1px' }}
                title={`Double-click for ${item.title}`}
                onDoubleClick={item.onClick}
              ></div>
            ))}
          </div>
          
          {/* Clock */}
          <WindowsXPClock isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Achievement Notification */}
      {currentNotification && (
        <AchievementNotification
          achievement={currentNotification}
          onClose={() => setCurrentNotification(null)}
        />
      )}

      {/* Click outside start menu to close */}
      {startMenuOpen && (
        <div 
          className="fixed inset-0 cursor-default"
          style={{ zIndex: 9998 }}
          onClick={() => setStartMenuOpen(false)}
        ></div>
      )}

      {/* Screen Effects */}
      {/* Confetti Screen */}
      {showConfettiScreen && (
        <div className={`fixed inset-0 z-[9999] pointer-events-none ${confettiFadingOut ? 'screen-fade-out' : 'screen-pop-in'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-yellow-400/20 confetti-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl font-bold text-white animate-bounce drop-shadow-2xl">
                🎉 SURPRISE! 🎉
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chicken Nugget Screen */}
      {showChickenNuggetScreen && (
        <div className={`fixed inset-0 z-[9999] pointer-events-none bg-gradient-to-b from-yellow-300 to-orange-400 ${nuggetFadingOut ? 'screen-fade-out' : 'screen-pop-in'}`}>
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 50 }, (_, i) => (
              <div
                key={i}
                className="absolute text-4xl animate-bounce nugget-rotate"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              >
                🍗
              </div>
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl font-bold text-orange-900 mb-4 confetti-pulse drop-shadow-2xl">
                  🍗 NUGGET TIME! 🍗
                </div>
                <div className="text-2xl text-orange-800 font-semibold animate-bounce">
                  Crispy & Delicious!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Windows Logo Screen */}
      {showWindowsLogoScreen && (
        <div className={`fixed inset-0 z-[9999] pointer-events-none bg-gradient-to-br from-blue-600 to-blue-800 ${logoFadingOut ? 'screen-fade-out' : 'screen-pop-in'}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-9xl mb-8 logo-spin">
                🪟
              </div>
              <div className="text-6xl font-bold text-white mb-4 confetti-pulse drop-shadow-2xl">
                Windows XP
              </div>
              <div className="text-2xl text-blue-200 font-semibold animate-bounce">
                Portfolio Edition
              </div>
              <div className="mt-8 flex justify-center space-x-4">
                {['🟥', '🟩', '🟨', '🟦'].map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 text-2xl animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    {color}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}