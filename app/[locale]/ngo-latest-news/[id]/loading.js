export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Article Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Article Header Skeleton */}
          <div className="p-8 border-b">
            <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded mb-6 animate-pulse"></div>
          </div>

          {/* Featured Image Skeleton */}
          <div className="h-64 md:h-96 bg-gray-200 animate-pulse"></div>

          {/* Article Content Skeleton */}
          <div className="p-8">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
            </div>
          </div>

          {/* Article Footer Skeleton */}
          <div className="p-8 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
