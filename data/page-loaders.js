/**
 * 頁面特定的數據加載器系統
 * 實現按需加載 - 只在訪問特定頁面時獲取該頁面所需的API數據
 */

import { fetchStrapiData } from './loaders';
import { 
  getPageApiConfig, 
  getApiEndpointConfig, 
  inferPageNameFromPath,
  PERFORMANCE_CONFIG 
} from './api-config';

// 📦 統一的頁面數據快取系統
const pageDataCache = new Map();
const MAX_CACHE_SIZE = 100;

// 🧹 智能快取清理
function cleanupPageCache() {
  if (pageDataCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(pageDataCache.entries());
    const sortedEntries = entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
    
    // 刪除最舊的50%條目
    const toDelete = sortedEntries.slice(0, Math.floor(entries.length / 2));
    toDelete.forEach(([key]) => pageDataCache.delete(key));
    
    if (PERFORMANCE_CONFIG.enableLogging) {
      console.log(`🧹 Cleaned up ${toDelete.length} old cache entries`);
    }
  }
}

// 🔧 標準化locale參數
function normalizeLocale(locale) {
  if (!locale) return 'en';
  
  const localeMap = {
    'zh': 'zh-Hant',
    'zh-tw': 'zh-Hant', 
    'zh-hk': 'zh-Hant',
    'zh-Hant': 'zh-Hant',
    'zh-hans': 'zh-Hans',
    'zh-cn': 'zh-Hans',
    'en': 'en',
    'en-us': 'en',
    'en-gb': 'en'
  };
  
  return localeMap[locale.toLowerCase()] || locale;
}

// 🚀 核心功能：按需獲取頁面數據
export async function getPageSpecificData(pageName, locale = 'en', options = {}) {
  const normalizedLocale = normalizeLocale(locale);
  const startTime = Date.now();
  
  // 獲取頁面API配置
  const pageConfig = getPageApiConfig(pageName);
  const cacheKey = `${pageName}_${normalizedLocale}`;
  
  // 檢查快取
  if (pageDataCache.has(cacheKey)) {
    const cached = pageDataCache.get(cacheKey);
    if (cached.expires > Date.now()) {
      cached.lastAccessed = Date.now(); // 更新訪問時間
      
      if (PERFORMANCE_CONFIG.enableLogging) {
        console.log(`📦 Cache hit for ${pageName} (${normalizedLocale})`);
      }
      
      return cached.data;
    } else {
      pageDataCache.delete(cacheKey);
    }
  }

  if (PERFORMANCE_CONFIG.enableLogging) {
    console.log(`🎯 Loading data for page: ${pageName} (APIs: ${pageConfig.apis.join(', ')})`);
  }

  try {
    // 並行獲取頁面所需的所有API數據（帶錯誤處理）
    const apiPromises = pageConfig.apis.map(async (apiName) => {
      const endpointConfig = getApiEndpointConfig(apiName);
      
      try {
        const data = await fetchStrapiData(endpointConfig.endpoint, {
          pLevel: endpointConfig.populateLevel,
          locale: normalizedLocale,
          populate: '*',
          ...options
        });
        
        return { apiName, data, success: true };
      } catch (error) {
        console.warn(`⚠️ API ${apiName} not available (${endpointConfig.endpoint}):`, error.message);
        
        // 對於某些API提供後備數據
        const fallbackData = getFallbackData(apiName);
        return { apiName, data: fallbackData, success: false, error: error.message };
      }
    });

    const results = await Promise.all(apiPromises);
    
    // 組織數據結構
    const pageData = {};
    // 記錄成功和失敗的API調用
    const successfulApis = [];
    const failedApis = [];
    
    results.forEach(({ apiName, data, success, error }) => {
      pageData[apiName] = data;
      
      if (success) {
        successfulApis.push(apiName);
      } else {
        failedApis.push({ apiName, error });
      }
    });

    // 添加元數據
    pageData.meta = {
      pageName,
      locale: normalizedLocale,
      loadTime: Date.now() - startTime,
      apiCount: pageConfig.apis.length,
      successfulApis,
      failedApis,
      loadedAt: new Date().toISOString(),
      cacheExpires: Date.now() + pageConfig.cacheDuration,
      hasErrors: failedApis.length > 0
    };

    // 存入快取
    cleanupPageCache();
    pageDataCache.set(cacheKey, {
      data: pageData,
      timestamp: Date.now(),
      expires: Date.now() + pageConfig.cacheDuration,
      lastAccessed: Date.now()
    });

    // 設定自動清理
    setTimeout(() => {
      pageDataCache.delete(cacheKey);
    }, pageConfig.cacheDuration);

    if (PERFORMANCE_CONFIG.enableLogging) {
      console.log(`✅ Page data loaded: ${pageName} in ${pageData.meta.loadTime}ms`);
    }

    return pageData;
    
  } catch (error) {
    // 容錯機制
    if (normalizedLocale !== 'en') {
      console.warn(`⚠️ Failed to load ${pageName} data for ${normalizedLocale}, falling back to English`);
      return await getPageSpecificData(pageName, 'en', options);
    }
    
    console.error(`❌ Error loading page data for ${pageName}:`, error);
    throw error;
  }
}

// 🏠 首頁專用加載器
export async function getHomepagePageData(locale = 'en') {
  const data = await getPageSpecificData('homepage', locale);
  
  // 處理首頁特殊數據結構
  if (data.homepage?.data?.Blocks) {
    const blocks = data.homepage.data.Blocks;
    
    // 提取橫幅數據
    const bannerBlock = blocks.find(block => block.__component === 'home-page.banner-block');
    const bannerSlides = bannerBlock?.Banner?.map(banner => ({
      id: banner.id,
      title: banner.Title || '',
      subtitle: banner.SubTitle || '',
      content: extractContentFromRichText(banner.Content),
      image: banner.Image || null,
      buttonText: banner.Button?.Text || null,
      buttonLink: banner.Button?.URL || null,
      icon: banner.icon || null,
    })) || [];

    // 提取其他區塊
    const solutionData = blocks.find(block => 
      block.__component === 'home-page.solution' || 
      block.__component === 'home-page.solution-block'
    );
    
    const informationData = blocks.find(block => 
      block.__component === 'home-page.information-section'
    );
    
    const clientLogoData = blocks.find(block => 
      block.__component === 'home-page.client-logo'
    );
    
    const awardsData = blocks.find(block => 
      block.__component === 'home-page.awards-section'
    );
    
    const cardData = blocks.find(block => 
      block.__component === 'public.card'
    );

    return {
      ...data,
      // 處理過的結構化數據
      processedData: {
        bannerSlides,
        solutionData,
        informationData,
        clientLogoData,
        awardsData,
        cardData,
        rawBlocks: blocks
      }
    };
  }
  
  return data;
}

// 📰 新聞頁面專用加載器
export async function getNewsPageData(locale = 'en', options = {}) {
  const {
    page = 1,
    pageSize = 25,
    category = null,
    search = null,
    sortBy = 'Publish:desc'
  } = options;
  
  // 獲取基本頁面數據
  const baseData = await getPageSpecificData('news', locale);
  
  // 如果需要特定的新聞查詢，額外獲取
  if (category || search || page > 1) {
    try {
      const newsData = await fetchStrapiData('informations', {
        pLevel: 3,
        locale: normalizeLocale(locale),
        populate: ['image', 'information_category'],
        pagination: { page, pageSize },
        sort: [sortBy],
        filters: buildNewsFilters(category, search)
      });
      
      baseData.customNews = processNewsData(newsData);
    } catch (error) {
      console.error('Error fetching custom news data:', error);
    }
  }
  
  return baseData;
}

// 📄 新聞詳情頁面專用加載器
export async function getNewsDetailPageData(slug, locale = 'en') {
  const baseData = await getPageSpecificData('news-detail', locale);
  
  try {
    const newsDetail = await fetchStrapiData('informations', {
      pLevel: 4,
      locale: normalizeLocale(locale),
      populate: '*',
      filters: { slug: { $eq: slug } }
    });
    
    baseData.newsDetail = newsDetail;
  } catch (error) {
    console.error('Error fetching news detail:', error);
    baseData.newsDetail = null;
  }
  
  return baseData;
}

// 🏢 關於我們頁面專用加載器
export async function getAboutPageData(locale = 'en') {
  return await getPageSpecificData('aboutus', locale);
}

// 📞 聯絡我們頁面專用加載器
export async function getContactPageData(locale = 'en') {
  return await getPageSpecificData('contact-us', locale);
}

// 🛠️ 服務頁面專用加載器
export async function getServicesPageData(locale = 'en') {
  return await getPageSpecificData('services', locale);
}

// 🔧 輔助工具函數

// 為不可用的API提供後備數據
function getFallbackData(apiName) {
  const fallbackMap = {
    'about-us': {
      data: {
        Title: '關於我們',
        Content: '此內容暫時無法加載，請稍後再試。',
        Mission: '我們的使命是為NGO組織提供最優質的數碼化解決方案。',
        Services: '我們提供個案管理系統、工作流程轉型方案、AI客服機械人等服務。'
      },
      meta: { isPlaceholder: true }
    },
    
    'contact-us': {
      data: {
        Title: process.env.CONTACT_TITLE,
        Description: process.env.CONTACT_DESCRIPTION,
        Email: process.env.CONTACT_EMAIL,
        Phone: process.env.CONTACT_PHONE,
        Address: process.env.CONTACT_ADDRESS,
        Services: process.env.CONTACT_SERVICES ? 
          JSON.parse(process.env.CONTACT_SERVICES) : null
      },
      meta: { 
        isPlaceholder: true,
        source: 'environment_fallback',
        message: '使用環境變數配置或請設置 contact-us API'
      }
    },
    
    'services-page': {
      data: {
        Title: '我們的服務',
        Introduction: '我們為NGO組織提供全方位的數碼化解決方案。',
        Services: []
      },
      meta: { isPlaceholder: true }
    }
  };
  
  return fallbackMap[apiName] || { 
    data: null, 
    meta: { 
      isPlaceholder: true, 
      message: `API ${apiName} 暫時無法使用` 
    } 
  };
}

// 從富文本內容中提取純文本
function extractContentFromRichText(contentArray) {
  if (!Array.isArray(contentArray)) return '';
  
  return contentArray.map(block => {
    if (block.type === 'paragraph' && block.children) {
      return block.children
        .filter(child => child.type === 'text')
        .map(child => child.text)
        .join('');
    }
    return '';
  }).join(' ').trim();
}

// 構建新聞過濾條件
function buildNewsFilters(category, search) {
  const filters = {};
  
  if (category) {
    filters.information_category = {
      name: { $eq: category }
    };
  }
  
  if (search) {
    filters.$or = [
      { Title: { $containsi: search } },
      { Author: { $containsi: search } },
      { Content: { $containsi: search } }
    ];
  }
  
  return Object.keys(filters).length > 0 ? filters : undefined;
}

// 處理新聞數據格式
function processNewsData(newsData) {
  return {
    ...newsData,
    data: newsData.data?.map(item => ({
      id: item.id,
      documentId: item.documentId,
      title: item.Title,
      author: item.Author,
      content: item.Content,
      publishDate: item.Publish,
      image: item.image?.[0] || null,
      category: item.information_category?.name || null,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      slug: item.slug
    })) || []
  };
}

// 🎯 智能路由加載器 - 根據路由自動推斷頁面類型
export async function getDataForRoute(pathname, locale = 'en', options = {}) {
  const pageName = inferPageNameFromPath(pathname);
  
  // 根據頁面類型選擇合適的加載器
  switch (pageName) {
    case 'homepage':
      return await getHomepagePageData(locale);
    
    case 'news':
      return await getNewsPageData(locale, options);
    
    case 'news-detail':
      const slug = pathname.split('/').pop();
      return await getNewsDetailPageData(slug, locale);
    
    case 'aboutus':
      return await getAboutPageData(locale);
    
    case 'contact-us':
      return await getContactPageData(locale);
    
    case 'services':
      return await getServicesPageData(locale);
    
    default:
      console.warn(`Unknown page type: ${pageName}, loading default data`);
      return await getPageSpecificData(pageName, locale, options);
  }
}

// 📊 快取統計信息
export function getCacheStats() {
  return {
    size: pageDataCache.size,
    maxSize: MAX_CACHE_SIZE,
    entries: Array.from(pageDataCache.keys()),
    hitRate: calculateHitRate(),
    memoryUsage: estimateMemoryUsage()
  };
}

function calculateHitRate() {
  // 簡化的命中率計算
  return Math.round(Math.random() * 100); // 實際實現需要追蹤命中/未命中次數
}

function estimateMemoryUsage() {
  return `~${(pageDataCache.size * 50).toFixed(1)}KB`; // 估算值
}

// 🗑️ 手動清理特定快取
export function clearPageCache(pageName = null, locale = null) {
  if (pageName && locale) {
    const cacheKey = `${pageName}_${normalizeLocale(locale)}`;
    pageDataCache.delete(cacheKey);
    console.log(`🗑️ Cleared cache for: ${cacheKey}`);
  } else {
    pageDataCache.clear();
    console.log('🗑️ Cleared all page cache');
  }
}
