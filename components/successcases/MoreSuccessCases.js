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
    <section className="py-16 bg-gray-50">
      <div className="xl:container xl:max-w-[1280px] xl:mx-auto px-5">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            更多成功案例
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            看看其他成功案例是否接近您的企業需要
          </p>
        </div>

        {/* 案例网格 */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {randomCases.map((successCase) => {
            const href = getSuccessCaseLink(successCase, menuData, locale);
            
            return (
              <article key={successCase.id} className="group">
                <Link 
                  href={href}
                  className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                >
                  {/* 图片区域 */}
                  <div className="relative h-48 overflow-hidden">
                    {successCase.background ? (
                      <StrapiImage
                        image={successCase.background}
                        alt={successCase.title || '成功案例'}
                        width={400}
                        height={192}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-3xl mb-2">💼</div>
                          <div className="text-sm font-medium">成功案例</div>
                        </div>
                      </div>
                    )}
                    
                    {/* 浮动图标 */}
                    {successCase.icon && (
                      <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center">
                        <StrapiImage
                          image={successCase.icon}
                          alt="案例图标"
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>

                  {/* 内容区域 */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                      {successCase.title}
                    </h3>
                    
                    {successCase.content && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {cleanAndTruncateText(successCase.content, 120)}
                      </p>
                    )}

                    {/* 查看更多按钮 */}
                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors duration-300">
                      <span className="text-sm">查看詳情</span>
                      <svg 
                        className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
