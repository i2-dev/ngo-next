'use client';

import SimpleImage from "@/components/SimpleImage";
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
    <div className='bg-white grid grid-cols-1 gap-y-5 rounded-[30px] not-last:mb-20 py-7 px-5 sm:p-10 lg:grid-cols-3 lg:gap-x-5'>      
      {/* 圖片區域 */}
      <div>
        {block.Cover && block.Cover.length > 0 && (
          <div className="w-full">
            <div className="relative overflow-hidden">
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
                    className="w-full h-auto"
                  >
                    {block.Cover.map((image, index) => (
                      <SwiperSlide key={index}>
                        <SimpleImage
                          image={image}
                          alt={`${block.Title} ${index + 1}`}
                          className="w-full h-auto object-cover"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  
                  {/* 控制按鈕 */}
                  <div className="absolute top-4 right-12.5 z-10 space-x-1.5">
                    {/* 左箭頭 */}
                    <button
                      onClick={handlePrev}
                      className="bg-[#286e11] rounded-sm p-1 cursor-pointer top-1 transition-all duration-200 hover:bg-black"
                    >
                      <ChevronLeftIcon className="w-5 h-5 text-white" />
                    </button>
                    
                    {/* 右箭頭 */}
                    <button
                      onClick={handleNext}
                      className="bg-[#286e11] rounded-sm p-1 cursor-pointer top-1 transition-all duration-200 hover:bg-black"
                    >
                      <ChevronRightIcon className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  
                  {/* 播放/暫停按鈕 */}
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={handlePlayPause}
                      className="bg-[#286e11] rounded-sm p-1 cursor-pointer top-1 transition-all duration-200 hover:bg-black"
                    >
                      {isAutoplay ? (
                        <PauseIcon className="w-5 h-5 text-white" />
                      ) : (
                        <PlayIcon className="w-5 h-5 text-white" />
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
                <SimpleImage
                  image={block.Cover[0]}
                  width={block.Cover[0].width}
                  height={block.Cover[0].height}
                  alt={block.Title}
                  className="w-full h-auto object-cover"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* 內容區域 */}
      <div className="col-span-2">
        {/* 標題 */}
        <h3 className="group-[&:nth-child(4n+1)]:text-[#555bba] group-[&:nth-child(4n+2)]:text-[#837634] group-[&:nth-child(4n+3)]:text-[#ba5c1f] group-[&:nth-child(4n+4)]:text-[#428156] text-[22px] mb-2.5">
          {block.Title}
        </h3>
        
        {/* 內容 */}
        {block.Content && (
          <p              
            dangerouslySetInnerHTML={{ __html: block.Content }}
          />
        )}
      </div>      
    </div>
  );
}
