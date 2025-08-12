'use client';

import Image from 'next/image';
import StrapiImage from '@/components/StrapiImage';
import { getStrapiMedia } from '@/utils/get-strapi-media';

const ClientLogoSection = ({ 
  logoData,
  className = "",
  containerClassName = "",
  titleClassName = "",
  gridClassName = "",
  logoItemClassName = ""
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

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className={`max-w-6xl mx-auto px-4 ${containerClassName}`}>
        
        {/* 標題區域 */}
        {sectionTitle && (
          <div className="text-center mb-12">
            <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 ${titleClassName}`}>
              {sectionTitle}
            </h2>
          </div>
        )}

        {/* 獲獎網格 */}
        <div className={gridClassName}>
          {awards.map((award, index) => (
            <div 
              key={award.id || index}
              className={logoItemClassName}
            >
              {/* 獲獎圖片 */}
              {award.Image ? (
                <div className="mb-4 w-20 h-20 md:w-24 md:h-24 relative overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
                  {(() => {
                      const imageData = Array.isArray(award.Image) ? award.Image[0] : award.Image;
                      // console.log('🖼️ Image data for award', index + 1, ':', imageData);
                      return (
                        <StrapiImage
                          image={imageData}
                          alt={award.name || 'Award Logo'}
                          width={96}
                          height={96}
                          className="object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      );
                    })()}
                </div>
              ) : (
                <div className="mb-4 w-20 h-20 md:w-24 md:h-24 bg-red-200 rounded-xl flex items-center justify-center">
                  <span className="text-xs text-red-600">No Image</span>
                </div>
              )}

              {/* 獲獎名稱 */}
              {award.name && (
                <h3 className="text-sm md:text-base font-medium text-gray-700 leading-tight">
                  {award.name}
                </h3>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogoSection;
