import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

// No-auth endpoint: browser -> Next.js server -> Firebase, exactly like
// /api/tickets/view. The social pass generator needs a name and a pass,
// nothing else, so the lookup happens here and only those fields come back.
function getDb() {
    if (admin.apps.length) return admin.firestore();
    try {
        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, "\n"),
        };

        if (
            !serviceAccount.projectId ||
            !serviceAccount.clientEmail ||
            !serviceAccount.privateKey
        ) {
            return null;
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        return admin.firestore();
    } catch (error) {
        console.error("attendee: Firebase Admin init failed:", error);
        return null;
    }
}

// Registrations land in this collection through the Konfhub webhook.
const COLLECTION = "attendees2026";

// Test purchases the team ran against a tier called "demo(not actual
// ticket)". They are real docs with real payment ids, so they would otherwise
// resolve like anyone else's.
const DEMO_TICKET = /demo\s*\(/i;

// Passes are grouped by the day they admit to. Everything on the site is
// ticketed for Day 2; the workshop is the one tier sold against Day 1, so it
// is read off the tier name rather than guessed. An unknown tier falls back
// to Day 2 rather than failing the lookup.
const DAY_BY_TIER = [
    { test: /workshop/i, day: 1, date: "21st November, 2026" },
];

const DEFAULT_DAY = { day: 2, date: "22nd November, 2026" };

// Same string the ticket cards print.
const EVENT_VENUE = "The Westin Kolkata, Rajarhat";

// "DevFest Kolkata'26 Regular Ticket Phase 2" -> "Regular Ticket Phase 2".
const stripBrand = (name) =>
    String(name ?? "")
        .replace(/^\s*devfest\s*kolkata\s*['']26\s*/i, "")
        .replace(/^\s*kolkata\s*['']26\s*/i, "")
        .trim();

const dayFor = (ticketName) => {
    const hit = DAY_BY_TIER.find(({ test }) =>
        test.test(String(ticketName ?? ""))
    );
    return hit ? { day: hit.day, date: hit.date } : DEFAULT_DAY;
};

// Free text from the registration form, trimmed and word-boundary capped.
const clip = (value, max) => {
    const text = String(value ?? "").trim();
    if (text.length <= max) return text;
    const cut = text.slice(0, max);
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim();
};

// Only safe display fields come back out — phone, email, LinkedIn, payment
// ids, invoice URLs, dietary preferences never leave this function.
const toPass = (doc) => {
    const att = doc.data()?.data?.["Attendee Details"];
    if (!att) return null;

    const ticketName = att["Ticket Details"]?.["Ticket Name"] ?? "";
    if (DEMO_TICKET.test(ticketName)) return null;

    const name = String(att.Name ?? att["Buyer Name"] ?? "").trim();
    if (!name) return null;

    return {
        name,
        ticketName: stripBrand(ticketName) || "Ticket",
        bookingId: String(att["Booking Id"] ?? ""),
        designation: clip(att["Your Designation"], 40),
        organisation: clip(att.Organisation, 48),
        venue: EVENT_VENUE,
        ...dayFor(ticketName),
    };
};

// Normalise a phone number to digits-only for comparison so that
// "+91 98309 89843", "9830989843", "+919830989843" all match.
const normalisePhone = (raw) => String(raw ?? "").replace(/\D/g, "");

// Determine what kind of identifier the user typed.
// Priority: email → phone (all digits after stripping) → booking id (hex ≤ 12 chars)
const classify = (raw) => {
    const v = raw.trim();
    if (/\S+@\S+\.\S+/.test(v)) return "email";
    // Phone: starts with optional +, then 7–15 digits
    if (/^\+?\d{7,15}$/.test(v.replace(/[\s\-().]/g, ""))) return "phone";
    // Booking id: 6–12 lowercase hex characters (Konfhub format is 8 hex)
    if (/^[0-9a-f]{6,12}$/i.test(v)) return "bookingId";
    return "unknown";
};

export async function GET(request) {
    try {
        const raw = (request.nextUrl.searchParams.get("q") ?? "").trim();
        if (!raw) {
            return NextResponse.json(
                { error: "Enter your email, phone number, or booking ID" },
                { status: 400 }
            );
        }

        const db = getDb();
        if (!db) throw new Error("Firebase not configured");

        const field = (key) => `data.Attendee Details.${key}`;

        // Returns the newest valid doc matching a given Firestore field/value,
        // or null when nothing matches.
        const queryField = async (key, value) => {
            const snap = await db
                .collection(COLLECTION)
                .where(field(key), "==", value)
                .limit(5)
                .get();
            if (snap.empty) return null;
            return snap.docs
                .map((doc) => ({ doc, at: doc.data().createdAt?.toMillis?.() ?? 0 }))
                .sort((a, b) => b.at - a.at)
                .map(({ doc }) => doc)
                .find((doc) => toPass(doc)) ?? null;
        };

        const kind = classify(raw);
        let match = null;

        if (kind === "email") {
            // Emails are stored lowercase; normalise before querying.
            const email = raw.toLowerCase();
            match =
                (await queryField("Email Address", email)) ??
                (await queryField("Buyer Email", email));

        } else if (kind === "phone") {
            // Phone numbers in Firestore are in E.164 (+91XXXXXXXXXX).
            // We try the raw value first, then the +91 prefixed version,
            // then the 10-digit local version so any common input works.
            const digits = normalisePhone(raw);
            const candidates = new Set([
                raw.trim(),                          // exactly as typed
                `+${digits}`,                        // e.g. +919830989843
                digits.length === 10 ? `+91${digits}` : null, // 10-digit Indian
                digits,                              // bare digits (unlikely in DB)
            ].filter(Boolean));

            for (const candidate of candidates) {
                match = await queryField("Phone Number", candidate);
                if (match) break;
            }

        } else if (kind === "bookingId") {
            // Booking IDs are stored lowercase hex.
            match = await queryField("Booking Id", raw.toLowerCase());

        } else {
            return NextResponse.json(
                { error: "Enter a valid email, phone number, or booking ID" },
                { status: 400 }
            );
        }

        const pass = match ? toPass(match) : null;

        if (!pass) {
            return NextResponse.json(
                { error: "not_found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ attendee: pass }, { status: 200 });
    } catch (error) {
        console.error("attendee: lookup failed:", error);
        return NextResponse.json(
            { error: "Failed to look up that entry" },
            { status: 500 }
        );
    }
}
