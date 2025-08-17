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
import ContactButtons from './components/ContactButtons.tsx';

function App() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('building');
  const [selectedSite, setSelectedSite] = useState('Vista Imperia');
  const [selectedFlatNumber, setSelectedFlatNumber] = useState<string | null>(null);

  const sites = Object.keys(sitesData);
  const currentSiteData = sitesData[selectedSite as keyof typeof sitesData];

  const CONTACT_PHONE = '+918779780901';
  const CONTACT_WHATSAPP = '918779780901';

  // Handle responsive sidebar behavior on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🔥 Reset scroll to top whenever active section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection]);

  const handleFlatSelect = (flatNumber: string) => {
    setActiveSection('flat');
    setSelectedFlatNumber(flatNumber);
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
        return <FlatInfo siteData={currentSiteData} flatNumber={selectedFlatNumber} />;
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
      {/* Top Bar */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left side - Logo + Title */}
          <div className="flex items-center space-x-3">
            <img
              src="/images/builder_logo.png"
              alt="DR City Logo"
              className="w-10 h-10 object-contain"
            />
            <div className="text-left">
              <h1 className="text-lg font-semibold text-white">DR City</h1>
            </div>
          </div>

          {/* Right side - Contact + Burger */}
          <div className="flex items-center space-x-3">
            <ContactButtons phoneNumber={CONTACT_PHONE} whatsappNumber={CONTACT_WHATSAPP} />
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 text-gray-700 lg:hidden rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
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

        {/* Main Content */}
        <main
          className={`
            flex-1 transition-all duration-300 ease-in-out
            ${isCollapsed ? 'lg:mr-16' : 'lg:mr-64'}
          `}
        >
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
