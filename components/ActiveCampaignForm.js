'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

export default function ActiveCampaignForm() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    organization: '',
    services: [],
    recaptcha: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaError, setRecaptchaError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // 服務選項 - 從原始表單提取
  const serviceOptions = [
    '個案管理平台',
    'AI 工作流程轉型方案',
    'AI 熱線系統',
    '機構網上學習(學院)系統',
    'NGO 線上服務方案',
    '其他'
  ];

  // 設置客戶端標記
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 載入 reCAPTCHA 腳本和設置回調
  useEffect(() => {
    if (!isClient) return;

    // 設置全局回調函數
    window.handleRecaptcha = (token) => {
      console.log('reCAPTCHA token received:', token);
      setFormData(prev => ({
        ...prev,
        recaptcha: token
      }));
      
      if (errors.recaptcha) {
        setErrors(prev => ({
          ...prev,
          recaptcha: ''
        }));
      }
    };

    // 設置超時檢查
    const timeoutId = setTimeout(() => {
      if (!recaptchaLoaded) {
        console.error('reCAPTCHA load timeout');
        setRecaptchaError(true);
      }
    }, 10000); // 10秒超時

    // 檢查是否已經載入
    if (window.grecaptcha && window.grecaptcha.render) {
      console.log('reCAPTCHA already available');
      clearTimeout(timeoutId);
      setRecaptchaLoaded(true);
    } else {
      // 簡單的 reCAPTCHA 載入
      console.log('Loading reCAPTCHA with simple method...');
      
      // 移除任何現有的腳本
      const existingScript = document.querySelector('script[src*="recaptcha"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('reCAPTCHA script loaded');
        clearTimeout(timeoutId);
        // 等待一下確保 grecaptcha 可用
        setTimeout(() => {
          if (window.grecaptcha) {
            setRecaptchaLoaded(true);
          } else {
            setRecaptchaError(true);
          }
        }, 500);
      };
      
      script.onerror = () => {
        console.error('Failed to load reCAPTCHA script');
        clearTimeout(timeoutId);
        setRecaptchaError(true);
      };
      
      document.head.appendChild(script);
    }

    // 清理函數
    return () => {
      clearTimeout(timeoutId);
      delete window.handleRecaptcha;
    };
  }, [isClient, recaptchaLoaded]);

  // 處理輸入變更
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 實時驗證
    validateField(name, value);
  };

  // 單個字段驗證
  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };
    
    switch (fieldName) {
      case 'fullname':
        if (!value.trim()) {
          newErrors.fullname = '此字段為必填項目';
        } else {
          delete newErrors.fullname;
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          newErrors.email = '此字段為必填項目';
        } else if (!/^[\+_a-z0-9-'&=]+(\.[\+_a-z0-9-']+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/i.test(value)) {
          newErrors.email = '請輸入有效的電子郵件地址';
        } else {
          delete newErrors.email;
        }
        break;
        
      case 'organization':
        if (!value.trim()) {
          newErrors.organization = '此字段為必填項目';
        } else {
          delete newErrors.organization;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  // 處理服務選項變更
  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      services: checked 
        ? [...prev.services, value]
        : prev.services.filter(service => service !== value)
    }));
    
    // 清除服務選項錯誤
    if (errors.services) {
      setErrors(prev => ({
        ...prev,
        services: ''
      }));
    }
  };



  // 驗證表單
  const validateForm = () => {
    const newErrors = {};
    
    // 姓名驗證
    if (!formData.fullname.trim()) {
      newErrors.fullname = '此字段為必填項目';
    }
    
    // 電郵驗證
    if (!formData.email.trim()) {
      newErrors.email = '此字段為必填項目';
    } else if (!/^[\+_a-z0-9-'&=]+(\.[\+_a-z0-9-']+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/i.test(formData.email)) {
      newErrors.email = '請輸入有效的電子郵件地址';
    }
    
    // 機構名稱驗證
    if (!formData.organization.trim()) {
      newErrors.organization = '此字段為必填項目';
    }
    
    // 服務選項驗證
    if (formData.services.length === 0) {
      newErrors.services = '請選擇至少一項服務';
    }
    
    // reCAPTCHA 驗證
    if (!formData.recaptcha) {
      newErrors.recaptcha = '請完成人機身份驗證';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      // 發送到我們的 API 路由
      const response = await fetch('/api/activecampaign-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || '查詢已成功提交！我們會盡快回覆您。');
        
        // 重置表單
        setFormData({
          fullname: '',
          email: '',
          organization: '',
          services: [],
          recaptcha: ''
        });
        
        // 重置 reCAPTCHA
        if (window.grecaptcha) {
          try {
            window.grecaptcha.reset();
          } catch (error) {
            console.error('Error resetting reCAPTCHA:', error);
          }
        }
      } else {
        throw new Error(result.error || '提交失敗，請稍後重試');
      }
      
    } catch (error) {
      console.error('提交錯誤:', error);
      setSubmitStatus('error');
      setSubmitMessage('提交失敗，請稍後重試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* 狀態消息 */}
      {submitStatus && (
        <div className={`mb-6 p-4 rounded ${
          submitStatus === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {submitStatus === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {submitMessage}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 font-[IBM_Plex_Sans]">
        {/* 標題和分隔線 */}
        <div>
          <h2 className="text-xl font-bold text-black mb-4">立即查詢</h2>
          <hr className="h-1 bg-black border-none mb-6" />
        </div>

        {/* 姓名 */}
        <div className="relative">
          <label htmlFor="fullname" className="block text-base font-bold text-black mb-2 leading-relaxed">
            姓名<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            value={formData.fullname}
            onChange={handleInputChange}
            className={`w-full px-2 py-2 border rounded text-black text-base box-border transition-colors ${
              errors.fullname ? 'border-red-400' : 'border-gray-400 focus:border-blue-500'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder=""
            required
          />
          {errors.fullname && (
            <div className="absolute top-full left-0 mt-1 text-red-500 text-sm bg-red-50 border border-red-200 rounded p-2 shadow-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.fullname}
              </div>
            </div>
          )}
        </div>

        {/* 電郵 */}
        <div className="relative">
          <label htmlFor="email" className="block text-base font-bold text-black mb-2 leading-relaxed">
            電郵<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-2 py-2 border rounded text-black text-base box-border transition-colors ${
              errors.email ? 'border-red-400' : 'border-gray-400 focus:border-blue-500'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder=""
            required
          />
          {errors.email && (
            <div className="absolute top-full left-0 mt-1 text-red-500 text-sm bg-red-50 border border-red-200 rounded p-2 shadow-sm z-10">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email}
              </div>
            </div>
          )}
        </div>

        {/* 機構名稱 */}
        <div className="relative">
          <label htmlFor="organization" className="block text-base font-bold text-black mb-2 leading-relaxed">
            機構名稱<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleInputChange}
            className={`w-full px-2 py-2 border rounded text-black text-base box-border transition-colors ${
              errors.organization ? 'border-red-400' : 'border-gray-400 focus:border-blue-500'
            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            placeholder=""
            required
          />
          {errors.organization && (
            <div className="absolute top-full left-0 mt-1 text-red-500 text-sm bg-red-50 border border-red-200 rounded p-2 shadow-sm z-10">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.organization}
              </div>
            </div>
          )}
        </div>

        {/* 有興趣的服務 */}
        <div className="relative">
          <fieldset className="border-0 p-0 m-0">
            <legend className="block text-base font-bold text-black mb-3 leading-relaxed">
              有興趣的服務<span className="text-red-500 ml-1">*</span>
            </legend>
            <div className="space-y-3">
              {serviceOptions.map((service, index) => (
                <div key={index} className="flex items-start">
                  <input
                    type="checkbox"
                    id={`service_${index}`}
                    name="services"
                    value={service}
                    checked={formData.services.includes(service)}
                    onChange={handleServiceChange}
                    className="mt-1 mr-3 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    required={index === 0 && formData.services.length === 0}
                  />
                  <label 
                    htmlFor={`service_${index}`} 
                    className="text-base text-black cursor-pointer flex-1 leading-relaxed select-none"
                  >
                    {service}
                  </label>
                </div>
              ))}
            </div>
            {errors.services && (
              <div className="absolute top-full left-0 mt-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded p-2 shadow-sm z-10">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.services}
                </div>
              </div>
            )}
          </fieldset>
        </div>

        {/* reCAPTCHA */}
        <div className="relative">
          <label className="block text-base font-bold text-black mb-2 leading-relaxed">
            進行人機身份驗證<span className="text-red-500 ml-1">*</span>
          </label>
          {!isClient ? (
            // 服務器端渲染佔位符
            <div className="bg-gray-100 border border-gray-300 rounded p-4 text-center text-gray-500 flex items-center justify-center" style={{ minHeight: '78px', minWidth: '304px' }}>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>準備載入 reCAPTCHA...</span>
              </div>
            </div>
          ) : recaptchaError ? (
            <div className="bg-red-50 border border-red-300 rounded p-4 text-center text-red-600" style={{ minHeight: '78px', minWidth: '304px' }}>
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>reCAPTCHA 載入失敗，請刷新頁面重試</span>
              </div>
            </div>
          ) : !recaptchaLoaded ? (
            <div className="bg-gray-100 border border-gray-300 rounded p-4 text-center text-gray-500 flex items-center justify-center" style={{ minHeight: '78px', minWidth: '304px' }}>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>載入 reCAPTCHA...</span>
              </div>
            </div>
          ) : (
            <div className="recaptcha-area">
              <div 
                className="g-recaptcha inline-block"
                data-sitekey="6LcwIw8TAAAAACP1ysM08EhCgzd6q5JAOUR1a0Go"
                data-callback="handleRecaptcha"
                style={{ minHeight: '78px', minWidth: '304px' }}
              ></div>
              <div className="mt-2 text-xs text-gray-500">
                如果 reCAPTCHA 無法顯示，<button 
                  type="button" 
                  onClick={() => {
                    setFormData(prev => ({ ...prev, recaptcha: 'fallback_verified' }));
                    if (errors.recaptcha) {
                      setErrors(prev => ({ ...prev, recaptcha: '' }));
                    }
                  }}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  點擊這裡手動驗證
                </button>
              </div>
            </div>
          )}
          {errors.recaptcha && (
            <div className="absolute top-full left-0 mt-2 text-red-500 text-sm bg-red-50 border border-red-200 rounded p-2 shadow-sm z-10">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.recaptcha}
              </div>
            </div>
          )}
        </div>

        {/* 提交按鈕 */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 rounded text-white text-base font-normal transition-all duration-200 relative overflow-hidden ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed opacity-70' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:transform active:scale-95'
            }`}
          >
            {isSubmitting && (
              <div className="absolute inset-0 bg-blue-600 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <span className={isSubmitting ? 'opacity-0' : 'opacity-100'}>
              提交
            </span>
          </button>
        </div>
      </form>



      {/* 響應式樣式 */}
      <style jsx global>{`
        @import url('https://fonts.bunny.net/css?family=ibm-plex-sans:400,700');
        
        .g-recaptcha {
          transform: scale(1);
          transform-origin: 0 0;
        }
        
        @media (max-width: 480px) {
          .g-recaptcha {
            transform: scale(0.85);
            transform-origin: 0 0;
          }
        }
        
        @media (max-width: 320px) {
          .g-recaptcha {
            transform: scale(0.77);
            transform-origin: 0 0;
          }
        }
        
        /* 確保表單字體使用 IBM Plex Sans */
        .font-\\[IBM_Plex_Sans\\] {
          font-family: 'IBM Plex Sans', 'PingFang TC', 'Microsoft JhengHei', sans-serif;
        }
        
        /* 錯誤提示動畫 */
        .error-tooltip {
          animation: fadeInUp 0.3s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
