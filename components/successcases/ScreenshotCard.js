'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import StrapiImage from "@/components/StrapiImage";

// 導入 Swiper 樣式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

// 截圖輪播組件
export default function ScreenshotCard({ screenshots }) {
  const [isClient, setIsClient] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);



  // 防止 Hydration 錯誤：服務端先渲染佔位符
  if (!isClient) {
    return (
      <div className="w-full h-96 bg-gray-200 animate-pulse rounded-2xl flex items-center justify-center">
        <div className="text-gray-500">載入截圖中...</div>
      </div>
    );
  }

  // 檢查數據是否存在且有效
  if (!screenshots || screenshots.length === 0) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          <p className="text-lg font-medium">暫無截圖</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screenshot-swiper-container relative">
      {/* 播放/暫停控制按鈕 */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-300 border border-gray-200"
        >
          {isPlaying ? (
            // 暫停圖標
            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            // 播放圖標
            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={isPlaying ? {
          delay: 3000,
          disableOnInteraction: false,
        } : false}
        navigation={{
          nextEl: '.screenshot-swiper-button-next',
          prevEl: '.screenshot-swiper-button-prev',
        }}
        loop={screenshots.length > 1}
        className="w-full h-[400px] md:h-[500px]"
      >
        {screenshots.map((screenshotItem, index) => {
          // 根據真實數據結構處理
          // screenshotItem 包含 { id, name, Image: { 實際圖片數據 } }
          const imageData = screenshotItem.Image;
          const itemName = screenshotItem.name || imageData?.name;
          
          return (
            <SwiperSlide key={screenshotItem.id || index}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {imageData ? (
                  <div className="relative aspect-video">
                    <StrapiImage
                      image={imageData}
                      format="large"
                      alt={itemName || `截圖 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                  </div>
                ) : (
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm">暫無預覽</p>
                    </div>
                  </div>
                )}
                
                {/* 簡潔的底部信息 */}
                {(itemName || screenshotItem.description) && (
                  <div className="p-4">
                    {itemName && (
                      <h4 className="font-medium text-gray-900 text-base">
                        {itemName}
                      </h4>
                    )}
                    {screenshotItem.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {screenshotItem.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* 自定義導航按鈕 */}
      {screenshots.length > 1 && (
        <>
          <button className="screenshot-swiper-button-prev absolute top-1/2 left-4 -translate-y-1/2 z-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-300 group">
            <svg className="w-6 h-6 text-gray-700 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="screenshot-swiper-button-next absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-300 group">
            <svg className="w-6 h-6 text-gray-700 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
