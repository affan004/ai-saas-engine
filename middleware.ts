import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname (e.g., 'verce-platforms.com' or 'platform.localhost:3000')
  const hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // Get the search params (e.g. ?query=abc)
  const searchParams = req.nextUrl.searchParams.toString();
  // Get the path (e.g. /about)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // Rewrites for "app.yoursite.com" (The Dashboard / Editor)
  if (hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    return NextResponse.rewrite(
      new URL(`/app${path === "/" ? "" : path}`, req.url),
    );
  }

  // Rewrites for "yoursite.com" (The Marketing Homepage)
  if (
    hostname === "localhost:3000" ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.rewrite(
      new URL(`/home${path === "/" ? "" : path}`, req.url),
    );
  }

  // Rewrites for "tenant.yoursite.com" or "custom-domain.com"
  // This rewrites to the dynamic route: app/[domain]/page.tsx
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}