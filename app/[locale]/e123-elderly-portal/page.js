import { getSuccessCasesData } from "@/data/unified-loader";
import PageContainer from "@/components/blocks/PageContainer";
import SuccessCaseHero from "@/components/successcases/SuccessCaseHero";
import SuccessCaseBlockRenderer from "@/components/successcases/SuccessCaseBlockRenderer";
import { notFound } from 'next/navigation';
import PageSection from "@/components/blocks/PageSection";
import { getTranslation } from "@/utils/translations";

export default async function E123ElderlyPortalPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  // 獲取成功案例頁面數據
  const pageData = await getSuccessCasesData(locale);
  const { successCases, menus } = pageData.processedData || {};
  
  // 根據Order找到e123 長青網案例 (data[1] - 菜單第1個)
  const successCase = successCases?.find(successCase => successCase.order === 1);
  
  if (!successCase) {
    notFound();
  }

  const heroBg= "lightblue";

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
  return await generateSuccessCaseSEOMetadata(locale, 1, 'e123 長青網');
}
