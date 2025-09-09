'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getResponsiveAnimationConfig, prefersReducedMotion } from '@/utils/animations';

/**
 * 視窗檢測和動畫觸發 Hook
 * @param {Object} options - 配置選項
 * @param {number} options.threshold - 觸發閾值 (0-1)
 * @param {string} options.rootMargin - 根邊距
 * @param {boolean} options.triggerOnce - 是否只觸發一次
 * @param {boolean} options.disabled - 是否禁用動畫
 * @returns {Object} { ref, isInView, hasTriggered }
 */
export function useInViewAnimation(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    disabled = false,
  } = options;

  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const elementRef = useRef(null);
  const observerRef = useRef(null);

  // 確保在客戶端環境下才啟動動畫
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const reducedMotion = prefersReducedMotion();
    console.log('useInViewAnimation effect:', { disabled, reducedMotion, isClient });
    
    if (disabled || reducedMotion || !isClient) {
      console.log('Setting isInView to true due to:', { disabled, reducedMotion, isClient });
      setIsInView(true);
      setHasTriggered(true);
      return;
    }

    const element = elementRef.current;
    if (!element) {
      console.log('useInViewAnimation: No element found, elementRef.current is null');
      return;
    }

    // 檢查 IntersectionObserver 支持
    if (!window.IntersectionObserver) {
      console.warn('IntersectionObserver not supported, showing animation immediately');
      setIsInView(true);
      setHasTriggered(true);
      return;
    }

    // 清理舊的 observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    try {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          const inView = entry.isIntersecting;
          
          if (element.className && element.className.includes('aos-fade-down')) {
            console.log('FadeDown IntersectionObserver callback:', { 
              inView, 
              triggerOnce, 
              hasTriggered,
              element: element.className || element.tagName,
              boundingRect: entry.boundingClientRect,
              rootBounds: entry.rootBounds,
              intersectionRatio: entry.intersectionRatio
            });
          }
          
          if (inView && (!triggerOnce || !hasTriggered)) {
            setIsInView(true);
            setHasTriggered(true);
          } else if (!triggerOnce && !inView) {
            setIsInView(false);
          }
        },
        {
          threshold,
          rootMargin,
        }
      );

      observerRef.current.observe(element);
      
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('IntersectionObserver created and observing element');
      // }
    } catch (error) {
      console.error('Error creating IntersectionObserver:', error);
      // Fallback: show animation immediately
      setIsInView(true);
      setHasTriggered(true);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered, disabled, isClient]);

  return {
    ref: elementRef,
    isInView: disabled ? true : (isClient ? isInView : false),
    hasTriggered: disabled ? true : (isClient ? hasTriggered : false),
  };
}

/**
 * 交錯動畫 Hook
 * @param {number} itemCount - 項目數量
 * @param {number} staggerDelay - 交錯延遲（毫秒）
 * @param {Object} animationOptions - 動畫選項
 * @returns {Object} { ref, getItemClass, getItemStyle }
 */
export function useStaggeredAnimation(itemCount, staggerDelay = 100, animationOptions = {}) {
  const { ref, isInView } = useInViewAnimation(animationOptions);
  const [triggeredItems, setTriggeredItems] = useState(new Set());

  useEffect(() => {
    if (!isInView) return;

    const timers = [];
    
    for (let i = 0; i < itemCount; i++) {
      const timer = setTimeout(() => {
        setTriggeredItems(prev => new Set([...prev, i]));
      }, i * staggerDelay);
      
      timers.push(timer);
    }

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [isInView, itemCount, staggerDelay]);

  const getItemClass = useCallback((index) => {
    return triggeredItems.has(index) ? 'aos-animate' : '';
  }, [triggeredItems]);

  const getItemStyle = useCallback((index) => {
    const config = getResponsiveAnimationConfig({
      delay: index * staggerDelay,
      ...animationOptions,
    });

    return {
      animationDelay: `${config.delay}ms`,
      animationDuration: `${config.duration || 600}ms`,
      animationTimingFunction: config.easing || 'ease-out',
    };
  }, [staggerDelay, animationOptions]);

  return {
    ref,
    getItemClass,
    getItemStyle,
    isInView,
  };
}

/**
 * 滾動觸發動畫 Hook
 * @param {Object} options - 配置選項
 * @returns {Object} { ref, progress, isVisible }
 */
export function useScrollAnimation(options = {}) {
  const {
    threshold = 0.1,
    triggerOnce = true,
  } = options;

  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setProgress(1);
      setIsVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // 計算進度
          const rect = entry.boundingClientRect;
          const windowHeight = window.innerHeight;
          const elementHeight = rect.height;
          
          const visibleHeight = Math.min(
            windowHeight - Math.max(0, rect.top),
            elementHeight
          );
          
          const progressValue = Math.max(0, Math.min(1, visibleHeight / elementHeight));
          setProgress(progressValue);
        } else if (!triggerOnce) {
          setIsVisible(false);
          setProgress(0);
        }
      },
      { threshold }
    );

    observer.observe(element);

    // 滾動監聽器用於更新進度
    const handleScroll = () => {
      if (!isVisible) return;
      
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;
      
      const visibleHeight = Math.min(
        windowHeight - Math.max(0, rect.top),
        elementHeight
      );
      
      const progressValue = Math.max(0, Math.min(1, visibleHeight / elementHeight));
      setProgress(progressValue);
    };

    if (isVisible) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold, triggerOnce, isVisible]);

  return {
    ref: elementRef,
    progress,
    isVisible,
  };
}

/**
 * 視差滾動 Hook
 * @param {number} speed - 視差速度 (-1 到 1)
 * @returns {Object} { ref, offset }
 */
export function useParallax(speed = 0.5) {
  const [offset, setOffset] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const handleScroll = () => {
      const element = elementRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;
      
      setOffset(rate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始化

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  return {
    ref: elementRef,
    offset,
    style: {
      transform: `translateY(${offset}px)`,
    },
  };
}
