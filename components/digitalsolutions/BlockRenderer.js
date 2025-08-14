import CardBlock from "./blocks/CardBlock";
import CardItemBlock from "./blocks/CardItemBlock";
import StoryCardBlock from "./blocks/StoryCardBlock";
import FunctionalCardBlock from "./blocks/FunctionalCardBlock";
import FaqCardBlock from "./blocks/FaqCardBlock";

export default function BlockRenderer({ blocks, locale }) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-16">
      {blocks.map((block, index) => {
        // 根據組件類型渲染對應的區塊
        switch (block.__component) {
          case 'digital-solutions.card':
            return (
              <CardBlock 
                key={`${block.id}-${index}`}
                block={block}
                locale={locale}
              />
            );
          
          case 'digital-solutions.card-item':
            return (
              <CardItemBlock 
                key={`${block.id}-${index}`}
                block={block}
                locale={locale}
              />
            );
          
          case 'digital-solutions.story-card':
            return (
              <StoryCardBlock 
                key={`${block.id}-${index}`}
                block={block}
                locale={locale}
              />
            );
          
          case 'digital-solutions.functional-card':
            return (
              <FunctionalCardBlock 
                key={`${block.id}-${index}`}
                block={block}
                locale={locale}
              />
            );
          
          case 'digital-solutions.faq-card':
            return (
              <FaqCardBlock 
                key={`${block.id}-${index}`}
                block={block}
                locale={locale}
              />
            );
          
          default:
            console.warn(`Unknown block component: ${block.__component}`);
            return null;
        }
      })}
    </div>
  );
}
