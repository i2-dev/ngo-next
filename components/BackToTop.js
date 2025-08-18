'use client';

import { useState, useEffect, useCallback } from 'react';

export default function BackToTop({ 
  showAfter = 100, 
  scrollDuration = 800, 
  className = "",
  showProgress = true 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // 計算滾動進度
  const calculateScrollProgress = useCallback(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentProgress = (window.pageYOffset / totalHeight) * 100;
    setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
  }, []);

  // 節流函數優化滾動性能
  const throttle = useCallback((func, delay) => {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }, []);

  // 監聽滾動事件
  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrolled = window.pageYOffset;
      setIsVisible(scrolled > showAfter);
      
      if (showProgress) {
        calculateScrollProgress();
      }
    }, 16); // 約60fps

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showAfter, showProgress, throttle, calculateScrollProgress]);

  // 平滑滾動到頂部
  const scrollToTop = useCallback(() => {
    const startTime = performance.now();
    const startScrollY = window.pageYOffset;
    
    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / scrollDuration, 1);
      
      // 使用緩動函數
      const easeInOutCubic = progress < 0.5 
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      window.scrollTo(0, startScrollY * (1 - easeInOutCubic));
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  }, [scrollDuration]);

  // 鍵盤支援
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTop();
    }
  }, [scrollToTop]);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-8 right-8 z-50 ${className}`}>
      <button
        onClick={scrollToTop}
        onKeyDown={handleKeyDown}
        className="group relative bg-[#6ccb50] hover:bg-[#286e11] text-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#6ccb50] focus:ring-opacity-50 active:scale-95"
        aria-label="返回頂部"
        title="返回頂部"
      >
        {/* 進度環 */}
        {showProgress && (
          <svg
            className="absolute inset-0 w-full h-full transform -rotate-90"
            viewBox="0 0 36 36"
          >
            <path
              className="text-white/20"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-white transition-all duration-200"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${scrollProgress}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        )}
        
        {/* 箭頭圖標 */}
        <svg
          className="relative w-6 h-6 transition-transform duration-200 group-hover:-translate-y-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  );
}
