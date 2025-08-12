'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import StrapiImage from '@/components/StrapiImage';

const AwardsSwiper = ({ 
  awardsData,
  className = "",
  containerClassName = "",
  titleClassName = "",
  introClassName = "",
  swiperClassName = "",
  slideClassName = ""
}) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);


  // 支持多種字段名稱：awardslogo 或 awardsLogo
  const { Title: sectionTitle, introduction } = awardsData;
  const awardsArray = awardsData.awardslogo || awardsData.awardsLogo || awardsData.awards;
  return (
    <section className={`py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 ${className}`}>
      <div className={`max-w-7xl mx-auto px-4 ${containerClassName}`}>
        
        {/* 標題區域 */}
        <div className="text-center mb-16">
          {sectionTitle && (
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 ${titleClassName}`}>
              {sectionTitle}
            </h2>
          )}
          
          {introduction && (
            <p className={`text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed ${introClassName}`}>
              {introduction}
            </p>
          )}
        </div>

        {/* Awards Swiper */}
        <div className={`relative ${swiperClassName}`}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: '.awards-swiper-button-next',
              prevEl: '.awards-swiper-button-prev',
            }}
            pagination={{
              el: '.awards-swiper-pagination',
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
            className="awards-swiper"
          >
            {awardsArray.map((award, index) => (
              <SwiperSlide key={award.id || index}>
                <div className={`bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-h-[400px] flex flex-col ${slideClassName}`}>
                  
                  {/* 獲獎圖片 */}
                  {award.Image && (
                    <div className="flex-shrink-0 mb-6">
                      <div className="w-48 h-48 mx-auto bg-gray-50 rounded-2xl flex items-center justify-center p-4 shadow-inner">
                        <StrapiImage
                          image={Array.isArray(award.Image) ? award.Image[0] : award.Image}
                          alt={award.name || 'Award'}
                          width={200}
                          height={200}
                          className="object-contain max-w-full max-h-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* 獲獎名稱 */}
                  <div className="flex-grow flex items-center justify-center">
                    {award.name && (
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800 text-center leading-tight">
                        {award.name}
                      </h3>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 自訂分頁指示器 */}
          <div className="awards-swiper-pagination mt-8 m-auto text-center"></div>
        </div>
      </div>
    </section>
  );
};

export default AwardsSwiper;
