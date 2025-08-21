import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Script from "next/script";

export const metadata = {
  title: "i2ngo - NGO Digital Services",
  description:
    "Professional digital transformation solutions for non-profit organizations. i2 has years of experience providing digital services to Hong Kong NGOs.",
};

export default function RootLayout({ children }) {
  return (
    <html >
      <head>
        <link rel="stylesheet" href="/animations.css" />
      </head>
      <body className="flex flex-col min-h-screen" suppressHydrationWarning={true}>
        {children}
        {/* 全局 JavaScript 文件 - 在所有頁面加載 */}
        <Script 
          src="/globals.js" 
          strategy="afterInteractive"
          id="globals-script"
        />
      </body>
    </html>
  );
}
