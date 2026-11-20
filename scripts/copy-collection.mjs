// Copies every document in one Firestore collection into another.
//
//   node scripts/copy-collection.mjs <source> <target>           # copy
//   node scripts/copy-collection.mjs <source> <target> --dry     # list what would be copied
//   node scripts/copy-collection.mjs <source> <target> --deep    # also copy subcollections
//   node scripts/copy-collection.mjs <source> <target> --force   # copy into a target that already has docs
//
// e.g. node scripts/copy-collection.mjs speakers2026 speakers2026-backup
//
// Firestore has no "create collection" step: a collection exists once it holds
// a document, so naming a target that does not exist yet creates it. If the
// target already has documents the script stops unless --force is passed; then
// a target doc with the same id as a source doc is replaced, and the target's
// other docs are left alone.
//
// Document ids are kept. Timestamps, GeoPoints and references are copied as
// they are, so a reference field still points at the doc it pointed at in the
// source collection.
//
// Credentials come from the same FIREBASE_* variables in .env that the site's
// API routes use.

import { readFileSync } from "node:fs";
import admin from "firebase-admin";

const USAGE = "usage: node scripts/copy-collection.mjs <source> <target> [--dry] [--deep] [--force]";
const FLAGS = ["--dry", "--deep", "--force"];

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

const parseArgs = (argv) => {
    const flags = argv.filter((a) => a.startsWith("--"));
    const names = argv.filter((a) => !a.startsWith("--"));

    const unknown = flags.filter((f) => !FLAGS.includes(f));
    if (unknown.length) throw new Error(`unknown option ${unknown.join(", ")}\n${USAGE}`);
    if (names.length !== 2) throw new Error(USAGE);

    const [source, target] = names;
    if (source === target) throw new Error("source and target are the same collection");

    return {
        source,
        target,
        dry: flags.includes("--dry"),
        deep: flags.includes("--deep"),
        force: flags.includes("--force"),
    };
};

// Walks `from` and queues a write of each doc into `to` under the same id.
// With `deep`, recurses into each doc's subcollections. Returns the number of
// docs copied (or that would be copied).
const copyCollection = async (from, to, { dry, deep, writer, failures }) => {
    const snap = await from.get();
    let count = 0;

    for (const doc of snap.docs) {
        const dest = to.doc(doc.id);

        if (dry) {
            console.log(`${doc.ref.path} -> ${dest.path}`);
        } else {
            // The catch keeps one failed write from crashing the run; failures
            // are reported once every write has settled.
            writer
                .set(dest, doc.data())
                .catch((error) => failures.push(`${dest.path}: ${error.message}`));
        }
        count++;

        if (deep) {
            for (const sub of await doc.ref.listCollections()) {
                count += await copyCollection(sub, dest.collection(sub.id), {
                    dry,
                    deep,
                    writer,
                    failures,
                });
            }
        }
    }

    return count;
};

const main = async () => {
    const { source, target, dry, deep, force } = parseArgs(process.argv.slice(2));
    const env = { ...readEnv(), ...process.env };

    const credential = {
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    };
    if (!credential.projectId || !credential.clientEmail || !credential.privateKey) {
        throw new Error("FIREBASE_PROJECT_ID / CLIENT_EMAIL / PRIVATE_KEY missing");
    }

    admin.initializeApp({ credential: admin.credential.cert(credential) });
    const db = admin.firestore();
    const from = db.collection(source);
    const to = db.collection(target);

    // An empty source is almost always a typo in the name.
    if ((await from.limit(1).get()).empty) {
        throw new Error(`${source} has no documents in ${credential.projectId}`);
    }

    const targetExists = !(await to.limit(1).get()).empty;
    if (targetExists && !force) {
        if (!dry) {
            throw new Error(
                `${target} already has documents. Pass --force to copy into it ` +
                    "(docs with the same id are replaced, the others are kept)."
            );
        }
        console.log(`note: ${target} already has documents; a real run needs --force.\n`);
    }

    if (dry) {
        const count = await copyCollection(from, to, { dry, deep });
        console.log(`\n${count} docs would be copied in ${credential.projectId}.`);
        return;
    }

    // BulkWriter batches the writes, throttles them and retries the ones
    // Firestore rejects as transient.
    const writer = db.bulkWriter();
    const failures = [];
    const count = await copyCollection(from, to, { dry, deep, writer, failures });
    await writer.close();

    if (failures.length) {
        console.error(failures.join("\n"));
        throw new Error(`${failures.length} of ${count} docs failed to copy`);
    }

    const created = targetExists ? "" : " (new collection)";
    console.log(`Copied ${count} docs from ${source} to ${target}${created} in ${credential.projectId}.`);
};

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
