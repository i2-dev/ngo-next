export default function FunctionalCardBlock({ block, locale }) {
  if (!block) return null;

  return (    
    <div className="grid grid-cols-2 gap-x-10 max-lg:grid-cols-1">
      {/* 左側標題 */}
      {block.Title && (
        <div>
          <h2 className='text-[#3e3978] text-[42px] max-lg:text-4xl max-lg:mb-12 max-md:text-3xl'>{block.Title}</h2>           
        </div>
      )}

      {/* 右側功能列表 */}
      {block.List && block.List.length > 0 && (
        <div>
          <ul>
            {block.List.map((item, index) => (
              <li 
                key={item.id || index}
                className="bg-[url(/images/global/list-checkpoint.png)] bg-no-repeat bg-position-[0_2px] list-none text-[20px] p-[2px_0_2px_47px] mb-5 last:mb-0"
              >
                {/* 內容 */}
                {item.List}                  
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>    
  );
}
