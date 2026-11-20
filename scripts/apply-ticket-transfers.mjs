// Applies ticket transfers to the attendees2026 collection: the attendee on
// each booking becomes the person the ticket was transferred to.
//
//   node scripts/apply-ticket-transfers.mjs <transfers.csv>         # update the docs
//   node scripts/apply-ticket-transfers.mjs <transfers.csv> --dry   # print what would change
//
// The CSV is the "Likely Transferred" sheet of the ticket comparison report,
// saved as CSV. Each row needs bookingId, documentId, changedFields and
// changeDetails, where changeDetails reads like
//   name: Old Name -> New Name | email: old@x.com -> new@x.com | phone: +91... -> 98...
//
// Only the attendee's own fields change: Name, Email Address, Phone Number,
// Organisation and Gender under data["Attendee Details"]. Buyer Name and Buyer
// Email are never touched: the buyer is whoever paid, and a transfer does not
// change that.
//
// A field is updated only while the doc still holds its old value. A field
// that already holds the new value is skipped, so running this twice changes
// nothing the second time. A doc holding neither is reported and its row is
// left alone. The report keeps the old values, so a row can be undone by
// swapping the two sides of its changeDetails.
//
// Credentials come from the same FIREBASE_* variables in .env that the site's
// API routes use.

import { readFileSync } from "node:fs";
import admin from "firebase-admin";

const COLLECTION = "attendees2026";
const USAGE = "usage: node scripts/apply-ticket-transfers.mjs <transfers.csv> [--dry]";

// Phone numbers are stored in E.164 (+91XXXXXXXXXX) and /api/attendee looks
// them up that way. The report writes the new numbers as 10 bare digits, so
// an Indian mobile number (starts 6-9) gets +91 back. Anything else is
// refused rather than guessed: a Bangladeshi +880 number also has 10 digits
// once its code is dropped.
const toE164 = (raw) => {
    const value = String(raw).trim();
    const digits = value.replace(/\D/g, "");
    if (value.startsWith("+") && digits.length >= 8) return `+${digits}`;
    if (/^[6-9]\d{9}$/.test(digits)) return `+91${digits}`;
    if (/^91[6-9]\d{9}$/.test(digits)) return `+${digits}`;
    throw new Error(`can't tell the country code of phone "${raw}"`);
};

const tidy = (v) => String(v ?? "").trim().replace(/\s+/g, " ");

// Report field -> key under data["Attendee Details"]. `store` turns the
// report's new value into what gets written; `same` compares two values.
const FIELDS = {
    name: { key: "Name", store: tidy, same: (a, b) => tidy(a) === tidy(b) },
    email: {
        key: "Email Address",
        // /api/attendee lowercases the email it is given before querying.
        store: (v) => tidy(v).toLowerCase(),
        same: (a, b) => tidy(a).toLowerCase() === tidy(b).toLowerCase(),
    },
    phone: {
        key: "Phone Number",
        store: toE164,
        same: (a, b) => String(a ?? "").replace(/\D/g, "") === String(b ?? "").replace(/\D/g, ""),
    },
    organisation: { key: "Organisation", store: tidy, same: (a, b) => tidy(a) === tidy(b) },
    gender: { key: "Gender", store: tidy, same: (a, b) => tidy(a) === tidy(b) },
};

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

// RFC 4180 CSV: quoted fields may hold commas, newlines and "" for a quote.
// Returns one object per row, keyed by the header row.
const readCsv = (path) => {
    const text = readFileSync(path, "utf8").replace(/^﻿/, "");
    const rows = [[]];
    let field = "";
    let quoted = false;

    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (quoted) {
            if (c === '"' && text[i + 1] === '"') field += text[++i];
            else if (c === '"') quoted = false;
            else field += c;
        } else if (c === '"') quoted = true;
        else if (c === ",") rows.at(-1).push(field), (field = "");
        else if (c === "\n") rows.at(-1).push(field), (field = ""), rows.push([]);
        else if (c !== "\r") field += c;
    }
    rows.at(-1).push(field);

    const [header, ...body] = rows.filter((r) => r.some((v) => v.trim()));
    return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
};

// "name: A -> B | email: x -> y" -> [{ field: "name", from: "A", to: "B" }, ...]
// Throws on anything it can't read unambiguously, and when the fields it read
// differ from the row's changedFields column, so a value that happens to hold
// " | " or " -> " stops the run instead of being split in the wrong place.
const parseChanges = (row) => {
    const where = `booking ${row.bookingId}`;
    const changes = row.changeDetails.split(" | ").map((part) => {
        const at = part.indexOf(":");
        const sides = at === -1 ? [] : part.slice(at + 1).split(" -> ");
        if (sides.length !== 2) throw new Error(`${where}: can't read "${part}"`);

        const field = part.slice(0, at).trim();
        if (!FIELDS[field]) throw new Error(`${where}: unknown field "${field}"`);
        return { field, from: sides[0].trim(), to: sides[1].trim() };
    });

    const listed = row.changedFields.split(",").map((f) => f.trim()).filter(Boolean).sort();
    const read = changes.map((c) => c.field).sort();
    if (listed.join() !== read.join()) {
        throw new Error(`${where}: changedFields says ${listed.join(", ")} but changeDetails has ${read.join(", ")}`);
    }

    return changes.map((c) => ({ ...c, to: FIELDS[c.field].store(c.to) }));
};

// Compares one doc against its row. Returns the field writes it needs, or the
// reason the row has to be left alone.
const planFor = (row, changes, snap) => {
    if (!snap.exists) return { problem: "doc not found" };

    const att = snap.get(new admin.firestore.FieldPath("data", "Attendee Details"));
    if (!att) return { problem: "doc has no Attendee Details" };
    if (String(att["Booking Id"] ?? "").toLowerCase() !== row.bookingId.toLowerCase()) {
        return { problem: `doc's Booking Id is ${att["Booking Id"]}, not ${row.bookingId}` };
    }

    const writes = [];
    const problems = [];
    for (const { field, from, to } of changes) {
        const { key, same } = FIELDS[field];
        const current = att[key];
        if (same(current, to)) continue;
        if (same(current, from)) writes.push({ key, from: current, to });
        else problems.push(`${key} is "${current}", expected "${from}"`);
    }

    return problems.length ? { problem: problems.join("; ") } : { writes };
};

const main = async () => {
    const args = process.argv.slice(2);
    const dry = args.includes("--dry");
    const paths = args.filter((a) => !a.startsWith("--"));
    const unknown = args.filter((a) => a.startsWith("--") && a !== "--dry");
    if (paths.length !== 1 || unknown.length) throw new Error(USAGE);

    // Read and check the whole file before touching Firestore.
    const rows = readCsv(paths[0]);
    if (!rows.length) throw new Error(`${paths[0]} has no rows`);
    for (const col of ["bookingId", "documentId", "changedFields", "changeDetails"]) {
        if (!(col in rows[0])) throw new Error(`${paths[0]} has no ${col} column`);
    }
    const ids = rows.map((r) => r.documentId);
    const repeated = ids.filter((id, i) => ids.indexOf(id) !== i);
    if (repeated.length) throw new Error(`documentId listed twice: ${[...new Set(repeated)].join(", ")}`);
    const changesByRow = rows.map(parseChanges);

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
    const refs = rows.map((r) => db.collection(COLLECTION).doc(r.documentId));
    const snaps = await db.getAll(...refs);

    const todo = [];
    let upToDate = 0;
    let skipped = 0;

    rows.forEach((row, i) => {
        const plan = planFor(row, changesByRow[i], snaps[i]);
        const label = `${row.bookingId} ${row.documentId}`;

        if (plan.problem) {
            skipped++;
            console.log(`SKIP ${label}: ${plan.problem}`);
        } else if (!plan.writes.length) {
            upToDate++;
            console.log(`ok   ${label}: already up to date`);
        } else {
            todo.push({ ref: refs[i], snap: snaps[i], writes: plan.writes });
            console.log(`${dry ? "would" : "set "} ${label}:`);
            for (const w of plan.writes) console.log(`       ${w.key}: ${w.from} -> ${w.to}`);
        }
    });

    const tally = `${todo.length} to update, ${upToDate} already up to date, ${skipped} skipped`;
    if (dry || !todo.length) {
        console.log(`\n${tally}${dry ? " (dry run, nothing written)" : ""}.`);
        if (skipped) process.exitCode = 1;
        return;
    }

    // One batch per 500 docs. lastUpdateTime makes a write fail if the doc
    // changed after it was read above, instead of overwriting that change.
    for (let i = 0; i < todo.length; i += 500) {
        const batch = db.batch();
        for (const { ref, snap, writes } of todo.slice(i, i + 500)) {
            const pairs = writes.flatMap((w) => [
                new admin.firestore.FieldPath("data", "Attendee Details", w.key),
                w.to,
            ]);
            batch.update(ref, ...pairs, { lastUpdateTime: snap.updateTime });
        }
        await batch.commit();
    }

    console.log(`\nUpdated ${todo.length} docs in ${COLLECTION} (${credential.projectId}). ${tally}.`);
    if (skipped) process.exitCode = 1;
};

main()
    .catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    })
    // The Firestore client holds the process open; exit once the work is done.
    .finally(() => process.exit());
