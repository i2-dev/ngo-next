import { getAboutUsData } from "@/data/unified-loader";
import SimpleImage from '@/components/SimpleImage';
import ClientsSwiper from '@/components/aboutus/ClientsSwiper';
import styles from '@/styles/AboutUs.module.css';
import PageContainer from "@/components/blocks/PageContainer";
import PageSection from "@/components/blocks/PageSection";
import { getTranslation } from "@/utils/translations";

export default async function AboutUsPage({ params }) {
  // Fix Next.js 15 params async requirement
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  
  // 🎯 只在訪問關於我們頁面時才獲取相關的 API 數據
  const pageData = await getAboutUsData(locale);
  
  // 提取API數據（如果可用）或使用後備數據
  const aboutPageData = pageData['about-us'];
  const isPlaceholder = aboutPageData?.meta?.isPlaceholder;
  
  // 從API數據中提取具體內容
  const data = aboutPageData?.data || {};
  const title = data.Title || getTranslation(locale, 'pages', 'aboutUs', 'title');
  const Content = data.Content || '';
  const leftImage = data.LeftImage && data.LeftImage.length > 0 ? data.LeftImage[0] : null;
  const ourClients = data.OurClients && data.OurClients.length > 0 ? data.OurClients[0] : null;

  // 處理markdown格式的內容
  const formatContent = (content) => {
    if (!content) return '';
    return content
      .replace(/\\n/g, '\n')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => line.trim());
  };

  const contentLines = formatContent(Content);

  return (    
    <PageContainer>    
      {/* Hero Section - 主要内容区域 */}
        {/* 主标题 */}        
        <PageSection className={'text-center'}>
          <h1 className='text-[42px] font-medium max-lg:text-5xl max-md:text-4xl'>{title}</h1>
        </PageSection>
        

        <PageSection className={'pt-0'} delay={300}>
          <div className="grid grid-cols-2 gap-y-12 gap-x-10 max-lg:grid-cols-1">
              <div>                  
                {leftImage ? (
                <SimpleImage
                    image={leftImage}
                    alt={title}
                    width={leftImage.width}
                    height={leftImage.height}
                    className="w-full"
                    priority={true}
                  />
                ) : ( null ) }
              </div>
              <div 
                className="[&>h2]:text-[#454176] [&>h2]:text-[#454176] [&>h2]:text-[22px] [&>p>a]:text-[#286e11] [&>p>a]:hover:text-[#555]"
                dangerouslySetInnerHTML={{ __html: Content }}
              />
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

      {/* 占位符提示 */}
      {isPlaceholder && (
        <div className={`fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg shadow-lg ${styles.placeholderNotice}`}>
          <p className="text-sm">
            {getTranslation(locale, 'common', 'placeholderNotice')}
          </p>
        </div>
      )}    
    </PageContainer>
  );
}

// 生成關於我們頁面的SEO元數據
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  const { generateSEOMetadata } = await import('@/utils/seo-metadata');
  return await generateSEOMetadata('about-us', { locale }, 'About Us | NGO Digital Solutions', 'We are committed to providing the highest quality digital solutions for NGO organizations, helping non-profit organizations serve society more effectively.');
}
