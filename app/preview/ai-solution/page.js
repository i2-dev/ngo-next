'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PageContainer from "@/components/blocks/PageContainer";
import PageSection from "@/components/blocks/PageSection";
import DigitalSolutionHero from "@/components/digitalsolutions/DigitalSolutionHero";
import BlockRenderer from "@/components/digitalsolutions/BlockRenderer";
import HomepageBlockRendererPreview from "@/components/homepage/HomepageBlockRendererPreview";
import PreviewWrapper from '@/components/PreviewWrapper';
import { buildPreviewApiUrl } from '@/utils/get-strapi-url';
import styles from "@/styles/DigitalSolutions.module.css";

// 直接获取特定计划的预览数据
async function getPreviewPlanData(documentId, status = 'draft', pLevel = 4) {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('status', status);
    queryParams.append('pLevel', pLevel);
    queryParams.append('populate[0]', 'icon');
    queryParams.append('populate[1]', 'Image');
    queryParams.append('populate[2]', 'Button');
    queryParams.append('populate[3]', 'Blocks');
    
    const apiUrl = buildPreviewApiUrl('plans', documentId, Object.fromEntries(queryParams));
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch preview data: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error fetching preview plan data:', error);
    throw error;
  }
}

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

// 获取新闻数据
async function getPreviewNewsData(locale = 'en', status = 'draft') {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('status', status);
    queryParams.append('locale', locale);
    queryParams.append('pLevel', '3');
    queryParams.append('populate[0]', 'image');
    queryParams.append('populate[1]', 'information_category');
    queryParams.append('pagination[page]', '1');
    queryParams.append('pagination[pageSize]', '3');
    queryParams.append('sort[0]', 'Publish:desc');

    const apiUrl = buildPreviewApiUrl('informations', null, Object.fromEntries(queryParams));

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch news data: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    // 格式化数据，只返回首页需要的字段
    return {
      data: result.data?.map(news => ({
        id: news.id,
        documentId: news.documentId,
        title: news.Title,
        content: news.Content,
        publishedAt: news.Publish,
        image: news.image,
        category: news.information_category?.name || null,
        createdAt: news.createdAt,
        updatedAt: news.updatedAt,
      })) || [],
      meta: {
        pagination: {
          page: 1,
          pageSize: 3,
          total: result.meta?.pagination?.total || 0
        }
      }
    };

  } catch (error) {
    console.error('Error fetching preview news data:', error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 3, total: 0 } } };
  }
}

// 格式化计划数据
function formatPlanData(data) {
  if (!data) return null;

  return {
    id: data.id,
    documentId: data.documentId,
    title: data.Title,
    content: data.Content,
    order: data.Order,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    publishedAt: data.publishedAt,
    locale: data.locale,
    icon: data.icon,
    image: data.Image,
    button: data.Button,
    blocks: data.Blocks || [],
  };
}

// 格式化首页数据 - 使用 BlockRenderer 方式
function formatHomepageData(data) {
  if (!data) return null;

  // 使用 BlockRenderer 方式处理数据
  if (data.Blocks) {
    return {
      blocks: data.Blocks
    };
  }
  
  return {
    blocks: []
  };
}

export default function AICaseManagementPlatformPreview() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [homepageData, setHomepageData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const status = searchParams.get('status') || 'draft';
  const locale = searchParams.get('locale') || 'en';
  const pLevel = searchParams.get('pLevel') || '5';
  const documentId = searchParams.get('documentId') || searchParams.get('slug');

  const fetchPreviewData = async () => {
    if (!documentId) {
      setError('Document ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 并行获取计划数据、首页数据和新闻数据
      const [planResult, homepageResult, newsResult] = await Promise.all([
        getPreviewPlanData(documentId, status, pLevel),
        getPreviewNewsData(locale, status)
      ]);

      // console.log('AI Solution preview raw data:', planResult);
      // console.log('Homepage preview raw data:', homepageResult);
      // console.log('News preview raw data:', newsResult);

      if (planResult.data) {
        const formattedPlanData = formatPlanData(planResult.data);
        const formattedHomepageData = formatHomepageData(homepageResult?.data);
        
        // console.log('AI Solution preview formatted data:', formattedPlanData);
        // console.log('Homepage preview formatted data:', formattedHomepageData);
        // console.log('Client Logo Data:', formattedHomepageData?.clientLogoData);
        // console.log('Information Data:', formattedHomepageData?.informationData);
        // console.log('Awards Data:', formattedHomepageData?.awardsData);
        // console.log('Card Data:', formattedHomepageData?.cardData);
        // console.log('News Data:', newsResult);
        
        setData(formattedPlanData);
        setHomepageData(formattedHomepageData);
        setNewsData(newsResult);
      } else {
        throw new Error('No data received from API');
      }

    } catch (err) {
      console.error('Error fetching preview data:', err);
      setError(err.message || 'Failed to fetch preview data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviewData();
  }, [documentId, status, locale, pLevel]);

  return (
    <PreviewWrapper
      contentType="ai-solution"
      data={data}
      loading={loading}
      error={error}
    >
      {data && (
        <PageContainer>
          {/* 方案標題區域 */}
          <PageSection>        
            <DigitalSolutionHero
              plan={data}
              locale={locale}
              bgcolor="gray"
              bgGradient="linear-gradient(to bottom, rgba(151,151,151,1) 80%, rgba(151,151,151,0) 100%)"
            />
          </PageSection>

          {/* 方案內容區塊 */}
          {data.blocks && data.blocks.length > 0 && (        
            <BlockRenderer
              blocks={data.blocks}
              locale={locale}
            />        
          )}

          {/* 使用 HomepageBlockRendererPreview 渲染首页区块 */}
          {homepageData?.blocks && homepageData.blocks.length > 0 && (
            <HomepageBlockRendererPreview 
              blocks={homepageData.blocks} 
              locale={locale} 
              newsData={newsData}
            />
          )}
        </PageContainer>
      )}
    </PreviewWrapper>
  );
}
