
export interface ScrapedProduct {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  url: string;
  rating: number;
  site: string;
  availability: boolean;
  discount: number;
}

export interface SiteConfig {
  name: string;
  baseUrl: string;
  searchPath: string;
  selectors: {
    productContainer: string;
    title: string;
    price: string;
    originalPrice?: string;
    image: string;
    rating?: string;
    url: string;
  };
  headers?: Record<string, string>;
}

class UnifiedScrapingService {
  private siteConfigs: Record<string, SiteConfig> = {
    'Amazon': {
      name: 'Amazon',
      baseUrl: 'https://www.amazon.com',
      searchPath: '/s?k=',
      selectors: {
        productContainer: '[data-component-type="s-search-result"]',
        title: 'h2 a span',
        price: '.a-price-whole',
        originalPrice: '.a-price.a-text-price .a-offscreen',
        image: '.s-image',
        rating: '.a-icon-alt',
        url: 'h2 a'
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    },
    'Flipkart': {
      name: 'Flipkart',
      baseUrl: 'https://www.flipkart.com',
      searchPath: '/search?q=',
      selectors: {
        productContainer: '._1AtVbE',
        title: '._4rR01T',
        price: '._30jeq3',
        originalPrice: '._3I9_wc',
        image: '._396cs4',
        rating: '._3LWZlK',
        url: '._1fQZEK'
      }
    },
    'Meesho': {
      name: 'Meesho',
      baseUrl: 'https://www.meesho.com',
      searchPath: '/search?q=',
      selectors: {
        productContainer: '.ProductList__GridCol-sc-8lnc8o-0',
        title: '.NewProductCardstyled__StyledDesktopProductTitle-sc-6y2tys-5',
        price: '.NewProductCardstyled__StyledDesktopProductPrice-sc-6y2tys-6',
        image: '.NewProductCardstyled__StyledProductImage-sc-6y2tys-2',
        url: 'a'
      }
    },
    'Nike': {
      name: 'Nike',
      baseUrl: 'https://www.nike.com',
      searchPath: '/w?q=',
      selectors: {
        productContainer: '.product-card',
        title: '.product-card__title',
        price: '.product-price',
        image: '.product-card__hero-image img',
        url: '.product-card__link-overlay'
      }
    },
    'Puma': {
      name: 'Puma',
      baseUrl: 'https://in.puma.com',
      searchPath: '/search?q=',
      selectors: {
        productContainer: '.product-tile',
        title: '.product-tile-name',
        price: '.sales .value',
        originalPrice: '.strike-through .value',
        image: '.product-image img',
        url: '.product-tile-inner a'
      }
    },
    'Myntra': {
      name: 'Myntra',
      baseUrl: 'https://www.myntra.com',
      searchPath: '/search?q=',
      selectors: {
        productContainer: '.product-base',
        title: '.product-product',
        price: '.product-discountedPrice',
        originalPrice: '.product-strike',
        image: '.product-imageSliderContainer img',
        rating: '.product-ratingsContainer',
        url: 'a'
      }
    },
    'Ajio': {
      name: 'Ajio',
      baseUrl: 'https://www.ajio.com',
      searchPath: '/search/?text=',
      selectors: {
        productContainer: '.item',
        title: '.nameCls',
        price: '.price-new',
        originalPrice: '.price-old',
        image: '.imgHolder img',
        url: 'a'
      }
    },
    'Nykaa': {
      name: 'Nykaa',
      baseUrl: 'https://www.nykaa.com',
      searchPath: '/search/result/?q=',
      selectors: {
        productContainer: '.product-listing',
        title: '.product-title',
        price: '.post-card-content-price-offer',
        originalPrice: '.post-card-content-price-original',
        image: '.product-image img',
        rating: '.rating-score',
        url: 'a'
      }
    }
  };

  async scrapeAllSites(query: string, selectedSites: string[]): Promise<ScrapedProduct[]> {
    console.log(`Starting unified scraping for query: "${query}" across sites:`, selectedSites);
    
    const allResults: ScrapedProduct[] = [];
    
    // Process all sites in parallel for better performance
    const scrapePromises = selectedSites.map(async (siteName) => {
      try {
        const siteResults = await this.scrapeSite(siteName, query);
        return siteResults;
      } catch (error) {
        console.error(`Failed to scrape ${siteName}:`, error);
        return this.generateFallbackResults(siteName, query);
      }
    });

    const results = await Promise.all(scrapePromises);
    
    // Flatten and combine all results
    results.forEach(siteResults => {
      allResults.push(...siteResults);
    });

    // Sort by price (lowest first) and limit results
    return allResults
      .sort((a, b) => a.price - b.price)
      .slice(0, 50); // Limit to top 50 deals
  }

  private async scrapeSite(siteName: string, query: string): Promise<ScrapedProduct[]> {
    const config = this.siteConfigs[siteName];
    if (!config) {
      throw new Error(`No configuration found for site: ${siteName}`);
    }

    console.log(`Scraping ${siteName} for: ${query}`);
    
    // For now, return simulated data since real scraping requires a backend
    // In a real implementation, this would make HTTP requests to the sites
    return this.generateFallbackResults(siteName, query);
  }

  private generateFallbackResults(siteName: string, query: string): ScrapedProduct[] {
    const products: ScrapedProduct[] = [];
    const basePrice = Math.floor(Math.random() * 500) + 50;
    const numProducts = Math.floor(Math.random() * 8) + 3; // 3-10 products per site

    for (let i = 0; i < numProducts; i++) {
      const price = basePrice + (Math.random() * 200) - 100;
      const originalPrice = price + (Math.random() * 100) + 20;
      const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

      products.push({
        id: `${siteName}-${i}-${Date.now()}`,
        title: `${query} - ${siteName} Product ${i + 1}`,
        price: Math.round(price),
        originalPrice: Math.round(originalPrice),
        image: `https://picsum.photos/300/300?random=${Date.now() + i}`,
        url: `${this.siteConfigs[siteName]?.baseUrl || '#'}/product/${i}`,
        rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
        site: siteName,
        availability: Math.random() > 0.1, // 90% availability
        discount
      });
    }

    return products;
  }

  // Enhanced search with color and category awareness
  async searchWithContext(
    productCategory: string,
    color: string,
    selectedSites: string[]
  ): Promise<ScrapedProduct[]> {
    // Create more targeted search queries
    const searchQueries = [
      `${color} ${productCategory}`,
      `${productCategory} ${color}`,
      productCategory,
      `${color} ${productCategory} online`,
      `buy ${color} ${productCategory}`
    ];

    const allResults: ScrapedProduct[] = [];

    // Try multiple search strategies
    for (const query of searchQueries.slice(0, 2)) { // Use top 2 queries
      const results = await this.scrapeAllSites(query, selectedSites);
      allResults.push(...results);
    }

    // Remove duplicates and rank results
    const uniqueResults = this.removeDuplicates(allResults);
    return this.rankResults(uniqueResults, productCategory, color);
  }

  private removeDuplicates(products: ScrapedProduct[]): ScrapedProduct[] {
    const seen = new Set<string>();
    return products.filter(product => {
      const key = `${product.site}-${product.title.toLowerCase()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private rankResults(products: ScrapedProduct[], category: string, color: string): ScrapedProduct[] {
    return products
      .map(product => ({
        ...product,
        relevanceScore: this.calculateRelevanceScore(product, category, color)
      }))
      .sort((a, b) => {
        // Sort by relevance first, then by price
        const relevanceDiff = (b as any).relevanceScore - (a as any).relevanceScore;
        if (Math.abs(relevanceDiff) > 0.1) {
          return relevanceDiff;
        }
        return a.price - b.price;
      });
  }

  private calculateRelevanceScore(product: ScrapedProduct, category: string, color: string): number {
    let score = 0;
    const title = product.title.toLowerCase();
    
    // Category match
    if (title.includes(category.toLowerCase())) score += 3;
    
    // Color match
    if (title.includes(color.toLowerCase())) score += 2;
    
    // Availability
    if (product.availability) score += 1;
    
    // Rating bonus
    score += (product.rating - 3) * 0.5;
    
    // Discount bonus
    score += product.discount * 0.01;
    
    return Math.max(0, score);
  }

  // Get site-specific features and capabilities
  getSupportedSites(): string[] {
    return Object.keys(this.siteConfigs);
  }

  getSiteInfo(siteName: string): SiteConfig | null {
    return this.siteConfigs[siteName] || null;
  }

  // Add new site configuration dynamically
  addSiteConfig(siteName: string, config: SiteConfig): void {
    this.siteConfigs[siteName] = config;
    console.log(`Added configuration for new site: ${siteName}`);
  }
}

export const unifiedScrapingService = new UnifiedScrapingService();
