/**
 * 统一数据加载器 - 简洁明了且无缓存
 * 整合了 API 配置、数据获取和页面加载器功能
 */

import { getStrapiURL } from "@/utils/get-strapi-url";
import qs from "qs";

// ========== API 端点配置 ==========
const API_ENDPOINTS = {
  homepage: { endpoint: 'homepage', populateLevel: 4 },
  menus: { endpoint: 'menus', populateLevel: 2 },
  'about-us': { endpoint: 'about-us', populateLevel: 4 },
  'contact-us': { endpoint: 'contact-us', populateLevel: 3 },
  informations: { endpoint: 'informations', populateLevel: 3 },
  'information-categories': { endpoint: 'information-categories', populateLevel: 1 },
  'services-page': { endpoint: 'services-page', populateLevel: 4 },
  plans: { endpoint: 'plans', populateLevel: 4 },
  successfuls: { endpoint: 'successfuls', populateLevel: 3 }
};

// ========== 页面 API 需求配置 ==========
const PAGE_API_CONFIG = {
  homepage: ['homepage','menus'],
  aboutus: ['menus', 'about-us'],
  'contact-us': ['menus', 'contact-us'],
  news: ['menus', 'informations', 'information-categories'],
  'news-detail': ['menus', 'informations'],
  services: ['menus', 'services-page'],
  'digital-solutions': ['menus', 'plans'],
  'success-case-detail': ['menus', 'successfuls'],
  sitemap: ['menus']
};

// ========== 工具函数 ==========

// 规范化 locale
function normalizeLocale(locale) {
  if (!locale) return 'en';
  
  // 映射到 Strapi API 格式
  const localeMapping = {
    'en': 'en',
    'zh-hant': 'zh-Hant-HK', // 前端使用 zh-hant，API 使用 zh-Hant-HK
    'zh-hant-hk': 'zh-Hant-HK', // 兼容舊格式
    'zhhkhk': 'zh-Hant-HK', // 兼容舊格式
    'zh': 'zh-Hant-HK', // 默認中文為香港繁體
    'hk': 'zh-Hant-HK',
    'tc': 'zh-Hant-HK'
  };
  
  const normalized = locale.toLowerCase();
  return localeMapping[normalized] || 'en';
}

// 从路径推断页面名称
function inferPageNameFromPath(pathname) {
  const cleanPath = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?\//, '/').replace(/^\//, '');
  
  const pathMapping = {
    '': 'homepage',
    'aboutus': 'aboutus',
    'contact-us': 'contact-us',
    'news': 'news',
    'services': 'services',
    'digital-solutions': 'digital-solutions'
  };
  
  if (cleanPath.startsWith('news/') && cleanPath.length > 5) {
    return 'news-detail';
  }
  
  return pathMapping[cleanPath] || 'homepage';
}

// 从富文本内容中提取纯文本
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

// ========== 核心数据获取函数 ==========

// 通用 Strapi 数据获取（无缓存）
export async function fetchStrapiData(endpoint, options = {}) {
  const {
    slug = null,
    pLevel = 3,
    filters = {},
    populate = "*",
    fallbackData = null,
    draft = false,
    ...extraParams
  } = options;

  const startTime = Date.now();

  try {
    // 构建查询参数 - 根据 draft 参数决定使用 live 还是 preview 状态
    const queryConfig = {
      pLevel,
      populate,
      publicationState: draft ? 'preview' : 'live',
      ...extraParams,
    };

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

    // 准备请求头
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // 只有在有效的 API token 存在时才添加 Authorization header
    if (process.env.STRAPI_API_TOKEN && 
        process.env.STRAPI_API_TOKEN !== 'your_strapi_api_token_here' &&
        process.env.STRAPI_API_TOKEN.trim() !== '' &&
        process.env.STRAPI_API_TOKEN !== 'undefined') {
      headers['Authorization'] = `Bearer ${process.env.STRAPI_API_TOKEN}`;
    }

    // 无缓存请求
    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'no-store', // 禁用缓存
    });

    if (!response.ok) {
      let errorMessage = `Failed to fetch ${endpoint}: ${response.status}`;
      
      switch (response.status) {
        case 401:
          errorMessage += ` (Unauthorized)`;
          break;
        case 403:
          errorMessage += ` (Forbidden)`;
          break;
        case 404:
          errorMessage += ` (Not Found)`;
          break;
        case 500:
          errorMessage += ` (Server Error)`;
          break;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    const duration = Date.now() - startTime;
    // console.log(`⚡ ${endpoint} fetched in ${duration}ms`);

    return data;
    
  } catch (error) {
    // console.error(`❌ Error fetching ${endpoint}:`, error.message);
    
    if (fallbackData !== null) {
      // console.log(`🔄 Using fallback data for ${endpoint}`);
      return fallbackData;
    }
    
    throw error;
  }
}

// ========== 页面数据获取函数 ==========

// 获取页面所需的所有数据
export async function getPageData(pageName, locale = 'en', options = {}) {
  const normalizedLocale = normalizeLocale(locale);
  const apis = PAGE_API_CONFIG[pageName] || ['menus'];
  
  // console.log(`🎯 Loading ${pageName} data for ${normalizedLocale}`);

  try {
    // 并行获取所有需要的 API 数据
    const results = await Promise.allSettled(
      apis.map(async (apiName) => {
        const config = API_ENDPOINTS[apiName];
        if (!config) {
          throw new Error(`API config not found: ${apiName}`);
        }

        const data = await fetchStrapiData(config.endpoint, {
          pLevel: config.populateLevel,
          locale: normalizedLocale,
          populate: '*',
          ...options
        });

        return { apiName, data };
      })
    );

    // 组织返回数据
    const pageData = {};
    const errors = [];

    results.forEach((result, index) => {
      const apiName = apis[index];
      
      if (result.status === 'fulfilled') {
        pageData[result.value.apiName] = result.value.data;
      } else {
        // console.warn(`⚠️ Failed to load ${apiName}:`, result.reason.message);
        errors.push({ apiName, error: result.reason.message });
        pageData[apiName] = null;
      }
    });

    // 添加元数据
    pageData.meta = {
      pageName,
      locale: normalizedLocale,
      timestamp: new Date().toISOString(),
      apis: apis,
      errors: errors,
      hasErrors: errors.length > 0
    };

    return pageData;

  } catch (error) {
    // console.error(`❌ Error loading ${pageName} data:`, error);
    throw error;
  }
}

// ========== 特定页面加载器 ==========

// 首页数据
export async function getHomepageData(locale = 'en', options = {}) {
  const data = await getPageData('homepage', locale, options);
  
  // 处理首页特殊结构 - 使用 BlockRenderer 方式
  if (data.homepage?.data?.Blocks) {
    const blocks = data.homepage.data.Blocks;
    
    return {
      ...data,
      blocks: blocks // 直接返回原始区块数据，让 HomepageBlockRenderer 处理
    };
  }
  
  return data;
}

// 新闻页面数据
export async function getNewsData(locale = 'en', options = {}) {
  const {
    page = 1,
    pageSize = 25,
    category = null,
    search = null,
    sortBy = 'Publish:desc'
  } = options;
  
  const data = await getPageData('news', locale);
  
  // 如果需要特定查询，额外获取
  if (category || search || page > 1) {
    try {
      const filters = {};
      if (category) {
        filters.information_category = { name: { $eq: category } };
      }
      if (search) {
        filters.$or = [
          { Title: { $containsi: search } },
          { Content: { $containsi: search } }
        ];
      }

      const customNews = await fetchStrapiData('informations', {
        pLevel: 3,
        locale: normalizeLocale(locale),
        populate: ['image', 'information_category'],
        pagination: { page, pageSize },
        sort: [sortBy],
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        draft: options.draft || false
      });
      
      data.customNews = customNews;
    } catch (error) {
      // console.error('Error fetching custom news:', error);
    }
  }
  
  return data;
}

// 首頁新聞數據 - 輕量化版本，專為首頁設計
export async function getHomepageNewsData(locale = 'en', options = {}) {
  const { draft = false } = options;
  
  try {
    const newsData = await fetchStrapiData('informations', {
      pLevel: 3,
      locale: normalizeLocale(locale),
      populate: ['image', 'information_category'], // 只 populate 首頁需要的字段
      pagination: { page: 1, pageSize: 3 }, // 固定最新3條
      sort: ['Publish:desc'],
      draft,
    });

    // 簡化處理，只返回首頁需要的數據
    return {
      data: newsData.data?.map(news => ({
        id: news.id,
        documentId: news.documentId,
        title: news.Title,
        content: news.Content,
        publishedAt: news.Publish,
        image: news.image,
        category: news.information_category?.name || null,
        createdAt: news.createdAt,
        updatedAt: news.updatedAt,
      })) || [],
      meta: {
        pagination: {
          page: 1,
          pageSize: 3,
          total: newsData.meta?.pagination?.total || 0
        }
      }
    };
  } catch (error) {
    // console.error('Error fetching homepage news:', error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 3, total: 0 } } };
  }
}

// 新闻详情页面数据
export async function getNewsDetailData(slug, locale = 'en', options = {}) {
  const { draft = false } = options;
  const data = await getPageData('news-detail', locale, options);
  
  try {
    const newsDetail = await fetchStrapiData('informations', {
      pLevel: 4,
      locale: normalizeLocale(locale),
      populate: '*',
      filters: { slug: { $eq: slug } },
      draft
    });
    
    data.newsDetail = newsDetail;
  } catch (error) {
    // console.error('Error fetching news detail:', error);
    data.newsDetail = null;
  }
  
  return data;
}

// 数码方案页面数据
export async function getDigitalSolutionsData(locale = 'en', options = {}) {
  const data = await getPageData('digital-solutions', locale, options);
  
  // 处理排序
  if (data.plans?.data) {
    const sortedPlans = data.plans.data
      .sort((a, b) => (a.Order || 0) - (b.Order || 0))
      .map(plan => ({
        id: plan.id,
        documentId: plan.documentId,
        title: plan.Title,
        order: plan.Order,
        content: plan.Content,
        icon: plan.icon,
        image: plan.Image,
        button: plan.Button,
        blocks: plan.Blocks || [],
        seo: plan.seo || plan.SEO || plan.Seo // 包含SEO數據
      }));
    
    data.processedData = { plans: sortedPlans };
  }
  
  return data;
}

// 成功案例页面数据
export async function getSuccessCasesData(locale = 'en', options = {}) {
  const data = await getPageData('success-case-detail', locale, options);
  
  // 处理排序
  if (data.successfuls?.data) {
    const sortedCases = data.successfuls.data
      .sort((a, b) => (a.Order || 0) - (b.Order || 0))
      .map(successCase => ({
        id: successCase.id,
        documentId: successCase.documentId,
        title: successCase.Title,
        order: successCase.Order,
        content: successCase.Content,
        icon: successCase.Icon,
        background: successCase.Background,
        button: successCase.Button,
        card: successCase.Card || [],
        screenshot: successCase.image || [],
        seo: successCase.seo || successCase.SEO || successCase.Seo // 包含SEO數據
      }));
    
    data.processedData = { successCases: sortedCases };
  }
  
  return data;
}

// ========== 智能路由加载器 ==========

// 根据路由自动加载对应数据
export async function getDataForRoute(pathname, locale = 'en', options = {}) {
  const pageName = inferPageNameFromPath(pathname);
  
  switch (pageName) {
    case 'homepage':
      return await getHomepageData(locale, options);
    case 'news':
      return await getNewsData(locale, options);
    case 'news-detail':
      const slug = pathname.split('/').pop();
      return await getNewsDetailData(slug, locale, options);
    case 'digital-solutions':
      return await getDigitalSolutionsData(locale, options);
    case 'success-case-detail':
      return await getSuccessCasesData(locale, options);
    default:
      return await getPageData(pageName, locale, options);
  }
}

// ========== 快速访问函数 ==========

// 只获取菜单数据
export async function getMenuData(locale = 'en', options = {}) {
  return await fetchStrapiData('menus', {
    pLevel: 3,
    locale: normalizeLocale(locale)
  });
}

// 获取关于我们数据
export async function getAboutUsData(locale = 'en', options = {}) {
  return await getPageData('aboutus', locale, options);
}

// 获取联系我们数据
export async function getContactUsData(locale = 'en', options = {}) {
  return await getPageData('contact-us', locale, options);
}

// 获取服务页面数据
export async function getServicesData(locale = 'en', options = {}) {
  return await getPageData('services', locale, options);
}
