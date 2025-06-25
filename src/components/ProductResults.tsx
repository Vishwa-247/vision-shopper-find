
import { Star, ExternalLink, TrendingDown, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  site: string;
  image: string;
  url: string;
  rating: number;
}

interface ProductResultsProps {
  results: Product[];
  detectedProduct: string;
  dominantColor: string;
}

export const ProductResults = ({ results, detectedProduct, dominantColor }: ProductResultsProps) => {
  const bestDeal = results.reduce((min, product) => 
    product.price < min.price ? product : min
  );

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-2">
            Best Deals for {dominantColor} {detectedProduct}
          </h3>
          <p className="text-gray-600">
            Found {results.length} products • Sorted by price (lowest first)
          </p>
        </div>

        {/* Best Deal Highlight */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-8">
          <div className="flex items-center mb-4">
            <Award className="w-6 h-6 text-green-600 mr-2" />
            <span className="text-lg font-bold text-green-700">🎉 Best Deal Found!</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <img 
              src={bestDeal.image} 
              alt={bestDeal.title}
              className="w-full h-32 object-cover rounded-lg"
            />
            
            <div className="md:col-span-2">
              <h4 className="text-xl font-bold text-gray-800 mb-2">{bestDeal.title}</h4>
              <div className="flex items-center space-x-4 mb-3">
                <span className="text-2xl font-bold text-green-600">${bestDeal.price}</span>
                <span className="text-lg text-gray-500 line-through">${bestDeal.originalPrice}</span>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm font-semibold">
                  {calculateDiscount(bestDeal.originalPrice, bestDeal.price)}% OFF
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">from</span>
                  <span className="font-semibold text-purple-600">{bestDeal.site}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">{bestDeal.rating}</span>
                  </div>
                </div>
                
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Deal
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* All Results */}
        <div className="space-y-6">
          <h4 className="text-xl font-bold text-gray-800 flex items-center">
            <TrendingDown className="w-5 h-5 mr-2 text-purple-600" />
            All Results
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((product) => (
              <div 
                key={product.id}
                className={`bg-white border-2 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  product.id === bestDeal.id ? 'border-green-400 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="relative mb-4">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  {product.id === bestDeal.id && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      BEST DEAL
                    </div>
                  )}
                </div>
                
                <h5 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {product.title}
                </h5>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xl font-bold text-purple-600">${product.price}</span>
                  <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                  <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-xs font-semibold">
                    {calculateDiscount(product.originalPrice, product.price)}% OFF
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">{product.site}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full hover:bg-purple-50 hover:border-purple-300"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Product
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
