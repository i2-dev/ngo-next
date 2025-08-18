'use client';

import { useRouter } from 'next/navigation';

export default function CategoryBadgeInline({ category, locale }) {
  const router = useRouter();

  const handleCategoryClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/${locale}/ngo-latest-news/category/${category.documentId}`);
  };

  return (
    <span onClick={handleCategoryClick} >
      {category.name}
    </span>
  );
}
