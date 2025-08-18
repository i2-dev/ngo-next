import StrapiImage from "@/components/StrapiImage";
import SharedButton from "@/components/blocks/Button";

export default function DigitalSolutionHero({ plan, locale, variant = "cover" }) {
  if (!plan) return null;

  // AI Solution 頁面使用簡化版本 (在 PageContainer 內)
  if (variant === "inline") {
    return (
      <div className="relative bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 text-white py-16 rounded-2xl overflow-hidden">
        {/* 背景圖片 */}
        {plan.image && (
          <div className="absolute inset-0">
            <StrapiImage
              image={plan.image}
              alt={plan.title}
              className="w-full h-full object-cover opacity-20"
            />
          </div>
        )}
        
        {/* 內容 */}
        <div className="relative z-10 px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* 圖標 */}
            {plan.icon && (
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm flex items-center justify-center">
                  <StrapiImage
                    image={plan.icon}
                    alt={plan.title}
                    className="w-12 h-12 object-contain"
                  />
                </div>
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {plan.title}
            </h1>
            
            {plan.content && (
              <div 
                className="text-lg md:text-xl mb-6 opacity-90 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: plan.content }}
              />
            )}
            
            {plan.button && (
              <SharedButton
                {...plan.button}
                className="inline-flex items-center"
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // 其他頁面使用完整封面版本
  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* 封面背景圖片 */}
      {plan.image && (
        <div className="absolute inset-0">
          <StrapiImage
            image={plan.image}
            alt={plan.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* 漸變背景（如果沒有圖片） */}
      {!plan.image && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600"></div>
      )}
      
      {/* 背景裝飾 - NGO 文字 */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="text-[20rem] font-black text-white select-none">
          NGO
        </div>
      </div>
      
      {/* 內容 */}
      <div className="relative z-10 xl:container xl:max-w-[1280px] xl:mx-auto px-5">
        <div className="max-w-4xl mx-auto text-center">
          {/* 圖標 */}
          {plan.icon && (
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                <StrapiImage
                  image={plan.icon}
                  alt={plan.title}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                />
              </div>
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {plan.title}
          </h1>
          
          {plan.content && (
            <div 
              className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: plan.content }}
            />
          )}
          
          {plan.button && (
            <SharedButton
              {...plan.button}
              className="inline-flex items-center"
            />
          )}
        </div>
      </div>
    </div>
  );
}
