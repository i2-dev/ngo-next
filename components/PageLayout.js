import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

/**
 * 優化的頁面布局組件
 * 支援頁面特定的數據加載，避免重複API調用
 */
export default function PageLayout({ 
  children, 
  locale = 'en', 
  pageData = null, 
  showHeader = true, 
  showFooter = true 
}) {
  // 從頁面數據中提取菜單數據
  const menuData = pageData?.menus || null;
  
  return (
    <>
      {showHeader && (
        <Header 
          locale={locale} 
          menuData={menuData}
        />
      )}
      
      <main className="flex-grow">
        {children}
      </main>
      
      {showFooter && (
        <Footer locale={locale} />
      )}
      
      {/* 返回頂部按鈕 */}
      <BackToTop />
    </>
  );
}

/**
 * 帶有頁面數據加載的布局組件
 * 根據頁面路徑自動獲取所需的API數據
 */
export async function PageLayoutWithData({ 
  children, 
  params, 
  pageName = null,
  additionalData = {},
  ...layoutProps 
}) {
  // 解析參數
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  
  try {
    // 動態導入頁面加載器
    const { getDataForRoute } = await import('@/data/unified-loader');
    
    // 自動推斷頁面名稱或使用提供的頁面名稱
    const finalPageName = pageName || inferPageNameFromParams(resolvedParams);
    
    // 獲取頁面特定數據
    const pageData = await getDataForRoute(`/${finalPageName}`, locale, additionalData);
    
    return (
      <PageLayout 
        locale={locale} 
        pageData={pageData}
        {...layoutProps}
      >
        {/* 將頁面數據作為props傳遞給子組件 */}
        {typeof children === 'function' ? children(pageData) : children}
      </PageLayout>
    );
    
  } catch (error) {
    console.error('Error loading page data in layout:', error);
    
    // 錯誤回退：使用基本布局
    return (
      <PageLayout 
        locale={locale} 
        pageData={null}
        {...layoutProps}
      >
        {children}
      </PageLayout>
    );
  }
}

/**
 * 從路由參數推斷頁面名稱
 */
function inferPageNameFromParams(params) {
  // 可以根據路由結構推斷頁面類型
  if (params?.slug) {
    if (Array.isArray(params.slug)) {
      const path = params.slug.join('/');
      if (path.startsWith('news/')) return 'news-detail';
      return 'unknown';
    }
    return 'news-detail';
  }
  
  return 'homepage'; // 默認
}

/**
 * 針對特定頁面類型的布局組件
 */

// 首頁布局
export async function HomepageLayout({ children, params, ...props }) {
  return (
    <PageLayoutWithData
      params={params}
      pageName="homepage"
      {...props}
    >
      {children}
    </PageLayoutWithData>
  );
}

// 新聞頁面布局
export async function NewsLayout({ children, params, searchParams = {}, ...props }) {
  return (
    <PageLayoutWithData
      params={params}
      pageName="news"
      additionalData={searchParams}
      {...props}
    >
      {children}
    </PageLayoutWithData>
  );
}

// 新聞詳情頁面布局
export async function NewsDetailLayout({ children, params, ...props }) {
  return (
    <PageLayoutWithData
      params={params}
      pageName="news-detail"
      {...props}
    >
      {children}
    </PageLayoutWithData>
  );
}

// 關於我們頁面布局
export async function AboutLayout({ children, params, ...props }) {
  return (
    <PageLayoutWithData
      params={params}
      pageName="aboutus"
      {...props}
    >
      {children}
    </PageLayoutWithData>
  );
}

// 聯絡我們頁面布局
export async function ContactLayout({ children, params, ...props }) {
  return (
    <PageLayoutWithData
      params={params}
      pageName="contact-us"
      {...props}
    >
      {children}
    </PageLayoutWithData>
  );
}

