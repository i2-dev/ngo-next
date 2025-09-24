import { getMenuData } from '@/data/unified-loader';
import SitemapLink from '@/components/SitemapLink';
import PageContainer from "@/components/blocks/PageContainer";
import PageSection from "@/components/blocks/PageSection";
import { getTranslation } from '@/utils/translations';

export default async function SitemapPage({ params }) {
  // Fix Next.js 15 params async requirement
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  
  // 獲取菜單數據
  const menuData = await getMenuData(locale);
  
  // 使用統一翻譯系統
  const sitemapTitle = getTranslation(locale, 'common', 'sitemap', 'Site Map');
  const loadingText = getTranslation(locale, 'common', 'loading', 'Loading...');
  
  return (
    <PageContainer>
      <PageSection>      
        {/* 主要內容 */}        
        {/* 標題 */}
        <div className="text-center mb-12">
          <h1 className='text-[42px] font-medium max-lg:text-5xl max-md:text-4xl'>
            {sitemapTitle}
          </h1>
        </div>
        
        {/* 網站地圖內容 */}
        <div className="max-w-lg mx-auto">
          <SitemapContent menuData={menuData} locale={locale} />
        </div>        
      </PageSection>      
    </PageContainer>
  );
}

// 網站地圖內容組件
function SitemapContent({ menuData, locale }) {
  const loadingText = getTranslation(locale, 'common', 'loading', 'Loading...');
  
  if (!menuData || !menuData.data) {
    return (
      <div className="text-center text-[#3a4148]">
        {loadingText}
      </div>
    );
  }

  // 按照 Order 排序，與 MenuClient 保持一致
  const menuItems = menuData.data.sort((a, b) => (a.Order || 0) - (b.Order || 0));
  
  return (    
    <ul className='ml-5'>
      {menuItems.map((item, index) => (
        <li key={index} className="list-disc mb-3.5 marker:text-[#3a4148]">
          <SitemapItem item={item} locale={locale} />
        </li>
      ))}
    </ul>   
  );
}

// 網站地圖項目組件
function SitemapItem({ item, locale }) {
  // 使用正確的 menu 數據結構：items 而不是 children
  const hasChildren = item.items && item.items.length > 0;
  
  // 格式化 URL，確保包含語言前綴
  const formatUrl = (url) => {
    if (!url) return url;
    
    // 如果URL已經包含當前語言前綴，直接返回
    if (url.startsWith(`/${locale}/`) || url === '/') {
      return url;
    }
    
    // 檢查是否已經包含其他語言前綴，如果是則替換為當前語言
    const supportedLocales = ['en', 'zh-hant', 'zh-Hant-HK'];
    for (const supportedLocale of supportedLocales) {
      if (url.startsWith(`/${supportedLocale}/`)) {
        return url.replace(`/${supportedLocale}/`, `/${locale}/`);
      }
    }
    
    // 如果URL以/開頭但沒有語言前綴，添加語言前綴
    if (url.startsWith('/')) {
      return `/${locale}${url}`;
    }
    
    // 其他情況，直接添加語言前綴
    return `/${locale}/${url}`;
  };
  
  return (
    <div className="space-y-4">
      {/* 主項目 */}
      <div className="flex items-center">
        {item.URL ? (
          <SitemapLink 
            href={formatUrl(item.URL)} 
            className="text-[#3a4148] hover:text-[#2a7115] transition-colors"
            target={item.Target || '_self'}
          >
            {item.title}
          </SitemapLink>
        ) : (
          <h2 className="text-[#3a4148] font-normal mb-0">
            {item.title}
          </h2>
        )}
      </div>
      
      {/* 子項目 */}
      {hasChildren && (
        <ul className='ml-5'>
          {item.items
            .sort((a, b) => (a.Order || 0) - (b.Order || 0))
            .map((subItem, subIndex) => (
            <li key={subIndex} className="list-disc mb-3.5 marker:text-[#3a4148]">
              {subItem.url ? (
                <SitemapLink 
                  href={formatUrl(subItem.url)} 
                  className="text-[#3a4148] hover:text-[#2a7115] transition-colors"
                  target={subItem.Target || '_self'}
                >
                  {subItem.Label}
                </SitemapLink>
              ) : (
                <span className="text-[#3a4148]">
                  {subItem.Label}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
