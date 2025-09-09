'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PageContainer from "@/components/blocks/PageContainer";
import PageSection from "@/components/blocks/PageSection";
import DigitalSolutionHero from "@/components/digitalsolutions/DigitalSolutionHero";
import BlockRenderer from "@/components/digitalsolutions/BlockRenderer";
import Card from "@/components/blocks/Card";
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

// 获取首页数据以获取Card组件数据
async function getPreviewHomepageData(locale = 'en', status = 'draft') {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('status', status);
    queryParams.append('locale', locale);
    queryParams.append('pLevel', '4');
    queryParams.append('populate[0]', 'Blocks');
    queryParams.append('populate[1]', 'Blocks.icon');
    queryParams.append('populate[2]', 'Blocks.Button');

    const apiUrl = buildPreviewApiUrl('homepage', null, Object.fromEntries(queryParams));

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch homepage data: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error fetching preview homepage data:', error);
    return { data: null };
  }
}

// 格式化计划数据
function formatPlanData(data) {
  if (!data) return null;

  return {
    id: data.id,
    documentId: data.documentId,
    title: data.Title,
    order: data.Order,
    content: data.Content,
    icon: data.icon,
    image: data.Image,
    button: data.Button,
    blocks: data.Blocks || [],
  };
}

// 格式化首页数据
function formatHomepageData(data) {
  if (!data?.Blocks) {
    return {
      blocks: []
    };
  }

  // 从区块中提取Card组件数据
  const cardData = data.Blocks.find(block => 
    block.__component === 'public.card'
  );

  return {
    blocks: data.Blocks || [],
    cardData: cardData || null
  };
}

export default function AIElderlyHealthManagerPreview() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [homepageData, setHomepageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const status = searchParams.get('status') || 'draft';
  const locale = searchParams.get('locale') || 'en';
  const pLevel = searchParams.get('pLevel') || '4';
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

      // 并行获取计划数据和首页数据
      const [planResult, homepageResult] = await Promise.all([
        getPreviewPlanData(documentId, status, pLevel),
        getPreviewHomepageData(locale, status)
      ]);

      if (planResult.data) {
        const formattedPlanData = formatPlanData(planResult.data);
        const formattedHomepageData = formatHomepageData(homepageResult?.data);
        
        setData(formattedPlanData);
        setHomepageData(formattedHomepageData);
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

  const heroBg = "brown";
  const heroGradient = "linear-gradient(to bottom, rgba(47,25,27,1) 88%, rgba(47,25,27,0) 100%)";

  return (
    <PreviewWrapper
      contentType="ai-elderly-health-manager"
      data={data}
      loading={loading}
      error={error}
    >
      {data && (
        <PageContainer>
          <PageSection>
            <DigitalSolutionHero 
              plan={data} 
              locale={locale} 
              bgcolor={heroBg} 
              bgGradient={heroGradient}
            />
          </PageSection>

          {data.blocks && data.blocks.length > 0 && (          
            <BlockRenderer blocks={data.blocks} locale={locale} />          
          )}

          {/* AI² Card Section */}
          {homepageData?.cardData && (
            <PageSection className={'pb-50'}>
              <Card
                Title={homepageData.cardData.Title}
                Content={homepageData.cardData.Content}
                icon={homepageData.cardData.icon}
                Button={homepageData.cardData.Button}
              />
            </PageSection>
          )}
        </PageContainer>
      )}
    </PreviewWrapper>
  );
}
