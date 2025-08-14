import { getDigitalSolutionsPageData } from "@/data/page-loaders";
import PageContainer from "@/components/blocks/PageContainer";
import DigitalSolutionCard from "@/components/digitalsolutions/DigitalSolutionCard";
import DigitalSolutionHero from "@/components/digitalsolutions/DigitalSolutionHero";
import BlockRenderer from "@/components/digitalsolutions/BlockRenderer";

export default async function DigitalSolutionsPage({ params }) {
  // Fix Next.js 15 params async requirement
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  // 獲取數碼方案頁面數據
  const pageData = await getDigitalSolutionsPageData(locale);
  
  // 提取處理過的數據
  const { plans, menus } = pageData.processedData || {};

  return (
    <PageContainer className="mt-12">
      {/* 頁面標題和介紹 */}
      <div className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="xl:container xl:max-w-[1280px] xl:mx-auto px-5">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              數碼方案
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              為NGO組織提供全方位的數碼化解決方案，從AI技術到系統整合，助力機構提升效率與影響力
            </p>
          </div>
        </div>
      </div>

      {/* 數碼方案列表 */}
      {plans && plans.length > 0 && (
        <div className="py-16">
          <div className="xl:container xl:max-w-[1280px] xl:mx-auto px-5">
            <div className="space-y-16">
              {plans.map((plan, index) => (
                <div key={plan.id} className="relative">
                  {/* 方案卡片 */}
                  <DigitalSolutionCard 
                    plan={plan}
                    index={index}
                    locale={locale}
                  />
                  
                  {/* 方案內容區塊 */}
                  {plan.blocks && plan.blocks.length > 0 && (
                    <div className="mt-12">
                      <BlockRenderer 
                        blocks={plan.blocks}
                        locale={locale}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 聯絡我們區塊 */}
      <div className="py-16 bg-gray-50">
        <div className="xl:container xl:max-w-[1280px] xl:mx-auto px-5 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            準備開始您的數碼化轉型？
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            我們的專業團隊隨時為您提供諮詢服務，幫助您選擇最適合的數碼化解決方案
          </p>
          <a 
            href="/contact-us" 
            className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            聯絡我們
          </a>
        </div>
      </div>
    </PageContainer>
  );
}
