export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-12 bg-white/20 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-8 bg-white/20 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* News List Skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Sort Controls Skeleton */}
        <div className="mb-8 flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>

        <div className="space-y-6">
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
        <div className="mt-12 flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
