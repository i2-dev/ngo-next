/**
 * 预览数据获取工具
 * 用于从Strapi API获取预览数据
 */

const STRAPI_BASE_URL = 'http://strapi2-dev.dev.i2hk.net';

// 内容类型映射
const CONTENT_TYPE_MAPPING = {
  'about-us': 'about-us',
  'contact-us': 'contact-us',
  'homepage': 'homepage',
  'informations': 'informations',
  'services-page': 'services-page',
  'plans': 'plans',
  'successfuls': 'successfuls'
};

/**
 * 从Strapi API获取预览数据
 * @param {string} contentType - 内容类型
 * @param {Object} options - 选项
 * @param {string} options.status - 状态 (draft/live)
 * @param {string} options.locale - 语言
 * @param {string} options.documentId - 文档ID
 * @param {Object} options.filters - 额外的过滤条件
 * @param {number} options.pLevel - 数据填充级别
 * @returns {Promise<Object>} 预览数据
 */
export async function fetchPreviewData(contentType, options = {}) {
  const {
    status = 'draft',
    locale = 'en',
    documentId = null,
    filters = {},
    pLevel = 5
  } = options;

  try {
    // 构建查询参数
    const queryParams = new URLSearchParams();
    queryParams.append('status', status);
    queryParams.append('locale', locale);
    queryParams.append('pLevel', pLevel.toString());
    
    // 添加文档ID过滤
    if (documentId) {
      queryParams.append('filters[documentId][$eq]', documentId);
    }

    // 添加额外的过滤条件
    Object.entries(filters).forEach(([key, value]) => {
      queryParams.append(`filters[${key}][$eq]`, value);
    });

    // 构建API URL
    const apiUrl = `${STRAPI_BASE_URL}/api/${contentType}?${queryParams.toString()}`;

    // 发送请求
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store', // 禁用缓存
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch preview data: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error(`Error fetching preview data for ${contentType}:`, error);
    throw error;
  }
}

/**
 * 获取特定内容类型的预览数据
 * @param {string} contentType - 内容类型
 * @param {Object} options - 选项
 * @returns {Promise<Object>} 预览数据
 */
export async function getPreviewData(contentType, options = {}) {
  const normalizedContentType = CONTENT_TYPE_MAPPING[contentType] || contentType;
  return await fetchPreviewData(normalizedContentType, options);
}

/**
 * 验证预览请求参数
 * @param {Object} params - 请求参数
 * @returns {Object} 验证结果
 */
export function validatePreviewParams(params) {
  const { contentType, status, locale, documentId } = params;
  
  const errors = [];
  
  if (!contentType) {
    errors.push('contentType is required');
  }
  
  if (status && !['draft', 'live'].includes(status)) {
    errors.push('status must be either "draft" or "live"');
  }
  
  if (locale && !['en', 'zh', 'hk', 'tc'].includes(locale)) {
    errors.push('locale must be one of: en, zh, hk, tc');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 格式化预览数据用于显示
 * @param {Object} data - 原始数据
 * @param {string} contentType - 内容类型
 * @returns {Object} 格式化后的数据
 */
export function formatPreviewData(data, contentType) {
  if (!data) return null;

  const baseData = {
    id: data.id,
    documentId: data.documentId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    publishedAt: data.publishedAt,
    locale: data.locale,
  };

  // 根据内容类型添加特定字段
  switch (contentType) {
    case 'about-us':
      return {
        ...baseData,
        title: data.Title,
        rightContent: data.RightContent,
        leftImage: data.LeftImage,
        ourClients: data.OurClients,
      };
    
    case 'contact-us':
      return {
        ...baseData,
        title: data.Title,
        content: data.Content,
        contactInfo: data.ContactInfo,
        mapLocation: data.MapLocation,
      };
    
    case 'homepage':
      return {
        ...baseData,
        bannerSlides: data.BannerSlides,
        solutionData: data.SolutionData,
        informationData: data.InformationData,
        clientLogoData: data.ClientLogoData,
        awardsData: data.AwardsData,
      };
    
    default:
      return {
        ...baseData,
        ...data, // 包含所有原始字段
      };
  }
}
