import React, { useState } from 'react';
import { Image as ImageIcon, Play, Grid, List } from 'lucide-react';
import ImageModal from '../ImageModal';

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

  const filteredMedia = React.useMemo(() => {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Gallery</h1>
        <p className="text-xl text-gray-600">
          Explore our comprehensive collection of project photos and videos
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Category Filters - Made responsive */}
          <div className="w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 min-w-max sm:min-w-0">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base rounded-md font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  {category.label}
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm opacity-75">({category.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
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
                ${viewMode === 'list' ? 'flex bg-white' : 'bg-white'}
              `}
              onClick={() => openModal(index)}
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="relative aspect-video overflow-hidden">
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
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {isVideo(item) ? 'Project Video' : 'Project Image'} {index + 1}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isVideo(item) ? 'Video tour of the project' : 'High-quality project imagery'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden">
                    {isVideo(item) ? (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 
                                    flex items-center justify-center">
                        <Play className="text-white" size={20} />
                      </div>
                    ) : (
                      <img
                        src={item}
                        alt={`Gallery item ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="flex-1 p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {isVideo(item) ? 'Project Video' : 'Project Image'} {index + 1}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {isVideo(item) ? 'Video tour of the project' : 'High-quality project imagery'}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
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
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <ImageIcon className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No media found</h3>
          <p className="text-gray-500">
            {selectedCategory === 'all' 
              ? 'No media available for this project yet'
              : `No ${selectedCategory} available for this project yet`
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