
import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { SiteSelector } from '@/components/SiteSelector';
import { ProductResults } from '@/components/ProductResults';
import { SearchHistory } from '@/components/SearchHistory';
import { Header } from '@/components/Header';

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedProduct, setDetectedProduct] = useState<string>('');
  const [dominantColor, setDominantColor] = useState<string>('');

  const handleImageUpload = async (imageData: string) => {
    setUploadedImage(imageData);
    setIsAnalyzing(true);
    
    // Simulate ML analysis
    setTimeout(() => {
      const products = ['Sneaker', 'T-Shirt', 'Smartphone', 'Headphones', 'Watch'];
      const colors = ['Red', 'Blue', 'Black', 'White', 'Gray'];
      setDetectedProduct(products[Math.floor(Math.random() * products.length)]);
      setDominantColor(colors[Math.floor(Math.random() * colors.length)]);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleSearch = () => {
    if (!selectedSites.length) return;
    
    setIsAnalyzing(true);
    
    // Simulate product search
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: `${dominantColor} ${detectedProduct} - Premium Quality`,
          price: 89.99,
          originalPrice: 129.99,
          site: 'Amazon',
          image: '/placeholder.svg',
          url: '#',
          rating: 4.5
        },
        {
          id: 2,
          title: `${detectedProduct} ${dominantColor} Edition`,
          price: 79.99,
          originalPrice: 99.99,
          site: 'Flipkart',
          image: '/placeholder.svg',
          url: '#',
          rating: 4.3
        },
        {
          id: 3,
          title: `Best ${dominantColor} ${detectedProduct}`,
          price: 69.99,
          originalPrice: 89.99,
          site: 'Meesho',
          image: '/placeholder.svg',
          url: '#',
          rating: 4.7
        }
      ];
      setSearchResults(mockResults);
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                VisionShopper
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Upload any product image and discover the best deals across multiple e-commerce platforms instantly
              </p>
            </div>

            {/* Image Upload */}
            <ImageUpload 
              onImageUpload={handleImageUpload}
              isAnalyzing={isAnalyzing}
              detectedProduct={detectedProduct}
              dominantColor={dominantColor}
            />

            {/* Site Selection */}
            {uploadedImage && !isAnalyzing && detectedProduct && (
              <SiteSelector
                selectedSites={selectedSites}
                onSiteChange={setSelectedSites}
                onSearch={handleSearch}
                canSearch={selectedSites.length > 0}
              />
            )}

            {/* Results */}
            {searchResults && (
              <ProductResults 
                results={searchResults}
                detectedProduct={detectedProduct}
                dominantColor={dominantColor}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SearchHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
