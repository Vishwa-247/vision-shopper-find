
import { ProductResults } from '@/components/ProductResults';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';

interface MainContentProps {
  searchResults: any;
  isAnalyzing: boolean;
  detectedProduct: string;
  dominantColor: string;
}

export const MainContent = ({ searchResults, isAnalyzing, detectedProduct, dominantColor }: MainContentProps) => {
  if (isAnalyzing) {
    return <LoadingState />;
  }

  if (searchResults) {
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
