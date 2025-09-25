/**
 * SEO 元數據處理工具
 * 統一處理從 Strapi API 獲取的 SEO 數據並轉換為 Next.js 的 metadata 格式
 */

import { getStrapiURL } from "@/utils/get-strapi-url";

// 规范化 locale 函数
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
    'tc': 'zh-Hant-HK',
    'zh-hant-hk': 'zh-Hant-HK' // 處理 URL 中的 zh-Hant-HK 格式
  };
  
  const normalized = locale.toLowerCase();
  return localeMapping[normalized] || 'en';
}

/**
 * 從 Strapi 數據中提取 SEO 信息
 * @param {Object} data - Strapi API 返回的數據
 * @param {string} fallbackTitle - 默認標題
 * @param {string} fallbackDescription - 默認描述
 * @returns {Object} SEO 元數據對象
 */
export function extractSEOFromData(data, fallbackTitle = 'NGO Digital Services', fallbackDescription = 'Professional digital transformation solutions for non-profit organizations') {
  // 檢查數據中是否包含 SEO 字段
  const seo = data?.seo || data?.SEO || data?.Seo;
  
  if (!seo) {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      keywords: 'NGO, non-profit, digital transformation, website development, data analytics, charity',
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        type: 'website',
      },
    };
  }

  // 提取 SEO 數據
  const metaTitle = seo.metaTitle || seo.meta_title || seo.title;
  const metaDescription = seo.metaDescription || seo.meta_description || seo.description;
  const metaKeywords = seo.metaKeywords || seo.meta_keywords || seo.keywords;
  const shareImage = seo.shareImage || seo.share_image || seo.image;
  const canonicalUrl = seo.canonicalUrl || seo.canonical_url || seo.url;

  // 構建完整的標題（如果沒有包含網站名稱）
  const siteName = ' | NGO Digital';
  const finalTitle = metaTitle && !metaTitle.includes('NGO Digital') 
    ? `${metaTitle}${siteName}` 
    : metaTitle || fallbackTitle;

  // 構建 OpenGraph 數據
  const openGraphData = {
    title: finalTitle,
    description: metaDescription || fallbackDescription,
    type: 'website',
  };

  // 如果有分享圖片，添加到 OpenGraph
  if (shareImage) {
    const imageUrl = typeof shareImage === 'string' 
      ? shareImage 
      : shareImage.url || shareImage.data?.attributes?.url;
    
    if (imageUrl) {
      const fullImageUrl = imageUrl.startsWith('http') 
        ? imageUrl 
        : `${getStrapiURL()}${imageUrl}`;
      
      openGraphData.images = [fullImageUrl];
    }
  }

  // 構建 Twitter 卡片數據
  const twitterData = {
    card: 'summary_large_image',
    title: finalTitle,
    description: metaDescription || fallbackDescription,
  };

  if (openGraphData.images) {
    twitterData.images = openGraphData.images;
  }

  return {
    title: finalTitle,
    description: metaDescription || fallbackDescription,
    keywords: metaKeywords || 'NGO, non-profit, digital transformation, website development, data analytics, charity',
    openGraph: openGraphData,
    twitter: twitterData,
    ...(canonicalUrl && { alternates: { canonical: canonicalUrl } }),
  };
}

/**
 * 為特定頁面生成 SEO 元數據
 * @param {string} endpoint - Strapi API 端點
 * @param {Object} options - 查詢選項
 * @param {string} fallbackTitle - 默認標題
 * @param {string} fallbackDescription - 默認描述
 * @returns {Promise<Object>} SEO 元數據
 */
export async function generateSEOMetadata(endpoint, options = {}, fallbackTitle, fallbackDescription) {
  try {
    const { locale = 'en', slug = null, filters = {}, populate = '*', pLevel = 3 } = options;
    
    // 構建查詢參數
    const queryParams = new URLSearchParams();
    queryParams.append('pLevel', pLevel.toString());
    queryParams.append('populate', populate);
    queryParams.append('locale', normalizeLocale(locale));

    if (slug) {
      queryParams.append('filters[slug][$eq]', slug);
    }

    // 添加其他過濾條件
    Object.entries(filters).forEach(([key, value]) => {
      if (typeof value === 'object' && value.$eq) {
        queryParams.append(`filters[${key}][$eq]`, value.$eq);
      } else {
        queryParams.append(`filters[${key}]`, value);
      }
    });

    const url = `${getStrapiURL()}/api/${endpoint}?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const data = result.data;

    // 如果是數組，取第一個元素
    const targetData = Array.isArray(data) ? data[0] : data;

    if (!targetData) {
      return {
        title: fallbackTitle,
        description: fallbackDescription,
        keywords: 'NGO, non-profit, digital transformation, website development, data analytics, charity',
        openGraph: {
          title: fallbackTitle,
          description: fallbackDescription,
          type: 'website',
        },
      };
    }

    return extractSEOFromData(targetData, fallbackTitle, fallbackDescription);

  } catch (error) {
    console.error('Error generating SEO metadata:', error);
    
    // 返回默認 SEO 數據
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      keywords: 'NGO, non-profit, digital transformation, website development, data analytics, charity',
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        type: 'website',
      },
    };
  }
}

/**
 * 為成功案例頁面生成 SEO 元數據
 * @param {string} locale - 語言
 * @param {number} order - 成功案例的順序
 * @param {string} fallbackTitle - 默認標題
 * @returns {Promise<Object>} SEO 元數據
 */
export async function generateSuccessCaseSEOMetadata(locale, order, fallbackTitle) {
  try {
    const pageData = await import('@/data/unified-loader').then(m => m.getSuccessCasesData(locale));
    const { successCases } = pageData.processedData || {};
    const successCase = successCases?.find(sc => sc.order === order);
    
    if (!successCase) {
      return {
        title: `${fallbackTitle} | NGO Digital`,
        description: `${fallbackTitle} - 成功案例分享`,
        keywords: 'NGO, 成功案例, 數碼轉型, 非營利組織',
        openGraph: {
          title: `${fallbackTitle} | NGO Digital`,
          description: `${fallbackTitle} - 成功案例分享`,
          type: 'website',
        },
      };
    }

    return extractSEOFromData(successCase, `${successCase.title} | NGO Digital`, 
      successCase.content ? successCase.content.substring(0, 160) : `${successCase.title} 成功案例`);
    
  } catch (error) {
    console.error('Error generating success case SEO metadata:', error);
    return {
      title: `${fallbackTitle} | NGO Digital`,
      description: `${fallbackTitle} - 成功案例分享`,
      keywords: 'NGO, 成功案例, 數碼轉型, 非營利組織',
      openGraph: {
        title: `${fallbackTitle} | NGO Digital`,
        description: `${fallbackTitle} - 成功案例分享`,
        type: 'website',
      },
    };
  }
}

/**
 * 為數碼方案頁面生成 SEO 元數據
 * @param {string} locale - 語言
 * @param {number} order - 方案的順序
 * @param {string} fallbackTitle - 默認標題
 * @returns {Promise<Object>} SEO 元數據
 */
export async function generatePlanSEOMetadata(locale, order, fallbackTitle) {
  try {
    const pageData = await import('@/data/unified-loader').then(m => m.getDigitalSolutionsData(locale));
    const { plans } = pageData.processedData || {};
    const plan = plans?.find(p => p.order === order);
    
    if (!plan) {
      return {
        title: `${fallbackTitle} | NGO Digital`,
        description: `了解更多關於 ${fallbackTitle} 的數碼化解決方案`,
        keywords: 'NGO, 數碼方案, 數碼轉型, 非營利組織',
        openGraph: {
          title: `${fallbackTitle} | NGO Digital`,
          description: `了解更多關於 ${fallbackTitle} 的數碼化解決方案`,
          type: 'website',
        },
      };
    }

    return extractSEOFromData(plan, `${plan.title} | NGO Digital`, 
      plan.content || `了解更多關於 ${plan.title} 的數碼化解決方案`);
    
  } catch (error) {
    console.error('Error generating plan SEO metadata:', error);
    return {
      title: `${fallbackTitle} | NGO Digital`,
      description: `了解更多關於 ${fallbackTitle} 的數碼化解決方案`,
      keywords: 'NGO, 數碼方案, 數碼轉型, 非營利組織',
      openGraph: {
        title: `${fallbackTitle} | NGO Digital`,
        description: `了解更多關於 ${fallbackTitle} 的數碼化解決方案`,
        type: 'website',
      },
    };
  }
}

/**
 * 為新聞文章頁面生成 SEO 元數據
 * @param {string} documentId - 文章文檔ID
 * @param {string} locale - 語言
 * @returns {Promise<Object>} SEO 元數據
 */
export async function generateNewsSEOMetadata(documentId, locale) {
  try {
    const response = await fetch(`${getStrapiURL()}/api/informations/${documentId}?pLevel=5&locale=${normalizeLocale(locale)}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const article = result.data;

    if (!article) {
      return {
        title: '新聞文章 | NGO Digital',
        description: 'NGO 最新資訊和新聞',
        keywords: 'NGO, 新聞, 資訊, 非營利組織',
        openGraph: {
          title: '新聞文章 | NGO Digital',
          description: 'NGO 最新資訊和新聞',
          type: 'article',
        },
      };
    }

    return extractSEOFromData(article, `${article.Title} | NGO Digital`, 
      article.Content ? article.Content.substring(0, 160) : article.Title);
    
  } catch (error) {
    console.error('Error generating news SEO metadata:', error);
    return {
      title: '新聞文章 | NGO Digital',
      description: 'NGO 最新資訊和新聞',
      keywords: 'NGO, 新聞, 資訊, 非營利組織',
      openGraph: {
        title: '新聞文章 | NGO Digital',
        description: 'NGO 最新資訊和新聞',
        type: 'article',
      },
    };
  }
}
