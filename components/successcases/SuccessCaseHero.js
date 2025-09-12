import StrapiImage from "@/components/StrapiImage";
import styles from "@/styles/SuccessCases.module.css";
import SharedButton from "../blocks/Button";

export default function SuccessCaseHero({ successCase, locale, bgcolor ="white", variant = "cover" }) {
  if (!successCase) {
    return null;
  }

  // Use the passed bgcolor prop, not the one from successCase
  // This ensures the preview page can override the Strapi data
  // Force use the passed bgcolor prop, ignore successCase.bgcolor completely
  const finalBgcolor = bgcolor;

  // Debug logging to identify the bgcolor issue
  console.log('=== SuccessCaseHero Debug ===');
  console.log('bgcolor prop:', bgcolor);
  console.log('bgcolor prop type:', typeof bgcolor);
  console.log('successCase.bgcolor:', successCase.bgcolor);
  console.log('finalBgcolor:', finalBgcolor);
  console.log('successCase.title:', successCase.title);
  console.log('successCase.documentId:', successCase.documentId);
  console.log('==============================');

  return (
    <>
      <div className="text-center mb-12">                    
          <h1 className='text-[42px] font-medium max-lg:text-5xl max-md:text-4xl'>成功案例</h1>
      </div>

      {/* <div className="bg-[#e5f8fe] bg-[url(/images/success-stories/case_01_bg_image.jpg)] bg-bottom bg-no-repeat bg-size-[130%] mt-30 relative xl:bg-cover"> */}
      <div className={`mt-30 relative ${ 
        finalBgcolor === "lightblue" ? "bg-[#e5f8fe]" : 
        finalBgcolor === "white" ? "bg-white" : 
        "bg-white" 
      }`}>
        {/* 背景圖片 */}
        {successCase.background && (
          <>
            <div className="overflow-hidden flex flex-col absolute inset-0 z-0">              
              <StrapiImage
                image={successCase.background}
                width={successCase.background.width}
                height={successCase.background.height}
                alt={successCase.title}
                className="w-full h-auto mt-auto origin-bottom scale-130 lg:scale-115"
                priority
              />
            </div>
          </>
        )}

        {/* 內容區域 */}        
        {/* 圖標 */}
        {successCase.icon && (              
          <StrapiImage
            image={successCase.icon}
            width={successCase.icon.width}
            height={successCase.icon.height}
            alt={successCase.title}
            className="w-[150px] rounded-full shadow-[0_2px_7px_rgba(0,0,0,0.1)] absolute left-1/2 top-0 -translate-1/2 z-3"
          />                
        )}

        <div className='text-center pt-25 px-6 pb-75 relative z-1 sm:px-12 lg:px-25 lg:pb-125'>
          {/* 標題 */}
          <h2 className='text-2xl'>
            {successCase.title}
          </h2>              

          {/* 描述 */}
          {successCase.content && (            
            <div 
              className="[&>p]:text-lg [&>p>a]:text-[#286e11] [&>p>a:hover]:text-[#555]"
              dangerouslySetInnerHTML={{ __html: successCase.content }}
            />            
          )}

          {/* 外部連結按鈕 */}
          {successCase.button && (
            <SharedButton
              {...successCase.button}
              className="!bg-[#286e11] !inline-block mt-[30px]"
            />            
          )}
        </div>          
      </div>
    </>
  );
}
