import { getStrapiURL } from "@/utils/get-strapi-url";

// 获取页面元数据
export async function getPageMetadata({ params, endpoint }) {
  try {
    // 暂时不连接 Strapi，直接返回默认元数据
    const defaultMetadata = {
      title: 'i2ngo - NGO Digital Services',
      description: 'Professional digital transformation solutions for non-profit organizations',
      keywords: 'NGO, non-profit, digital transformation, website development, data analytics, charity',
      openGraph: {
        title: 'i2ngo - NGO Digital Services',
        description: 'Professional digital transformation solutions for non-profit organizations',
        type: 'website',
      },
    };

    return defaultMetadata;
  } catch (error) {
    console.error('Error fetching page metadata:', error);
    
    // 返回默认元数据，确保应用不会崩溃
    return {
      title: 'i2ngo - NGO Digital Services',
      description: 'Professional digital transformation solutions for non-profit organizations',
      keywords: 'NGO, non-profit, digital transformation, website development, data analytics, charity',
      openGraph: {
        title: 'i2ngo - NGO Digital Services',
        description: 'Professional digital transformation solutions for non-profit organizations',
        type: 'website',
      },
    };
  }
}