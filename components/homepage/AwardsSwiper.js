'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import StrapiImage from '@/components/StrapiImage';

const AwardsSwiper = ({ 
  awardsData,  
}) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);


  // 支持多種字段名稱：awardslogo 或 awardsLogo
  const { Title: sectionTitle, introduction } = awardsData;
  const awardsArray = awardsData.awardslogo || awardsData.awardsLogo || awardsData.awards;
  return (
    <>        
      {/* 標題區域 */}
      <div className="text-center mb-12">
        {sectionTitle && (            
          <h2 className="text-[42px]/[calc(100%+10px)] font-medium mb-5 max-lg:text-4xl max-md:text-3xl">
            {sectionTitle}
          </h2>
        )}
        
        {introduction && (
          <div 
            className="prose prose-sm max-w-none text-center"
            dangerouslySetInnerHTML={{ __html: introduction }}
          />
        )}
      </div>

      {/* Awards Swiper */}
      <div>
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
          className="awards-swiper cursor-grab"
        >
          {awardsArray.map((award, index) => (
            <SwiperSlide key={award.id || index}>                  
                {/* 獲獎圖片 */}
                {award.Image && (
                  <div>                      
                      <StrapiImage
                        image={Array.isArray(award.Image) ? award.Image[0] : award.Image}
                        alt={award.name || 'Award'}
                        width={award.Image.width}
                        height={award.Image.height}
                        className="max-w-[220px] rounded-full mx-auto mb-6"
                      />                      
                  </div>
                )}

                {/* 獲獎名稱 */}                  
                {award.name && (                      
                  <p className='text-center'>
                    {award.name}
                  </p>
                )}                  
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 自訂分頁指示器 */}
        <div className="awards-swiper-pagination mt-15 m-auto text-center !transform-[translateX(0)]"></div>
      </div>      
    </>
  );
};

export default AwardsSwiper;
