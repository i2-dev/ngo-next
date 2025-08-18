/**
 * 緩存管理工具
 * 提供清除緩存和禁用緩存的功能，方便開發和數據更新
 */

// 導入現有的緩存實例
import { homepageDataCache, menuDataCache, newsDataCache } from '@/data/loaders.js';
import { pageDataCache } from '@/data/page-loaders.js';

// 🧹 緩存清理工具
export class CacheManager {
  
  /**
   * 清除所有緩存
   */
  static clearAllCaches() {
    try {
      // 清除應用層緩存
      homepageDataCache.clear();
      menuDataCache.clear(); 
      newsDataCache.clear();
      
      // 清除頁面級緩存
      pageDataCache.clear();
      
      console.log('✅ All caches cleared successfully');
      return { success: true, message: 'All caches cleared' };
    } catch (error) {
      console.error('❌ Error clearing caches:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 清除特定類型的緩存
   */
  static clearSpecificCache(cacheType) {
    try {
      switch (cacheType) {
        case 'homepage':
          homepageDataCache.clear();
          break;
        case 'menu':
          menuDataCache.clear();
          break;
        case 'news':
          newsDataCache.clear();
          break;
        case 'pages':
          pageDataCache.clear();
          break;
        default:
          throw new Error(`Unknown cache type: ${cacheType}`);
      }
      
      console.log(`✅ ${cacheType} cache cleared`);
      return { success: true, message: `${cacheType} cache cleared` };
    } catch (error) {
      console.error(`❌ Error clearing ${cacheType} cache:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 獲取緩存狀態
   */
  static getCacheStatus() {
    return {
      homepage: {
        size: homepageDataCache.size,
        keys: Array.from(homepageDataCache.keys())
      },
      menu: {
        size: menuDataCache.size,
        keys: Array.from(menuDataCache.keys())
      },
      news: {
        size: newsDataCache.size,
        keys: Array.from(newsDataCache.keys())
      },
      pages: {
        size: pageDataCache.size,
        keys: Array.from(pageDataCache.keys())
      }
    };
  }

  /**
   * 清除過期緩存
   */
  static clearExpiredCaches() {
    const now = Date.now();
    let cleared = 0;

    // 清除過期的頁面緩存
    for (const [key, value] of pageDataCache.entries()) {
      if (value.expires <= now) {
        pageDataCache.delete(key);
        cleared++;
      }
    }

    // 清除過期的應用緩存
    [homepageDataCache, menuDataCache, newsDataCache].forEach(cache => {
      for (const [key, value] of cache.entries()) {
        if (value.expires <= now) {
          cache.delete(key);
          cleared++;
        }
      }
    });

    console.log(`✅ Cleared ${cleared} expired cache entries`);
    return { success: true, cleared };
  }
}

// 🔧 開發模式緩存控制
export const DEV_CACHE_CONFIG = {
  enabled: process.env.NODE_ENV === 'production', // 只在生產環境啟用緩存
  shortDuration: 1000, // 1秒 (開發時用)
  normalDuration: 5 * 60 * 1000, // 5分鐘 (測試時用)
};

/**
 * 獲取適當的緩存持續時間
 */
export function getCacheDuration(defaultDuration) {
  if (process.env.NODE_ENV === 'development') {
    return DEV_CACHE_CONFIG.shortDuration;
  }
  return defaultDuration;
}

/**
 * 檢查是否應該使用緩存
 */
export function shouldUseCache() {
  return DEV_CACHE_CONFIG.enabled;
}

/**
 * 獲取 HTTP 緩存控制頭
 */
export function getCacheHeaders(maxAge = 0) {
  if (process.env.NODE_ENV === 'development') {
    // 開發模式：不緩存
    return {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };
  }
  
  // 生產模式：正常緩存
  return {
    'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`
  };
}

export default CacheManager;
