
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
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Select E-commerce Sites</h3>
            <p className="text-gray-600">Choose which platforms to search for the best deals</p>
          </div>
          
          <div className="flex space-x-3">
            <Button onClick={selectAll} variant="outline" size="sm">
              Select All
            </Button>
            <Button onClick={clearAll} variant="outline" size="sm">
              Clear All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {ecommerceSites.map((site) => (
            <div
              key={site.name}
              onClick={() => handleSiteToggle(site.name)}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedSites.includes(site.name)
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${site.color} flex items-center justify-center text-2xl mb-3`}>
                  {site.logo}
                </div>
                <h4 className="font-semibold text-gray-800">{site.name}</h4>
              </div>
              
              {selectedSites.includes(site.name) && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="mb-4">
            <span className="text-sm text-gray-500">
              {selectedSites.length} of {ecommerceSites.length} sites selected
            </span>
          </div>
          
          <Button
            onClick={onSearch}
            disabled={!canSearch}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              canSearch
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Search className="w-5 h-5 mr-2" />
            Find Best Deals
          </Button>
        </div>
      </div>
    </div>
  );
};
