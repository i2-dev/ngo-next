import { NextResponse } from 'next/server';
import { fetchStrapiData } from '@/data/loaders';

// GET /api/about-us - 關於我們頁面數據
export async function GET(request) {
  try {
    // 從查詢參數獲取語言設置和populate level
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const pLevel = parseInt(searchParams.get('pLevel') || '4');

    console.log('🏢 About Us API called for locale:', locale, 'pLevel:', pLevel);

    // 🚀 從 Strapi 獲取真實的關於我們頁面數據
    const aboutData = await fetchStrapiData('about-page', {
      pLevel: pLevel,
      locale: locale,
      populate: '*'
    });

    // 如果 Strapi 有數據，直接返回
    if (aboutData?.data) {
      console.log('✅ Returning Strapi data for about-us');
      return NextResponse.json(aboutData, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600', // 30分鐘快取
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'X-Data-Source': 'strapi'
        },
      });
    }

    // 如果 Strapi 沒有數據，提供後備數據
    console.log('⚠️ No data from Strapi, using fallback data');
    const fallbackData = {
      data: {
        id: 1,
        documentId: "about-us-page",
        Title: locale === 'zh' || locale === 'zh-Hant' ? '關於我們' : 'About Us',
        Content: locale === 'zh' || locale === 'zh-Hant' 
          ? '此內容暫時無法加載，請稍後再試。我們致力於為 NGO 組織提供最優質的數碼化解決方案。' 
          : 'Content is temporarily unavailable. We are committed to providing the highest quality digital solutions for NGO organizations.',
        Mission: locale === 'zh' || locale === 'zh-Hant' 
          ? '我們的使命是為NGO組織提供最優質的數碼化解決方案，協助非營利組織更有效地服務社會。'
          : 'Our mission is to provide the highest quality digital solutions for NGO organizations, helping non-profit organizations serve society more effectively.',
        Services: locale === 'zh' || locale === 'zh-Hant' 
          ? '我們提供個案管理系統、工作流程轉型方案、AI客服機械人、網站設計與開發、數據分析與報告等服務。'
          : 'We provide case management systems, workflow transformation solutions, AI chatbots, website design and development, data analysis and reporting services.',
        Vision: locale === 'zh' || locale === 'zh-Hant'
          ? '成為NGO數碼化轉型的領導者'
          : 'To become a leader in NGO digital transformation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        locale: locale
      },
      meta: {
        pagination: {
          page: 1,
          pageSize: 1,
          pageCount: 1,
          total: 1
        }
      }
    };

    return NextResponse.json(fallbackData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, ', // 5分鐘快取（後備數據）
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Data-Source': 'fallback'
      },
    });

  } catch (error) {
    console.error('API Error - About Us:', error);
    
    // 返回錯誤響應，但包含後備數據
    return NextResponse.json(
      { 
        error: 'Failed to fetch about us data',
        message: error.message,
        data: {
          Title: 'About Us',
          Content: 'Content temporarily unavailable',
          Mission: 'Our mission is to help NGO organizations',
          Services: 'We provide digital solutions'
        }
      },
      { status: 500 }
    );
  }
}

// 支持 OPTIONS 方法以處理 CORS
export async function OPTIONS(request) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
