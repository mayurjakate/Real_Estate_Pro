import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import BuildingInfo from './components/sections/BuildingInfo';
import FlatInfo from './components/sections/FlatInfo';
import Units from './components/sections/Units';
import Gallery from './components/sections/Gallery';
import Amenities from './components/sections/Amenities';
import Enquiry from './components/sections/Enquiry';
import ProjectMembers from './components/sections/ProjectMembers';
import sitesData from "./components/data/sites.json";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('building');
  const [selectedSite, setSelectedSite] = useState('Vista Imperia');

  const sites = Object.keys(sitesData);
  const currentSiteData = sitesData[selectedSite as keyof typeof sitesData];

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFlatSelect = (flatNumber: string) => {
    setActiveSection('flat');
    // You might want to pass the flat number to the FlatInfo component
    // This could be done through additional state or props
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'building':
        return <BuildingInfo siteData={currentSiteData} />;
      case 'flat':
        return <FlatInfo siteData={currentSiteData} />;
      case 'units':
        return <Units siteData={currentSiteData} onFlatSelect={handleFlatSelect} />;
      case 'gallery':
        return <Gallery siteData={currentSiteData} />;
      case 'amenities':
        return <Amenities siteData={currentSiteData} />;
      case 'enquiry':
        return <Enquiry siteData={currentSiteData} />;
      case 'members':
        return <ProjectMembers siteData={currentSiteData} />;
      default:
        return <BuildingInfo siteData={currentSiteData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sites={sites}
        selectedSite={selectedSite}
        onSiteChange={setSelectedSite}
      />

      {/* Main Content */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'mr-64' : 'mr-16'}
      `}>
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
          <div className="text-left">
            <h1 className="text-lg font-semibold text-gray-900">
              DR City
            </h1>
            <p className="text-sm text-gray-600">
              Professional Property Management
            </p>
          </div>
              </div>
              {/* You can add other right-side content here if needed */}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;