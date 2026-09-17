import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

// No-auth endpoint: browser -> Next.js server -> Firebase.
// Done server-side so the D4 "Grab your Tickets" section needs no sign-in and
// no client Firebase keys.
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
        console.error("tickets/view: Firebase Admin init failed:", error);
        return null;
    }
}

// The four ticket artworks in /public/ticket. A doc whose `color` is missing or
// unknown falls back to one of these by position, so cards stay distinct.
const COLORS = ["red", "blue", "green", "yellow"];

const toNumber = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
};

// Which day of the festival a pass admits to. A doc can say so outright with a
// `day` of 1 or 2; failing that the day is read off the `date` string it
// already carries, so passes written before the two-day split still land in
// the right section. Anything else comes back as null and the section groups
// it separately rather than dropping it.
const DAY_DATE_MARKS = { 1: /\b21(st)?\b/i, 2: /\b22(nd)?\b/i };

const dayOf = (d) => {
    const n = Number(d.day);
    if (n === 1 || n === 2) return n;
    const date = String(d.date ?? "");
    if (!date) return null;
    for (const [day, mark] of Object.entries(DAY_DATE_MARKS)) {
        if (mark.test(date)) return Number(day);
    }
    return null;
};

export async function GET() {
    try {
        const db = getDb();
        if (!db) throw new Error("Firebase not configured");

        const snap = await db.collection("devfest2026-tickets").get();
        if (snap.empty) throw new Error("No tickets in Firebase");

        // `isHidden` takes a ticket off the site without deleting its doc.
        // Filtered here rather than with a `where` clause on purpose: a
        // Firestore equality query skips docs that have no `isHidden` field at
        // all, which would drop every ticket written before the flag existed.
        // Only an explicit `true` hides a ticket.
        const visible = snap.docs.filter((doc) => doc.data().isHidden !== true);

        // Firestore doc shape: color, isActive, isCommingSoon, isHidden, day,
        // price, title, url, and optionally venue and date, which override the
        // event-wide strings the card otherwise prints.
        const tickets = visible.map((doc, index) => {
            const d = doc.data();
            const color = String(d.color ?? "").toLowerCase();
            return {
                id: doc.id,
                title: d.title ?? "Ticket",
                // Stored as a string ("299") — kept verbatim for display.
                price: d.price ?? null,
                url: d.url ?? null,
                venue: d.venue ?? null,
                date: d.date ?? null,
                day: dayOf(d),
                isActive: d.isActive ?? false,
                // Note the field's spelling in Firestore; the corrected one is
                // accepted too, in case the doc is ever fixed up.
                isComingSoon: d.isCommingSoon ?? d.isComingSoon ?? false,
                color: COLORS.includes(color)
                    ? color
                    : COLORS[index % COLORS.length],
            };
        });

        // Buyable first (cheapest first), then the rest — same ordering the
        // old ticket page used.
        const byPrice = (a, b) => toNumber(a.price) - toNumber(b.price);
        const onSale = tickets
            .filter((t) => t.isActive && !t.isComingSoon)
            .sort(byPrice);
        const rest = tickets
            .filter((t) => !(t.isActive && !t.isComingSoon))
            .sort(byPrice);

        return NextResponse.json(
            { tickets: [...onSale, ...rest] },
            { status: 200 }
        );
    } catch (error) {
        // The section renders only what Firebase returns, so a failure here
        // leaves it with no cards rather than a placeholder.
        return NextResponse.json(
            { error: "Failed to load tickets" },
            { status: 500 }
        );
    }
}
