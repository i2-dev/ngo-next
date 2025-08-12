# Strapi API 設置指南

## 🎯 需要創建的 API 端點

根據按需加載系統的配置，需要在 Strapi 後端創建以下 API：

### 1. About Page API (關於我們頁面)
- **API 名稱**: `about-page`
- **端點**: `/api/about-page`
- **用途**: 關於我們頁面的內容管理

#### 字段結構建議：
```javascript
{
  "Title": "Text", // 頁面標題
  "Content": "Rich Text", // 主要內容
  "Mission": "Rich Text", // 我們的使命
  "Services": "Rich Text", // 我們的服務
  "Vision": "Text", // 願景
  "Values": "Component (repeatable)", // 價值觀列表
  "TeamMembers": "Component (repeatable)", // 團隊成員
  "Image": "Media", // 頁面主圖
  "SEO": "Component" // SEO 設置
}
```

### 2. Contact Page API (聯絡我們頁面)
- **API 名稱**: `contact-page`
- **端點**: `/api/contact-page`
- **用途**: 聯絡我們頁面的內容管理

#### 字段結構建議：
```javascript
{
  "Title": "Text", // 頁面標題
  "Description": "Rich Text", // 頁面描述
  "ContactInfo": "Component", // 聯絡信息
  "OfficeHours": "Component", // 辦公時間
  "SocialMedia": "Component (repeatable)", // 社交媒體鏈接
  "ContactForm": "Component", // 聯絡表單配置
  "Map": "Component", // 地圖設置
  "SEO": "Component" // SEO 設置
}
```

### 3. Services Page API (服務頁面)
- **API 名稱**: `services-page`
- **端點**: `/api/services-page`
- **用途**: 服務頁面的內容管理

#### 字段結構建議：
```javascript
{
  "Title": "Text", // 頁面標題
  "Introduction": "Rich Text", // 服務介紹
  "Services": "Component (repeatable)", // 服務列表
  "Features": "Component (repeatable)", // 特色功能
  "Pricing": "Component", // 價格信息
  "Testimonials": "Component (repeatable)", // 客戶評價
  "CallToAction": "Component", // 行動呼籲
  "SEO": "Component" // SEO 設置
}
```

## 🔧 在 Strapi 中創建 API 的步驟

### 步驟 1: 登入 Strapi 管理面板
```bash
# 訪問您的 Strapi 管理面板
http://your-strapi-url:1337/admin
```

### 步驟 2: 創建 Content Types

#### 創建 About Page
1. 在左側菜單選擇 "Content-Types Builder"
2. 點擊 "Create new collection type"
3. 輸入名稱: `about-page`
4. 選擇 "Single Type" (因為只有一個關於我們頁面)
5. 添加以下字段：

```
- Title (Text)
- Content (Rich Text)
- Mission (Rich Text)  
- Services (Rich Text)
- Vision (Text)
- Image (Media - Single)
- SEO (Component - 如果已創建SEO組件)
```

#### 創建 Contact Page
1. 創建新的 Single Type: `contact-page`
2. 添加字段：

```
- Title (Text)
- Description (Rich Text)
- Email (Email)
- Phone (Text)
- Address (Text)
- OfficeHours (Text)
- ContactFormTitle (Text)
- MapEmbedCode (Text)
- SEO (Component)
```

#### 創建 Services Page
1. 創建新的 Single Type: `services-page`
2. 添加字段：

```
- Title (Text)
- Introduction (Rich Text)
- ServicesTitle (Text)
- ServicesDescription (Rich Text)
- FeaturesTitle (Text)
- CallToActionTitle (Text)
- CallToActionDescription (Rich Text)
- CallToActionButton (Component)
- SEO (Component)
```

### 步驟 3: 設置權限
1. 前往 "Settings" > "Users & Permissions plugin" > "Roles"
2. 選擇 "Public" 角色
3. 為新創建的 API 啟用 `find` 權限：
   - ✅ about-page: find
   - ✅ contact-page: find 
   - ✅ services-page: find

### 步驟 4: 添加內容
在 "Content Manager" 中為每個頁面添加內容。

## 🧪 測試 API

創建完成後，可以通過以下 URL 測試 API：

```bash
# 關於我們頁面
GET /api/about-page?populate=*

# 聯絡我們頁面  
GET /api/contact-page?populate=*

# 服務頁面
GET /api/services-page?populate=*
```

## 📝 更新前端代碼

API 創建完成後，前端代碼已經配置好，會自動使用這些 API。確保以下文件中的配置正確：

### `/data/api-config.js`
```javascript
// 已配置的API端點
'about-page': {
  endpoint: 'about-page',
  populateLevel: 4,
  description: '關於我們頁面內容'
},

'contact-page': {
  endpoint: 'contact-page', 
  populateLevel: 3,
  description: '聯絡我們頁面內容'
},

'services-page': {
  endpoint: 'services-page',
  populateLevel: 4, 
  description: '服務頁面內容'
}
```

## 🎨 組件化建議

為了更好的內容管理，建議創建以下可重用組件：

### SEO Component
```javascript
{
  "metaTitle": "Text",
  "metaDescription": "Text", 
  "keywords": "Text",
  "ogImage": "Media"
}
```

### Button Component  
```javascript
{
  "text": "Text",
  "url": "Text",
  "style": "Enumeration (primary, secondary, outline)",
  "target": "Enumeration (_self, _blank)"
}
```

### Contact Info Component
```javascript
{
  "email": "Email",
  "phone": "Text", 
  "address": "Text",
  "workingHours": "Text"
}
```

### Service Item Component
```javascript
{
  "title": "Text",
  "description": "Rich Text",
  "icon": "Media",
  "features": "Text (repeatable)",
  "price": "Text"
}
```

## 🚀 完成後的效果

API 創建完成後，您的系統將實現：

1. ✅ 真正的按需加載 - 每個頁面只加載所需的 API
2. ✅ 統一的內容管理 - 通過 Strapi 管理所有頁面內容  
3. ✅ 優化的性能 - 減少不必要的 API 調用
4. ✅ 靈活的內容結構 - 支持多語言和動態內容

## 🔍 故障排除

如果遇到問題：

1. **404 錯誤**: 檢查 API 名稱是否正確，權限是否設置
2. **權限錯誤**: 確保 Public 角色有 find 權限
3. **數據為空**: 檢查 Content Manager 中是否已添加內容
4. **Populate 問題**: 確保使用 `?populate=*` 獲取關聯數據

---

**注意**: 創建這些 API 後，重啟前端應用以確保新配置生效。
