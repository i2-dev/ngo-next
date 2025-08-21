import { getSuccessCasesData } from "@/data/unified-loader";
import PageContainer from "@/components/blocks/PageContainer";
import SuccessCaseHero from "@/components/successcases/SuccessCaseHero";
import SuccessCaseBlockRenderer from "@/components/successcases/SuccessCaseBlockRenderer";
import { notFound } from 'next/navigation';

export default async function E72ElderlyRecruitmentSystemPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  // 獲取成功案例頁面數據
  const pageData = await getSuccessCasesData(locale);
  const { successCases, menus } = pageData.processedData || {};
  
  // 根據Order找到e72傲齡動力案例 (data[3] - 菜單第3個)
  const successCase = successCases?.find(successCase => successCase.order === 3);
  
  if (!successCase) {
    notFound();
  }

  return (
    <>
      <SuccessCaseHero successCase={successCase} locale={locale} />
      
      <PageContainer>
        <div className="py-16">
          <div className="xl:container xl:max-w-[1280px] xl:mx-auto px-5">
            <SuccessCaseBlockRenderer 
              successCase={successCase} 
              locale={locale}
              allSuccessCases={successCases || []}
              menuData={menus}
            />
          </div>
        </div>
      </PageContainer>
    </>
  );
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  
  const pageData = await getSuccessCasesData(locale);
  const { successCases } = pageData.processedData || {};
  const successCase = successCases?.find(successCase => successCase.order === 3);
  
  if (!successCase) {
    return {
      title: 'e72傲齡動力 | NGO App',
      description: 'e72傲齡動力成功案例'
    };
  }

  return {
    title: `${successCase.title} | NGO App`,
    description: successCase.content ? successCase.content.substring(0, 160) : `${successCase.title}成功案例`,
    openGraph: {
      title: `${successCase.title} | NGO App`,
      description: successCase.content ? successCase.content.substring(0, 160) : `${successCase.title}成功案例`,
      type: 'website',
      images: successCase.background ? [successCase.background.url] : [],
    },
  };
}
