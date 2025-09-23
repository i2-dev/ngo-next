import { getSuccessCasesData } from "@/data/unified-loader";
import PageContainer from "@/components/blocks/PageContainer";
import SuccessCaseHero from "@/components/successcases/SuccessCaseHero";
import SuccessCaseBlockRenderer from "@/components/successcases/SuccessCaseBlockRenderer";
import { notFound } from 'next/navigation';
import PageSection from "@/components/blocks/PageSection";
import { getTranslation } from "@/utils/translations";

export default async function BrainTrainingGamePage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  // 獲取成功案例頁面數據
  const pageData = await getSuccessCasesData(locale);
  const { successCases, menus } = pageData.processedData || {};
  
  // 根據Order找到「智有腦」健腦遊戲系統案例 (data[2] - 菜單第2個)
  const successCase = successCases?.find(successCase => successCase.order === 2);

  if (!successCase) {
    notFound();
  }
  
  const heroBg= "white";

  // Debug logging for main page
  console.log('=== Brain Training Game Main Page Debug ===');
  console.log('successCase found:', successCase);
  console.log('successCase.title:', successCase?.title);
  console.log('successCase.order:', successCase?.order);
  console.log('successCase.documentId:', successCase?.documentId);
  console.log('successCase.bgcolor:', successCase?.bgcolor);
  console.log('heroBg value:', heroBg);
  console.log('============================================');

  return (
    <PageContainer>
      <PageSection className={'pb-0'}>
        <SuccessCaseHero successCase={successCase} locale={locale} bgcolor={heroBg} />
      </PageSection>      
      
      <SuccessCaseBlockRenderer 
        successCase={successCase} 
        locale={locale}
        allSuccessCases={successCases || []}
        menuData={menus}
      />      
    </PageContainer>
  );
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  
  const { generateSuccessCaseSEOMetadata } = await import('@/utils/seo-metadata');
  return await generateSuccessCaseSEOMetadata(locale, 2, 'Brain Training Game System');
}
