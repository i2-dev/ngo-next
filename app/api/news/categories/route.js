import { NextResponse } from 'next/server';
import { getNewsCategoriesData } from '@/data/loaders';

// GET /api/news/categories
export async function GET(request) {
  try {
    // 從查詢參數獲取語言設置，默認為 'en'
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    console.log('📂 News Categories API called for locale:', locale);

    // 🚀 使用優化的新聞分類數據獲取函數
    const categoriesData = await getNewsCategoriesData(locale);

    // 返回數據
    return NextResponse.json(categoriesData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600', // 30分鐘快取
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('API Error - News Categories:', error);
    
    // 返回錯誤響應
    return NextResponse.json(
      { 
        error: 'Failed to fetch news categories',
        message: error.message,
        data: []
      },
      { status: 500 }
    );
  }
}

// 支持 OPTIONS 方法以處理 CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}



