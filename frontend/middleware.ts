// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const { pathname, searchParams } = req.nextUrl;
    const res = NextResponse.next();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const token = await getToken({ req });
    if (["/login", "/signup"].includes(pathname) && token) {
        const url = new URL(callbackUrl, req.url);
        return NextResponse.redirect(url);
    }

    if (!["/login", "/signup"].includes(pathname) && !token) {
        const url = new URL(`/login`, req.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
    }

    return res;
}

export const config = {
    matcher: ["/login", "/dashboard/:path*", "/signup", "/profile", "/admin/:path*"],
};
