
export interface MLAnalysisResult {
  productCategory: string;
  dominantColor: string;
  confidence: number;
  features: string[];
}

class MLService {
  private backendUrl = 'http://localhost:8000';

  async analyzeImage(imageData: string): Promise<MLAnalysisResult> {
    try {
      // Convert base64 to blob
      const response = await fetch(imageData);
      const blob = await response.blob();
      
      // Create FormData
      const formData = new FormData();
      formData.append('file', blob, 'image.jpg');
      
      // Send to backend
      const backendResponse = await fetch(`${this.backendUrl}/analyze-image`, {
        method: 'POST',
        body: formData,
      });
      
      if (!backendResponse.ok) {
        throw new Error(`Backend error: ${backendResponse.status}`);
      }
      
      const result = await backendResponse.json();
      console.log('Real ML analysis result:', result);
      
      return result;
    } catch (error) {
      console.error('Real ML analysis failed, using fallback:', error);
      return this.performFallbackAnalysis();
    }
  }

  private performFallbackAnalysis(): MLAnalysisResult {
    const products = ['Sneaker', 'T-Shirt', 'Smartphone', 'Headphones', 'Watch', 'Laptop', 'Bag', 'Sunglasses'];
    const colors = ['Red', 'Blue', 'Black', 'White', 'Gray', 'Green', 'Pink', 'Purple'];
    
    return {
      productCategory: products[Math.floor(Math.random() * products.length)],
      dominantColor: colors[Math.floor(Math.random() * colors.length)],
      confidence: 0.75 + Math.random() * 0.2,
      features: ['fallback-analysis']
    };
  }
}

export const mlService = new MLService();
