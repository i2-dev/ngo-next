import StrapiImage from "@/components/StrapiImage";

export default function StoryCardBlock({ block, locale }) {
  if (!block) return null;

  return (
    <div className="relative min-h-[500px] rounded-2xl overflow-hidden">
      {/* 背景圖片 */}
      {block.Image && (
        <div className="absolute inset-0">
          <StrapiImage
            image={block.Image}
            alt={block.Title}
            className="w-full h-full object-cover"
          />
          {/* 漸層遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        </div>
      )}

      {/* 引言卡片 */}
      <div className="relative z-10 p-8 h-full flex items-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md relative">
          {/* 引言圖標 */}
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl text-blue-600">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{block.Title}</h3>
            </div>
          </div>
          
          {/* 引言內容 */}
          {block.Content && (
            <div className="mb-6">
              <div 
                className="text-gray-700 text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: block.Content }}
              />
            </div>
          )}

          {/* 人物信息 */}
          <div className="pt-4 border-t border-gray-100">
            <p className="font-semibold text-gray-900 mb-1">{block.name || block.Title}</p>
            <p className="text-sm text-blue-600 font-medium">{block.Position}</p>
          </div>

          {/* 裝飾性引號 */}
          <div className="absolute -bottom-2 -right-2 text-6xl text-purple-200 opacity-50">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
