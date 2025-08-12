// 支持的语言列表
export const SUPPORTED_LOCALES = ['en', 'zh', 'zh-CN', 'zh-Hant'];

// 默认语言
export const DEFAULT_LOCALE = 'en';

// 验证语言是否有效
export function isValidLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale);
}

// 获取语言名称
export function getLocaleName(locale) {
  const names = {
    'en': 'English',
    'zh': '中文',
    'zh-CN': '简体中文',
    'zh-Hant': '繁體中文'
  };
  return names[locale] || names[DEFAULT_LOCALE];
}