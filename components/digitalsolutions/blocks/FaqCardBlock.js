'use client';
import { useState } from 'react';

export default function FaqCardBlock({ block, locale }) {
  const [openItems, setOpenItems] = useState(new Set());

  if (!block) return null;

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* 標題 */}
      {block.Title && (
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {block.Title}
          </h3>
        </div>
      )}

      {/* FAQ列表 */}
      {block.List && block.List.length > 0 && (
        <div className="space-y-4">
          {block.List.map((item, index) => {
            const isOpen = openItems.has(item.id);
            
            return (
              <div 
                key={item.id || index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* 問題標題 */}
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                >
                  <h4 className="font-semibold text-gray-900 pr-4">
                    {item.Title}
                  </h4>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 9l-7 7-7-7" 
                    />
                  </svg>
                </button>
                
                {/* 答案內容 */}
                {isOpen && (
                  <div className="px-6 py-4 bg-white">
                    <div className="prose prose-sm text-gray-600">
                      <p>{item.Content}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
