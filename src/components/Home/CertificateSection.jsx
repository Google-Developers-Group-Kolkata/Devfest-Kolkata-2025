"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import toast from "react-hot-toast";
import { Award, Loader2, X } from "lucide-react";

const EASE = [0.33, 0, 0.2, 1];
// Konfhub booking IDs: 8 hex characters, printed on the ticket and its email.
const BOOKING_ID = /^[0-9a-f]{6,12}$/i;
// The server also accepts a test email; anything else shaped like one is
// rejected there with a clear message.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Same rainbow ring the other primary buttons on the site wear.
const RING =
    "linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(98deg, #F63130 0%, #4787EA 35%, #34A853 72%, #FBBC04 100%) border-box";

const CertificateSection = () => {
    const reduced = useReducedMotion();
    const inputRef = useRef(null);

    const [open, setOpen] = useState(false); // email field revealed
    const [bookingId, setBookingId] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | error | done
    const [message, setMessage] = useState("");
    const [notAttended, setNotAttended] = useState(false); // popup

    const valid = BOOKING_ID.test(bookingId.trim()) || EMAIL.test(bookingId.trim());

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    // The popup owns the screen while it is up.
    useEffect(() => {
        if (!notAttended) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e) => e.key === "Escape" && setNotAttended(false);
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [notAttended]);

    const getCertificate = async (e) => {
        e?.preventDefault();
        if (!valid || status === "loading") return;

        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch("/api/certificate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId: bookingId.trim() }),
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "devfest-kolkata-2026-workshop-certificate.pdf";
                document.body.appendChild(link);
                link.click();
                link.remove();
                setTimeout(() => URL.revokeObjectURL(url), 10_000);
                setStatus("done");
                toast.success("Your certificate is downloading 🎉");
                return;
            }

            if (res.status === 429) {
                setStatus("error");
                setMessage("Too many attempts. Please try again in a few minutes.");
                return;
            }

            const data = await res.json().catch(() => ({}));
            if (data.code === "not_checked_in") {
                setStatus("idle");
                setNotAttended(true);
                return;
            }
            setStatus("error");
            setMessage(data.error ?? "Something went wrong. Please try again in a moment.");
        } catch (error) {
            console.error("certificate: request failed", error);
            setStatus("error");
            setMessage("Something went wrong. Please try again in a moment.");
        }
    };

    const loading = status === "loading";

    return (
        <>
            <section id="certificate" className="relative w-full">
                <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8 md:px-10 md:py-24 xl:px-16 xl:py-28">
                    <motion.h2
                        initial={reduced ? false : { opacity: 0, y: 26 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="product_sans text-center text-[28px] sm:text-[34px] md:text-[42px] lg:text-[52px] xl:text-[56px]"
                        style={{ fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.01em", color: "#000000" }}
                    >
                        Attended a workshop? Get your{" "}
                        <span style={{ color: "#4285F4" }}>certificate</span>.
                    </motion.h2>

                    <motion.p
                        initial={reduced ? false : { opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
                        className="product_sans mx-auto mt-4 max-w-[640px] text-center text-[15px] md:mt-6 md:text-[17px] xl:text-[18px]"
                        style={{ fontWeight: 400, lineHeight: 1.5, color: "#5f6368" }}
                    >
                        Certificates are for workshop attendees who checked in at the venue. Each attendee can
                        generate it once.
                    </motion.p>

                    <motion.div
                        initial={reduced ? false : { opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.5, ease: EASE, delay: 0.16 }}
                        className="mx-auto mt-8 flex w-full max-w-[600px] flex-col items-center gap-4 sm:mt-10"
                    >
                        {!open ? (
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                className="product_sans flex h-12 cursor-pointer items-center justify-center gap-2 whitespace-nowrap px-8 text-[16px] transition-transform duration-200 hover:scale-[1.03]"
                                style={{ border: "3px solid transparent", borderRadius: "50px", background: RING, color: "#000000", fontWeight: 500 }}
                            >
                                <Award size={18} aria-hidden="true" />
                                Generate Certificate
                            </button>
                        ) : (
                            <form
                                onSubmit={getCertificate}
                                className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4"
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    autoComplete="off"
                                    autoCapitalize="none"
                                    spellCheck={false}
                                    value={bookingId}
                                    disabled={loading}
                                    onChange={(e) => {
                                        setBookingId(e.target.value);
                                        if (status === "error" || status === "done") {
                                            setStatus("idle");
                                            setMessage("");
                                        }
                                    }}
                                    placeholder="Your ticket booking ID"
                                    aria-label="The booking ID on your workshop ticket"
                                    className="product_sans h-12 w-full rounded-full px-5 text-[16px] outline-none transition-colors disabled:opacity-60 sm:h-11"
                                    style={{ border: "2px solid #dadce0", color: "#0b0b0b", background: "#ffffff" }}
                                />
                                <button
                                    type="submit"
                                    disabled={!valid || loading}
                                    className="product_sans flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap px-7 text-[16px] transition-transform duration-200 hover:scale-[1.03] disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-60 sm:h-11"
                                    style={{ border: "3px solid transparent", borderRadius: "50px", background: RING, color: "#000000", fontWeight: 500 }}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={17} className="animate-spin" aria-hidden="true" />
                                            Checking
                                        </>
                                    ) : valid ? (
                                        "Get your certificate"
                                    ) : (
                                        "Generate Certificate"
                                    )}
                                </button>
                            </form>
                        )}

                        {message && (
                            <p
                                role="alert"
                                className="product_sans text-center text-[14px] md:text-[15px]"
                                style={{ color: "#D93025", maxWidth: 520 }}
                            >
                                {message}
                            </p>
                        )}
                    </motion.div>
                </div>
            </section>

            {notAttended &&
                createPortal(
                    <div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-5"
                        style={{ background: "rgba(0,0,0,0.55)" }}
                        onClick={() => setNotAttended(false)}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cert-popup-title"
                    >
                        <div
                            className="product_sans relative w-full max-w-[420px] rounded-3xl bg-white p-7 text-center"
                            style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                onClick={() => setNotAttended(false)}
                                aria-label="Close"
                                className="absolute right-4 top-4 cursor-pointer rounded-full p-1.5 transition-colors hover:bg-black/5"
                            >
                                <X size={18} />
                            </button>
                            <div
                                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                                style={{ background: "#FEF7E0", color: "#F9AB00" }}
                            >
                                <Award size={28} aria-hidden="true" />
                            </div>
                            <h3 id="cert-popup-title" className="text-[22px]" style={{ fontWeight: 700, color: "#0b0b0b" }}>
                                Attend the workshop first
                            </h3>
                            <p className="mt-3 text-[16px]" style={{ lineHeight: 1.5, color: "#5f6368" }}>
                                You have to attend the workshop to get the certificate.
                            </p>
                            <button
                                type="button"
                                onClick={() => setNotAttended(false)}
                                className="mt-6 h-11 w-full cursor-pointer rounded-full text-[16px] text-white transition-transform duration-200 hover:scale-[1.02]"
                                style={{ background: "#1E1E1E", fontWeight: 500 }}
                            >
                                Got it
                            </button>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default CertificateSection;
