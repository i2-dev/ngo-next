/**
 * API 分類配置系統
 * 定義每個頁面所需的 API 資源，實現按需加載
 */

// 🎯 頁面 API 配置映射
export const PAGE_API_CONFIG = {
  // 首頁需要的 API
  homepage: {
    apis: ['homepage', 'menus'],
    description: '首頁橫幅、解決方案、資訊等內容 + 導航菜單',
    cacheDuration: 15 * 60 * 1000, // 15分鐘
    priority: 'high'
  },

  // 關於我們頁面
  aboutus: {
    apis: ['menus', 'about-us'],
    description: '導航菜單 + 關於我們頁面內容',
    cacheDuration: 30 * 60 * 1000, // 30分鐘 (靜態內容更新較少)
    priority: 'medium'
  },

  // 聯絡我們頁面
  'contact-us': {
    apis: ['menus', 'contact-us'],
    description: '導航菜單 + 聯絡我們頁面內容',
    cacheDuration: 30 * 60 * 1000, // 30分鐘
    priority: 'medium'
  },

  // 新聞/資訊列表頁面
  news: {
    apis: ['menus', 'informations', 'information-categories'],
    description: '導航菜單 + 新聞列表 + 新聞分類',
    cacheDuration: 10 * 60 * 1000, // 10分鐘 (新聞更新較頻繁)
    priority: 'medium'
  },

  // 新聞詳情頁面
  'news-detail': {
    apis: ['menus', 'informations'],
    description: '導航菜單 + 特定新聞內容',
    cacheDuration: 20 * 60 * 1000, // 20分鐘
    priority: 'medium'
  },

  // 服務頁面
  services: {
    apis: ['menus', 'services-page'],
    description: '導航菜單 + 服務頁面內容',
    cacheDuration: 30 * 60 * 1000, // 30分鐘
    priority: 'medium'
  },

  // 數碼方案頁面
  'digital-solutions': {
    apis: ['menus', 'plans'],
    description: '導航菜單 + 數碼方案內容',
    cacheDuration: 30 * 60 * 1000, // 30分鐘
    priority: 'medium'
  },

  // 成功案例個別頁面 (通過數碼方案類似的邏輯處理)
  'success-case-detail': {
    apis: ['menus', 'successfuls'],
    description: '導航菜單 + 成功案例詳細內容',
    cacheDuration: 30 * 60 * 1000, // 30分鐘
    priority: 'medium'
  }
};

// 🔧 API 端點配置
export const API_ENDPOINTS = {
  homepage: {
    endpoint: 'homepage',
    populateLevel: 6,
    description: '首頁所有區塊內容（橫幅、解決方案、資訊等）'
  },
  
  menus: {
    endpoint: 'menus',
    populateLevel: 3,
    description: '網站導航菜單'
  },
  
  'about-us': {
    endpoint: 'about-us',
    populateLevel: 4,
    description: '關於我們頁面內容'
  },
  
  'contact-us': {
    endpoint: 'contact-us',
    populateLevel: 3,
    description: '聯絡我們頁面內容'
  },
  
  informations: {
    endpoint: 'informations',
    populateLevel: 3,
    description: '新聞/資訊內容'
  },
  
  'information-categories': {
    endpoint: 'information-categories',
    populateLevel: 1,
    description: '新聞/資訊分類'
  },
  
  'services-page': {
    endpoint: 'services-page',
    populateLevel: 4,
    description: '服務頁面內容'
  },
  
  plans: {
    endpoint: 'plans',
    populateLevel: 5,
    description: '數碼方案內容'
  },
  
  successfuls: {
    endpoint: 'successfuls',
    populateLevel: 10,
    description: '成功案例內容'
  }
};

// 🚦 獲取頁面所需的 API 配置
export function getPageApiConfig(pageName) {
  const config = PAGE_API_CONFIG[pageName];
  if (!config) {
    console.warn(`⚠️ No API config found for page: ${pageName}, using default menu only`);
    return {
      apis: ['menus'],
      description: '僅導航菜單（默認配置）',
      cacheDuration: 30 * 60 * 1000,
      priority: 'low'
    };
  }
  return config;
}

// 🎨 獲取 API 端點詳細配置
export function getApiEndpointConfig(apiName) {
  const config = API_ENDPOINTS[apiName];
  if (!config) {
    console.warn(`⚠️ No endpoint config found for API: ${apiName}`);
    return {
      endpoint: apiName,
      populateLevel: 3,
      description: '未配置的API端點'
    };
  }
  return config;
}

// 📊 分析 API 使用情況
export function analyzeApiUsage() {
  const usage = {};
  
  Object.entries(PAGE_API_CONFIG).forEach(([pageName, config]) => {
    config.apis.forEach(apiName => {
      if (!usage[apiName]) {
        usage[apiName] = {
          pages: [],
          totalPages: 0,
          priority: 'low'
        };
      }
      usage[apiName].pages.push(pageName);
      usage[apiName].totalPages++;
      
      // 設定API優先級（被最多頁面使用的API優先級更高）
      if (usage[apiName].totalPages >= 3) {
        usage[apiName].priority = 'high';
      } else if (usage[apiName].totalPages >= 2) {
        usage[apiName].priority = 'medium';
      }
    });
  });
  
  return usage;
}

// 🔍 根據路由路徑推斷頁面名稱
export function inferPageNameFromPath(pathname) {
  // 移除語言前綴 (如 /zh/, /en/)
  const cleanPath = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?\//, '/').replace(/^\//, '');
  
  // 路徑映射
  const pathMapping = {
    '': 'homepage',
    'aboutus': 'aboutus',
    'contact-us': 'contact-us',
    'news': 'news',
    'services': 'services',
    'digital-solutions': 'digital-solutions'
  };
  
  // 檢查動態路由（如 news/[slug]）
  if (cleanPath.startsWith('news/') && cleanPath.length > 5) {
    return 'news-detail';
  }
  
  return pathMapping[cleanPath] || 'homepage';
}

// 📈 性能監控配置
export const PERFORMANCE_CONFIG = {
  enableLogging: process.env.NODE_ENV === 'development',
  logThreshold: 1000, // 超過1秒記錄警告
  
  // 性能指標
  metrics: {
    apiCallCount: 0,
    totalLoadTime: 0,
    cacheHitRate: 0,
    avgResponseTime: 0
  }
};

// 🛠️ 開發工具函數
export function logApiConfig() {
  if (PERFORMANCE_CONFIG.enableLogging) {
    // console.group('🎯 API Configuration Summary');
    
    console.table(Object.entries(PAGE_API_CONFIG).map(([page, config]) => ({
      頁面: page,
      所需API: config.apis.join(', '),
      快取時間: `${config.cacheDuration / 1000 / 60}分鐘`,
      優先級: config.priority
    })));
    
    console.groupEnd();
    
    console.group('📊 API Usage Analysis');
    console.table(analyzeApiUsage());
    console.groupEnd();
  }
}
