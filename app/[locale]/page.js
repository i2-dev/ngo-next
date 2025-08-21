import HomepageSwiper from "@/components/homepage/HomepageSwiper";
import Solution from "@/components/homepage/Solution";
import InformationSection from "@/components/homepage/InformationSection";
import ClientLogoSection from "@/components/homepage/ClientLogoSection";
import AwardsSwiper from "@/components/homepage/AwardsSwiper";
import Card from "@/components/blocks/Card";

import { getHomepageData } from "@/data/unified-loader";
import styles from "@/styles/Homepage.module.css";
import PageContainer from "@/components/blocks/PageContainer";
import PageSection from "@/components/blocks/PageSection";


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
  const pageData = await getHomepageData(locale);
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
    <PageContainer className={'!mt-22'}>
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
      <PageSection>
        <Solution locale={locale} styles={styles} solutionData={solutionData} />
      </PageSection>

      {/* Information Section */}
      <PageSection className={'bg-[rgba(247,242,244,0.5)] backdrop-filter-[blur(10px)]'}>
        <InformationSection locale={locale} styles={styles} informationData={informationData} />
      </PageSection>

      {/* Client Logo Section */}
      <PageSection>
        <ClientLogoSection
          logoData={clientLogoData}
        />
      </PageSection>

      {/* Awards Swiper Section */}
      <PageSection>
        <AwardsSwiper
          awardsData={awardsData}
        />
      </PageSection>

      {/* AI² Card Section */}
      {cardData && (
        <PageSection className={'last:pb-50'}>
          <Card
            Title={cardData.Title}
            Content={cardData.Content}
            icon={cardData.icon}
            Button={cardData.Button}
          />
        </PageSection>
      )}
    </PageContainer>
  );
}
