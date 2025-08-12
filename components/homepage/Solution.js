import StrapiImage from "@/components/StrapiImage";

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
    <section className={styles.solutionSection}>
      <div className={styles.solutionContainer}>
        {/* 標題區域 */}
        {(solutionData.Title || solutionData.introduce) && (
          <div className={styles.solutionHeaderSection}>
            {solutionData.Title && (
              <h2 className={styles.solutionMainTitle}>
                {solutionData.Title}
              </h2>
            )}
            {solutionData.introduce && (
              <p className={styles.solutionSubtitle}>
                {solutionData.introduce}
              </p>
            )}
          </div>
        )}

        {/* 內容卡片 */}
        {solutionData.SolutionSection && solutionData.SolutionSection.length > 0 && (
          <div className={styles.solutionCardGrid}>
            {solutionData.SolutionSection.map((solution, index) => (
              <div key={solution.id || index} className={styles.solutionCardWrapper}>
                <a className={styles.solutionCardLink} href={solution.link || '#'}>
                  {/* 卡片主體 */}
                  <div className={styles.solutionCard}>
                    {/* 圖標 */}
                    {solution.icon && (
                      <div className={styles.solutionIconContainer}>
                        <StrapiImage 
                          image={solution.icon}
                          width={48}
                          height={48}
                          className="w-12 h-12 object-contain"
                          alt={solution.icon.alternativeText || solution.Title || ''}
                        />
                      </div>
                    )}
                    
                    {/* 標題 */}
                    {solution.Title && (
                      <h3 className={styles.solutionCardTitle}>
                        {solution.Title}
                      </h3>
                    )}
                    
                    {/* 分隔線 */}
                    <div className={styles.solutionDivider}></div>
                    
                    {/* 功能列表 */}
                    {solution.CardList && solution.CardList.length > 0 && (
                      <div className={styles.solutionFeatureList}>
                        {solution.CardList.map((feature, featureIndex) => (
                          <div key={featureIndex} className={styles.solutionFeatureItem}>
                            <div className={styles.solutionFeatureDot}></div>
                            <div className={styles.solutionFeatureContent}>
                              {feature.Title && (
                                <span className={styles.solutionFeatureTitle}>
                                  {feature.Title}:
                                </span>
                              )}
                              {feature.Content && (
                                <span className={styles.solutionFeatureDescription}>
                                  {feature.Content}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
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
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
