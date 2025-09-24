import PageContainer from "@/components/blocks/PageContainer";
import PageSection from "@/components/blocks/PageSection";
import { getTranslation } from '@/utils/translations';

export default async function AccessibilityPage({ params }) {
  // Fix Next.js 15 params async requirement
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  
  // 使用統一翻譯系統
  const title = getTranslation(locale, 'pages.accessibility', 'title');
  const description1 = getTranslation(locale, 'pages.accessibility', 'description1');
  const description2 = getTranslation(locale, 'pages.accessibility', 'description2');
  
  return (
    <PageContainer>
      <PageSection className={'text-center'}>
        {/* 標題 */}
        <div className="text-center mb-12">
          <h1 className='text-[42px] font-medium max-lg:text-5xl max-md:text-4xl'>
            {title}
          </h1>
        </div>      
        {/* 內容區域 */}
        <div className="text-center space-y-6">
          <p className="text-lg text-gray-700 leading-relaxed">
            {description1}
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            {description2}
          </p>
        </div>        
      </PageSection>
    </PageContainer>    
  );
}
