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
    <div className={`${isFixed ? 'fixed bottom-30 right-8 z-40' : ''} ${className}`}>
      <div className="flex flex-col space-y-10 w-[175px]">
        {/* 促銷按鈕 - 橙色 */}
        <Link
          href="/contact-us"
          className="group bg-[#ef8d4a] hover:bg-[#c65200] text-white text-[18px]/[1.2] rounded-[8px_8px_0] p-[0_11px_15px_18px] relative transition-all duration-300 transform"
          title={t.chatbotTitle}
        >
          {/* 促銷標籤 */}
          <span className="bg-white text-[#4ac36d] text-2xl font-bold p-2.5 rounded-full flex justify-center items-center w-17 h-17 -mt-8.5 mb-0.5">
            {t.promo}
          </span>          
          <span className="font-bold leading-tight">
            {t.promoText}
          </span><br/>          
          {t.promoSubtext}          
        </Link>

        {/* 主網站按鈕 - 紫色漸變 */}
        <Link
          href="https://www.i2hk.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-linear-[#7d73f3_0%,#b379d2_50%,#e777af_100%] text-white text-center rounded-full px-6 py-4 transition-all duration-300 transform hover:scale-105"
          title={t.mainSiteTitle}
        >          
          {t.mainSite}          
        </Link>
      </div>
    </div>
  );
}
