/**
 * 動畫工具函數和配置
 */

// 動畫類型映射
export const ANIMATION_TYPES = {
  'fade': 'aos-fade',
  'fade-up': 'aos-fade-up',
  'fade-down': 'aos-fade-down',
  'fade-left': 'aos-fade-left',
  'fade-right': 'aos-fade-right',
  'zoom-in': 'aos-zoom-in',
  'zoom-out': 'aos-zoom-out',
  'flip-up': 'aos-flip-up',
  'flip-down': 'aos-flip-down',
  'slide-up': 'aos-slide-up',
  'slide-down': 'aos-slide-down',
  'slide-left': 'aos-slide-left',
  'slide-right': 'aos-slide-right',
};

// 延遲配置
export const ANIMATION_DELAYS = {
  100: '100ms',
  200: '200ms',
  300: '300ms',
  400: '400ms',
  500: '500ms',
  600: '600ms',
  700: '700ms',
  800: '800ms',
  900: '900ms',
  1000: '1000ms',
};

// 動畫持續時間配置
export const ANIMATION_DURATIONS = {
  200: '0.2s',
  300: '0.3s',
  400: '0.4s',
  500: '0.5s',
  600: '0.6s',
  700: '0.7s',
  800: '0.8s',
  900: '0.9s',
  1000: '1s',
  1200: '1.2s',
  1500: '1.5s',
};

// 緩動函數配置
export const ANIMATION_EASINGS = {
  'ease': 'ease',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
  'linear': 'linear',
  'ease-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  'ease-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
};

/**
 * 獲取動畫類名
 * @param {string} animationType - 動畫類型
 * @returns {string} CSS 類名
 */
export function getAnimationClass(animationType) {
  return ANIMATION_TYPES[animationType] || ANIMATION_TYPES['fade-up'];
}

/**
 * 生成動畫樣式對象
 * @param {Object} options - 動畫選項
 * @param {number} options.delay - 延遲時間（毫秒）
 * @param {number} options.duration - 持續時間（毫秒）
 * @param {string} options.easing - 緩動函數
 * @returns {Object} 樣式對象
 */
export function getAnimationStyle({ delay = 0, duration = 600, easing = 'ease-out' } = {}) {
  return {
    animationDelay: `${delay}ms`,
    animationDuration: `${duration}ms`,
    animationTimingFunction: ANIMATION_EASINGS[easing] || easing,
  };
}

/**
 * 檢查用戶是否偏好減少動畫
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * 獲取響應式動畫配置
 * @param {Object} options - 選項
 * @returns {Object} 響應式配置
 */
export function getResponsiveAnimationConfig(options = {}) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const reduced = prefersReducedMotion();

  if (reduced) {
    return {
      ...options,
      duration: 0,
      delay: 0,
    };
  }

  if (isMobile) {
    return {
      ...options,
      duration: Math.min(options.duration || 600, 400),
      delay: Math.min(options.delay || 0, 200),
    };
  }

  return options;
}

/**
 * 預設動畫配置
 */
export const DEFAULT_ANIMATION_CONFIG = {
  duration: 600,
  delay: 0,
  easing: 'ease-out',
  triggerOnce: true,
  threshold: 0.1,
};

/**
 * 常用動畫預設
 */
export const ANIMATION_PRESETS = {
  // 標題動畫
  title: {
    animation: 'fade-down',
    duration: 800,
    delay: 100,
    easing: 'ease-out',
  },
  
  // 副標題動畫
  subtitle: {
    animation: 'fade-up',
    duration: 600,
    delay: 200,
    easing: 'ease-out',
  },
  
  // 卡片動畫
  card: {
    animation: 'fade-up',
    duration: 600,
    delay: 0,
    easing: 'ease-out',
  },
  
  // 按鈕動畫
  button: {
    animation: 'zoom-in',
    duration: 400,
    delay: 300,
    easing: 'ease-bounce',
  },
  
  // 圖片動畫
  image: {
    animation: 'zoom-in',
    duration: 800,
    delay: 200,
    easing: 'ease-out',
  },
  
  // 列表項動畫
  listItem: {
    animation: 'fade-left',
    duration: 400,
    delay: 0,
    easing: 'ease-out',
  },
};
