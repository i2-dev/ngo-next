'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import SimpleImage from '@/components/SimpleImage';
import { getStrapiMedia } from '@/utils/get-strapi-media';
import styles from '@/styles/Homepage.module.css';
import SharedButton from '../blocks/Button';

const HomepageSwiper = ({
    slides = [],
    autoplay = true,
    navigation = true,
    pagination = true,
    className = "",
    swiperConfig = {},
    locale = 'en'
}) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // 直接使用从 CMS API 获取的 slides 数据
    const slidesToShow = slides;

    // 防止 Hydration 錯誤：服務端先渲染佔位符
    if (!isClient) {
        return (
            <div className="h-[400px] md:h-[500px] lg:h-[600px] w-full bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <div className="text-lg mb-2">Loading...</div>
                </div>
            </div>
        );
    }

    // 如果没有幻灯片数据，显示占位符
    if (!slidesToShow || slidesToShow.length === 0) {
        return (
            <div className="h-[400px] md:h-[500px] lg:h-[600px] w-full bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <div className="text-lg mb-2">正在加载横幅内容...</div>
                    <div className="text-sm">Loading banner content from CMS...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`homepage-swiper relative ${className} pt-20`}>
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                spaceBetween={swiperConfig.spaceBetween || 0}
                slidesPerView={swiperConfig.slidesPerView || 1}
                //navigation={navigation}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                    ...swiperConfig.pagination
                }}
                // autoplay={autoplay ? {
                //     delay: swiperConfig.autoplayDelay || 5000,
                //     disableOnInteraction: false,
                //     ...swiperConfig.autoplay
                // } : false}
                // effect={swiperConfig.effect || "fade"}
                fadeEffect={{
                    crossFade: true,
                    ...swiperConfig.fadeEffect
                }}
                loop={swiperConfig.loop !== undefined ? swiperConfig.loop : true}
                className={swiperConfig.swiperClassName || "h-[400px] md:h-[500px] lg:h-[600px] w-full pb-20"}
                {...swiperConfig.extraProps}
            >
                {slidesToShow.map((slide, index) => {
                    // 获取正确的 Strapi 图片 URL
                    //const backgroundImageUrl = slide.image ? getStrapiMedia(slide.image) : null;
                    const isFirstSlide = index === 0; // First slide should load with priority
                    return (
                        <SwiperSlide key={slide.id}>
                            <div className="relative w-full h-full">                                
                                <div className="w-full max-w-[1280px] my-0 px-5 mx-auto relative">
                                    <div className="max-md:flex max-md:flex-col-reverse">                                    
                                        <div className={styles.homeBannerCardBodyShadow}></div>
                                        <div className={styles.homeBannerCardBody}>                                       
                                            {slide.icon && (                                             
                                                <SimpleImage
                                                    image={slide.icon}
                                                    className={`${styles.homeBannerCardIcon} animate-fade-in-up`}
                                                    style={{animationDelay: '0.4s'}}
                                                    alt={slide.title}
                                                />                                          
                                            )}
                                            <h2 className={`text-[#3e3978] font-medium mb-[15px] animate-fade-in-left ${locale === 'en' ? 'text-[32px]/[1.2] max-lg:text-[28px]' : 'text-[46px]/[1.2] max-lg:text-[28px]'}`} style={{animationDelay: '0.6s'}}>
                                                <span className={`block ${locale === 'en' ? 'text-xl' : 'text-2xl'} font-normal mb-[15px] max-lg:text-base max-lg:mb-2.5`}>{slide.subtitle}</span>
                                                {slide.title}
                                            </h2>
                                            <p className={`text-[#ff6800] ${locale === 'en' ? 'text-xl/[1.23]' : 'text-2xl/[1.23]'} mb-auto max-md:mb-[50px] animate-fade-in-up`} style={{animationDelay: '0.8s'}}><strong className="font-medium">{slide.content}</strong></p>                                                      
                                            <div className="animate-fade-in-up" style={{animationDelay: '1s'}}>
                                                <SharedButton {...slide}/>                                                                              
                                            </div>
                                        </div>
                                        <div className={styles.homeBannerCardImageContainer}>                                            
                                            {/* Background Image or Default Background */}                                            
                                            {slide.image? (
                                                <Link href={slide.buttonLink} className="animate-fade-in-right" style={{animationDelay: '0.3s'}}> 
                                                    <SimpleImage
                                                        image={slide.image}                                                    
                                                        alt={slide.title}
                                                        className="hover:scale-105 transition-transform duration-500"
                                                    />
                                                </Link> 
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"></div>
                                            )}                                            
                                        </div>
                                    </div>                                    
                                </div>

                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};

export default HomepageSwiper;
