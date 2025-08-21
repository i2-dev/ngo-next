'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import StrapiImage from "@/components/StrapiImage";

// 導入 Swiper 樣式
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

export default function SwiperCardBlock({ block, locale }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!block) return null;

  // 獲取圖片列表 - 根據 Strapi 數據格式使用 Image (單數)
  const images = block.Image || [];
  const hasMultipleImages = images.length > 1;

  // 防止 Hydration 錯誤：服務端先渲染佔位符
  if (!isClient) {
    return (      
      <div className="h-96 w-full bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
        <div className="text-gray-500">Loading images...</div>
      </div>      
    );
  }

  return (
    <>
      {/* 標題 */}
      {block.Title && (
        <div className="text-center mb-12">
            <h2 className='text-[#3e3978] text-[42px] font-medium max-lg:text-4xl max-md:text-3xl'>{block.Title}</h2>
            {block.subTitle && (
              <p>{block.subTitle}</p>
            )}
        </div>          
      )}      

      {/* 圖片內容 */}
      {images.length > 0 && (
        <div className="relative">
          {hasMultipleImages ? (
            // 多張圖片時使用 Swiper
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              loop={true}
              className="w-full aspect-[1245/680] pb-20"
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 1,
                },
                1024: {
                  slidesPerView: 1,
                },
              }}
            >
              {images.map((image, index) => (
                <SwiperSlide
                  key={image.id || index}                  
                  >                  
                  <StrapiImage
                    image={image}
                    width={image.width}
                    height={image.height}
                    alt={image.alternativeText || `Slide ${index + 1}`}                                      
                    className="rounded-[30px]"
                  />
                  {/* 圖片說明 */}
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                      <p className="text-center">{image.caption}</p>
                    </div>
                  )}                  
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            // 單張圖片時不使用 Swiper，直接顯示                        
            <StrapiImage
              image={images[0]}              
              width={images[0].width}
              height={images[0].height}
              alt={images[0].alternativeText || 'Image'}
              className="rounded-[30px]"
            />            
          )}
        </div>
      )}
    </>
  );
}
