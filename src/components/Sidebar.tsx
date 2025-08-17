import React, { useState, useEffect, useRef } from 'react';
import {
  Building, Home, Grid3x3, Images, Sparkles, Mail, Users,
  ChevronLeft, ChevronRight, Facebook, Twitter, Instagram, Linkedin,
  ChevronDown, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MockSiteSelectorProps {
  sites: string[];
  selectedSite: string;
  onSiteChange: (site: string) => void;
}

const SiteSelector: React.FC<MockSiteSelectorProps> = ({ sites, selectedSite, onSiteChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredSites = sites.filter(site =>
    site.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-indigo-700 text-white rounded-lg shadow-md
                   hover:bg-indigo-800 transition-colors text-base"
      >
        <span className="font-medium truncate">{selectedSite}</span>
        <ChevronDown
          size={16}
          className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-20"
          >
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search sites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm text-gray-800 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {filteredSites.length > 0 ? (
                filteredSites.map((siteOption) => (
                  <button
                    key={siteOption}
                    onClick={() => {
                      onSiteChange(siteOption);
                      setIsDropdownOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full text-left p-3 text-gray-800 hover:bg-indigo-50 transition-colors
                                ${selectedSite === siteOption ? 'bg-indigo-100 font-semibold' : ''}`}
                  >
                    {siteOption}
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500 text-sm">No matching sites.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  sites: string[];
  selectedSite: string;
  onSiteChange: (site: string) => void;
}

const navigationItems = [
  { id: 'building', label: 'Building Info', icon: Building },
  { id: 'flat', label: 'Unit Info', icon: Home },
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
  isMobileOpen,
  setIsMobileOpen,
  isCollapsed,
  setIsCollapsed,
  activeSection,
  setActiveSection,
  sites,
  selectedSite,
  onSiteChange
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    const header = document.querySelector('header');
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  const renderSidebarContent = (isMobile = false) => (
    <>
      {(!isCollapsed || isMobile) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-shrink-0 py-4 px-4"
        >
          <motion.div whileHover={{ scale: 1.01 }}>
            <SiteSelector
              sites={sites}
              selectedSite={selectedSite}
              onSiteChange={onSiteChange}
            />
          </motion.div>
          <hr className="my-4 border-indigo-700" />
        </motion.div>
      )}

      <nav className="flex-1 overflow-y-auto">
        <ul className={`space-y-2 px-2 ${isCollapsed && !isMobile ? 'pt-6 lg:pt-8' : ''}`}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <motion.li key={item.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`
                    w-full flex items-center rounded-lg px-3 py-3 transition-all duration-200
                    ${isActive
                      ? 'bg-indigo-700 text-white shadow-lg'
                      : 'hover:bg-indigo-800 text-indigo-200 hover:text-white'
                    }
                  `}
                  title={item.label}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {(!isCollapsed || isMobileOpen) && (
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-3 font-medium text-left"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </button>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {(!isCollapsed || isMobileOpen) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-shrink-0 border-t border-indigo-700 p-4"
        >
          <div className="flex justify-center space-x-4">
            {socialMedia.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={index}
                  whileHover={{ y: -2, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  href={link.href}
                  aria-label={link.label}
                  className="p-2 text-indigo-200 hover:text-white transition-colors"
                >
                  <Icon size={20} />
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop */}
      <motion.div
        style={{ top: headerHeight }}
        className={`
          hidden lg:flex fixed bottom-0
          bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900
          text-white z-30 flex-col transition-all duration-300
          ${isCollapsed ? 'lg:w-16 right-0' : 'lg:w-64 right-0'}
        `}
      >
        {renderSidebarContent()}
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute -left-4 top-1/2 -translate-y-1/2 p-2 rounded-full z-50 bg-indigo-900 text-white shadow-lg hover:bg-indigo-800 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </motion.button>
      </motion.div>

      {/* Mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              style={{ top: headerHeight }}
              className="fixed right-0 bottom-0 z-40 w-64 bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900 text-white flex flex-col lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {renderSidebarContent(true)}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-30 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;