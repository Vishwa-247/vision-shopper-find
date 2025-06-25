
export interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
  price?: string;
  site: string;
}

class BraveSearchService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.search.brave.com/res/v1/web/search';

  setApiKey(key: string) {
    this.apiKey = key;
  }

  async searchProducts(query: string, color?: string): Promise<BraveSearchResult[]> {
    // Enhanced query with color and shopping intent
    const searchQuery = `${color ? color + ' ' : ''}${query} buy online price shopping`;
    
    if (!this.apiKey) {
      console.warn('Brave API key not set, using mock data');
      return this.getMockResults(query, color);
    }

    try {
      const response = await fetch(`${this.baseUrl}?q=${encodeURIComponent(searchQuery)}&count=20&search_lang=en&country=US&market=US&freshness=pw`, {
        headers: {
          'X-Subscription-Token': this.apiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Brave API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseSearchResults(data);
    } catch (error) {
      console.error('Brave Search failed:', error);
      return this.getMockResults(query, color);
    }
  }

  private parseSearchResults(data: any): BraveSearchResult[] {
    const results: BraveSearchResult[] = [];
    
    if (data.web?.results) {
      for (const result of data.web.results) {
        // Extract e-commerce sites
        const site = this.extractSiteName(result.url);
        if (this.isEcommerceSite(site)) {
          results.push({
            title: result.title,
            url: result.url,
            description: result.description,
            price: this.extractPrice(result.description),
            site
          });
        }
      }
    }

    return results;
  }

  private extractSiteName(url: string): string {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      if (domain.includes('amazon')) return 'Amazon';
      if (domain.includes('flipkart')) return 'Flipkart';
      if (domain.includes('meesho')) return 'Meesho';
      if (domain.includes('nike')) return 'Nike';
      if (domain.includes('puma')) return 'Puma';
      if (domain.includes('myntra')) return 'Myntra';
      if (domain.includes('ajio')) return 'Ajio';
      if (domain.includes('nykaa')) return 'Nykaa';
      return domain.replace('www.', '').split('.')[0];
    } catch {
      return 'Unknown';
    }
  }

  private isEcommerceSite(site: string): boolean {
    const ecommerceSites = ['amazon', 'flipkart', 'meesho', 'nike', 'puma', 'myntra', 'ajio', 'nykaa'];
    return ecommerceSites.some(s => site.toLowerCase().includes(s));
  }

  private extractPrice(text: string): string | undefined {
    const priceRegex = /[\$₹€£][\d,]+\.?\d*/g;
    const match = text.match(priceRegex);
    return match ? match[0] : undefined;
  }

  private getMockResults(query: string, color?: string): BraveSearchResult[] {
    const sites = ['Amazon', 'Flipkart', 'Meesho', 'Nike', 'Puma'];
    return sites.map((site, index) => ({
      title: `${color || ''} ${query} - Premium Quality from ${site}`,
      url: `https://${site.toLowerCase()}.com/product-${index}`,
      description: `Shop for ${color || ''} ${query} at ${site}. Best prices guaranteed.`,
      price: `$${(50 + Math.random() * 100).toFixed(2)}`,
      site
    }));
  }
}

export const braveSearchService = new BraveSearchService();
