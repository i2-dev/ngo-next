import { Suspense } from 'react';

export default function PreviewLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg">正在加载预览...</span>
        </div>
      }>
        {children}
      </Suspense>
    </div>
  );
}
