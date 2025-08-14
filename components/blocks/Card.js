

import StrapiImage from '@/components/StrapiImage';
import Link from 'next/link';
import CtaButton from '../CtaButton';
import SharedButton from './Button';


export default function Card({ Title, Content, icon, Button }) {
  return (
    <div className=" rounded-[30px] bg-linear-[to_bottom,#fff_25%,#c5ead0_100%] shadow-[0_10px_50px_rgba(0,0,0,0.1)] p-[80px_40px_50px] text-center relative">        
      {/* Icon */}
      {icon && (            
        <StrapiImage
          image={icon}
          alt={icon.alternativeText || "Card Icon"}
          className="absolute left-1/2 top-0 -translate-1/2"
          width={icon.width}
          height={icon.height}
        />            
      )}
      
      {/* Title */}
      {Title && (        
        <h2 className='text-[#3e3978] text-[46px]/[1.2] font-medium mb-5 max-lg:text-4xl max-md:text-3xl'>
          {Title}
        </h2>
      )}
      
      {/* Content */}
      {Content && (
        <div 
          className="text-[20px]/[1.8] mb-[30px]"
          dangerouslySetInnerHTML={{ __html: Content }}
        />
      )}
      
      {/* Button */}
      {console.log('card------------------',Button)}
      {Button && (
        <SharedButton {...Button} className={'!inline-block'} />
      )}
    </div>
  );
}