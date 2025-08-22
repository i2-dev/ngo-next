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
  'plan': 'plans', // 添加單數形式映射
  'successfuls': 'successfuls'
};

// 预览路由映射
const PREVIEW_ROUTE_MAPPING = {
  'api::about-us.about-us': '/preview/about-us',
  'api::contact-us.contact-us': '/preview/contact-us',
  'api::homepage.homepage': '/preview/homepage',
  'api::information.information': '/preview/ngo-latest-news',
  'api::plan.plan': '/preview/ai-solution', // 将 plan 类型映射到 ai-solution 预览页面
  'api::success-case-detail.success-case-detail': '/preview/e123-elderly-portal', // 成功案例预览
};

// 根据 documentId 映射到具体的预览页面
const DOCUMENT_ID_PREVIEW_MAPPING = {
  'bv6ixplvqu6d9bfkmib5ro51': '/preview/ai-solution', // AI Solution
  'r42zk86ouqoly2l8jpg82psl': '/preview/ai-case-management-platform', // AI Case Management Platform
  // 成功案例的 documentId 映射
  'drsd1m8p9bf2qg1ho1qe4gt4': '/preview/e123-elderly-portal', // e123 長青網
  'voascdjb6gheje5o6v47hgqz': '/preview/brain-training-game', // 智有腦健腦遊戲系統
  'd03bkqtezbu70bm2ez8vuhot': '/preview/e72-elderly-recruitment-system', // e72傲齡動力
  'son36yfriyrwnxs0utdh8s1p': '/preview/coolthinkjc', // Coolthink@JC
  'b8g7kbq1j62qmd5u4mnacpjb': '/preview/i-change-gambling-counseling', // i-Change賭博輔導平台
};

// 预览密钥（可选，用于安全验证）
const PREVIEW_SECRET = process.env.PREVIEW_SECRET || 'efee254c6a8b119e65057678ffa7cf8b2e701d83407596eb813d187c2959c087';

/**
 * 处理预览请求并返回重定向URL
 * @param {Object} params - 预览请求参数
 * @param {string} params.secret - 预览密钥
 * @param {string} params.slug - 文档slug
 * @param {string} params.uid - 内容类型UID
 * @param {string} params.status - 状态 (draft/live)
 * @param {string} params.documentId - 文档ID
 * @param {string} params.locale - 语言
 * @param {string} params.pLevel - 数据填充级别
 * @returns {Object} 处理结果
 */
export function handlePreviewRequest(params) {
  try {
    const { secret, slug, uid, status = 'draft', documentId, locale = 'en', pLevel = '3' } = params;

    console.log('Preview request params:', { secret, slug, uid, status, documentId, locale, pLevel });

    // 验证密钥（如果设置了的话）
    if (PREVIEW_SECRET && secret !== PREVIEW_SECRET) {
      console.error('Invalid preview secret');
      return {
        success: false,
        error: 'Invalid preview secret',
        status: 401
      };
    }

    // 验证必要参数
    if (!uid) {
      console.error('Missing uid parameter');
      return {
        success: false,
        error: 'Missing uid parameter',
        status: 400
      };
    }

    // 根据内容类型决定预览路径
    let previewPath = PREVIEW_ROUTE_MAPPING[uid];
    
    // 如果是 plan 类型，根据 documentId 进一步映射
    if (uid === 'api::plan.plan' && documentId) {
      const specificPath = DOCUMENT_ID_PREVIEW_MAPPING[documentId];
      if (specificPath) {
        previewPath = specificPath;
      }
    }
    
    // 如果是 success-case-detail 类型，根据 documentId 进一步映射
    if (uid === 'api::success-case-detail.success-case-detail' && documentId) {
      const specificPath = DOCUMENT_ID_PREVIEW_MAPPING[documentId];
      if (specificPath) {
        previewPath = specificPath;
      }
    }
    
    if (!previewPath) {
      console.error('Unsupported content type:', uid);
      return {
        success: false,
        error: 'Unsupported content type',
        status: 400
      };
    }

    // 构建预览 URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const queryParams = new URLSearchParams({
      status,
      locale,
      pLevel,
    });

    // 添加 documentId 或 slug
    if (documentId) {
      queryParams.append('documentId', documentId);
    } else if (slug) {
      queryParams.append('documentId', slug);
    }

    // 特殊处理：如果是 information 类型，需要添加 ID 到路径
    if (uid === 'api::information.information' && documentId) {
      previewPath = `${previewPath}/${documentId}`;
    }

    const previewUrl = `${baseUrl}${previewPath}?${queryParams.toString()}`;
    
    console.log('Generated preview URL:', previewUrl);

    return {
      success: true,
      redirectUrl: previewUrl,
      status: 200
    };

  } catch (error) {
    console.error('Error in preview request handler:', error);
    return {
      success: false,
      error: 'Internal server error',
      status: 500
    };
  }
}

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
 * 获取首页新闻数据
 * @param {string} locale - 语言
 * @param {Object} options - 选项
 * @param {string} options.status - 状态 (draft/live)
 * @returns {Promise<Object>} 新闻数据
 */
export async function getPreviewNewsData(locale = 'en', options = {}) {
  const { status = 'draft' } = options;
  
  try {
    // 构建查询参数
    const queryParams = new URLSearchParams();
    queryParams.append('status', status);
    queryParams.append('locale', locale);
    queryParams.append('pLevel', '3');
    queryParams.append('populate[0]', 'image');
    queryParams.append('populate[1]', 'information_category');
    queryParams.append('pagination[page]', '1');
    queryParams.append('pagination[pageSize]', '3');
    queryParams.append('sort[0]', 'Publish:desc');

    // 构建API URL
    const apiUrl = `${STRAPI_BASE_URL}/api/informations?${queryParams.toString()}`;

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
      throw new Error(`Failed to fetch news data: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    // 格式化数据，只返回首页需要的字段
    return {
      data: result.data?.map(news => ({
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
          total: result.meta?.pagination?.total || 0
        }
      }
    };

  } catch (error) {
    console.error('Error fetching preview news data:', error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 3, total: 0 } } };
  }
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
        enquiryPhone: data.EnquiryPhone,
        address: data.Address,
        mapUrl: data.MapUrl,
        image: data.Image,
        form: data.form,
      };
    
    case 'homepage':
      return {
        ...baseData,
        Blocks: data.Blocks, // 添加Blocks字段
        bannerSlides: data.BannerSlides,
        solutionData: data.SolutionData,
        informationData: data.InformationData,
        clientLogoData: data.ClientLogoData,
        awardsData: data.AwardsData,
      };
    
    case 'informations':
      return {
        ...baseData,
        title: data.Title,
        content: data.Content,
        authorSummary: data.Author_Summary,
        publish: data.Publish,
        image: data.image,
        information_category: data.information_category,
      };
    
    case 'plans':
      return {
        ...baseData,
        title: data.Title,
        content: data.Content,
        order: data.Order,
        icon: data.icon,
        image: data.Image,
        button: data.Button,
        blocks: data.Blocks || [],
      };
    
    case 'successful':
      return {
        ...baseData,
        title: data.Title,
        content: data.Content,
        order: data.Order,
        icon: data.icon,
        image: data.Image,
        button: data.Button,
        blocks: data.Blocks || [],
      };
    
    case 'successfuls':
      return {
        ...baseData,
        title: data.Title,
        content: data.Content,
        order: data.Order,
        icon: data.Icon,
        background: data.Background,
        button: data.Button,
        card: data.Card || [],
        screenshot: data.image || [],
      };
    
    default:
      return {
        ...baseData,
        ...data, // 包含所有原始字段
      };
  }
}
