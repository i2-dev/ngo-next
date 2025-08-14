export default function FunctionalCardBlock({ block, locale }) {
  if (!block) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
      {/* 標題 */}
      {block.Title && (
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {block.Title}
          </h3>
        </div>
      )}

      {/* 功能列表 */}
      {block.List && block.List.length > 0 && (
        <div className="space-y-4">
          {block.List.map((item, index) => (
            <div 
              key={item.id || index}
              className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm"
            >
              {/* 圖標 */}
              <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                <svg 
                  className="w-4 h-4 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
              
              {/* 內容 */}
              <div className="flex-1">
                <p className="text-gray-700 leading-relaxed">
                  {item.List}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
