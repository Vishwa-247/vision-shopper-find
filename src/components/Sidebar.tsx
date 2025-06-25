
import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { SiteSelector } from '@/components/SiteSelector';
import { SearchHistory } from '@/components/SearchHistory';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  uploadedImage: string | null;
  selectedSites: string[];
  setSelectedSites: (sites: string[]) => void;
  isAnalyzing: boolean;
  detectedProduct: string;
  dominantColor: string;
  onImageUpload: (imageData: string) => void;
  onSearch: () => void;
}

export const Sidebar = ({
  uploadedImage,
  selectedSites,
  setSelectedSites,
  isAnalyzing,
  detectedProduct,
  dominantColor,
  onImageUpload,
  onSearch
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-1/4'} min-w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative`}>
      {/* Collapse/Expand Button */}
      <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        variant="ghost"
        size="sm"
        className="absolute -right-3 top-4 z-50 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>

      {!isCollapsed && (
        <>
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">VisionShopper</h2>
                <p className="text-xs text-gray-500">AI Deal Finder</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Image Upload */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Upload Product Image</h3>
              <ImageUpload 
                onImageUpload={onImageUpload}
                isAnalyzing={isAnalyzing}
                detectedProduct={detectedProduct}
                dominantColor={dominantColor}
              />
            </div>

            {/* Site Selection */}
            {uploadedImage && !isAnalyzing && detectedProduct && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Platforms</h3>
                <SiteSelector
                  selectedSites={selectedSites}
                  onSiteChange={setSelectedSites}
                  onSearch={onSearch}
                  canSearch={selectedSites.length > 0}
                />
              </div>
            )}

            {/* Search History */}
            <div>
              <SearchHistory />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
