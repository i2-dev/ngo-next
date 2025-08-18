import { getContactPageData } from "@/data/page-loaders";
import ContactForm from "@/components/ContactForm";
import ActiveCampaignForm from "@/components/ActiveCampaignForm";
import StrapiImage from "@/components/StrapiImage";
import PageContainer from "@/components/blocks/PageContainer";
import PageSection from "@/components/blocks/PageSection";
import GoogleMap from "@/components/GoogleMap";

export default async function ContactUsPage({ params }) {
  // Fix Next.js 15 params async requirement
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  
  // 🎯 只在訪問聯絡我們頁面時才獲取相關的 API 數據
  const pageData = await getContactPageData(locale);
  
  // 提取API數據（如果可用）或使用後備數據
  const contactPageData = pageData['contact-us'];
  const isPlaceholder = contactPageData?.meta?.isPlaceholder;
  

  return (
    <PageContainer>
      {/* 主标题 */}
      <PageSection className={'text-center'}>
        <h1 className='text-[42px] font-medium max-lg:text-5xl max-md:text-4xl'>{contactPageData?.data?.Title || '聯絡我們'}</h1>
      </PageSection> 

      <PageSection className={'pt-0'}>                
        <div className="grid grid-cols-2 gap-y-12 gap-x-10 max-lg:grid-cols-1">
          {/* 左側：聯絡信息和圖片 */}
          <div className="flex flex-col min-h-[500px]">
            {/* 聯絡信息內容 */}                            
            {contactPageData?.data?.EnquiryPhone && (
              <div>
                <h2 className="text-[#454176] text-[22px]">查詢電話</h2>
                <p>{contactPageData.data.EnquiryPhone}</p>
              </div>
            )}
            
            {contactPageData?.data?.Address && (
              <div className="mt-12">
                <h2 className="text-[#454176] text-[22px]">地址</h2>
                <p className="mb-4">{contactPageData.data.Address}</p>
                
                {/* Google Map */}
                <div className="mt-4">
                  <GoogleMap 
                    address={contactPageData.data.Address}
                    latitude={contactPageData.data.Latitude || "22.3134643"}
                    longitude={contactPageData.data.Longitude || "114.2181358"}
                    height="250px"
                    zoom={16}
                    className="shadow-md"
                  />
                </div>
              </div>
            )}
            {/* 底部圖片 */}
            {contactPageData?.data?.Image && (
              <div className="mt-auto">
                <StrapiImage 
                  image={contactPageData.data.Image}
                  className="max-w-full h-auto lg:w-[76%]"
                  alt="聯絡我們插圖"
                  width={contactPageData.data.Image.width}
                  height={contactPageData.data.Image.height}
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
  );
}

// SEO metadata
export const metadata = {
  title: '聯絡我們 | NGO 數碼化解決方案',
  description: '聯絡我們了解更多關於 NGO 數碼化解決方案。我們提供個案管理系統、AI 客服機械人等服務。',
};
