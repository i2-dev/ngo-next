# 预览功能使用指南

## 概述

本项目实现了完整的Strapi内容预览功能，支持多种预览方式和内容类型。

## 功能特性

- ✅ **多种预览格式支持**：Strapi标准格式、简化格式、直接访问
- ✅ **实时数据获取**：从Strapi API获取最新的预览数据
- ✅ **预览横幅**：显示预览状态和相关信息
- ✅ **错误处理**：完善的错误提示和处理机制
- ✅ **响应式设计**：适配各种设备尺寸
- ✅ **多语言支持**：支持en、zh、hk、tc等语言

## 预览方式

### 1. Strapi标准预览格式

当从Strapi接收到以下格式的预览请求时：

```
http://192.168.15.200:3000/api/preview?secret=efee254c6a8b119e65057678ffa7cf8b2e701d83407596eb813d187c2959c087&slug=y529m3uaz2v9rknwy21lg373&uid=api::about-us.about-us&status=draft&documentId=y529m3uaz2v9rknwy21lg373&locale=en
```

系统会自动：
1. 验证secret参数
2. 识别内容类型（about-us）
3. 重定向到对应的预览页面

### 2. 简化预览格式

使用简化的URL格式：

```
http://192.168.15.200:3000/api/preview-simple?page=aboutus&locale=en&status=draft
```

### 3. 直接预览访问

直接访问预览页面：

```
http://192.168.15.200:3000/preview/about-us?status=draft&locale=en
```

## API端点

### 预览API路由

- **`/api/preview`** - 处理Strapi标准预览请求
- **`/api/preview-simple`** - 处理简化预览请求

### 预览页面

- **`/preview/about-us`** - 关于我们页面预览
- **`/preview/contact-us`** - 联系我们页面预览（待实现）
- **`/preview/homepage`** - 首页预览（待实现）

## 数据获取

### Strapi API端点

预览功能从以下Strapi API获取数据：

```
http://strapi2-dev.dev.i2hk.net/api/about-us?status=draft
```

### 数据格式

返回的数据格式示例：

```json
{
  "data": {
    "id": 1,
    "documentId": "y529m3uaz2v9rknwy21lg373",
    "Title": "關於我們123456",
    "RightContent": "<h2>展延NGO: 擴「展」關懷、「延」續服務</h2>...",
    "LeftImage": [...],
    "OurClients": [...],
    "createdAt": "2025-07-30T07:28:45.407Z",
    "updatedAt": "2025-08-20T09:23:27.894Z",
    "publishedAt": null,
    "locale": "en"
  },
  "meta": {}
}
```

## 组件结构

### 核心组件

1. **`PreviewWrapper`** - 通用预览包装组件
   - 显示预览横幅
   - 处理加载状态
   - 错误处理
   - 自动隐藏功能

2. **`AboutUsPreview`** - 关于我们预览页面
   - 获取和显示关于我们数据
   - 渲染页面内容
   - 显示预览信息

### 工具函数

1. **`preview-data-fetcher.js`** - 预览数据获取工具
   - `fetchPreviewData()` - 从Strapi获取预览数据
   - `getPreviewData()` - 获取特定内容类型数据
   - `validatePreviewParams()` - 验证预览参数
   - `formatPreviewData()` - 格式化预览数据

## 使用方法

### 1. 在Strapi中配置预览URL

在Strapi管理面板中，为about-us内容类型配置预览URL：

```
http://192.168.15.200:3000/api/preview?secret=efee254c6a8b119e65057678ffa7cf8b2e701d83407596eb813d187c2959c087&slug={{documentId}}&uid=api::about-us.about-us&status=draft&documentId={{documentId}}&locale={{locale}}
```

### 2. 测试预览功能

访问测试页面：

```
http://192.168.15.200:3000/test-preview
```

### 3. 直接访问预览

```
http://192.168.15.200:3000/preview/about-us?status=draft&locale=en
```

## 配置说明

### 环境变量

```bash
# 预览密钥（可选）
PREVIEW_SECRET=efee254c6a8b119e65057678ffa7cf8b2e701d83407596eb813d187c2959c087

# Strapi API Token（可选）
STRAPI_API_TOKEN=your_strapi_api_token_here
```

### Strapi配置

在Strapi的`config/plugins.js`中配置预览按钮：

```javascript
module.exports = {
  'preview-button': {
    config: {
      contentTypes: [
        {
          uid: 'api::about-us.about-us',
          draft: {
            url: 'http://192.168.15.200:3000/api/preview?secret=efee254c6a8b119e65057678ffa7cf8b2e701d83407596eb813d187c2959c087&slug={{documentId}}&uid=api::about-us.about-us&status=draft&documentId={{documentId}}&locale={{locale}}',
          },
          published: {
            url: 'http://192.168.15.200:3000/{{locale}}/aboutus',
          },
        },
      ],
    },
  },
};
```

## 扩展其他内容类型

要添加其他内容类型的预览支持：

1. **创建预览页面**：在`app/preview/`目录下创建对应的预览页面
2. **更新数据获取工具**：在`preview-data-fetcher.js`中添加新的内容类型映射
3. **更新API路由**：在`/api/preview`和`/api/preview-simple`中添加新的内容类型处理

### 示例：添加联系我们预览

1. 创建`app/preview/contact-us/page.js`
2. 在`preview-data-fetcher.js`中添加contact-us映射
3. 更新API路由处理contact-us内容类型

## 故障排除

### 常见问题

1. **预览数据加载失败**
   - 检查Strapi API是否可访问
   - 确认API端点正确
   - 检查网络连接

2. **预览页面显示错误**
   - 检查URL参数是否正确
   - 确认内容类型映射正确
   - 查看浏览器控制台错误信息

3. **预览横幅不显示**
   - 检查PreviewWrapper组件是否正确导入
   - 确认CSS样式正确加载

### 调试方法

1. **查看网络请求**：在浏览器开发者工具中查看API请求
2. **检查控制台**：查看JavaScript错误信息
3. **测试API端点**：直接访问Strapi API验证数据
4. **使用测试页面**：访问`/test-preview`进行功能测试

## 更新日志

### v1.0.1 (2025-01-27)
- 🔧 修复重定向URL问题，确保使用正确的外部URL而不是localhost
- 🔧 更新预览数据获取工具，使用pLevel=5参数
- ✅ 改进URL处理逻辑

### v1.0.0 (2025-01-27)
- ✅ 实现基础预览功能
- ✅ 支持关于我们页面预览
- ✅ 创建通用预览组件
- ✅ 实现多种预览格式支持
- ✅ 添加错误处理和加载状态
- ✅ 创建测试页面和文档

## 技术支持

如有问题或需要帮助，请：

1. 查看本文档的故障排除部分
2. 访问测试页面进行功能验证
3. 检查浏览器控制台错误信息
4. 联系开发团队获取支持
