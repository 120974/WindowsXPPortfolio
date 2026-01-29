import { useState } from 'react';

interface FileExplorerAppProps {
  isDarkMode?: boolean;
}

export default function FileExplorerApp({ isDarkMode = false }: FileExplorerAppProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const socialLinks = [
    {
      id: 'email',
      name: 'Email Contact',
      icon: '📧',
      type: 'Contact',
      url: 'mailto:rishith.chintala@gmail.com',
      description: 'Send me an email',
      size: '2 KB',
      modified: 'Today'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Profile',
      icon: '💼',
      type: 'Professional',
      url: 'https://www.linkedin.com/in/rishith-chintala-012553232',
      description: 'Connect with me professionally',
      size: '3 KB',
      modified: 'Today'
    },
    {
      id: 'github',
      name: 'GitHub Portfolio',
      icon: '💻',
      type: 'Developer',
      url: 'https://github.com/rishithchintala',
      description: 'View my code repositories',
      size: '5 KB',
      modified: 'Today'
    },
    {
      id: 'spotify',
      name: 'Spotify Profile',
      icon: '🎵',
      type: 'Music',
      url: 'https://open.spotify.com/user/31l4zvfqhd2hpbvqkixznxafszye',
      description: 'Check out my playlists',
      size: '4 KB',
      modified: 'Today'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📸',
      type: 'Social',
      url: 'https://www.instagram.com/rishith.chintala/',
      description: 'Follow my creative journey',
      size: '6 KB',
      modified: 'Today'
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: '🎮',
      type: 'Gaming',
      url: 'https://discord.com/users/rishithchintala',
      description: 'Connect on Discord',
      size: '2 KB',
      modified: 'Today'
    }
  ];

  const handleItemClick = (id: string) => {
    setSelectedItem(id);
  };

  const handleItemDoubleClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="h-full flex flex-col overflow-hidden" 
      style={{ 
        fontFamily: 'Tahoma, sans-serif',
        background: isDarkMode 
          ? 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)' 
          : 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)'
      }}
    >
      {/* Toolbar */}
      <div 
        className="border-b-2 px-3 py-2 flex items-center space-x-2"
        style={{
          background: isDarkMode 
            ? 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)' 
            : 'linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%)',
          borderColor: isDarkMode ? '#2a2a2a' : '#c0c0c0'
        }}
      >
        <div className="flex items-center space-x-1">
          <button 
            className="px-2 py-1 border text-xs"
            style={{
              background: isDarkMode 
                ? 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)' 
                : 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)',
              borderColor: isDarkMode ? '#3a3a3a' : '#a0a0a0',
              color: isDarkMode ? '#e0e0e0' : '#000000',
              borderRadius: '2px'
            }}
          >
            File
          </button>
          <button 
            className="px-2 py-1 border text-xs"
            style={{
              background: isDarkMode 
                ? 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)' 
                : 'linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)',
              borderColor: isDarkMode ? '#3a3a3a' : '#a0a0a0',
              color: isDarkMode ? '#e0e0e0' : '#000000',
              borderRadius: '2px'
            }}
          >
            View
          </button>
        </div>
        <div className="flex-1"></div>
        <div className="text-xs" style={{ color: isDarkMode ? '#808080' : '#666666' }}>
          {socialLinks.length} items
        </div>
      </div>

      {/* Address Bar */}
      <div 
        className="border-b px-3 py-2 flex items-center space-x-2"
        style={{
          background: isDarkMode ? '#0a0a0a' : '#f5f5f5',
          borderColor: isDarkMode ? '#2a2a2a' : '#d0d0d0'
        }}
      >
        <span className="text-xs" style={{ color: isDarkMode ? '#808080' : '#666666' }}>Address:</span>
        <div 
          className="flex-1 px-2 py-1 border"
          style={{
            background: isDarkMode ? '#000000' : '#ffffff',
            borderColor: isDarkMode ? '#2a2a2a' : '#a0a0a0',
            color: isDarkMode ? '#e0e0e0' : '#000000',
            fontSize: '11px'
          }}
        >
          📁 My Computer \ File Explorer \ Social Links
        </div>
      </div>

      {/* Column Headers */}
      <div 
        className="border-b px-3 py-1 flex items-center"
        style={{
          background: isDarkMode 
            ? 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)' 
            : 'linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%)',
          borderColor: isDarkMode ? '#2a2a2a' : '#b0b0b0',
          fontSize: '11px',
          fontWeight: 'bold'
        }}
      >
        <div className="w-48" style={{ color: isDarkMode ? '#a0a0a0' : '#000000' }}>Name</div>
        <div className="w-24" style={{ color: isDarkMode ? '#a0a0a0' : '#000000' }}>Size</div>
        <div className="w-32" style={{ color: isDarkMode ? '#a0a0a0' : '#000000' }}>Type</div>
        <div className="flex-1" style={{ color: isDarkMode ? '#a0a0a0' : '#000000' }}>Modified</div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto xp-scrollbar p-3" style={{ background: isDarkMode ? '#000000' : '#ffffff' }}>
        <div className="space-y-1">
          {socialLinks.map((link) => (
            <div
              key={link.id}
              className="flex items-center px-2 py-1.5 cursor-pointer transition-colors border"
              style={{
                background: selectedItem === link.id 
                  ? (isDarkMode ? '#1a4d80' : '#3399ff')
                  : hoveredItem === link.id 
                    ? (isDarkMode ? '#0a0a0a' : '#e8f4fd') 
                    : 'transparent',
                borderColor: selectedItem === link.id 
                  ? (isDarkMode ? '#2563eb' : '#0078d4') 
                  : 'transparent',
                borderRadius: '2px',
                color: selectedItem === link.id 
                  ? '#ffffff' 
                  : (isDarkMode ? '#e0e0e0' : '#000000')
              }}
              onClick={() => handleItemClick(link.id)}
              onDoubleClick={() => handleItemDoubleClick(link.url)}
              onMouseEnter={() => setHoveredItem(link.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="w-48 flex items-center space-x-2">
                <div 
                  className="w-8 h-8 flex items-center justify-center border"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)' 
                      : 'linear-gradient(145deg, #f0f0f0 0%, #e0e0e0 100%)',
                    borderColor: isDarkMode ? '#2a2a2a' : '#c0c0c0',
                    borderRadius: '2px',
                    fontSize: '16px'
                  }}
                >
                  {link.icon}
                </div>
                <span className="text-xs">{link.name}</span>
              </div>
              <div className="w-24 text-xs">{link.size}</div>
              <div className="w-32 text-xs">{link.type}</div>
              <div className="flex-1 text-xs">{link.modified}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div 
        className="border-t px-3 py-1 flex items-center justify-between"
        style={{
          background: isDarkMode 
            ? 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)' 
            : 'linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%)',
          borderColor: isDarkMode ? '#2a2a2a' : '#d0d0d0',
          fontSize: '11px',
          color: isDarkMode ? '#808080' : '#666666'
        }}
      >
        <div>
          {selectedItem && socialLinks.find(l => l.id === selectedItem)?.description}
        </div>
        <div>
          Double-click to open
        </div>
      </div>
    </div>
  );
}
