import { NextResponse } from 'next/server';
import { getNewsData } from '@/data/loaders';
import { getCacheHeaders } from '@/utils/cache-manager';

// GET /api/news
export async function GET(request) {
  try {
    // 從查詢參數獲取設置
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = parseInt(searchParams.get('pageSize')) || 25;
    const category = searchParams.get('category') || null;
    const search = searchParams.get('search') || null;
    const sortBy = searchParams.get('sortBy') || 'Publish:desc';

    console.log('📰 News API called with params:', {
      locale,
      page,
      pageSize,
      category,
      search,
      sortBy
    });

    // 🚀 使用優化的新聞數據獲取函數
    const newsData = await getNewsData(locale, {
      page,
      pageSize,
      category,
      search,
      sortBy
    });

    // 返回數據
    return NextResponse.json(newsData, {
      status: 200,
      headers: {
        ...getCacheHeaders(600), // 10分鐘快取 (開發模式會自動禁用)
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('API Error - News:', error);
    
    // 返回錯誤響應
    return NextResponse.json(
      { 
        error: 'Failed to fetch news data',
        message: error.message,
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: 25,
            pageCount: 0,
            total: 0
          }
        }
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












