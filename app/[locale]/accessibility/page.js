import { getTranslation } from '@/utils/translations';

export default async function AccessibilityPage({ params }) {
  // Fix Next.js 15 params async requirement
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  
  // 使用統一翻譯系統
  const title = getTranslation(locale, 'pages', 'accessibility', 'title');
  const description1 = getTranslation(locale, 'pages', 'accessibility', 'description1');
  const description2 = getTranslation(locale, 'pages', 'accessibility', 'description2');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-pink-50">
      {/* 背景水印 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-[20rem] font-bold text-gray-200 opacity-20 select-none">
          {locale === 'zh-hant' ? 'NGO DIGITAL' : 'NGO DIGITAL'}
        </div>
      </div>
      
      {/* 主要內容 */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* 標題 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            {title}
          </h1>
        </div>
        
        {/* 內容區域 */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                {description1}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {description2}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
