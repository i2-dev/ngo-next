import { getStrapiURL } from '@/utils/get-strapi-url';
import NewsCard from '@/components/news/NewsCard';
import Link from 'next/link';
import PageContainer from '@/components/blocks/PageContainer';
import PageSection from '@/components/blocks/PageSection';

async function getNewsData(page = 1, sortBy = 'Publish:desc') {
  try {
    const response = await fetch(
      `${getStrapiURL()}/api/informations?pLevel=3&pagination[page]=${page}&pagination[pageSize]=10&sort=${sortBy}`,
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
    console.error('Error fetching news data:', error);
    return { data: [], pagination: {} };
  }
}

export default async function NGOLatestNewsPage({ params, searchParams }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  // Get page parameter from URL
  const page = parseInt(searchParams?.page) || 1;
  const sortBy = 'Publish:desc'; // Fixed sorting by latest publish date

  const { data: newsData, pagination } = await getNewsData(page, sortBy);

  return (
    <PageContainer className={'!mt-20'}>
      <PageSection>    

      {/* News List Section */}      
      {newsData.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">正在加載新聞內容...</div>
          <div className="text-gray-400 text-sm mt-2">請稍候，正在從伺服器獲取最新資訊</div>
        </div>
      ) : (
        <div className="space-y-15">
          {newsData.map((article) => (
            <NewsCard key={article.id} article={article} locale={locale} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pageCount > 1 && (
        <div className="mt-15 flex justify-center">
          <div className="flex items-center space-x-2">
            {/* Previous Page */}
            {pagination.page > 1 && (
              <Link
                href={`/${locale}/ngo-latest-news?page=${pagination.page - 1}`}
                className="px-3.5 py-2 text-sm font-bold hover:text-black"
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
                  href={`/${locale}/ngo-latest-news?page=${pageNum}`}
                  className={`px-3.5 py-2 text-sm rounded-md font-bold ${pageNum === pagination.page
                    ? 'bg-[#286e11] text-white'
                    : 'hover:text-black'
                    }`}
                >
                  {pageNum}
                </Link>
              );
            })}

            {/* Next Page */}
            {pagination.page < pagination.pageCount && (
              <Link
                href={`/${locale}/ngo-latest-news?page=${pagination.page + 1}`}
                className="px-3.5 py-2 text-sm font-bold hover:text-black"
              >
                下一頁
              </Link>
            )}
          </div>
        </div>
      )}
      
      </PageSection>    
    </PageContainer>
  );
}
