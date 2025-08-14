import StrapiImage from '@/components/StrapiImage';
import CategoryBadgeInline from '@/components/news/CategoryBadgeInline';
import Link from 'next/link';
import styles from "@/styles/News.module.css";

export default function NewsCard({ article, locale }) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/${locale}/ngo-latest-news/${article.documentId}`}>
        <div className="flex flex-col md:flex-row">
          {/* Image Section - Left Side */}
          <div className="md:w-1/2 relative h-64 md:h-auto">
            {article.image && article.image.length > 0 ? (
              <StrapiImage
                image={article.image[0]}
                className="w-full h-full object-cover"
                width={600}
                height={400}
                alt={article.Title || 'News image'}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="text-white text-4xl">📰</div>
              </div>
            )}
          </div>

          {/* Content Section - Right Side */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              {/* Category Badge */}
              {article.information_category && (
                <div className={styles.categoryBadge}>
                  <CategoryBadgeInline category={article.information_category} locale={locale} />
                </div>
              )}
              <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
                {article.Title}
              </h2>
              {article.Author_Summary && (
                <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                  {article.Author_Summary.replace(/<[^>]*>/g, '').substring(0, 50)}...
                </p>
              )}
              {article.Content && (
                <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                  {article.Content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{article.Publish}</span>
              <span className="text-blue-600 font-medium">閱讀更多 →</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
