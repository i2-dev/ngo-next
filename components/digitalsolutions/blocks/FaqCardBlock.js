export default function FaqCardBlock({ block, locale }) {
  if (!block) return null;

  return (
    <div className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* 左側標題區域 */}
          <div className="lg:sticky lg:top-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {block.Title}
            </h2>
          </div>

          {/* 右側 FAQ 內容區域 */}
          <div className="space-y-6">
            {block.List && block.List.length > 0 && (
              <div className="space-y-8">
                {block.List.map((item, index) => (
                  <div 
                    key={item.id || index}
                    className=" overflow-hidden"
                  >
                    {/* 問題標題 */}
                    <div className="">
                      <h3 className="text-xl font-bold text-gray-900">
                        {item.Title}
                      </h3>
                    </div>
                    
                    {/* 答案內容 */}
                    <div className="">
                      <div className="prose prose-lg text-gray-600 leading-relaxed">
                        <p>{item.Content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
