import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import PromoBanner from "@/components/PromoBanner";

/**
 * 優化的語言區域布局
 * 保持簡潔，讓各頁面自行管理數據加載
 * Header現在可以接收來自頁面的menuData以避免重複API調用
 */
export default async function LocaleLayout({ children, params }) {
  // Fix Next.js 15 params async requirement
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  
  return (
    <>
      {/* Header 現在支持從頁面接收 menuData，避免重複 API 調用 */}
      <Header locale={locale} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer locale={locale} />
      
      {/* 右下角固定組件 */}
      <PromoBanner locale={locale} />
      {/* 返回頂部按鈕 */}
      <BackToTop />
    </>
  );
}
