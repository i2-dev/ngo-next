import StrapiImage from "@/components/StrapiImage";
import { getNewsData } from "@/data/loaders";

export default async function InformationSection({ locale = 'en', styles, informationData }) {
  // 🆕 同時獲取新聞數據
  let newsData = null;
  try {
    newsData = await getNewsData(locale, {
      page: 1,
      pageSize: 3, // 獲取最新3條新聞
      sortBy: 'Publish:desc'
    });
  } catch (error) {
    console.error('Failed to fetch news data:', error);
  }
  // 如果沒有傳入 informationData，顯示無數據狀態
  if (!informationData) {
    return (
      <section className={styles.informationSection}>
        <div className="w-full max-w-[1240px] my-0 mx-auto relative">
          <div className="text-center">No information data available</div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.informationSection}>
      <div className={styles.informationContainer}>
        {/* 標題區域 */}
        {(informationData.Title || informationData.introduction) && (
          <div className={styles.informationHeaderSection}>
            {informationData.Title && (
              <h2 className={styles.informationMainTitle}>
                {informationData.Title}
              </h2>
            )}
            {informationData.introduction && (
              <p className={styles.informationSubtitle}>
                {informationData.introduction}
              </p>
            )}
          </div>
        )}
        {/* 最新新聞區域 */}
        {newsData && newsData.data && newsData.data.length > 0 && (
          <div className={styles.informationNewsGrid}>
            {newsData.data.map((news, index) => (
              <div key={news.id || index} className={styles.informationNewsWrapper}>
                <div className={styles.informationNewsCard}>
                  {/* 新聞圖片 */}
                  {news.image && (
                    <div className={styles.informationNewsImageContainer}>
                      <StrapiImage 
                        image={news.image}
                        width={300}
                        height={200}
                        className="w-full h-40 object-cover rounded-lg"
                        alt={news.image.alternativeText || news.title || ''}
                      />
                    </div>
                  )}
                  
                  {/* 新聞分類標籤 */}
                  {news.category && (
                    <div className={styles.informationNewsCategoryTag}>
                      {news.category}
                    </div>
                  )}
                  
                  {/* 新聞標題 */}
                  <h4 className={styles.informationNewsTitle}>
                    {news.title}
                  </h4>
                  
                  {/* 作者和發布日期 */}
                  <div className={styles.informationNewsMetaInfo}>
                    {news.author && (
                      <span className={styles.informationNewsAuthor}>
                        {news.author}
                      </span>
                    )}
                    {news.publishDate && (
                      <span className={styles.informationNewsDate}>
                        {new Date(news.publishDate).toLocaleDateString(locale === 'zh' ? 'zh-TW' : 'en-US')}
                      </span>
                    )}
                  </div>
                  
                  {/* 新聞內容預覽 */}
                  {news.content && (
                    <div className={styles.informationNewsDescription}>
                      <p>
                        {news.content.length > 80 
                          ? news.content.substring(0, 80) + '...'
                          : news.content
                        }
                      </p>
                    </div>
                  )}
                  
                  {/* 閱讀更多按鈕 */}
                  <div className={styles.informationNewsButtonContainer}>
                    <button className={styles.informationNewsButton}>
                      閱讀更多
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}