import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

// No-auth endpoint: browser -> Next.js server -> Firebase, the same way
// /api/tickets/view works, so the Speakers section needs no sign-in and no
// client Firebase keys.
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
        console.error("speakers/view: Firebase Admin init failed:", error);
        return null;
    }
}

const COLLECTION = "speakers2026";

// The section only knows Day 1 and Day 2; anything else gets no day chip.
const dayOf = (raw) => {
    const n = Number(raw);
    return n === 1 || n === 2 ? n : null;
};

const text = (v) => (typeof v === "string" ? v.trim() : "");

export async function GET() {
    try {
        const db = getDb();
        if (!db) throw new Error("Firebase not configured");

        const snap = await db.collection(COLLECTION).get();

        // `isHidden` takes a speaker off the site without deleting their doc.
        // Filtered here rather than with a `where` clause so a doc without the
        // field at all still shows; only an explicit `true` hides.
        const speakers = snap.docs
            .map((doc) => ({ id: doc.id, d: doc.data() }))
            .filter(({ d }) => d.isHidden !== true && text(d.name))
            .map(({ id, d }) => ({
                id,
                order: Number.isFinite(Number(d.order)) ? Number(d.order) : Infinity,
                name: text(d.name),
                company: text(d.company),
                position: text(d.position),
                talk: text(d.talk),
                day: dayOf(d.day),
                image: text(d.image) || null,
                socialLinks: {
                    linkedin: text(d.socialLinks?.linkedin),
                    twitter: text(d.socialLinks?.twitter),
                    instagram: text(d.socialLinks?.instagram),
                },
            }))
            // By `order`; docs without one go last, alphabetically.
            .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
            .map(({ order, ...s }) => s);

        // Cached at the CDN for a minute, so a busy homepage doesn't cost a
        // Firestore read per visitor; an edit in the console shows up within
        // about a minute.
        return NextResponse.json(
            { speakers },
            {
                status: 200,
                headers: {
                    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=60",
                },
            }
        );
    } catch (error) {
        console.error("speakers/view:", error);
        return NextResponse.json(
            { error: "Failed to load speakers" },
            { status: 500 }
        );
    }
}
