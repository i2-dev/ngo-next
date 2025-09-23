/**
 * Locale normalization utility
 * Centralizes the logic for converting frontend locale codes to Strapi API locale codes
 */

/**
 * Normalize locale for Strapi API
 * @param {string} locale - Frontend locale code
 * @returns {string} - Strapi API locale code
 */
export function normalizeLocaleForStrapi(locale) {
  if (!locale) return 'en';
  
  // Map frontend locale codes to Strapi API locale codes
  const localeMapping = {
    'en': 'en',
    'zh-hant': 'zh-Hant-HK', // Frontend uses zh-hant, API uses zh-Hant-HK
    'zh-hant-hk': 'zh-Hant-HK', // Compatible with old format
    'zhhkhk': 'zh-Hant-HK', // Compatible with old format
    'zh': 'zh-Hant-HK', // Default Chinese to Hong Kong Traditional
    'hk': 'zh-Hant-HK',
    'tc': 'zh-Hant-HK'
  };
  
  const normalized = locale.toLowerCase();
  return localeMapping[normalized] || 'en';
}

/**
 * Normalize locale for frontend
 * @param {string} locale - Strapi API locale code
 * @returns {string} - Frontend locale code
 */
export function normalizeLocaleForFrontend(locale) {
  if (!locale) return 'en';
  
  // Map Strapi API locale codes to frontend locale codes
  const localeMapping = {
    'en': 'en',
    'zh-Hant-HK': 'zh-hant',
    'zhhkhk': 'zh-hant', // Compatible with old format
  };
  
  return localeMapping[locale] || 'en';
}
