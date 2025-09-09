import { getDigitalSolutionsData, getHomepageData } from "@/data/unified-loader";
import PageContainer from "@/components/blocks/PageContainer";
import PageSection from "@/components/blocks/PageSection";
import DigitalSolutionHero from "@/components/digitalsolutions/DigitalSolutionHero";
import BlockRenderer from "@/components/digitalsolutions/BlockRenderer";
import ClientLogoSection from "@/components/homepage/ClientLogoSection";
import InformationSectionWrapper from "@/components/homepage/InformationSectionWrapper";
import AwardsSwiper from "@/components/homepage/AwardsSwiper";
import Card from "@/components/blocks/Card";
import styles from "@/styles/DigitalSolutions.module.css";
import homepageStyles from "@/styles/Homepage.module.css";
import { notFound } from 'next/navigation';

export default async function AISolutionPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  // 獲取數碼方案頁面數據
  const pageData = await getDigitalSolutionsData(locale);
  const { plans } = pageData.processedData || {};

  // 獲取首頁數據以獲取各種組件數據
  const homepageData = await getHomepageData(locale);
  const homepageBlocks = homepageData.blocks || [];
  
  // 从区块中提取需要的组件数据
  const clientLogoData = homepageBlocks.find(block => 
    block.__component === 'home-page.client-logo'
  );
  
  const informationData = homepageBlocks.find(block => 
    block.__component === 'home-page.information-section'
  );
  
  const awardsData = homepageBlocks.find(block => 
    block.__component === 'home-page.awards-section'
  );
  
  const cardData = homepageBlocks.find(block => 
    block.__component === 'public.card'
  );

  // 根據Order找到第一個方案 (data[0] - AI為你解決實際問題)
  const plan = plans?.find(plan => plan.order === 0);

  if (!plan) {
    notFound();
  }

  // console.log('Regular page plan data:', plan);

  return (
    <PageContainer>
      {/* 方案標題區域 */}
      <PageSection>        
        <DigitalSolutionHero
          plan={plan}
          locale={locale}
          variant="inline"
        />
      </PageSection>

      {/* 方案內容區塊 */}
      {plan.blocks && plan.blocks.length > 0 && (        
        <BlockRenderer
          blocks={plan.blocks}
          locale={locale}
        />        
      )}

      {/* Client Logo Section */}
      <PageSection className={'pt-0'}>
        <ClientLogoSection
          logoData={clientLogoData}
        />
      </PageSection>

      {/* Information Section */}
      <PageSection className={'bg-[rgba(247,242,244,0.5)] backdrop-filter-[blur(10px)]'}>
        <InformationSectionWrapper 
          locale={locale} 
          styles={homepageStyles} 
          informationData={informationData}
        />
      </PageSection>

      {/* Awards Swiper Section */}
      <PageSection>
        <AwardsSwiper
          awardsData={awardsData}
        />
      </PageSection>

      {/* AI² Card Section */}
      {cardData && (
        <PageSection>
          <Card
            Title={cardData.Title}
            Content={cardData.Content}
            icon={cardData.icon}
            Button={cardData.Button}
          />
        </PageSection>
      )}
    </PageContainer>
  );
}

// 生成元數據
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  try {
    const pageData = await getDigitalSolutionsData(locale);
    const { plans } = pageData.processedData || {};
    const plan = plans?.find(plan => plan.order === 0);

    if (!plan) {
      return {
        title: '方案未找到 - I2NGO',
        description: '請求的數碼方案不存在。'
      };
    }

    return {
      title: `${plan.title} - I2NGO`,
      description: plan.content || `了解更多關於 ${plan.title} 的數碼化解決方案`,
    };
  } catch (error) {
    return {
      title: 'AI為你解決實際問題 - I2NGO',
      description: 'AI落地應用，為你解決實際問題'
    };
  }
}
