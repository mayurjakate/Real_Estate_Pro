import React, { useState, useMemo, Suspense } from 'react';
import { 
  ChevronDown, 
  Search, 
  Home, 
  Maximize, 
  DollarSign, 
  CheckCircle, 
  Bed, 
  Bath, 
  Compass, 
  QrCode, 
  Building,
  Image as ImageIcon,
  Play
} from 'lucide-react';
import ImageModal from '../ImageModal';
import BuildingViewer from '../BuildingViewer'; // Make sure this is correctly imported

interface FlatInfoProps {
  siteData: any;
}

const FlatInfo: React.FC<FlatInfoProps> = ({ siteData }) => {
  const [selectedFlat, setSelectedFlat] = useState('101');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const flats = siteData?.flats || {};
  const flatNumbers = Object.keys(flats);
  
  const filteredFlats = useMemo(() => {
    return flatNumbers.filter(flatNumber =>
      flatNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flats[flatNumber]?.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [flatNumbers, flats, searchTerm]);

  React.useEffect(() => {
    if (flatNumbers.length > 0 && !flats[selectedFlat]) {
      setSelectedFlat(flatNumbers[0]);
    }
  }, [flatNumbers, selectedFlat, flats]);

  const currentFlat = flats[selectedFlat];
  const media = currentFlat ? [...(currentFlat.images || []), ...(currentFlat.videos || [])] : [];

  const openModal = (index: number) => {
    setCurrentMediaIndex(index);
    setModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'limited availability': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentFlat) {
    return (
      <div className="text-center py-12">
        <Home className="mx-auto text-gray-400 mb-4" size={48} />
        <h2 className="text-xl font-semibold text-gray-600">No flat data available</h2>
      </div>
    );
  }

  // Define the loading fallback with a spinner
  const loadingFallback = (
    <div
      className="h-full bg-gray-100 rounded-lg flex items-center justify-center 
                   border-2 border-dashed border-gray-300"
    >
      <div className="text-center text-indigo-600">
        <svg className="animate-spin h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-2 text-sm font-medium">Loading 3D Model...</p>
      </div>
    </div>
  );

  // Define the fallback for when no model exists
  const noModelFallback = (
    <div
      className="h-full bg-gray-100 rounded-lg flex items-center justify-center 
                   border-2 border-dashed border-gray-300"
    >
      <div className="text-center text-gray-400">
        <Building size={32} className="mx-auto mb-2" />
        <p className="font-medium">3D Model Not Available</p>
        <p className="text-sm">Please check back later.</p>
      </div>
    </div>
  );

  // Retrieve model data directly from the currentFlat
  const modelPath = currentFlat?.threeDModel?.path || null;
  const viewerConfig = currentFlat?.threeDModel?.viewerConfig || {};

  return (
    <div className="space-y-8">
      {/* Flat Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Flat Information</h1>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-64 px-4 py-2.5 bg-gradient-to-r 
                         from-indigo-600 to-purple-600 text-white rounded-lg shadow-md 
                         hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              <span className="font-medium">
                {currentFlat.flatNumber} - {currentFlat.type}
              </span>
              <ChevronDown 
                size={16} 
                className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl 
                               border border-gray-200 z-20">
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                         text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search flats..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg 
                                   focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                    {filteredFlats.map((flatNumber) => {
                      const flat = flats[flatNumber];
                      return (
                        <button
                          key={flatNumber}
                          onClick={() => {
                            setSelectedFlat(flatNumber);
                            setIsDropdownOpen(false);
                            setSearchTerm('');
                          }}
                          className={`w-full text-left p-4 hover:bg-indigo-50 transition-colors 
                                     ${selectedFlat === flatNumber ? 'bg-indigo-100' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">
                                {flat.flatNumber} - {flat.type}
                              </div>
                              <div className="text-sm text-gray-600">
                                {flat.area} • {flat.price}
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(flat.status)}`}>
                              {flat.status}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Flat Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Flat Details</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg">
                <Home className="text-indigo-600 mb-2" size={24} />
                <div className="text-lg font-bold text-gray-900">{currentFlat.flatNumber}</div>
                <div className="text-sm text-gray-600">Flat Number</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg">
                <Building className="text-blue-600 mb-2" size={24} />
                <div className="text-lg font-bold text-gray-900">{currentFlat.type}</div>
                <div className="text-sm text-gray-600">Type</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
                <Maximize className="text-purple-600 mb-2" size={24} />
                <div className="text-lg font-bold text-gray-900">{currentFlat.area}</div>
                <div className="text-sm text-gray-600">Area</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
                <DollarSign className="text-green-600 mb-2" size={24} />
                <div className="text-lg font-bold text-gray-900">{currentFlat.price}</div>
                <div className="text-sm text-gray-600">Price</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentFlat.status)}`}>
                <CheckCircle className="inline mr-1" size={14} />
                {currentFlat.status}
              </span>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Additional Information</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Bed className="text-blue-600 mx-auto mb-2" size={24} />
                <div className="text-2xl font-bold text-gray-900">{currentFlat.bedrooms}</div>
                <div className="text-sm text-gray-600">Bedrooms</div>
              </div>
              
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <Bath className="text-indigo-600 mx-auto mb-2" size={24} />
                <div className="text-2xl font-bold text-gray-900">{currentFlat.bathrooms}</div>
                <div className="text-sm text-gray-600">Bathrooms</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Compass className="text-purple-600 mx-auto mb-2" size={24} />
                <div className="text-lg font-bold text-gray-900">{currentFlat.facing}</div>
                <div className="text-sm text-gray-600">Facing</div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {currentFlat.amenities?.map((amenity: string, index: number) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Media and 3D */}
        <div className="space-y-6">
          {/* Media Gallery */}
<div className="bg-white rounded-xl shadow-lg p-6">
    <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Media Gallery</h3>
        <div className="flex items-center space-x-2 text-gray-600">
            <ImageIcon size={20} />
            <span>{media.length} items</span>
        </div>
    </div>
    
    {/* Main Media Display */}
    <div className="relative mb-4 rounded-xl overflow-hidden shadow-md h-72">
        {media.length > 0 ? (
            media[currentMediaIndex].includes('.mp4') || media[currentMediaIndex].includes('video') ? (
                <video
                    src={media[currentMediaIndex]}
                    controls
                    className="w-full h-full object-cover"
                />
            ) : (
                <img
                    src={media[currentMediaIndex]}
                    alt={`Media ${currentMediaIndex + 1}`}
                    className="w-full h-full object-cover"
                />
            )
        ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                <p>No media available</p>
            </div>
        )}
    </div>

    {/* Media Previews Carousel */}
    <div className="flex overflow-x-auto gap-2 p-1 hide-scrollbar">
        {media.map((item, index) => (
            <div 
                key={index} 
                onClick={() => setCurrentMediaIndex(index)}
                className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden cursor-pointer 
                            border-2 transition-all ${currentMediaIndex === index ? 'border-indigo-600' : 'border-transparent'}`}
            >
                {item.includes('.mp4') || item.includes('video') ? (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Play className="text-white" size={16} />
                    </div>
                ) : (
                    <img
                        src={item}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
        ))}
    </div>
</div>

          {/* 3D Model */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">3D Model</h3>
            <div className="h-48 rounded-lg mb-4">
              {modelPath ? (
                <Suspense fallback={loadingFallback}>
                  <BuildingViewer modelPath={modelPath} config={viewerConfig} />
                </Suspense>
              ) : (
                noModelFallback
              )}
            </div>
          </div>

          {/* AR QR Code */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">AR Experience</h3>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <QrCode className="text-green-600" size={32} />
                  <div>
                    <p className="font-medium text-gray-900">View in AR</p>
                    <p className="text-sm text-gray-600">Experience the flat virtually</p>
                  </div>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 
                                   rounded-lg font-medium transition-colors">
                  Open AR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        media={media}
        currentIndex={currentMediaIndex}
        onNavigate={setCurrentMediaIndex}
      />
    </div>
  );
};

export default FlatInfo;