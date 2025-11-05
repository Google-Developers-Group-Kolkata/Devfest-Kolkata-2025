import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
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
            throw new Error("Missing required Firebase environment variables");
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (error) {
        console.error("Firebase Admin initialization failed:", error);
    }
}

const db = admin.firestore();

// Ensure collection exists (creates a sentinel doc only if empty)
async function ensureCollectionExists(collectionName) {
    const snap = await db.collection(collectionName).limit(1).get();
    if (snap.empty) {
        await db.collection(collectionName).doc("_init").set({
            type: "init",
            initializedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    }
}

export async function POST(request) {
    try {
        const ticketData = await request.json();

        // Make sure the collection exists
        await ensureCollectionExists("attendees");

        // Store complete ticket data in Firestore (all fields dynamically)
        const docRef = await db.collection("attendees").add({
            id: ticketData.Id,
            module: ticketData.Module,
            eventType: ticketData["Event Type"],
            eventAt: ticketData["Event At"],
            data: ticketData.Data,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Cleanup sentinel if it was created (no-op if it doesn't exist)
        await db.collection("attendees").doc("_init").delete();

        return NextResponse.json(
            {
                success: true,
                message: "Ticket data stored successfully",
                firestoreId: docRef.id
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message || "Failed to process webhook" },
            { status: 500 }
        );
    }
}
