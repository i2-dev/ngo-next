'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PageContainer from "@/components/blocks/PageContainer";
import SuccessCaseHero from "@/components/successcases/SuccessCaseHero";
import SuccessCaseBlockRenderer from "@/components/successcases/SuccessCaseBlockRenderer";
import PageSection from "@/components/blocks/PageSection";
import PreviewWrapper from '@/components/PreviewWrapper';
import { getPreviewSuccessCaseData } from '@/utils/preview-data-fetcher';

export default function E123ElderlyPortalPreview() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
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
      console.error('Error fetching preview data:', err);
      setError(err.message || 'Failed to fetch preview data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviewData();
  }, [documentId, status, locale, pLevel]);

  // Set background color based on documentId
  // - i-change-gambling-counseling (b8g7kbq1j62qmd5u4mnacpjb): white
  const heroBg = documentId === "drsd1m8p9bf2qg1ho1qe4gt4" ? "lightblue" : "white";

  return (
    <PreviewWrapper
      contentType="e123-elderly-portal"
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
