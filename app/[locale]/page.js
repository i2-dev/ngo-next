import HomepageSwiper from "@/components/homepage/HomepageSwiper";
import Solution from "@/components/homepage/Solution";
import InformationSection from "@/components/homepage/InformationSection";
import ClientLogoSection from "@/components/homepage/ClientLogoSection";
import AwardsSwiper from "@/components/homepage/AwardsSwiper";
import Card from "@/components/blocks/Card";
import { getHomepagePageData } from "@/data/page-loaders";
import styles from "@/styles/Homepage.module.css";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default async function HomePage({ params }) {
  // Fix Next.js 15 params async requirement
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  // 🎯 使用頁面特定的數據加載器，實現真正的按需加載
  const pageData = await getHomepagePageData(locale);
  
  // 提取處理過的首頁數據
  const { 
    bannerSlides, 
    solutionData, 
    informationData, 
    clientLogoData, 
    awardsData, 
    cardData 
  } = pageData.processedData || {};



  // Swiper 配置選項
  const swiperConfig = {
    spaceBetween: 0,
    slidesPerView: 1,
    autoplayDelay: 5000,
    effect: "fade",
    loop: true,
    swiperClassName: `${styles.swiperContainer} w-full`,
    pagination: {
      clickable: true,
      dynamicBullets: true,
    },
    fadeEffect: {
      crossFade: true
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Swiper Section */}
      <HomepageSwiper
        slides={bannerSlides}
        className={styles.homepageSwiper}
        swiperConfig={swiperConfig}
        autoplay={true}
        navigation={true}
        pagination={true}
      />

      {/* Solution Section */}
      <Solution locale={locale} styles={styles} solutionData={solutionData} />

      {/* Information Section */}
      <InformationSection locale={locale} styles={styles} informationData={informationData} />

      {/* Client Logo Section */}
      <ClientLogoSection 
        logoData={clientLogoData}
        className={styles.clientLogoSection}
        containerClassName={styles.clientLogoContainer}
        titleClassName={styles.clientLogoSectionTitle}
        gridClassName={styles.clientLogoAwardsGrid}
        logoItemClassName={styles.clientLogoAwardItem}
      />

      {/* Awards Swiper Section */}
      <AwardsSwiper 
        awardsData={awardsData}
        className={styles.awardsSection}
        containerClassName={styles.awardsContainer}
        titleClassName={styles.awardsSectionTitle}
        introClassName={styles.awardsIntroduction}
        swiperClassName={styles.awardsSwiperContainer}
        slideClassName={styles.awardsSlide}
      />

      {/* AI² Card Section */}
      {cardData && (
        <Card 
          Title={cardData.Title}
          Content={cardData.Content}
          icon={cardData.icon}
          Button={cardData.Button}
        />
      )}
    </div>
  );
}
