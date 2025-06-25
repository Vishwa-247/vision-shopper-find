
import { Loader, Search, Zap, ShoppingBag } from 'lucide-react';

export const LoadingState = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-6">
            <Loader className="w-10 h-10 text-white animate-spin" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-800">Finding Best Deals</h3>
          <p className="text-gray-600">Our AI is analyzing your image and searching across multiple platforms...</p>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-center space-x-2 text-purple-600">
              <Search className="w-4 h-4" />
              <span>Analyzing product image...</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <Zap className="w-4 h-4" />
              <span>Searching with Brave API...</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <ShoppingBag className="w-4 h-4" />
              <span>Comparing prices across platforms...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
