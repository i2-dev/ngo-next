// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import BackToTop from "@/components/BackToTop";
// import PromoBanner from "@/components/PromoBanner";
import { Suspense } from 'react';

export default function PreviewLayout({ children }) {
  return (
    <>
      {/* Header */}
      {/* <Header locale="en" /> */}
      <main className="flex-grow">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg">正在加载预览...</span>
          </div>
        }>
          {children}
        </Suspense>
      </main>
      {/* <Footer locale="en" /> */}
      
      {/* 右下角固定組件 */}
      {/* <PromoBanner locale="en" /> */}
      {/* 返回頂部按鈕 */}
      {/* <BackToTop /> */}
    </>
  );
}
