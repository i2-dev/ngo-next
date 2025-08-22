'use client';

import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import StrapiImage from "@/components/StrapiImage";
import { PlayIcon, PauseIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

// 導入 Swiper 樣式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

// 截圖輪播組件
export default function ScreenshotCard({ screenshots }) {
  const [isClient, setIsClient] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 控制 autoplay 的啟動和停止
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      if (isPlaying) {
        swiperRef.current.swiper.autoplay.start();
      } else {
        swiperRef.current.swiper.autoplay.stop();
      }
    }
  }, [isPlaying]);

  // 初始化時停止 autoplay
  const onSwiper = (swiper) => {
    if (!isPlaying) {
      swiper.autoplay.stop();
    }
  };



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
    <div className="relative w-[calc(100%-40px)] sm:w-[calc(100%-96px)] max-w-275 mx-auto">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        onSwiper={onSwiper}
        navigation={{
          nextEl: '.screenshot-swiper-button-next',
          prevEl: '.screenshot-swiper-button-prev',
        }}
        loop={screenshots.length > 1}
        className="w-full h-auto"
      >
        {screenshots.map((screenshotItem, index) => {
          // 根據真實數據結構處理
          // screenshotItem 包含 { id, name, Image: { 實際圖片數據 } }
          const imageData = screenshotItem.Image;
          const itemName = screenshotItem.name || imageData?.name;
          
          return (
            <SwiperSlide key={screenshotItem.id || index}>
              <div className="bg-white overflow-hidden shadow-[0_2px_7px_rgba(0,0,0,0.1)]">
                {imageData ? (
                  <div className="relative">
                    <StrapiImage
                      image={imageData}
                      width={imageData.width}
                      height={imageData.height}                      
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
                {/* {(itemName || screenshotItem.description) && (
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
                )} */}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* 播放/暫停按鈕 */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-[#286e11] rounded-sm p-1 cursor-pointer top-1 transition-all duration-200 hover:bg-black"
        >
          {isPlaying ? (
            <PauseIcon className="w-5 h-5 text-white" />
          ) : (
            // 播放圖標
            <PlayIcon className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {/* 自定義導航按鈕 */}
      {screenshots.length > 1 && (
        <div className="absolute top-4 right-12.5 z-10 space-x-1.5">
          <button className="screenshot-swiper-button-next bg-[#286e11] rounded-sm p-1 cursor-pointer top-1 transition-all duration-200 hover:bg-black">
            <ChevronLeftIcon className="w-5 h-5 text-white" />
          </button>
          <button className="screenshot-swiper-button-prev bg-[#286e11] rounded-sm p-1 cursor-pointer top-1 transition-all duration-200 hover:bg-black">
            <ChevronRightIcon className="w-5 h-5 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
