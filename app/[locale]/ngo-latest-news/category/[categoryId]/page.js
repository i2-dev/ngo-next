import { getStrapiURL } from '@/utils/get-strapi-url';
import NewsCard from '@/components/news/NewsCard';
import Link from 'next/link';

async function getCategoryData(categoryId, page = 1, sortBy = 'Publish:desc') {
  try {
    const response = await fetch(
      `${getStrapiURL()}/api/informations?pLevel=3&pagination[page]=${page}&pagination[pageSize]=10&sort=${sortBy}&filters[information_category][documentId][$eq]=${categoryId}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data.data || [],
      pagination: data.meta?.pagination || {}
    };
  } catch (error) {
    console.error('Error fetching category data:', error);
    return { data: [], pagination: {} };
  }
}

async function getCategoryInfo(categoryId) {
  try {
    const response = await fetch(
      `${getStrapiURL()}/api/information-categories?filters[documentId][$eq]=${categoryId}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data?.[0] || null; // Return first matching category
  } catch (error) {
    console.error('Error fetching category info:', error);
    return null;
  }
}

export default async function CategoryNewsPage({ params, searchParams }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const categoryId = resolvedParams?.categoryId;

  // Get page parameter from URL
  const page = parseInt(searchParams?.page) || 1;
  const sortBy = 'Publish:desc'; // Fixed sorting by latest publish date

  const { data: newsData, pagination } = await getCategoryData(categoryId, page, sortBy);
  const categoryInfo = await getCategoryInfo(categoryId);

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">分類不存在</h1>
          <Link href={`/${locale}/ngo-latest-news`} className="text-blue-600 hover:text-blue-800">
            返回新聞列表
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      {/* Category Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Category</h1>
            <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
              {categoryInfo.name}
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* News List Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {newsData.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">此分類暫無文章</div>
            <div className="text-gray-400 text-sm mt-2">請稍後再來查看</div>
            <Link
              href={`/${locale}/ngo-latest-news`}
              className="inline-block mt-4 text-blue-600 hover:text-blue-800"
            >
              返回所有新聞
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {newsData.map((article) => (
              <NewsCard key={article.id} article={article} locale={locale} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pageCount > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-2">
              {/* Previous Page */}
              {pagination.page > 1 && (
                <Link
                  href={`/${locale}/ngo-latest-news/category/${categoryId}?page=${pagination.page - 1}`}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  上一頁
                </Link>
              )}

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, pagination.pageCount) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Link
                    key={pageNum}
                    href={`/${locale}/ngo-latest-news/category/${categoryId}?page=${pageNum}`}
                    className={`px-4 py-2 text-sm border rounded-md ${pageNum === pagination.page
                      ? 'bg-green-500 text-white border-green-500'
                      : 'text-gray-600 hover:text-gray-900 border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}

              {/* Next Page */}
              {pagination.page < pagination.pageCount && (
                <Link
                  href={`/${locale}/ngo-latest-news/category/${categoryId}?page=${pagination.page + 1}`}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  下一頁
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
