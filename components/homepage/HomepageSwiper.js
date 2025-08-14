'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import StrapiImage from '@/components/StrapiImage';
import { getStrapiMedia } from '@/utils/get-strapi-media';
import styles from '@/styles/Homepage.module.css';
import SharedButton from '../blocks/Button';

const HomepageSwiper = ({
    slides = [],
    autoplay = true,
    navigation = true,
    pagination = true,
    className = "",
    swiperConfig = {}
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
                {slidesToShow.map((slide) => {
                    // 获取正确的 Strapi 图片 URL
                    //const backgroundImageUrl = slide.image ? getStrapiMedia(slide.image) : null;
                    return (
                        <SwiperSlide key={slide.id}>
                            <div className="relative w-full h-full">
                                {console.log('@@@@@@@',slide)}
                                <div className="w-full max-w-[1280px] my-0 px-5 mx-auto relative">
                                    <div className="max-md:flex max-md:flex-col-reverse">                                    
                                        <div className={styles.homeBannerCardBodyShadow}></div>
                                        <div className={styles.homeBannerCardBody}>                                       
                                            {slide.icon && (                                             
                                                <StrapiImage
                                                    image={slide.icon}
                                                    className={styles.homeBannerCardIcon}
                                                    width={135}
                                                    height={110}
                                                    alt={slide.title}
                                                />                                          
                                            )}
                                            <h2 className="text-[#3e3978] text-[46px]/[1.2] font-medium mb-[15px] max-lg:text-[28px]">
                                                <span className="block text-2xl font-normal mb-[15px] max-lg:text-base max-lg:mb-2.5">{slide.subtitle}</span>
                                                {slide.title}
                                            </h2>
                                            <p className="text-[#ff6800] text-2xl/[1.23] mb-auto max-md:mb-[50px]"><strong className="font-medium">{slide.content}</strong></p>                                                      
                                            <SharedButton {...slide}/>                                                                              
                                        </div>
                                        <div className={styles.homeBannerCardImageContainer}>                                            
                                            {/* Background Image or Default Background */}                                            
                                            {slide.image? (
                                                <Link href={slide.buttonLink}> 
                                                    <StrapiImage
                                                        image={slide.image}                                                    
                                                        width={slide.image.width}
                                                        height={slide.image.height}
                                                        alt={slide.title}
                                                    />
                                                </Link> 
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"></div>
                                            )}                                            
                                        </div>
                                    </div>                                    
                                </div>


                                {/* <div className="relative z-10 flex items-center justify-center h-full">
                                    <div className="text-center text-white px-4 max-w-4xl mx-auto" style={{
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                                    }}>
                                        
                                        {slide.icon && (
                                            <div className="mb-6">
                                                <StrapiImage
                                                    image={slide.icon}
                                                    className="mx-auto w-16 h-16 md:w-20 md:h-20 object-contain"
                                                    width={135}
                                                    height={110}
                                                    alt={slide.title}
                                                />
                                            </div>
                                        )}

                                        <h2 className={`text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight ${styles.homeBannerTextShadow}`}>
                                            {slide.title}
                                        </h2>
                                        <p className="text-lg md:text-xl lg:text-2xl mb-4 opacity-90">
                                            {slide.subtitle}
                                        </p>
                                        {slide.content && (
                                            <p className="text-base md:text-lg lg:text-xl mb-8 opacity-80 font-medium">
                                                {slide.content}
                                            </p>
                                        )}
                                        {slide.buttonText && slide.buttonLink && (
                                            <a
                                                href={slide.buttonLink}
                                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 text-lg"
                                            >
                                                {slide.buttonText}
                                            </a>
                                        )}
                                    </div>
                                </div> */}
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};

export default HomepageSwiper;
