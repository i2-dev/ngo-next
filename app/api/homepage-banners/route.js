import { NextResponse } from 'next/server';
import { getOptimizedPageData } from '@/data/loaders';

// GET /api/homepage-banners
export async function GET(request) {
  try {
    // 从查询参数获取语言设置，默认为 'en'
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';

    // 🎯 使用優化的數據獲取函數，共享同一份快取數據
    const { blocks } = await getOptimizedPageData(locale);
    const bannerSlides = blocks.banner;

    // 返回数据
    return NextResponse.json(bannerSlides, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, ', // 5分钟缓存
      },
    });
  } catch (error) {
    console.error('API Error - Homepage Banners:', error);
    
    // 返回错误响应
    return NextResponse.json(
      { 
        error: 'Failed to fetch homepage banners',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// 如果需要支持其他 HTTP 方法，可以添加
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