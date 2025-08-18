/**
 * 緩存管理 API
 * GET /api/cache - 獲取緩存狀態
 * DELETE /api/cache - 清除所有緩存
 * DELETE /api/cache?type=<type> - 清除特定類型緩存
 */

import { NextResponse } from 'next/server';
import CacheManager from '@/utils/cache-manager.js';

// GET - 獲取緩存狀態
export async function GET(request) {
  try {
    const cacheStatus = CacheManager.getCacheStatus();
    
    return NextResponse.json({
      success: true,
      data: cacheStatus,
      message: 'Cache status retrieved'
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    console.error('Error getting cache status:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// DELETE - 清除緩存
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cacheType = searchParams.get('type');
    
    let result;
    if (cacheType) {
      result = CacheManager.clearSpecificCache(cacheType);
    } else {
      result = CacheManager.clearAllCaches();
    }
    
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// OPTIONS - CORS 支持
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
