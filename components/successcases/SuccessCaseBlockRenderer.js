import FeatureCard from "./FeatureCard";
import ScreenshotCard from "./ScreenshotCard";
import MoreSuccessCases from "./MoreSuccessCases";
import styles from "@/styles/SuccessCases.module.css";
import PageSection from "../blocks/PageSection";

export default function SuccessCaseBlockRenderer({ successCase, locale, allSuccessCases = [], menuData = null }) {
  if (!successCase) {
    return null;
  }

  return (
    <>
      {/* 功能特色區域 */}      
      {successCase.card && successCase.card.length > 0 && (
        <PageSection className={'pt-0 -mt-10 relative md:-mt-20 lg:-mt-30'}>        
          <div className="grid grid-cols-2 gap-5 px-12 max-lg:grid-cols-1 max-md:px-5">
            {successCase.card.map((card, index) => (
              <FeatureCard key={index} card={card} index={index} />
            ))}
          </div>        
        </PageSection>
      )}

      {/* 截圖畫廊區域 */}
      {successCase.screenshot && successCase.screenshot.length > 0 && (
        <PageSection className={'pt-0'}>
            <ScreenshotCard screenshots={successCase.screenshot} />          
        </PageSection>
      )}

      {/* 更多成功案例區域 */}
      <PageSection className={'bg-[rgba(247,242,244,0.5)] backdrop-filter-[blur(10px)] mb-15'}>
        <MoreSuccessCases
          allSuccessCases={allSuccessCases}
          currentCaseOrder={successCase.order}
          locale={locale}
          menuData={menuData}
          maxDisplay={2}
        />
      </PageSection>
    </>
  );
}



