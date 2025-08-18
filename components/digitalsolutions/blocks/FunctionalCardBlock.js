export default function FunctionalCardBlock({ block, locale }) {
  if (!block) return null;

  return (
    <div className="p-8">
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* 左側標題 */}
        {block.Title && (
          <div className="lg:w-1/3 flex-shrink-0">
            <h3 className="text-3xl font-bold text-gray-900 leading-tight">
              {block.Title}
            </h3>
          </div>
        )}

        {/* 右側功能列表 */}
        {block.List && block.List.length > 0 && (
          <div className="lg:w-2/3 space-y-4">
            {block.List.map((item, index) => (
              <div 
                key={item.id || index}
                className="flex items-start gap-4"
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
    </div>
  );
}
