"use client";

import { useState, useEffect } from 'react';
import MenuClient from "@/components/header/MenuClient";
import ClientOnly from "../ClientOnly";

/**
 * 優化的 MenuWrapper - 支持從頁面數據中獲取菜單數據
 * 避免重複的 API 調用，實現真正的按需加載
 */
export default function MenuWrapper({ menuData = null, locale = 'en', fallbackToApi = false }) {
  // 如果已有菜單數據，直接使用（來自頁面加載器）
  if (menuData) {
    return <MenuClient menuData={menuData} locale={locale} />;
  }
  
  // 如果沒有菜單數據且不允許回退到API，返回 null 避免顯示框架
  if (!fallbackToApi) {
    return null;
  }
  
  // 回退到獨立的API調用（舊版兼容）- 使用 ClientOnly 確保只在客戶端渲染
  return (
    <ClientOnly fallback={null}>
      <MenuWithFallback locale={locale} />
    </ClientOnly>
  );
}

// 菜單佔位符組件 - 確保服務器端和客戶端渲染一致
function MenuPlaceholder() {
  return (
    <nav className="bg-transparent relative">
      <div className="hidden md:flex items-center space-x-6">
        <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-6 w-20 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-6 w-18 bg-gray-200 animate-pulse rounded"></div>
      </div>
      <div className="md:hidden">
        <div className="h-6 w-6 bg-gray-200 animate-pulse rounded"></div>
      </div>
    </nav>
  );
}

// 回退到API的菜單組件（舊版兼容）- 改為客戶端組件
function MenuWithFallback({ locale }) {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setLoading(true);
        // 動態導入以避免循環依賴
        const { getMenuData } = await import("@/data/unified-loader");
        const data = await getMenuData(locale);
        setMenuData(data);
      } catch (err) {
        console.error("Error loading menu with fallback:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, [locale]);

  if (loading) {
    return null;
  }

  if (error || !menuData) {
    return null;
  }

  return <MenuClient menuData={menuData} locale={locale} />;
}