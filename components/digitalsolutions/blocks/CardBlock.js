import StrapiImage from "@/components/StrapiImage";

export default function CardBlock({ block, locale, className = '' }) {
  if (!block) return null;

  // 判斷樣式類型
  const isStyle2 = block.type === 'style-2';
  const isStyle3 = block.type === 'style-3';

  const renderStyle1 = () => (
    <div className="grid grid-cols-2 gap-[30px_40px] max-md:grid-cols-1">
      {block.Carditem.map((item, index) => (
        <div
          key={item.id || index}
          className='group bg-white flex items-center p-[40px_35px] rounded-[20px]'
        >
          {item.Cover && item.Cover.length > 0 && (
            <StrapiImage
              image={item.Cover[0]}
              alt={item.Title}
              width={item.Cover[0].width}
              height={item.Cover[0].height}
            />
          )}
          <div className='mt-5 sm:mt-0 ml-5'>
            <h3 className="text-[#ba5c1f] group-[&:nth-child(4n+2)]:text-[#428156] group-[&:nth-child(4n+3)]:text-[#555bba] group-[&:nth-child(4n+4)]:text-[#837634] text-[22px]/[26px] mb-2.5">
              {item.Title}
            </h3>
            {item.Content && (
              <p>{item.Content}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderStyle2 = () => (
    <div className="grid grid-cols-3 gap-10 max-lg:gap-x-5 max-md:grid-cols-1">
      {block.Carditem.map((item, index) => (
        <div
          key={item.id || index}
          className="group flex flex-col"
        >
          {item.Cover && item.Cover.length > 0 && (
            <StrapiImage
              image={item.Cover[0]}
              width={item.Cover[0].width}
              height={item.Cover[0].height}
              alt={item.Title}
              className="w-full"
            />
          )}
          <div className="bg-[#d0f3db] group-even:bg-[#c7efef] flex-1 w-[calc(100%-60px)] min-h-31 -mt-10 p-[15px_20px] relative">
            <h3 className="text-[#3e3978] text-[22px] mb-2.5">
              {item.Title}
            </h3>
            {item.Content && (
              <p>{item.Content}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderStyle3 = () => (
    <div className="flex flex-col justify-center mb-12 md:flex-wrap md:flex-row">
      {block.Carditem.map((item, index) => (
        <div
          key={item.id || index}
          className="basis-56 text-center lg:basis-64"
        >          
          {item.Cover && item.Cover.length > 0 && (              
            <StrapiImage
              image={item.Cover[0]}
              width={item.Cover[0].width}
              height={item.Cover[0].height}
              alt={item.Title}
              className="w-[150px] rounded-full m-auto mb-4"
            />              
          )}          
          <p>
            {item.Title}
          </p>
          {item.Content && (
            <p>
              {item.Content}
            </p>
          )}          
        </div>
      ))}
    </div>
  );

  return (
    <div className={className}>
      <div className={isStyle2 || isStyle3 ? "" : "xl:max-w-[1160px] xl:mx-auto"}>
        {block.Title && (
          <div className="text-center mb-12">
            <h2 className={`${isStyle3 ? "" : "text-[#3e3978]"} text-[42px] font-medium max-lg:text-4xl max-md:text-3xl`}>{block.Title}</h2>
            {block.subTitle && (
              <p>{block.subTitle}</p>
            )}
          </div>
        )}

        {block.Carditem && block.Carditem.length > 0 && (
          <>
            {isStyle2 ? renderStyle2() : isStyle3 ? renderStyle3() : renderStyle1()}
          </>
        )}
      </div>
    </div>
  );
}
