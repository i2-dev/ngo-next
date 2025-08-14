import { getDigitalSolutionsPageData } from "@/data/page-loaders";
import PageContainer from "@/components/blocks/PageContainer";
import DigitalSolutionHero from "@/components/digitalsolutions/DigitalSolutionHero";
import BlockRenderer from "@/components/digitalsolutions/BlockRenderer";
import { notFound } from 'next/navigation';

export default async function DigitalSolutionDetailPage({ params }) {
  // Fix Next.js 15 params async requirement
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const slug = resolvedParams?.slug;

  if (!slug) {
    notFound();
  }

  // 獲取數碼方案頁面數據
  const pageData = await getDigitalSolutionsPageData(locale);
  
  // 提取處理過的數據
  const { plans } = pageData.processedData || {};
  
  // 根據 slug 查找對應的方案
  // slug 可能是方案的 order 或者標題的 slug 化版本
  const plan = plans?.find(plan => {
    // 嘗試匹配 order
    if (plan.order && plan.order.toString() === slug) {
      return true;
    }
    
    // 嘗試匹配標題的 slug 化版本
    const titleSlug = plan.title?.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-\u4e00-\u9fff]/g, '')
      .replace(/-+/g, '-')
      .trim();
    
    return titleSlug === slug;
  });

  if (!plan) {
    notFound();
  }

  return (
    <PageContainer className="mt-12">
      {/* 方案標題區域 */}
      <DigitalSolutionHero 
        plan={plan}
        locale={locale}
      />

      {/* 方案內容區塊 */}
      {plan.blocks && plan.blocks.length > 0 && (
        <div className="py-16">
          <div className="xl:container xl:max-w-[1280px] xl:mx-auto px-5">
            <BlockRenderer 
              blocks={plan.blocks}
              locale={locale}
            />
          </div>
        </div>
      )}

      {/* 返回上一頁按鈕 */}
      <div className="py-8">
        <div className="xl:container xl:max-w-[1280px] xl:mx-auto px-5 text-center">
          <a 
            href={`/${locale}/digital-solutions`}
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <svg 
              className="mr-2 w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m0 0h18" 
              />
            </svg>
            返回數碼方案列表
          </a>
        </div>
      </div>

      {/* 聯絡我們區塊 */}
      <div className="py-16 bg-gray-50">
        <div className="xl:container xl:max-w-[1280px] xl:mx-auto px-5 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            對此方案感興趣？
          </h2>
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

// 生成靜態路由參數
export async function generateStaticParams({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  
  try {
    const pageData = await getDigitalSolutionsPageData(locale);
    const { plans } = pageData.processedData || {};
    
    if (!plans || plans.length === 0) {
      return [];
    }
    
    // 為每個方案生成 slug
    return plans.map(plan => {
      // 使用 order 作為 slug，如果沒有則使用標題的 slug 化版本
      let slug = plan.order ? plan.order.toString() : '';
      
      if (!slug && plan.title) {
        slug = plan.title.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-\u4e00-\u9fff]/g, '')
          .replace(/-+/g, '-')
          .trim();
      }
      
      return {
        slug: slug || `plan-${plan.id}`
      };
    });
  } catch (error) {
    console.error('Error generating static params for digital solutions:', error);
    return [];
  }
}

// 生成元數據
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const slug = resolvedParams?.slug;

  try {
    const pageData = await getDigitalSolutionsPageData(locale);
    const { plans } = pageData.processedData || {};
    
    const plan = plans?.find(plan => {
      if (plan.order && plan.order.toString() === slug) {
        return true;
      }
      
      const titleSlug = plan.title?.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-\u4e00-\u9fff]/g, '')
        .replace(/-+/g, '-')
        .trim();
      
      return titleSlug === slug;
    });

    if (!plan) {
      return {
        title: '方案未找到 - I2NGO',
        description: '請求的數碼方案不存在。'
      };
    }

    return {
      title: `${plan.title} - 數碼方案 - I2NGO`,
      description: plan.content || `了解更多關於 ${plan.title} 的數碼化解決方案`,
    };
  } catch (error) {
    return {
      title: '數碼方案 - I2NGO',
      description: 'NGO數碼化解決方案'
    };
  }
}
