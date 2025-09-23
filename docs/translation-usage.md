# 統一翻譯系統使用指南

## 概述

我們已經建立了一個統一的翻譯管理系統，將所有多語言文字集中管理，避免在代碼中寫死中文或英文文字。

## 文件結構

```
utils/
├── translations.js     # 主要翻譯文件
└── locales.js         # 語言配置

hooks/
└── useTranslation.js  # React Hook 用於組件中獲取翻譯

components/
├── Footer.js          # 已更新使用翻譯系統
├── PromoBanner.js     # 已更新使用翻譯系統
└── LanguageSwitcher.js # 已更新使用翻譯系統
```

## 使用方法

### 1. 在組件中使用翻譯

#### 方法一：直接使用翻譯函數
```javascript
import { getTranslation, getCopyrightText } from '@/utils/translations';

export default function MyComponent({ locale = 'en' }) {
  const title = getTranslation(locale, 'common', 'aboutUs');
  const copyright = getCopyrightText(locale);
  
  return (
    <div>
      <h1>{title}</h1>
      <p>{copyright}</p>
    </div>
  );
}
```

#### 方法二：使用 useTranslation Hook（推薦用於客戶端組件）
```javascript
"use client";
import useTranslation from '@/hooks/useTranslation';

export default function MyComponent({ locale = 'en' }) {
  const { t, common, pages } = useTranslation(locale);
  
  return (
    <div>
      <h1>{common.aboutUs}</h1>
      <p>{t('common', 'copyright')}</p>
    </div>
  );
}
```

### 2. 添加新的翻譯

在 `utils/translations.js` 中添加新的翻譯：

```javascript
export const translations = {
  common: {
    en: {
      // 現有翻譯...
      newText: "New Text"
    },
    "zh-hant": {
      // 現有翻譯...
      newText: "新文字"
    }
  },
  
  // 新的分類
  newCategory: {
    en: {
      item1: "Item 1",
      item2: "Item 2"
    },
    "zh-hant": {
      item1: "項目 1",
      item2: "項目 2"
    }
  }
};
```

### 3. 特殊功能

#### 版權文字生成
```javascript
import { getCopyrightText } from '@/utils/translations';

// 使用默認參數
const copyright = getCopyrightText(locale); 
// 輸出: "I2 COMPANY LIMITED All Rights Reserved © 2006-2024"

// 自定義參數
const customCopyright = getCopyrightText(locale, 'My Company', 2020);
// 輸出: "My Company All Rights Reserved © 2020-2024"
```

## 已更新的組件

### Footer.js
- 使用 `getCopyrightText()` 生成版權文字
- 使用 `getTranslation()` 獲取導航文字

### PromoBanner.js
- 所有促銷文字都使用翻譯系統
- 支持動態語言切換

### LanguageSwitcher.js
- 語言名稱使用翻譯系統
- 支持當前語言環境下的語言名稱顯示

### AboutUs 頁面
- 標題和元數據使用翻譯系統
- 錯誤提示信息使用翻譯系統

## 最佳實踐

1. **不要寫死文字**：所有用戶可見的文字都應該使用翻譯系統
2. **使用有意義的鍵名**：如 `aboutUs`、`contactUs` 等
3. **分組管理**：將相關翻譯放在同一分類下
4. **提供後備文字**：使用 `fallback` 參數提供默認值
5. **保持一致性**：所有語言版本都應該有相同的鍵

## 語言支持

目前支持的語言：
- `en`: 英文
- `zh-hant`: 繁體中文

語言代碼會自動標準化，支持以下變體：
- `zh` → `zh-hant`
- `zh-Hant` → `zh-hant`
- `zh-hant` → `zh-hant`

## 擴展指南

要添加新語言：

1. 在 `utils/locales.js` 中添加語言代碼
2. 在 `utils/translations.js` 中為所有分類添加新語言翻譯
3. 更新 `normalizeLocale()` 函數處理新語言代碼
4. 測試所有組件在新語言下的顯示效果
