'use client'

import Link from "next/link";

export default function CtaButton({ cta, className = "", colorClass = "" }) {
  if (!cta?.href || !cta?.text) return null;

  return (
    <Link
      href={cta.href}
      target={cta.isExternal ? "_blank" : "_self"}
      rel={cta.isExternal ? "noopener noreferrer" : undefined}
      className={`${colorClass} ${className}`}
    >
      {cta.text}
    </Link>
  );
}
