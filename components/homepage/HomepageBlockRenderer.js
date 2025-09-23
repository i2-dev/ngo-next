import HomepageSwiper from "./HomepageSwiper";
import Solution from "./Solution";
import InformationSection from "./InformationSection";
import ClientLogoSection from "./ClientLogoSection";
import AwardsSwiper from "./AwardsSwiper";
import Card from "../blocks/Card";
import PageSection from "../blocks/PageSection";
import styles from "@/styles/Homepage.module.css";
import { FadeUp } from "../SimpleAnimatedElement";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// 从富文本内容中提取纯文本
function extractContentFromRichText(contentArray) {
  if (!Array.isArray(contentArray)) return '';
  
  return contentArray.map(block => {
    if (block.type === 'paragraph' && block.children) {
      return block.children
        .filter(child => child.type === 'text')
        .map(child => child.text)
        .join('');
    }
    return '';
  }).join(' ').trim();
}

export default function HomepageBlockRenderer({ blocks, locale }) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

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
    <>
      {blocks.map((block, index) => {
        // 根據組件類型渲染對應的區塊
        switch (block.__component) {
          case 'home-page.banner-block':
            const bannerSlides = block.Banner?.map(banner => ({
              id: banner.id,
              title: banner.Title || '',
              subtitle: banner.SubTitle || '',
              content: extractContentFromRichText(banner.Content),
              image: banner.Image || null,
              buttonText: banner.Button?.Text || null,
              buttonLink: banner.Button?.URL || null,
              icon: banner.icon || null,
            })) || [];
            
            return (
              <FadeUp key={`${block.id}-${index}`}>
                <HomepageSwiper
                  slides={bannerSlides}
                  className={styles.homepageSwiper}
                  swiperConfig={swiperConfig}
                  autoplay={true}
                  navigation={true}
                  pagination={true}
                />
              </FadeUp>
            );
          
          case 'home-page.solution':
          case 'home-page.solution-block':
            return (
              <PageSection key={`${block.id}-${index}`}>
                <Solution locale={locale} styles={styles} solutionData={block} />
              </PageSection>
            );
          
          case 'home-page.information-section':
            return (
              <PageSection key={`${block.id}-${index}`} className={'bg-[rgba(247,242,244,0.5)] backdrop-filter-[blur(10px)]'}>
                <InformationSection locale={locale} styles={styles} informationData={block} />
              </PageSection>
            );
          
          case 'home-page.client-logo':
            return (
              <PageSection key={`${block.id}-${index}`}>
                <ClientLogoSection logoData={block} />
              </PageSection>
            );
          
          case 'home-page.awards-section':
            return (
              <PageSection key={`${block.id}-${index}`}>
                <AwardsSwiper awardsData={block} />
              </PageSection>
            );
          
          case 'public.card':
            return (
              <PageSection key={`${block.id}-${index}`} className={'last:pb-50'}>
                <Card
                  Title={block.Title}
                  Content={block.Content}
                  icon={block.icon}
                  Button={block.Button}
                />
              </PageSection>
            );
          
          default:
            console.warn(`Unknown homepage block component: ${block.__component}`);
            return null;
        }
      })}
    </>
  );
}
