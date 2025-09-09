/**
 * API 配置文件
 * 統一管理所有 API 相關的配置
 */

// Strapi API 配置
export const STRAPI_CONFIG = {
  // 基礎 URL - 可以通過環境變數覆蓋
  BASE_URL: process.env.NEXT_PUBLIC_STRAPI_URL || "http://strapi2-dev.dev.i2hk.net",
  
  // API 版本
  API_VERSION: "api",
  
  // 預設的數據填充級別
  DEFAULT_P_LEVEL: 5,
  
  // 預設狀態
  DEFAULT_STATUS: "draft",
  
  // 預設語言
  DEFAULT_LOCALE: "en",
};

// 內容類型映射
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

// 預覽路由映射
export const PREVIEW_ROUTE_MAPPING = {
  'api::about-us.about-us': '/preview/about-us',
  'api::contact-us.contact-us': '/preview/contact-us',
  'api::homepage.homepage': '/preview/homepage',
  'api::information.information': '/preview/ngo-latest-news',
  'api::plan.plan': '/preview/ai-solution',
  'api::success-case-detail.success-case-detail': '/preview/e123-elderly-portal',
};

// 根據 documentId 映射到具體的預覽頁面
export const DOCUMENT_ID_PREVIEW_MAPPING = {
  'bv6ixplvqu6d9bfkmib5ro51': '/preview/ai-solution',
  'r42zk86ouqoly2l8jpg82psl': '/preview/ai-case-management-platform',
  'drsd1m8p9bf2qg1ho1qe4gt4': '/preview/e123-elderly-portal',
  'voascdjb6gheje5o6v47hgqz': '/preview/brain-training-game',
  'd03bkqtezbu70bm2ez8vuhot': '/preview/e72-elderly-recruitment-system',
  'son36yfriyrwnxs0utdh8s1p': '/preview/coolthinkjc',
  'b8g7kbq1j62qmd5u4mnacpjb': '/preview/i-change-gambling-counseling',
};

/**
 * 獲取完整的 Strapi API URL
 * @param {string} path - API 路徑
 * @returns {string} 完整的 API URL
 */
export function getStrapiApiUrl(path = "") {
  return `${STRAPI_CONFIG.BASE_URL}/${STRAPI_CONFIG.API_VERSION}${path}`;
}

/**
 * 構建預覽 API URL
 * @param {string} endpoint - API 端點
 * @param {string|number} id - 可選的 ID
 * @param {Object} options - 預覽選項
 * @returns {string} 預覽 API URL
 */
export function buildPreviewApiUrl(endpoint, id = null, options = {}) {
  const {
    status = STRAPI_CONFIG.DEFAULT_STATUS,
    pLevel = STRAPI_CONFIG.DEFAULT_P_LEVEL,
    locale = STRAPI_CONFIG.DEFAULT_LOCALE,
    ...otherParams
  } = options;
  
  let url = getStrapiApiUrl(`/${endpoint}`);
  
  if (id) {
    url += `/${id}`;
  }
  
  const params = {
    status,
    pLevel,
    locale,
    ...otherParams
  };
  
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      queryParams.append(key, value);
    }
  });
  
  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }
  
  return url;
}

/**
 * 更新 Strapi 基礎 URL
 * @param {string} newBaseUrl - 新的基礎 URL
 */
export function updateStrapiBaseUrl(newBaseUrl) {
  STRAPI_CONFIG.BASE_URL = newBaseUrl;
  console.log(`Strapi base URL updated to: ${newBaseUrl}`);
}

/**
 * 獲取當前配置
 * @returns {Object} 當前配置
 */
export function getCurrentConfig() {
  return {
    strapi: STRAPI_CONFIG,
    contentTypes: CONTENT_TYPE_MAPPING,
    previewRoutes: PREVIEW_ROUTE_MAPPING,
    documentIdMapping: DOCUMENT_ID_PREVIEW_MAPPING,
  };
}
