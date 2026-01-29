import { motion, AnimatePresence } from 'motion/react';
import { portfolioData } from './constants/artData';
import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PortfolioDetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: string | null;
  isDarkMode?: boolean;
  onUnlockAchievement?: (achievementId: string) => void;
}

export default function PortfolioDetailView({ isOpen, onClose, portfolioId, isDarkMode = false, onUnlockAchievement }: PortfolioDetailViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState<number | null>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  const portfolioItem = portfolioData.find(item => item.id === portfolioId);

  // Reset states when portfolio item changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setFullscreenImageIndex(null);
  }, [portfolioId]);

  // Track portfolio perfectionist achievement when viewing multiple projects
  useEffect(() => {
    if (isOpen && portfolioItem && onUnlockAchievement) {
      const viewedProjects = JSON.parse(localStorage.getItem('viewed-portfolio-projects') || '[]');
      if (!viewedProjects.includes(portfolioId)) {
        const newViewedProjects = [...viewedProjects, portfolioId];
        localStorage.setItem('viewed-portfolio-projects', JSON.stringify(newViewedProjects));
        
        // Unlock achievement after viewing 5 or more projects
        if (newViewedProjects.length >= 5) {
          onUnlockAchievement('portfolio_perfectionist');
        }
      }
    }
  }, [isOpen, portfolioItem, portfolioId, onUnlockAchievement]);

  if (!portfolioItem) return null;

  // Process and validate image URLs
  const rawImages = [
    portfolioItem.featuredImageUrl,
    portfolioItem.imageUrl1,
    portfolioItem.imageUrl2
  ].filter(Boolean).filter(url => url && url.trim() !== '');

  // Helper function to ensure Google Drive URLs are properly formatted
  const processImageUrl = (url: string) => {
    if (url.includes('drive.google.com') && !url.includes('&authuser=0')) {
      return url + '&authuser=0';
    }
    return url;
  };

  const images = rawImages.map(processImageUrl);

  const categoryInfo = {
    photography: { icon: '📸', color: '#3b82f6', bgGradient: 'from-blue-500/10 to-indigo-500/10' },
    '3d': { icon: '🎯', color: '#ef4444', bgGradient: 'from-red-500/10 to-rose-500/10' },
    '2d': { icon: '🎨', color: '#22c55e', bgGradient: 'from-green-500/10 to-emerald-500/10' }
  };

  const info = categoryInfo[portfolioItem.category as keyof typeof categoryInfo];

  const toggleFullscreen = (imageIndex: number) => {
    if (fullscreenImageIndex === imageIndex) {
      // Exit custom fullscreen
      setFullscreenImageIndex(null);
    } else {
      // Enter custom fullscreen
      setFullscreenImageIndex(imageIndex);
      // Unlock detail explorer achievement when using fullscreen view
      if (onUnlockAchievement) {
        onUnlockAchievement('detail_explorer');
      }
    }
  };

  // Handle keyboard navigation for custom fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (fullscreenImageIndex !== null) {
        switch (event.key) {
          case 'Escape':
            event.preventDefault();
            setFullscreenImageIndex(null);
            break;
          case 'ArrowLeft':
            event.preventDefault();
            if (images.length > 1) {
              const newIndex = fullscreenImageIndex > 0 ? fullscreenImageIndex - 1 : images.length - 1;
              setFullscreenImageIndex(newIndex);
            }
            break;
          case 'ArrowRight':
            event.preventDefault();
            if (images.length > 1) {
              const newIndex = fullscreenImageIndex < images.length - 1 ? fullscreenImageIndex + 1 : 0;
              setFullscreenImageIndex(newIndex);
            }
            break;
          case ' ':
            event.preventDefault();
            if (images.length > 1) {
              const newIndex = fullscreenImageIndex < images.length - 1 ? fullscreenImageIndex + 1 : 0;
              setFullscreenImageIndex(newIndex);
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullscreenImageIndex, images.length]);

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  const containerVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: { 
        duration: 0.3, 
        ease: "easeIn" 
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
        <div className="fixed inset-0 z-[10001] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />
          
          {/* Main Container */}
          <motion.div 
            className="relative w-full h-full max-w-none mx-auto px-32 pt-16 pb-2 overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="absolute top-20 right-36 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors duration-200 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              variants={headerVariants}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </motion.button>

            {/* Content Grid - Updated to show all images */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              {/* Left Side - All Images Grid */}
              <motion.div 
                className="lg:col-span-2 flex flex-col space-y-4 h-full"
                style={{ height: 'calc(100vh - 120px)' }}
                variants={contentVariants}
              >
                {/* Image Carousel - Center of Attention */}
                <div className="flex-1 flex flex-col space-y-4">
                  {/* Main Carousel View */}
                  <div className="flex-1 relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-sm">
                    <div 
                      className="flex transition-transform duration-500 ease-in-out h-full"
                      style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                    >
                      {images.map((image, index) => {
                        return (
                          <div
                            key={index}
                            className="w-full h-full flex-shrink-0 relative group"
                          >
                            <div className="w-full h-full relative overflow-hidden">
                              <ImageWithFallback
                                ref={(el) => (imageRefs.current[index] = el)}
                                src={image}
                                alt={`${portfolioItem.title} - Image ${index + 1}`}
                                className="w-full h-full max-h-screen max-w-screen object-contain"
                                style={{ 
                                  objectPosition: 'center',
                                  objectFit: 'contain'
                                }}
                              />
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              />
                            </div>
                            
                            {/* Image Number Badge */}
                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                              {index + 1} of {images.length}
                            </div>
                            
                            {/* Fullscreen Button */}
                            <div className="absolute top-4 right-4">
                              <motion.button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFullscreen(index);
                                }}
                                className="w-10 h-10 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors duration-200 flex items-center justify-center"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title={fullscreenImageIndex === index ? "Exit Fullscreen" : "Enter Browser Fullscreen"}
                              >
                                {fullscreenImageIndex === index ? (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 0 2-2h3M3 16h3a2 2 0 0 0 2 2v3"/>
                                  </svg>
                                ) : (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 3h6l-6 6V3zM21 3h-6l6 6V3zM21 21h-6l6-6v6zM3 21h6l-6-6v6z"/>
                                  </svg>
                                )}
                              </motion.button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Carousel Navigation */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors duration-200 flex items-center justify-center z-10"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6"/>
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-black/70 transition-colors duration-200 flex items-center justify-center z-10"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6"/>
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Thumbnail Strip */}
                  {images.length > 1 && (
                    <div className="flex space-x-2 justify-center">
                      {images.map((image, index) => (
                        <motion.div
                          key={index}
                          className={`w-20 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 ${
                            currentImageIndex === index 
                              ? 'border-blue-400 shadow-lg shadow-blue-400/50' 
                              : 'border-white/30 hover:border-white/60'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ImageWithFallback
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Right Side - Content */}
              <motion.div 
                className="flex flex-col space-y-3 h-full overflow-hidden"
                variants={contentVariants}
              >
                {/* Fixed Content Area - With XP scrollbars */}
                <div className="flex-1 space-y-3 pr-2 flex flex-col overflow-y-auto xp-scrollbar" style={{ height: 'calc(100vh - 160px)' }}>
                  {/* Header */}
                  <motion.div variants={headerVariants}>
                    <div className="flex items-center space-x-3 mb-3">
                      <motion.span 
                        className="text-3xl"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                      >
                        {info.icon}
                      </motion.span>
                      <div>
                        <motion.h1 
                          className="text-3xl font-bold text-white mb-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.4 }}
                        >
                          {portfolioItem.title}
                        </motion.h1>
                        <motion.div 
                          className="flex items-center space-x-3"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4, duration: 0.4 }}
                        >
                          <span 
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{
                              background: `${info.color}20`,
                              color: info.color
                            }}
                          >
                            {portfolioItem.type}
                          </span>
                          <span className="text-white/70 text-sm">{portfolioItem.year}</span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Description - More compact */}
                  <motion.div 
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 flex-1"
                    variants={contentVariants}
                    whileHover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">Project Overview</h3>
                    <p className="text-white/80 leading-relaxed mb-2 text-sm">{portfolioItem.detailDescription}</p>
                    <p className="text-white/60 text-xs italic">{portfolioItem.designIntentions}</p>
                  </motion.div>

                  {/* Technical Details - Compact grid */}
                  <motion.div 
                    className="grid grid-cols-4 gap-2"
                    variants={contentVariants}
                  >
                    {[
                      { label: 'Technique', value: portfolioItem.technique },
                      { label: 'Medium', value: portfolioItem.medium },
                      { label: 'Status', value: portfolioItem.assignmentStatus },
                      { label: 'Size', value: portfolioItem.originalSize }
                    ].map((detail, index) => (
                      <motion.div
                        key={detail.label}
                        className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                        whileHover={{ bg: 'rgba(255, 255, 255, 0.08)', scale: 1.02 }}
                      >
                        <h4 className="text-xs font-medium text-white/60 mb-1">{detail.label}</h4>
                        <p className="text-white text-xs">{detail.value}</p>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Tools & Equipment - Horizontal layout */}
                  <motion.div 
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10"
                    variants={contentVariants}
                    whileHover={{ bg: 'rgba(255, 255, 255, 0.08)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">Tools & Equipment</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <h4 className="text-xs font-medium text-white/60 mb-1">Digital Tools</h4>
                        <p className="text-white/80 text-xs leading-relaxed">{portfolioItem.digitalTools}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-white/60 mb-1">Physical Tools</h4>
                        <p className="text-white/80 text-xs leading-relaxed">{portfolioItem.physicalTools}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Fixed Navigation at Bottom */}
                <motion.div 
                  className="flex justify-between items-center pt-2 border-t border-white/10"
                  variants={contentVariants}
                >
                  <motion.button
                    onClick={() => {
                      const currentIndex = activePortfolioData.findIndex(item => item.id === portfolioId);
                      const prevIndex = currentIndex > 0 ? currentIndex - 1 : activePortfolioData.length - 1;
                      window.dispatchEvent(new CustomEvent('openPortfolioDetail', { 
                        detail: { portfolioId: activePortfolioData[prevIndex].id } 
                      }));
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                    <span>Previous</span>
                  </motion.button>

                  <motion.div 
                    className="text-white/60 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {activePortfolioData.findIndex(item => item.id === portfolioId) + 1} of {activePortfolioData.length}
                  </motion.div>

                  <motion.button
                    onClick={() => {
                      const currentIndex = activePortfolioData.findIndex(item => item.id === portfolioId);
                      const nextIndex = currentIndex < activePortfolioData.length - 1 ? currentIndex + 1 : 0;
                      window.dispatchEvent(new CustomEvent('openPortfolioDetail', { 
                        detail: { portfolioId: activePortfolioData[nextIndex].id } 
                      }));
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Next</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Fullscreen Overlay */}
        {fullscreenImageIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[10002] bg-black flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              setFullscreenImageIndex(null);
            }}
          >
            {/* Close Button */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenImageIndex(null);
              }}
              className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors duration-200 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </motion.button>
            
            {/* Exit Fullscreen Button */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenImageIndex(null);
              }}
              className="absolute top-6 left-6 z-50 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors duration-200 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Exit Fullscreen"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 0 2-2h3M3 16h3a2 2 0 0 0 2 2v3"/>
              </svg>
            </motion.button>
            
            {/* Fullscreen Image */}
            <motion.div
              className="w-full h-full flex items-center justify-center p-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <ImageWithFallback
                src={images[fullscreenImageIndex]}
                alt={`${portfolioItem.title} - Fullscreen Image ${fullscreenImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                style={{ 
                  objectPosition: 'center',
                  objectFit: 'contain'
                }}
              />
            </motion.div>
            
            {/* Navigation in Fullscreen */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = fullscreenImageIndex > 0 ? fullscreenImageIndex - 1 : images.length - 1;
                    setFullscreenImageIndex(newIndex);
                  }}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/60 backdrop-blur-sm text-white rounded-full hover:bg-black/80 transition-colors duration-200 flex items-center justify-center z-10"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = fullscreenImageIndex < images.length - 1 ? fullscreenImageIndex + 1 : 0;
                    setFullscreenImageIndex(newIndex);
                  }}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/60 backdrop-blur-sm text-white rounded-full hover:bg-black/80 transition-colors duration-200 flex items-center justify-center z-10"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </>
            )}
            
            {/* Image Info in Fullscreen */}
            <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="font-medium">{portfolioItem.title}</div>
                {isNativeFullscreen && (
                  <div className="flex items-center text-green-400 text-xs">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1">
                      <path d="M3 3h6l-6 6V3zM21 3h-6l6 6V3zM21 21h-6l6-6v6zM3 21h6l-6-6v6z"/>
                    </svg>
                    Native Fullscreen
                  </div>
                )}
              </div>
              <div className="text-sm text-white/70">Image {fullscreenImageIndex + 1} of {images.length}</div>
              <div className="text-xs text-white/50 mt-1">
                Press ESC to exit • Use ← → arrows to navigate • Spacebar for next
              </div>
            </div>
          </motion.div>
        )}
        </>
      )}
    </AnimatePresence>
  );
}