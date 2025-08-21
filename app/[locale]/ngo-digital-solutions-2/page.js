import { getDigitalSolutionsData } from "@/data/unified-loader";
import PageContainer from "@/components/blocks/PageContainer";
import DigitalSolutionHero from "@/components/digitalsolutions/DigitalSolutionHero";
import BlockRenderer from "@/components/digitalsolutions/BlockRenderer";
import styles from "@/styles/DigitalSolutions.module.css";
import { notFound } from 'next/navigation';
import PageSection from "@/components/blocks/PageSection";

export default async function NGODigitalSolutions2Page({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  // 獲取數碼方案頁面數據
  const pageData = await getDigitalSolutionsData(locale);
  const { plans } = pageData.processedData || {};
  
  // 根據Order找到NGO數碼化解決方案 (data[5])
  const plan = plans?.find(plan => plan.order === 5);
  
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
    const plan = plans?.find(plan => plan.order === 5);

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
