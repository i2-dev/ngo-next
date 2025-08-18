import { NextResponse } from 'next/server';
import { fetchStrapiData } from '@/data/loaders';

// GET /api/successcases - 成功案例數據
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const pLevel = parseInt(searchParams.get('pLevel')) || 4;
    const order = searchParams.get('order'); // 可選：獲取特定順序的案例

    console.log('🏆 Success Cases API called for locale:', locale, 'pLevel:', pLevel);

    // 建構查詢參數
    const queryParams = {
      pLevel: pLevel,
      locale: locale,
      populate: '*'
    };

    // 如果指定了特定案例順序
    if (order) {
      queryParams.filters = {
        Order: { $eq: parseInt(order) }
      };
    }

    // 🚀 從 Strapi 獲取成功案例數據
    const successCasesData = await fetchStrapiData('successfuls', queryParams);

    // 處理和排序數據
    let processedData = successCasesData;
    if (successCasesData?.data) {
      const sortedCases = successCasesData.data
        .sort((a, b) => (a.Order || 0) - (b.Order || 0))
        .map(successCase => ({
          id: successCase.id,
          documentId: successCase.documentId,
          title: successCase.Title,
          order: successCase.Order,
          content: successCase.Content,
          createdAt: successCase.createdAt,
          updatedAt: successCase.updatedAt,
          publishedAt: successCase.publishedAt,
          locale: successCase.locale,
          icon: successCase.Icon,
          background: successCase.Background,
          button: successCase.Button,
          card: successCase.Card || [],
          screenshot: successCase.image || []
        }));

      processedData = {
        ...successCasesData,
        data: sortedCases,
        processedData: {
          successCases: sortedCases
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
    console.error('❌ Error in Success Cases API:', error);

    // 後備數據
    const fallbackData = {
      data: [],
      meta: {
        pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 }
      },
      processedData: {
        successCases: []
      },
      error: 'Success cases data temporarily unavailable',
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
