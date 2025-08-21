"use client";

import { useEffect } from 'react';

export default function HeaderScrollEffect() {
  useEffect(() => {
    const header = document.getElementById('header');
    const scrollThreshold = 5; // 降低觸發閾值，讓首頁也能看到效果
    
    if (!header) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      if (scrollY > scrollThreshold) {
        if (!header.classList.contains('scrolled')) {
          header.classList.add('scrolled');
        }
      } else {
        if (header.classList.contains('scrolled')) {
          header.classList.remove('scrolled');
        }
      }
    };
    
    // Initial check
    handleScroll();
    
    // Add scroll event listener with throttling for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, []);
  
  // This component doesn't render anything visible
  return null;
}
