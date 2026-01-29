import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { portfolioData } from './constants/artData';
import { X, ExternalLink, Camera, Box, Palette, ChevronLeft, ChevronRight } from 'lucide-react';

interface CondensedPortfolioProps {
  isDarkMode?: boolean;
}

export default function CondensedPortfolio({ isDarkMode = false }: CondensedPortfolioProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const project = selectedProject 
    ? portfolioData.find(p => p.id === selectedProject)
    : null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'photography':
        return <Camera className="w-5 h-5" />;
      case '3d':
        return <Box className="w-5 h-5" />;
      case '2d':
        return <Palette className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'photography':
        return isDarkMode ? '#ff6b35' : '#4682b4';
      case '3d':
        return isDarkMode ? '#42b883' : '#7db46c';
      case '2d':
        return isDarkMode ? '#ffa500' : '#ffeb3b';
      default:
        return isDarkMode ? '#888888' : '#cccccc';
    }
  };

  const bgColor = isDarkMode ? '#0f0f23' : '#f5f5f5';
  const cardBg = isDarkMode ? '#1a1a2e' : '#ffffff';
  const textColor = isDarkMode ? '#ffffff' : '#1a1a1a';
  const mutedColor = isDarkMode ? '#cccccc' : '#666666';

  return (
    <div 
      className="min-h-screen w-full"
      style={{
        background: bgColor,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100vh'
      }}
    >
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-40 backdrop-blur-md border-b"
        style={{
          background: isDarkMode 
            ? 'rgba(26, 26, 46, 0.8)' 
            : 'rgba(255, 255, 255, 0.8)',
          borderColor: isDarkMode ? '#2a2a3e' : '#e0e0e0'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 
              className="text-3xl font-bold"
              style={{ color: textColor }}
            >
              Rishith Chintala
            </h1>
            <p 
              className="text-sm mt-1"
              style={{ color: mutedColor }}
            >
              Portfolio — Condensed Build
            </p>
          </motion.div>

          <motion.div 
            className="flex gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ 
              background: isDarkMode ? '#2a2a3e' : '#e8e8e8',
              color: mutedColor
            }}>
              <Camera className="w-4 h-4" />
              <span className="text-sm font-medium">5 Photography</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ 
              background: isDarkMode ? '#2a2a3e' : '#e8e8e8',
              color: mutedColor
            }}>
              <Box className="w-4 h-4" />
              <span className="text-sm font-medium">1 3D</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ 
              background: isDarkMode ? '#2a2a3e' : '#e8e8e8',
              color: mutedColor
            }}>
              <Palette className="w-4 h-4" />
              <span className="text-sm font-medium">3 2D</span>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Portfolio Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {portfolioData.map((item, index) => (
            <motion.div
              key={item.id}
              className="group cursor-pointer rounded-xl overflow-hidden border"
              style={{
                background: cardBg,
                borderColor: isDarkMode ? '#2a2a3e' : '#e0e0e0'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => {
                setSelectedProject(item.id);
                setImageIndex(0);
              }}
            >
              {/* Image */}
              <div 
                className="relative aspect-[4/3] overflow-hidden"
                style={{ background: isDarkMode ? '#2a2a3e' : '#f0f0f0' }}
              >
                <img 
                  src={item.featuredImageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Category Badge */}
                <div 
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2"
                  style={{
                    background: `${getCategoryColor(item.category)}33`,
                    border: `1px solid ${getCategoryColor(item.category)}66`
                  }}
                >
                  {getCategoryIcon(item.category)}
                  <span 
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: getCategoryColor(item.category) }}
                  >
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ color: textColor }}
                >
                  {item.title}
                </h3>
                <p 
                  className="text-sm mb-3 line-clamp-2"
                  style={{ color: mutedColor }}
                >
                  {item.description}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: mutedColor }}>{item.type}</span>
                  <span 
                    className="font-semibold"
                    style={{ color: getCategoryColor(item.category) }}
                  >
                    {item.year}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer 
        className="border-t mt-20 py-8"
        style={{
          borderColor: isDarkMode ? '#2a2a3e' : '#e0e0e0',
          color: mutedColor
        }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center text-sm">
          <p>© 2025 Rishith Chintala — All rights reserved</p>
        </div>
      </footer>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProject && project && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border"
              style={{
                background: cardBg,
                borderColor: isDarkMode ? '#2a2a3e' : '#e0e0e0'
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all"
                style={{
                  background: isDarkMode ? '#2a2a3e' : '#f0f0f0',
                  color: textColor
                }}
                onClick={() => setSelectedProject(null)}
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image Gallery */}
              <div className="relative aspect-video" style={{ background: isDarkMode ? '#2a2a3e' : '#f0f0f0' }}>
                <img
                  src={[project.featuredImageUrl, project.imageUrl1, project.imageUrl2][imageIndex]}
                  alt={project.title}
                  className="w-full h-full object-contain"
                />
                
                {/* Navigation Arrows */}
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all hover:scale-110"
                  style={{
                    background: isDarkMode ? 'rgba(42, 42, 62, 0.9)' : 'rgba(240, 240, 240, 0.9)',
                    color: textColor,
                    border: `1px solid ${isDarkMode ? '#2a2a3e' : '#e0e0e0'}`
                  }}
                  onClick={() => setImageIndex((imageIndex - 1 + 3) % 3)}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all hover:scale-110"
                  style={{
                    background: isDarkMode ? 'rgba(42, 42, 62, 0.9)' : 'rgba(240, 240, 240, 0.9)',
                    color: textColor,
                    border: `1px solid ${isDarkMode ? '#2a2a3e' : '#e0e0e0'}`
                  }}
                  onClick={() => setImageIndex((imageIndex + 1) % 3)}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                {/* Image Navigation */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {[0, 1, 2].map((idx) => (
                    <button
                      key={idx}
                      className="w-2.5 h-2.5 rounded-full transition-all"
                      style={{
                        background: imageIndex === idx 
                          ? getCategoryColor(project.category)
                          : (isDarkMode ? '#555555' : '#cccccc')
                      }}
                      onClick={() => setImageIndex(idx)}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="px-3 py-1.5 rounded-full flex items-center gap-2"
                        style={{
                          background: `${getCategoryColor(project.category)}22`,
                          border: `1px solid ${getCategoryColor(project.category)}66`
                        }}
                      >
                        {getCategoryIcon(project.category)}
                        <span 
                          className="text-xs font-semibold uppercase tracking-wider"
                          style={{ color: getCategoryColor(project.category) }}
                        >
                          {project.category}
                        </span>
                      </div>
                      <span className="text-sm" style={{ color: mutedColor }}>
                        {project.year}
                      </span>
                    </div>
                    <h2 className="text-4xl font-bold mb-2" style={{ color: textColor }}>
                      {project.title}
                    </h2>
                    <p className="text-lg" style={{ color: mutedColor }}>
                      {project.type}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <p className="text-base leading-relaxed" style={{ color: textColor }}>
                    {project.detailDescription}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <DetailItem 
                    label="Technique" 
                    value={project.technique}
                    isDarkMode={isDarkMode}
                    textColor={textColor}
                    mutedColor={mutedColor}
                  />
                  <DetailItem 
                    label="Medium" 
                    value={project.medium}
                    isDarkMode={isDarkMode}
                    textColor={textColor}
                    mutedColor={mutedColor}
                  />
                  <DetailItem 
                    label="Digital Tools" 
                    value={project.digitalTools}
                    isDarkMode={isDarkMode}
                    textColor={textColor}
                    mutedColor={mutedColor}
                  />
                  <DetailItem 
                    label="Physical Tools" 
                    value={project.physicalTools}
                    isDarkMode={isDarkMode}
                    textColor={textColor}
                    mutedColor={mutedColor}
                  />
                  <DetailItem 
                    label="Size" 
                    value={project.originalSize}
                    isDarkMode={isDarkMode}
                    textColor={textColor}
                    mutedColor={mutedColor}
                  />
                  <DetailItem 
                    label="Status" 
                    value={project.assignmentStatus}
                    isDarkMode={isDarkMode}
                    textColor={textColor}
                    mutedColor={mutedColor}
                  />
                </div>

                {/* Design Intentions */}
                <div 
                  className="p-6 rounded-xl border"
                  style={{
                    background: isDarkMode ? '#16162e' : '#f8f8f8',
                    borderColor: isDarkMode ? '#2a2a3e' : '#e0e0e0'
                  }}
                >
                  <h3 
                    className="text-sm font-semibold uppercase tracking-wider mb-3"
                    style={{ color: getCategoryColor(project.category) }}
                  >
                    Design Intentions
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: textColor }}>
                    {project.designIntentions}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
  isDarkMode: boolean;
  textColor: string;
  mutedColor: string;
}

function DetailItem({ label, value, isDarkMode, textColor, mutedColor }: DetailItemProps) {
  return (
    <div 
      className="p-4 rounded-lg border"
      style={{
        background: isDarkMode ? '#16162e' : '#fafafa',
        borderColor: isDarkMode ? '#2a2a3e' : '#e8e8e8'
      }}
    >
      <div className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: mutedColor }}>
        {label}
      </div>
      <div className="text-sm" style={{ color: textColor }}>
        {value}
      </div>
    </div>
  );
}