import { NextResponse } from "next/server";
import * as admin from "firebase-admin";
import ticketsData from "@/tickets.json";

// No-auth endpoint: browser -> Next.js server -> Firebase.
// Same merge logic as main branch ticket page, but done server-side so the
// D4 "Grab your Tickets" section needs no sign-in and no client Firebase keys.
function getDb() {
    if (admin.apps.length) return admin.firestore();
    try {
        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
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

const defaultColors = ["blue", "green", "red", "yellow"];

export async function GET() {
    try {
        const db = getDb();
        if (!db) throw new Error("Firebase not configured");

        const snap = await db.collection("devfest-tickets").get();
        if (snap.empty) throw new Error("No tickets in Firebase");

        // Normalize Firebase docs to the same backend shape main uses
        const backendTickets = snap.docs.map((doc) => {
            const d = doc.data();
            const priceInPaise =
                d.priceInPaise ??
                (d.price != null ? Math.round(Number(d.price) * 100) : null);
            return {
                id: d.id ?? doc.id,
                name: d.name || d.title || doc.id,
                priceInPaise,
                description: d.description || null,
                available: d.available ?? d.isActive ?? true,
                slug: d.slug || doc.id,
                // Purchase link comes from Firebase
                url: d.url || d.purchaseUrl || d.link || null,
                // Event year, if the doc carries it
                year: d.year ?? null,
                // Perks list, if the doc carries its own
                features: Array.isArray(d.features) ? d.features : null,
            };
        });

        // Year gate: only docs from the current year participate.
        // Older docs (or docs with no/mismatched year) are treated as old
        // and excluded — with none left, the client keeps its coming-soon defaults.
        const currentYear = new Date().getFullYear();
        const currentTickets = backendTickets.filter(
            (t) => t.year === currentYear
        );
        if (currentTickets.length === 0) {
            return NextResponse.json({ tickets: [] }, { status: 200 });
        }

        // Merge with local display data — same as main branch (match by slug)
        const mergedTickets = currentTickets.map((backendTicket, index) => {
            const localTicket = ticketsData.tickets.find(
                (lt) => lt.slug === backendTicket.slug
            );
            return {
                ...backendTicket,
                title: localTicket?.title || backendTicket.name,
                features: localTicket?.features ||
                    backendTicket.features || [
                        "Entry to DevFest",
                        "Full-access to conference",
                        "Breakfast & Lunch",
                        "Hi-Tea",
                        "Keynotes, Panels",
                    ],
                price:
                    backendTicket.priceInPaise != null
                        ? backendTicket.priceInPaise / 100
                        : (localTicket?.price ?? null),
                color:
                    localTicket?.color ||
                    defaultColors[index % defaultColors.length],
                description:
                    backendTicket.description ||
                    localTicket?.description ||
                    "Join us for an amazing DevFest experience!",
            };
        });

        // Available first (cheapest first), then the rest — same ordering as before
        const available = mergedTickets
            .filter((t) => t.available)
            .sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        const unavailable = mergedTickets
            .filter((t) => !t.available)
            .sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

        return NextResponse.json(
            { tickets: [...available, ...unavailable] },
            { status: 200 }
        );
    } catch (error) {
        // Client falls back to the default 3 coming-soon cards on any failure
        return NextResponse.json(
            { error: "Failed to load tickets" },
            { status: 500 }
        );
    }
}
