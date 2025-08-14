import { getDigitalSolutionsPageData } from "@/data/page-loaders";
import PageContainer from "@/components/blocks/PageContainer";
import DigitalSolutionHero from "@/components/digitalsolutions/DigitalSolutionHero";
import BlockRenderer from "@/components/digitalsolutions/BlockRenderer";
import { notFound } from 'next/navigation';

export default async function NGODigitalSolutions2Page({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  // 獲取數碼方案頁面數據
  const pageData = await getDigitalSolutionsPageData(locale);
  const { plans } = pageData.processedData || {};
  
  // 根據Order找到NGO數碼化解決方案 (Order: null 根據菜單，使用 order 1)
  const plan = plans?.find(plan => plan.order === 1);
  
  if (!plan) {
    notFound();
  }

  return (
    <PageContainer className="mt-12">
      <DigitalSolutionHero plan={plan} locale={locale} />
      
      {plan.blocks && plan.blocks.length > 0 && (
        <div className="py-16">
          <div className="xl:container xl:max-w-[1280px] xl:mx-auto px-5">
            <BlockRenderer blocks={plan.blocks} locale={locale} />
          </div>
        </div>
      )}

      <div className="py-8">
        <div className="xl:container xl:max-w-[1280px] xl:mx-auto px-5 text-center">
          <a 
            href={`/${locale}/digital-solutions`}
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m0 0h18" />
            </svg>
            返回數碼方案列表
          </a>
        </div>
      </div>

      <div className="py-16 bg-gray-50">
        <div className="xl:container xl:max-w-[1280px] xl:mx-auto px-5 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">對此方案感興趣？</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            我們的專業團隊隨時為您提供詳細諮詢，了解如何在您的機構實施此解決方案
          </p>
          <a 
            href={`/${locale}/contact-us`}
            className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            聯絡我們
          </a>
        </div>
      </div>
    </PageContainer>
  );
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  try {
    const pageData = await getDigitalSolutionsPageData(locale);
    const { plans } = pageData.processedData || {};
    const plan = plans?.find(plan => plan.order === 1);

    return {
      title: plan ? `${plan.title} - I2NGO` : 'NGO 數碼化解決方案 - I2NGO',
      description: plan?.content || 'NGO 數碼化解決方案',
    };
  } catch (error) {
    return {
      title: 'NGO 數碼化解決方案 - I2NGO',
      description: 'NGO 數碼化解決方案'
    };
  }
}
