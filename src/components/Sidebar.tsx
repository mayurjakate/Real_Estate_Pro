import React, { useState, useEffect } from 'react';
import {
  Building, Home, Grid3x3, Images, Sparkles, Mail, Users,
  ChevronLeft, ChevronRight, Facebook, Twitter, Instagram, Linkedin,
  ChevronDown
} from 'lucide-react';
import SiteSelector from './SiteSelector';
import { motion, AnimatePresence } from 'framer-motion';

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
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  // Common sidebar content to be used in both desktop and mobile views
  const renderSidebarContent = (isMobile = false) => (
    <>
      {/* Site Selector - only visible when not collapsed or on mobile */}
      {(!isCollapsed || isMobile) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-shrink-0 py-6 px-4"
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

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 px-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <motion.li
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
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
                      className={`ml-3 font-medium text-left`}
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

      {/* Social Media Icons */}
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
      {/* Desktop Sidebar - Always visible on desktop */}
      <motion.div
        className={`
          hidden lg:flex fixed top-16 right-0 bottom-0
          bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900
          text-white z-30 flex-col transition-all duration-300
          ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
        `}
      >
        {renderSidebarContent()}

        {/* Collapse Button - Fixed to the middle on desktop */}
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full z-50 bg-indigo-900 text-white shadow-lg hover:bg-indigo-800 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </motion.button>
      </motion.div>

      {/* Mobile Sidebar - Animated drawer for mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed top-16 right-0 bottom-0 z-40 w-64 bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900 text-white flex flex-col lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {renderSidebarContent(true)}
            </motion.div>

            {/* Mobile Overlay */}
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