"use client";

import { useRouter } from 'next/navigation';

export default function SitemapLink({ href, children, className, target }) {
  const router = useRouter();
  
  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };
  
  return (
    <a 
      href={href} 
      onClick={handleClick}
      className={className}
      target={target}
    >
      {children}
    </a>
  );
}
