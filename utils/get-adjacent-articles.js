import { getStrapiURL } from '@/utils/get-strapi-url';

export async function getAdjacentArticles(currentDocumentId, locale = 'en') {
  try {
    // 获取所有文章，按发布时间排序
    const response = await fetch(
      `${getStrapiURL()}/api/informations?pLevel=3&pagination[pageSize]=1000&sort=Publish:desc&locale=${locale}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const articles = data.data || [];

    // 找到当前文章的索引
    const currentIndex = articles.findIndex(article => article.documentId === currentDocumentId);

    if (currentIndex === -1) {
      return { previous: null, next: null };
    }

    // 获取上一篇和下一篇文章
    // previous: 更新的文章（時間軸上的上一篇）
    // next: 更舊的文章（時間軸上的下一篇）
    const previous = currentIndex > 0 ? articles[currentIndex - 1] : null;
    const next = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

    return { previous, next };
  } catch (error) {
    console.error('Error fetching adjacent articles:', error);
    return { previous: null, next: null };
  }
}
