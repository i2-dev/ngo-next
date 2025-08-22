import Link from 'next/link';
import StrapiImage from '@/components/StrapiImage';

// 从菜单数据中获取成功案例的链接
function getSuccessCaseLink(successCase, menuData, locale) {
  if (!menuData?.data) {
    // 如果没有菜单数据，使用默认路由映射
    const CASE_ROUTES = {
      1: 'e123-elderly-portal',
      2: 'brain-training-game', 
      3: 'e72-elderly-recruitment-system',
      4: 'coolthinkjc',
      5: 'i-change-gambling-counseling'
    };
    const route = CASE_ROUTES[successCase.order];
    return locale === 'en' ? `/en/${route}` : `/${route}`;
  }

  // 查找对应的菜单项
  const findMenuItemByTitle = (menuItems, caseTitle) => {
    for (const item of menuItems) {
      // 检查主菜单项
      if (item.title && item.title.includes(caseTitle) && item.URL) {
        return item.URL;
      }
      // 检查子菜单项
      if (item.items && Array.isArray(item.items)) {
        for (const subItem of item.items) {
          if (subItem.title && subItem.title.includes(caseTitle) && subItem.URL) {
            return subItem.URL;
          }
        }
      }
    }
    return null;
  };

  // 尝试匹配菜单项
  const menuUrl = findMenuItemByTitle(menuData.data, successCase.title);
  if (menuUrl) {
    return menuUrl.startsWith('/') ? menuUrl : `/${menuUrl}`;
  }

  // 降级到默认路由
  const CASE_ROUTES = {
    1: 'e123-elderly-portal',
    2: 'brain-training-game', 
    3: 'e72-elderly-recruitment-system',
    4: 'coolthinkjc',
    5: 'i-change-gambling-counseling'
  };
  const route = CASE_ROUTES[successCase.order];
  return locale === 'en' ? `/en/${route}` : `/${route}`;
}

// 随机打乱数组的函数
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 清理HTML标签并截断文本
function cleanAndTruncateText(htmlText, maxLength = 120) {
  if (!htmlText) return '';
  
  // 移除HTML标签
  const cleanText = htmlText.replace(/<[^>]*>/g, '');
  
  // 截断文本
  return cleanText.length > maxLength 
    ? `${cleanText.substring(0, maxLength)}...`
    : cleanText;
}

export default function MoreSuccessCases({ 
  allSuccessCases = [], 
  currentCaseOrder, 
  locale = 'zh',
  menuData = null,
  maxDisplay = 2 
}) {
  // 过滤掉当前案例，获取其他案例
  const otherCases = allSuccessCases.filter(
    successCase => successCase.order !== currentCaseOrder
  );

  // 随机排序并限制显示数量
  const randomCases = shuffleArray(otherCases).slice(0, maxDisplay);

  if (randomCases.length === 0) {
    return null;
  }

  return (    
    <>
      {/* 标题 */}
      <div className="text-center mb-12">
        <h2 className="text-[42px]/[calc(100%+10px)] font-medium mb-5 max-lg:text-4xl max-md:text-3xl">
          更多成功案例
        </h2>
        <p>看看其他成功案例是否接近您的企劃需要</p>
      </div>

      {/* 案例网格 */}
      <div className="grid grid-cols-2 gap-y-12 gap-x-5 max-lg:grid-cols-1">
        {randomCases.map((successCase) => {
          const href = getSuccessCaseLink(successCase, menuData, locale);
          
          return (
            <article key={successCase.id} className="relative [&:first-child>h3]:bg-[#d0f3db] [&:first-child>h3]:text-[#083f19] [&:last-child>h3]:bg-[#c7efef] [&:last-child>h3]:text-[#094b4b]">              
              {/* 图片区域 */}                
              {successCase.background ? (
                <StrapiImage
                  image={successCase.background}
                  alt={successCase.title || '成功案例'}
                  width={successCase.background.width}
                  height={successCase.background.height}
                  className="w-[90%] ml-[6%] mr-[4%]"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-3xl mb-2">💼</div>
                    <div className="text-sm font-medium">成功案例</div>
                  </div>
                </div>
              )}                

              {/* 内容区域 */}                
              <h3 className="text-xl bg-[#d0f3db] text-[#083f19] font-normal inline-block mb-0 py-1.5 px-2.5 -mt-5 max-w-[90%] flex-1">
                <Link className="before:content-[''] before:inset-0 before:absolute" href={href}>
                  {successCase.title}
                </Link>
              </h3>              
            </article>
          );
        })}
      </div>
    </>    
  );
}
