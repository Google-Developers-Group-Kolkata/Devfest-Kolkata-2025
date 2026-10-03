import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Rate limiter for /api/attendee ────────────────────────────────────────
//
// Runs on Vercel's Edge runtime — zero cost, zero external services.
// The counter lives in a short-lived signed cookie so nothing needs to be
// stored server-side. A HMAC-SHA256 signature (using the Firebase client
// email as the signing key — no new env var needed) prevents the client
// from tampering with the count.
//
// Limits: 5 attempts per IP per 10-minute window.
// On the 6th attempt the function is never invoked — 429 is returned from
// the edge before Vercel even starts the serverless function, so it costs
// nothing beyond the middleware invocation itself.

const COOKIE   = "_rla";       // rate-limit attempts
const MAX      = 3;            // max attempts per window
const WINDOW   = 10 * 60;      // window size in seconds (10 min)

// Sign text with HMAC-SHA256. The Web Crypto API is available in the Edge
// runtime without any import.
async function hmac(secret: string, text: string): Promise<string> {
    const enc  = new TextEncoder();
    const key  = await crypto.subtle.importKey(
        "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const sig  = await crypto.subtle.sign("HMAC", key, enc.encode(text));
    // base64url-encode without padding so it is safe in a cookie value
    return btoa(String.fromCharCode(...new Uint8Array(sig)))
        .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Cookie payload: "count:windowStart:signature"
// windowStart buckets time into 10-minute slots so the window resets
// automatically — no cleanup needed.
async function readCookie(
    raw: string | undefined,
    ip: string,
    secret: string
): Promise<{ count: number; windowStart: number } | null> {
    if (!raw) return null;
    const parts = raw.split(":");
    if (parts.length !== 3) return null;
    const [countStr, windowStr, sig] = parts;
    const count       = parseInt(countStr, 10);
    const windowStart = parseInt(windowStr, 10);
    if (isNaN(count) || isNaN(windowStart)) return null;
    // Verify signature — prevents the client from resetting their own count
    const expected = await hmac(secret, `${ip}:${count}:${windowStart}`);
    if (expected !== sig) return null;
    return { count, windowStart };
}

async function makeCookie(
    ip: string,
    count: number,
    windowStart: number,
    secret: string
): Promise<string> {
    const sig = await hmac(secret, `${ip}:${count}:${windowStart}`);
    return `${count}:${windowStart}:${sig}`;
}

async function rateLimit(request: NextRequest): Promise<NextResponse | null> {
    // Signing key — reuse an existing env var so no new secret is needed.
    // FIREBASE_CLIENT_EMAIL is always set (the app won't start without it)
    // and it is long enough to be a usable HMAC key.
    const secret = process.env.FIREBASE_CLIENT_EMAIL ?? "devfest-rate-limit-fallback";

    // Best-effort IP — Vercel sets x-forwarded-for; fall back to a constant
    // so the limiter still works in local dev (all local traffic shares the
    // same bucket, which is fine for testing).
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        "127.0.0.1";

    const now         = Math.floor(Date.now() / 1000);
    const thisWindow  = Math.floor(now / WINDOW) * WINDOW; // current 10-min bucket

    const raw    = request.cookies.get(COOKIE)?.value;
    const stored = await readCookie(raw, ip, secret);

    // If the stored window is in the past, treat it as a fresh start.
    const sameWindow = stored?.windowStart === thisWindow;
    const count      = sameWindow ? stored!.count : 0;

    if (count >= MAX) {
        // Remaining seconds in this window
        const retryAfter = (thisWindow + WINDOW) - now;
        const res = new NextResponse(
            JSON.stringify({
                error: `Too many attempts — please wait ${Math.ceil(retryAfter / 60)} minute(s) and try again.`,
            }),
            {
                status: 429,
                headers: {
                    "Content-Type": "application/json",
                    "Retry-After": String(retryAfter),
                },
            }
        );
        return res;
    }

    // Allow the request through, but write back the incremented counter.
    const newCount   = count + 1;
    const cookieVal  = await makeCookie(ip, newCount, thisWindow, secret);

    // Return null to signal "allowed" — the caller will call NextResponse.next()
    // and attach the cookie there.
    const allowed = NextResponse.next();
    allowed.cookies.set(COOKIE, cookieVal, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: WINDOW,
        path: "/api/attendee",
    });
    return allowed;
}

// ─── Main middleware ────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Rate-limit the social pass lookup before the serverless function runs.
    if (pathname === "/api/attendee") {
        // rateLimit always returns a NextResponse:
        // - 429 when the limit is exceeded
        // - NextResponse.next() + updated cookie when the request is allowed
        return await rateLimit(request);
    }

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
    matcher: ["/api/attendee", "/register", "/ticket", "/me", "/devfest-ticket"],
};
