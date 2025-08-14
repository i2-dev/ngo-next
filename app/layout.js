import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

export const metadata = {
  title: "i2ngo - NGO Digital Services",
  description:
    "Professional digital transformation solutions for non-profit organizations. i2 has years of experience providing digital services to Hong Kong NGOs.",
};

export default function RootLayout({ children }) {
  return (
    <html >
      <body className="flex flex-col min-h-screen" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
