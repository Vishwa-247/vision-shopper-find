
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
    <div className="w-full max-w-4xl mx-auto">
      <div className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${
        dragActive 
          ? 'border-purple-500 bg-purple-50' 
          : uploadedImage 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-300 bg-white'
      } ${uploadedImage ? 'p-4' : 'p-12'}`}
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
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">Upload Product Image</h3>
              <p className="text-gray-500 mb-6">Drag and drop your image here, or click to browse</p>
            </div>
            
            <Button 
              onClick={onButtonClick}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <Camera className="w-5 h-5 mr-2" />
              Choose Image
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative">
              <img 
                src={uploadedImage} 
                alt="Uploaded product" 
                className="w-full h-64 object-cover rounded-xl shadow-lg"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>Analyzing image...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {isAnalyzing ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Loader className="w-5 h-5 animate-spin text-purple-600" />
                    <span className="text-gray-600">Running AI analysis...</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-600">Detecting product category...</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 rounded-full bg-purple-600"></div>
                    <span className="text-gray-600">Extracting dominant colors...</span>
                  </div>
                </div>
              ) : detectedProduct ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-lg font-semibold text-gray-800">Analysis Complete!</span>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Detected Product:</span>
                        <div className="text-xl font-bold text-purple-600">{detectedProduct}</div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-500">Dominant Color:</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className={`w-6 h-6 rounded-full border-2 border-gray-300 ${
                            dominantColor.toLowerCase() === 'red' ? 'bg-red-500' :
                            dominantColor.toLowerCase() === 'blue' ? 'bg-blue-500' :
                            dominantColor.toLowerCase() === 'black' ? 'bg-black' :
                            dominantColor.toLowerCase() === 'white' ? 'bg-white' :
                            'bg-gray-500'
                          }`}></div>
                          <span className="font-semibold text-gray-700">{dominantColor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={onButtonClick}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Different Image
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
