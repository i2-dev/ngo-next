'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import HomepageSwiper from "@/components/homepage/HomepageSwiper";
import Solution from "@/components/homepage/Solution";
import InformationSectionPreview from "@/components/homepage/InformationSectionPreview";
import ClientLogoSection from "@/components/homepage/ClientLogoSection";
import AwardsSwiper from "@/components/homepage/AwardsSwiper";
import Card from "@/components/blocks/Card";
import PreviewWrapper from '@/components/PreviewWrapper';
import { getPreviewData, formatPreviewData, getPreviewNewsData } from '@/utils/preview-data-fetcher';
import styles from "@/styles/Homepage.module.css";
import PageContainer from "@/components/blocks/PageContainer";
import PageSection from "@/components/blocks/PageSection";

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

export default function HomepagePreview() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processedData, setProcessedData] = useState(null);

  const status = searchParams.get('status') || 'draft';
  const documentId = searchParams.get('documentId');
  const locale = searchParams.get('locale') || 'en';

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        setLoading(true);
        
        // 使用新的预览数据获取工具，包含pLevel=6
        const result = await getPreviewData('homepage', {
          status,
          locale,
          documentId,
          pLevel: 6, // 使用pLevel=6以获取完整的homepage数据
        });

        // 获取新闻数据
        let newsData = null;
        try {
          newsData = await getPreviewNewsData(locale, { status });
        } catch (error) {
          console.error('Failed to fetch homepage news data:', error);
        }

        // 格式化数据
        const formattedData = formatPreviewData(result.data, 'homepage');
        console.log('Homepage preview raw data:', formattedData);
        
        // 处理首页特殊结构，与实际主页保持一致
        if (formattedData?.Blocks) {
          const blocks = formattedData.Blocks;
          
          // 提取横幅数据
          const bannerBlock = blocks.find(block => block.__component === 'home-page.banner-block');
          const bannerSlides = bannerBlock?.Banner?.map(banner => ({
            id: banner.id,
            title: banner.Title || '',
            subtitle: banner.SubTitle || '',
            content: extractContentFromRichText(banner.Content),
            image: banner.Image || null,
            buttonText: banner.Button?.Text || null,
            buttonLink: banner.Button?.URL || null,
            icon: banner.icon || null,
          })) || [];

          // 提取其他区块
          const solutionData = blocks.find(block => 
            block.__component === 'home-page.solution' || 
            block.__component === 'home-page.solution-block'
          );
          
          const informationData = blocks.find(block => 
            block.__component === 'home-page.information-section'
          );
          
          const clientLogoData = blocks.find(block => 
            block.__component === 'home-page.client-logo'
          );
          
          const awardsData = blocks.find(block => 
            block.__component === 'home-page.awards-section'
          );
          
          const cardData = blocks.find(block => 
            block.__component === 'public.card'
          );

          const processed = {
            bannerSlides,
            solutionData,
            informationData,
            clientLogoData,
            awardsData,
            cardData,
            newsData,
            rawBlocks: blocks
          };

          console.log('Homepage preview processed data:', processed);
          setProcessedData(processed);
        }
        
        setData(formattedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching preview data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviewData();
  }, [status, documentId, locale]);

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
    <PreviewWrapper
      contentType="首页"
      data={data}
      loading={loading}
      error={error}
    >
      <PageContainer className={'!mt-22'}>
        {/* Hero Swiper Section */}
        {processedData?.bannerSlides && processedData.bannerSlides.length > 0 && (
          <HomepageSwiper
            slides={processedData.bannerSlides}
            className={styles.homepageSwiper}
            swiperConfig={swiperConfig}
            autoplay={true}
            navigation={true}
            pagination={true}
          />
        )}

        {/* Solution Section */}
        {processedData?.solutionData && (
          <PageSection>
            <Solution locale={locale} styles={styles} solutionData={processedData.solutionData} />
          </PageSection>
        )}

        {/* Information Section */}
        {processedData?.informationData && (
          <PageSection className={'bg-[rgba(247,242,244,0.5)] backdrop-filter-[blur(10px)]'}>
            <InformationSectionPreview 
              locale={locale} 
              styles={styles} 
              informationData={processedData.informationData} 
              newsData={processedData.newsData}
            />
          </PageSection>
        )}

        {/* Client Logo Section */}
        {processedData?.clientLogoData && (
          <PageSection>
            <ClientLogoSection
              logoData={processedData.clientLogoData}
            />
          </PageSection>
        )}

        {/* Awards Swiper Section */}
        {processedData?.awardsData && (
          <PageSection>
            <AwardsSwiper
              awardsData={processedData.awardsData}
            />
          </PageSection>
        )}

        {/* AI² Card Section */}
        {processedData?.cardData && (
          <PageSection className={'last:pb-50'}>
            <Card
              Title={processedData.cardData.Title}
              Content={processedData.cardData.Content}
              icon={processedData.cardData.icon}
              Button={processedData.cardData.Button}
            />
          </PageSection>
        )}

        {/* 如果没有数据，显示提示 */}
        {!loading && (!processedData || Object.keys(processedData).every(key => !processedData[key] || (Array.isArray(processedData[key]) && processedData[key].length === 0))) && (
          <PageSection className={'text-center'}>
            <div className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-xl font-medium text-gray-900 mb-2">暂无内容</h2>
              <p className="text-gray-600">首页预览暂无数据</p>
            </div>
          </PageSection>
        )}
      </PageContainer>
    </PreviewWrapper>
  );
}
