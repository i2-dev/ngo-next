"use client";

import { useLayoutEffect, useRef } from 'react';

export default function HeaderScrollEffect() {
  const initializedRef = useRef(false);

  useLayoutEffect(() => {

    // 添加全局測試函數
    window.testHeaderScroll = () => {
      const header = document.getElementById('header');

      if (header) {
        header.classList.add('scrolled');


        // 檢查計算樣式
        const computedStyle = window.getComputedStyle(header);
      }
    };

    window.forceHeaderScrolled = () => {
      const header = document.getElementById('header');
      if (header) {
        header.classList.add('scrolled');
      }
    };

    window.removeHeaderScrolled = () => {
      const header = document.getElementById('header');
      if (header) {
        header.classList.remove('scrolled');
      }
    };


    return () => {
      delete window.testHeaderScroll;
      delete window.forceHeaderScrolled;
      delete window.removeHeaderScrolled;
      initializedRef.current = false;
    };
  }, []);

  return null;
}
