import SimpleImage from "@/components/SimpleImage";
import SharedButton from "@/components/blocks/Button";

export default function PromotionCardBlock({ block, locale }) {
  if (!block) return null;

  // 判斷是否為 deliver 類型
  const isDeliverType = block.type === 'deliver';

  // 如果是 deliver 類型，使用特殊的布局
  if (isDeliverType) {
    return (      
      <div className=" rounded-[30px] bg-linear-[to_bottom,#fff_25%,#c5ead0_100%] shadow-[0_10px_50px_rgba(0,0,0,0.1)] p-7.5 sm:p-12.5 text-center relative">
        {/* Deliver 類型：垂直堆疊布局，圖片在上，內容在下 */}
        
        {/* 頂部圖片區域 */}
        {block.Cover && (
          <SimpleImage
            image={block.Cover}
            alt={block.Cover.alternativeText || "Delivery promotion image"}
            className="absolute left-1/2 top-0 -translate-1/2"
            width={block.width}
            height={block.height}
          />
        )}

        {/* 底部內容區域 */}        
        {/* 主標題 */}
        {block.Title && (
          <h2 className='text-[#3e3978] text-[46px]/[1.2] font-medium mb-5 max-lg:text-4xl max-md:text-3xl'>
            {block.Title}
          </h2>          
        )}

        {/* 副標題或描述 */}
        {block.Content && (
          <div 
            className="text-xl leading-relaxed prose prose-lg"
            dangerouslySetInnerHTML={{ __html: block.Content }}
          />
        )}

        {/* 功能列表 - 水平排列 */}
        {block.List && block.List.length > 0 && (
          <div className="mb-8 flex flex-wrap justify-center gap-6">
            {block.List.map((item, index) => (
              <div 
                key={item.id || index}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700 text-sm font-medium">
                  {item.List || item.Content || item.Title}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* CTA 按鈕 */}
        {block.Button && (          
          <SharedButton 
            {...block.Button}
            className="!inline-block mt-7.5"
          />          
        )}
                
      </div>        
    );
  }

  // 非 deliver 類型：保持原有的水平布局
  return (        
    <div className='flex max-lg:flex-col'>
      {/* 左側圖片區域 */}        
      {block.Cover && (            
        <SimpleImage
          image={block.Cover}
          width={block.Cover.width}
          height={block.Cover.height}
          alt={block.Cover.alternativeText || "Promotion image"}
          className="w-1/2 rounded-[30px] relative object-cover max-lg:w-full"                
        />            
      )}        

      {/* 右側內容區域 */}
      <div className="bg-linear-[to_bottom,#fff_25%,#d7f3f2_100%] rounded-[30px] flex-auto -ml-[11%] p-[80px_50px_50px_calc(11%+50px)] max-lg:rounded-[0_0_30px_30px] max-lg:ml-0 max-lg:-mt-[30px] max-lg:p-[80px_30px_50px]">
        {/* 主標題 */}
        {block.Title && (
          <h2 className="text-[#3e3978] text-[38px]/[1.368] mb-[30px] max-lg:text-3xl max-md:text-2xl">
            {block.Title}
          </h2>
        )}

        {/* 副標題或描述 */}
        {block.Content && (
          // <p className='text-xl/[1.8]'>
          //   dangerouslySetInnerHTML={{ __html: block.Content }}
          // </p>
          <p 
            className="text-xl/[1.8]"
            dangerouslySetInnerHTML={{ __html: block.Content }}
          />
        )}

        {/* 功能列表 */}
        {block.List && block.List.length > 0 && (
          <div className="mb-8 space-y-3">
            {block.List.map((item, index) => (
              <div 
                key={item.id || index}
                className="flex items-center gap-3"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700 leading-relaxed">
                  {item.List || item.Content || item.Title}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* CTA 按鈕 */}
        {block.Button && (          
          <SharedButton 
            {...block.Button}
            className="!inline-block mt-15"
          />          
        )}
      </div>
    </div>         
  );
}
