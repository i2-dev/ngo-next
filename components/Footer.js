import Link from "next/link";
import styles from "@/styles/Footer.module.css";

export default function Footer({ locale = 'en' }) {
  // 自动获取当前年份
  const currentYear = new Date().getFullYear();
  
  // 根据语言设置内容
  const content = {
    en: {
      copyright: `I2 COMPANY LIMITED All Rights Reserved © 2006-${currentYear}`,
      sitemap: "Site Map",
      accessibility: "Accessibility"
    },
    "zh-hant": {
      copyright: `I2 COMPANY LIMITED 版權所有 © 2006-${currentYear}`,
      sitemap: "網頁指南", 
      accessibility: "無障礙瀏覽"
    },
    "zh-Hant": {
      copyright: `I2 COMPANY LIMITED 版權所有 © 2006-${currentYear}`,
      sitemap: "網頁指南", 
      accessibility: "無障礙瀏覽"
    }
  };

  const currentContent = content[locale] || content.en;

  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-5.5 mt-auto">
      <div className="xl:container xl:max-w-[1280px] xl:mx-auto px-4 max-[1399px]:pr-18">
        <div className="flex flex-col-reverse justify-between items-start gap-4 md:flex-row md:items-center md:gap-0">
          {/* Copyright Information */}
          <div className="text-sm text-gray-600">
            {currentContent.copyright}
          </div>
          
          {/* Links and Social Media */}
          <div className="flex flex-col md:flex-row items-start space-y-2.5 md:items-center md:space-y-0 md:space-x-5">
            {/* Website Guide and Accessibility Links */}
            <div className="flex items-center space-x-5 text-sm">
              <Link 
                href={`/${locale}/sitemap`} 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {currentContent.sitemap}
              </Link>
              <Link 
                href={`/${locale}/accessibility`} 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {currentContent.accessibility}
              </Link>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex items-center space-x-5">
              <Link 
                href="https://www.facebook.com/i2hongkong/" 
                target="_blank" 
                className="text-gray-600 hover:text-[#1773ea] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Link>
              <Link 
                href="https://www.youtube.com/channel/UCIs5MfXVvK-D-4CT3_vaAKg" 
                target="_blank" 
                className="text-gray-600 hover:text-[#f70000] transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}