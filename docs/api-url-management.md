# API URL 統一管理

## 概述

為了方便管理 Strapi API 的 URL，我們已經建立了一個統一的配置系統。現在您只需要修改一個地方，就能更新所有 preview 頁面的 API URL。

## 配置位置

### 主要配置文件
- `config/api-config.js` - 主要的 API 配置文件
- `utils/get-strapi-url.js` - 舊版工具函數（已標記為 deprecated）

### 環境變數
您可以在 `.env.local` 文件中設置：
```bash
NEXT_PUBLIC_STRAPI_URL=http://your-new-strapi-url.com
```

## 使用方法

### 1. 修改 API 基礎 URL

#### 方法一：通過環境變數（推薦）
在 `.env.local` 文件中設置：
```bash
NEXT_PUBLIC_STRAPI_URL=http://your-new-strapi-url.com
```

#### 方法二：直接修改配置文件
在 `config/api-config.js` 中修改：
```javascript
export const STRAPI_CONFIG = {
  BASE_URL: "http://your-new-strapi-url.com",
  // ... 其他配置
};
```

### 2. 在代碼中使用

#### 構建預覽 API URL
```javascript
import { buildPreviewApiUrl } from '@/config/api-config';

// 基本用法
const apiUrl = buildPreviewApiUrl('informations', documentId, { 
  status: 'draft', 
  pLevel: 5 
});

// 帶額外參數
const apiUrl = buildPreviewApiUrl('plans', documentId, {
  status: 'draft',
  pLevel: 5,
  locale: 'en',
  'populate[0]': 'icon',
  'populate[1]': 'Image'
});
```

#### 獲取 Strapi API URL
```javascript
import { getStrapiApiUrl } from '@/config/api-config';

const apiUrl = getStrapiApiUrl('/informations');
```

## 已更新的文件

以下 preview 頁面已經更新為使用新的配置系統：

- ✅ `app/preview/ngo-latest-news/[id]/page.js`
- ✅ `app/preview/ai-hotline-system/page.js`
- ✅ `app/preview/ai-workflow-transformation-solutions/page.js`
- ✅ `app/preview/ai-solution/page.js`
- ✅ `app/preview/institutional-online-learning-system/page.js`
- ✅ `app/preview/ai-case-management-platform/page.js`
- ✅ `app/preview/ngo-digital-solutions-2/page.js`

## 配置選項

### STRAPI_CONFIG
```javascript
export const STRAPI_CONFIG = {
  BASE_URL: "http://strapi2-dev.dev.i2hk.net",  // 基礎 URL
  API_VERSION: "api",                           // API 版本
  DEFAULT_P_LEVEL: 5,                           // 預設數據填充級別
  DEFAULT_STATUS: "draft",                      // 預設狀態
  DEFAULT_LOCALE: "en",                         // 預設語言
};
```

### 內容類型映射
```javascript
export const CONTENT_TYPE_MAPPING = {
  'about-us': 'about-us',
  'contact-us': 'contact-us',
  'homepage': 'homepage',
  'informations': 'informations',
  'services-page': 'services-page',
  'plans': 'plans',
  'plan': 'plans',
  'successfuls': 'successfuls'
};
```

## 遷移指南

如果您有新的 preview 頁面需要添加，請：

1. 導入配置函數：
```javascript
import { buildPreviewApiUrl } from '@/config/api-config';
```

2. 使用 `buildPreviewApiUrl` 替代硬編碼的 URL：
```javascript
// 舊方式
const apiUrl = `http://strapi2-dev.dev.i2hk.net/api/plans/${documentId}?status=${status}&pLevel=${pLevel}`;

// 新方式
const apiUrl = buildPreviewApiUrl('plans', documentId, { status, pLevel });
```

## 注意事項

1. 舊的 `utils/get-strapi-url.js` 文件仍然可用，但已標記為 deprecated
2. 建議新代碼使用 `config/api-config.js` 中的函數
3. 環境變數 `NEXT_PUBLIC_STRAPI_URL` 會覆蓋配置文件中的預設值
4. 修改配置後需要重新啟動開發服務器

## 故障排除

如果遇到問題：

1. 檢查環境變數是否正確設置
2. 確認配置文件中的 URL 格式正確
3. 重新啟動開發服務器
4. 檢查瀏覽器控制台是否有錯誤信息
