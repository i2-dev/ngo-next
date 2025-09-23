"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SUPPORTED_LOCALES, getLocaleName } from '@/utils/locales';
import { getTranslation } from '@/utils/translations';

export default function LanguageSwitcher({ currentLocale = 'en' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // 支援的語言：英文和繁體中文(香港)
  const availableLocales = SUPPORTED_LOCALES;
  
  // 使用統一翻譯系統獲取語言名稱
  const getLocalizedLocaleName = (locale) => {
    if (locale === 'en') {
      return getTranslation(currentLocale, 'common', 'english', 'English');
    } else if (locale === 'zh-hant') {
      return getTranslation(currentLocale, 'common', 'traditionalChinese', '繁體');
    }
    return getLocaleName(locale);
  };

  // 關閉下拉選單當點擊外部
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 生成新語言的路徑
  const generateNewPath = (newLocale) => {
    const pathSegments = pathname.split('/');
    pathSegments[1] = newLocale; // 替換語言代碼
    return pathSegments.join('/');
  };

  // 處理語言切換
  const handleLanguageChange = (newLocale) => {
    if (newLocale !== currentLocale) {
      const newPath = generateNewPath(newLocale);
      router.push(newPath);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 語言切換按鈕 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border border-transparent hover:border-gray-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* 地球圖標 */}
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" 
          />
        </svg>
        
        {/* 當前語言 */}
        <span className="hidden md:inline">
          {getLocalizedLocaleName(currentLocale)}
        </span>
        <span className="md:hidden text-xs">
          {currentLocale === 'en' ? 'EN' : '繁'}
        </span>
        
        {/* 下拉箭頭 */}
        <svg 
          className={`w-3 h-3 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </button>

      {/* 下拉選單 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 border border-gray-100 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {availableLocales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 first:rounded-t-lg last:rounded-b-lg ${
                  locale === currentLocale
                    ? 'bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                role="menuitem"
              >
                <div className="flex items-center space-x-3">
                  {/* 語言標誌 */}
                  <span className="flex-1">
                    {getLocalizedLocaleName(locale)}
                  </span>
                  {locale === currentLocale && (
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
