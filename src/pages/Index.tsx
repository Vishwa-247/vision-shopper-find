
import { useState } from 'react';
import { Header } from '@/components/Header';
import { ImageUpload } from '@/components/ImageUpload';
import { SiteSelector } from '@/components/SiteSelector';
import { ProductResults } from '@/components/ProductResults';
import { SearchHistory } from '@/components/SearchHistory';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { mlService } from '@/services/mlService';
import { productSearchService } from '@/services/productSearchService';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedProduct, setDetectedProduct] = useState('');
  const [dominantColor, setDominantColor] = useState('');
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (imageData: string) => {
    setUploadedImage(imageData);
    setIsAnalyzing(true);
    setSearchResults(null);
    
    try {
      console.log('Starting ML analysis...');
      const analysisResult = await mlService.analyzeImage(imageData);
      console.log('ML Analysis result:', analysisResult);
      
      setDetectedProduct(analysisResult.productCategory);
      setDominantColor(analysisResult.dominantColor);
      
      toast({
        title: "Analysis Complete",
        description: `Detected: ${analysisResult.dominantColor} ${analysisResult.productCategory}`,
      });
    } catch (error) {
      console.error('ML analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Please try uploading the image again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSearch = async () => {
    if (!detectedProduct || !dominantColor || selectedSites.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please upload an image and select at least one platform.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    try {
      console.log('Starting product search...');
      const results = await productSearchService.searchProducts(
        detectedProduct,
        dominantColor,
        selectedSites
      );
      console.log('Search results:', results);
      
      setSearchResults(results);
      
      toast({
        title: "Search Complete",
        description: `Found ${results.length} products across ${selectedSites.length} platforms`,
      });
    } catch (error) {
      console.error('Product search failed:', error);
      toast({
        title: "Search Failed",
        description: "Please try searching again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const renderMainContent = () => {
    if (isAnalyzing || isSearching) {
      return <LoadingState />;
    }

    if (searchResults && searchResults.length > 0) {
      return (
        <ProductResults 
          results={searchResults}
          detectedProduct={detectedProduct}
          dominantColor={dominantColor}
        />
      );
    }

    return <EmptyState />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Image Upload */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Product Image</h3>
              <ImageUpload 
                onImageUpload={handleImageUpload}
                isAnalyzing={isAnalyzing}
                detectedProduct={detectedProduct}
                dominantColor={dominantColor}
              />
            </div>

            {/* Site Selection */}
            {uploadedImage && !isAnalyzing && detectedProduct && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Platforms</h3>
                <SiteSelector
                  selectedSites={selectedSites}
                  onSiteChange={setSelectedSites}
                  onSearch={handleSearch}
                  canSearch={selectedSites.length > 0 && !isSearching}
                />
              </div>
            )}

            {/* Search History */}
            <SearchHistory />
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-3">
            {renderMainContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
