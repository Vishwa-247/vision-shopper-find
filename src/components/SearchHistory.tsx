
import { useState } from 'react';
import { Clock, Trash2, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HistoryItem {
  id: number;
  product: string;
  color: string;
  timestamp: string;
  sites: string[];
  resultsCount: number;
}

export const SearchHistory = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 1,
      product: 'Sneaker',
      color: 'Red',
      timestamp: '2 hours ago',
      sites: ['Amazon', 'Nike', 'Puma'],
      resultsCount: 15
    },
    {
      id: 2,
      product: 'T-Shirt',
      color: 'Blue',
      timestamp: '1 day ago',
      sites: ['Flipkart', 'Myntra'],
      resultsCount: 8
    },
    {
      id: 3,
      product: 'Smartphone',
      color: 'Black',
      timestamp: '3 days ago',
      sites: ['Amazon', 'Flipkart', 'Meesho'],
      resultsCount: 23
    }
  ]);

  const deleteHistoryItem = (id: number) => {
    setHistory(history.filter(item => item.id !== id));
  };

  const clearAllHistory = () => {
    setHistory([]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div 
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Search History</h3>
          </div>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-6">
          {history.length === 0 ? (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No search history yet</p>
              <p className="text-sm text-gray-400">Your searches will appear here</p>
            </div>
          ) : (
            <>
              {/* Clear All Button */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-gray-500">{history.length} searches</span>
                <Button 
                  onClick={clearAllHistory}
                  variant="outline" 
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>

              {/* History Items */}
              <div className="space-y-4">
                {history.map((item) => (
                  <div 
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {item.color} {item.product}
                        </h4>
                        <p className="text-sm text-gray-500">{item.timestamp}</p>
                      </div>
                      
                      <button
                        onClick={() => deleteHistoryItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Searched on:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.sites.map((site) => (
                          <span 
                            key={site}
                            className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {site}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {item.resultsCount} results found
                      </span>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs hover:bg-purple-50 hover:border-purple-300"
                      >
                        <Search className="w-3 h-3 mr-1" />
                        Search Again
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
