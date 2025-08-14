import StrapiImage from "@/components/StrapiImage";

export default function StoryCardBlock({ block, locale }) {
  if (!block) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* 圖片區域 */}
        {block.Image && (
          <div className="w-full lg:w-1/2">
            <StrapiImage
              image={block.Image}
              alt={block.Title}
              className="w-full h-64 lg:h-full object-cover"
            />
          </div>
        )}

        {/* 內容區域 */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
          {/* 標題 */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {block.Title}
          </h3>
          
          {/* 內容 */}
          {block.Content && (
            <div className="prose prose-lg text-gray-600 mb-6">
              <p className="text-lg leading-relaxed">
                {block.Content}
              </p>
            </div>
          )}

          {/* 人物信息 */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-4">
              {/* 人物圖片 */}
              {block.Image && (
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <StrapiImage
                    image={block.Image}
                    alt={block.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* 人物信息 */}
              <div>
                <p className="font-semibold text-gray-900">{block.name}</p>
                <p className="text-sm text-gray-600">{block.Position}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
