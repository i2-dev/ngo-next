import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // 获取URL参数
  const page = searchParams.get('page');
  const locale = searchParams.get('locale') || 'en';
  const status = searchParams.get('status') || 'draft';

  // 页面映射
  const pageMapping = {
    'aboutus': 'about-us',
    'about-us': 'about-us',
    'contact-us': 'contact-us',
    'homepage': 'homepage',
    'news': 'informations',
    'services': 'services-page',
    'digital-solutions': 'plans',
    'successfuls': 'successfuls'
  };

  const contentType = pageMapping[page];
  
  if (!contentType) {
    return new NextResponse('Invalid page type', { status: 400 });
  }

  // 重定向到对应的预览页面
  const previewUrl = `/preview/${contentType}?status=${status}&locale=${locale}`;
  
  // 获取正确的基础URL - 强制使用正确的外部URL
  const PUBLIC_BASE_URL = 'http://192.168.15.200:3000';
  const baseUrl = PUBLIC_BASE_URL;
  
  return NextResponse.redirect(new URL(previewUrl, baseUrl));
}
