'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import SimpleImage from '@/components/SimpleImage';

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
    <>        
      {/* 標題區域 */}
      <div className="text-center mb-20">
        {sectionTitle && (          
          <h2 className="text-[#454176] text-[22px]">{sectionTitle}</h2>            
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
              {/* 客戶Logo或名稱 */}
              <div className="text-center">
                {client.Image ? (                  
                  <SimpleImage
                    image={client.Image}
                    alt={client.name || 'Client logo'}
                    width={client.Image.width}
                    height={client.Image.height}
                    className="rounded-full w-[150px] m-auto mb-6"
                  />                  
                ) : (                  
                  <span className="text-2xl font-bold text-gray-400">
                    {client.name ? client.name.charAt(0) : '?'}
                  </span>                  
                )}
                
                {client.name && (
                  <p>
                    {client.name}
                  </p>
                )}
              </div>              
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}        

        {/* 自訂分頁指示器 */}
        <div className="clients-swiper-pagination mt-15 m-auto text-center !transform-[translateX(0)]"></div>
      </div>      
    </>
  );
};

export default ClientsSwiper;
