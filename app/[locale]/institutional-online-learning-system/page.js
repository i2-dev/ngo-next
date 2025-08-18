import { getDigitalSolutionsPageData } from "@/data/page-loaders";
import PageContainer from "@/components/blocks/PageContainer";
import DigitalSolutionHero from "@/components/digitalsolutions/DigitalSolutionHero";
import BlockRenderer from "@/components/digitalsolutions/BlockRenderer";
import styles from "@/styles/DigitalSolutions.module.css";
import { notFound } from 'next/navigation';

export default async function InstitutionalOnlineLearningSystemPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  const pageData = await getDigitalSolutionsPageData(locale);
  const { plans } = pageData.processedData || {};
  
  // 根據Order找到機構網上學習管理系統方案 (data[4])
  const plan = plans?.find(plan => plan.order === 4);
  
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
    const plan = plans?.find(plan => plan.order === 4);

    return {
      title: plan ? `${plan.title} - I2NGO` : '機構網上學習管理系統 - I2NGO',
      description: plan?.content || '機構網上學習管理系統',
    };
  } catch (error) {
    return {
      title: '機構網上學習管理系統 - I2NGO',
      description: '機構網上學習管理系統'
    };
  }
}
