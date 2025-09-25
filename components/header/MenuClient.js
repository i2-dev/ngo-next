"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ClientOnly from "@/components/ClientOnly";
import { DEFAULT_LOCALE, isValidLocale } from "@/utils/locales";

export default function MenuClient({ menuData, locale = 'en' }) {
  const [isClient, setIsClient] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(96);
  const pathname = usePathname();
  
  const currentlocale = isValidLocale(locale) ? locale : DEFAULT_LOCALE;

  // 防止 Hydration 錯誤：客戶端檢查
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.getElementById('header');
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    window.addEventListener('scroll', updateHeaderHeight);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      window.removeEventListener('scroll', updateHeaderHeight);
    };
  }, []);

  // 防止 Hydration 錯誤：服務端渲染時返回 null，避免顯示空框架
  if (!isClient) {
    return null;
  }

  if (!menuData || !menuData.data) {
    return null;
  }

  // 格式化 URL，確保包含語言前綴
  const formatUrl = (url) => {
    if (!url) return url;
    
    // 如果URL已經包含語言前綴，直接返回
    if (url.startsWith(`/${locale}/`)) {
      return url;
    }
    
    // 如果URL是根路徑，返回當前語言的根路徑
    if (url === '/') {
      return `/${locale}`;
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
      <div className="relative lg:static">
        {/* 桌面菜单 */}
        <ul className="hidden lg:flex items-center">
          {menuData.data
            .sort((a, b) => (a.Order || 0) - (b.Order || 0))
            .map((menuItem, index) => ( 
            <li key={menuItem.id} className={`relative group ${currentlocale === 'en' ? '' : 'tracking-[2px]'}`}>
              {/* 主菜单项 */}
              {menuItem.URL ? (
                <Link
                  href={formatUrl(menuItem.URL)}
                  className={`font-medium transition-colors duration-200 whitespace-nowrap px-2.5 xl:px-3.5 ${
                    isActiveMenuItem(menuItem.URL)
                      ? 'text-[#2a7115]'
                      : 'text-[#3a4148] hover:text-[#2a7115]'
                  }`}
                >
                  {menuItem.title}
                </Link>
              ) : (
                <div className="text-[#3a4148] hover:text-[#2a7115] font-medium px-2.5 xl:px-3.5 transition-colors duration-200 whitespace-nowrap cursor-pointer flex items-center">
                  {menuItem.title}
                </div>
              )}

              {/* 子菜单 - hover显示 */}
              {menuItem.items && menuItem.items.length > 0 && (
                <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute left-0 top-full pt-8 w-79 z-50 transition-all duration-200">
                  <ul className="p-2.5 bg-white shadow-[0_19px_35px_rgba(0,0,0,.11)] border-t-[#eee_1px_soild]">
                    {menuItem.items
                      .sort((a, b) => (a.Order || 0) - (b.Order || 0))
                      .map((subItem) => (
                        <li key={subItem.id} >
                          <Link
                            href={formatUrl(subItem.url)}
                            target={subItem.Target || "_self"}
                            className={`font-medium block px-1.5 py-2.5 text-lg transition-colors duration-200 ${
                              isActiveMenuItem(subItem.url)
                                ? 'text-[#2a7115]'
                                : 'text-[#636363] hover:text-[#2a7115]'
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
        <div className="lg:hidden relative z-40">
          <button
            onClick={toggleMobileMenu}
            className="text-[#3a4148] focus:outline-none p-1.5"
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
          <div 
            className={`lg:hidden fixed inset-0 bg-[#198282] z-[9999] overflow-y-auto transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100vh' }}
          >
              {/* 关闭按钮 */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-7 right-5.5 text-white hover:text-gray-300 transition-colors duration-200 z-[10000]"
              >
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex justify-center items-center p-12 h-full" style={{ paddingTop: '80px' }}>
                <ul className="py-4 space-y-2">
                {menuData.data
                  .sort((a, b) => (a.Order || 0) - (b.Order || 0))
                  .map((menuItem, index) => (
                  <li key={menuItem.id}>
                    {/* 主菜单项 */}
                    {menuItem.URL ? (
                      <Link
                        href={formatUrl(menuItem.URL)}
                        className={`text-[22px] inline-block mb-3 transition-colors duration-200 ${
                          isActiveMenuItem(menuItem.URL)
                            ? 'text-white border-b-2 border-white'
                            : 'text-white'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {menuItem.title}
                      </Link>
                    ) : (
                      <button
                        onClick={() => toggleSubMenu(index)}
                        className="text-[22px] w-full text-left text-white mb-3 transition-colors duration-200 flex items-center justify-between"
                      >
                        {menuItem.title}
                        {menuItem.items && menuItem.items.length > 0 && (
                          <svg
                            className={`h-6 w-6 transform transition-transform duration-200 ${
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
                    {menuItem.items && menuItem.items.length > 0 && (
                      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        openSubMenu === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <ul className="pl-5 space-y-3 pb-3">
                          {menuItem.items
                            .sort((a, b) => (a.Order || 0) - (b.Order || 0))
                            .map((subItem) => (
                              <li key={subItem.id}>
                                <Link
                                  href={formatUrl(subItem.url)}
                                  target={subItem.Target || "_self"}
                                  className={`inline-block relative transition-colors duration-200 ${
                                    isActiveMenuItem(subItem.url)
                                      ? 'text-white before:absolute before:-bottom-1 before:w-full before:h-0.5 before:bg-white'
                                      : 'text-white'
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
                      </div>
                    )}
                  </li>
                ))}
                </ul>
              </div>
            </div>
        </ClientOnly>
      </div>
    </nav>
  );
}