import React from 'react';
import { 
  Waves, 
  Dumbbell, 
  Baby, 
  Trees, 
  Shield, 
  Zap, 
  Droplets, 
  Home,
  CheckCircle
} from 'lucide-react';

interface AmenitiesProps {
  siteData: any;
}

const amenityIcons: Record<string, React.ComponentType<any>> = {
  'Swimming Pool': Waves,
  'Gymnasium': Dumbbell,
  'Children\'s Play Area': Baby,
  'Landscaped Gardens': Trees,
  '24/7 Security': Shield,
  'Power Backup': Zap,
  'Rainwater Harvesting': Droplets,
  'Clubhouse': Home,
};

const Amenities: React.FC<AmenitiesProps> = ({ siteData }) => {
  const amenities = siteData?.amenities || [];
  const siteName = siteData?.name || '';

  const getAmenityIcon = (amenity: string) => {
    const IconComponent = amenityIcons[amenity] || CheckCircle;
    return IconComponent;
  };

  const getAmenityColor = (index: number) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-green-500',
      'from-rose-500 to-pink-500',
      'from-amber-500 to-orange-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Premium Amenities</h1>
        <p className="text-xl text-gray-600">
          Experience luxury living with our world-class amenities at {siteName}
        </p>
      </div>

      {/* Amenities Grid */}
      {amenities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {amenities.map((amenity: string, index: number) => {
            const IconComponent = getAmenityIcon(amenity);
            const colorClass = getAmenityColor(index);
            
            return (
              <div
                key={index}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl 
                         transition-all duration-300 transform hover:-translate-y-2 
                         overflow-hidden"
              >
                <div className={`h-32 bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
                  <IconComponent 
                    size={48} 
                    className="text-white group-hover:scale-110 transition-transform duration-300" 
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                    {amenity}
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    {getAmenityDescription(amenity)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <Home className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No amenities listed</h3>
          <p className="text-gray-500">Amenities information will be updated soon</p>
        </div>
      )}

      {/* Additional Features */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Why Choose {siteName}?</h2>
          <p className="text-xl opacity-90">
            More than just amenities - it's a lifestyle
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 mx-auto mb-4 
                          flex items-center justify-center">
              <Shield size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Living</h3>
            <p className="opacity-90">
              Advanced security systems with 24/7 monitoring for your peace of mind
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 mx-auto mb-4 
                          flex items-center justify-center">
              <Trees size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Green Environment</h3>
            <p className="opacity-90">
              Lush landscapes and eco-friendly features for sustainable living
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 mx-auto mb-4 
                          flex items-center justify-center">
              <Home size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
            <p className="opacity-90">
              High-end finishes and modern design for comfortable living
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const getAmenityDescription = (amenity: string): string => {
  const descriptions: Record<string, string> = {
    'Swimming Pool': 'Refreshing pool for relaxation and fitness',
    'Gymnasium': 'State-of-the-art fitness equipment',
    'Children\'s Play Area': 'Safe and fun play zone for kids',
    'Landscaped Gardens': 'Beautiful green spaces for tranquility',
    '24/7 Security': 'Round-the-clock safety and surveillance',
    'Power Backup': 'Uninterrupted power supply',
    'Rainwater Harvesting': 'Eco-friendly water conservation',
    'Clubhouse': 'Community space for events and gatherings',
    'Food Court': 'Convenient dining options',
    'ATM': 'Banking services at your doorstep',
    'Escalators': 'Easy vertical transportation',
    'Centralized AC': 'Climate-controlled environment',
    'Fire Safety Systems': 'Advanced fire protection measures',
    'CCTV Surveillance': 'Comprehensive security monitoring',
    'Ample Parking': 'Convenient vehicle parking'
  };
  
  return descriptions[amenity] || 'Premium facility for enhanced living';
};

export default Amenities;