# 🚀 緩存管理指南

## 問題說明
目前 API 有多層緩存機制導致數據無法即時更新：

1. **HTTP 響應緩存**: 10-30分鐘
2. **應用層緩存**: 10-30分鐘  
3. **頁面級緩存**: 10-30分鐘

## 💡 解決方案

### 1. 開發模式自動禁用緩存
在 `NODE_ENV=development` 環境下，緩存會自動設為1秒，幾乎等同於禁用。

### 2. 手動清除緩存

#### 方法1: 使用 API 端點
```bash
# 清除所有緩存
curl -X DELETE http://localhost:3000/api/cache

# 清除特定類型緩存
curl -X DELETE "http://localhost:3000/api/cache?type=news"
curl -X DELETE "http://localhost:3000/api/cache?type=homepage"
curl -X DELETE "http://localhost:3000/api/cache?type=menu"
curl -X DELETE "http://localhost:3000/api/cache?type=pages"

# 查看緩存狀態
curl http://localhost:3000/api/cache
```

#### 方法2: 使用快速腳本
```bash
# 清除所有緩存
node scripts/clear-cache.js

# 清除特定類型
node scripts/clear-cache.js news
node scripts/clear-cache.js homepage
```

### 3. 瀏覽器端清除緩存

在瀏覽器控制台執行：
```javascript
// 清除所有緩存
fetch('/api/cache', { method: 'DELETE' })
  .then(res => res.json())
  .then(data => console.log(data));

// 清除新聞緩存
fetch('/api/cache?type=news', { method: 'DELETE' })
  .then(res => res.json())
  .then(data => console.log(data));
```

## 🔧 緩存配置詳情

### 當前緩存時間設定：
- **Homepage**: 15分鐘
- **Menu**: 30分鐘  
- **News**: 10分鐘
- **About-us**: 30分鐘
- **Digital Solutions**: 30分鐘

### 開發模式設定：
- **緩存時間**: 1秒 (幾乎即時)
- **HTTP 緩存**: 完全禁用 (`no-cache`)

## 🛠️ 常用命令

```bash
# 開發時推薦：設置為開發模式
export NODE_ENV=development

# 清除緩存後重啟開發服務器
node scripts/clear-cache.js && npm run dev

# 檢查當前緩存狀態
curl http://localhost:3000/api/cache | jq '.'
```

## 📋 故障排除

### 問題: 數據還是沒有更新
1. 確認 `NODE_ENV=development`
2. 清除所有緩存: `node scripts/clear-cache.js`
3. 硬刷新瀏覽器: `Ctrl+Shift+R` (Chrome) 或 `Cmd+Shift+R` (Mac)
4. 清除瀏覽器緩存

### 問題: API 錯誤
檢查 Next.js 開發服務器是否正在運行：
```bash
npm run dev
```

### 問題: 生產環境意外禁用緩存
確認環境變量設置：
```bash
echo $NODE_ENV
# 應該顯示 "production" 而不是 "development"
```

## 🎯 最佳實踐

1. **開發時**: 使用 `NODE_ENV=development` 
2. **測試時**: 手動清除特定緩存
3. **生產時**: 保持緩存啟用以提升性能
4. **數據更新後**: 立即清除相關緩存

## 🔍 緩存監控

查看緩存狀態和統計：
```bash
curl http://localhost:3000/api/cache | jq '.data'
```

輸出示例：
```json
{
  "homepage": { "size": 2, "keys": ["homepage_en", "homepage_zh"] },
  "menu": { "size": 1, "keys": ["menu_en"] },
  "news": { "size": 5, "keys": ["news_en_1", "news_zh_1"] },
  "pages": { "size": 10, "keys": ["homepage_en", "about_zh"] }
}
```
