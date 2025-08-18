import { getSuccessCasesPageData } from "@/data/page-loaders";
import PageContainer from "@/components/blocks/PageContainer";
import SuccessCaseHero from "@/components/successcases/SuccessCaseHero";
import SuccessCaseBlockRenderer from "@/components/successcases/SuccessCaseBlockRenderer";
import { notFound } from 'next/navigation';

export default async function BrainTrainingGamePage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  // 獲取成功案例頁面數據
  const pageData = await getSuccessCasesPageData(locale);
  const { successCases, menus } = pageData.processedData || {};
  
  // 根據Order找到「智有腦」健腦遊戲系統案例 (data[2] - 菜單第2個)
  const successCase = successCases?.find(successCase => successCase.order === 2);
  
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
  
  const pageData = await getSuccessCasesPageData(locale);
  const { successCases } = pageData.processedData || {};
  const successCase = successCases?.find(successCase => successCase.order === 2);
  
  if (!successCase) {
    return {
      title: '「智有腦」健腦遊戲系統 | NGO App',
      description: '「智有腦」健腦遊戲系統成功案例'
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
