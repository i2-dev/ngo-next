import { getDigitalSolutionsData } from "@/data/unified-loader";
import PageContainer from "@/components/blocks/PageContainer";
import DigitalSolutionHero from "@/components/digitalsolutions/DigitalSolutionHero";
import BlockRenderer from "@/components/digitalsolutions/BlockRenderer";
import styles from "@/styles/DigitalSolutions.module.css";
import { notFound } from 'next/navigation';
import PageSection from "@/components/blocks/PageSection";

export default async function InstitutionalOnlineLearningSystemPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  const pageData = await getDigitalSolutionsData(locale);
  const { plans } = pageData.processedData || {};
  
  // 根據Order找到機構網上學習管理系統方案 (data[4])
  const plan = plans?.find(plan => plan.order === 4);
  
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

  const { generatePlanSEOMetadata } = await import('@/utils/seo-metadata');
  return await generatePlanSEOMetadata(locale, 4, '機構網上學習管理系統');
}
