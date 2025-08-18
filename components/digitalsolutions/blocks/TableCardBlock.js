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
          <div className="py-16 px-4">
               <div className="max-w-7xl mx-auto">
                                         {/* 主標題區域 */}
                     <div className="text-center mb-12">
                          {block.Title && (
                               <h2 
                                    className="text-4xl md:text-5xl font-bold text-blue-900 mb-4"
                                    dangerouslySetInnerHTML={{ __html: block.Title }}
                               />
                          )}
                     </div>

                    {/* 功能表格 */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                         {/* 表格標題行 */}
                         <div className="bg-gradient-to-r from-green-500 to-green-600">
                              <div className={`grid gap-4 p-6 ${tableHeaders.length === 3 ? 'grid-cols-3' : `grid-cols-${tableHeaders.length}`}`}>
                                   {tableHeaders.map((header, index) => (
                                        <div key={header.id || index} className="text-white font-bold text-lg text-center">
                                             {header.text}
                                        </div>
                                   ))}
                              </div>
                         </div>

                         {/* 表格內容 */}
                         <div className="divide-y divide-gray-200">
                              {tableData.map((row, index) => (
                                   <div
                                        key={row.id || index}
                                        className={`grid gap-4 p-6 transition-colors duration-200 hover:bg-gray-50 ${tableHeaders.length === 3 ? 'grid-cols-3' : `grid-cols-${tableHeaders.length}`
                                             } ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                   >
                                        {row.textList.map((textItem, cellIndex) => (
                                             <div key={textItem.id || cellIndex} className="flex items-center justify-center px-4">
                                                  <div className="text-center">
                                                       {/* 如果是最後一列（收益列），添加特殊樣式 */}
                                                       {cellIndex === row.textList.length - 1 ? (
                                                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                                                                 <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                 </svg>
                                                                 <span className="font-medium">{textItem.List}</span>
                                                            </div>
                                                       ) : cellIndex === 0 ? (
                                                            /* 第一列（功能列）使用較大字體 */
                                                            <div className="text-lg font-semibold text-gray-800">
                                                                 {textItem.List}
                                                            </div>
                                                       ) : (
                                                            /* 中間列（描述列）使用普通樣式 */
                                                            <p className="text-gray-700 leading-relaxed">
                                                                 {textItem.List}
                                                            </p>
                                                       )}
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              ))}
                         </div>
                    </div>
               </div>
          </div>
     );
}
