import React from 'react'
import clsx from 'clsx'

export default function PageContainer({children, className}) {
  return (
    <div className={clsx("min-h-screen bg-[#e2f6f6]", className)}>
        {children}  
    </div>
  )
}