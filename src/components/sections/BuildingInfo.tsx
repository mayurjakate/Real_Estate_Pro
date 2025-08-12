import React, { Suspense } from "react";
import {
  MapPin,
  Calendar,
  Building,
  User,
  Layers,
  Car,
  Users,
  QrCode,
  Play,
  Image as ImageIcon,
} from "lucide-react";
import ImageModal from "../ImageModal";
import BuildingViewer from "../BuildingViewer";

interface BuildingInfoProps {
  siteData: any;
}

const BuildingInfo: React.FC<BuildingInfoProps> = ({ siteData }) => {
  if (!siteData) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading site information...
      </div>
    );
  }

  const [modalOpen, setModalOpen] = React.useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);

  const media = [
    ...(siteData?.gallery?.images || []),
    ...(siteData?.gallery?.videos || []),
  ];

  const openModal = (index: number) => {
    setCurrentMediaIndex(index);
    setModalOpen(true);
  };

  const buildingDetails = [
    {
      icon: MapPin,
      label: "Location",
      value: siteData?.buildingDetails?.location,
    },
    {
      icon: Calendar,
      label: "Possession",
      value: siteData?.buildingDetails?.possession,
    },
    {
      icon: User,
      label: "Contractor",
      value: siteData?.buildingDetails?.contractor,
    },
    {
      icon: Building,
      label: "Launch Year",
      value: siteData?.buildingDetails?.launchYear,
    },
    {
      icon: Calendar,
      label: "Current Status",
      value: siteData?.buildingDetails?.currentStatus,
    },
  ];

  const buildingFeatures = [
    {
      icon: Layers,
      label: "Floors",
      value: siteData?.buildingFeatures?.floors,
    },
    {
      icon: Building,
      label: "Total Flats",
      value: siteData?.buildingFeatures?.totalFlats,
    },
    {
      icon: Users,
      label: "Elevators",
      value: siteData?.buildingFeatures?.elevators,
    },
    {
      icon: Car,
      label: "Parking Levels",
      value: siteData?.buildingFeatures?.parkingLevel,
    },
  ];

  const modelPath = siteData?.threeDModel?.path || null;
  const viewerConfig = siteData?.threeDModel?.viewerConfig || {};

  // This is the new spinner fallback UI
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

  return (
    <div className="space-y-8">
      {/* Project Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-2">{siteData?.name}</h1>
        <p className="text-xl text-indigo-100 mb-4">{siteData?.tagline}</p>
        <p className="text-indigo-200">
          <span className="font-semibold">MahaRERA Number:</span>{" "}
          {siteData?.maharera}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Building Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Building Details
          </h2>
          <div className="space-y-4">
            {buildingDetails.map((detail, index) => {
              const Icon = detail.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <Icon className="text-indigo-600 flex-shrink-0" size={20} />
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">
                      {detail.label}:
                    </span>
                    <span className="ml-2 text-gray-900">{detail.value}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Google Map Placeholder */}
          <div
            className="mt-6 h-48 bg-gradient-to-br from-blue-100 to-indigo-100 
rounded-lg flex items-center justify-center border-2 border-dashed border-indigo-300"
          >
            <div className="text-center text-indigo-600">
              <MapPin size={32} className="mx-auto mb-2" />
              <p className="font-medium">Google Map Integration</p>
              <p className="text-sm">
                Location: {siteData?.buildingDetails?.location}
              </p>
            </div>
          </div>
        </div>

        {/* Building Features */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Building Features
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {buildingFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-indigo-50 to-purple-50 
 p-4 rounded-lg border border-indigo-100"
                >
                  <Icon className="text-indigo-600 mb-2" size={24} />
                  <div className="text-2xl font-bold text-gray-900">
                    {feature.value}
                  </div>
                  <div className="text-sm text-gray-600">{feature.label}</div>
                </div>
              );
            })}
          </div>

          {/* 3D Model View */}

          <div className="h-48 rounded-lg mb-4 border-2 border-dashed border-indigo-300">
            {modelPath ? (
              <Suspense fallback={loadingFallback}>
                <BuildingViewer modelPath={modelPath} config={viewerConfig} />
              </Suspense>
            ) : (
              loadingFallback
            )}
          </div>

          {/* AR QR Code */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <QrCode className="text-green-600" size={24} />
                <div>
                  <p className="font-medium text-gray-900">AR Experience</p>
                  <p className="text-sm text-gray-600">Scan to view in AR</p>
                </div>
              </div>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 
 rounded-lg font-medium transition-colors"
              >
                Open AR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Carousel */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Project Media</h2>
          <div className="flex items-center space-x-2 text-gray-600">
            <ImageIcon size={20} />
            <span>{media.length} items</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.slice(0, 8).map((item, index) => (
            <div
              key={index}
              className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md 
 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              onClick={() => openModal(index)}
            >
              {item.includes(".mp4") || item.includes("video") ? (
                <div className="aspect-video bg-gray-800 flex items-center justify-center">
                  <Play className="text-white" size={32} />
                </div>
              ) : (
                <img
                  src={item}
                  alt={`Media ${index + 1}`}
                  className="w-full aspect-video object-cover"
                />
              )}
              <div
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 
 transition-all duration-200 flex items-center justify-center"
              >
                <ImageIcon
                  className="text-white opacity-0 group-hover:opacity-100 
 transition-opacity duration-200"
                  size={24}
                />
              </div>
            </div>
          ))}

          {media.length > 8 && (
            <div
              className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 
rounded-lg flex items-center justify-center border-2 border-dashed border-indigo-300"
            >
              <div className="text-center text-indigo-600">
                <p className="font-medium">+{media.length - 8}</p>
                <p className="text-sm">more items</p>
              </div>
            </div>
          )}
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

export default BuildingInfo;