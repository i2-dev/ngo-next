'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PreviewWrapper({ 
  children, 
  contentType, 
  data, 
  loading, 
  error 
}) {
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(true);

  const status = searchParams.get('status') || 'draft';
  const documentId = searchParams.get('documentId');
  const locale = searchParams.get('locale') || 'en';

  // 自动隐藏预览横幅（5秒后）
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg">正在加载预览数据...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h2 className="text-red-800 text-xl font-semibold mb-2">预览加载失败</h2>
            <p className="text-red-600">{error}</p>
            <div className="mt-4 text-sm text-gray-600">
              <p>内容类型: {contentType}</p>
              <p>状态: {status}</p>
              <p>文档ID: {documentId}</p>
              <p>语言: {locale}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 预览横幅 */}
      {/* {isVisible && (
        <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white px-4 py-2 text-center z-50">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <span className="font-semibold">🔍 预览模式</span>
              <span className="text-sm opacity-90">
                内容类型: {contentType} | 状态: {status} | 语言: {locale}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {data?.updatedAt && (
                <span className="text-sm opacity-90">
                  最后更新: {new Date(data.updatedAt).toLocaleString()}
                </span>
              )}
              <button
                onClick={() => setIsVisible(false)}
                className="text-white opacity-70 hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* 主要内容 */}
      <div className={isVisible ? 'pt-16' : ''}>
        {children}
      </div>

      {/* 预览控制按钮 */}
      {/* {!isVisible && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setIsVisible(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
          >
            🔍 显示预览信息
          </button>
        </div>
      )} */}
    </>
  );
}
