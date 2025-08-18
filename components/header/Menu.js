import Link from "next/link";
import { useState } from "react";

export default function Menu({ menuData }) {
     const [openSubMenu, setOpenSubMenu] = useState(null);

     if (!menuData || !menuData.data) {
          return null;
     }

     const toggleSubMenu = (index) => {
          setOpenSubMenu(openSubMenu === index ? null : index);
     };

     return (
          <nav className="bg-white shadow-lg">
               <div className="container mx-auto px-4">
                    <ul className="flex flex-wrap items-center justify-center space-x-8 py-4">
                         {menuData.data
                              .sort((a, b) => (a.Order || 0) - (b.Order || 0))
                              .map((menuItem, index) => (
                              <li key={menuItem.id} className="relative group">
                                   {/* 主菜单项 */}
                                   {menuItem.URL ? (
                                        <Link
                                             href={menuItem.URL}
                                             className="text-gray-700 hover:text-blue-600 font-medium py-2 px-3 rounded transition-colors duration-200"
                                        >
                                             {menuItem.title}
                                        </Link>
                                   ) : (
                                        <button
                                             onClick={() => toggleSubMenu(index)}
                                             className="text-gray-700 hover:text-blue-600 font-medium py-2 px-3 rounded transition-colors duration-200 flex items-center"
                                        >
                                             {menuItem.title}
                                             {menuItem.items && menuItem.items.length > 0 && (
                                                  <svg
                                                       className={`ml-1 h-4 w-4 transform transition-transform duration-200 ${openSubMenu === index ? "rotate-180" : ""
                                                            }`}
                                                       fill="none"
                                                       stroke="currentColor"
                                                       viewBox="0 0 24 24"
                                                  >
                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                  </svg>
                                             )}
                                        </button>
                                   )}

                                   {/* 子菜单 - 桌面版下拉菜单 */}
                                   {menuItem.items && menuItem.items.length > 0 && (
                                        <div className="hidden group-hover:block absolute left-0 top-full mt-1 w-64 bg-white shadow-lg rounded-lg border z-50">
                                             <ul className="py-2">
                                                  {menuItem.items.map((subItem) => (
                                                       <li key={subItem.id}>
                                                            <Link
                                                                 href={subItem.url}
                                                                 target={subItem.Target || "_self"}
                                                                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                                            >
                                                                 {subItem.Label}
                                                            </Link>
                                                       </li>
                                                  ))}
                                             </ul>
                                        </div>
                                   )}

                                   {/* 子菜单 - 移动版展开菜单 */}
                                   {menuItem.items && menuItem.items.length > 0 && openSubMenu === index && (
                                        <div className="md:hidden absolute left-0 top-full mt-1 w-64 bg-white shadow-lg rounded-lg border z-50">
                                             <ul className="py-2">
                                                  {menuItem.items.map((subItem) => (
                                                       <li key={subItem.id}>
                                                            <Link
                                                                 href={subItem.url}
                                                                 target={subItem.Target || "_self"}
                                                                 className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                                                 onClick={() => setOpenSubMenu(null)}
                                                            >
                                                                 {subItem.Label}
                                                            </Link>
                                                       </li>
                                                  ))}
                                             </ul>
                                        </div>
                                   )}
                              </li>
                         ))}
                    </ul>
               </div>
          </nav>
     );
}