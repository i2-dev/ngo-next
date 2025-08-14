import React from 'react'
import clsx from 'clsx'

export default function PageSection({children, className}) {
  return (    
    <section className={clsx("py-[100px]", className)}>
      <div className="xl:container xl:max-w-[1280px] xl:mx-auto px-5">
        {children}
      </div>
    </section>      
  )
}



