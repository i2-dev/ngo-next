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
  
  // 使用特定的documentId來找到AI個案管理平台方案
  const documentId = 'r42zk86ouqoly2l8jpg82psl';
  const plan = plans?.find(plan => plan.documentId === documentId);
  
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
    const documentId = 'r42zk86ouqoly2l8jpg82psl';
    const plan = plans?.find(plan => plan.documentId === documentId);

    if (!plan) {
      return {
        title: 'AI 個案管理平台 | NGO Digital',
        description: 'AI 個案管理平台 - 智能化的個案管理解決方案',
      };
    }

    const { extractSEOFromData } = await import('@/utils/seo-metadata');
    return extractSEOFromData(plan, `${plan.title} | NGO Digital`, 
      plan.content || `了解更多關於 ${plan.title} 的數碼化解決方案`);
  } catch (error) {
    return {
      title: 'AI 個案管理平台 | NGO Digital',
      description: 'AI 個案管理平台 - 智能化的個案管理解決方案'
    };
  }
}
