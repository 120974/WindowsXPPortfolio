export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  points: number;
  category?: 'Getting Started' | 'Gaming' | 'Portfolio' | 'System' | 'Easter Eggs' | 'Master';
  hint?: string;
}

export const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  // ==================== GETTING STARTED (4 achievements) ====================
  { 
    id: 'first_boot', 
    title: 'Welcome to XP', 
    description: 'Successfully booted into Rishith\'s authentic Windows XP portfolio experience', 
    icon: '🖥️', 
    rarity: 'Common', 
    points: 10,
    category: 'Getting Started',
    hint: 'Complete the welcome screen'
  },
  { 
    id: 'desktop_explorer', 
    title: 'Desktop Explorer', 
    description: 'Opened your first application window on this interactive desktop', 
    icon: '📂', 
    rarity: 'Common', 
    points: 15,
    category: 'Getting Started',
    hint: 'Double-click any desktop icon'
  },
  { 
    id: 'window_mover', 
    title: 'Window Whisperer', 
    description: 'Mastered the art of dragging and repositioning windows across the desktop', 
    icon: '🪟', 
    rarity: 'Uncommon', 
    points: 20,
    category: 'Getting Started',
    hint: 'Drag a window by its title bar'
  },
  { 
    id: 'taskbar_master', 
    title: 'Taskbar Navigator', 
    description: 'Used the taskbar to efficiently switch between open applications', 
    icon: '📊', 
    rarity: 'Uncommon', 
    points: 25,
    category: 'Getting Started',
    hint: 'Click on taskbar buttons to manage windows'
  },

  // ==================== GAMING (5 achievements) ====================
  { 
    id: 'solitaire_player', 
    title: 'Card Shark', 
    description: 'Played the timeless classic Solitaire - a Windows XP staple', 
    icon: '🃏', 
    rarity: 'Common', 
    points: 15,
    category: 'Gaming',
    hint: 'Launch the Solitaire game'
  },
  { 
    id: 'minesweeper_brave', 
    title: 'Bomb Squad Recruit', 
    description: 'Bravely faced the challenge of the legendary Minesweeper puzzle', 
    icon: '💣', 
    rarity: 'Common', 
    points: 15,
    category: 'Gaming',
    hint: 'Open and play Minesweeper'
  },
  { 
    id: 'pacman_chomper', 
    title: 'Pac-Attack', 
    description: 'Chomped through the nostalgic PAC-MAN arcade experience', 
    icon: '👻', 
    rarity: 'Uncommon', 
    points: 20,
    category: 'Gaming',
    hint: 'Play the PAC-MAN game'
  },
  { 
    id: 'snake_slitherer', 
    title: 'Snake Charmer', 
    description: 'Navigated the serpentine challenges of the classic Snake game', 
    icon: '🐍', 
    rarity: 'Uncommon', 
    points: 20,
    category: 'Gaming',
    hint: 'Control the snake without crashing'
  },
  { 
    id: 'gaming_legend', 
    title: 'Retro Gaming Legend', 
    description: 'Played all four classic games - you\'re a true arcade champion!', 
    icon: '🎮', 
    rarity: 'Epic', 
    points: 100,
    category: 'Gaming',
    hint: 'Play Solitaire, Minesweeper, PAC-MAN, and Snake'
  },

  // ==================== PORTFOLIO (6 achievements) ====================
  { 
    id: 'portfolio_viewer', 
    title: 'Art Appreciator', 
    description: 'Discovered Rishith\'s professional creative portfolio and artistic vision', 
    icon: '🎨', 
    rarity: 'Common', 
    points: 20,
    category: 'Portfolio',
    hint: 'Open any portfolio project'
  },
  { 
    id: 'photo_enthusiast', 
    title: 'Photography Enthusiast', 
    description: 'Explored the photography collection showcasing captured moments and perspectives', 
    icon: '📸', 
    rarity: 'Uncommon', 
    points: 25,
    category: 'Portfolio',
    hint: 'View photography portfolio items'
  },
  { 
    id: 'design_admirer', 
    title: 'Design Connoisseur', 
    description: 'Appreciated both 2D and 3D design work across multiple creative disciplines', 
    icon: '🎯', 
    rarity: 'Uncommon', 
    points: 30,
    category: 'Portfolio',
    hint: 'View both 2D and 3D design projects'
  },

  // ==================== SYSTEM (7 achievements) ====================
  { 
    id: 'about_reader', 
    title: 'Getting Personal', 
    description: 'Learned about Rishith\'s background, skills, education, and professional journey', 
    icon: '👤', 
    rarity: 'Common', 
    points: 20,
    category: 'System',
    hint: 'Open the About program'
  },
  { 
    id: 'achievement_hunter', 
    title: 'Achievement Hunter', 
    description: 'Opened the Achievement Center to track your exploration progress', 
    icon: '🏆', 
    rarity: 'Common', 
    points: 25,
    category: 'System',
    hint: 'View the Achievements window'
  },
  { 
    id: 'media_explorer', 
    title: 'Gallery Curator', 
    description: 'Browsed through the curated image collection in My Pictures', 
    icon: '🖼️', 
    rarity: 'Common', 
    points: 15,
    category: 'System',
    hint: 'Open My Pictures folder'
  },
  { 
    id: 'file_manager', 
    title: 'Document Specialist', 
    description: 'Explored the organized file system and documentation structure', 
    icon: '📁', 
    rarity: 'Common', 
    points: 15,
    category: 'System',
    hint: 'Navigate through My Documents'
  },
  { 
    id: 'web_surfer', 
    title: 'Internet Explorer', 
    description: 'Launched the authentic IE browser experience - nostalgia at its finest!', 
    icon: '🌐', 
    rarity: 'Uncommon', 
    points: 20,
    category: 'System',
    hint: 'Open Internet Explorer'
  },
  { 
    id: 'system_admin', 
    title: 'Control Panel Pro', 
    description: 'Accessed system settings and external resources through Control Panel', 
    icon: '⚙️', 
    rarity: 'Uncommon', 
    points: 25,
    category: 'System',
    hint: 'Explore the Control Panel'
  },
  { 
    id: 'recycle_bin_cleaner', 
    title: 'Desktop Organizer', 
    description: 'Used the Recycle Bin to manage and restore desktop programs', 
    icon: '🗑️', 
    rarity: 'Uncommon', 
    points: 20,
    category: 'System',
    hint: 'Delete and restore items via Recycle Bin'
  },

  // ==================== EASTER EGGS (3 achievements) ====================
  { 
    id: 'confetti_celebrator', 
    title: 'Party Starter', 
    description: 'Triggered the celebratory confetti explosion - time to celebrate!', 
    icon: '🎉', 
    rarity: 'Rare', 
    points: 50,
    category: 'Easter Eggs',
    hint: 'Double-click the colored squares in the About window'
  },
  { 
    id: 'nugget_lover', 
    title: 'Golden Nugget Hunter', 
    description: 'Discovered the legendary chicken nugget easter egg - the ultimate find!', 
    icon: '🍗', 
    rarity: 'Legendary', 
    points: 500,
    category: 'Easter Eggs',
    hint: 'Keep double-clicking those squares...'
  },
  { 
    id: 'logo_admirer', 
    title: 'Windows Nostalgia', 
    description: 'Witnessed the iconic animated Windows logo in all its spinning glory', 
    icon: '🪟', 
    rarity: 'Rare', 
    points: 50,
    category: 'Easter Eggs',
    hint: 'Try different squares in the About window'
  },

  // ==================== MASTER (1 ultimate achievement) ====================
  { 
    id: 'xp_master', 
    title: 'Ultimate XP Master', 
    description: 'Achieved complete mastery! Thank you for thoroughly exploring every corner of this portfolio experience. You\'re a true Windows XP legend! 👑', 
    icon: '👑', 
    rarity: 'Legendary', 
    points: 1000,
    category: 'Master',
    hint: 'Unlock most other achievements to prove your dedication'
  },
];

// Achievement category metadata
export const ACHIEVEMENT_CATEGORIES = {
  'Getting Started': {
    icon: '🚀',
    color: '#38a169',
    description: 'Learn the basics of navigating this XP experience'
  },
  'Gaming': {
    icon: '🎮',
    color: '#e53e3e',
    description: 'Master the classic retro games collection'
  },
  'Portfolio': {
    icon: '🎨',
    color: '#805ad5',
    description: 'Explore creative works and artistic projects'
  },
  'System': {
    icon: '⚙️',
    color: '#3182ce',
    description: 'Navigate system applications and utilities'
  },
  'Easter Eggs': {
    icon: '🥚',
    color: '#d69e2e',
    description: 'Discover hidden secrets and special surprises'
  },
  'Master': {
    icon: '👑',
    color: '#d4af37',
    description: 'The ultimate achievement for true explorers'
  }
};

// Rarity color scheme
export const RARITY_COLORS = {
  'Common': '#718096',
  'Uncommon': '#48bb78',
  'Rare': '#4299e1',
  'Epic': '#9f7aea',
  'Legendary': '#f6ad55'
};

// Helper function to get total possible points
export const getTotalPossiblePoints = (): number => {
  return ACHIEVEMENT_DEFINITIONS.reduce((sum, achievement) => sum + achievement.points, 0);
};

// Helper function to get achievements by category
export const getAchievementsByCategory = (category: string): Achievement[] => {
  return ACHIEVEMENT_DEFINITIONS.filter(achievement => achievement.category === category);
};

// Helper function to calculate completion percentage
export const calculateCompletionPercentage = (unlockedIds: string[]): number => {
  const totalAchievements = ACHIEVEMENT_DEFINITIONS.length;
  const unlockedCount = unlockedIds.length;
  return Math.round((unlockedCount / totalAchievements) * 100);
};