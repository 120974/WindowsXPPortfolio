import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function MyPicturesApp() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'slideshow'>('grid');

  // Updated photos with Google Drive links
  const photos = [
    { id: '1', url: 'https://lh3.googleusercontent.com/d/1oif23HAn5LyzS_hHr3ciDDaMVlG0FwIn' },
    { id: '2', url: 'https://lh3.googleusercontent.com/d/185qDqA3V2iWMyhD4HR3TRYeBJW0sWlew' },
    { id: '3', url: 'https://lh3.googleusercontent.com/d/1LWp0agGVFHWlVnXvHMXh_ELI_CsfDg6I' },
    { id: '4', url: 'https://lh3.googleusercontent.com/d/1UiZpSA2lMMgSsJzzcGH4DilE6SxyeMTZ' },
    { id: '5', url: 'https://lh3.googleusercontent.com/d/1KXlX-KwjS1XrchSf6pTO-eCfZfhZGcWP' },
    { id: '6', url: 'https://lh3.googleusercontent.com/d/1EgeiL_M2TexO8OtZd0WRChA9namHs4-9' },
    { id: '7', url: 'https://lh3.googleusercontent.com/d/1JfU_U3m9f0nIC_p03J0hU-KpT7Zbz1vt' },
    { id: '8', url: 'https://lh3.googleusercontent.com/d/17PSVTrMitUHXVDmSSj6dIARAD64tx_hk' },
    { id: '9', url: 'https://lh3.googleusercontent.com/d/1B2oapTbzD5IEqhJpuWufIjzM3CQ5kmZx' },
    { id: '10', url: 'https://lh3.googleusercontent.com/d/1LeIDRCawp4I3X4MMyVlZBc_9SyLjdPNO' },
    { id: '11', url: 'https://lh3.googleusercontent.com/d/1jSoIhgr145lPwERwatmFa3S6J4I_0kiJ' },
    { id: '12', url: 'https://lh3.googleusercontent.com/d/1N9NM3dYt1gby5mcVr6HPe8zm0Me8R5wT' },
    { id: '13', url: 'https://lh3.googleusercontent.com/d/1HY7foXlHDz8Bhn0LzyjIUMlYcpGChK9y' },
    { id: '14', url: 'https://lh3.googleusercontent.com/d/1Q8uCcwTRmrhqlgr-zU-dKgosh3s2cQp-' },
    { id: '15', url: 'https://lh3.googleusercontent.com/d/18tNCFQHntQMTCM28KHah-Jv-zrjfteXn' },
    { id: '16', url: 'https://lh3.googleusercontent.com/d/1lXarWPN15ca1A-MuhEeLRTWd8EIrTe6S' },
    { id: '17', url: 'https://lh3.googleusercontent.com/d/1lfJt2t7lPtUCJbuwOp_uSxmy3tQZ-1wZ' },
    { id: '18', url: 'https://lh3.googleusercontent.com/d/1JjEo510UuNbly0kMyrdzQGmSGseXDl-J' },
    { id: '19', url: 'https://lh3.googleusercontent.com/d/10KfHGPW2e6thbMfzz_vcdA59LXUJhf-6' },
    { id: '20', url: 'https://lh3.googleusercontent.com/d/1SQhDThwvTUADnPQ1imSXZVz1D7h5Bd79' }
  ];

  const selectedPhoto = photos.find(photo => photo.id === selectedImage);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    if (selectedPhoto) {
      const currentIdx = photos.findIndex(p => p.id === selectedPhoto.id);
      const nextIdx = (currentIdx + 1) % photos.length;
      setSelectedImage(photos[nextIdx].id);
      setCurrentIndex(nextIdx);
    }
  };

  const prevImage = () => {
    if (selectedPhoto) {
      const currentIdx = photos.findIndex(p => p.id === selectedPhoto.id);
      const prevIdx = currentIdx === 0 ? photos.length - 1 : currentIdx - 1;
      setSelectedImage(photos[prevIdx].id);
      setCurrentIndex(prevIdx);
    }
  };

  // Add scroll wheel navigation for slideshow
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (viewMode === 'slideshow' && selectedPhoto) {
        e.preventDefault();
        if (e.deltaY > 0) {
          nextImage(); // Scroll down = next image
        } else {
          prevImage(); // Scroll up = previous image
        }
      }
    };

    if (viewMode === 'slideshow') {
      window.addEventListener('wheel', handleWheel, { passive: false });
      return () => window.removeEventListener('wheel', handleWheel);
    }
  }, [viewMode, selectedPhoto]);

  return (
    <div className="h-full flex flex-col" style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '11px' }}>
      {/* Toolbar */}
      <div 
        className="h-10 border-b flex items-center px-3 space-x-3"
        style={{ 
          background: 'linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%)',
          borderColor: '#c0c0c0'
        }}
      >
        <button 
          onClick={() => setViewMode('grid')}
          className={`px-3 py-1 text-xs border ${viewMode === 'grid' ? 'shadow-inner' : ''}`}
          style={{
            background: viewMode === 'grid' 
              ? 'linear-gradient(180deg, #e0e0e0 0%, #f0f0f0 100%)'
              : 'linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%)',
            borderColor: '#999999'
          }}
        >
          🔲 Grid View
        </button>
        <button 
          onClick={() => setViewMode('slideshow')}
          className={`px-3 py-1 text-xs border ${viewMode === 'slideshow' ? 'shadow-inner' : ''}`}
          style={{
            background: viewMode === 'slideshow' 
              ? 'linear-gradient(180deg, #e0e0e0 0%, #f0f0f0 100%)'
              : 'linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%)',
            borderColor: '#999999'
          }}
        >
          🎞️ Slideshow
        </button>
        <div className="flex-1"></div>
        <span className="text-xs text-gray-600">{photos.length} items</span>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'grid' ? (
          <div className="h-full overflow-y-auto p-4 xp-scrollbar">
            <div className="grid grid-cols-5 gap-3">
              {photos.map((photo) => (
                <div 
                  key={photo.id}
                  className="border-2 cursor-pointer hover:shadow-lg transition-all duration-200"
                  style={{ 
                    background: 'white',
                    borderColor: selectedImage === photo.id ? '#0066cc' : '#c0c0c0'
                  }}
                  onClick={() => setSelectedImage(photo.id)}
                  onDoubleClick={() => {
                    setSelectedImage(photo.id);
                    setViewMode('slideshow');
                  }}
                >
                  <div className="relative">
                    <ImageWithFallback
                      src={photo.url}
                      alt={`Photo ${photo.id}`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex">
            {/* Slideshow View */}
            <div className="flex-1 flex items-center justify-center bg-black relative">
              {selectedPhoto ? (
                <div className="relative w-full h-full flex items-center justify-center p-8">
                  <ImageWithFallback
                    src={selectedPhoto.url}
                    alt={`Photo ${selectedPhoto.id}`}
                    className="max-w-full max-h-full object-contain"
                  />
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-60 text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all text-xl"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black bg-opacity-60 text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all text-xl"
                  >
                    →
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-60 px-4 py-2 rounded-full">
                    <p className="text-xs">
                      {photos.findIndex(p => p.id === selectedPhoto.id) + 1} / {photos.length}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-white text-center">
                  <p className="text-base mb-2">Select a photo to view</p>
                  <p className="text-sm opacity-60">Click on a thumbnail to start slideshow</p>
                </div>
              )}
            </div>
            
            {/* Thumbnail Strip */}
            <div 
              className="w-32 border-l overflow-y-auto xp-scrollbar"
              style={{ 
                background: 'linear-gradient(180deg, #f8f8f8 0%, #e8e8e8 100%)',
                borderColor: '#c0c0c0'
              }}
            >
              <div className="p-2 space-y-2">
                {photos.map((photo) => (
                  <div 
                    key={photo.id}
                    className={`cursor-pointer border-2 transition-all duration-200 ${
                      selectedImage === photo.id ? 'shadow-lg scale-105' : 'hover:shadow-md'
                    }`}
                    style={{ 
                      borderColor: selectedImage === photo.id ? '#0066cc' : '#c0c0c0'
                    }}
                    onClick={() => setSelectedImage(photo.id)}
                  >
                    <div className="relative">
                      <ImageWithFallback
                        src={photo.url}
                        alt={photo.url}
                        className="w-full h-16 object-cover"
                      />
                      <div 
                        className="absolute top-0 right-0 px-1 text-xs"
                        style={{ 
                          background: 'rgba(0, 0, 0, 0.6)', 
                          color: 'white',
                          fontSize: '8px'
                        }}
                      >
                        {photo.id}
                      </div>
                    </div>
                  </div>
                ))}
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
        {selectedPhoto ? (
          <span>Photo {selectedPhoto.id} of {photos.length} selected</span>
        ) : (
          <span>My Pictures - {photos.length} photos</span>
        )}
        <div className="flex-1"></div>
        <span>{viewMode === 'grid' ? 'Grid View' : 'Slideshow Mode'}</span>
      </div>
    </div>
  );
}