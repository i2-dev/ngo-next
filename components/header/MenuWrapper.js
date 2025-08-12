import MenuClient from "@/components/header/MenuClient";

/**
 * 優化的 MenuWrapper - 支持從頁面數據中獲取菜單數據
 * 避免重複的 API 調用，實現真正的按需加載
 */
export default function MenuWrapper({ menuData = null, locale = 'en', fallbackToApi = false }) {
  // 如果已有菜單數據，直接使用（來自頁面加載器）
  if (menuData) {
    return <MenuClient menuData={menuData} locale={locale} />;
  }
  
  // 如果沒有菜單數據且不允許回退到API，顯示佔位符
  if (!fallbackToApi) {
    return <MenuPlaceholder />;
  }
  
  // 回退到獨立的API調用（舊版兼容）
  return <MenuWithFallback locale={locale} />;
}

// 菜單佔位符組件
function MenuPlaceholder() {
  return (
    <nav className="bg-transparent relative">
      <div className="hidden md:flex items-center space-x-6">
        <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-6 w-18 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="md:hidden">
        <div className="h-6 w-6 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </nav>
  );
}

// 回退到API的菜單組件（舊版兼容）
async function MenuWithFallback({ locale }) {
  try {
    // 動態導入以避免循環依賴
    const { getMenuData } = await import("@/data/loaders");
    const menuData = await getMenuData(locale);
    return <MenuClient menuData={menuData} locale={locale} />;
  } catch (error) {
    console.error("Error loading menu with fallback:", error);
    return <MenuPlaceholder />;
  }
}