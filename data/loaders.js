import { getStrapiURL } from "@/utils/get-strapi-url";
import qs from "qs";
import { shouldUseCache, getCacheDuration } from "@/utils/cache-manager";

// 通用的 Strapi 數據獲取函數（性能監控版）
export async function fetchStrapiData(endpoint, options = {}) {
  const {
    slug = null,
    pLevel = 3,
    filters = {},
    populate = "*",
    fallbackData = null,
    logData = false,
    ...extraParams
  } = options;

  // 性能監控
  const startTime = Date.now();

  try {
    // 建構查詢參數
    const queryConfig = {
      pLevel,
      populate,
      ...extraParams,
    };

    // 如果有 slug，添加過濾條件
    if (slug) {
      queryConfig.filters = {
        slug: { $eq: slug },
        ...filters,
      };
    } else if (Object.keys(filters).length > 0) {
      queryConfig.filters = filters;
    }

    const queryString = qs.stringify(queryConfig);
    const url = getStrapiURL(`/api/${endpoint}?${queryString}`);

    // 準備請求標頭，包含可選的 API 令牌
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // 如果有 API 令牌，添加驗證標頭
    if (process.env.STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.STRAPI_API_TOKEN}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      let errorMessage = `Failed to fetch data from ${endpoint}: ${response.status}`;
      
      // 為不同的 HTTP 狀態碼提供更詳細的錯誤信息
      switch (response.status) {
        case 401:
          errorMessage += ` (Unauthorized - API token may be missing or invalid)`;
          break;
        case 403:
          errorMessage += ` (Forbidden - Check API permissions or add STRAPI_API_TOKEN to environment)`;
          break;
        case 404:
          errorMessage += ` (Not Found - Endpoint '${endpoint}' may not exist)`;
          break;
        case 500:
          errorMessage += ` (Internal Server Error - Strapi backend issue)`;
          break;
        case 502:
          errorMessage += ` (Bad Gateway - Strapi server may be down)`;
          break;
        case 503:
          errorMessage += ` (Service Unavailable - Strapi server overloaded)`;
          break;
        default:
          break;
      }

      // 嘗試獲取詳細錯誤信息
      try {
        const errorData = await response.json();
        if (errorData.error?.message) {
          errorMessage += ` - ${errorData.error.message}`;
        }
      } catch (parseError) {
        // 如果無法解析錯誤響應，忽略
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // 性能日誌
    const duration = Date.now() - startTime;
    // console.log(`⚡ ${endpoint} fetched in ${duration}ms (pLevel: ${pLevel})`);

    if (logData) {
      // console.log(`${endpoint} data:`, data);
    }

    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Error fetching ${endpoint} data after ${duration}ms:`, error);

    if (fallbackData !== null) {
      return fallbackData;
    }

    throw error;
  }
}

// 改進的快取系統
export let homepageDataCache = new Map();
const CACHE_DURATION = 15 * 60 * 1000; // 15分鐘快取
const MAX_CACHE_SIZE = 50; // 最大快取條目數

// 改進的快取清理機制
function cleanupCache() {
  if (homepageDataCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(homepageDataCache.entries());
    entries.slice(0, Math.floor(entries.length / 2)).forEach(([key]) => {
      homepageDataCache.delete(key);
    });
    // console.log('🧹 Cleaned up old cache entries');
  }
}

// 清除快取的輔助函數 (用於調試)
export function clearHomepageCache() {
  homepageDataCache.clear();
  // console.log('🧹 Homepage cache cleared');
}

// 獲取快取狀態的函數
export function getCacheStats() {
  return {
    size: homepageDataCache.size,
    keys: Array.from(homepageDataCache.keys()),
    maxSize: MAX_CACHE_SIZE,
    duration: CACHE_DURATION / 1000 / 60 + ' minutes'
  };
}

// 正規化locale參數的輔助函數
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
  
  const normalized = localeMap[locale.toLowerCase()] || locale;
  // console.log(`🔄 Normalized locale: ${locale} -> ${normalized}`);
  
  return normalized;
}

// 🚀 核心數據獲取函數 - 統一入口點，避免重複調用
async function fetchHomepageRawData(locale = 'en') {
  const normalizedLocale = normalizeLocale(locale);
  const cacheKey = `homepage_${normalizedLocale}`;
  
  // 檢查快取 (開發模式可以跳過)
  if (shouldUseCache() && homepageDataCache.has(cacheKey)) {
    const cached = homepageDataCache.get(cacheKey);
    if (cached.expires > Date.now()) {
      // console.log('📦 Using cached homepage data for locale:', normalizedLocale);
      return cached.data;
    } else {
      homepageDataCache.delete(cacheKey);
      // console.log('⏰ Cache expired and removed for:', normalizedLocale);
    }
  }

  // console.log('🌐 Fetching fresh homepage data for locale:', normalizedLocale);
  
  try {
    // 嘗試獲取指定語言的數據
    const data = await fetchStrapiData('homepage', {
      pLevel: 6,
      locale: normalizedLocale,
      populate: '*',
      logData: false,
    });

    // 存入快取 (使用動態緩存時間)
    const cacheDuration = getCacheDuration(CACHE_DURATION);
    cleanupCache();
    homepageDataCache.set(cacheKey, {
      data: data,
      timestamp: Date.now(),
      expires: Date.now() + cacheDuration
    });
    
    setTimeout(() => {
      homepageDataCache.delete(cacheKey);
      // console.log('🗑️ Cache expired for:', cacheKey);
    }, CACHE_DURATION);

    return data;
    
  } catch (error) {
    // 容錯機制：如果指定語言失敗，回退到英文
    if (normalizedLocale !== 'en') {
      // console.log(`⚠️ Failed to get data for ${normalizedLocale}, falling back to English`);
      return await fetchHomepageRawData('en');
    }
    throw error;
  }
}

// 🎯 統一的數據處理函數 - 避免重複的數據解析邏輯
function processHomepageData(rawData, locale) {
  if (!rawData?.data?.Blocks) {
    // console.log('❌ No Blocks data found');
    return {
      bannerSlides: [],
      solutionData: null,
      rawBlocks: [],
      meta: {
        locale: locale,
        hasBanner: false,
        hasSolution: false,
        solutionCount: 0,
        error: 'No blocks data'
      }
    };
  }

  const blocks = rawData.data.Blocks;

  // 處理 Banner 數據
  const bannerBlock = blocks.find(
    block => block.__component === 'home-page.banner-block'
  );

  const bannerSlides = [];
  if (bannerBlock?.Banner) {
    bannerSlides.push(...bannerBlock.Banner.map((banner) => {
      // 從富文本內容中提取純文本
      const extractContent = (contentArray) => {
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
      };

      return {
        id: banner.id,
        title: banner.Title || '',
        subtitle: banner.SubTitle || '',
        content: extractContent(banner.Content),
        image: banner.Image || null,
        buttonText: banner.Button?.Text || null,
        buttonLink: banner.Button?.URL || null,
        icon: banner.icon || null,
      };
    }));
  }

  // 處理 Solution 數據
  const solutionBlock = blocks.find(
    block => block.__component === 'home-page.solution' ||
             block.__component === 'home-page.solution-block' || 
             (block.SolutionSection && block.SolutionSection.length > 0)
  );

  // 處理 Information 數據（第三個組件）
  const informationBlock = blocks.find(
    block => block.__component === 'home-page.information-section' ||
             block.__component === 'home-page.information' || 
             (block.InformationSection && block.InformationSection.length > 0)
  );

  // 處理 Client Logo 數據（第四個組件）
  const clientLogoBlock = blocks.find(
    block => block.__component === 'home-page.client-logo'
  );

  // 處理 Awards Section 數據（第五個組件）
  const awardsBlock = blocks.find(
    block => block.__component === 'home-page.awards-section'
  );

  // 處理 Public Card 數據（第六個組件）
  const cardBlock = blocks.find(
    block => block.__component === 'public.card'
  );

  return {
    bannerSlides,
    solutionData: solutionBlock,
    informationData: informationBlock,
    clientLogoData: clientLogoBlock,
    awardsData: awardsBlock,
    cardData: cardBlock,
    rawBlocks: blocks,
    meta: {
      locale: locale,
      hasBanner: bannerSlides.length > 0,
      hasSolution: !!solutionBlock,
      hasInformation: !!informationBlock,
      hasClientLogo: !!clientLogoBlock,
      hasAwards: !!awardsBlock,
      hasCard: !!cardBlock,
      solutionCount: solutionBlock?.SolutionSection?.length || 0,
      informationCount: informationBlock?.InformationSection?.length || 0,
      clientLogoCount: (clientLogoBlock?.Awards || clientLogoBlock?.logo)?.length || 0,
      awardsCount: (awardsBlock?.awardslogo || awardsBlock?.awards)?.length || 0
    }
  };
}

// 🚀 主要的數據獲取函數 - 統一入口點
export async function getCompleteHomepageData(locale = 'en') {
  // console.log('🏠 Getting complete homepage data for locale:', locale);
  
  try {
    const rawData = await fetchHomepageRawData(locale);
    const processedData = processHomepageData(rawData, locale);
    return processedData;
    
  } catch (error) {
    console.error('❌ Error getting complete homepage data:', error);
    return {
      bannerSlides: [],
      solutionData: null,
      rawBlocks: [],
      meta: {
        locale: locale,
        hasBanner: false,
        hasSolution: false,
        solutionCount: 0,
        error: error.message
      }
    };
  }
}

// 🔄 向後兼容的API函數 - 使用統一的數據源避免重複調用

// Function to fetch page data from Strapi (保留原有 API 以維持兼容性)
export async function getPageData(endpoint, slug = null) {
  return fetchStrapiData(endpoint, {
    slug,
    pLevel: 10,
    populate: "*"
  });
}

// 改進的Menu數據快取系統
export let menuDataCache = new Map();
const MENU_CACHE_DURATION = 30 * 60 * 1000; // 30分鐘快取（Menu變化較少）

// 新聞/資訊數據快取系統
export let newsDataCache = new Map();
const NEWS_CACHE_DURATION = 10 * 60 * 1000; // 10分鐘快取（新聞更新較頻繁）

// Function to fetch menu data from Strapi (帶快取優化)
export async function getMenuData(locale = 'en') {
  const normalizedLocale = normalizeLocale(locale);
  const cacheKey = `menu_${normalizedLocale}`;
  
  // 檢查快取
  if (menuDataCache.has(cacheKey)) {
    const cached = menuDataCache.get(cacheKey);
    if (cached.expires > Date.now()) {
      // console.log('📦 Using cached menu data for locale:', normalizedLocale);
      return cached.data;
    } else {
      menuDataCache.delete(cacheKey);
      // console.log('⏰ Menu cache expired and removed for:', normalizedLocale);
    }
  }

  // console.log('🍔 Fetching fresh menu data for locale:', normalizedLocale);
  
  try {
    const data = await fetchStrapiData('menus', {
      pLevel: 3,
      locale: normalizedLocale,
      logData: false,
    });

    // 存入快取
    menuDataCache.set(cacheKey, {
      data: data,
      timestamp: Date.now(),
      expires: Date.now() + MENU_CACHE_DURATION
    });
    
    setTimeout(() => {
      menuDataCache.delete(cacheKey);
      // console.log('🗑️ Menu cache expired for:', cacheKey);
    }, MENU_CACHE_DURATION);

    return data;
    
  } catch (error) {
    // 容錯機制：如果指定語言失敗，回退到英文
    if (normalizedLocale !== 'en') {
      // console.log(`⚠️ Failed to get menu data for ${normalizedLocale}, falling back to English`);
      return await getMenuData('en');
    }
    throw error;
  }
}

// 使用統一數據源的兼容函數
export async function getHomepageData(locale = 'en') {
  const { rawBlocks, meta } = await getCompleteHomepageData(locale);
  return {
    data: {
      Blocks: rawBlocks
    },
    meta
  };
}

export async function getSolutionData(locale = 'en') {
  const { solutionData } = await getCompleteHomepageData(locale);
  return solutionData;
}

export async function getSolutionDataByLocale(locale) {
  return await getSolutionData(locale);
}

export async function getHomepageAllData(locale = 'en') {
  const { bannerSlides, solutionData } = await getCompleteHomepageData(locale);
  return {
    bannerSlides,
    block1Data: solutionData
  };
}

export async function getHomepageBannerSlides(locale = 'en') {
  const { bannerSlides } = await getCompleteHomepageData(locale);
  return bannerSlides;
}

export async function getHomepageBlock1Data(locale = 'en') {
  const { solutionData } = await getCompleteHomepageData(locale);
  return solutionData;
}

export async function getInformationData(locale = 'en') {
  const { informationData } = await getCompleteHomepageData(locale);
  return informationData;
}

// 🆕 新聞/資訊數據獲取函數（帶快取優化）
export async function getNewsData(locale = 'en', options = {}) {
  const normalizedLocale = normalizeLocale(locale);
  const {
    page = 1,
    pageSize = 25,
    category = null,
    search = null,
    sortBy = 'Publish:desc'
  } = options;
  
  // 建構快取鍵，包含查詢參數
  const cacheKey = `news_${normalizedLocale}_${page}_${pageSize}_${category || 'all'}_${search || 'none'}_${sortBy}`;
  
  // 檢查快取
  if (newsDataCache.has(cacheKey)) {
    const cached = newsDataCache.get(cacheKey);
    if (cached.expires > Date.now()) {
      // console.log('📰 Using cached news data for:', cacheKey);
      return cached.data;
    } else {
      newsDataCache.delete(cacheKey);
      // console.log('⏰ News cache expired and removed for:', cacheKey);
    }
  }

  // console.log('📰 Fetching fresh news data for locale:', normalizedLocale, 'with options:', options);
  
  try {
    // 建構查詢參數
    const queryParams = {
      pLevel: 3,
      locale: normalizedLocale,
      populate: ['image', 'information_category'],
      pagination: {
        page,
        pageSize
      },
      sort: [sortBy]
    };

    // 添加分類過濾
    if (category) {
      queryParams.filters = {
        information_category: {
          name: { $eq: category }
        }
      };
    }

    // 添加搜索過濾
    if (search) {
      queryParams.filters = {
        ...queryParams.filters,
        $or: [
          { Title: { $containsi: search } },
          { Author: { $containsi: search } },
          { Content: { $containsi: search } }
        ]
      };
    }

    const data = await fetchStrapiData('informations', queryParams);

    // 處理數據格式
    const processedData = {
      ...data,
      data: data.data?.map(item => ({
        id: item.id,
        documentId: item.documentId,
        title: item.Title,
        author: item.Author,
        content: item.Content,
        publishDate: item.Publish,
        image: item.image?.[0] || null,
        category: item.information_category?.name || null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })) || []
    };

    // 存入快取
    newsDataCache.set(cacheKey, {
      data: processedData,
      timestamp: Date.now(),
      expires: Date.now() + NEWS_CACHE_DURATION
    });
    
    setTimeout(() => {
      newsDataCache.delete(cacheKey);
      // console.log('🗑️ News cache expired for:', cacheKey);
    }, NEWS_CACHE_DURATION);

    return processedData;
    
  } catch (error) {
    // 容錯機制：如果指定語言失敗，回退到英文
    if (normalizedLocale !== 'en') {
      // console.log(`⚠️ Failed to get news data for ${normalizedLocale}, falling back to English`);
      return await getNewsData('en', options);
    }
    throw error;
  }
}

// 🆕 獲取新聞分類列表
export async function getNewsCategoriesData(locale = 'en') {
  const normalizedLocale = normalizeLocale(locale);
  const cacheKey = `news_categories_${normalizedLocale}`;
  
  // 檢查快取
  if (newsDataCache.has(cacheKey)) {
    const cached = newsDataCache.get(cacheKey);
    if (cached.expires > Date.now()) {
      // console.log('📂 Using cached news categories for:', normalizedLocale);
      return cached.data;
    } else {
      newsDataCache.delete(cacheKey);
    }
  }

  try {
    const data = await fetchStrapiData('information-categories', {
      pLevel: 1,
      locale: normalizedLocale,
      populate: '*'
    });

    // 存入快取
    newsDataCache.set(cacheKey, {
      data: data,
      timestamp: Date.now(),
      expires: Date.now() + NEWS_CACHE_DURATION
    });

    return data;
    
  } catch (error) {
    if (normalizedLocale !== 'en') {
      return await getNewsCategoriesData('en');
    }
    throw error;
  }
}

// 🎯 簡化版：專門針對您的3個API需求的優化函數
export async function getOptimizedPageData(locale = 'en') {
  // console.log('🎯 Getting optimized page data (3 API pattern) for locale:', locale);
  
  try {
    // 並行獲取homepage和menu數據，完全避免重複調用
    const [homepageData, menuData] = await Promise.all([
      fetchHomepageRawData(locale), // 直接獲取原始數據，避免重複處理
      getMenuData(locale)
    ]);
    
    // 一次性處理並提取所有需要的數據
    const processedData = processHomepageData(homepageData, locale);

    
    return {
      // 完整的homepage數據
      ...processedData,
      
      // 分離的block數據，供不同API使用
      blocks: {
        banner: processedData.bannerSlides,
        solution: processedData.solutionData,
        information: processedData.informationData,
        clientLogo: processedData.clientLogoData,
        awards: processedData.awardsData,
        card: processedData.cardData,
        raw: processedData.rawBlocks
      },
      
      // Menu數據
      menuData,
      
      // 統計信息
      apiCallCount: 2 // 實際只進行了2次API調用
    };
    
  } catch (error) {
    console.error('❌ Error getting optimized page data:', error);
    return {
      bannerSlides: [],
      solutionData: null,
      informationData: null,
      rawBlocks: [],
      blocks: { banner: [], solution: null, information: null, raw: [] },
      menuData: null,
      meta: {
        locale: locale,
        hasBanner: false,
        hasSolution: false,
        hasInformation: false,
        solutionCount: 0,
        informationCount: 0,
        error: error.message
      },
      apiCallCount: 0
    };
  }
}