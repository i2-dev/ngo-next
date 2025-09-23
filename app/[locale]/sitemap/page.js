import { getMenuData } from '@/data/unified-loader';
import SitemapLink from '@/components/SitemapLink';
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50">
      {/* 背景水印 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-[20rem] font-bold text-gray-200 opacity-20 select-none">
          NGO
        </div>
      </div>
      
      {/* 主要內容 */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* 標題 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {sitemapTitle}
          </h1>
        </div>
        
        {/* 網站地圖內容 */}
        <div className="max-w-4xl mx-auto">
          <SitemapContent menuData={menuData} locale={locale} />
        </div>
      </div>
    </div>
  );
}

// 網站地圖內容組件
function SitemapContent({ menuData, locale }) {
  const loadingText = getTranslation(locale, 'common', 'loading', 'Loading...');
  
  if (!menuData || !menuData.data) {
    return (
      <div className="text-center text-gray-500">
        {loadingText}
      </div>
    );
  }

  // 按照 Order 排序，與 MenuClient 保持一致
  const menuItems = menuData.data.sort((a, b) => (a.Order || 0) - (b.Order || 0));
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="space-y-8">
        {menuItems.map((item, index) => (
          <div key={index} className="border-b border-gray-200 pb-8 last:border-b-0">
            <SitemapItem item={item} locale={locale} />
          </div>
        ))}
      </div>
    </div>
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
            className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
            target={item.Target || '_self'}
          >
            {item.title}
          </SitemapLink>
        ) : (
          <h2 className="text-2xl font-bold text-gray-800">
            {item.title}
          </h2>
        )}
      </div>
      
      {/* 子項目 */}
      {hasChildren && (
        <div className="ml-8 space-y-3">
          {item.items
            .sort((a, b) => (a.Order || 0) - (b.Order || 0))
            .map((subItem, subIndex) => (
            <div key={subIndex} className="flex items-center">
              {subItem.url ? (
                <SitemapLink 
                  href={formatUrl(subItem.url)} 
                  className="text-lg text-gray-700 hover:text-blue-600 transition-colors"
                  target={subItem.Target || '_self'}
                >
                  {subItem.Label}
                </SitemapLink>
              ) : (
                <span className="text-lg text-gray-700">
                  {subItem.Label}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
