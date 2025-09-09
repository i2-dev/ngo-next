/**
 * Strapi URL 工具函數
 * 統一管理 Strapi API 的 URL 構建
 * 
 * @deprecated 請使用 config/api-config.js 中的函數
 */

import { STRAPI_CONFIG, getStrapiApiUrl, buildPreviewApiUrl as newBuildPreviewApiUrl } from '@/config/api-config';

const STRAPI_BASE_URL = STRAPI_CONFIG.BASE_URL;

export function getStrapiURL(path = "") {
  return `${STRAPI_BASE_URL}${path}`;
}

/**
 * 構建 API URL
 * @param {string} endpoint - API 端點 (例如: 'informations', 'plans')
 * @param {string|number} id - 可選的 ID
 * @param {Object} params - 查詢參數
 * @returns {string} 完整的 API URL
 */
export function buildApiUrl(endpoint, id = null, params = {}) {
  let url = `${STRAPI_BASE_URL}/api/${endpoint}`;
  
  if (id) {
    url += `/${id}`;
  }
  
  if (Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryParams.append(key, value);
      }
    });
    url += `?${queryParams.toString()}`;
  }
  
  return url;
}

/**
 * 構建預覽 API URL
 * @param {string} endpoint - API 端點
 * @param {string|number} id - 可選的 ID
 * @param {Object} options - 預覽選項
 * @returns {string} 預覽 API URL
 * 
 * @deprecated 請使用 config/api-config.js 中的 buildPreviewApiUrl
 */
export function buildPreviewApiUrl(endpoint, id = null, options = {}) {
  return newBuildPreviewApiUrl(endpoint, id, options);
}

/**
 * 獲取 Strapi 基礎 URL
 * @returns {string} Strapi 基礎 URL
 */
export function getStrapiBaseUrl() {
  return STRAPI_BASE_URL;
}