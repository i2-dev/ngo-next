import SimpleImage from "@/components/SimpleImage";
import Image from "next/image";

export default function StoryCardBlock({ block, locale }) {
  if (!block) return null;

  return (
    <div className="w-full relative max-lg:flex max-lg:flex-col-reverse">
      <div className="w-[275px] h-[316px] bg-[url(/images/global/banner-body-bg-right.png)] bg-contain bg-no-repeat absolute left-[320px] top-[calc(15%+8px)] z-1 max-lg:hidden"></div>

      {/* 引言卡片 */}
      <div className="bg-linear-[to_bottom,#FFFFFF_25%,#D7F3F2_100%] shadow-[0_8px_10px_rgba(0,0,0,0.1)] flex flex-col justify-between items-start w-[420px] rounded-[30px] p-10 absolute left-0 top-[15%] z-2 max-lg:w-[75%] max-lg:-mt-12 max-lg:p-8 max-lg:relative max-md:w-full max-md:-mt-5">
          <h2 className='text-[#3e3978] text-2xl/[1.667] font-semibold mb-2.5'>{block.Title}</h2>          
          
          {/* 引言內容 */}
          {block.Content && (
            <div className='p-[10px_58px] -mx-[50px] mb-5 relative max-lg:px-10 max-lg:-mx-10'>
              <Image
                src="/images/global/quotes-open.png"
                alt=""
                width="41"
                height="33"
                className="block absolute left-0 top-0 max-lg:w-8"
              />
              <div 
                className="[&>*:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: block.Content }}
              />
              <Image
                src="/images/global/quotes-close.png"
                alt=""
                width="41"
                height="33"
                className="block absolute right-0 bottom-0 max-lg:w-8"
              />
            </div>
          )}

          {/* 人物信息 */}          
          <p className="text-[#555bba] text-lg mb-2.5"><strong>{block.name || block.Title}</strong></p>
          <p className="text-[#555bba] mb-0">{block.Position}</p>          
      </div>

      {/* 背景圖片 */}
      {block.Image && (
        <div className="w-[calc(100%-170px)] ml-[170px] max-md:w-full max-md:ml-0 max-sm:h-[calc(80vw-90px)]">
          <SimpleImage
            image={block.Image}
            alt={block.Title}
            className="w-full rounded-[30px] w-full max-md:mb-0 max-sm:h-full max-sm:object-cover max-sm:object-[90%_90%]"
          />          
        </div>
      )}
    </div>
  );
}
