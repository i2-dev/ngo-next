# SEO 元數據系統

## 概述

這個SEO系統為NGO應用程序提供統一的SEO元數據處理功能。系統會自動從Strapi API獲取SEO數據並將其轉換為Next.js的metadata格式。

## 功能特點

- 🔄 **自動獲取SEO數據**: 從Strapi API自動獲取每個頁面的SEO信息
- 🎯 **統一處理**: 所有頁面使用相同的SEO處理邏輯
- 🌐 **多語言支持**: 支持英文和繁體中文
- 📱 **社交媒體優化**: 自動生成OpenGraph和Twitter卡片數據
- 🖼️ **圖片處理**: 自動處理分享圖片URL
- 🔧 **錯誤處理**: 提供默認SEO數據作為後備方案

## 文件結構

```
utils/
├── seo-metadata.js          # 主要SEO處理工具
└── get-page-metadata.js     # 舊的SEO工具（已棄用）

app/[locale]/
├── page.js                  # 首頁（已添加SEO支持）
├── aboutus/page.js          # 關於我們（已添加SEO支持）
├── contact-us/page.js       # 聯絡我們（已添加SEO支持）
├── ngo-latest-news/
│   ├── page.js             # 新聞列表（已添加SEO支持）
│   └── [id]/page.js        # 新聞詳情（已添加SEO支持）
├── ai-solution/page.js      # AI方案（已更新SEO）
├── brain-training-game/page.js # 健腦遊戲（已更新SEO）
├── e72-elderly-recruitment-system/page.js # e72案例（已更新SEO）
└── ai-case-management-platform/page.js # AI個案管理（已更新SEO）
```

## 核心函數

### 1. `extractSEOFromData(data, fallbackTitle, fallbackDescription)`

從Strapi數據中提取SEO信息。

**參數:**
- `data`: Strapi API返回的數據對象
- `fallbackTitle`: 默認標題
- `fallbackDescription`: 默認描述

**返回:**
```javascript
{
  title: "頁面標題 | NGO Digital",
  description: "頁面描述",
  keywords: "關鍵詞",
  openGraph: {
    title: "頁面標題 | NGO Digital",
    description: "頁面描述",
    type: "website",
    images: ["圖片URL"]
  },
  twitter: {
    card: "summary_large_image",
    title: "頁面標題 | NGO Digital",
    description: "頁面描述",
    images: ["圖片URL"]
  }
}
```

### 2. `generateSEOMetadata(endpoint, options, fallbackTitle, fallbackDescription)`

為特定頁面生成SEO元數據。

**參數:**
- `endpoint`: Strapi API端點名稱
- `options`: 查詢選項（locale, slug, filters等）
- `fallbackTitle`: 默認標題
- `fallbackDescription`: 默認描述

### 3. `generateSuccessCaseSEOMetadata(locale, order, fallbackTitle)`

為成功案例頁面生成SEO元數據。

### 4. `generatePlanSEOMetadata(locale, order, fallbackTitle)`

為數碼方案頁面生成SEO元數據。

### 5. `generateNewsSEOMetadata(documentId, locale)`

為新聞文章頁面生成SEO元數據。

## 使用方法

### 為新頁面添加SEO支持

1. **在頁面文件中添加generateMetadata函數:**

```javascript
// 生成頁面的SEO元數據
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  const { generateSEOMetadata } = await import('@/utils/seo-metadata');
  return await generateSEOMetadata('endpoint-name', { locale }, '默認標題', '默認描述');
}
```

2. **對於成功案例頁面:**

```javascript
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  
  const { generateSuccessCaseSEOMetadata } = await import('@/utils/seo-metadata');
  return await generateSuccessCaseSEOMetadata(locale, order, '默認標題');
}
```

3. **對於數碼方案頁面:**

```javascript
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  const { generatePlanSEOMetadata } = await import('@/utils/seo-metadata');
  return await generatePlanSEOMetadata(locale, order, '默認標題');
}
```

4. **對於新聞文章頁面:**

```javascript
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { id, locale } = resolvedParams;
  const normalizedLocale = locale || 'en';

  const { generateNewsSEOMetadata } = await import('@/utils/seo-metadata');
  return await generateNewsSEOMetadata(id, normalizedLocale);
}
```

## Strapi SEO數據結構

系統期望Strapi API返回的數據包含以下SEO字段：

```javascript
{
  seo: {
    id: 172,
    metaTitle: "頁面標題",
    metaDescription: "頁面描述",
    metaKeywords: "關鍵詞1,關鍵詞2,關鍵詞3",
    shareImage: {
      url: "/uploads/image.jpg"
    },
    canonicalUrl: "https://example.com/page"
  }
}
```

## 支持的字段

- `metaTitle` / `meta_title` / `title`: 頁面標題
- `metaDescription` / `meta_description` / `description`: 頁面描述
- `metaKeywords` / `meta_keywords` / `keywords`: 關鍵詞
- `shareImage` / `share_image` / `image`: 分享圖片
- `canonicalUrl` / `canonical_url` / `url`: 規範URL

## 錯誤處理

系統包含完整的錯誤處理機制：

1. **API請求失敗**: 返回默認SEO數據
2. **數據格式錯誤**: 使用後備數據
3. **缺少SEO字段**: 使用頁面標題和內容生成SEO數據

## 多語言支持

系統自動處理多語言SEO：

- 英文 (en)
- 繁體中文 (zh-Hant-HK)
- 自動映射語言代碼

## 性能優化

- 使用動態導入減少初始包大小
- 並行API請求提高加載速度
- 緩存機制減少重複請求

## 測試

構建測試已通過，所有頁面的SEO元數據都能正確生成。

## 注意事項

1. 確保Strapi API返回的數據包含SEO字段
2. 圖片URL需要是完整的URL或相對於Strapi的URL
3. 標題會自動添加網站名稱後綴
4. 描述會自動截取到合適的長度

## 已修復的問題

1. **e123長青網SEO數據問題**: 修復了成功案例頁面無法正確獲取Strapi中SEO數據的問題
2. **數據結構完整性**: 確保所有API數據都包含SEO字段
3. **統一SEO處理**: 所有頁面現在都使用統一的SEO系統

### 具體修復內容

- ✅ 更新了 `getSuccessCasesData` 函數，現在包含 `seo` 字段
- ✅ 更新了 `getDigitalSolutionsData` 函數，現在包含 `seo` 字段  
- ✅ 更新了所有成功案例頁面使用新的SEO系統：
  - e123-elderly-portal (order: 1)
  - brain-training-game (order: 2) 
  - e72-elderly-recruitment-system (order: 3)
  - coolthinkjc (order: 4)
  - i-change-gambling-counseling (order: 5)
- ✅ 更新了數碼方案頁面使用新的SEO系統：
  - ai-solution (order: 0)
  - ai-case-management-platform
  - ai-elderly-health-manager (order: 6)

## 未來改進

- [ ] 添加結構化數據支持
- [ ] 支持更多社交媒體平台
- [ ] 添加SEO分析工具
- [ ] 支持動態關鍵詞生成
