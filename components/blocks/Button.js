'use client'
import Link from "next/link"
import clsx from 'clsx'

export default function SharedButton({ 
  // Handle both object structure (Text, URL, Target) and direct props (href, target, className)
   buttonText,
   buttonLink ,
   Text,
   URL, 
   Target, 
   href, 
   target, 
   className, 
   children,
   isExternal, // Extract isExternal to prevent it from being passed to Link
   ...props 
}) {
  // Use the object properties if available, otherwise fall back to direct props
  const buttonTarget = Target || target || (isExternal ? '_blank' : '_self')
  
  // Filter out any other non-DOM props that shouldn't be passed to Link
  const {
    // Remove any other potential non-DOM props here
    ...linkProps
  } = props;
  
  return (
    <Link                   
      href={buttonLink || URL || "#"}
      target={buttonTarget}
      rel={buttonTarget === '_blank' ? 'noopener noreferrer' : undefined}
      className={clsx(
        "bg-[#74d190] text-white text-[22px]/[30px] leading-[30px] block rounded-lg p-[14px_22px_14px_20px] max-lg:text-[18px]/[26px] max-lg:leading-[26px] max-lg:py-2.5 max-lg:px-4",
        className
      )}
      {...linkProps}
    >
      {buttonText || Text || "Click Here"}
      <span className="bg-white bg-[url(/btn-arrow-blue.png)] bg-no-repeat bg-center inline-block w-[30px] h-[30px] ml-2.5 rounded-full align-text-bottom max-lg:w-[26px] max-lg:h-[26px] max-lg:bg-size-[6px_auto]"></span>
    </Link>
  )
}