import { getDb } from "@/lib/adminDb";

export const dynamic = "force-dynamic";
export const metadata = { title: "Verify certificate | GDG Kolkata", robots: { index: false } };

// Public page the certificate's QR code opens. Shows only what is already
// printed on the certificate: name, workshops, date.
const KEY = /^DFK26-W-[A-Z0-9]{8}$/;

async function lookup(key) {
    if (!KEY.test(key)) return null;
    const db = getDb();
    if (!db) return null;
    const snap = await db.collection("certificates2026").where("certKey", "==", key).limit(1).get();
    return snap.empty ? null : snap.docs[0].data();
}

export default async function VerifyCertificatePage({ params }) {
    const { key } = await params;
    const cert = await lookup(String(key).toUpperCase());

    return (
        <main className="product_sans flex min-h-screen items-center justify-center bg-white px-5 py-16">
            <div className="w-full max-w-[520px] text-center">
                {cert ? (
                    <>
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "#E6F4EA", color: "#34A853", fontSize: 30 }}>✓</div>
                        <h1 className="text-[28px] font-bold" style={{ color: "#0b0b0b" }}>Valid certificate</h1>
                        <p className="mt-3 text-[16px]" style={{ color: "#5f6368" }}>
                            Issued to <strong style={{ color: "#0b0b0b" }}>{cert.name}</strong> for completing the
                            workshops at DevFest Kolkata 2026:
                        </p>
                        <ul className="mt-3 space-y-1 text-[15px] font-medium" style={{ color: "#1A73E8" }}>
                            {(cert.topics ?? []).map((t) => <li key={t}>{t}</li>)}
                        </ul>
                        <p className="mt-5 text-[13px]" style={{ color: "#80868b" }}>Certificate ID: {cert.certKey}</p>
                    </>
                ) : (
                    <>
                        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "#FCE8E6", color: "#EA4335", fontSize: 30 }}>✕</div>
                        <h1 className="text-[28px] font-bold" style={{ color: "#0b0b0b" }}>Not a valid certificate</h1>
                        <p className="mt-3 text-[16px]" style={{ color: "#5f6368" }}>We couldn&rsquo;t find a certificate with this ID.</p>
                    </>
                )}
            </div>
        </main>
    );
}
