import StrapiImage from '@/components/StrapiImage';
import CategoryBadgeInline from '@/components/news/CategoryBadgeInline';
import Link from 'next/link';
import styles from "@/styles/News.module.css";

export default function NewsCard({ article, locale }) {
  return (
    <article className="group cursor-pointer">
      <Link href={`/${locale}/ngo-latest-news/${article.documentId}`}>
        <div className="flex flex-col md:flex-row">
          {/* Image Section - Left Side */}
          <div className="aspect-3/2 rounded-md overflow-hidden relative md:w-1/3">
            {article.image && article.image.length > 0 ? (
              <StrapiImage
                image={article.image[0]}
                className="w-full h-full object-cover transition-[all_.3s_cubic-bezier(.2,1,.2,1)] group-hover:transform-[scale(1.05)]"
                width={article.image[0].width}
                height={article.image[0].height}
                alt={article.Title || 'News image'}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="text-white text-4xl">📰</div>
              </div>
            )}
          </div>

          {/* Content Section - Right Side */}
          <div className="flex flex-col py-6 px-7.5 md:w-2/3">
            <div>
              {/* Category Badge */}
              {article.information_category && (
                <div className='group/category relative text-[#286e11] inline-block mb-2.5 text-sm font-bold'>
                  <CategoryBadgeInline category={article.information_category} locale={locale} />
                  <div className='bg-[#286e11] w-full h-0.5 absolute transition-[all_.3s_cubic-bezier(.2,1,.2,1)] origin-left transform-[scaleX(0)] group-hover/category:transform-[scaleX(1)]'></div>
                </div>
              )}
              <h2 className="text-[#454176] text-[22px]">
                {article.Title}
              </h2>
              {article.Author_Summary && (
                <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                  {article.Author_Summary.replace(/<[^>]*>/g, '').substring(0, 50)}...
                </p>
              )}
              {/* {article.Content && (
                <p className="text-gray-700 text-sm line-clamp-3">
                  {article.Content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                </p>
              )} */}
            </div>

            <div className="text-sm">
              {article.Publish}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
