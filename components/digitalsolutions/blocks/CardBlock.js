import StrapiImage from "@/components/StrapiImage";

export default function CardBlock({ block, locale }) {
  if (!block) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* 標題 */}
      {block.Title && (
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {block.Title}
          </h3>
          {block.subTitle && (
            <p className="text-gray-600">{block.subTitle}</p>
          )}
        </div>
      )}

      {/* 卡片項目 */}
      {block.Carditem && block.Carditem.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {block.Carditem.map((item, index) => (
            <div 
              key={item.id || index}
              className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-md transition-shadow duration-200"
            >
              {/* 圖片 */}
              {item.Cover && item.Cover.length > 0 && (
                <div className="mb-4">
                  <StrapiImage
                    image={item.Cover[0]}
                    alt={item.Title}
                    className="w-16 h-16 mx-auto object-contain"
                  />
                </div>
              )}
              
              {/* 標題 */}
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {item.Title}
              </h4>
              
              {/* 內容 */}
              {item.Content && (
                <p className="text-gray-600 text-sm">
                  {item.Content}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
