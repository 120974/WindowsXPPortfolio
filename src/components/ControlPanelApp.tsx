import { useState } from 'react';

interface ControlPanelAppProps {
  onDarkModeToggle?: () => void;
  onOpenMediaPlayer?: () => void;
  onModernVersionLaunch?: () => void;
  onSiteRefresh?: () => void;
}

export default function ControlPanelApp({ 
  onDarkModeToggle, 
  onOpenMediaPlayer, 
  onModernVersionLaunch, 
  onSiteRefresh
}: ControlPanelAppProps = {}) {
  const [currentView, setCurrentView] = useState<'home' | 'system'>('home');

  const controlPanelItems = [
    {
      id: 'appearance',
      icon: '🎨',
      title: 'Appearance and Themes',
      description: 'Change the appearance of desktop items'
    },
    {
      id: 'network',
      icon: '🌐',
      title: 'Network Connections', 
      description: 'Refresh portfolio interface'
    },
    {
      id: 'user',
      icon: '👤',
      title: 'User Accounts',
      description: 'Change user account settings'
    },
    {
      id: 'add-remove',
      icon: '📦',
      title: 'Add or Remove Programs',
      description: 'Install or remove programs'
    },
    {
      id: 'sounds',
      icon: '🔊',
      title: 'Sounds and Audio',
      description: 'Change sound settings'
    },
    {
      id: 'display',
      icon: '🖥️',
      title: 'Display',
      description: 'Change display settings'
    },
    {
      id: 'system',
      icon: '⚙️',
      title: 'System',
      description: 'View system information and settings'
    },
    {
      id: 'security',
      icon: '🔒',
      title: 'Security Center',
      description: 'Check security settings'
    },
    {
      id: 'performance',
      icon: '📊',
      title: 'Performance and Maintenance',
      description: 'Optimize system performance'
    },
    {
      id: 'linkedin',
      icon: '💼',
      title: 'Professional Profile',
      description: 'View LinkedIn profile and professional experience'
    }
  ];

  const portfolioFeatures = [
    {
      category: '🎮 Interactive Games & Entertainment',
      items: [
        'Authentic Solitaire with pixel-perfect card animations',
        'Minesweeper featuring customizable difficulty settings',
        'PAC-MAN arcade experience with original sound effects',
        'Classic Snake game with persistent high score system'
      ]
    },
    {
      category: '📁 Portfolio Applications & Media',
      items: [
        'My Pictures - Curated collection of 20 personal images',
        'Art Showcase - Interactive portfolio with fullscreen functionality',
        'My Documents - Professional work samples and projects',
        'My Music - Integrated Spotify playlist with "Rishith\'s Collection"'
      ]
    },
    {
      category: '🌐 Professional Networking & Web',
      items: [
        'Internet Explorer with period-accurate browsing experience',
        'Direct LinkedIn profile integration and professional links',
        'Seamless portfolio navigation and contact features',
        'Portfolio interface refresh capability'
      ]
    },
    {
      category: '🎨 Creative & Technical Showcase',
      items: [
        'Photography collection featuring personal artistic work',
        '3D modeling and visualization project demonstrations',
        '2D graphic design work across multiple disciplines',
        'Interactive UI/UX design with authentic Windows XP styling'
      ]
    }
  ];

  const easterEggs = [
    {
      location: '🎵 Spotify Integration',
      description: 'Live music streaming with curated "Rishith\'s Collection" playlist'
    },
    {
      location: '🗂️ Functional Recycle Bin',
      description: 'Authentic Windows recycle bin with restore and delete capabilities'
    },
    {
      location: '🎮 Arcade Game Collection',
      description: 'Four fully playable retro games with scoring and achievements'
    },
    {
      location: '📸 Image Gallery Features',
      description: 'Advanced photo viewer with slideshow and scroll wheel navigation'
    },
    {
      location: '🌙 Hidden Dark Theme',
      description: 'Secret dark mode accessible through system shutdown menu'
    },
    {
      location: '⌨️ Windows XP Shortcuts',
      description: 'Authentic keyboard shortcuts and system hotkeys functionality'
    },
    {
      location: '🎆 Double-Click Squares',
      description: 'Hidden animations including confetti, nuggets, and logo effects'
    }
  ];

  const handleItemClick = (itemId: string) => {
    if (itemId === 'linkedin') {
      // Professional Profile - Open LinkedIn directly
      window.open('https://www.linkedin.com/in/rishith-chintala-012553232', '_blank');
    } else if (itemId === 'system') {
      setCurrentView('system');
    } else if (itemId === 'appearance') {
      // Appearance and Themes - Launch site in dark mode
      onDarkModeToggle?.();
    } else if (itemId === 'network') {
      // Network Connections - Refresh the interface
      onModernVersionLaunch?.();
    } else if (itemId === 'user') {
      // User Accounts - Refresh the site
      onSiteRefresh?.();
    } else if (itemId === 'add-remove') {
      // Add or Remove Programs - Go to Google Drive link
      window.open('https://drive.google.com/drive/folders/1tFLPbayxllrEiWcvi3kbN7nW1dPAcEwG?usp=drive_link', '_blank');
    } else if (itemId === 'sounds') {
      // Sounds and Audio - Open media player
      onOpenMediaPlayer?.();
    } else if (itemId === 'display') {
      // Display - Same as network connection (refresh interface)
      onModernVersionLaunch?.();
    } else if (itemId === 'security') {
      // Security Center - Refresh the site
      onSiteRefresh?.();
    } else if (itemId === 'performance') {
      // Performance and Maintenance - Relaunch the site
      onSiteRefresh?.();
    }
  };

  const renderSystemView = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div 
        className="h-16 border-b px-4 py-2 flex items-center"
        style={{ 
          background: 'linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%)',
          borderColor: '#c0c0c0'
        }}
      >
        <div 
          className="w-10 h-10 mr-3 border-2 flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(145deg, #e0e0e0 0%, #a0a0a0 100%)',
            borderColor: '#999999',
            borderRadius: '3px'
          }}
        >
          <span className="text-lg">⚙️</span>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold" style={{ color: '#003c71' }}>System Properties</h2>
          <div className="text-xs text-gray-600">
            Portfolio features, easter eggs, and system information
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div 
        className="h-8 border-b px-4 py-1 flex items-center text-xs"
        style={{ 
          background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
          borderColor: '#c0c0c0'
        }}
      >
        <span 
          style={{ color: '#0066cc', cursor: 'pointer' }}
          onClick={() => setCurrentView('home')}
        >
          Control Panel
        </span>
        <span className="mx-2">›</span>
        <span style={{ color: '#0066cc' }}>System</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto xp-scrollbar bg-white">
        <div className="p-4">
          {/* System Info Header */}
          <div className="flex items-center mb-6 p-4 border rounded" style={{ borderColor: '#e0e0e0', background: '#f8f9fa' }}>
            <div className="w-16 h-16 mr-4 flex items-center justify-center border-2" 
                 style={{ 
                   background: 'linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%)',
                   borderColor: '#c0c0c0'
                 }}>
              <span className="text-3xl">💻</span>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1" style={{ color: '#003c71' }}>
                Rishith's Portfolio System
              </h3>
              <p className="text-sm text-gray-600">
                Windows XP Professional • Interactive Portfolio Edition
              </p>
              <p className="text-xs text-gray-500">
                Build 2025.portfolio_v2 • Service Pack Achievement System
              </p>
            </div>
          </div>

          {/* Portfolio Features */}
          <div className="mb-6">
            <h4 className="text-sm font-bold mb-3 flex items-center" style={{ color: '#003c71' }}>
              <span className="mr-2">🌟</span>
              Portfolio Features & Applications
            </h4>
            <div className="space-y-4">
              {portfolioFeatures.map((feature, index) => (
                <div key={index} className="border rounded p-3" style={{ borderColor: '#e0e0e0' }}>
                  <h5 className="text-sm font-medium mb-2" style={{ color: '#003c71' }}>
                    {feature.category}
                  </h5>
                  <ul className="text-xs text-gray-600 space-y-1 ml-4">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="mr-2 text-blue-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Easter Eggs */}
          <div className="mb-6">
            <h4 className="text-sm font-bold mb-3 flex items-center" style={{ color: '#003c71' }}>
              <span className="mr-2">🎁</span>
              Hidden Features & Easter Eggs
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {easterEggs.map((egg, index) => (
                <div key={index} className="border rounded p-3 hover:bg-blue-50 transition-colors" 
                     style={{ borderColor: '#e0e0e0' }}>
                  <div className="text-sm font-medium mb-1" style={{ color: '#0066cc' }}>
                    {egg.location}
                  </div>
                  <div className="text-xs text-gray-600">
                    {egg.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="border rounded p-4" style={{ borderColor: '#e0e0e0', background: '#f8f9fa' }}>
            <h4 className="text-sm font-bold mb-3" style={{ color: '#003c71' }}>
              Technical Specifications
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <strong>Frontend Technologies:</strong>
                <ul className="mt-1 ml-4 text-gray-600 space-y-1">
                  <li>• React 18 with TypeScript</li>
                  <li>• Tailwind CSS v4.0</li>
                  <li>• Motion/React animations</li>
                  <li>• Vite build system</li>
                </ul>
              </div>
              <div>
                <strong>Portfolio Content:</strong>
                <ul className="mt-1 ml-4 text-gray-600 space-y-1">
                  <li>• 20+ personal and creative works</li>
                  <li>• Interactive media gallery</li>
                  <li>• Achievement system with 24 unlockables</li>
                  <li>• Professional networking integration</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-6 p-4 border rounded" style={{ borderColor: '#0066cc', background: '#f0f8ff' }}>
            <h4 className="text-sm font-bold mb-2" style={{ color: '#003c71' }}>
              Professional Contact
            </h4>
            <p className="text-xs text-gray-600 mb-2">
              For inquiries about projects, collaboration, or career opportunities:
            </p>
            <button
              onClick={() => window.open('https://www.linkedin.com/in/rishith-chintala-012553232', '_blank')}
              className="text-xs px-3 py-1 border rounded hover:bg-blue-100 transition-colors"
              style={{ borderColor: '#0066cc', color: '#0066cc' }}
            >
              View LinkedIn Profile →
            </button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div 
        className="h-6 border-t flex items-center px-3 text-xs"
        style={{ 
          background: 'linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%)',
          borderColor: '#c0c0c0',
          color: '#666666'
        }}
      >
        <span>System Properties</span>
        <div className="flex-1"></div>
        <span>{portfolioFeatures.length + easterEggs.length} features</span>
      </div>
    </div>
  );

  const renderHomeView = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div 
        className="h-16 border-b px-4 py-2 flex items-center"
        style={{ 
          background: 'linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%)',
          borderColor: '#c0c0c0'
        }}
      >
        <div 
          className="w-10 h-10 mr-3 border-2 flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(145deg, #e0e0e0 0%, #a0a0a0 100%)',
            borderColor: '#999999',
            borderRadius: '3px'
          }}
        >
          <span className="text-lg">⚙️</span>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold" style={{ color: '#003c71' }}>Control Panel</h2>
          <div className="text-xs text-gray-600">
            Pick a category below to configure your system
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div 
        className="h-8 border-b px-4 py-1 flex items-center text-xs"
        style={{ 
          background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
          borderColor: '#c0c0c0'
        }}
      >
        <span style={{ color: '#0066cc' }}>Control Panel Home</span>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-white xp-scrollbar">
        {/* Category Header */}
        <div className="mb-4">
          <h3 className="text-sm font-bold mb-2" style={{ color: '#003c71' }}>
            Pick a category
          </h3>
          <p className="text-xs text-gray-600">
            Click on System to explore portfolio features and easter eggs, or Professional Profile to access LinkedIn.
          </p>
        </div>

        {/* Control Panel Items Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {controlPanelItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className="flex items-start p-3 border-2 transition-all duration-200 cursor-pointer hover:shadow-lg bg-white hover:bg-blue-50"
              style={{ 
                borderColor: '#c0c0c0',
                borderRadius: '4px'
              }}
            >
              <div 
                className="w-8 h-8 mr-3 border flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(145deg, #f0f0f0 0%, #d0d0d0 100%)',
                  borderColor: '#999999',
                  borderRadius: '2px'
                }}
              >
                <span className="text-sm">{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium mb-1" style={{ color: '#003c71' }}>
                  {item.title}
                </div>
                <div className="text-xs text-gray-600 leading-tight">
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div 
        className="h-6 border-t flex items-center px-3 text-xs"
        style={{ 
          background: 'linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%)',
          borderColor: '#c0c0c0',
          color: '#666666'
        }}
      >
        <span>Control Panel</span>
        <div className="flex-1"></div>
        <span>{controlPanelItems.length} items</span>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col xp-scrollbar" style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '11px' }}>
      {currentView === 'home' ? renderHomeView() : renderSystemView()}
    </div>
  );
}