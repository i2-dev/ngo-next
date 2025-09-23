import SimpleImage from "@/components/SimpleImage";

// 功能卡片組件 - 上下結構佈局
export default function FeatureCard({ card, index }) {
  return (
    <div className="bg-white rounded-[20px] p-12 shadow-[0_2px_7px_rgba(0,0,0,0.1)] [&:first-child>h3]:text-[#ba5c1f] [&:nth-child(2)>h3]:text-[#428156] [&:nth-child(3)>h3]:text-[#555bba] [&:nth-child(4)>h3]:text-[#837634] [&:nth-child(5)>h3]:text-[#1e809c] [&:nth-child(6)>h3]:text-[#c54380]">
      {/* 圖標區域 - 置頂 */}      
      {card.icon ? (        
        <SimpleImage
          image={card.icon}
          width={card.icon.width}
          height={card.icon.height}
          alt={card.Title || '功能圖標'}
          className="mb-7"
        />        
      ) : (
        <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      

      {/* 內容區域 - 置底 */}      
      <h3 className="text-[22px] mb-2.5">
        {card.Title}
      </h3>

      {card.Text && card.Text.length > 0 && (
        <ul className="ml-5">
          {card.Text.map((textItem, textIndex) => (
            <li key={textIndex} className="list-disc mb-3.5">              
              {textItem.Text}
            </li>
          ))}
        </ul>
      )}
      
    </div>
  );
}
