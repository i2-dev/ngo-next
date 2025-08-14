import StrapiImage from "@/components/StrapiImage";

// 根據方案的 order 映射到正確的 URL（按照菜單中的實際URL）
function getUrlForPlan(plan) {
  const urlMap = {
    0: '/ai-solution',                              // AI為你解決實際問題
    1: '/ngo-digital-solutions-2',                  // NGO 數碼化解決方案
    2: '/ai-case-management-platform',              // AI 個案管理平台
    3: '/ai-workflow-transformation-solutions',     // AI 工作流程轉型方案
    4: '/ai-hotline-system',                        // AI 熱線系統
    5: '/institutional-online-learning-system'      // 機構網上學習管理系統
  };
  
  return urlMap[plan.order] || `/digital-solutions/${plan.order}`;
}

export default function DigitalSolutionCard({ plan, index, locale }) {
  const isEven = index % 2 === 0;
  
  return (
    <div className={`flex flex-col lg:flex-row items-center gap-12 ${
      isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
    }`}>
      {/* 圖片區域 */}
      <div className="w-full lg:w-1/2">
        {plan.image && (
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <StrapiImage
              image={plan.image}
              alt={plan.title}
              className="w-full h-80 lg:h-96 object-cover"
              priority={index < 2}
            />
            {/* 漸變遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}
      </div>

      {/* 內容區域 */}
      <div className="w-full lg:w-1/2 space-y-6">
        {/* 標題 */}
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {plan.title}
          </h2>
          
          {/* 內容 */}
          {plan.content && (
            <div className="prose prose-lg text-gray-600">
              <p className="text-lg leading-relaxed">
                {plan.content}
              </p>
            </div>
          )}
        </div>

        {/* 按鈕 */}
        <div className="pt-4 space-y-3">
          {/* 查看詳情按鈕 */}
          <div>
            <a
              href={`/${locale}${getUrlForPlan(plan)}`}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              查看詳情
              <svg 
                className="ml-2 w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M14 5l7 7m0 0l-7 7m7-7H3" 
                />
              </svg>
            </a>
          </div>
          
          {/* 原始按鈕（如果存在） */}
          {plan.button && (
            <div>
              <a
                href={plan.button.URL}
                target={plan.button.Target === '_blank' ? '_blank' : '_self'}
                rel={plan.button.Target === '_blank' ? 'noopener noreferrer' : ''}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {plan.button.Text}
                <svg 
                  className="ml-2 w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                  />
                </svg>
              </a>
            </div>
          )}
        </div>

        {/* 額外信息 */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-500">
            <span>方案編號: {plan.order}</span>
            {plan.publishedAt && (
              <>
                <span className="mx-2">•</span>
                <span>
                  更新時間: {new Date(plan.publishedAt).toLocaleDateString('zh-Hant')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
