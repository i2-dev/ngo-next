'use client';

import { useState } from 'react';

export default function ContactForm({ services = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    services: [],
    customService: '',
    message: '',
    isNotRobot: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      services: checked 
        ? [...prev.services, value]
        : prev.services.filter(service => service !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      // 基本客戶端驗證
      if (!formData.name.trim() || !formData.email.trim() || 
          !formData.organization.trim()) {
        throw new Error('請填寫所有必要字段');
      }

      if (!formData.isNotRobot) {
        throw new Error('請完成人機身份驗證');
      }

      // 如果有預設服務列表，必須選擇；如果沒有，可以用自定義輸入
      if (services && services.length > 0) {
        if (formData.services.length === 0) {
          throw new Error('請選擇至少一項有興趣的服務');
        }
      } else {
        if (!formData.customService?.trim()) {
          throw new Error('請輸入您有興趣的服務');
        }
      }

      // 準備提交數據
      const submitData = {
        ...formData,
        services: services && services.length > 0 
          ? formData.services 
          : [formData.customService]
      };

      // 發送到 API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || '訊息發送成功！我們會盡快回覆您。');
        
        // 重置表單
        setFormData({
          name: '',
          email: '',
          organization: '',
          services: [],
          customService: '',
          message: '',
          isNotRobot: false
        });
      } else {
        throw new Error(result.error || '發送失敗，請稍後重試');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* 提交狀態消息 */}
      {submitStatus && (
        <div className={`p-4 rounded-lg mb-6 ${
          submitStatus === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <p className="text-sm">
            {submitStatus === 'success' ? '✅' : '❌'} {submitMessage}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            姓名 <span className="text-red-500">*</span>
          </label>
          <input 
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="請輸入您的姓名"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            電郵 <span className="text-red-500">*</span>
          </label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder=""
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            機構名稱 <span className="text-red-500">*</span>
          </label>
          <input 
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="請輸入您的機構名稱"
          />
        </div>
        
        {services && services.length > 0 ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              有興趣的服務 <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {services.map((service) => (
                <label key={service.id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={service.name}
                    checked={formData.services.includes(service.name)}
                    onChange={handleServiceChange}
                    disabled={isSubmitting}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
                  />
                  <span className="ml-2 text-sm text-gray-700">{service.name}</span>
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              有興趣的服務
            </label>
            <input 
              type="text"
              name="customService"
              value={formData.customService || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, customService: e.target.value }))}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="請輸入您有興趣的服務"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            我不是機器人 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded-md bg-gray-50">
            <input
              type="checkbox"
              name="isNotRobot"
              checked={formData.isNotRobot}
              onChange={(e) => setFormData(prev => ({ ...prev, isNotRobot: e.target.checked }))}
              disabled={isSubmitting}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
            />
            <span className="text-sm text-gray-700">進行人機身份驗證</span>
            <div className="ml-auto">
              {/* 這裡可以集成真正的 reCAPTCHA */}
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                🔒
              </div>
            </div>
          </div>
        </div>
        
        <button 
          type="submit"
          disabled={isSubmitting || !formData.isNotRobot}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          {isSubmitting ? '發送中...' : '發送訊息'}
        </button>
      </form>
    </div>
  );
}
