export default function FaqCardBlock({ block, locale }) {
  if (!block) return null;

  return (    
    <div className="grid grid-cols-2 gap-x-10 max-lg:grid-cols-1">
      {/* 左側標題區域 */}
      {block.Title && (
        <div>
          <h2 className='text-[#3e3978] text-[42px] max-lg:text-4xl max-lg:mb-12 max-md:text-3xl'>{block.Title}</h2>           
        </div>
      )}

      {/* 右側 FAQ 內容區域 */}      
      {block.List && block.List.length > 0 && (
        <div className="space-y-12">
          {block.List.map((item, index) => (
            <div key={item.id || index} >
              {/* 問題標題 */}
              <h3 className='text-[#3e3978] text-2xl mb-5'>{item.Title}</h3>              
              
              {/* 答案內容 */}              
              <p>{item.Content}</p>              
            </div>
          ))}
        </div>
      )}      
    </div>    
  );
}
