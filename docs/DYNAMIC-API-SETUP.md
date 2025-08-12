# 🚀 動態 API 架構說明

## 📋 現在的 API 架構

### ✅ 已實現的動態 API

您的要求已經完成！現在所有的 API 都會先嘗試從 Strapi 獲取真實數據，如果 Strapi 沒有數據才使用後備數據。

### 🎯 API 端點對應

| 頁面 | API 端點 | Strapi 端點 | 說明 |
|------|----------|-------------|------|
| 首頁 | `/api/homepage` | `homepage` | 已有真實數據 |
| 關於我們 | `/api/about-us` | `about-page` | 動態連接 Strapi |
| 聯絡我們 | `/api/contact-us` | `contact-us` | 動態連接 Strapi |
| 新聞 | `/api/news` | `informations` | 已有真實數據 |
| 菜單 | `/api/menus` | `menus` | 已有真實數據 |

### 🔧 API 工作流程

每個 API 現在都遵循這個流程：

```javascript
1. 接收請求參數 (locale, pLevel)
   ↓
2. 嘗試從 Strapi 獲取真實數據
   ↓
3. 如果成功 → 返回 Strapi 數據 (X-Data-Source: strapi)
   ↓
4. 如果失敗 → 返回後備數據 (X-Data-Source: fallback)
```

### 📊 按需加載實現

#### 當用戶點擊首頁：
```
✅ API: /api/homepage?locale=zh&pLevel=6 (從 Strapi)
✅ API: /api/menus?locale=zh&pLevel=3 (從 Strapi)
```

#### 當用戶點擊關於我們：
```
✅ API: /api/menus?locale=zh&pLevel=3 (從快取或 Strapi)
✅ API: /api/about-us?locale=zh&pLevel=4 (嘗試 Strapi → about-page)
```

#### 當用戶點擊聯絡我們：
```
✅ API: /api/menus?locale=zh&pLevel=3 (從快取或 Strapi)  
✅ API: /api/contact-us?locale=zh&pLevel=3 (嘗試 Strapi → contact-us)
```

### 🛠️ Strapi 配置需求

要讓 API 正常工作，請在您的 Strapi 中創建這些 Content Types：

#### 1. about-page (Single Type)
```javascript
{
  "Title": "Text",
  "Content": "Rich Text", 
  "Mission": "Rich Text",
  "Services": "Rich Text",
  "Vision": "Text"
}
```

#### 2. contact-us (Single Type)  
```javascript
{
  "Title": "Text",
  "Description": "Rich Text",
  "Email": "Email",
  "Phone": "Text", 
  "Address": "Text",
  "OfficeHours": "Text",
  "Services": "JSON"
}
```

### 🎨 API 特色

#### ✅ 智能後備機制
- Strapi 有資料 → 使用真實資料
- Strapi 無資料 → 使用精美的後備資料
- 用戶永遠看到內容，不會出現空白頁

#### 🚀 性能優化
- 30分鐘快取 (Strapi 資料)
- 5分鐘快取 (後備資料)
- 響應頭標示資料來源

#### 🔍 開發友好
- 開發環境顯示資料來源提示
- 詳細的 console 日誌
- X-Data-Source 標頭方便調試

### 📝 使用範例

#### 測試 Contact Us API：
```bash
curl "http://localhost:3000/api/contact-us?locale=zh&pLevel=3"
```

#### 檢查資料來源：
```bash
curl -I "http://localhost:3000/api/about-us?locale=zh"
# 檢查 X-Data-Source: strapi 或 fallback
```

### 🎯 頁面組件使用

頁面組件現在會自動：
1. 檢測 API 資料是否為後備資料
2. 在開發環境顯示警告提示  
3. 優雅地處理真實和後備資料

```javascript
// 頁面會自動處理
const aboutPageData = pageData['about-us'];
const isPlaceholder = aboutPageData?.meta?.isPlaceholder;

// 開發環境會顯示：
// ⚠️ 開發提示：使用後備數據，about-us API 尚未可用
```

### 🚀 立即可用

系統現在完全按您的要求工作：

1. ✅ **按需加載** - 點到哪個頁面才獲取哪個 API
2. ✅ **動態連接** - API 不會寫死，會嘗試從 Strapi 獲取
3. ✅ **優雅降級** - Strapi 沒資料時使用美觀的後備內容
4. ✅ **性能優化** - 智能快取和並行加載
5. ✅ **開發友好** - 清楚的狀態提示和日誌

當您在 Strapi 中添加了 `about-page` 和 `contact-us` 的 Content Types 後，API 會自動使用真實資料！🎉
