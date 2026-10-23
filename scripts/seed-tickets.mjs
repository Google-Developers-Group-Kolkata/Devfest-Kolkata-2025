// Upserts the DevFest Kolkata 2026 passes into Firestore.
//
//   node scripts/seed-tickets.mjs          # write the passes below
//   node scripts/seed-tickets.mjs --dry    # print what would be written
//
// Credentials come from the same FIREBASE_* variables in .env that the site's
// /api/tickets/view route uses. Each pass is written to a fixed document id, so
// running this twice updates the same four docs instead of duplicating them.
//
// !! Set the prices before the first real run: a null price prints as
// "Rs. xxx" on the card.

import { readFileSync } from "node:fs";
import admin from "firebase-admin";

const COLLECTION = "devfest2026-tickets";

const DAY_DATES = { 1: "21st November, 2026", 2: "22nd November, 2026" };

// day 1 = workshops (21 Nov), day 2 = the conference (22 Nov).
const TICKETS = [
    // {
    //     id: "workshop-batch-1",
    //     title: "Devfest Workshop Batch 1",
    //     url: "https://konfhub.com/checkout/devfest-kolkata-2026?ticketId=120102%7C1%3B",
    //     day: 1,
    //     color: "blue",
    //     price: 299,
    // },
    // {
    //     id: "workshop-batch-2",
    //     title: "Devfest Workshop Batch 2",
    //     url: "https://konfhub.com/checkout/devfest-kolkata-2026?ticketId=120101%7C1%3B",
    //     day: 1,
    //     color: "green",
    //     price: 299,
    // },
    // {
    //     id: "early-bird",
    //     title: "Early Bird",
    //     url: "https://konfhub.com/checkout/devfest-kolkata-2026?ticketId=120100%7C1%3B",
    //     day: 2,
    //     color: "yellow",
    //     price: 449,
    // },
    // {
    //     id: "exclusive",
    //     title: "Exclusive",
    //     url: "https://konfhub.com/checkout/devfest-kolkata-2026?ticketId=120099%7C1%3B",
    //     day: 2,
    //     color: "red",
    //     price: 1749,
    // },
    {
        id: "regular-ticket-phase-1",
        title: "Regular Ticket Phase 1",
        url: "https://konfhub.com/checkout/devfest-kolkata-2026?ticketId=120097",
        day: 2,
        color: "blue",
        price: 699,
    },
    {
        id: "regular-ticket-phase-2",
        title: "Regular Ticket Phase 2",
        url: "https://konfhub.com/checkout/devfest-kolkata-2026?ticketId=120096",
        day: 2,
        color: "green",
        price: 899,
    },
];

// .env is read directly rather than through a loader: this script is the only
// thing that needs it and it runs outside Next.js.
const readEnv = () =>
    Object.fromEntries(
        readFileSync(new URL("../.env", import.meta.url), "utf8")
            .split("\n")
            .filter((line) => line.includes("=") && !line.trim().startsWith("#"))
            .map((line) => {
                const at = line.indexOf("=");
                return [
                    line.slice(0, at).trim(),
                    line
                        .slice(at + 1)
                        .trim()
                        .replace(/^["']|["']$/g, ""),
                ];
            })
    );

// The doc shape the site reads: title, price, url, color, day, date, venue and
// the three flags. `isCommingSoon` keeps the spelling the existing docs use.
const docFor = (t) => ({
    title: t.title,
    price: t.price,
    url: t.url,
    color: t.color,
    day: t.day,
    date: DAY_DATES[t.day],
    isActive: false,
    isCommingSoon: false,
    isHidden: true,
});

const main = async () => {
    const dry = process.argv.includes("--dry");
    const env = { ...readEnv(), ...process.env };

    const credential = {
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    };
    if (!credential.projectId || !credential.clientEmail || !credential.privateKey) {
        throw new Error("FIREBASE_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY missing");
    }

    if (dry) {
        for (const t of TICKETS) {
            console.log(`${COLLECTION}/${t.id}`, JSON.stringify(docFor(t), null, 2));
        }
        console.log(`\n${TICKETS.length} docs would be written to ${credential.projectId}.`);
        return;
    }

    admin.initializeApp({ credential: admin.credential.cert(credential) });
    const db = admin.firestore();

    // merge: a doc edited by hand in the console keeps any field this script
    // does not set.
    const batch = db.batch();
    for (const t of TICKETS) {
        batch.set(db.collection(COLLECTION).doc(t.id), docFor(t), { merge: true });
    }
    await batch.commit();

    console.log(`Wrote ${TICKETS.length} passes to ${COLLECTION} (${credential.projectId}).`);
};

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
