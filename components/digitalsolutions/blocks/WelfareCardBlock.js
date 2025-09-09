import StrapiImage from "@/components/StrapiImage";
import CtaButton from "@/components/CtaButton";
import SharedButton from "@/components/blocks/Button";

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
    <div className="bg-linear-[to_bottom,#fff_25%,#ffedc5_100%] shadow-[0_10px_50px_rgba(0,0,0,0.1)] flex flex-wrap gap-12 rounded-[30px] p-12">      
      {/* 左側內容區 */}
      <div className='w-full lg:w-[calc(50%-24px)]'>
        {/* 主標題 */}
        {block.Title && (          
          <h2 className='text-[#ff6800] text-[46px]/[1.2] -indent-6 mb-5 max-lg:text-4xl max-md:text-3xl'>
            {block.Title}
          </h2>
        )}

        {/* 服務標題與描述 */}
        {block.icon ? (
          <div className='flex flex-col mb-12 sm:flex-row sm:items-start'>
            {/* 圖標 */}
            <StrapiImage
              image={block.icon}
              alt="DeepSeek AI"
              width={block.icon.width}
              height={block.icon.height}
              className="flex-none w-23 rounded-full border border-[#eee] mb-5 sm:mr-5 sm:mb-0"
            />                        
            {block.Content && (
              <div
                className="[&>h3]:text-[#3e3978] [&>h3]:text-[28px]/[1.5] [&>h3]:font-semibold"                 
                dangerouslySetInnerHTML={{ __html: block.Content }}
              />
            )}          
          </div>
        ) : (
          <div className='mb-12'>
            {block.Content && (
              <div
                className="[&>h3]:text-[#3e3978] [&>h3]:text-[28px]/[1.5] [&>h3]:font-semibold"
                dangerouslySetInnerHTML={{ __html: block.Content }}
              />
            )}
          </div>
        )}

        {/* 申請按鈕 */}
        {block.Button && (
          <SharedButton {...block.Button} className={'!inline-block'} />                   
        )}
      </div>

      {/* 右側福利列表 */}
      <div className='w-full lg:w-[calc(50%-24px)]'>        
        {block.subTitle && (
          <p className='text-[20px]/[1.8] mb-[30px]'><strong>{block.subTitle}</strong></p>          
        )}
        

        {/* 福利項目列表 */}
        <ul>
          {benefitsList.map((benefit, index) => (
            <li key={benefit.id || index} className="bg-[url(/images/global/list-checkpoint.png)] bg-no-repeat bg-position-[0_2px] list-none text-[20px] p-[2px_0_2px_47px] mb-5 last:mb-0">
              {/* 綠色勾選圖標 */}
              {/* <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div> */}
              
              {/* 福利描述 */}              
              {benefit.text}              
            </li>
          ))}
        </ul>
      </div>      
    </div>    
  );
}
