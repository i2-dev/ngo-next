'use client';

import Image from 'next/image';
import StrapiImage from '@/components/StrapiImage';
import { getStrapiMedia } from '@/utils/get-strapi-media';
import { useStaggeredAnimation } from '@/hooks/useInViewAnimation';
import { FadeDown, FadeUp, FadeLeft, FadeRight, ZoomIn } from '@/components/SimpleAnimatedElement';

const ClientLogoSection = ({ 
  logoData,  
}) => {
  // 如果沒有 logo 數據，不渲染組件
  if (!logoData) {
    return null;
  }

  // 支持兩種數據結構：Awards 或 logo
  const logoArray = logoData.Awards || logoData.logo;
  
  if (!logoArray || !Array.isArray(logoArray)) {
    return null;
  }

  const { Title: sectionTitle } = logoData;
  const awards = logoArray;

  // 使用交錯動畫 Hook
  const { ref, getItemClass, getItemStyle } = useStaggeredAnimation(awards.length, 150);

  return (
    <>        
      {/* 標題區域 */}
      {sectionTitle && (
        <FadeDown delay={200} duration={800}>
          <div className="text-center mb-12">            
            <h2 className="text-[42px]/[calc(100%+10px)] font-medium max-lg:text-4xl max-md:text-3xl">
              {sectionTitle}
            </h2>
          </div>
        </FadeDown>
      )}

      {/* 獲獎網格 */}
      <div ref={ref} className="grid grid-cols-5 gap-y-20 gap-x-5 max-lg:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {awards.map((award, index) => (
          <div 
            key={award.id || index}
            className={`aos-zoom-in ${getItemClass(index)}`}
            style={getItemStyle(index)}
          >
            {/* 獲獎圖片 */}
            {award.Image ? (
              <StrapiImage
                        image={award.Image}
                        alt={award.name || 'Award Logo'}
                        width={award.Image.width}
                        height={award.Image.height}
                        className='rounded-full m-auto hover:scale-110 transition-transform duration-300'
                      />
              
            ) : (
              <div className="mb-4 w-20 h-20 md:w-24 md:h-24 bg-red-200 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <span className="text-xs text-red-600">No Image</span>
              </div>
            )}              
          </div>
        ))}
      </div>      
    </>
  );
};

export default ClientLogoSection;
