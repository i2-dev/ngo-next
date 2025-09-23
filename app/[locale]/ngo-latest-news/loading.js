import PageContainer from '@/components/blocks/PageContainer';
import PageSection from '@/components/blocks/PageSection';

export default function Loading() {
  return (
    <PageContainer className={'!mt-20'}>
      <PageSection>
        {/* News List Skeleton */}
        <div className="space-y-15">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Image Skeleton */}
                <div className="md:w-1/2 h-64 md:h-auto bg-gray-200 animate-pulse"></div>
                
                {/* Content Skeleton */}
                <div className="md:w-1/2 p-6 flex flex-col justify-between">
                  <div>
                    <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse w-2/3"></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-15 flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
      </PageSection>
    </PageContainer>
  );
}
