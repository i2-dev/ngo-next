// 基础 InfoBlock 组件模板
export default function InfoBlock({ headline, content, image, cta }) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            {headline && (
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {headline}
              </h2>
            )}
            {content && (
              <p className="text-gray-600 mb-6">
                {content}
              </p>
            )}
            {cta && (
              <a
                href={cta.url}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                {cta.text}
              </a>
            )}
          </div>
          {image && (
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">图片占位</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}