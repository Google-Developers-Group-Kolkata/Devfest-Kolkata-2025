import { randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { FieldPath } from "firebase-admin/firestore";
import { admin, getDb } from "@/lib/adminDb";
import { generateCertificatePdf } from "@/lib/certificate";
import workshops from "@/data/workshops.json";

// Workshop completion certificate.
//
//   POST /api/certificate  { bookingId }
//     200 application/pdf        the certificate (first and only time)
//     400 invalid_booking_id
//     404 no_workshop_ticket     no workshop ticket with that booking ID
//     403 not_checked_in         has a workshop ticket, never checked in
//     409 already_generated      this booking already got its certificate
//     429                        too many attempts (middleware)
//
// Identity is the booking ID printed on the ticket (the holder's secret; an
// email would let anyone claim someone else's certificate).
//
// Eligibility comes from the flattened attendee collection: a workshop-tier
// ticket with that booking ID and `check_in === true`. The DevFest-only tiers get
// no certificate.

const ATTENDEES = "attendees-flattened-2026";
const ISSUED = "certificates2026";

// Test accounts: skip the ticket / check-in lookup and the once-only rule, so
// the flow can be tried on the live site. Nothing is stored.
const TEST_EMAILS = new Set(["babinsamrat123@gmail.com"]);
const TEST_NAME = "Test Attendee";

const WORKSHOP_TIER = /workshop/i;
const DEMO_TIER = /demo\s*\(/i;
const WORKSHOP_DATE = "21st November, 2026";

const F = (key) => `data_Attendee Details_${key}`;
// Konfhub booking IDs: 8 lowercase hex characters (all existing ones).
const BOOKING_ID = /^[0-9a-f]{6,12}$/;

// No 0/O or 1/I/L: keys get read aloud and typed.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const newKey = () =>
    `DFK26-W-${Array.from({ length: 8 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("")}`;

const pdfResponse = (bytes) =>
    new NextResponse(Buffer.from(bytes), {
        status: 200,
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="devfest-kolkata-2026-workshop-certificate.pdf"`,
            "Cache-Control": "no-store",
        },
    });

const fail = (status, code, error) => NextResponse.json({ code, error }, { status });

class AlreadyIssued extends Error {}

export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const bookingId = String(body?.bookingId ?? "").trim().toLowerCase();
        if (TEST_EMAILS.has(bookingId)) {
            const certKey = newKey();
            return pdfResponse(
                await generateCertificatePdf({
                    name: TEST_NAME,
                    topics: workshops.topics,
                    certKey,
                    dateLabel: WORKSHOP_DATE,
                })
            );
        }

        if (!BOOKING_ID.test(bookingId)) {
            return fail(400, "invalid_booking_id", "Enter the booking ID from your ticket.");
        }

        const db = getDb();
        if (!db) throw new Error("Firebase not configured");

        // 1. Workshop ticket with this booking ID.
        const snap = await db
            .collection(ATTENDEES)
            .where(new FieldPath(F("Booking Id")), "==", bookingId)
            .limit(10)
            .get();
        const tickets = snap.docs
            .map((doc) => doc.data())
            .filter((d) => {
                const tier = String(d[F("Ticket Details_Ticket Name")] ?? "");
                return WORKSHOP_TIER.test(tier) && !DEMO_TIER.test(tier);
            });
        if (tickets.length === 0) {
            return fail(
                404,
                "no_workshop_ticket",
                "We couldn't find a workshop ticket with this booking ID. Certificates are only for workshop attendees."
            );
        }

        // 2. Checked in?
        const attended = tickets.find((d) => d.check_in === true);
        if (!attended) {
            return fail(403, "not_checked_in", "You have to attend the workshop to get the certificate.");
        }

        // 3. Once only. Checked up front so a repeat request costs one read,
        //    and again inside the transaction below so two simultaneous
        //    requests cannot both succeed.
        const ref = db.collection(ISSUED).doc(bookingId);
        if ((await ref.get()).exists) {
            return fail(409, "already_generated", "Certificate already generated for this booking ID.");
        }

        // 4. Build the PDF before recording anything, so a rendering failure
        //    never burns the attendee's one certificate.
        const certKey = newKey();
        const name = String(attended[F("Name")] ?? attended[F("Buyer Name")] ?? "").trim();
        const pdf = await generateCertificatePdf({
            name,
            topics: workshops.topics,
            certKey,
            dateLabel: WORKSHOP_DATE,
        });

        // 5. Record it. `create` semantics: fails if the doc appeared meanwhile.
        try {
            await db.runTransaction(async (tx) => {
                if ((await tx.get(ref)).exists) throw new AlreadyIssued();
                tx.create(ref, {
                    certKey,
                    bookingId,
                    name,
                    topics: workshops.topics,
                    issuedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
            });
        } catch (error) {
            if (error instanceof AlreadyIssued) {
                return fail(409, "already_generated", "Certificate already generated for this booking ID.");
            }
            throw error;
        }

        return pdfResponse(pdf);
    } catch (error) {
        console.error("certificate: failed:", error);
        return fail(500, "server_error", "Something went wrong. Please try again in a moment.");
    }
}
