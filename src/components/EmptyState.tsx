
import { Upload, Target, Zap } from 'lucide-react';

export const EmptyState = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to VisionShopper
          </h1>
          <p className="text-xl text-gray-600">
            Upload any product image and discover the best deals across multiple e-commerce platforms instantly
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6">
            <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Upload Image</h3>
            <p className="text-sm text-gray-600">Simply upload a photo of any product you want to find</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">AI Analysis</h3>
            <p className="text-sm text-gray-600">Our ML models identify the product and extract key features</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Best Deals</h3>
            <p className="text-sm text-gray-600">Get the best prices from top e-commerce platforms</p>
          </div>
        </div>
      </div>
    </div>
  );
};
