import React from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: string[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  media,
  currentIndex,
  onNavigate,
}) => {
  if (!isOpen || !media || media.length === 0) return null;

  const currentMedia = media[currentIndex];
  const isVideo = currentMedia?.toLowerCase().endsWith('.mp4');

  const handlePrevious = () => {
    onNavigate(currentIndex > 0 ? currentIndex - 1 : media.length - 1);
  };

  const handleNext = () => {
    onNavigate(currentIndex < media.length - 1 ? currentIndex + 1 : 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white 
                   p-2 rounded-full hover:bg-opacity-75 transition-all"
        >
          <X size={24} />
        </button>

        {/* Navigation Buttons */}
        {media.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 
                       bg-black bg-opacity-50 text-white p-2 rounded-full 
                       hover:bg-opacity-75 transition-all"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 
                       bg-black bg-opacity-50 text-white p-2 rounded-full 
                       hover:bg-opacity-75 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Media Content */}
        <div
          className="max-w-full max-h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {isVideo ? (
            <video
              src={currentMedia}
              controls
              autoPlay
              className="max-w-full max-h-full rounded-lg shadow-2xl"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={currentMedia}
              alt={`Gallery ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onLoad={() => console.log('Image loaded')}
              onError={() => console.log('Image failed to load')}
            />
          )}
        </div>

        {/* Media Counter */}
        <div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                      bg-black bg-opacity-50 text-white px-4 py-2 rounded-full"
        >
          {currentIndex + 1} / {media.length}
        </div>

        {/* Thumbnail Navigation */}
        {media.length > 1 && (
          <div
            className="absolute bottom-16 left-1/2 transform -translate-x-1/2 
                        flex space-x-2 max-w-xl overflow-x-auto pb-2"
          >
            {media.map((item, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(index);
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 
                          ${index === currentIndex
                    ? 'border-indigo-400'
                    : 'border-transparent hover:border-gray-400'
                  } transition-all`}
              >
                {item.toLowerCase().endsWith('.mp4') ? (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <Play size={16} className="text-white" />
                  </div>
                ) : (
                  <img
                    src={item}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
