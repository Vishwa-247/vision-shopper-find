
import { useState } from 'react';
import { Header } from '@/components/Header';
import { ImageUpload } from '@/components/ImageUpload';
import { SiteSelector } from '@/components/SiteSelector';
import { ProductResults } from '@/components/ProductResults';
import { LoadingState } from '@/components/LoadingState';
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
      console.log('Starting real ML analysis...');
      const analysisResult = await mlService.analyzeImage(imageData);
      console.log('Real ML Analysis result:', analysisResult);
      
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
      console.log('Starting real product search...');
      const results = await productSearchService.searchProducts(
        detectedProduct,
        dominantColor,
        selectedSites
      );
      console.log('Real search results:', results);
      
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8 h-[calc(100vh-120px)]">
          {/* Left Panel - Large Controls */}
          <div className="w-96 space-y-6">
            {/* Image Upload - Large */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Upload Product Image</h3>
              <ImageUpload 
                onImageUpload={handleImageUpload}
                isAnalyzing={isAnalyzing}
                detectedProduct={detectedProduct}
                dominantColor={dominantColor}
              />
            </div>

            {/* Site Selection - Large */}
            {uploadedImage && !isAnalyzing && detectedProduct && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Select Platforms</h3>
                <SiteSelector
                  selectedSites={selectedSites}
                  onSiteChange={setSelectedSites}
                  onSearch={handleSearch}
                  canSearch={selectedSites.length > 0 && !isSearching}
                />
              </div>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="flex-1">
            {(isAnalyzing || isSearching) && <LoadingState />}
            
            {searchResults && searchResults.length > 0 && (
              <ProductResults 
                results={searchResults}
                detectedProduct={detectedProduct}
                dominantColor={dominantColor}
              />
            )}
            
            {!isAnalyzing && !isSearching && !searchResults && (
              <div className="bg-white rounded-2xl shadow-lg p-12 h-full flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-6">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Welcome to VisionShopper</h3>
                  <p className="text-gray-600 text-lg">Upload a product image to start finding the best deals across multiple platforms.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
