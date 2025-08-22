import InformationSection from "./InformationSection";
import InformationSectionPreview from "./InformationSectionPreview";

export default function InformationSectionWrapper({ 
  locale = 'en', 
  styles, 
  informationData, 
  newsData = null,
  isPreview = null // 如果為 null，則自動檢測
}) {
  // 自動檢測是否為預覽模式
  const isPreviewMode = isPreview !== null ? isPreview : (
    // 檢查是否在預覽路徑中
    typeof window !== 'undefined' && window.location.pathname.includes('/preview/')
  );

  // 如果是預覽模式，使用 InformationSectionPreview
  if (isPreviewMode) {
    return (
      <InformationSectionPreview 
        locale={locale} 
        styles={styles} 
        informationData={informationData}
        newsData={newsData}
      />
    );
  }

  // 如果是正式發布模式，使用 InformationSection
  return (
    <InformationSection 
      locale={locale} 
      styles={styles} 
      informationData={informationData}
    />
  );
}
