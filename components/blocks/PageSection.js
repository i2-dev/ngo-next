import React from 'react'
import clsx from 'clsx'
import { FadeUp } from '../SimpleAnimatedElement'

export default function PageSection({children, className, delay = 0}) {
  return (    
    <section className={clsx("py-[100px]", className)}>
      <FadeUp delay={delay} duration={800}>
        <div className="xl:container xl:max-w-[1280px] xl:mx-auto px-5">
          {children}
        </div>
      </FadeUp>
    </section>      
  )
}



