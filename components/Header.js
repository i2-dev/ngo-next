import Image from "next/image";
import Link from "next/link";
import MenuWrapper from "./header/MenuWrapper";
import ClientOnly from "./ClientOnly";
import HeaderScrollEffect from "./header/HeaderScrollEffect";

export default function Header({ locale = 'en', menuData = null }) {
  return (
    <>
      {/* Scroll effect handler - client-side only to prevent hydration mismatch */}
      <ClientOnly>
        <HeaderScrollEffect />
      </ClientOnly>
      
      <header id="header" className="w-full py-6 fixed z-50 transition duration-300 ease-in-out">
        <div className="xl:container xl:max-w-[1280px] xl:mx-auto px-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/i2ngo_logo.png"
              width={245}
              height={106}
              alt="I2NGO Logo"
              priority={true}
              className="logo max-w-[162px] h-auto transition-[all_.3s_cubic-bezier(.2,1,.2,1)]"
            />
          </Link>
          
          {/* Menu and Social Icons */}
          <div className="flex items-center space-x-10">
            <MenuWrapper 
              menuData={menuData} 
              locale={locale} 
              fallbackToApi={!menuData} 
            />
            
            {/* Social Media Icons */}
            <div className="hidden lg:flex items-center space-x-5">
              <Link 
                href="https://www.facebook.com/i2hongkong/" 
                target="_blank" 
                className="hover:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Link>
              <Link 
                href="https://www.youtube.com/channel/UCIs5MfXVvK-D-4CT3_vaAKg" 
                target="_blank" 
                className="hover:text-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
