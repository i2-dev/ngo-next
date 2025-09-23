export default async function AccessibilityPage({ params }) {
  // Fix Next.js 15 params async requirement
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  
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
            {locale === 'zh-hant' ? '無障礙瀏覽' : 'Accessibility'}
          </h1>
        </div>
        
        {/* 內容區域 */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center space-y-6">
              {locale === 'zh-hant' ? (
                <>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    為確保終端用戶擁有良好的網頁瀏覽和使用體驗，i2通過編制符合Web無障礙(WCAG 2.0)標準的設計，來提供我們的內容。
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    如果您在無障礙性方面發現任何問題，請隨時致電+852 3426 2604與我們聯繫。
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To ensure end-users have a good web browsing and usage experience, i2 provides our content through designs that comply with Web Accessibility (WCAG 2.0) standards.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    If you encounter any problems with accessibility, please feel free to call us at +852 3426 2604.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
