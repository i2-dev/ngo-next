import { NextResponse } from 'next/server';

// 簡單的電子郵件驗證
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 清理和驗證輸入數據
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, 1000); // 限制長度
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // 驗證必要字段
    const { name, email, organization, services, message } = body;
    
    // 基本驗證
    if (!name || !email || !organization || !message) {
      return NextResponse.json(
        { success: false, error: '請填寫所有必要字段' },
        { status: 400 }
      );
    }
    
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: '請提供有效的電子郵件地址' },
        { status: 400 }
      );
    }
    
    if (!services || services.length === 0) {
      return NextResponse.json(
        { success: false, error: '請選擇至少一項服務' },
        { status: 400 }
      );
    }
    
    // 清理輸入數據
    const cleanData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      organization: sanitizeInput(organization),
      services: Array.isArray(services) ? services.slice(0, 10) : [], // 限制選項數量
      message: sanitizeInput(message),
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    };
    
    // 在這裡你可以:
    // 1. 發送電子郵件
    // 2. 保存到數據庫
    // 3. 發送到第三方服務 (如 Strapi)
    // 4. 記錄日誌
    
    // 示例：記錄到控制台 (開發環境)
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 收到聯絡表單提交:', cleanData);
    }
    
    // 可選：發送到 Strapi 或其他 CMS
    if (process.env.STRAPI_API_URL && process.env.STRAPI_API_TOKEN) {
      try {
        const strapiResponse = await fetch(`${process.env.STRAPI_API_URL}/contact-submissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`
          },
          body: JSON.stringify({
            data: cleanData
          })
        });
        
        if (strapiResponse.ok) {
          console.log('✅ 成功發送到 Strapi');
        } else {
          console.warn('⚠️ Strapi 提交失敗:', await strapiResponse.text());
        }
      } catch (strapiError) {
        console.warn('⚠️ Strapi 連接失敗:', strapiError.message);
        // 不要因為 Strapi 失敗而導致整個請求失敗
      }
    }
    
    // 可選：發送電子郵件通知
    if (process.env.SMTP_HOST && process.env.CONTACT_FORM_EMAIL_TO) {
      try {
        // 這裡可以集成如 nodemailer 等郵件服務
        console.log('📧 應該發送郵件通知到:', process.env.CONTACT_FORM_EMAIL_TO);
      } catch (emailError) {
        console.warn('⚠️ 郵件發送失敗:', emailError.message);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: '訊息發送成功！我們會盡快回覆您。',
      id: Date.now().toString() // 簡單的 ID
    });
    
  } catch (error) {
    console.error('❌ 聯絡表單處理錯誤:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: '系統錯誤，請稍後重試' 
      },
      { status: 500 }
    );
  }
}

// 可選：支持 GET 請求來檢查 API 狀態
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: '聯絡表單 API 正常運行',
    timestamp: new Date().toISOString()
  });
}
