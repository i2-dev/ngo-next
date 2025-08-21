'use client';

import { useState, useEffect, useRef } from 'react';

const ANIMATION_TYPES = {
  'fade-up': { opacity: [0, 1], transform: ['translateY(30px)', 'translateY(0)'] },
  'fade-down': { opacity: [0, 1], transform: ['translateY(-30px)', 'translateY(0)'] },
  'fade-left': { opacity: [0, 1], transform: ['translateX(-30px)', 'translateX(0)'] },
  'fade-right': { opacity: [0, 1], transform: ['translateX(30px)', 'translateX(0)'] },
  'zoom-in': { opacity: [0, 1], transform: ['scale(0.8)', 'scale(1)'] },
  'zoom-out': { opacity: [0, 1], transform: ['scale(1.2)', 'scale(1)'] },
};

export default function SimpleAnimatedElement({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  threshold = 0.1,
  easing = 'ease-out',
  triggerOnce = true
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const element = elementRef.current;
    if (!element) return;

    // 檢查 IntersectionObserver 支持
    if (!window.IntersectionObserver) {
      setTimeout(() => setIsVisible(true), delay);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setTimeout(() => {
            setIsVisible(true);
            setHasTriggered(true);
          }, delay);

          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '50px'
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isClient, delay, threshold, triggerOnce, hasTriggered]);

  const animationConfig = ANIMATION_TYPES[animation] || ANIMATION_TYPES['fade-up'];

  if (!isClient) {
    // SSR 期間返回隱藏狀態
    return (
      <div
        ref={elementRef}
        style={{
          opacity: animationConfig.opacity[0],
          transform: animationConfig.transform[0]
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={elementRef}
      style={{
        opacity: isVisible ? animationConfig.opacity[1] : animationConfig.opacity[0],
        transform: isVisible ? animationConfig.transform[1] : animationConfig.transform[0],
        transition: `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`,
      }}
    >
      {children}
    </div>
  );
}

// 預設動畫組件
export const FadeUp = (props) => <SimpleAnimatedElement animation="fade-up" {...props} />;
export const FadeDown = (props) => <SimpleAnimatedElement animation="fade-down" {...props} />;
export const FadeLeft = (props) => <SimpleAnimatedElement animation="fade-left" {...props} />;
export const FadeRight = (props) => <SimpleAnimatedElement animation="fade-right" {...props} />;
export const ZoomIn = (props) => <SimpleAnimatedElement animation="zoom-in" {...props} />;
export const ZoomOut = (props) => <SimpleAnimatedElement animation="zoom-out" {...props} />;
