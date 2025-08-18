import StrapiImage from "@/components/StrapiImage";

// 功能卡片組件 - 上下結構佈局
export default function FeatureCard({ card, index }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
      {/* 圖標區域 - 置頂 */}
      <div className="flex justify-center mb-6">
        {card.icon ? (
          <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center shadow-lg">
            <StrapiImage
              image={card.icon}
              alt={card.Title || '功能圖標'}
              className="w-16 h-16 md:w-18 md:h-18 object-contain"
            />
          </div>
        ) : (
          <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* 內容區域 - 置底 */}
      <div className="text-center space-y-4">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">
          {card.Title}
        </h3>

        {card.Text && card.Text.length > 0 && (
          <div className="space-y-3 text-left">
            {card.Text.map((textItem, textIndex) => (
              <div key={textIndex} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  {textItem.Text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
