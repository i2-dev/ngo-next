import StrapiImage from "@/components/StrapiImage";
import styles from "@/styles/DigitalSolutions.module.css";

export default function SuccessCaseHero({ successCase, locale, variant = "cover" }) {
  if (!successCase) {
    return null;
  }

  return (
    <section className={`relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden pt-24 ${styles.heroSection}`}>
      {/* 背景圖片 */}
      {successCase.background && (
        <>
          <div className="absolute inset-0 z-0">
            <StrapiImage
              image={successCase.background}
              alt={successCase.title}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </>
      )}

      {/* 內容區域 */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center py-16">成功案例</h1>
        <div className="text-center text-white">
          {/* 圖標 */}
          {successCase.icon && (
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <StrapiImage
                  image={successCase.icon}
                  alt={successCase.title}
                  className="w-12 h-12 md:w-16 md:h-16 object-contain"
                />
              </div>
            </div>
          )}

          {/* 標題 */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-shadow-lg">
            {successCase.title}
          </h1>

          {/* 描述 */}
          {successCase.content && (
            <div className="max-w-3xl mx-auto">
              <div 
                className="text-xl md:text-2xl text-gray-100 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: successCase.content }}
              />
            </div>
          )}

          {/* 外部連結按鈕 */}
          {successCase.button && (
            <div className="mt-8">
              <a
                href={successCase.button.URL}
                target={successCase.button.Target || '_blank'}
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {successCase.button.Text || '查看網站'}
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
