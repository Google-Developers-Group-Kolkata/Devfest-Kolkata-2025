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

export async function POST(request) {
    try {
        const ticketData = await request.json();

        // Store complete ticket data in Firestore (all fields dynamically)
        const docRef = await db.collection("attendees").add({
            id: ticketData.Id,
            module: ticketData.Module,
            eventType: ticketData["Event Type"],
            eventAt: ticketData["Event At"],
            data: ticketData.Data,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

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
