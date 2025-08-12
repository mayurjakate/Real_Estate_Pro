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
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // New state for desktop collapse
  const [activeSection, setActiveSection] = useState('building');
  const [selectedSite, setSelectedSite] = useState('Vista Imperia');
  const sites = Object.keys(sitesData);
  const currentSiteData = sitesData[selectedSite as keyof typeof sitesData];

  // Handle responsive sidebar behavior on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false); // Close mobile sidebar on desktop
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFlatSelect = (flatNumber: string) => {
    setActiveSection('flat');
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar - Always visible */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-left lg:text-right">
            <h1 className="text-lg font-semibold text-gray-900">DR City</h1>
            <p className="text-sm text-gray-600">Professional Property Management</p>
          </div>
          {/* Burger icon for mobile */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 text-gray-700 lg:hidden"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          activeSection={activeSection}
          setActiveSection={handleSectionClick}
          sites={sites}
          selectedSite={selectedSite}
          onSiteChange={setSelectedSite}
        />

        {/* Main Content - Adjust margin based on desktop sidebar state */}
        <main className={`
          flex-1 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'lg:mr-16' : 'lg:mr-64'}
        `}>
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              {renderActiveSection()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;