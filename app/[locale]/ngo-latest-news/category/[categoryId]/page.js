import { getStrapiURL } from '@/utils/get-strapi-url';
import { normalizeLocaleForStrapi } from '@/utils/locale-normalizer';
import NewsCard from '@/components/news/NewsCard';
import Link from 'next/link';
import PageContainer from '@/components/blocks/PageContainer';
import PageSection from '@/components/blocks/PageSection';

async function getCategoryData(categoryId, page = 1, sortBy = 'Publish:desc', locale = 'en') {
  try {
    // Normalize locale for Strapi API
    const normalizedLocale = normalizeLocaleForStrapi(locale);
    
    const response = await fetch(
      `${getStrapiURL()}/api/informations?pLevel=3&pagination[page]=${page}&pagination[pageSize]=10&sort=${sortBy}&filters[information_category][documentId][$eq]=${categoryId}&locale=${normalizedLocale}`,
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

async function getCategoryInfo(categoryId, locale = 'en') {
  try {
    // Normalize locale for Strapi API
    const normalizedLocale = normalizeLocaleForStrapi(locale);
    
    const response = await fetch(
      `${getStrapiURL()}/api/information-categories?filters[documentId][$eq]=${categoryId}&locale=${normalizedLocale}`,
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

  const { data: newsData, pagination } = await getCategoryData(categoryId, page, sortBy, locale);
  const categoryInfo = await getCategoryInfo(categoryId, locale);

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
    <PageContainer className={'!mt-20'}>
      <PageSection>
        {/* Category Header */}                
        <h1 className="text-[42px]/[1.35] font-medium border-b-1 border-b-[#aaa] mb-12 pb-10">
          <span className="font-normal !text-[20px] block">Category</span>
          {categoryInfo.name}
        </h1>          
        

      {/* News List Section */}      
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
