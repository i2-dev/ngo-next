'use client';
// CACHE BUSTER - Force rebuild: 2024-01-15-14-30-00

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PageContainer from "@/components/blocks/PageContainer";
import SuccessCaseHero from "@/components/successcases/SuccessCaseHero";
import SuccessCaseBlockRenderer from "@/components/successcases/SuccessCaseBlockRenderer";
import PageSection from "@/components/blocks/PageSection";
import PreviewWrapper from '@/components/PreviewWrapper';
import { getPreviewSuccessCaseData } from '@/utils/preview-data-fetcher';

export default function BrainTrainingGamePreview() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renderId] = useState(() => Math.random().toString(36).substr(2, 9));

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

      const result = await getPreviewSuccessCaseData(documentId, {
        status,
        locale,
        pLevel
      });

      if (result?.successCase) {
        setData(result);
      } else {
        throw new Error('No success case data found');
      }

    } catch (err) {
      setError(err.message || 'Failed to fetch preview data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviewData();
  }, [documentId, status, locale, pLevel]);

  // Force heroBg to be white, regardless of any other logic
  let heroBg = "white";
  
  // Check if there's any conditional logic that might override this
  if (data?.successCase?.bgcolor) {
    console.log('WARNING: successCase has bgcolor:', data.successCase.bgcolor, 'but we will force it to white');
  }

  // Debug logging
  console.log('=== Brain Training Game Preview Debug ===');
  console.log('heroBg value:', heroBg);
  console.log('data:', data);
  console.log('data.successCase:', data?.successCase);
  console.log('data.successCase.bgcolor:', data?.successCase?.bgcolor);
  console.log('==========================================');

  return (
    <PreviewWrapper
      contentType="brain-training-game"
      loading={loading}
      error={error}
      data={data}
    >
      {data && (
        <PageContainer>
          <PageSection className={'pb-0'}>
            <SuccessCaseHero 
              key={`${renderId}-${data.successCase?.documentId}`}
              successCase={data.successCase} 
              locale={locale} 
              bgcolor="white"
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
