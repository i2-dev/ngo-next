'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import StrapiImage from '@/components/StrapiImage';
import ClientsSwiper from '@/components/aboutus/ClientsSwiper';
import PreviewWrapper from '@/components/PreviewWrapper';
import { getPreviewData, formatPreviewData } from '@/utils/preview-data-fetcher';
import styles from '@/styles/AboutUs.module.css';
import PageContainer from "@/components/blocks/PageContainer";
import PageSection from "@/components/blocks/PageSection";

export default function AboutUsPreview() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const status = searchParams.get('status') || 'draft';
  const documentId = searchParams.get('documentId');
  const locale = searchParams.get('locale') || 'en';

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        setLoading(true);

        // 使用新的预览数据获取工具，包含pLevel=6
        const result = await getPreviewData('about-us', {
          status,
          locale,
          documentId,
          pLevel: 4, // 使用更高的pLevel以获取完整的客户图片数据
        });

        // 格式化数据
        const formattedData = formatPreviewData(result.data, 'about-us');
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

  // 提取数据
  const title = data?.title || '關於我們';
  const Content = data?.Content || '';
  const leftImage = data?.leftImage && data.leftImage.length > 0 ? data.leftImage[0] : null;
  const ourClients = data?.ourClients && data.ourClients.length > 0 ? data.ourClients[0] : null;

  return (
    <PreviewWrapper
      contentType="关于我们"
      data={data}
      loading={loading}
      error={error}
    >
      <PageContainer>
        {/* 主标题 */}
        <PageSection className={'text-center'}>
          <h1 className='text-[42px] font-medium max-lg:text-5xl max-md:text-4xl'>{title}</h1>
        </PageSection>

        <PageSection className={'pt-0'}>
          <div className="grid grid-cols-2 gap-y-12 gap-x-10 max-lg:grid-cols-1">
            <div>
              {leftImage ? (
                <StrapiImage
                  image={leftImage}
                  alt={title}
                  width={leftImage.width}
                  height={leftImage.height}
                  className="w-full"
                  priority={true}
                />
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
                  <p>暂无图片</p>
                </div>
              )}
            </div>
            <div dangerouslySetInnerHTML={{ __html: Content }} />
          </div>
        </PageSection>

        {/* 客户Logo轮播区域 */}
        {ourClients && (
          <PageSection className={'pt-0'}>
            <ClientsSwiper
              clientsData={ourClients}
              className={`border-t border-gray-200 ${styles.clientsSwiper}`}
            />
          </PageSection>
        )}
      </PageContainer>
    </PreviewWrapper>
  );
}
