// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const res = NextResponse.next();

    const token = await getToken({ req });
    if (pathname.startsWith("/login") && token) {
        const url = new URL(`/`, req.url);
        return NextResponse.redirect(url);
    }

    if (!pathname.startsWith("/login") && !token) {
        const url = new URL(`/login`, req.url);
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
    }

    return res;
}

export const config = {
    matcher: ["/", "/login", "/dashboard/:path*"],
};
