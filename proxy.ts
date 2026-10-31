import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, locales } from "./lib/i18n";

/** Picks the best locale from the Accept-Language header. */
function negotiate(request: NextRequest): string {
  const header = request.headers.get("accept-language") ?? "";
  const preferred = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q)
    .map(({ tag }) => tag.split("-")[0]);

  return preferred.find(hasLocale) ?? defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, first, second] = pathname.split("/");
  if (first && (locales as readonly string[]).includes(first)) {
    // The bare locale path shows the street design unless the visitor chose version 2 (cookie set by DesignSwitch).
    if (!second && request.cookies.get("design")?.value === "v2") {
      const url = request.nextUrl.clone();
      url.pathname = `/${first}/v2`;
      return NextResponse.redirect(url, 307);
    }
    return;
  }

  const locale = negotiate(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except Next internals, API routes and files with an extension.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
