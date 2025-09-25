'use client';

import Link from 'next/link';
import { getTranslation } from '@/utils/translations';

export default function PromoBanner({
  locale = 'en',
  className = "",
  position = "fixed" // "fixed" 或 "relative"
}) {
  const isFixed = position === "fixed";

  // 使用統一翻譯系統
  const promo = getTranslation(locale, 'common', 'free');
  const promoText = getTranslation(locale, 'common', 'freeNgoChatbot');
  const promoSubtext = getTranslation(locale, 'common', 'inquireNow');
  const mainSite = getTranslation(locale, 'common', 'visitMainSite');
  const chatbotTitle = getTranslation(locale, 'common', 'getFreeChatbot');
  const mainSiteTitle = getTranslation(locale, 'common', 'exploreServices');

  return (
    <div className={`${isFixed ? 'fixed bottom-16 right-5 z-40 md:bottom-21' : ''} ${className}`}>
      <div className="flex flex-col space-y-5 w-[142px] md:w-[175px] md:space-y-10">
        {/* 促銷按鈕 - 橙色 */}
        <Link
          href="/contact-us"
          className="group bg-[#ef8d4a] hover:bg-[#c65200] text-white text-[16px]/[1.35] rounded-[6px_6px_0] p-[0_9px_15px_16px] relative transition-all duration-300 transform md:[18px]/[1.2] md:rounded-[8px_8px_0] md:p-[0_11px_15px_18px]"
          title={chatbotTitle}
        >
          {/* 促銷標籤 */}
          <span className={`bg-white text-[#4ac36d] text-base font-bold p-2.5 rounded-full flex justify-center items-center w-13.5 h-13.5 -mt-8.5 mb-0.5 ${locale === 'en' ? 'md:text-xl' : 'md:text-2xl pr-0.5'} md:w-17 md:h-17`}>
            {promo}
          </span>          
          <span className="font-bold leading-tight">
            {promoText}
          </span><br/>          
          {promoSubtext}          
        </Link>

        {/* 主網站按鈕 - 紫色漸變 */}
        <Link
          href="https://www.i2hk.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-linear-[#7d73f3_0%,#b379d2_50%,#e777af_100%] text-white text-[16px] text-center rounded-full px-2.5 py-3 transition-all duration-300 transform hover:scale-105 md:text-base md:px-4 md:py-4"
          title={mainSiteTitle}
        >          
          {mainSite}          
        </Link>
      </div>
    </div>
  );
}
