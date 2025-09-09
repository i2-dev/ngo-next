'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import HomepageBlockRendererPreview from "@/components/homepage/HomepageBlockRendererPreview";
import PreviewWrapper from '@/components/PreviewWrapper';
import { getPreviewData, formatPreviewData, getPreviewNewsData } from '@/utils/preview-data-fetcher';
import PageContainer from "@/components/blocks/PageContainer";
import PageSection from "@/components/blocks/PageSection";

export default function HomepagePreview() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blocks, setBlocks] = useState(null);
  const [newsData, setNewsData] = useState(null);

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
        let newsDataResult = null;
        try {
          newsDataResult = await getPreviewNewsData(locale, { status });
        } catch (error) {
          console.error('Failed to fetch homepage news data:', error);
        }

        // 格式化数据
        const formattedData = formatPreviewData(result.data, 'homepage');
        console.log('Homepage preview raw data:', formattedData);
        
        // 使用 BlockRenderer 方式处理数据
        if (formattedData?.Blocks) {
          setBlocks(formattedData.Blocks);
        }
        
        setNewsData(newsDataResult);
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

  return (
    <PreviewWrapper
      contentType="首页"
      data={data}
      loading={loading}
      error={error}
    >
      <PageContainer className={'!mt-22'}>
        {/* 使用 HomepageBlockRendererPreview 循环渲染所有区块 */}
        {blocks && blocks.length > 0 && (
          <HomepageBlockRendererPreview 
            blocks={blocks} 
            locale={locale} 
            newsData={newsData}
          />
        )}

        {/* 如果没有数据，显示提示 */}
        {!loading && (!blocks || blocks.length === 0) && (
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
