import { useState, useRef } from 'react';
import { Upload, Camera, Loader, CheckCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageUpload: (imageData: string) => void;
  isAnalyzing: boolean;
  detectedProduct: string;
  dominantColor: string;
}

export const ImageUpload = ({ onImageUpload, isAnalyzing, detectedProduct, dominantColor }: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      onImageUpload(result);
    };
    reader.readAsDataURL(file);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div className={`relative border-2 border-dashed rounded-lg transition-all duration-300 ${
        dragActive 
          ? 'border-purple-500 bg-purple-50' 
          : uploadedImage 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-300 bg-white'
      } ${uploadedImage ? 'p-2' : 'p-6'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {!uploadedImage ? (
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm text-gray-600 mb-3">Drop image here</p>
            <Button 
              onClick={onButtonClick}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Camera className="w-4 h-4 mr-2" />
              Choose Image
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <img 
                src={uploadedImage} 
                alt="Uploaded product" 
                className="w-full h-32 object-cover rounded-lg"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <Loader className="w-6 h-6 animate-spin text-white" />
                </div>
              )}
            </div>
            
            {!isAnalyzing && detectedProduct && (
              <div className="bg-white rounded-lg p-3 shadow-sm border">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-medium text-gray-700">Analysis Complete</span>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-500">Product:</span>
                    <div className="font-semibold text-purple-600">{detectedProduct}</div>
                  </div>
                  
                  <div>
                    <span className="text-gray-500">Color:</span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full border ${
                        dominantColor.toLowerCase() === 'red' ? 'bg-red-500' :
                        dominantColor.toLowerCase() === 'blue' ? 'bg-blue-500' :
                        dominantColor.toLowerCase() === 'black' ? 'bg-black' :
                        dominantColor.toLowerCase() === 'white' ? 'bg-white border-gray-300' :
                        dominantColor.toLowerCase() === 'green' ? 'bg-green-500' :
                        'bg-gray-500'
                      }`}></div>
                      <span className="font-semibold text-gray-700">{dominantColor}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={onButtonClick}
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Change Image
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
