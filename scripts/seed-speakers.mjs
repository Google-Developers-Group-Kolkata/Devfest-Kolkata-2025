// Upserts the DevFest Kolkata 2026 speakers into Firestore.
//
//   node scripts/seed-speakers.mjs          # write the speakers below
//   node scripts/seed-speakers.mjs --dry    # print what would be written
//
// Credentials come from the same FIREBASE_* variables in .env that the site's
// /api/speakers/view route uses. Each speaker is written to a fixed document id
// (a slug of their name), so running this twice updates the same docs instead
// of duplicating them.
//
// After the first run, Firestore is the source of truth: add or edit speakers
// in the console (or here, then re-run). The site lists them by `order`, and a
// doc with `isHidden: true` is left off without being deleted.

import { readFileSync } from "node:fs";
import admin from "firebase-admin";

const COLLECTION = "speakers2026";

// day 1 = workshops (21 Nov), day 2 = the conference (22 Nov). `image` is a
// path under /public or a full URL.
const SPEAKERS = [
    {
        order: 1,
        name: "Neel Shah",
        company: "StackGen",
        position: "Developer Advocate",
        talk: "Cloud-Native Development with GCP: Build, Deploy and Automate",
        day: 1,
        image: "/speakers/neelShah.png",
        socialLinks: {
            twitter: "",
            linkedin: "https://www.linkedin.com/in/neelcshah",
            instagram: "",
        },
    },
    {
        order: 2,
        name: "Rishi Mondal",
        company: "Obmondo",
        position: "Site Reliability Engineer",
        talk: "Let Your AI Agent Code, Not Compromise: Hands-On Sandboxing with Docker",
        day: 1,
        image: "/speakers/rishi-mondal.png",
        socialLinks: {
            twitter: "",
            linkedin: "https://www.linkedin.com/in/rishi-mondal-5238b2282",
            instagram: "",
        },
    },
    {
        order: 3,
        name: "Belal Khan",
        company: "American Express",
        position: "Experienced Mobile Engineer",
        talk: "Build AI-Powered Android Apps with Gemma and RAG",
        day: 2,
        image: "/speakers/belal-khan.png",
        socialLinks: {
            twitter: "",
            linkedin: "https://www.linkedin.com/in/probelalkhan",
            instagram: "",
        },
    },
    {
        order: 4,
        name: "Parichay Das",
        company: "LTM",
        position: "Solution Lead & Enterprise Architect - AI Solutions",
        talk: "On Device Intelligent Agents with Gemma 4, Google ADK, and Vector Search for Industrial AI",
        day: 2,
        image: "/speakers/parichay-das.png",
        socialLinks: {
            twitter: "",
            linkedin: "https://www.linkedin.com/in/parichaydas",
            instagram: "",
        },
    },
    {
        order: 5,
        name: "Jitendra Gupta",
        company: "EPAM Systems",
        position: "Enterprise Architect - Cloud & AI",
        talk: "Secure by Design: Building Enterprise AI Agents on Google Cloud",
        day: 2,
        image: "/speakers/jitendra-gupta.png",
        socialLinks: {
            twitter: "",
            linkedin: "https://www.linkedin.com/in/jitu028",
            instagram: "",
        },
    },
];

// .env is read directly rather than through a loader: this script runs
// outside Next.js.
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

// "Neel Shah" -> "neel-shah"
const slugOf = (name) =>
    name
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

const docFor = (s) => ({ ...s, isHidden: false });

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
        for (const s of SPEAKERS) {
            console.log(`${COLLECTION}/${slugOf(s.name)}`, JSON.stringify(docFor(s), null, 2));
        }
        console.log(`\n${SPEAKERS.length} docs would be written to ${credential.projectId}.`);
        return;
    }

    admin.initializeApp({ credential: admin.credential.cert(credential) });
    const db = admin.firestore();

    // merge: a doc edited by hand in the console keeps any field this script
    // does not set.
    const batch = db.batch();
    for (const s of SPEAKERS) {
        batch.set(db.collection(COLLECTION).doc(slugOf(s.name)), docFor(s), { merge: true });
    }
    await batch.commit();

    console.log(`Wrote ${SPEAKERS.length} speakers to ${COLLECTION} (${credential.projectId}).`);
};

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
