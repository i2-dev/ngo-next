# NGO App 按需 API 加載系統指南

## 🎯 概述

本系統實現了真正的按需 API 加載 - 只有當用戶訪問特定頁面時，才會獲取該頁面所需的 API 數據和菜單 API。這大大提升了應用性能，減少了不必要的 API 調用。

## 📋 頁面 API 分類

### 🏠 首頁 (Homepage)
- **所需 API**: `homepage`, `menus`
- **用途**: 橫幅輪播、解決方案區塊、資訊區塊 + 導航菜單
- **快取時間**: 15 分鐘
- **優先級**: 高

### 🏢 關於我們 (About Us)
- **所需 API**: `menus`, `about-page`
- **用途**: 導航菜單 + 關於我們頁面內容
- **快取時間**: 30 分鐘
- **優先級**: 中

### 📞 聯絡我們 (Contact Us)
- **所需 API**: `menus`, `contact-page`
- **用途**: 導航菜單 + 聯絡我們頁面內容
- **快取時間**: 30 分鐘
- **優先級**: 中

### 📰 新聞列表 (News)
- **所需 API**: `menus`, `informations`, `information-categories`
- **用途**: 導航菜單 + 新聞列表 + 新聞分類
- **快取時間**: 10 分鐘
- **優先級**: 中

### 📄 新聞詳情 (News Detail)
- **所需 API**: `menus`, `informations`
- **用途**: 導航菜單 + 特定新聞內容
- **快取時間**: 20 分鐘
- **優先級**: 中

## 🔧 使用方法

### 1. 基本頁面數據加載

```javascript
import { getPageSpecificData } from "@/data/page-loaders";

// 在頁面組件中
export default async function MyPage({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  
  // 🎯 自動獲取頁面所需的所有 API 數據
  const pageData = await getPageSpecificData('homepage', locale);
  
  // pageData 包含:
  // - homepage: 首頁 API 數據
  // - menus: 菜單 API 數據
  // - meta: 元數據（加載時間、快取信息等）
  
  return <div>...</div>;
}
```

### 2. 使用專用頁面加載器

```javascript
import { 
  getHomepagePageData,
  getAboutPageData,
  getContactPageData,
  getNewsPageData,
  getNewsDetailPageData 
} from "@/data/page-loaders";

// 首頁
const homepageData = await getHomepagePageData(locale);
// 包含處理過的結構化數據：bannerSlides, solutionData 等

// 關於我們頁面
const aboutData = await getAboutPageData(locale);

// 新聞頁面（支持查詢參數）
const newsData = await getNewsPageData(locale, {
  page: 1,
  pageSize: 10,
  category: 'tech',
  search: '人工智能'
});

// 新聞詳情頁面
const newsDetailData = await getNewsDetailPageData('news-slug', locale);
```

### 3. 智能路由加載器

```javascript
import { getDataForRoute } from "@/data/page-loaders";

// 根據路由路徑自動推斷頁面類型並加載數據
const pageData = await getDataForRoute('/zh/aboutus', 'zh');
// 自動識別為 aboutus 頁面並加載相應數據
```

## 🎨 Header 和 Menu 優化

### 舊版方式（會產生重複 API 調用）
```javascript
// ❌ 每個頁面都會單獨調用 menu API
<Header locale={locale} />
```

### 新版方式（避免重複調用）
```javascript
// ✅ 從頁面數據中提取菜單，避免重複 API 調用
const pageData = await getPageSpecificData('homepage', locale);

return (
  <>
    <Header locale={locale} menuData={pageData.menus} />
    {/* 頁面內容 */}
  </>
);
```

## 📊 性能監控

### 查看快取統計
```javascript
import { getCacheStats } from "@/data/page-loaders";

const stats = getCacheStats();
console.log(stats);
// {
//   size: 5,
//   maxSize: 100,
//   entries: ['homepage_zh-Hant', 'aboutus_en', ...],
//   hitRate: 85,
//   memoryUsage: '~250KB'
// }
```

### 清理快取
```javascript
import { clearPageCache } from "@/data/page-loaders";

// 清理特定頁面快取
clearPageCache('homepage', 'zh-Hant');

// 清理所有快取
clearPageCache();
```

### 查看 API 配置
```javascript
import { logApiConfig } from "@/data/api-config";

// 在開發環境中查看完整的 API 配置
logApiConfig();
```

## 🔍 配置管理

### 添加新頁面

1. **在 `api-config.js` 中添加頁面配置**:
```javascript
export const PAGE_API_CONFIG = {
  // 新頁面
  'my-new-page': {
    apis: ['menus', 'my-page-api'],
    description: '導航菜單 + 我的頁面內容',
    cacheDuration: 20 * 60 * 1000, // 20分鐘
    priority: 'medium'
  }
};
```

2. **添加 API 端點配置**:
```javascript
export const API_ENDPOINTS = {
  'my-page-api': {
    endpoint: 'my-page',
    populateLevel: 3,
    description: '我的頁面內容'
  }
};
```

3. **創建專用加載器函數**:
```javascript
// 在 page-loaders.js 中
export async function getMyPageData(locale = 'en') {
  return await getPageSpecificData('my-new-page', locale);
}
```

## 🚀 最佳實踐

### 1. 頁面組件結構
```javascript
import { getPageSpecificData } from "@/data/page-loaders";

export default async function MyPage({ params }) {
  // 解析參數
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  
  // 🎯 加載頁面特定數據（一次性獲取所有需要的 API）
  const pageData = await getPageSpecificData('my-page', locale);
  
  // 提取所需數據
  const menuData = pageData.menus;
  const contentData = pageData['my-page-api'];
  
  return (
    <div>
      {/* 使用數據渲染內容 */}
    </div>
  );
}
```

### 2. 錯誤處理
```javascript
try {
  const pageData = await getPageSpecificData('homepage', locale);
  // 使用數據
} catch (error) {
  console.error('Failed to load page data:', error);
  // 顯示錯誤頁面或使用默認數據
}
```

### 3. 條件數據加載
```javascript
// 根據條件加載不同的數據
const newsOptions = searchParams.category ? 
  { category: searchParams.category } : 
  {};

const pageData = await getNewsPageData(locale, newsOptions);
```

## 🔧 故障排除

### 常見問題

1. **"No API config found for page" 警告**
   - 在 `api-config.js` 中添加頁面配置

2. **菜單顯示加載狀態**
   - 確保頁面正確傳遞 `menuData` 給 Header
   - 檢查 `fallbackToApi` 設置

3. **快取未命中**
   - 檢查 locale 是否正確標準化
   - 查看快取過期時間設置

### 調試工具

```javascript
// 啟用詳細日誌（僅開發環境）
process.env.NODE_ENV === 'development' && logApiConfig();

// 查看頁面數據結構
console.log('Page data structure:', pageData);

// 監控 API 調用時間
console.log('Load time:', pageData.meta.loadTime, 'ms');
```

## 📈 性能優勢

### 之前（多次 API 調用）
```
首頁訪問：
✗ API 調用 1: homepage
✗ API 調用 2: menus  
✗ API 調用 3: solution-data
總計：3 次 API 調用
```

### 之後（按需加載）
```
首頁訪問：
✓ API 調用 1: homepage（包含所有首頁數據）
✓ API 調用 2: menus
總計：2 次 API 調用（減少 33%）
```

### 快取效果
```
再次訪問首頁：
✓ 快取命中：homepage 數據
✓ 快取命中：menus 數據
總計：0 次 API 調用（100% 快取命中）
```

---

**注意**: 此系統設計為向後兼容，現有的 API 調用方式仍然可以正常工作，但建議逐步遷移到新的按需加載系統以獲得更好的性能。

