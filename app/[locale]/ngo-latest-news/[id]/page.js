import { getStrapiURL } from '@/utils/get-strapi-url';
import StrapiImage from '@/components/StrapiImage';
import CategoryBadge from '@/components/news/CategoryBadge';
import ArticleNavigation from '@/components/news/ArticleNavigation';
import { getAdjacentArticles } from '@/utils/get-adjacent-articles';
import { notFound } from 'next/navigation';
import PageContainer from '@/components/blocks/PageContainer';
import PageSection from '@/components/blocks/PageSection';

async function getArticleData(documentId) {
  try {
    const response = await fetch(`${getStrapiURL()}/api/informations/${documentId}?pLevel=5`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching article data:', error);
    return null;
  }
}

export default async function NewsDetailPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const documentId = resolvedParams?.id;

  const article = await getArticleData(documentId);

  if (!article) {
    notFound();
  }

  // 获取相邻文章
  const { previous, next } = await getAdjacentArticles(documentId, locale);

  return (
    <PageContainer className={'!mt-29'}>      
      {/* Article Header */}
      <div className="flex items-center text-center w-full min-h-[250px] md:min-h-[350px] py-12.5 bg-[rgba(247,242,244,0.5)] backdrop-filter-[blur(10px)]">
        <div className="xl:container xl:max-w-[1040px] xl:mx-auto px-5">
          {/* Category Badge */}
          {article.information_category && (
            <CategoryBadge category={article.information_category} locale={locale} />
          )}

          {/* Title */}
          <h1 className="text-3xl text-[#272727] mb-5 md:text-[42px]">
            {article.Title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap justify-center text-sm">            
            {article.Publish && (
              <div className="flex items-center">
                <span className="font-medium">發布日期：</span>
                <span>{article.Publish}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <PageSection className={'!pt-12.5'}> 
        {article.Author_Summary && (            
            <h3 className="text-center text-[22px] xl:max-w-[1000px] xl:mx-auto mb-7.5">{article.Author_Summary}</h3>          
        )}

        {/* Article Content */}      
        <article className="overflow-hidden xl:max-w-[1040px] xl:mx-auto px-5">
          {/* Featured Image */}
          {/* {article.image && article.image.length > 0 && (
            <div className="relative h-64 md:h-96 overflow-hidden">
              <StrapiImage
                image={article.image[0]}
                className="w-full h-full object-cover"
                width={800}
                height={400}
                alt={article.Title || 'Article image'}
              />
            </div>
          )} */}

          {/* Article Content */}          
          {article.Content ? (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.Content }}
            />
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">內容正在準備中...</div>
              <div className="text-gray-400 text-sm mt-2">Content is being prepared...</div>
            </div>
          )}          
        </article>        
        
      </PageSection>
      {/* Article Navigation */}
      <ArticleNavigation
        previous={previous}
        next={next}
        locale={locale}
      />
    </PageContainer>
  );
}
