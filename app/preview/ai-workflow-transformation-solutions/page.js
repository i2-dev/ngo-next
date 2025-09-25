'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PageContainer from "@/components/blocks/PageContainer";
import PageSection from "@/components/blocks/PageSection";
import DigitalSolutionHero from "@/components/digitalsolutions/DigitalSolutionHero";
import BlockRenderer from "@/components/digitalsolutions/BlockRenderer";
import PreviewWrapper from '@/components/PreviewWrapper';
import { buildPreviewApiUrl } from '@/utils/get-strapi-url';
import styles from "@/styles/DigitalSolutions.module.css";

// 获取所有计划的预览数据，然后根据order找到对应的计划
async function getPreviewPlansData(status = 'draft', pLevel = 3, locale = 'en') {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('status', status);
    queryParams.append('locale', locale);
    queryParams.append('pLevel', pLevel);
    queryParams.append('populate[0]', 'icon');
    queryParams.append('populate[1]', 'Image');
    queryParams.append('populate[2]', 'Button');
    queryParams.append('populate[3]', 'Blocks');
    
    const apiUrl = buildPreviewApiUrl('plans', null, Object.fromEntries(queryParams));
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch preview plans data: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Error fetching preview plans data:', error);
    throw error;
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

export default function AICaseManagementPlatformPreview() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const status = searchParams.get('status') || 'draft';
  const locale = searchParams.get('locale') || 'en';
  const pLevel = searchParams.get('pLevel') || '4';
  const documentId = searchParams.get('documentId') || searchParams.get('slug');

  const fetchPreviewData = async () => {
    try {
      setLoading(true);
      setError(null);

      const plansResult = await getPreviewPlansData(status, pLevel, locale);

      if (plansResult.data) {
        // 根據Order找到AI工作流程轉型方案 (data[2])
        const plan = plansResult.data.find(plan => plan.Order === 2);
        
        if (plan) {
          const formattedPlanData = formatPlanData(plan);
          console.log('AI Workflow Transformation Solutions plan data:', {
            plan: plan,
            formattedPlanData: formattedPlanData,
            blocks: formattedPlanData.blocks,
            blockComponents: formattedPlanData.blocks?.map(block => block.__component)
          });
          setData(formattedPlanData);
        } else {
          throw new Error('AI Workflow Transformation Solutions plan not found');
        }
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
  }, [status, locale, pLevel]);

  const heroBg= "blue";
  const heroGradient="linear-gradient(to bottom, rgba(0,22,123,1) 88%, rgba(0,22,123,0) 100%)";

  return (
    <PreviewWrapper
      contentType="ai-workflow-transformation-solutions"
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
        </PageContainer>
      )}
    </PreviewWrapper>
  );
}
