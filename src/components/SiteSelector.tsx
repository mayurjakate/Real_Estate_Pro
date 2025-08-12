import React, { useState } from 'react';
import { ChevronDown, Search, Building } from 'lucide-react';

interface SiteSelectorProps {
  sites: string[];
  selectedSite: string;
  onSiteChange: (site: string) => void;
}

const SiteSelector: React.FC<SiteSelectorProps> = ({ 
  sites, 
  selectedSite, 
  onSiteChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSites = sites.filter(site =>
    site.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSiteSelect = (site: string) => {
    onSiteChange(site);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 
                   hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 
                   rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
      >
        <Building size={18} />
        <span className="font-medium">{selectedSite}</span>
        <ChevronDown 
          size={16} 
          className={`transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl 
                         border border-gray-200 z-20 overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search sites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg 
                           focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                           outline-none"
                />
              </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {filteredSites.length > 0 ? (
                filteredSites.map((site) => (
                  <button
                    key={site}
                    onClick={() => handleSiteSelect(site)}
                    className={`w-full text-left px-4 py-3 hover:bg-indigo-50 
                              transition-colors flex items-center space-x-3
                              ${selectedSite === site 
                                ? 'bg-indigo-100 text-indigo-700 font-medium' 
                                : 'text-gray-700'
                              }`}
                  >
                    <Building size={16} />
                    <div>
                      <div className="font-medium">{site}</div>
                      <div className="text-xs text-gray-500">
                        {site.includes('Mall') ? 'Commercial Space' : 'Residential Project'}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-gray-500">
                  No sites found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SiteSelector;