import StrapiImage from "@/components/StrapiImage";
import SharedButton from "@/components/blocks/Button";

export default function PromotionCardBlock({ block, locale }) {
  if (!block) return null;

  // 判斷是否為 deliver 類型
  const isDeliverType = block.type === 'deliver';

  // 如果是 deliver 類型，使用特殊的布局
  if (isDeliverType) {
    return (
      <div className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
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
        </div>
      </div>
    );
  }

  // 非 deliver 類型：保持原有的水平布局
  return (
    <div className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-0 items-center min-h-[600px]">
            {/* 左側圖片區域 */}
            <div className="relative h-full min-h-[400px] lg:min-h-[600px]">
              {block.Cover && (
                <div className="relative w-full h-full">
                  <StrapiImage
                    image={block.Cover}
                    alt={block.Cover.alternativeText || "Promotion image"}
                    className="w-full h-full object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
            </div>

            {/* 右側內容區域 */}
            <div className="p-8 lg:p-12 xl:p-16 flex flex-col justify-center h-full">
              {/* 主標題 */}
              {block.Title && (
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {block.Title}
                </h2>
              )}

              {/* 副標題或描述 */}
              {block.Content && (
                <div 
                  className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed prose prose-lg max-w-none"
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
                <div className="flex flex-col sm:flex-row gap-4">
                  <SharedButton 
                    {...block.Button}
                    className="!inline-block"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
