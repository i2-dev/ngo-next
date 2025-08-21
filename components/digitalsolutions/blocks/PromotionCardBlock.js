import StrapiImage from "@/components/StrapiImage";
import SharedButton from "@/components/blocks/Button";

export default function PromotionCardBlock({ block, locale }) {
  if (!block) return null;

  // 判斷是否為 deliver 類型
  const isDeliverType = block.type === 'deliver';

  // 如果是 deliver 類型，使用特殊的布局
  if (isDeliverType) {
    return (      
      <div className="bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 rounded-3xl overflow-hidden shadow-2xl">
        {/* Deliver 類型：垂直堆疊布局，圖片在上，內容在下 */}
        <div className="flex flex-col">
          {/* 頂部圖片區域 */}
          {block.Cover && (
            <div className="relative w-full h-[400px] lg:h-[500px]">
              <StrapiImage
                image={block.Cover}
                alt={block.Cover.alternativeText || "Delivery promotion image"}
                className="w-full h-full object-cover"
                fill
                sizes="100vw"
              />
            </div>
          )}

          {/* 底部內容區域 */}
          <div className="p-8 lg:p-12 text-center">
            {/* 主標題 */}
            {block.Title && (
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {block.Title}
              </h2>
            )}

            {/* 副標題或描述 */}
            {block.Content && (
              <div 
                className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed prose prose-lg max-w-none mx-auto"
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
              <div className="flex justify-center">
                <SharedButton 
                  {...block.Button}
                  className="!inline-block !px-8 !py-4 !bg-green-500 !hover:bg-green-600 !text-white !font-bold !rounded-full !shadow-lg !transform !hover:scale-105 !transition-all !duration-300"
                />
              </div>
            )}
          </div>
        </div>
      </div>        
    );
  }

  // 非 deliver 類型：保持原有的水平布局
  return (        
    <div className='flex max-lg:flex-col'>
      {/* 左側圖片區域 */}        
      {block.Cover && (            
        <StrapiImage
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
