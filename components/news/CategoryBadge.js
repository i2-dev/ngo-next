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
    <div className="mb-4">
      <span 
        className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition-colors duration-200 cursor-pointer"
        onClick={handleCategoryClick}
      >
        {category.name}
      </span>
    </div>
  );
}
