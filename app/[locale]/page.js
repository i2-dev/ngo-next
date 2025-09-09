import HomepageBlockRenderer from "@/components/homepage/HomepageBlockRenderer";

import { getHomepageData } from "@/data/unified-loader";
import PageContainer from "@/components/blocks/PageContainer";

export default async function HomePage({ params }) {
  // Fix Next.js 15 params async requirement
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  // 🎯 使用頁面特定的數據加載器，實現真正的按需加載
  const pageData = await getHomepageData(locale);
  const blocks = pageData.blocks || [];

  return (
    <PageContainer className={'!mt-22'}>
      {/* 使用 HomepageBlockRenderer 循环渲染所有区块 */}
      {blocks && blocks.length > 0 && (
        <HomepageBlockRenderer blocks={blocks} locale={locale} />
      )}
    </PageContainer>
  );
}
