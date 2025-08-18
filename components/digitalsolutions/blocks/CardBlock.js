import StrapiImage from "@/components/StrapiImage";

export default function CardBlock({ block, locale }) {
  if (!block) return null;

  return (
    <div className="py-16 px-4 ">
      <div className="max-w-6xl mx-auto">
        {/* 標題 */}
        {block.Title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {block.Title}
            </h2>
            {block.subTitle && (
              <p className="text-gray-600 text-lg">{block.subTitle}</p>
            )}
          </div>
        )}

        {/* 卡片項目 - 2x2 布局 */}
        {block.Carditem && block.Carditem.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-8xl mx-auto">
            {block.Carditem.map((item, index) => (
              <div 
                key={item.id || index}
                className={`bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1${item.type ? ` ${item.type}` : ''}`}
              >
                {/* 圓形圖標背景 */}
                <div className="flex items-start space-x-6">
                  {item.Cover && item.Cover.length > 0 && (
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                        <StrapiImage
                          image={item.Cover[0]}
                          alt={item.Title}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    {/* 標題 */}
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {item.Title}
                    </h3>
                    
                    {/* 內容 */}
                    {item.Content && (
                      <p className="text-gray-600 leading-relaxed">
                        {item.Content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
