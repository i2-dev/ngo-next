import SimpleImage from "@/components/SimpleImage";
import { getHomepageNewsData } from "@/data/unified-loader";
import Link from 'next/link'

export default async function InformationSection({ locale = 'en', styles, informationData }) {
  // 🚀 使用專門的首頁新聞數據獲取函數 - 更輕量化
  let newsData = null;
  try {
    newsData = await getHomepageNewsData(locale);
  } catch (error) {
    console.error('Failed to fetch homepage news data:', error);
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

  // 處理新聞數據邏輯
  let finalNewsData = [];
  
  if (newsData && newsData.data && newsData.data.length > 0) {
    // 檢查 informationData.news 是否有數據
    const hasInformationNews = informationData.news && 
                              Array.isArray(informationData.news) && 
                              informationData.news.length > 0 &&
                              informationData.news.some(item => item && item.documentId);

    if (hasInformationNews) {
      // 如果有 informationData.news 數據，先使用這些數據
      const informationNews = informationData.news.filter(item => item && item.documentId);
      finalNewsData = [...informationNews];
      
      // 如果不夠3個，從 newsData.data 中補充
      if (finalNewsData.length < 3) {
        const usedDocumentIds = new Set(informationNews.map(item => item.documentId));
        const additionalNews = newsData.data
          .filter(item => item && item.documentId && !usedDocumentIds.has(item.documentId))
          .slice(0, 3 - finalNewsData.length);
        
        finalNewsData = [...finalNewsData, ...additionalNews];
      }
    } else {
      // 如果沒有 informationData.news 數據，直接使用 newsData.data 的前三個
      finalNewsData = newsData.data.slice(0, 3);
    }
  }

  // 輔助函數：獲取新聞標題
  const getNewsTitle = (news) => {
    return news.Title || news.title || '無標題';
  };

  // 輔助函數：獲取新聞圖片
  const getNewsImage = (news) => {
    return news.image && news.image.length > 0 ? news.image[0] : null;
  };

  // 輔助函數：獲取新聞分類
  const getNewsCategory = (news) => {
    return news.category || news.Category || null;
  };

  return (
    <>      
      {/* 標題區域 */}
      {(informationData.Title || informationData.introduction) && (
        <div className="text-center mb-12">
          {informationData.Title && (
            <h2 className="text-[42px]/[calc(100%+10px)] font-medium mb-5 max-lg:text-4xl max-md:text-3xl">
              {informationData.Title}
            </h2>
          )}
          {informationData.introduction}
        </div>
      )}
      {/* 最新新聞區域 */}
      {finalNewsData.length > 0 && (
        <div className="grid grid-cols-4 gap-y-6 gap-x-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {finalNewsData.map((news, index) => {
            const newsTitle = getNewsTitle(news);
            const newsImage = getNewsImage(news);
            const newsCategory = getNewsCategory(news);
            
            return (
              <div key={news.id || index} className='group bg-black h-[50vh] rounded-sm overflow-hidden relative first:col-span-2 max-sm:first:col-span-1'>
                <Link 
                  className="overflow-hidden -indent-9999 absolute inset-0 z-3" 
                  target="_self" 
                  href={`/${locale}/ngo-latest-news/${news.documentId}`} 
                  role="link"
                >
                  {newsTitle}
                </Link>                
                {/* 新聞圖片 */}
                {newsImage && (                    
                  <SimpleImage 
                    image={newsImage}
                    width={newsImage.width}
                    height={newsImage.height}
                    className="w-full h-full object-cover transition-[all_.3s_cubic-bezier(.2,1,.2,1)] group-hover:transform-[scale(1.07)]"
                    alt={newsImage.alternativeText || newsTitle || ''}
                  />                    
                )}
                <div className='bg-linear-[to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,.7)_70%] absolute inset-[50%_0_0_0] z-1'></div>
                <div className='text-white p-[30px] group-first:w-[55%] absolute bottom-0 left-0 z-2 max-sm:w-full'>                  
                  {newsCategory && (                    
                    <p className='text-[14px] mb-2.5'><strong>{newsCategory}</strong></p>
                  )}
                  <p className='text-[22px]/[32px] font-medium'>{newsTitle}</p>
                </div>                
              </div>
            );
          })}
        </div>
      )}      
    </>
  );
}