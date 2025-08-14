import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function ArticleNavigation({ previous, next, locale }) {
  return (
    <div className="mt-12 border-t pt-8">
      <div className="flex justify-between items-start space-x-6">
        {/* Previous Article */}
        <div className={`${previous ? 'flex-1' : 'hidden'}`}>
          {previous && (
            <Link
              href={`/${locale}/ngo-latest-news/${previous.documentId}`}
              className="group flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all duration-200"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-400 group-hover:text-green-500 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-500 mb-1">上一篇</div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 line-clamp-2">
                  {previous.Title}
                </h3>
                {previous.Publish && (
                  <div className="text-sm text-gray-500 mt-1">
                    {previous.Publish}
                  </div>
                )}
              </div>
            </Link>
          )}
        </div>

        {/* Next Article */}
        <div className={`${next ? 'flex-1' : 'hidden'}`}>
          {next && (
            <Link
              href={`/${locale}/ngo-latest-news/${next.documentId}`}
              className="group flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all duration-200 text-right"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-500 mb-1">下一篇</div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 line-clamp-2">
                  {next.Title}
                </h3>
                {next.Publish && (
                  <div className="text-sm text-gray-500 mt-1">
                    {next.Publish}
                  </div>
                )}
              </div>
              <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-green-500 mt-1 flex-shrink-0" />
            </Link>
          )}
        </div>
      </div>

    </div>
  );
}
