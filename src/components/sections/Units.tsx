import React, { useState, useMemo } from 'react';
import {
  Filter,
  Search,
  Home,
  Maximize,
  Bed,
  Bath,
  CheckCircle,
  Eye,
  X // Added for a potential clear filter button later if desired
} from 'lucide-react';

// Define the interface for the flat data for better type safety
interface Flat {
  type: string;
  status: 'Available' | 'Limited Availability' | 'Sold' | string;
  images?: string[];
  flatNumber: string;
  price: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  facing: string;
  amenities?: string[];
}

interface SiteData {
  flats: { [key: string]: Flat };
}

interface UnitsProps {
  siteData: SiteData;
  onFlatSelect: (flatNumber: string) => void;
}

const Units: React.FC<UnitsProps> = ({ siteData, onFlatSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Extract flats data safely, defaulting to an empty object
  const flats = siteData?.flats || {};
  const flatNumbers = Object.keys(flats);

  // Memoize the list of available flat types
  const types = useMemo(() => {
    const typeSet = new Set(flatNumbers.map(num => flats[num]?.type));
    return ['all', ...Array.from(typeSet)];
  }, [flatNumbers, flats]);

  // Define static statuses
  const statuses = ['all', 'Available', 'Limited Availability', 'Sold'];

  // Filter flats based on search term, type, and status
  const filteredFlats = useMemo(() => {
    return flatNumbers.filter(flatNumber => {
      const flat = flats[flatNumber];
      // Check if flat data exists before accessing properties
      if (!flat) return false;

      const matchesSearch =
        flatNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flat.type?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || flat.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || flat.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [flatNumbers, flats, searchTerm, selectedType, selectedStatus]);

  // Determine status badge color based on status
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'limited availability': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sold': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Handle flat selection for viewing details
  const handleViewDetails = (flatNumber: string) => {
    onFlatSelect(flatNumber);
  };

  return (
    // Main container with responsive padding and max-width
    <div className="container mx-auto p-4 sm:p- lg:p-8 space-y-8 font-inter">
      {/* Header section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
          Explore Our Flats
        </h1>
       
      </div>

      {/* Filters section - Enhanced for attractiveness and responsiveness */}
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center w-full">
          {/* Search input */}
          <div className="relative flex-1 w-full md:max-w-xs lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by flat number or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none
                         text-sm sm:text-base transition-all duration-200 ease-in-out"
            />
          </div>

          {/* Type and Status Filters - Grouped for better mobile layout */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full md:w-auto flex-wrap justify-center md:justify-end">
            {/* Type Filter */}
            <div className="relative flex items-center w-full sm:w-auto min-w-[150px] group">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 pl-10 pr-10 py-3 border border-gray-200 rounded-lg shadow-sm
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none
                           text-sm sm:text-base cursor-pointer appearance-none
                           bg-white bg-[length:12px_12px] bg-[position:calc(100%-12px)_center] bg-no-repeat
                           bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2712%27%20height%3D%2712%27%20viewBox%3D%270%200%2012%2012%27%3E%3Cpath%20fill%3D%27none%27%20stroke%3D%27%234B5563%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27M2%204l4%204%204-4%27%2F%3E%3C%2Fsvg%3E')]
                           hover:border-indigo-400 transition-all duration-200"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative flex items-center w-full sm:w-auto min-w-[150px] group">
              <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 pl-10 pr-10 py-3 border border-gray-200 rounded-lg shadow-sm
                           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none
                           text-sm sm:text-base cursor-pointer appearance-none
                           bg-white bg-[length:12px_12px] bg-[position:calc(100%-12px)_center] bg-no-repeat
                           bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2712%27%20height%3D%2712%27%20viewBox%3D%270%200%2012%2012%27%3E%3Cpath%20fill%3D%27none%27%20stroke%3D%27%234B5563%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27M2%204l4%204%204-4%27%2F%3E%3C%2Fsvg%3E')]
                           hover:border-indigo-400 transition-all duration-200"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-6 text-sm sm:text-base text-gray-600 text-center md:text-left">
          Showing <span className="font-semibold text-indigo-700">{filteredFlats.length}</span> of <span className="font-semibold text-indigo-700">{flatNumbers.length}</span> flats
        </div>
      </div>

      {/* Flats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
        {filteredFlats.map((flatNumber) => {
          const flat = flats[flatNumber];
          const mainImage = flat.images?.[0] || 'https://placehold.co/600x400/E0E0E0/333333?text=Flat+Image';

          return (
            <div
              key={flatNumber}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer
                         hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img
                  src={mainImage}
                  alt={`${flat.flatNumber} - ${flat.type}`}
                  className="w-full h-full object-cover transition-transform duration-300
                             hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://placehold.co/600x400/E0E0E0/333333?text=Image+Not+Found';
                  }}
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(flat.status)}`}>
                    {flat.status}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="bg-black bg-opacity-75 text-white px-3 py-1.5 rounded-lg">
                    <span className="text-lg sm:text-xl font-bold">{flat.flatNumber}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-0">{flat.type}</h3>
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-bold text-indigo-600">{flat.price}</div>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-4 text-sm sm:text-base">
                  <Maximize size={16} className="mr-2 text-indigo-500" />
                  <span>{flat.area}</span>
                </div>

                <div className="flex flex-wrap items-center space-x-4 mb-6 text-sm sm:text-base text-gray-700">
                  <div className="flex items-center">
                    <Bed size={18} className="mr-2 text-indigo-500" />
                    <span>{flat.bedrooms} Bed</span>
                  </div>
                  <div className="flex items-center">
                    <Bath size={18} className="mr-2 text-indigo-500" />
                    <span>{flat.bathrooms} Bath</span>
                  </div>
                  <div className="text-gray-600">
                    {flat.facing} Facing
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {flat.amenities?.slice(0, 3).map((amenity: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                    {flat.amenities && flat.amenities.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        +{flat.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleViewDetails(flatNumber)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600
                             hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg
                             font-medium transition-all duration-200 flex items-center justify-center space-x-2
                             text-base sm:text-lg shadow-md hover:shadow-lg"
                >
                  <Eye size={20} />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* No flats found message */}
      {filteredFlats.length === 0 && (
        <div className="text-center py-12 px-4 bg-white rounded-xl shadow-lg">
          <Home className="mx-auto text-gray-400 mb-4" size={56} />
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-2">No flats found</h3>
          <p className="text-gray-500 text-base sm:text-lg">Try adjusting your search or filter criteria to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default Units;