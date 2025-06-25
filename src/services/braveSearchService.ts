
export interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
  price?: string;
  site: string;
}

class BraveSearchService {
  private backendUrl = 'http://localhost:8000';

  async searchProducts(query: string, color?: string): Promise<BraveSearchResult[]> {
    try {
      const searchQuery = `${color ? color + ' ' : ''}${query}`;
      
      const response = await fetch(
        `${this.backendUrl}/search-products?query=${encodeURIComponent(searchQuery)}&color=${encodeURIComponent(color || '')}&sites=Amazon,Flipkart,Myntra,Nike,Puma`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Backend search error: ${response.status}`);
      }

      const results = await response.json();
      console.log('Real Brave search results:', results);
      
      // Convert backend results to BraveSearchResult format
      return results.map((result: any) => ({
        title: result.title,
        url: result.url,
        description: `${result.title} - ${result.site}`,
        price: `$${result.price}`,
        site: result.site
      }));
    } catch (error) {
      console.error('Real Brave search failed, using fallback:', error);
      return this.getMockResults(query, color);
    }
  }

  private getMockResults(query: string, color?: string): BraveSearchResult[] {
    const sites = ['Amazon', 'Flipkart', 'Myntra', 'Nike', 'Puma'];
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
