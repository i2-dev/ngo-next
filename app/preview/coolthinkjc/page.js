'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PageContainer from "@/components/blocks/PageContainer";
import SuccessCaseHero from "@/components/successcases/SuccessCaseHero";
import SuccessCaseBlockRenderer from "@/components/successcases/SuccessCaseBlockRenderer";
import PageSection from "@/components/blocks/PageSection";
import PreviewWrapper from '@/components/PreviewWrapper';
import { getPreviewData, formatPreviewData } from '@/utils/preview-data-fetcher';

// 獲取成功案例預覽數據
async function getPreviewSuccessCaseData(locale = 'en', status = 'draft', pLevel = 5) {
  try {
    const result = await getPreviewData('successfuls', {
      status,
      locale,
      pLevel,
    });

    if (result?.data) {
      // 處理排序並找到 order === 4 的案例 (Coolthink@JC)
      const sortedCases = result.data
        .sort((a, b) => (a.Order || 0) - (b.Order || 0))
        .map(successCase => ({
          id: successCase.id,
          documentId: successCase.documentId,
          title: successCase.Title,
          order: successCase.Order,
          content: successCase.Content,
          icon: successCase.Icon,
          background: successCase.Background,
          button: successCase.Button,
          card: successCase.Card || [],
          screenshot: successCase.image || []
        }));

      // 找到 Coolthink@JC 案例 (order === 4)
      const coolthinkCase = sortedCases.find(successCase => successCase.order === 4);
      
      return {
        successCase: coolthinkCase,
        allSuccessCases: sortedCases,
        menus: result.menus
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching preview success case data:', error);
    throw error;
  }
}

export default function CoolthinkJCPreview() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const status = searchParams.get('status') || 'draft';
  const locale = searchParams.get('locale') || 'en';
  const pLevel = searchParams.get('pLevel') || '5';

  const fetchPreviewData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getPreviewSuccessCaseData(locale, status, pLevel);

      if (result?.successCase) {
        setData(result);
      } else {
        throw new Error('No success case data found');
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

  const heroBg = "white";

  return (
    <PreviewWrapper
      contentType="coolthinkjc"
      loading={loading}
      error={error}
      data={data}
    >
      {data && (
        <PageContainer>
          <PageSection className={'pb-0'}>
            <SuccessCaseHero 
              successCase={data.successCase} 
              locale={locale} 
              bgcolor={heroBg} 
            />
          </PageSection>
          
          <SuccessCaseBlockRenderer 
            successCase={data.successCase} 
            locale={locale}
            allSuccessCases={data.allSuccessCases || []}
            menuData={data.menus}
          />        
        </PageContainer>
      )}
    </PreviewWrapper>
  );
}
