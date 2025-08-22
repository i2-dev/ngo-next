import { NextResponse } from 'next/server';
import { handlePreviewRequest } from '@/utils/preview-data-fetcher';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 獲取所有查詢參數
    const params = Object.fromEntries(searchParams.entries());
    
    // 使用 preview-data-fetcher 中的邏輯處理預覽請求
    const result = handlePreviewRequest(params);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    
    // 重定向到預覽頁面
    return NextResponse.redirect(result.redirectUrl);
    
  } catch (error) {
    console.error('Error in preview API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
