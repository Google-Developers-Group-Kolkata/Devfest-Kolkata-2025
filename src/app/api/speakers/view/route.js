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

// Sessionize-style export, so the keys are the form's column headers
// ("Company Name", "X (Twitter)", ...). Only the handful the Speakers section
// displays are read; the rest of each doc (Email, Bio, Blog, ...) never leaves
// the server, so nothing private reaches the public endpoint.
const COLLECTION = "speaker";

// The section only knows Day 1 and Day 2; anything else gets no day chip.
const dayOf = (raw) => {
    const n = Number(raw);
    return n === 1 || n === 2 ? n : null;
};

const text = (v) => (typeof v === "string" ? v.trim() : "");

// A hosted photo or a path under /public; anything else is dropped so the
// section falls back to the speaker's initials.
const imageOf = (v) => {
    const url = text(v);
    return /^(https?:\/\/|\/)/.test(url) ? url : null;
};

// "Sridatree Mukherjee" -> "sridatree-mukherjee"
const slugOf = (s) =>
    s
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

// Photos uploaded to Firebase Storage stand in for a speaker who has no
// "Profile Picture". The project's default bucket unless one is set.
const BUCKET =
    process.env.FIREBASE_STORAGE_BUCKET ||
    `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`;

// Each image in the bucket, keyed by its file name without the extension
// ("sridatree.png" -> "sridatree"), mapped to its permanent download URL — the
// one the Firebase console's "copy download URL" gives. A failure here only
// costs the fallback photos, never the speaker list.
async function storagePhotos() {
    try {
        const [files] = await admin.storage().bucket(BUCKET).getFiles();
        const photos = new Map();
        for (const f of files) {
            const token = f.metadata.metadata?.firebaseStorageDownloadTokens?.split(",")[0];
            if (!token || !f.metadata.contentType?.startsWith("image/")) continue;
            const base = f.name.split("/").pop().replace(/\.[^.]+$/, "");
            photos.set(
                slugOf(base),
                `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(f.name)}?alt=media&token=${token}`
            );
        }
        return photos;
    } catch (error) {
        console.error("speakers/view: listing Storage photos failed:", error);
        return new Map();
    }
}

export async function GET() {
    try {
        const db = getDb();
        if (!db) throw new Error("Firebase not configured");

        const [snap, photos] = await Promise.all([
            db.collection(COLLECTION).get(),
            storagePhotos(),
        ]);

        // `isHidden` takes a speaker off the site without deleting their doc.
        // Filtered here rather than with a `where` clause so a doc without the
        // field at all still shows; only an explicit `true` hides.
        const docs = snap.docs
            .map((doc) => ({ id: doc.id, d: doc.data() }))
            .filter(({ d }) => d.isHidden !== true && text(d.Owner));

        // A Storage photo is matched by the speaker's full name
        // ("sridatree-mukherjee.png") or by their first name ("sridatree.png"),
        // but the first name only counts when no other speaker shares it, so a
        // photo never lands on the wrong person.
        const firstOf = (name) => slugOf(name.split(/\s+/)[0]);
        const firstNames = {};
        for (const { d } of docs) {
            const first = firstOf(text(d.Owner));
            firstNames[first] = (firstNames[first] ?? 0) + 1;
        }
        const storagePhotoOf = (name) =>
            photos.get(slugOf(name)) ??
            (firstNames[firstOf(name)] === 1 ? photos.get(firstOf(name)) : undefined) ??
            null;

        const speakers = docs
            .map(({ id, d }) => ({
                id,
                order: Number.isFinite(Number(d.order)) ? Number(d.order) : Infinity,
                name: text(d.Owner),
                company: text(d["Company Name"]),
                position: text(d.TagLine),
                talk: text(d.Title),
                day: dayOf(d.day),
                image: imageOf(d["Profile Picture"]) ?? storagePhotoOf(text(d.Owner)),
                socialLinks: {
                    linkedin: text(d.LinkedIn),
                    twitter: text(d["X (Twitter)"]),
                },
            }))
            // By `order`; docs without one go last, alphabetically.
            .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
            .map(({ order, ...s }) => s);

        // Cached at the CDN for a minute, so a busy homepage doesn't cost a
        // Firestore read and a Storage listing per visitor; an edit in the
        // console, or a new upload, shows up within about a minute.
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
