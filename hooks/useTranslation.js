"use client";

import { useMemo } from 'react';
import { getTranslation, getCopyrightText } from '@/utils/translations';

// 自定義 hook 用於獲取翻譯
export function useTranslation(locale = 'en') {
  return useMemo(() => {
    return {
      // 通用翻譯函數
      t: (category, key, fallback = '') => getTranslation(locale, category, key, fallback),
      
      // 常用翻譯的快捷方式
      common: {
        sitemap: getTranslation(locale, 'common', 'sitemap'),
        accessibility: getTranslation(locale, 'common', 'accessibility'),
        aboutUs: getTranslation(locale, 'common', 'aboutUs'),
        contactUs: getTranslation(locale, 'common', 'contactUs'),
        copyright: getTranslation(locale, 'common', 'copyright'),
        inquireNow: getTranslation(locale, 'common', 'inquireNow'),
        visitMainSite: getTranslation(locale, 'common', 'visitMainSite'),
        getFreeChatbot: getTranslation(locale, 'common', 'getFreeChatbot'),
        exploreServices: getTranslation(locale, 'common', 'exploreServices'),
        free: getTranslation(locale, 'common', 'free'),
        freeNgoChatbot: getTranslation(locale, 'common', 'freeNgoChatbot'),
        english: getTranslation(locale, 'common', 'english'),
        traditionalChinese: getTranslation(locale, 'common', 'traditionalChinese'),
        usingBackupData: getTranslation(locale, 'common', 'usingBackupData'),
        placeholderNotice: getTranslation(locale, 'common', 'placeholderNotice')
      },
      
      // 頁面特定翻譯
      pages: {
        aboutUs: {
          title: getTranslation(locale, 'pages', 'aboutUs', 'title'),
          metaTitle: getTranslation(locale, 'pages', 'aboutUs', 'metaTitle'),
          metaDescription: getTranslation(locale, 'pages', 'aboutUs', 'metaDescription')
        }
      },
      
      // 版權文字生成
      getCopyrightText: (companyName, startYear) => getCopyrightText(locale, companyName, startYear)
    };
  }, [locale]);
}

export default useTranslation;
