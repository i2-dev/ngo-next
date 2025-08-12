import { getContactPageData } from "@/data/page-loaders";
import ContactForm from "@/components/ContactForm";
import StrapiImage from "@/components/StrapiImage";

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          {contactPageData?.data?.Title || '聯絡我們'}
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* 左側：聯絡信息和圖片 */}
            <div className="bg-teal-200 p-8 flex flex-col justify-between min-h-[500px]">
              {/* 聯絡信息內容 */}
              <div className="text-gray-800">
                <div className="space-y-6">
                  {contactPageData?.data?.EnquiryPhone && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">查詢電話</h3>
                      <p className="text-gray-700 text-lg">{contactPageData.data.EnquiryPhone}</p>
                    </div>
                  )}
                  
                  {contactPageData?.data?.Address && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">地址</h3>
                      <p className="text-gray-700">{contactPageData.data.Address}</p>
                    </div>
                  )}
                  
                  {!contactPageData?.data?.EnquiryPhone && !contactPageData?.data?.Address && (
                    <div className="text-gray-500 italic">
                      聯絡信息尚未配置
                    </div>
                  )}
                </div>
              </div>
              
              {/* 底部圖片 */}
              {contactPageData?.data?.Image && (
                <div className="mt-8 flex justify-center">
                  <StrapiImage 
                    image={contactPageData.data.Image}
                    className="max-w-full h-auto"
                    alt="聯絡我們插圖"
                    width={300}
                    height={200}
                  />
                </div>
              )}
            </div>
            
            {/* 右側：聯絡表單 */}
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b-2 border-black pb-2">
                立即查詢
              </h2>
              
              <ContactForm services={contactPageData?.data?.Services || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// SEO metadata
export const metadata = {
  title: '聯絡我們 | NGO 數碼化解決方案',
  description: '聯絡我們了解更多關於 NGO 數碼化解決方案。我們提供個案管理系統、AI 客服機械人等服務。',
};
