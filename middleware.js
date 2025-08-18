import { NextResponse } from "next/server";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  isValidLocale,
} from "./utils/locales";

export function middleware(request) {
  const pathname = request.nextUrl.pathname;



  //check if pathname has locale
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    //if no locale, redirect to default locale (en)
    const locale = DEFAULT_LOCALE;
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  //check if locale is valid
  const locale = pathname.split("/")[1];
  if (!isValidLocale(locale)) {
    return NextResponse.redirect(
      new URL(
        `/${DEFAULT_LOCALE}${pathname.substring(locale.length + 1)}`,
        request.url
      )
    );
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.js).*)"],
};
