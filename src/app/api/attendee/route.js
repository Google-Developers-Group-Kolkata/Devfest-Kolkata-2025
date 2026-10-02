import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

// No-auth endpoint: browser -> Next.js server -> Firebase, exactly like
// /api/tickets/view. The badge generator needs a name and a pass, nothing
// else, so the lookup happens here and only those two come back out.
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

// Same string the ticket cards print — the venue is not per-attendee data,
// it is the one line every pass shares.
const EVENT_VENUE = "The Westin Kolkata, Rajarhat";

// "DevFest Kolkata'26 Regular Ticket Phase 2" -> "Regular Ticket Phase 2".
// The prefix is branding the badge prints separately, so leaving it in
// would have the event name twice.
const stripBrand = (name) =>
    String(name ?? "")
        .replace(/^\s*devfest\s*kolkata\s*['’]26\s*/i, "")
        .replace(/^\s*kolkata\s*['’]26\s*/i, "")
        .trim();

// Only the two display fields come back out: spreading the entry itself
// would carry its matcher along with it.
const dayFor = (ticketName) => {
    const hit = DAY_BY_TIER.find(({ test }) =>
        test.test(String(ticketName ?? ""))
    );
    return hit ? { day: hit.day, date: hit.date } : DEFAULT_DAY;
};

// Free text from the registration form, trimmed and capped for the card's
// single line. The cap falls back to a hard slice only when the whole value
// is one word, since there is no safe place to stop otherwise.
const clip = (value, max) => {
    const text = String(value ?? "").trim();
    if (text.length <= max) return text;
    const cut = text.slice(0, max);
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim();
};

// Every attendee detail the badge is allowed to show. Everything else on
// the doc — phone, email, linkedin, payment ids, invoice urls, dietary
// preferences — stops at this function.
const toBadge = (doc) => {
    // The webhook writes the payload one level down, under `data`.
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
        // What the attendee told the registration form. Printed as a role
        // line under the name, so the card reads as that person's pass
        // rather than any holder of the same tier. Capped, because an
        // organisation name is free text and the card has one line for it,
        // and cut on a word so the cap never lands mid-syllable.
        designation: clip(att["Your Designation"], 40),
        organisation: clip(att.Organisation, 48),
        venue: EVENT_VENUE,
        ...dayFor(ticketName),
    };
};

export async function GET(request) {
    try {
        const email = (request.nextUrl.searchParams.get("email") ?? "")
            .trim()
            .toLowerCase();
        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const db = getDb();
        if (!db) throw new Error("Firebase not configured");

        // The path is a field name with spaces in it, which Firestore accepts
        // in dot notation as long as there are no dots in it.
        const field = (key) => `data.Attendee Details.${key}`;

        const resolve = async (key) => {
            const snap = await db
                .collection(COLLECTION)
                .where(field(key), "==", email)
                .limit(5)
                .get();
            if (snap.empty) return null;
            // Someone who booked twice leaves two docs behind; the newest is
            // the booking that stands. `createdAt` is a timestamp on every
            // doc, so it orders even the ones written before a field existed.
            return snap.docs
                .map((doc) => ({ doc, at: doc.data().createdAt?.toMillis?.() ?? 0 }))
                .sort((a, b) => b.at - a.at)
                .map(({ doc }) => doc)
                .find((doc) => toBadge(doc)) ?? null;
        };

        // A pass can be bought for someone else, so the buyer's address is
        // tried when the attendee's own one comes back empty.
        const match = (await resolve("Email Address")) ?? (await resolve("Buyer Email"));
        const badge = match ? toBadge(match) : null;

        if (!badge) {
            return NextResponse.json(
                { error: "not_found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ attendee: badge }, { status: 200 });
    } catch (error) {
        console.error("attendee: lookup failed:", error);
        return NextResponse.json(
            { error: "Failed to look up that email" },
            { status: 500 }
        );
    }
}
