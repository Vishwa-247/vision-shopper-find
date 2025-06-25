
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MainContent } from '@/components/MainContent';
import { productSearchService } from '@/services/productSearchService';
import { braveSearchService } from '@/services/braveSearchService';

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
    
    try {
      // Simulate initial ML analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would call the ML service immediately
      const products = ['Sneaker', 'T-Shirt', 'Smartphone', 'Headphones', 'Watch', 'Laptop', 'Bag'];
      const colors = ['Red', 'Blue', 'Black', 'White', 'Gray', 'Green', 'Pink'];
      
      setDetectedProduct(products[Math.floor(Math.random() * products.length)]);
      setDominantColor(colors[Math.floor(Math.random() * colors.length)]);
    } catch (error) {
      console.error('Image analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSearch = async () => {
    if (!selectedSites.length || !uploadedImage) return;
    
    setIsAnalyzing(true);
    
    try {
      // Use the integrated product search service
      const { results, mlAnalysis } = await productSearchService.searchProducts(
        uploadedImage,
        selectedSites
      );
      
      // Update state with results
      setSearchResults(results);
      setDetectedProduct(mlAnalysis.productCategory);
      setDominantColor(mlAnalysis.dominantColor);
      
      console.log('Search completed:', { results, mlAnalysis });
    } catch (error) {
      console.error('Product search failed:', error);
      
      // Fallback to mock data
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
        }
      ];
      setSearchResults(mockResults);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <Sidebar
        uploadedImage={uploadedImage}
        selectedSites={selectedSites}
        setSelectedSites={setSelectedSites}
        isAnalyzing={isAnalyzing}
        detectedProduct={detectedProduct}
        dominantColor={dominantColor}
        onImageUpload={handleImageUpload}
        onSearch={handleSearch}
      />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <MainContent
          searchResults={searchResults}
          isAnalyzing={isAnalyzing}
          detectedProduct={detectedProduct}
          dominantColor={dominantColor}
        />
      </div>
    </div>
  );
};

export default Index;
