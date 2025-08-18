"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import ClientOnly from "@/components/ClientOnly";

export default function MenuClient({ menuData, locale = 'en' }) {
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  if (!menuData || !menuData.data) {
    return null;
  }

  // 格式化 URL，確保包含語言前綴
  const formatUrl = (url) => {
    if (!url) return url;
    
    // 如果URL已經包含語言前綴，直接返回
    if (url.startsWith(`/${locale}/`) || url === '/') {
      return url;
    }
    
    // 如果URL以/開頭但沒有語言前綴，添加語言前綴
    if (url.startsWith('/')) {
      return `/${locale}${url}`;
    }
    
    // 其他情況，直接添加語言前綴
    return `/${locale}/${url}`;
  };

  // 檢查菜單項是否為當前活動頁面
  const isActiveMenuItem = (menuUrl) => {
    if (!menuUrl) return false;
    
    const formattedUrl = formatUrl(menuUrl);
    
    // 精確匹配當前路徑
    if (pathname === formattedUrl) {
      return true;
    }
    
    // 對於首頁的特殊處理
    if (formattedUrl === `/${locale}` && pathname === `/${locale}`) {
      return true;
    }
    
    return false;
  };

  const toggleSubMenu = (index) => {
    setOpenSubMenu(openSubMenu === index ? null : index);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-transparent relative">
      <div className="relative">
        {/* 桌面菜单 */}
        <ul className="hidden md:flex items-center space-x-6">
          {menuData.data
            .sort((a, b) => (a.Order || 0) - (b.Order || 0))
            .map((menuItem, index) => (
            <li key={menuItem.id} className="relative group">
              {/* 主菜单项 */}
              {menuItem.URL ? (
                <Link
                  href={formatUrl(menuItem.URL)}
                  className={`font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                    isActiveMenuItem(menuItem.URL)
                      ? 'text-blue-600 font-semibold'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {menuItem.title}
                </Link>
              ) : (
                <div className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors duration-200 whitespace-nowrap cursor-pointer flex items-center">
                  {menuItem.title}
                  {menuItem.items && menuItem.items.length > 0 && (
                    <svg
                      className="ml-1 h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              )}

              {/* 子菜单 - hover显示 */}
              {menuItem.items && menuItem.items.length > 0 && (
                <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute left-0 top-full mt-1 w-64 bg-white shadow-lg rounded-lg border z-50 transition-all duration-200">
                  <ul className="py-2">
                    {menuItem.items
                      .sort((a, b) => (a.Order || 0) - (b.Order || 0))
                      .map((subItem) => (
                        <li key={subItem.id}>
                          <Link
                            href={formatUrl(subItem.url)}
                            target={subItem.Target || "_self"}
                            className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                              isActiveMenuItem(subItem.url)
                                ? 'text-blue-600 bg-blue-50 font-semibold'
                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                          >
                            {subItem.Label}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* 移动端菜单按钮 */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* 移动端菜单 - Wrapped in ClientOnly to prevent hydration issues */}
        <ClientOnly fallback={null}>
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
              <ul className="py-4 space-y-2 px-4">
                {menuData.data
                  .sort((a, b) => (a.Order || 0) - (b.Order || 0))
                  .map((menuItem, index) => (
                  <li key={menuItem.id}>
                    {/* 主菜单项 */}
                    {menuItem.URL ? (
                      <Link
                        href={formatUrl(menuItem.URL)}
                        className={`block py-2 transition-colors duration-200 ${
                          isActiveMenuItem(menuItem.URL)
                            ? 'text-blue-600 font-semibold'
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {menuItem.title}
                      </Link>
                    ) : (
                      <button
                        onClick={() => toggleSubMenu(index)}
                        className="w-full text-left py-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 flex items-center justify-between"
                      >
                        {menuItem.title}
                        {menuItem.items && menuItem.items.length > 0 && (
                          <svg
                            className={`h-4 w-4 transform transition-transform duration-200 ${
                              openSubMenu === index ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </button>
                    )}

                    {/* 子菜单 - 移动版 */}
                    {menuItem.items && menuItem.items.length > 0 && openSubMenu === index && (
                      <ul className="ml-4 mt-2 space-y-1">
                        {menuItem.items
                          .sort((a, b) => (a.Order || 0) - (b.Order || 0))
                          .map((subItem) => (
                            <li key={subItem.id}>
                              <Link
                                href={formatUrl(subItem.url)}
                                target={subItem.Target || "_self"}
                                className={`block py-2 text-sm transition-colors duration-200 ${
                                  isActiveMenuItem(subItem.url)
                                    ? 'text-blue-600 font-semibold'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                                onClick={() => {
                                  setOpenSubMenu(null);
                                  setIsMobileMenuOpen(false);
                                }}
                              >
                                {subItem.Label}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ClientOnly>
      </div>
    </nav>
  );
}