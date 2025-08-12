import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  Home, 
  Maximize, 
  DollarSign, 
  Eye,
  Bed,
  Bath,
  CheckCircle
} from 'lucide-react';

interface UnitsProps {
  siteData: any;
  onFlatSelect: (flatNumber: string) => void;
}

const Units: React.FC<UnitsProps> = ({ siteData, onFlatSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const flats = siteData?.flats || {};
  const flatNumbers = Object.keys(flats);

  const types = useMemo(() => {
    const typeSet = new Set(flatNumbers.map(num => flats[num]?.type));
    return ['all', ...Array.from(typeSet)];
  }, [flatNumbers, flats]);

  const statuses = ['all', 'Available', 'Limited Availability', 'Sold'];

  const filteredFlats = useMemo(() => {
    return flatNumbers.filter(flatNumber => {
      const flat = flats[flatNumber];
      const matchesSearch = 
        flatNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flat.type?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || flat.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || flat.status === selectedStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [flatNumbers, flats, searchTerm, selectedType, selectedStatus]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'limited availability': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sold': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewDetails = (flatNumber: string) => {
    onFlatSelect(flatNumber);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Flats</h1>
        <p className="text-xl text-gray-600">
          Discover the perfect home from our collection of premium flats
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search flats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg 
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400" size={20} />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg 
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-gray-400" size={20} />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg 
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredFlats.length} of {flatNumbers.length} flats
        </div>
      </div>

      {/* Flats Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredFlats.map((flatNumber) => {
          const flat = flats[flatNumber];
          const mainImage = flat.images?.[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg';
          
          return (
            <div 
              key={flatNumber}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl 
                       transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={mainImage}
                  alt={`${flat.flatNumber} - ${flat.type}`}
                  className="w-full h-full object-cover transition-transform duration-300 
                           hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(flat.status)}`}>
                    {flat.status}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="bg-black bg-opacity-75 text-white px-3 py-1 rounded-lg">
                    <span className="text-lg font-bold">{flat.flatNumber}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{flat.type}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">{flat.price}</div>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <Maximize size={16} className="mr-1" />
                  <span className="text-sm">{flat.area}</span>
                </div>

                {/* Features */}
                <div className="flex items-center space-x-4 mb-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Bed size={16} className="mr-1" />
                    <span>{flat.bedrooms} Bed</span>
                  </div>
                  <div className="flex items-center">
                    <Bath size={16} className="mr-1" />
                    <span>{flat.bathrooms} Bath</span>
                  </div>
                  <div className="text-gray-500">
                    {flat.facing} Facing
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-1">
                    {flat.amenities?.slice(0, 3).map((amenity: string, index: number) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs"
                      >
                        {amenity}
                      </span>
                    ))}
                    {flat.amenities?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs">
                        +{flat.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleViewDetails(flatNumber)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 
                           hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg 
                           font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Eye size={18} />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFlats.length === 0 && (
        <div className="text-center py-12">
          <Home className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No flats found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Units;