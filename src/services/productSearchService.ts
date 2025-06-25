
import { mlService, MLAnalysisResult } from './mlService';
import { braveSearchService, BraveSearchResult } from './braveSearchService';
import { scrapingService, ScrapedProduct } from './scrapingService';

export interface ProductSearchResult {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  site: string;
  image: string;
  url: string;
  rating: number;
  confidence: number;
}

class ProductSearchService {
  async searchProducts(imageData: string, selectedSites: string[]): Promise<{
    results: ProductSearchResult[];
    mlAnalysis: MLAnalysisResult;
  }> {
    // Step 1: Analyze the image with ML
    const mlAnalysis = await mlService.analyzeImage(imageData);
    console.log('ML Analysis Result:', mlAnalysis);

    // Step 2: Search with Brave API
    const braveResults = await braveSearchService.searchProducts(
      mlAnalysis.productCategory,
      mlAnalysis.dominantColor
    );
    console.log('Brave Search Results:', braveResults);

    // Step 3: Scrape selected sites for detailed product info
    const scrapedProducts = await scrapingService.scrapeMultipleSites(
      `${mlAnalysis.dominantColor} ${mlAnalysis.productCategory}`,
      selectedSites
    );
    console.log('Scraped Products:', scrapedProducts);

    // Step 4: Combine and rank results
    const combinedResults = this.combineResults(braveResults, scrapedProducts, mlAnalysis);

    return {
      results: combinedResults,
      mlAnalysis
    };
  }

  private combineResults(
    braveResults: BraveSearchResult[],
    scrapedProducts: ScrapedProduct[],
    mlAnalysis: MLAnalysisResult
  ): ProductSearchResult[] {
    const results: ProductSearchResult[] = [];

    // Add scraped products (higher priority)
    scrapedProducts.forEach((product, index) => {
      results.push({
        id: index + 1,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        site: product.site,
        image: product.image,
        url: product.url,
        rating: product.rating,
        confidence: mlAnalysis.confidence
      });
    });

    // Add Brave search results if we need more products
    if (results.length < 10) {
      braveResults.forEach((result, index) => {
        if (results.length < 10) {
          const price = this.extractPriceFromString(result.price || '99.99');
          results.push({
            id: scrapedProducts.length + index + 1,
            title: result.title,
            price: price,
            originalPrice: price * 1.2, // Assume 20% discount
            site: result.site,
            image: '/placeholder.svg',
            url: result.url,
            rating: 4.0 + Math.random() * 0.8, // Random rating between 4.0-4.8
            confidence: mlAnalysis.confidence * 0.8 // Lower confidence for Brave results
          });
        }
      });
    }

    return this.rankByBestDeal(results);
  }

  private extractPriceFromString(priceStr: string): number {
    const match = priceStr.match(/[\d,]+\.?\d*/);
    return match ? parseFloat(match[0].replace(',', '')) : 99.99;
  }

  private rankByBestDeal(results: ProductSearchResult[]): ProductSearchResult[] {
    return results.sort((a, b) => {
      const aDiscount = ((a.originalPrice - a.price) / a.originalPrice) * 100;
      const bDiscount = ((b.originalPrice - b.price) / b.originalPrice) * 100;
      const aScore = aDiscount * 0.6 + a.rating * 0.3 + a.confidence * 0.1;
      const bScore = bDiscount * 0.6 + b.rating * 0.3 + b.confidence * 0.1;
      return bScore - aScore;
    });
  }
}

export const productSearchService = new ProductSearchService();
