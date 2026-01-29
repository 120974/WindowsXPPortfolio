import { useState, useRef, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PortfolioShowcaseProps {
  id: string;
  title: string;
  category: string;
  type: string;
  year: string;
  description: string;
  detailDescription: string;
  technique: string;
  equipment: string;
  digitalTools: string;
  physicalTools: string;
  originalSize: string;
  medium: string;
  assignmentStatus: string;
  designIntentions: string;
  imageUrl1: string;
  imageUrl2: string;
  featuredImageUrl: string;
}

export default function ArtShowcaseApp(props: PortfolioShowcaseProps & { isDarkMode?: boolean }) {
  const [selectedView, setSelectedView] = useState<'overview' | 'featured' | 'detail1' | 'detail2'>('overview');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'photography':
        return { icon: '📸', color: '#3b82f6', label: 'Photography' };
      case '3d':
        return { icon: '🎯', color: '#ef4444', label: '3D Design' };
      case '2d':
        return { icon: '🎨', color: '#22c55e', label: '2D Design' };
      default:
        return { icon: '📁', color: '#9013fe', label: 'Portfolio' };
    }
  };

  const categoryInfo = getCategoryInfo(props.category);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (selectedView === 'overview') {
      // If in overview, clicking the featured image takes you to featured view
      setSelectedView('featured');
      return;
    }
  };

  const toggleFullscreen = () => {
    // Toggle custom fullscreen overlay (no browser fullscreen API)
    setIsFullscreen(!isFullscreen);
  };

  const handleThumbnailClick = (view: 'detail1' | 'detail2') => {
    setSelectedView(view);
  };

  const getCurrentImageUrl = () => {
    switch (selectedView) {
      case 'featured':
        return props.featuredImageUrl;
      case 'detail1':
        return props.imageUrl1;
      case 'detail2':
        return props.imageUrl2;
      default:
        return props.featuredImageUrl;
    }
  };

  // Handle keyboard navigation for custom fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullscreen && event.key === 'Escape') {
        event.preventDefault();
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  return (
    <div className="h-full flex flex-col" style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '11px' }}>
      {/* Header */}
      <div 
        className="h-16 border-b flex items-center px-4"
        style={{ 
          background: 'linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%)',
          borderColor: '#c0c0c0'
        }}
      >
        <div 
          className="w-10 h-10 mr-3 border-2 flex items-center justify-center"
          style={{ 
            background: categoryInfo.color,
            borderColor: '#999999',
            borderRadius: '3px'
          }}
        >
          <span className="text-white text-lg">{categoryInfo.icon}</span>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold" style={{ color: '#003c71' }}>{props.title}</h2>
          <div className="flex items-center space-x-3 text-xs text-gray-600">
            <span className="font-bold" style={{ color: '#003c71' }}>{categoryInfo.label}</span>
            <span>•</span>
            <span className="font-bold" style={{ color: '#003c71' }}>{props.type}</span>
            <span>•</span>
            <span className="font-bold" style={{ color: '#003c71' }}>{props.year}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div 
        className="h-8 border-b flex"
        style={{ 
          background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
          borderColor: '#c0c0c0'
        }}
      >
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'featured', label: 'Featured Work' },
          { id: 'detail1', label: 'Detail View 1' },
          { id: 'detail2', label: 'Detail View 2' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setSelectedView(tab.id as any);
            }}
            className={`px-4 py-1 text-xs border-r transition-colors ${
              selectedView === tab.id ? 'bg-white shadow-inner' : 'hover:bg-gray-100'
            }`}
            style={{
              background: selectedView === tab.id 
                ? 'white'
                : 'transparent',
              borderColor: '#c0c0c0',
              color: selectedView === tab.id ? '#003c71' : '#666666'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area - Enable scrolling */}
      <div className="flex-1 overflow-auto xp-scrollbar">
        {selectedView === 'overview' && (
          <div className="min-h-full flex flex-col bg-white">
            {/* Main Featured Image Section - Takes up most of the space */}
            <div className="flex-1 p-6 flex flex-col justify-center">
              <div className="mb-4">
                <h3 className="text-base font-bold mb-2" style={{ color: '#003c71' }}>
                  Featured Work
                </h3>
                <p className="text-sm text-gray-600 mb-4">{props.description}</p>
              </div>

              {/* Large Featured Image - Centered and image-focused */}
              <div className="flex-1 flex justify-center items-center mb-4" data-tour="featured-image">
                <div 
                  className="cursor-pointer border-2 transition-all duration-200 hover:shadow-xl hover:border-blue-400"
                  style={{ 
                    borderColor: '#cccccc',
                    width: 'min(80vw, 70vh)',
                    height: 'min(80vw, 70vh)',
                    maxWidth: '600px',
                    maxHeight: '600px'
                  }}
                  onClick={(e) => handleImageClick(e as any)}
                >
                  <ImageWithFallback
                    src={props.featuredImageUrl}
                    alt={`${props.title} - Featured Work`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={(e) => handleImageClick(e)}
                  />
                </div>
              </div>

              <p className="text-center text-sm text-gray-600 mb-4" style={{ color: '#003c71' }}>
                <strong>Click image to view in full detail with fullscreen mode</strong>
              </p>

              {/* Secondary Images - Horizontal layout */}
              <div className="flex justify-center gap-4 mb-4" data-tour="secondary-images">
                <div 
                  className="cursor-pointer border-2 transition-all duration-200 hover:shadow-lg hover:border-blue-400"
                  style={{ 
                    borderColor: '#cccccc',
                    width: '120px',
                    height: '120px'
                  }}
                  onClick={() => handleThumbnailClick('detail1')}
                >
                  <ImageWithFallback
                    src={props.imageUrl1}
                    alt={`${props.title} - Detail 1`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  />
                </div>
                <div 
                  className="cursor-pointer border-2 transition-all duration-200 hover:shadow-lg hover:border-blue-400"
                  style={{ 
                    borderColor: '#cccccc',
                    width: '120px',
                    height: '120px'
                  }}
                  onClick={() => handleThumbnailClick('detail2')}
                >
                  <ImageWithFallback
                    src={props.imageUrl2}
                    alt={`${props.title} - Detail 2`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  />
                </div>
              </div>

              {/* Detailed Project Information - Vertical scrollable layout */}
              <div className="space-y-6 text-sm max-w-4xl mx-auto" data-tour="sections">
                {/* Technical Details Section */}
                <div className="bg-gray-50 p-4 border border-gray-300 rounded">
                  <h4 className="font-bold text-base mb-3" style={{ color: '#003c71' }}>Technical Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <span className="font-bold" style={{ color: '#003c71' }}>Size:</span>
                        <span className="text-gray-700 ml-2">{props.originalSize}</span>
                      </div>
                      <div>
                        <span className="font-bold" style={{ color: '#003c71' }}>Medium:</span>
                        <span className="text-gray-700 ml-2">{props.medium}</span>
                      </div>
                      <div>
                        <span className="font-bold" style={{ color: '#003c71' }}>Status:</span>
                        <span className="text-gray-700 ml-2">{props.assignmentStatus}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-bold" style={{ color: '#003c71' }}>Digital Tools:</span>
                        <span className="text-gray-700 ml-2">{props.digitalTools}</span>
                      </div>
                      <div>
                        <span className="font-bold" style={{ color: '#003c71' }}>Physical Tools:</span>
                        <span className="text-gray-700 ml-2">{props.physicalTools}</span>
                      </div>
                      <div>
                        <span className="font-bold" style={{ color: '#003c71' }}>Technique:</span>
                        <span className="text-gray-700 ml-2">{props.technique}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Description Section */}
                <div className="bg-blue-50 p-4 border border-blue-300 rounded">
                  <h4 className="font-bold text-base mb-3" style={{ color: '#003c71' }}>Project Analysis</h4>
                  <p className="text-gray-700 leading-relaxed mb-3">{props.detailDescription}</p>
                  {props.designIntentions && (
                    <div>
                      <span className="font-bold" style={{ color: '#003c71' }}>Design Intentions:</span>
                      <p className="text-gray-700 mt-1 leading-relaxed">{props.designIntentions}</p>
                    </div>
                  )}
                </div>

                {/* Equipment Details Section */}
                {props.equipment && (
                  <div className="bg-green-50 p-4 border border-green-300 rounded">
                    <h4 className="font-bold text-base mb-3" style={{ color: '#003c71' }}>Equipment & Setup</h4>
                    <p className="text-gray-700 leading-relaxed">{props.equipment}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {(selectedView === 'featured' || selectedView === 'detail1' || selectedView === 'detail2') && (
          <div className="h-full flex flex-col bg-black relative">
            {/* Detail View Header */}
            <div 
              className="h-10 border-b flex items-center justify-between px-4"
              style={{ 
                background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
                borderColor: '#444444'
              }}
            >
              <span className="text-white text-sm font-bold">
                {selectedView === 'featured' ? 'Featured Work' : selectedView === 'detail1' ? 'Detail View 1' : 'Detail View 2'}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleFullscreen}
                  className="px-3 py-1 text-xs text-white border hover:bg-gray-700 transition-colors"
                  style={{
                    background: 'linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%)',
                    borderColor: '#555555',
                    borderRadius: '2px'
                  }}
                >
                  {isFullscreen ? '⊗ Exit Fullscreen' : '⛶ Enter Fullscreen'}
                </button>
                <button
                  onClick={() => setSelectedView('overview')}
                  className="px-3 py-1 text-xs text-white border hover:bg-gray-700 transition-colors"
                  style={{
                    background: 'linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%)',
                    borderColor: '#555555',
                    borderRadius: '2px'
                  }}
                >
                  Back to Overview
                </button>
              </div>
            </div>

            {/* Fixed Image Display */}
            <div className="flex-1 bg-black flex items-center justify-center p-4">
              <div 
                className="border-2"
                style={{ 
                  borderColor: '#555555',
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              >
                <ImageWithFallback
                  ref={imageRef}
                  src={getCurrentImageUrl()}
                  alt={`${props.title} - ${selectedView === 'featured' ? 'Featured Work' : selectedView === 'detail1' ? 'Detail 1' : 'Detail 2'}`}
                  className="cursor-pointer transition-all duration-300 block"
                  onClick={handleImageClick}
                  style={{
                    maxWidth: '90vw',
                    maxHeight: '70vh',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </div>

            {/* Instructions */}
            <div 
              className="absolute top-16 right-4 px-3 py-2 text-xs text-white bg-black bg-opacity-80 border rounded"
              style={{ 
                borderColor: '#555555',
                maxWidth: '200px'
              }}
            >
              {!isFullscreen ? (
                <div>
                  <div className="font-bold text-yellow-300 mb-1">💡 Fullscreen Guide</div>
                  <div>• Click "Enter Fullscreen" button</div>
                  <div>• Press ESC to exit fullscreen</div>
                  <div>• View image in native resolution</div>
                </div>
              ) : (
                <div>
                  <div className="font-bold text-green-300 mb-1">🖵 Fullscreen Mode</div>
                  <div>• Press ESC to exit</div>
                  <div>• Click "Exit Fullscreen" button</div>
                  <div>• Enjoy full detail view</div>
                </div>
              )}
            </div>

            {/* Detail Info */}
            <div 
              className="h-16 border-t p-3"
              style={{ 
                background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
                borderColor: '#444444'
              }}
            >
              <div className="text-white">
                <h4 className="text-sm font-bold mb-1" style={{ color: '#4a90e2' }}>{props.title}</h4>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-300">{props.originalSize} • {props.medium}</p>
                  <p className="text-xs text-gray-400">
                    {isFullscreen ? 'Fullscreen Mode Active - Press ESC to exit' : 'Click "Enter Fullscreen" for full detail'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
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
        <span className="font-bold" style={{ color: '#003c71' }}>{props.title} - {categoryInfo.label} Portfolio</span>
        <div className="flex-1"></div>
        <span>
          {selectedView === 'overview' ? 'Overview' : 
           selectedView === 'featured' ? 'Featured Work' : 
           selectedView === 'detail1' ? 'Detail View 1' : 'Detail View 2'}
        </span>
        {(selectedView === 'featured' || selectedView === 'detail1' || selectedView === 'detail2') && (
          <span className="ml-2">• {isFullscreen ? 'Fullscreen Mode' : 'Fullscreen Available'}</span>
        )}
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[10002] bg-black flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors duration-200 flex items-center justify-center"
            style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          
          {/* Exit Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-6 left-6 z-50 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors duration-200 flex items-center justify-center"
            style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}
            title="Exit Fullscreen"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 0 2-2h3M3 16h3a2 2 0 0 0 2 2v3"/>
            </svg>
          </button>
          
          {/* Fullscreen Image */}
          <div className="w-full h-full flex items-center justify-center p-6">
            <ImageWithFallback
              src={getCurrentImageUrl()}
              alt={`${props.title} - Fullscreen View`}
              className="max-w-full max-h-full object-contain"
              style={{ 
                objectPosition: 'center',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
