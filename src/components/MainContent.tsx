
import { ProductResults } from '@/components/ProductResults';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';

interface MainContentProps {
  searchResults: any;
  isAnalyzing: boolean;
  isSearching: boolean;
  detectedProduct: string;
  dominantColor: string;
}

export const MainContent = ({ 
  searchResults, 
  isAnalyzing, 
  isSearching, 
  detectedProduct, 
  dominantColor 
}: MainContentProps) => {
  if (isAnalyzing || isSearching) {
    return <LoadingState />;
  }

  if (searchResults && searchResults.length > 0) {
    return (
      <ProductResults 
        results={searchResults}
        detectedProduct={detectedProduct}
        dominantColor={dominantColor}
      />
    );
  }

  return <EmptyState />;
};
