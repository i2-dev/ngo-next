import { getDigitalSolutionsPageData } from "@/data/page-loaders";
import PageContainer from "@/components/blocks/PageContainer";
import DigitalSolutionHero from "@/components/digitalsolutions/DigitalSolutionHero";
import BlockRenderer from "@/components/digitalsolutions/BlockRenderer";
import styles from "@/styles/DigitalSolutions.module.css";
import { notFound } from 'next/navigation';

export default async function AICaseManagementPlatformPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  const pageData = await getDigitalSolutionsPageData(locale);
  const { plans } = pageData.processedData || {};
  
  // 根據Order找到AI個案管理平台方案 (data[1])
  const plan = plans?.find(plan => plan.order === 1);
  
  if (!plan) {
    notFound();
  }

  return (
    <>
      <DigitalSolutionHero plan={plan} locale={locale} />
      
      <PageContainer>
        {plan.blocks && plan.blocks.length > 0 && (
          <div className="py-16">
            <div className="xl:container xl:max-w-[1280px] xl:mx-auto px-5">
              <BlockRenderer blocks={plan.blocks} locale={locale} />
            </div>
          </div>
        )}
      </PageContainer>
    </>
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
