import { getStrapiURL } from '@/utils/get-strapi-url';
import StrapiImage from '@/components/StrapiImage';
import CategoryBadge from '@/components/news/CategoryBadge';
import ArticleNavigation from '@/components/news/ArticleNavigation';
import { getAdjacentArticles } from '@/utils/get-adjacent-articles';
import { notFound } from 'next/navigation';

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
    <div className="min-h-screen bg-gray-50">
      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Article Header */}
          <div className="p-8 border-b">
            {/* Category Badge */}
            {article.information_category && (
              <CategoryBadge category={article.information_category} locale={locale} />
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.Title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              {article.Author && (
                <div className="flex items-center">
                  <span className="font-medium">作者：</span>
                  <span>{article.Author}</span>
                </div>
              )}
              {article.Publish && (
                <div className="flex items-center">
                  <span className="font-medium">發布日期：</span>
                  <span>{article.Publish}</span>
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          {article.image && article.image.length > 0 && (
            <div className="relative h-64 md:h-96 overflow-hidden">
              <StrapiImage
                image={article.image[0]}
                className="w-full h-full object-cover"
                width={800}
                height={400}
                alt={article.Title || 'Article image'}
              />
            </div>
          )}

          {/* Article Content */}
          <div className="p-8">
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
          </div>
        </article>
      </div>
      {/* Article Navigation */}
      <ArticleNavigation
        previous={previous}
        next={next}
        locale={locale}
      />
    </div>
  );
}
