import StrapiImage from "@/components/StrapiImage";
import SharedButton from "@/components/blocks/Button";

export default function DigitalSolutionHero({ plan, locale, bgcolor, bgGradient,  variant = "cover" }) {
  if (!plan) return null;

  // AI Solution 頁面使用簡化版本 (在 PageContainer 內)
  if (variant === "inline") {
    return (
      <>
        <div className="text-center mb-24">
            <h1 className='text-[42px] font-medium max-lg:text-5xl max-md:text-4xl'>{plan.title}</h1>            
            {plan.content && (
              <p 
                className="text-lg"
                dangerouslySetInnerHTML={{ __html: plan.content }}
              />
            )}
        </div>

        <div className="relative h-[500px] lg:h-[700px]">          
          {/* 內容 */}
          <div className="text-center absolute left-0 right-0 bottom-25">            
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
              
            {plan.button && (
              <SharedButton
                {...plan.button}
                className="inline-flex items-center"
              />
            )}            
          </div>

          {/* 背景圖片 */}
          {plan.image && (            
            <StrapiImage
              image={plan.image}
              width={plan.image.width}
              height={plan.image.height}
              alt={plan.title}
              className="w-full h-full object-cover"
            />            
          )}
        </div>
      </>
    );
  }

  // 其他頁面使用完整封面版本
  return (
    <>
      <div className="text-center mb-12">
          <h1 className='text-[#3e3978] text-[52px] font-medium max-lg:text-5xl max-md:text-4xl'>{plan.title}</h1>          
      </div>            
      <div
        className={`mt-30 relative lg:h-[700px] ${
        bgcolor === "gray" ? "max-lg:bg-[#979797]" : bgcolor === "blue" ? "max-lg:bg-[#00167b]" : bgcolor === "brown" ? "max-lg:bg-[#2f191b]" : `max-lg:bg-[#979797]`
      }`}
      >        
        {/* 圖標 */}
        {plan.icon && (            
          <StrapiImage
            image={plan.icon}
            alt={plan.title}
            width={plan.icon.width}
            height={plan.icon.height}
            className="absolute left-1/2 top-0 -translate-1/2 z-3"
          />              
        )}
        <div className='text-white text-center p-[80px_30px_30px] relative z-2 lg:absolute lg:inset-0 max-lg:-mb-20 max-sm:mb-0'>              
            {plan.content && (
              <div
                className="[&>h2]:text-5xl [&>h2]:mb-2 max-lg:[&>h2]:text-4xl max-md:[&>h2]:text-3xl"                
                dangerouslySetInnerHTML={{ __html: plan.content }}
              />
            )}
            {plan.button && (
              <SharedButton
                {...plan.button}
                className="!inline-block mt-[30px]"
              />
            )}
        </div>        
        <div
          className="absolute inset-0 bottom-[35vw] lg:hidden"
          style={{
            background: bgGradient
          }}
        ></div>
        {/* 封面背景圖片 */}
        {plan.image && (
          <div className="">
            <StrapiImage
              image={plan.image}
              alt={plan.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>      
    </>
  );
}
