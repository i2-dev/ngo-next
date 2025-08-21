import StrapiImage from "@/components/StrapiImage";
import CtaButton from "@/components/CtaButton";

export default function TableCardBlock({ block, locale }) {
  if (!block) return null;

  // 處理表頭數據
  const getTableHeaders = () => {
    if (block.Thead && block.Thead.length > 0) {
      return block.Thead.map(header => ({
        id: header.id,
        text: header.Text
      }));
    }
    return [];
  };

  // 處理表格數據
  const getTableData = () => {
    if (block.Tbody && block.Tbody.length > 0) {
      return block.Tbody.map(row => ({
        id: row.id,
        textList: row.TextList || []
      }));
    }
    return [];
  };

  const tableHeaders = getTableHeaders();
  const tableData = getTableData();

  return (    
    <>
      {/* 主標題區域 */}      
      {block.Title && (
        <div className="text-center mb-10">                                        
            <h2
                className="text-[#3E3978] text-[42px]/[calc(100%+16px)] font-medium max-lg:text-4xl max-md:text-3xl"
                dangerouslySetInnerHTML={{ __html: block.Title }}
            />
        </div>        
      )}      

      {/* 功能表格 */}
      <div className="overflow-x-auto">
        <table className="w-full rounded-[20px] overflow-hidden">
          {/* 表格標題行 */}
          <thead>
              <tr className='*:bg-linear-[to_right,#3baf5d_0,#6fd38c_100%] *:text-white *:text-[22px]/[1.18] *:p-[17px_42px] *:min-w-46'>                  
                  {tableHeaders.map((header, index) => (
                    <td key={header.id || index}>
                      {header.text}
                    </td>
                  ))}
              </tr>
          </thead>
          {/* 表格內容 */}
          <tbody>
            {tableData.map((row, index) => (
              <tr key={row.id || index} className='*:text-[#555] *:text-lg/[1.22] *:p-[19px_42px] odd:bg-[#fcfcfc] even:bg-[#f8f2ff]'>              
                {row.textList.map((textItem, cellIndex) => (
                  <td key={textItem.id || cellIndex}>
                    {textItem.List}
                  </td>                  
                ))}              
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>    
  );
}
