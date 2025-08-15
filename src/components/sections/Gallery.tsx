import React, { useState, useMemo } from 'react';
import { Image as ImageIcon, Play, Grid, List } from 'lucide-react';
// Assuming ImageModal is a separate component and its responsiveness is handled within it
// import ImageModal from '../ImageModal'; 

interface GalleryProps {
  siteData: any;
}

const Gallery: React.FC<GalleryProps> = ({ siteData }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const images = siteData?.gallery?.images || [];
  const videos = siteData?.gallery?.videos || [];
  const allMedia = [...images, ...videos];

  const categories = [
    { id: 'all', label: 'All Media', count: allMedia.length },
    { id: 'images', label: 'Images', count: images.length },
    { id: 'videos', label: 'Videos', count: videos.length },
  ];

  const filteredMedia = useMemo(() => {
    switch (selectedCategory) {
      case 'images': return images;
      case 'videos': return videos;
      default: return allMedia;
    }
  }, [selectedCategory, images, videos, allMedia]);

  const openModal = (index: number) => {
    setCurrentMediaIndex(index);
    setModalOpen(true);
  };

  const isVideo = (url: string) => {
    return url.includes('.mp4') || url.includes('video');
  };

  // Placeholder for ImageModal component - replace with actual import
  const ImageModal = ({ isOpen, onClose, media, currentIndex, onNavigate }: any) => {
    if (!isOpen) return null;

    const currentItem = media[currentIndex];
    const isCurrentVideo = currentItem && isVideo(currentItem);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
        <div className="relative bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-auto">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="mb-4 flex justify-center items-center h-[60vh]">
            {isCurrentVideo ? (
              <video controls src={currentItem} className="max-w-full max-h-full rounded-md" />
            ) : (
              <img src={currentItem} alt="Gallery item" className="max-w-full max-h-full rounded-md" />
            )}
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => onNavigate(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => onNavigate(Math.min(media.length - 1, currentIndex + 1))}
              disabled={currentIndex === media.length - 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    // Main container with responsive padding and max-width
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 font-inter">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
          Project Gallery
        </h1>
        
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 bg-gray-100 rounded-lg p-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 sm:px-4 py-2 rounded-md font-medium transition-all text-sm sm:text-base
                  ${selectedCategory === category.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
              >
                {category.label}
                <span className="ml-1 sm:ml-2 text-xs sm:text-sm opacity-75">({category.count})</span>
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex-shrink-0 flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all
                ${viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all
                ${viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid/List */}
      {filteredMedia.length > 0 ? (
        <div className={`
          ${viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
            : 'space-y-4'
          }
        `}>
          {filteredMedia.map((item, index) => (
            <div
              key={index}
              className={`
                group cursor-pointer rounded-xl overflow-hidden shadow-lg
                hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
                ${viewMode === 'list' ? 'flex flex-col sm:flex-row bg-white' : 'bg-white'}
              `}
              onClick={() => openModal(index)}
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="relative aspect-video w-full overflow-hidden">
                    {isVideo(item) ? (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900
                                           flex items-center justify-center">
                        <Play className="text-white" size={32} />
                      </div>
                    ) : (
                      <img
                        src={item}
                        alt={`Gallery item ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300
                                           group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://placehold.co/600x400/E0E0E0/333333?text=Media+Not+Found';
                        }}
                      />
                    )}

                    <div className="absolute inset-0 bg-black bg-opacity-0
                                         group-hover:bg-opacity-30 transition-all duration-200
                                         flex items-center justify-center">
                      <div className="transform scale-0 group-hover:scale-100 transition-transform
                                             duration-200 bg-white bg-opacity-90 rounded-full p-3">
                        {isVideo(item) ? (
                          <Play className="text-gray-800" size={20} />
                        ) : (
                          <ImageIcon className="text-gray-800" size={20} />
                        )}
                      </div>
                    </div>

                    <div className="absolute top-2 right-2">
                      <span className="bg-black bg-opacity-75 text-white px-2 py-1
                                             rounded text-xs font-medium">
                        {isVideo(item) ? 'Video' : 'Image'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 text-base sm:text-lg">
                      {isVideo(item) ? 'Project Video' : 'Project Image'} {index + 1}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isVideo(item) ? 'Video tour of the project' : 'High-quality project imagery'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                    {isVideo(item) ? (
                      <div className="w-full h-full aspect-video sm:aspect-auto bg-gradient-to-br from-gray-800 to-gray-900
                                           flex items-center justify-center">
                        <Play className="text-white" size={32} />
                      </div>
                    ) : (
                      <img
                        src={item}
                        alt={`Gallery item ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://placehold.co/192x192/E0E0E0/333333?text=Media';
                        }}
                      />
                    )}
                  </div>

                  <div className="flex-1 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                        {isVideo(item) ? 'Project Video' : 'Project Image'} {index + 1}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {isVideo(item) ? 'Video tour of the project' : 'High-quality project imagery'}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1
                                             rounded text-xs font-medium">
                        {isVideo(item) ? 'Video' : 'Image'}
                      </span>
                      <button className="p-2 rounded-lg bg-indigo-600 text-white
                                             hover:bg-indigo-700 transition-colors">
                        {isVideo(item) ? <Play size={16} /> : <ImageIcon size={16} />}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg px-4">
          <ImageIcon className="mx-auto text-gray-400 mb-4" size={56} />
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-2">No media found</h3>
          <p className="text-gray-500 text-base sm:text-lg">
            {selectedCategory === 'all'
              ? 'No media available for this project yet.'
              : `No ${selectedCategory} available for this project yet. Try selecting "All Media".`
            }
          </p>
        </div>
      )}

      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        media={filteredMedia}
        currentIndex={currentMediaIndex}
        onNavigate={setCurrentMediaIndex}
      />
    </div>
  );
};

export default Gallery;