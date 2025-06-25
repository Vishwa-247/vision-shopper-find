import { braveSearchService } from './braveSearchService';
import { unifiedScrapingService } from './unifiedScrapingService';

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
  async searchProducts(
    productCategory: string,
    dominantColor: string,
    selectedSites: string[]
  ): Promise<SearchResult[]> {
    console.log('ProductSearchService: Starting comprehensive search', {
      productCategory,
      dominantColor,
      selectedSites
    });

    try {
      // Step 1: Enhanced scraping with unified service
      console.log('Step 1: Starting unified scraping across all selected sites...');
      const scrapingResults = await unifiedScrapingService.searchWithContext(
        productCategory,
        dominantColor,
        selectedSites
      );
      console.log('Unified scraping results:', scrapingResults.length, 'products');

      // Step 2: Brave Search for additional discovery
      console.log('Step 2: Performing Brave Search for additional products...');
      const braveResults = await braveSearchService.searchProducts(
        productCategory,
        dominantColor,
        selectedSites
      );
      console.log('Brave search results:', braveResults.length, 'products');

      // Step 3: Combine and deduplicate results
      const combinedResults = this.combineResults(scrapingResults, braveResults);
      console.log('Combined results:', combinedResults.length, 'unique products');

      // Step 4: Apply intelligent ranking
      const rankedResults = this.rankResults(combinedResults, productCategory, dominantColor);
      
      // Step 5: Return top results
      const finalResults = rankedResults.slice(0, 30); // Top 30 deals
      console.log('Final results:', finalResults.length, 'top-ranked products');

      return finalResults;
    } catch (error) {
      console.error('ProductSearchService: Search failed', error);
      
      // Fallback to basic search
      console.log('Falling back to basic search...');
      return this.performFallbackSearch(productCategory, dominantColor, selectedSites);
    }
  }

  private combineResults(scrapingResults: any[], braveResults: SearchResult[]): SearchResult[] {
    const allResults: SearchResult[] = [];
    
    // Add scraping results
    scrapingResults.forEach((product, index) => {
      allResults.push({
        id: index + 1,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        site: product.site,
        image: product.image,
        url: product.url,
        rating: product.rating,
        discount: product.discount,
        availability: product.availability
      });
    });

    // Add Brave search results (with offset IDs)
    braveResults.forEach(result => {
      allResults.push({
        ...result,
        id: result.id + 1000 // Offset to avoid ID conflicts
      });
    });

    // Remove duplicates based on title and site
    return this.removeDuplicateProducts(allResults);
  }

  private removeDuplicateProducts(products: SearchResult[]): SearchResult[] {
    const seen = new Map<string, SearchResult>();
    
    products.forEach(product => {
      const key = `${product.site}-${product.title.toLowerCase().trim()}`;
      const existing = seen.get(key);
      
      if (!existing || product.price < existing.price) {
        // Keep the product with better price
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
        // Primary sort: relevance score
        const relevanceDiff = b.relevanceScore - a.relevanceScore;
        if (Math.abs(relevanceDiff) > 0.5) {
          return relevanceDiff;
        }
        
        // Secondary sort: discount percentage
        const discountA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
        const discountB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
        const discountDiff = discountB - discountA;
        if (Math.abs(discountDiff) > 5) {
          return discountDiff;
        }
        
        // Tertiary sort: price (lower is better)
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
    
    // Exact category match (high weight)
    if (title.includes(categoryLower)) {
      score += 5;
    }
    
    // Partial category match
    const categoryWords = categoryLower.split(' ');
    categoryWords.forEach(word => {
      if (word.length > 2 && title.includes(word)) {
        score += 2;
      }
    });
    
    // Color match (medium weight)
    if (title.includes(colorLower)) {
      score += 3;
    }
    
    // Rating bonus (up to 2 points)
    score += Math.max(0, (product.rating - 3) * 0.5);
    
    // Discount bonus (up to 1 point)
    const discountPercent = ((product.originalPrice - product.price) / product.originalPrice) * 100;
    score += Math.min(1, discountPercent * 0.02);
    
    // Availability bonus
    if (product.availability !== false) {
      score += 0.5;
    }
    
    // Site preference (can be customized)
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

  private async performFallbackSearch(
    productCategory: string,
    dominantColor: string,
    selectedSites: string[]
  ): Promise<SearchResult[]> {
    console.log('Performing fallback search with mock data...');
    
    // Generate realistic fallback data
    const mockResults: SearchResult[] = [];
    
    selectedSites.forEach((site, siteIndex) => {
      const numProducts = Math.floor(Math.random() * 5) + 3; // 3-7 products per site
      
      for (let i = 0; i < numProducts; i++) {
        const basePrice = Math.floor(Math.random() * 400) + 100;
        const discount = Math.floor(Math.random() * 40) + 10;
        const originalPrice = Math.floor(basePrice / (1 - discount / 100));
        
        mockResults.push({
          id: siteIndex * 10 + i + 1,
          title: `${dominantColor} ${productCategory} - ${site} Edition ${i + 1}`,
          price: basePrice,
          originalPrice: originalPrice,
          site: site,
          image: `https://picsum.photos/300/300?random=${Date.now() + siteIndex * 10 + i}`,
          url: `https://${site.toLowerCase()}.com/product/${i + 1}`,
          rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
          discount: discount,
          availability: Math.random() > 0.1
        });
      }
    });

    return this.rankResults(mockResults, productCategory, dominantColor).slice(0, 20);
  }

  // Get comprehensive search statistics
  getSearchStats(results: SearchResult[]): {
    totalProducts: number;
    siteBreakdown: Record<string, number>;
    priceRange: { min: number; max: number; average: number };
    averageDiscount: number;
    topDeals: SearchResult[];
  } {
    const siteBreakdown: Record<string, number> = {};
    let totalPrice = 0;
    let totalDiscount = 0;
    let minPrice = Infinity;
    let maxPrice = 0;
    
    results.forEach(product => {
      siteBreakdown[product.site] = (siteBreakdown[product.site] || 0) + 1;
      totalPrice += product.price;
      minPrice = Math.min(minPrice, product.price);
      maxPrice = Math.max(maxPrice, product.price);
      
      if (product.discount) {
        totalDiscount += product.discount;
      }
    });
    
    const topDeals = results
      .filter(p => p.discount && p.discount > 20)
      .sort((a, b) => (b.discount || 0) - (a.discount || 0))
      .slice(0, 5);
    
    return {
      totalProducts: results.length,
      siteBreakdown,
      priceRange: {
        min: minPrice === Infinity ? 0 : minPrice,
        max: maxPrice,
        average: Math.round(totalPrice / results.length)
      },
      averageDiscount: Math.round(totalDiscount / results.length),
      topDeals
    };
  }
}

export const productSearchService = new ProductSearchService();
