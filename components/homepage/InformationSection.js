import StrapiImage from "@/components/StrapiImage";
import { getNewsData } from "@/data/loaders";
import Link from 'next/link'

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
      {newsData && newsData.data && newsData.data.length > 0 && (
        <div className="grid grid-cols-4 gap-y-6 gap-x-5 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {newsData.data.map((news, index) => (
            <div key={news.id || index} className='group bg-black h-[50vh] rounded-sm overflow-hidden relative first:col-span-2 max-sm:first:col-span-1'>
              <Link className="overflow-hidden -indent-9999 absolute inset-0 z-3" target="_self" href={`/${locale}/ngo-latest-news/${news.documentId}`} role="link">{news.title}</Link>                
              {/* 新聞圖片 */}
              {news.image && (                    
                <StrapiImage 
                  image={news.image}
                  width={news.image.width}
                  height={news.image.height}
                  className="w-full h-full object-cover transition-[all_.3s_cubic-bezier(.2,1,.2,1)] group-hover:transform-[scale(1.07)]"
                  alt={news.image.alternativeText || news.title || ''}
                />                    
              )}
              <div className='bg-linear-[to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,.7)_70%] absolute inset-[50%_0_0_0] z-1'></div>
              <div className='text-white p-[30px] group-first:w-[55%] absolute bottom-0 left-0 z-2 max-sm:w-full'>                  
                {news.category && (                    
                  <p className='text-[14px] mb-2.5'><strong>{news.category}</strong></p>
                )}
                <p className='text-[22px]/[32px] font-medium'>{news.title}</p>
              </div>                
            </div>
          ))}
        </div>
      )}      
    </>
  );
}