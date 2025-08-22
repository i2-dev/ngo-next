'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ActiveCampaignForm from "@/components/contactus/ActiveCampaignForm";
import StrapiImage from '@/components/StrapiImage';
import PreviewWrapper from '@/components/PreviewWrapper';
import { getPreviewData, formatPreviewData } from '@/utils/preview-data-fetcher';
import PageContainer from "@/components/blocks/PageContainer";
import PageSection from "@/components/blocks/PageSection";
import GoogleMap from "@/components/contactus/GoogleMap";

export default function ContactUsPreview() {
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

        // 使用新的预览数据获取工具，包含pLevel=5
        const result = await getPreviewData('contact-us', {
          status,
          locale,
          documentId,
          pLevel: 5, // 使用pLevel=5以获取完整的联系信息数据
        });

        // 格式化数据
        const formattedData = formatPreviewData(result.data, 'contact-us');
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
  const title = data?.title || '聯絡我們';
  const enquiryPhone = data?.enquiryPhone || '';
  const address = data?.address || '';
  const latitude = data?.latitude || "22.3134643";
  const longitude = data?.longitude || "114.2181358";
  const image = data?.image || null;
  return (
    <PreviewWrapper
      contentType="联系我们"
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
            {/* 左側：聯絡信息和圖片 */}
            <div className="flex flex-col min-h-[500px]">
              {/* 聯絡信息內容 */}
              {enquiryPhone && (
                <div>
                  <h2 className="text-[#454176] text-[22px]">查詢電話</h2>
                  <p>{enquiryPhone}</p>
                </div>
              )}

              {address && (
                <div className="mt-12">
                  <h2 className="text-[#454176] text-[22px]">地址</h2>
                  <p className="mb-4">{address}</p>

                  {/* Google Map */}
                  <div className="mt-4">
                    <GoogleMap
                      address={address}
                      latitude={latitude}
                      longitude={longitude}
                      height="250px"
                      zoom={16}
                      className="shadow-md"
                    />
                  </div>
                </div>
              )}
              {/* 底部圖片 */}
              {image && (
                <div className="mt-auto">
                  <StrapiImage
                    image={image}
                    className="max-w-full h-auto lg:w-[76%]"
                    alt="聯絡我們插圖"
                    width={image.width}
                    height={image.height}
                  />
                </div>
              )}
            </div>

            {/* 右側：聯絡表單 */}
            <div className="bg-white p-10">
              <ActiveCampaignForm />
            </div>
          </div>
        </PageSection>
      </PageContainer>
    </PreviewWrapper>
  );
}
