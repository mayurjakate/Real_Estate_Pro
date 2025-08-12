import React from 'react';
import {
  Building, Home, Grid3x3, Images, Sparkles, Mail, Users,
  ChevronLeft, ChevronRight, Facebook, Twitter, Instagram, Linkedin
} from 'lucide-react';
import SiteSelector from './SiteSelector';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  sites: string[];
  selectedSite: string;
  onSiteChange: (site: string) => void;
}

const navigationItems = [
  { id: 'building', label: 'Building Info', icon: Building },
  { id: 'flat', label: 'Flat Info', icon: Home },
  { id: 'units', label: 'Units', icon: Grid3x3 },
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'amenities', label: 'Amenities', icon: Sparkles },
  { id: 'enquiry', label: 'Enquiry', icon: Mail },
  { id: 'members', label: 'Project Member', icon: Users },
];

const socialMedia = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  activeSection,
  setActiveSection,
  sites,
  selectedSite,
  onSiteChange
}) => {
  return (
    <div
      className={`
        fixed right-0 top-0 h-full bg-gradient-to-b
        from-indigo-900 via-purple-900 to-indigo-900
        text-white z-50 flex flex-col
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-16'}
      `}
    >
      {/* Header and Toggle Button */}
      <div className="flex items-center justify-between p-4 relative">
        {isOpen && (
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            DR City
          </h2>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-indigo-800 transition-colors"
        >
          {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Site Selector */}
      {isOpen && (
        <div className="px-3 pb-4 border-b border-indigo-700">
          <SiteSelector
            sites={sites}
            selectedSite={selectedSite}
            onSiteChange={onSiteChange}
          />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto">
        <ul className="space-y-2 px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`
                    w-full flex items-center rounded-lg px-3 py-3 transition-all duration-200
                    ${isActive
                      ? 'bg-indigo-700 text-white shadow-lg'
                      : 'hover:bg-indigo-800 text-indigo-200 hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span
                    className={`ml-3 font-medium transition-opacity duration-200 ${
                      isOpen ? 'opacity-100' : 'opacity-0 hidden'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;