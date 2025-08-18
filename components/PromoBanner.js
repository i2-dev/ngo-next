'use client';

import Link from 'next/link';

export default function PromoBanner({
  locale = 'en',
  className = "",
  position = "fixed" // "fixed" 或 "relative"
}) {
  const isFixed = position === "fixed";

  // 多語言文本
  const text = {
    en: {
      promo: "Free!",
      promoText: "Free NGO AI Chatbot for One Year!",
      promoSubtext: "Inquire Now",
      mainSite: "Visit Our i2 Main Website >",
      chatbotTitle: "Get Your Free AI Chatbot",
      mainSiteTitle: "Explore Our Services"
    },
    zh: {
      promo: "送！",
      promoText: "NGO可免費用 AI Chatbot 一年！",
      promoSubtext: "請即查詢",
      mainSite: "Visit Our i2 Main Website >",
      chatbotTitle: "獲取免費AI聊天機器人",
      mainSiteTitle: "探索我們的服務"
    }
  };

  const t = text[locale] || text.en;

  return (
    <div className={`${isFixed ? 'fixed bottom-24 right-4 z-40' : ''} ${className}`}>
      <div className="flex flex-col gap-4 w-[175px]">
        {/* 促銷按鈕 - 橙色 */}
        <Link
          href="/contact-us"
          className="group bg-[#ef8d4a] hover:bg-[#c65200] text-white rounded-[8px_8px_0] p-[0_11px_15px_18px] relative  shadow-lg transition-all duration-300 transform"
          title={t.chatbotTitle}
        >
          {/* 促銷標籤 */}
          <div className="absolute -top-2 -left-2 bg-white text-green-500 font-bold text-sm px-3 py-1 rounded-full shadow-md border-2 border-green-500">
            {t.promo}
          </div>

          <div className="pt-2">
            <div className="font-bold text-sm leading-tight mb-2">
              {t.promoText}
            </div>
            <div className="text-xs opacity-90">
              {t.promoSubtext}
            </div>
          </div>

          {/* Hover 效果 */}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"></div>
        </Link>

        {/* 主網站按鈕 - 紫色漸變 */}
        <Link
          href="https://www.i2hk.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 py-4 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-center"
          title={t.mainSiteTitle}
        >
          <div className="font-medium text-sm">
            {t.mainSite}
          </div>
        </Link>
      </div>
    </div>
  );
}
