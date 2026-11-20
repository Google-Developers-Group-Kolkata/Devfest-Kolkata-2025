import * as admin from "firebase-admin";

// Firestore through the Admin SDK, initialised once per server instance.
// Returns null when the FIREBASE_* variables are missing so a route can answer
// with a clean error instead of crashing at import time.
export function getDb() {
    if (admin.apps.length) return admin.firestore();
    try {
        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // .env stores the key with literal "\n"; real newlines pass through.
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        };
        if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
            return null;
        }
        admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
        return admin.firestore();
    } catch (error) {
        console.error("adminDb: Firebase Admin init failed:", error);
        return null;
    }
}

export { admin };
