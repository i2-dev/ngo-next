import { getDigitalSolutionsData, getHomepageData } from "@/data/unified-loader";
import PageContainer from "@/components/blocks/PageContainer";
import DigitalSolutionHero from "@/components/digitalsolutions/DigitalSolutionHero";
import BlockRenderer from "@/components/digitalsolutions/BlockRenderer";
import Card from "@/components/blocks/Card";
import styles from "@/styles/DigitalSolutions.module.css";
import { notFound } from 'next/navigation';
import PageSection from "@/components/blocks/PageSection";

export default async function AIElderlyHealthManagerPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  const pageData = await getDigitalSolutionsData(locale);
  const { plans } = pageData.processedData || {};

  // 根據Order找到「 智康健」AI 長者健康管家 (data[4])
  const plan = plans?.find(plan => plan.order === 6);
  
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
    const plan = plans?.find(plan => plan.order === 6);

    return {
      title: plan ? `${plan.title} - I2NGO` : '「 智康健」AI 長者健康管家 - I2NGO',
      description: plan?.content || '「 智康健」AI 長者健康管家',
    };
  } catch (error) {
    return {
      title: '「 智康健」AI 長者健康管家',
      description: '「 智康健」AI 長者健康管家'
    };
  }
}
