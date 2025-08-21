import { getDigitalSolutionsData } from "@/data/unified-loader";
import PageContainer from "@/components/blocks/PageContainer";
import DigitalSolutionHero from "@/components/digitalsolutions/DigitalSolutionHero";
import BlockRenderer from "@/components/digitalsolutions/BlockRenderer";
import styles from "@/styles/DigitalSolutions.module.css";
import { notFound } from 'next/navigation';
import PageSection from "@/components/blocks/PageSection";

export default async function AICaseManagementPlatformPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  const pageData = await getDigitalSolutionsData(locale);
  const { plans } = pageData.processedData || {};
  
  // 根據Order找到AI個案管理平台方案 (data[1])
  const plan = plans?.find(plan => plan.order === 1);
  
  if (!plan) {
    notFound();
  }

  const heroBg= "gray";
  const heroGradient="linear-gradient(to bottom, rgba(151,151,151,1) 80%, rgba(151,151,151,0) 100%)";

  return (
    <>      
      <PageContainer>
        <PageSection>
          <DigitalSolutionHero plan={plan} locale={locale} bgcolor={heroBg} bgGradient={heroGradient}/>
        </PageSection>
        
        {plan.blocks && plan.blocks.length > 0 && (          
          <BlockRenderer blocks={plan.blocks} locale={locale} />                      
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
    const plan = plans?.find(plan => plan.order === 1);

    return {
      title: plan ? `${plan.title} - I2NGO` : 'AI 個案管理平台 - I2NGO',
      description: plan?.content || 'AI 個案管理平台',
    };
  } catch (error) {
    return {
      title: 'AI 個案管理平台 - I2NGO',
      description: 'AI 個案管理平台'
    };
  }
}
