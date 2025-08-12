'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import StrapiImage from '@/components/StrapiImage';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ClientsSwiper = ({ 
  clientsData,
  className = "",
  containerClassName = "",
  titleClassName = "",
  swiperClassName = "",
  slideClassName = ""
}) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 防止 Hydration 錯誤：服務端先渲染佔位符
  if (!isClient) {
    return (
      <div className="h-[200px] w-full bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-lg">Loading clients...</div>
        </div>
      </div>
    );
  }

  if (!clientsData || !clientsData.ClientsLogo || clientsData.ClientsLogo.length === 0) {
    return (
      <div className="h-[200px] w-full bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-lg">暂无客户logo数据</div>
        </div>
      </div>
    );
  }

  const { Title: sectionTitle, ClientsLogo: clientsArray } = clientsData;

  return (
    <section className={`py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 ${className}`}>
      <div className={`max-w-7xl mx-auto px-4 ${containerClassName}`}>
        
        {/* 標題區域 */}
        <div className="text-center mb-12">
          {sectionTitle && (
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 ${titleClassName}`}>
              {sectionTitle}
            </h2>
          )}
        </div>

        {/* Clients Logo Swiper */}
        <div className={`relative ${swiperClassName}`}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={40}
            slidesPerView={1}
            navigation={{
              nextEl: '.clients-swiper-button-next',
              prevEl: '.clients-swiper-button-prev',
            }}
            pagination={{
              el: '.clients-swiper-pagination',
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            breakpoints={{
              480: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 35,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 50,
              },
            }}
            className="clients-swiper pb-12"
          >
            {clientsArray.map((client, index) => (
              <SwiperSlide key={client.id || index}>
                <div className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105 min-h-[160px] flex items-center justify-center clientCard ${slideClassName}`}>
                  
                  {/* 客戶Logo或名稱 */}
                  <div className="text-center">
                    {client.Image ? (
                      <div className="w-20 h-20 mx-auto mb-3 relative">
                        <StrapiImage
                          image={client.Image}
                          alt={client.name || 'Client logo'}
                          width={80}
                          height={80}
                          className="object-contain w-full h-full rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 mx-auto mb-3 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-400">
                          {client.name ? client.name.charAt(0) : '?'}
                        </span>
                      </div>
                    )}
                    
                    {client.name && (
                      <h3 className="text-sm font-medium text-gray-800 text-center leading-tight px-2">
                        {client.name}
                      </h3>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <div className="clients-swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          
          <div className="clients-swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* 自訂分頁指示器 */}
          <div className="clients-swiper-pagination mt-8 text-center"></div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSwiper;
