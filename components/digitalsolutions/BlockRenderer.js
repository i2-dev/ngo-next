import CardBlock from "./blocks/CardBlock";
import CardItemBlock from "./blocks/CardItemBlock";
import StoryCardBlock from "./blocks/StoryCardBlock";
import FunctionalCardBlock from "./blocks/FunctionalCardBlock";
import FaqCardBlock from "./blocks/FaqCardBlock";
import WelfareCardBlock from "./blocks/WelfareCardBlock";
import SwiperCardBlock from "./blocks/SwiperCardBlock";
import TableCardBlock from "./blocks/TableCardBlock";
import PromotionCardBlock from "./blocks/PromotionCardBlock";
import PageSection from "../blocks/PageSection";

export default function BlockRenderer({ blocks, locale }) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((block, index) => {
        // 根據組件類型渲染對應的區塊
        switch (block.__component) {
          case 'digital-solutions.card':
            return (              
              <PageSection key={`${block.id}-${index}`} className={block.type === 'style-2' ? 'bg-[rgba(247,242,244,0.5)] backdrop-filter-[blur(10px)] pt-0' : block.type === 'style-3' ? '!py-0' : 'pt-0'}>
                <CardBlock 
                  block={block}
                  locale={locale}
                />
              </PageSection>
            );
          
          case 'digital-solutions.card-item':
            return (
              <PageSection key={`${block.id}-${index}`} className={'group pt-0'}>
                <CardItemBlock 
                  block={block}
                  locale={locale}
                />
              </PageSection>
            );
          
          case 'digital-solutions.story-card':
            return (
              <PageSection key={`${block.id}-${index}`}>
                <StoryCardBlock 
                  block={block}
                  locale={locale}
                />
              </PageSection>
            );
          
          case 'digital-solutions.functional-card':
            return (
              <PageSection key={`${block.id}-${index}`} className={'bg-[rgba(247,242,244,0.5)] backdrop-filter-[blur(10px)]'}>
                <FunctionalCardBlock 
                  block={block}
                  locale={locale}
                />
              </PageSection>
            );
          
          case 'digital-solutions.faq-card':
            return (
              <PageSection key={`${block.id}-${index}`} className={'bg-[rgba(247,242,244,0.5)] backdrop-filter-[blur(10px)] pt-0'}>
                <hr className='border-[#8d8d8d] mt-0 mb-25'></hr>
                <FaqCardBlock 
                  block={block}
                  locale={locale}
                />
              </PageSection>
            );
          
          case 'digital-solutions.welfare-card':
            return (
              <PageSection key={`${block.id}-${index}`} className={'pt-0'}>
                <WelfareCardBlock 
                  block={block}
                  locale={locale}
                />
              </PageSection>
            );
          
          case 'digital-solutions.swiper-card':
            return (
              <PageSection key={`${block.id}-${index}`} className={'pt-0'}>
                <SwiperCardBlock 
                  block={block}
                  locale={locale}
                />
              </PageSection>
            );
          
          case 'digital-solutions.table-card':
            return (
              <PageSection key={`${block.id}-${index}`} className={'bg-[rgba(247,242,244,0.5)] backdrop-filter-[blur(10px)]'}>
                <TableCardBlock 
                  block={block}
                  locale={locale}
                />
              </PageSection>
            );
          
          case 'digital-solutions.promotion-card':
            return (
              <PageSection key={`${block.id}-${index}`} className={'last:pb-50'}>
                <PromotionCardBlock 
                  block={block}
                  locale={locale}
                />
              </PageSection>
            );
          
          default:
            console.warn(`Unknown block component: ${block.__component}`);
            return null;
        }
      })}
    </>
  );
}
