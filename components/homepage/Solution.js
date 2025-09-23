import SimpleImage from "@/components/SimpleImage";
import Image from "next/image";

export default function Solution({ locale = 'en', styles, solutionData }) {
  // 如果沒有傳入 solutionData，顯示無數據狀態
  if (!solutionData) {
    return (
      <section className={styles.solutionSection}>
        <div className="w-full max-w-[1240px] my-0 mx-auto relative">
          <div className="text-center">No solution data available</div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* 標題區域 */}
      {(solutionData.Title || solutionData.introduce) && (
        <div className="text-center mb-12">
          {solutionData.Title && (
            <h1 className="text-[42px]/[calc(100%+10px)] font-medium mb-5 max-lg:text-4xl max-md:text-3xl">
              {solutionData.Title}
            </h1>
          )}
          {solutionData.introduce && (
            <p>
              {solutionData.introduce}
            </p>
          )}
        </div>
      )}

      {/* 內容卡片 */}
      {solutionData.SolutionSection && solutionData.SolutionSection.length > 0 && (
        <div className="grid grid-cols-5 gap-y-6 gap-x-5 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {solutionData.SolutionSection.map((solution, index) => (
            <div key={solution.id || index} className="group bg-white rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.08)] relative pt-3 px-3 pb-[80px] transition-[all_.3s_cubic-bezier(.2,1,.2,1)] hover:transform-[scale(1.03)]">
              <a className="overflow-hidden -indent-9999 absolute inset-0 z-10" target="_self" href={solution.link || '#'} role="link">全面ngo數碼方案</a>
              {/* 圖標 */}
              {solution.icon && (
                <SimpleImage
                  image={solution.icon}
                  width={74}
                  height={74}
                  className="mx-auto mb-2"
                  alt={solution.icon.alternativeText || solution.Title || ''}
                />
              )}
              {/* 標題 */}
              {solution.Title && (
                <h2 className="group-[&:nth-child(1)]:text-[#54acaa] group-[&:nth-child(2)]:text-[#71c189] group-[&:nth-child(3)]:text-[#e6ca4d] group-[&:nth-child(4)]:text-[#e9a06c] group-[&:nth-child(5)]:text-[#4d52b2] text-[20px]/[30px] font-medium text-center">{solution.Title}</h2>
              )}
              {/* 分隔線 */}
              <hr className='w-5 h-0.5 border-t-[#286e11] my-3 mx-auto' />
              {/* 功能列表 */}
              {solution.CardList && solution.CardList.length > 0 && (
                <ul className='ml-5'>
                  {solution.CardList.map((feature, featureIndex) => (
                    <li key={featureIndex} className='list-disc mb-3.5'>
                      {feature.Title && (
                        <strong>{feature.Title.endsWith('：') ? feature.Title : feature.Title + '：'}</strong>
                      )}
                      {feature.Content}
                    </li>
                  ))}
                </ul>
              )}
              {/* 按鈕 */}
              {solution.ButtonText && (
                <div className={styles.solutionButtonContainer}>
                  <div className={styles.solutionButton}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )}
              <Image
                src="/images/homepage/green_arrow.svg"
                width={30}
                height={30}
                className="absolute left-3 bottom-3"
                alt="Picture of the author"
                loading="lazy"
              />
              <div className="w-[70] h-[120] group-[&:nth-child(1)]:bg-[url(/images/homepage/number_01.svg)] group-[&:nth-child(2)]:bg-[url(/images/homepage/number_02.svg)] group-[&:nth-child(3)]:bg-[url(/images/homepage/number_03.svg)] group-[&:nth-child(4)]:bg-[url(/images/homepage/number_04.svg)] group-[&:nth-child(5)]:bg-[url(/images/homepage/number_05.svg)] absolute right-3 -bottom-[40px]"></div>
            </div>
          ))}
        </div>
      )}

    </>
  );
}
