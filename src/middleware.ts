import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Redirect /register and /ticket to home page
    if (pathname === "/register" || pathname === "/ticket") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect /devfest-ticket to code of conduct
    if (pathname === "/devfest-ticket") {
        return NextResponse.redirect(new URL("/code-of-conduct", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/register", "/ticket", "/me", "/devfest-ticket"],
};
