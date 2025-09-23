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
          <div className="fixed inset-0 z-50 flex h-screen items-center justify-center bg-gray-100 bg-opacity-90">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
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
