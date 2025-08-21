import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // 获取URL参数
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  const uid = searchParams.get('uid');
  const status = searchParams.get('status');
  const documentId = searchParams.get('documentId');
  const locale = searchParams.get('locale') || 'en';

  // 验证secret（可选，用于安全）
  const expectedSecret = process.env.PREVIEW_SECRET || 'efee254c6a8b119e65057678ffa7cf8b2e701d83407596eb813d187c2959c087';
  
  if (secret && secret !== expectedSecret) {
    return new NextResponse('Invalid token', { status: 401 });
  }

  // 检查是否是关于我们页面的预览
  if (uid === 'api::about-us.about-us' || slug === 'y529m3uaz2v9rknwy21lg373') {
    // 重定向到关于我们的预览页面
    const previewUrl = `/preview/about-us?status=${status}&documentId=${documentId}&locale=${locale}`;
    
    // 获取正确的基础URL - 强制使用正确的外部URL
    const PUBLIC_BASE_URL = 'http://192.168.15.200:3000';
    const baseUrl = PUBLIC_BASE_URL;
    
    return NextResponse.redirect(new URL(previewUrl, baseUrl));
  }

  // 对于其他内容类型，可以添加更多处理逻辑
  return new NextResponse('Preview not configured for this content type', { status: 400 });
}
