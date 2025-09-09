import StrapiImage from "@/components/StrapiImage";

export default function CardBlock({ block, locale, className = '' }) {

  if (!block) return null;

  // 獲取圖片列表 - 根據 Strapi 數據格式使用 Image (單數)
  const images = block.Image || [];  

  // 判斷樣式類型
  const isStyle2 = block.type === 'style-2'; // top image - card body title and text
  const isStyle3 = block.type === 'style-3'; //ai-solution - logo and text
  const isStyle4 = block.type === 'style-4'; // left main image - card top image - card body title and text
  const isStyle5 = block.type === 'style-5'; // top image - card body title and text

  const renderStyle1 = () => (
    <div className="grid grid-cols-2 gap-[30px_40px] max-md:grid-cols-1">
      {block.Carditem.map((item, index) => (
        <div
          key={item.id || index}
          className='group bg-white flex flex-col items-center p-[40px_35px] rounded-[20px] sm:flex-row'
        >
          {item.Cover && item.Cover.length > 0 && (
            <StrapiImage
              image={item.Cover[0]}
              alt={item.Title}
              width={item.Cover[0].width}
              height={item.Cover[0].height}
            />
          )}
          <div className='mt-5 sm:mt-0 sm:ml-5'>
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

  const renderStyle4 = () => (
    <div className="grid grid-cols-2 gap-[30px_40px] max-md:grid-cols-1">
      <div className="flex justify-center items-center">
        {images.length > 0 && (
          <StrapiImage
              image={images[0]}              
              width={images[0].width}
              height={images[0].height}
              alt=""
              className="max-sm:w-4/5"
            />
        )}
      </div>
      <div className="space-y-5">
        {block.Carditem.map((item, index) => (
          <div
            key={item.id || index}
            className='group bg-white flex flex-col items-center p-[40px_35px] rounded-[20px] sm:flex-row'
          >
            {item.Cover && item.Cover.length > 0 && (
              <StrapiImage
                image={item.Cover[0]}
                alt={item.Title}
                width={item.Cover[0].width}
                height={item.Cover[0].height}
              />
            )}
            <div className='mt-5 sm:mt-0 sm:ml-5'>
              <h3 className="text-[#ba5c1f] group-[&:nth-child(4n+2)]:text-[#428156] group-[&:nth-child(4n+3)]:text-[#555bba] group-[&:nth-child(4n+4)]:text-[#837634] text-[22px]/[26px] mb-2.5">
                {item.Title}
              </h3>
              {item.Content && (
                <p className="mb-0">{item.Content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStyle5 = () => (
    <div className="grid grid-cols-2 gap-[50px_40px] max-md:grid-cols-1">
      {block.Carditem.map((item, index) => (
        <div
          key={item.id || index}
          className='group flex items-start lg:pr-12.5'
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
            <h3 className="text-[#3e3978] text-[24px]/[29px]">
              {item.Title}
            </h3>
            {item.Content && (
              <p className="text-lg mb-0">{item.Content}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={className}>
      <div className={isStyle2 || isStyle3 || isStyle5 ? "" : "xl:max-w-[1160px] xl:mx-auto"}>
        {block.Title && (
          <div className="text-center mb-12">
            <h2 className={`${isStyle3 ? "" : "text-[#3e3978]"} text-[42px] font-medium max-lg:text-4xl max-md:text-3xl`}>{block.Title}</h2>            
            {/* {block.subTitle && (
              <p>{block.subTitle}</p>
            )} */}
            {block.subTitle && (
              isStyle4 || isStyle5 ? (
                <h2 className="text-[#3e3978] text-[42px] font-medium -mt-5 max-lg:text-4xl max-md:text-3xl">{block.subTitle}</h2>
              ) : (
                <p>{block.subTitle}</p>
              )
            )}
          </div>
        )}        

        {block.Carditem && block.Carditem.length > 0 && (
          <>
            {isStyle2 ? renderStyle2() : isStyle3 ? renderStyle3() : isStyle4 ? renderStyle4() : isStyle5 ? renderStyle5() : renderStyle1()}
          </>
        )}
      </div>
    </div>
  );
}
