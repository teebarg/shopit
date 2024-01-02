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

    if (pathname === "/logout") {
        const url = new URL("/login", req.url);
        // url.searchParams.set("callbackUrl", callbackUrl);
        const logoutRes = NextResponse.redirect(url);
        logoutRes.cookies.set({
            name: "next-auth.session-token",
            value: "",
            path: "/",
            maxAge: -1,
        });
        return logoutRes;
    }

    return res;
}

export const config = {
    matcher: ["/login", "/logout", "/dashboard/:path*", "/signup", "/profile", "/admin/:path*"],
};
