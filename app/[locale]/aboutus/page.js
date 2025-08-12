import { getAboutPageData } from "@/data/page-loaders";
import StrapiImage from '@/components/StrapiImage';
import ClientsSwiper from '@/components/aboutus/ClientsSwiper';
import styles from '@/styles/AboutUs.module.css';

export default async function AboutUsPage({ params }) {
  // Fix Next.js 15 params async requirement
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  
  // 🎯 只在訪問關於我們頁面時才獲取相關的 API 數據
  const pageData = await getAboutPageData(locale);
  
  // 提取API數據（如果可用）或使用後備數據
  const aboutPageData = pageData['about-us'];
  const isPlaceholder = aboutPageData?.meta?.isPlaceholder;
  
  // 從API數據中提取具體內容
  const data = aboutPageData?.data || {};
  const title = data.Title || '關於我們';
  const rightContent = data.RightContent || '';
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

  const contentLines = formatContent(rightContent);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - 主要内容区域 */}
      <section className={`py-16 lg:py-24 ${styles.heroSection}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* 左侧图片 */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                {leftImage ? (
                  <div className={`relative overflow-hidden rounded-2xl shadow-2xl ${styles.imageContainer}`}>
                    <StrapiImage
                      image={leftImage}
                      alt={title}
                      width={600}
                      height={500}
                      className="w-full h-auto object-cover"
                      priority={true}
                    />
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl shadow-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m5 0l3-3m-3 3l3 3M9 5l3 3m0 0l3-3" />
                        </svg>
                      </div>
                      <p className="text-gray-600 font-medium">NGO 服務形象</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 右侧内容 */}
            <div className="order-1 lg:order-2">
              <div className={`space-y-6 ${styles.contentArea}`}>
                {/* 主标题 */}
                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    {title}
                  </h1>
                </div>

                {/* 内容区域 */}
                <div className={`prose prose-lg max-w-none ${styles.prose}`}>
                  {contentLines.map((line, index) => {
                    // 检查是否为标题行（以##开头）
                    if (line.startsWith('##')) {
                      const titleText = line.replace(/^##\s*/, '');
                      return (
                        <h2 key={index} className="text-2xl md:text-3xl font-bold text-blue-600 mt-8 mb-4 first:mt-0">
                          {titleText}
                        </h2>
                      );
                    }
                    
                    // 普通段落
                    if (line.trim() !== '') {
                      return (
                        <p 
                          key={index} 
                          className="text-lg text-gray-700 leading-relaxed mb-6"
                          dangerouslySetInnerHTML={{ __html: line }}
                        />
                      );
                    }
                    return null;
                  })}
                </div>

                {/* 联系我们按钮 */}
                <div className="pt-8">
                  <a 
                    href="/contact-us" 
                    className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span>聯絡我們</span>
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 客户Logo轮播区域 */}
      {ourClients && (
        <ClientsSwiper 
          clientsData={ourClients}
          className={`border-t border-gray-200 ${styles.clientsSwiper}`}
        />
      )}

      {/* 占位符提示 */}
      {isPlaceholder && (
        <div className={`fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-lg shadow-lg ${styles.placeholderNotice}`}>
          <p className="text-sm">
            ⚠️ 使用后备数据 - API 暂时不可用
          </p>
        </div>
      )}
    </div>
  );
}

// SEO metadata
export const metadata = {
  title: '關於我們 | NGO 數碼化解決方案',
  description: '我們致力於為 NGO 組織提供最優質的數碼化解決方案，協助非營利組織更有效地服務社會。',
};
