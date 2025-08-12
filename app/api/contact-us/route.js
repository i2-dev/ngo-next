import { NextResponse } from 'next/server';
import { fetchStrapiData } from '@/data/loaders';

// GET /api/contact-us - 聯絡我們頁面數據
export async function GET(request) {
  try {
    // 從查詢參數獲取語言設置和populate level
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    const pLevel = parseInt(searchParams.get('pLevel') || '3');

    console.log('📞 Contact Us API called for locale:', locale, 'pLevel:', pLevel);

    // 🚀 從 Strapi 獲取真實的聯絡我們頁面數據
    const contactData = await fetchStrapiData('contact-us', {
      pLevel: pLevel,
      locale: locale,
      populate: '*'
    });

    // 如果 Strapi 沒有數據，提供後備數據
    if (!contactData?.data) {
      console.log('⚠️ No data from Strapi, using fallback data');
      const fallbackData = {
      data: {
        id: 1,
        documentId: "contact-us-page",
        Title: locale === 'zh' || locale === 'zh-Hant' ? '聯絡我們' : 'Contact Us',
        Description: locale === 'zh' || locale === 'zh-Hant' 
          ? '我們很樂意聽到您的聲音！無論您有任何問題、建議或需要我們的服務，請隨時與我們聯絡。' 
          : 'We would love to hear from you! Whether you have questions, suggestions, or need our services, feel free to contact us.',
        Email: 'info@ngo.i2hk.com',
        Phone: '+852 3426 2604',
        Address: locale === 'zh' || locale === 'zh-Hant' 
          ? '香港九龍觀塘觀塘道334-336號KT 336 3樓303室'
          : 'Room 303, 3/F, KT 336, 334-336 Kwun Tong Road, Kwun Tong, Kowloon, Hong Kong',
        OfficeHours: locale === 'zh' || locale === 'zh-Hant' 
          ? '星期一至五 9:00 AM - 6:00 PM'
          : 'Monday to Friday 9:00 AM - 6:00 PM',
        MapEmbedCode: '', // 可以添加 Google Maps 嵌入代碼
        ContactForm: {
          enabled: true,
          fields: [
            { name: 'name', required: true, type: 'text' },
            { name: 'email', required: true, type: 'email' },
            { name: 'organization', required: false, type: 'text' },
            { name: 'service', required: true, type: 'checkbox' },
            { name: 'message', required: true, type: 'textarea' }
          ]
        },
        Services: [
          {
            id: 1,
            name: locale === 'zh' || locale === 'zh-Hant' ? '個案管理平台' : 'Case Management Platform'
          },
          {
            id: 2,
            name: locale === 'zh' || locale === 'zh-Hant' ? 'AI 工作流程轉型方案' : 'AI Workflow Transformation'
          },
          {
            id: 3,
            name: locale === 'zh' || locale === 'zh-Hant' ? 'AI 幫線系統' : 'AI Help Desk System'
          },
          {
            id: 4,
            name: locale === 'zh' || locale === 'zh-Hant' ? '機構網上學習(學院)系統' : 'Online Learning Management System'
          },
          {
            id: 5,
            name: locale === 'zh' || locale === 'zh-Hant' ? 'NGO 線上服務方案' : 'NGO Online Service Solutions'
          },
          {
            id: 6,
            name: locale === 'zh' || locale === 'zh-Hant' ? '其他' : 'Others'
          }
        ],
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

      // 後備數據結構
      return NextResponse.json(fallbackData, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5分鐘快取（後備數據）
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'X-Data-Source': 'fallback'
        },
      });
    }

    // 返回 Strapi 的真實數據
    console.log('✅ Returning Strapi data for contact-us');
    return NextResponse.json(contactData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600', // 30分鐘快取
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Data-Source': 'strapi'
      },
    });
  } catch (error) {
    console.error('API Error - Contact Us:', error);
    
    // 如果是 404 錯誤，返回後備數據而不是錯誤
    if (error.message.includes('404')) {
      console.log('📞 Strapi endpoint not found, using fallback data');
      
      const fallbackData = {
        data: {
          id: 1,
          documentId: "contact-us-page",
          Title: locale === 'zh' || locale === 'zh-Hant' ? '聯絡我們' : 'Contact Us',
          Description: locale === 'zh' || locale === 'zh-Hant' 
            ? '我們很樂意聽到您的聲音！無論您有任何問題、建議或需要我們的服務，請隨時與我們聯絡。' 
            : 'We would love to hear from you! Whether you have questions, suggestions, or need our services, feel free to contact us.',
          Email: 'info@ngo.i2hk.com',
          Phone: '+852 3426 2604',
          Address: locale === 'zh' || locale === 'zh-Hant' 
            ? '香港九龍觀塘觀塘道334-336號KT 336 3樓303室'
            : 'Room 303, 3/F, KT 336, 334-336 Kwun Tong Road, Kwun Tong, Kowloon, Hong Kong',
          Services: [
            { id: 1, name: locale === 'zh' || locale === 'zh-Hant' ? '個案管理平台' : 'Case Management Platform' },
            { id: 2, name: locale === 'zh' || locale === 'zh-Hant' ? 'AI 工作流程轉型方案' : 'AI Workflow Transformation' },
            { id: 3, name: locale === 'zh' || locale === 'zh-Hant' ? 'AI 幫線系統' : 'AI Help Desk System' },
            { id: 4, name: locale === 'zh' || locale === 'zh-Hant' ? '機構網上學習(學院)系統' : 'Online Learning Management System' },
            { id: 5, name: locale === 'zh' || locale === 'zh-Hant' ? 'NGO 線上服務方案' : 'NGO Online Service Solutions' },
            { id: 6, name: locale === 'zh' || locale === 'zh-Hant' ? '其他' : 'Others' }
          ],
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
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'X-Data-Source': 'fallback-404'
        },
      });
    }
    
    // 其他錯誤才返回錯誤響應
    return NextResponse.json(
      { 
        error: 'Failed to fetch contact us data',
        message: error.message,
        data: null
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
