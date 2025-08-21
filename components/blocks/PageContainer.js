import React from 'react'
import clsx from 'clsx'
import Image from 'next/image'

export default function PageContainer({children, className}) {
  return (
    <>
      <div 
        className="bg-linear-[180deg,rgba(172,220,220,1)_0%,rgba(255,227,222,1)_80%] w-full h-screen fixed left-0 top-0 -z-1"
        suppressHydrationWarning={true}
      >
        <Image
          src="/images/global/bg_slogan_white.svg"
          width={931}
          height={375}
          className="max-w-[70%] lg:max-w-[60%] xl:max-w-[50%] absolute left-1/2 top-[16%] transform-[translate(-50%,0)]"
          alt=""
          loading="lazy"
        />
      </div> 
      <div className={clsx("min-h-screen mt-34 z-10", className)}>
          {children}  
      </div>
    </>    
  )
}