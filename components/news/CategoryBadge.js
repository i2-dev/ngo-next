'use client';

import { useRouter } from 'next/navigation';

export default function CategoryBadge({ category, locale }) {
  const router = useRouter();

  const handleCategoryClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/${locale}/ngo-latest-news/category/${category.documentId}`);
  };

  return (
    <div className="inline-block mx-auto rounded-md mb-5 py-1 px-2.5 border border-gray-50 hover:bg-[#286e11] hover:text-white transition-colors duration-200 cursor-pointer">
      <span 
        className="rounded-full text-sm font-medium"
        onClick={handleCategoryClick}
      >
        {category.name}
      </span>
    </div>
  );
}
