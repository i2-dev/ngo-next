import { getDigitalSolutionsData, getHomepageData } from "@/data/unified-loader";
import PageContainer from "@/components/blocks/PageContainer";
import DigitalSolutionHero from "@/components/digitalsolutions/DigitalSolutionHero";
import BlockRenderer from "@/components/digitalsolutions/BlockRenderer";
import Card from "@/components/blocks/Card";
import styles from "@/styles/DigitalSolutions.module.css";
import { notFound } from 'next/navigation';
import PageSection from "@/components/blocks/PageSection";

export default async function AIHotlineSystemPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  const pageData = await getDigitalSolutionsData(locale);
  const { plans } = pageData.processedData || {};

  // 獲取首頁數據以獲取各種組件數據
    const homepageData = await getHomepageData(locale);
    const {      
      cardData
    } = homepageData.processedData || {};
  
  // 根據Order找到AI熱線系統方案 (data[3])
  const plan = plans?.find(plan => plan.order === 3);
  
  if (!plan) {
    notFound();
  }

  const heroBg= "brown";
  const heroGradient="linear-gradient(to bottom, rgba(47,25,27,1) 88%, rgba(47,25,27,0) 100%)";

  return (
    <>      
      <PageContainer>
        <PageSection>
          <DigitalSolutionHero plan={plan} locale={locale} bgcolor={heroBg} bgGradient={heroGradient}/>
        </PageSection>

        {plan.blocks && plan.blocks.length > 0 && (          
          <BlockRenderer blocks={plan.blocks} locale={locale} />          
        )}

        {/* AI² Card Section */}
        {cardData && (
          <PageSection className={'pb-50'}>
            <Card
              Title={cardData.Title}
              Content={cardData.Content}
              icon={cardData.icon}
              Button={cardData.Button}
            />
          </PageSection>
        )}
      </PageContainer>
    </>
  );
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  try {
    const pageData = await getDigitalSolutionsData(locale);
    const { plans } = pageData.processedData || {};
    const plan = plans?.find(plan => plan.order === 3);

    return {
      title: plan ? `${plan.title} - I2NGO` : 'AI 熱線系統 - I2NGO',
      description: plan?.content || 'AI 熱線系統',
    };
  } catch (error) {
    return {
      title: 'AI 熱線系統 - I2NGO',
      description: 'AI 熱線系統'
    };
  }
}
