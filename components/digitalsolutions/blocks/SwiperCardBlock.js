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
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="h-96 w-full bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
            <div className="text-gray-500">Loading images...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 標題 */}
        {block.Title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {block.Title}
            </h2>
            {block.subTitle && (
              <p className="text-gray-600 text-lg">{block.subTitle}</p>
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
                className="w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-xl"
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
                  <SwiperSlide key={image.id || index}>
                    <div className="relative w-full h-full">
                      <StrapiImage
                        image={image}
                        alt={image.alternativeText || `Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                      />
                      {/* 圖片說明 */}
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                          <p className="text-center">{image.caption}</p>
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              // 單張圖片時不使用 Swiper，直接顯示
              <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden shadow-xl">
                <StrapiImage
                  image={images[0]}
                  alt={images[0].alternativeText || 'Image'}
                  className="w-full h-full object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                />
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
