
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, ShoppingCart, CheckCircle } from 'lucide-react';

interface SiteSelectorProps {
  selectedSites: string[];
  onSiteChange: (sites: string[]) => void;
  onSearch: () => void;
  canSearch: boolean;
}

const ecommerceSites = [
  { name: 'Amazon', logo: '🛒', color: 'from-orange-400 to-orange-600' },
  { name: 'Flipkart', logo: '🏪', color: 'from-blue-400 to-blue-600' },
  { name: 'Meesho', logo: '🛍️', color: 'from-pink-400 to-pink-600' },
  { name: 'Nike', logo: '👟', color: 'from-gray-700 to-black' },
  { name: 'Puma', logo: '🐆', color: 'from-yellow-400 to-orange-500' },
  { name: 'Myntra', logo: '👕', color: 'from-purple-400 to-purple-600' },
  { name: 'Ajio', logo: '✨', color: 'from-indigo-400 to-indigo-600' },
  { name: 'Nykaa', logo: '💄', color: 'from-pink-500 to-rose-500' },
];

export const SiteSelector = ({ selectedSites, onSiteChange, onSearch, canSearch }: SiteSelectorProps) => {
  const handleSiteToggle = (siteName: string) => {
    if (selectedSites.includes(siteName)) {
      onSiteChange(selectedSites.filter(site => site !== siteName));
    } else {
      onSiteChange([...selectedSites, siteName]);
    }
  };

  const selectAll = () => {
    onSiteChange(ecommerceSites.map(site => site.name));
  };

  const clearAll = () => {
    onSiteChange([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <Button onClick={selectAll} variant="outline" size="sm" className="text-xs">
            All
          </Button>
          <Button onClick={clearAll} variant="outline" size="sm" className="text-xs">
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {ecommerceSites.map((site) => (
          <div
            key={site.name}
            onClick={() => handleSiteToggle(site.name)}
            className={`relative p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedSites.includes(site.name)
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-purple-300'
            }`}
          >
            <div className="text-center">
              <div className={`w-8 h-8 mx-auto rounded-full bg-gradient-to-r ${site.color} flex items-center justify-center text-lg mb-2`}>
                {site.logo}
              </div>
              <h4 className="text-xs font-medium text-gray-800">{site.name}</h4>
            </div>
            
            {selectedSites.includes(site.name) && (
              <div className="absolute top-1 right-1">
                <CheckCircle className="w-4 h-4 text-purple-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className="text-xs text-gray-500 mb-3">
          {selectedSites.length} of {ecommerceSites.length} selected
        </div>
        
        <Button
          onClick={onSearch}
          disabled={!canSearch}
          className={`w-full ${
            canSearch
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          size="sm"
        >
          <Search className="w-4 h-4 mr-2" />
          Find Deals
        </Button>
      </div>
    </div>
  );
};
