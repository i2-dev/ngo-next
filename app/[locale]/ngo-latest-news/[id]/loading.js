import PageContainer from '@/components/blocks/PageContainer';
import PageSection from '@/components/blocks/PageSection';
import { FadeUp } from '@/components/SimpleAnimatedElement';

export default function Loading() {
  return (
    <PageContainer className={'!mt-29'}>
      {/* Article Header Skeleton */}
      <FadeUp>
        <div className="flex items-center text-center w-full min-h-[250px] md:min-h-[320px] py-12.5 bg-[rgba(247,242,244,0.5)] backdrop-filter-[blur(10px)]">
          <div className="xl:container xl:max-w-[1040px] xl:mx-auto px-5">
            {/* Category Badge Skeleton */}
            <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
            
            {/* Title Skeleton */}
            <div className="h-10 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded mb-6 animate-pulse"></div>
            
            {/* Meta Information Skeleton */}
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </FadeUp>

      <PageSection className={'!pt-12.5'} delay={300}>
        {/* Author Summary Skeleton */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-7.5 animate-pulse"></div>

        {/* Article Content Skeleton */}
        <article className="overflow-hidden xl:max-w-[1040px] xl:mx-auto px-5">
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
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        </article>
      </PageSection>
    </PageContainer>
  );
}
