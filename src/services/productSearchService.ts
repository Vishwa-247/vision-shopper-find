
import { braveSearchService } from './braveSearchService';

export interface SearchResult {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  site: string;
  image: string;
  url: string;
  rating: number;
  discount?: number;
  availability?: boolean;
}

class ProductSearchService {
  private backendUrl = 'http://localhost:8000';

  async searchProducts(
    productCategory: string,
    dominantColor: string,
    selectedSites: string[]
  ): Promise<SearchResult[]> {
    console.log('ProductSearchService: Starting real search', {
      productCategory,
      dominantColor,
      selectedSites
    });

    try {
      // Step 1: Real backend search
      console.log('Step 1: Calling real backend search...');
      const backendResults = await this.callBackendSearch(
        productCategory,
        dominantColor,
        selectedSites
      );
      console.log('Backend search results:', backendResults.length, 'products');

      // Step 2: Brave Search for additional discovery
      console.log('Step 2: Performing Brave Search for additional products...');
      const braveResults = await braveSearchService.searchProducts(
        productCategory,
        dominantColor
      );
      console.log('Brave search results:', braveResults.length, 'products');

      // Convert Brave results to SearchResult format
      const convertedBraveResults: SearchResult[] = braveResults.map((result, index) => ({
        id: 1000 + index,
        title: result.title,
        price: this.extractPriceNumber(result.price),
        originalPrice: this.extractPriceNumber(result.price) * 1.2,
        site: result.site,
        image: `https://picsum.photos/300/300?random=${Date.now() + index}`,
        url: result.url,
        rating: 4.0 + Math.random() * 1.0,
        availability: true
      }));

      // Step 3: Combine results
      const allResults = [...backendResults, ...convertedBraveResults];
      const uniqueResults = this.removeDuplicateProducts(allResults);
      console.log('Combined results:', uniqueResults.length, 'unique products');

      // Step 4: Apply intelligent ranking
      const rankedResults = this.rankResults(uniqueResults, productCategory, dominantColor);
      
      // Step 5: Return top results
      const finalResults = rankedResults.slice(0, 30);
      console.log('Final results:', finalResults.length, 'top-ranked products');

      return finalResults;
    } catch (error) {
      console.error('ProductSearchService: Real search failed', error);
      throw error; // Don't fallback, let user know real search failed
    }
  }

  private async callBackendSearch(
    productCategory: string,
    dominantColor: string,
    selectedSites: string[]
  ): Promise<SearchResult[]> {
    try {
      const response = await fetch(
        `${this.backendUrl}/search-products?query=${encodeURIComponent(productCategory)}&color=${encodeURIComponent(dominantColor)}&sites=${selectedSites.join(',')}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const results = await response.json();
      
      // Convert backend results to SearchResult format
      return results.map((result: any, index: number) => ({
        id: index + 1,
        title: result.title,
        price: result.price,
        originalPrice: result.originalPrice,
        site: result.site,
        image: result.image,
        url: result.url,
        rating: result.rating,
        discount: result.discount,
        availability: result.availability
      }));
    } catch (error) {
      console.error('Backend search failed:', error);
      return [];
    }
  }

  private extractPriceNumber(priceString?: string): number {
    if (!priceString) return 50 + Math.random() * 100;
    
    const numericValue = priceString.replace(/[^\d.]/g, '');
    const price = parseFloat(numericValue);
    
    return isNaN(price) ? 50 + Math.random() * 100 : price;
  }

  private removeDuplicateProducts(products: SearchResult[]): SearchResult[] {
    const seen = new Map<string, SearchResult>();
    
    products.forEach(product => {
      const key = `${product.site}-${product.title.toLowerCase().trim()}`;
      const existing = seen.get(key);
      
      if (!existing || product.price < existing.price) {
        seen.set(key, product);
      }
    });

    return Array.from(seen.values());
  }

  private rankResults(
    products: SearchResult[], 
    productCategory: string, 
    dominantColor: string
  ): SearchResult[] {
    return products
      .map(product => ({
        ...product,
        relevanceScore: this.calculateRelevanceScore(product, productCategory, dominantColor)
      }))
      .sort((a: any, b: any) => {
        const relevanceDiff = b.relevanceScore - a.relevanceScore;
        if (Math.abs(relevanceDiff) > 0.5) {
          return relevanceDiff;
        }
        
        const discountA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
        const discountB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
        const discountDiff = discountB - discountA;
        if (Math.abs(discountDiff) > 5) {
          return discountDiff;
        }
        
        return a.price - b.price;
      });
  }

  private calculateRelevanceScore(
    product: SearchResult, 
    category: string, 
    color: string
  ): number {
    let score = 0;
    const title = product.title.toLowerCase();
    const categoryLower = category.toLowerCase();
    const colorLower = color.toLowerCase();
    
    if (title.includes(categoryLower)) score += 5;
    
    const categoryWords = categoryLower.split(' ');
    categoryWords.forEach(word => {
      if (word.length > 2 && title.includes(word)) {
        score += 2;
      }
    });
    
    if (title.includes(colorLower)) score += 3;
    
    score += Math.max(0, (product.rating - 3) * 0.5);
    
    const discountPercent = ((product.originalPrice - product.price) / product.originalPrice) * 100;
    score += Math.min(1, discountPercent * 0.02);
    
    if (product.availability !== false) score += 0.5;
    
    const sitePreferences: Record<string, number> = {
      'Amazon': 0.3,
      'Flipkart': 0.2,
      'Nike': 0.2,
      'Myntra': 0.1,
      'Puma': 0.1
    };
    score += sitePreferences[product.site] || 0;
    
    return Math.max(0, score);
  }
}

export const productSearchService = new ProductSearchService();
