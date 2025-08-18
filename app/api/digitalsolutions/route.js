import { NextResponse } from 'next/server';
import { fetchStrapiData } from '@/data/loaders';

// GET /api/digitalsolutions - 數碼方案數據
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const pLevel = parseInt(searchParams.get('pLevel')) || 4;
    const order = searchParams.get('order'); // 可選：獲取特定順序的方案

    console.log('💻 Digital Solutions API called for locale:', locale, 'pLevel:', pLevel);

    // 建構查詢參數
    const queryParams = {
      pLevel: pLevel,
      locale: locale,
      populate: '*'
    };

    // 如果指定了特定方案順序
    if (order) {
      queryParams.filters = {
        Order: { $eq: parseInt(order) }
      };
    }

    // 🚀 從 Strapi 獲取數碼方案數據
    const digitalSolutionsData = await fetchStrapiData('plans', queryParams);

    // 處理和排序數據
    let processedData = digitalSolutionsData;
    if (digitalSolutionsData?.data) {
      const sortedPlans = digitalSolutionsData.data
        .sort((a, b) => (a.Order || 0) - (b.Order || 0))
        .map(plan => ({
          id: plan.id,
          documentId: plan.documentId,
          title: plan.Title,
          order: plan.Order,
          content: plan.Content,
          description: plan.Description,
          createdAt: plan.createdAt,
          updatedAt: plan.updatedAt,
          publishedAt: plan.publishedAt,
          locale: plan.locale,
          icon: plan.Icon,
          background: plan.Background,
          button: plan.Button,
          card: plan.Card || [],
          features: plan.Features || []
        }));

      processedData = {
        ...digitalSolutionsData,
        data: sortedPlans,
        processedData: {
          plans: sortedPlans
        }
      };
    }

    return NextResponse.json(processedData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600', // 30分鐘快取
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('❌ Error in Digital Solutions API:', error);

    // 後備數據
    const fallbackData = {
      data: [],
      meta: {
        pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 }
      },
      processedData: {
        plans: []
      },
      error: 'Digital solutions data temporarily unavailable',
      fallback: true
    };

    return NextResponse.json(fallbackData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, ', // 5分鐘快取（後備數據）
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
}

// OPTIONS 處理 CORS 預檢請求
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
