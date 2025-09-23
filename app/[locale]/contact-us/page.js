import { getContactUsData } from "@/data/unified-loader";
import ActiveCampaignForm from "@/components/contactus/ActiveCampaignForm";
import SimpleImage from "@/components/SimpleImage";
import PageContainer from "@/components/blocks/PageContainer";
import PageSection from "@/components/blocks/PageSection";
import GoogleMap from "@/components/contactus/GoogleMap";
import { getTranslation } from "@/utils/translations";

export default async function ContactUsPage({ params }) {
  // Fix Next.js 15 params async requirement
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  
  // 🎯 只在訪問聯絡我們頁面時才獲取相關的 API 數據
  const pageData = await getContactUsData(locale);
  
  // 提取API數據（如果可用）或使用後備數據
  const contactPageData = pageData['contact-us'];
  const isPlaceholder = contactPageData?.meta?.isPlaceholder;
  
  // 使用統一翻譯系統
  const contactUsTitle = getTranslation(locale, 'common', 'contactUs', 'Contact Us');
  const enquiryPhoneTitle = getTranslation(locale, 'common', 'enquiryPhone', 'Enquiry Phone');
  const addressTitle = getTranslation(locale, 'common', 'address', 'Address');
  

  return (
    <PageContainer>
      {/* 主标题 */}
      <PageSection className={'text-center'}>
        <h1 className='text-[42px] font-medium max-lg:text-5xl max-md:text-4xl'>{contactPageData?.data?.Title || contactUsTitle}</h1>
      </PageSection> 

      <PageSection className={'pt-0'} delay={300}>                
        <div className="grid grid-cols-2 gap-y-12 gap-x-10 max-lg:grid-cols-1">
          {/* 左側：聯絡信息和圖片 */}
          <div className="flex flex-col min-h-[500px]">
            {/* 聯絡信息內容 */}                            
            {contactPageData?.data?.EnquiryPhone && (
              <div>
                <h2 className="text-[#454176] text-[22px]">{enquiryPhoneTitle}</h2>
                <p>{contactPageData.data.EnquiryPhone}</p>
              </div>
            )}
            
            {contactPageData?.data?.Address && (
              <div className="mt-12">
                <h2 className="text-[#454176] text-[22px]">{addressTitle}</h2>
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
                <SimpleImage 
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
            <ActiveCampaignForm locale={locale} />
          </div>
        </div>        
      </PageSection>            
    </PageContainer>
  );
}

// 生成聯絡我們頁面的SEO元數據
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  const { generateSEOMetadata } = await import('@/utils/seo-metadata');
  return await generateSEOMetadata('contact-us', { locale }, 'Contact Us | NGO Digital Solutions', 'Contact us to learn more about NGO digital solutions. We provide case management systems, AI customer service robots and other services.');
}
