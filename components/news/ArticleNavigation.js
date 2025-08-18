import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import StrapiImage from '@/components/StrapiImage';

export default function ArticleNavigation({ previous, next, locale }) {
  return (
    <div className="mt-12">
      <div className="flex">
        {/* Previous Article */}
        <div className={`${previous ? 'flex-1' : 'hidden'}`}>
          {previous && (
            <Link
              href={`/${locale}/ngo-latest-news/${previous.documentId}`}
              className="group min-h-[300px] flex relative"
            > 
              {/* Previous Article Image */}
              {previous.image && previous.image.length > 0 && (
                <div className="absolute w-full h-full overflow-hidden">
                  <StrapiImage
                    image={previous.image[0]}
                    className="w-full h-full object-cover transition duration-300 ease-in-out group-hover:transform-[scale(1.1)]"
                    width={previous.image[0].width}
                    height={previous.image[0].height}
                    alt={previous.Title || 'Previous article image'}
                  />
                </div>
              )}
              
              
              <div className="text-center flex justify-center items-center flex-1 min-w-0 p-10 bg-[rgba(13,13,13,.35)] relative z-1 transition duration-300 ease-in-out group-hover:bg-[rgba(13,13,13,.9)]">
                <h3 className="text-[22px]/[1.2] font-semibold text-white line-clamp-2 inline-block mb-0 px-8 relative">                  
                  <span className={`block ${next ? 'text-right' : ''} !text-base mb-2.5`}>上一篇</span>
                  {previous.Title}
                  <ChevronLeftIcon className="w-5 h-5 text-white absolute left-0 bottom-0.5" />
                </h3>
                {/* {previous.Publish && (
                  <div className="text-sm text-white mt-1">
                    {previous.Publish}
                  </div>
                )} */}
              </div>
            </Link>
          )}
        </div>

        {/* Next Article */}
        <div className={`${next ? 'flex-1' : 'hidden'}`}>
          {next && (
            <Link
              href={`/${locale}/ngo-latest-news/${next.documentId}`}
              className="group min-h-[300px] flex relative"
            >
              {/* Next Article Image */}
              {next.image && next.image.length > 0 && (
                <div className="absolute w-full h-full overflow-hidden">
                  <StrapiImage
                    image={next.image[0]}
                    className="w-full h-full object-cover transition duration-300 ease-in-out group-hover:transform-[scale(1.1)]"
                    width={next.image[0].width}
                    height={next.image[0].height}
                    alt={next.Title || 'Next article image'}
                  />
                </div>
              )}

              <div className="text-center flex justify-center items-center flex-1 min-w-0 p-10 bg-[rgba(13,13,13,.35)] relative z-1 transition duration-300 ease-in-out group-hover:bg-[rgba(13,13,13,.9)]">                
                <h3 className="text-[22px]/[1.2] font-semibold text-white line-clamp-2 inline-block mb-0 px-8 relative">
                  <span className={`block ${previous ? 'text-left' : ''} !text-base mb-2.5`}>下一篇</span>
                  {next.Title}
                  <ChevronRightIcon className="w-5 h-5 text-white absolute right-0 bottom-0.5" />
                </h3>
                {/* {next.Publish && (
                  <div className="text-sm text-white mt-1">
                    {next.Publish}
                  </div>
                )} */}                
              </div>              
              
              
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
