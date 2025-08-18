import FeatureCard from "./FeatureCard";
import ScreenshotCard from "./ScreenshotCard";
import MoreSuccessCases from "./MoreSuccessCases";
import styles from "@/styles/SuccessCases.module.css";

export default function SuccessCaseBlockRenderer({ successCase, locale, allSuccessCases = [], menuData = null }) {
  if (!successCase) {
    return null;
  }

  return (
    <div className="space-y-16">
      {/* 功能特色區域 */}
      {successCase.card && successCase.card.length > 0 && (
        <section>
          <div className="grid gap-6 md:gap-8 md:grid-cols-2">
            {successCase.card.map((card, index) => (
              <FeatureCard key={index} card={card} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* 截圖畫廊區域 */}
      {successCase.screenshot && successCase.screenshot.length > 0 && (
        <section>
          <div className="w-full">
            <ScreenshotCard screenshots={successCase.screenshot} />
          </div>
        </section>
      )}

      {/* 更多成功案例區域 */}
      <MoreSuccessCases
        allSuccessCases={allSuccessCases}
        currentCaseOrder={successCase.order}
        locale={locale}
        menuData={menuData}
        maxDisplay={2}
      />
    </div>
  );
}



