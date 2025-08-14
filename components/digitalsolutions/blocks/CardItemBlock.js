import StrapiImage from "@/components/StrapiImage";

export default function CardItemBlock({ block, locale }) {
  if (!block) return null;

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* 圖片區域 */}
        {block.Cover && block.Cover.length > 0 && (
          <div className="w-full lg:w-1/3">
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <StrapiImage
                image={block.Cover[0]}
                alt={block.Title}
                className="w-full h-64 lg:h-48 object-cover"
              />
            </div>
          </div>
        )}

        {/* 內容區域 */}
        <div className="w-full lg:w-2/3 space-y-4">
          {/* 標題 */}
          <h3 className="text-2xl font-bold text-gray-900">
            {block.Title}
          </h3>
          
          {/* 內容 */}
          {block.Content && (
            <div className="prose prose-lg text-gray-600">
              <p className="text-lg leading-relaxed">
                {block.Content}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
