import StrapiImage from "@/components/StrapiImage";
import CtaButton from "@/components/CtaButton";

export default function WelfareCardBlock({ block, locale }) {
  if (!block) return null;

  // 處理福利列表數據
  const getBenefitsList = () => {
    // 如果有 CardList 數據，使用它
    if (block.CardList && block.CardList.length > 0) {
      return block.CardList.map(item => ({
        id: item.id,
        text: item.Content
      }));
    }
  };

  const benefitsList = getBenefitsList();

  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl p-8 md:p-12 shadow-lg">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* 左側內容區 */}
            <div className="flex-1 space-y-6">
              {/* 主標題 */}
              {block.Title && (
                <h2 className="text-3xl md:text-4xl font-bold text-orange-600">
                  {block.Title}
                </h2>
              )}

              {/* 服務標題與描述 */}
              <div className="flex items-start gap-4">
                {/* 圖標 */}
                {block.icon && (
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <StrapiImage
                        image={block.icon}
                        alt="DeepSeek AI"
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-2">
                  {block.Content && (
                    <div 
                      className="text-blue-800 text-lg"
                      dangerouslySetInnerHTML={{ __html: block.Content }}
                    />
                  )}
                  </h3>
                  
                </div>
              </div>

              {/* 申請按鈕 */}
              {block.Button && (
                <div className="pt-4">
                  <CtaButton
                    cta={{
                      href: block.Button.URL || '#',
                      text: (
                        <span className="inline-flex items-center gap-2">
                          {block.Button.Text || '立即申請'}
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      ),
                      isExternal: block.Button.URL && (block.Button.URL.startsWith('http://') || block.Button.URL.startsWith('https://'))
                    }}
                    className="inline-flex items-center py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg font-bold"
                    colorClass="bg-green-500 hover:bg-green-600 text-white"
                  />
                </div>
              )}
            </div>

            {/* 右側福利列表 */}
            <div className="flex-1  rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6">
                {block.subTitle && (
                    <p className="text-blue-800 text-lg">
                      {block.subTitle}
                    </p>
                  )}
              </div>

              {/* 福利項目列表 */}
              <div className="space-y-4">
                {benefitsList.map((benefit, index) => (
                  <div key={benefit.id || index} className="flex items-start gap-3">
                    {/* 綠色勾選圖標 */}
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    {/* 福利描述 */}
                    <p className="text-gray-700 leading-relaxed flex-1">
                      {benefit.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
