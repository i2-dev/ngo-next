'use client';

import StrapiImage from "@/components/StrapiImage";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useState, useRef } from 'react';
import { PlayIcon, PauseIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function CardItemBlock({ block, locale }) {
  const [isAutoplay, setIsAutoplay] = useState(true);
  const swiperRef = useRef(null);

  if (!block) return null;

  // 檢查是否有多張圖片
  const hasMultipleImages = block.Cover && block.Cover.length > 1;

  const handlePlayPause = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      if (isAutoplay) {
        swiperRef.current.swiper.autoplay.stop();
      } else {
        swiperRef.current.swiper.autoplay.start();
      }
      setIsAutoplay(!isAutoplay);
    }
  };

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* 圖片區域 */}
        {block.Cover && block.Cover.length > 0 && (
          <div className="w-full lg:w-1/3">
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              {hasMultipleImages ? (
                <>
                  <Swiper
                    ref={swiperRef}
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    pagination={{
                      clickable: true,
                      el: '.card-swiper-pagination',
                    }}
                    autoplay={{
                      delay: 4000,
                      disableOnInteraction: false,
                    }}
                    loop={true}
                    className="w-full h-64 lg:h-48"
                  >
                    {block.Cover.map((image, index) => (
                      <SwiperSlide key={index}>
                        <StrapiImage
                          image={image}
                          alt={`${block.Title} ${index + 1}`}
                          className="w-full h-64 lg:h-48 object-cover"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  
                  {/* 控制按鈕 */}
                  <div className="absolute inset-0 flex items-center justify-between p-4 z-10">
                    {/* 左箭頭 */}
                    <button
                      onClick={handlePrev}
                      className="bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
                    </button>
                    
                    {/* 右箭頭 */}
                    <button
                      onClick={handleNext}
                      className="bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <ChevronRightIcon className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                  
                  {/* 播放/暫停按鈕 */}
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={handlePlayPause}
                      className="bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      {isAutoplay ? (
                        <PauseIcon className="w-5 h-5 text-gray-700" />
                      ) : (
                        <PlayIcon className="w-5 h-5 text-gray-700" />
                      )}
                    </button>
                  </div>
                  
                  {/* 分頁指示器 */}
                  <div className="card-swiper-pagination absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10"></div>
                  
                  <style jsx global>{`
                    .card-swiper-pagination .swiper-pagination-bullet {
                      background: rgba(255, 255, 255, 0.6);
                      opacity: 1;
                      margin: 0 4px;
                      width: 8px;
                      height: 8px;
                      transition: all 0.3s ease;
                    }
                    
                    .card-swiper-pagination .swiper-pagination-bullet-active {
                      background: white;
                      transform: scale(1.2);
                    }
                    
                    .card-swiper-pagination .swiper-pagination-bullet:hover {
                      background: rgba(255, 255, 255, 0.8);
                      transform: scale(1.1);
                    }
                  `}</style>
                </>
              ) : (
                <StrapiImage
                  image={block.Cover[0]}
                  alt={block.Title}
                  className="w-full h-64 lg:h-48 object-cover"
                />
              )}
            </div>
          </div>
        )}

        {/* 內容區域 */}
        <div className="w-full lg:w-2/3 space-y-4">
          {/* 標題 */}
          <h3 className="text-2xl font-bold text-gray-900">
            {block.Title}
          </h3>
          
          {/* 內容 */}
          {block.Content && (
            <div 
              className="prose prose-lg text-gray-600 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: block.Content }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
