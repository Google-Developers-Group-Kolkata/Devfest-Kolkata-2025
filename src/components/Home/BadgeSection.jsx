"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPng } from "html-to-image";
import toast from "react-hot-toast";
import {
    Check,
    Copy,
    Download,
    Instagram,
    Linkedin,
    Loader2,
    Twitter,
    X,
} from "lucide-react";
import BadgeCard from "./BadgeCard";

const EASE = [0.33, 0, 0.2, 1];

// The same two strings the tickets and the venue print, so a badge never
// disagrees with the card that sold the pass.
const SITE_URL = "https://devfestkolkata.in";

const captionFor = (attendee) =>
    `🚀 I'm attending DevFest Kolkata '26!` +
    `${attendee ? ` Got my ${attendee.ticketName} pass.` : ""}` +
    ` Learn · Build · Connect — 21–22 November 2026 at The Westin Kolkata, Rajarhat.` +
    `\n\n${SITE_URL} #DevFestKolkata #GDGKolkata`;

// Three short answers to the three reasons someone would not bother.
const WHY = [
    "No sign-in required",
    "Ready in seconds",
    "Free for every pass holder",
];

// The condition, kept in one sentence and repeated wherever the social pass is
// handed over — on the site and on the image itself.
const DISCLAIMER =
    "This social pass is for sharing only — it does not guarantee entry to DevFest Kolkata. We verify attendees separately at the venue, so keep your original ticket email handy.";

// A filename, not a headline: lowercased, ascii-ish, no spaces.
const slugFor = (name) =>
    String(name ?? "attendee")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40) || "attendee";

const POSTER_QUERY = /\S+@\S+\.\S+/;

const BadgeSection = ({ onNavigate }) => {
    const reduced = useReducedMotion();

    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | error
    const [message, setMessage] = useState("");
    const [attendee, setAttendee] = useState(null);
    const [exporting, setExporting] = useState(false);

    const cardRef = useRef(null);
    const inputRef = useRef(null);

    // The overlay owns the screen while it is up: the page behind it stops
    // scrolling, and comes back at exactly the place it was left — nothing
    // here moves the scroll position itself.
    useEffect(() => {
        if (!attendee) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [attendee]);

    useEffect(() => {
        if (!attendee) return;
        const onKey = (e) => {
            if (e.key === "Escape") setAttendee(null);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [attendee]);

    const submit = async (e) => {
        e?.preventDefault();
        const value = email.trim();

        if (!POSTER_QUERY.test(value)) {
            setStatus("error");
            setMessage("Enter the email address you booked with.");
            inputRef.current?.focus();
            return;
        }

        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch(
                `/api/attendee?email=${encodeURIComponent(value)}`,
                { cache: "no-store" }
            );

            if (res.status === 404) {
                setStatus("error");
                setMessage(
                    "No ticket found for that email — check you used the address you booked with."
                );
                return;
            }
            if (!res.ok) throw new Error(`lookup failed: ${res.status}`);

            const { attendee: found } = await res.json();
            setStatus("idle");
            setAttendee(found);
        } catch (error) {
            console.error("social-pass: lookup failed", error);
            setStatus("error");
            setMessage("Something went wrong. Please try again in a moment.");
        }
    };

    // The card on screen is the file: rasterise that node rather than
    // redrawing it, so what downloads is what was previewed.
    const download = async () => {
        const node = cardRef.current;
        if (!node || exporting) return;
        setExporting(true);
        try {
            await document.fonts?.ready;
            const { width } = node.getBoundingClientRect();
            // At least double, and enough that the image is social-ready
            // rather than screen-sized.
            const pixelRatio = Math.max(2, Math.ceil(1920 / width));
            const dataUrl = await toPng(node, {
                pixelRatio,
                cacheBust: true,
                backgroundColor: "#ffffff",
            });
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `devfest-social-pass-2026-${slugFor(attendee?.name)}.png`;
            link.click();
        } catch (error) {
            console.error("social-pass: export failed", error);
            toast.error(
                "Couldn't build the file — press and hold the image to save it."
            );
        } finally {
            setExporting(false);
        }
    };

    const caption = captionFor(attendee);

    const copyCaption = async () => {
        try {
            await navigator.clipboard.writeText(caption);
            toast.success("Caption copied");
        } catch {
            toast.error("Couldn't copy — select the text instead.");
        }
    };

    const open = (url) => window.open(url, "_blank", "noopener,noreferrer");

    // Instagram: the app deep-link on mobile opens the camera/story composer
    // directly. On desktop the app isn't available, so we fall back to copying
    // the caption and opening instagram.com so they can paste it themselves.
    const shareInstagram = async () => {
        // Try the app deep-link first (works on Android/iOS)
        const appUrl = "instagram://camera";
        const webUrl = "https://www.instagram.com/";

        // Copy caption so it's ready to paste regardless of which path runs
        try {
            await navigator.clipboard.writeText(caption);
        } catch { /* silent — toast below covers it */ }

        // On mobile the scheme will open the app; on desktop it'll 404 in
        // the browser and we fall through to the web URL after a short delay.
        const start = Date.now();
        window.location.href = appUrl;
        setTimeout(() => {
            // If we're still here (i.e. the app didn't open), go to web
            if (Date.now() - start < 2000) {
                open(webUrl);
            }
        }, 1200);

        toast.success("Caption copied — paste it in your Instagram post ✌️");
    };

    const firstName = String(attendee?.name ?? "").split(" ")[0];

    // A short, personalised kicker under the greeting — different for students
    // and professionals so the badge feels made for that specific person.
    const designationKicker = (() => {
        const d = String(attendee?.designation ?? "").toLowerCase();
        if (d.includes("student"))
            return `Your ${attendee?.ticketName} social pass is ready — time to learn, build, and connect. 🎓`;
        if (d.includes("professional") || d.includes("pro"))
            return `Your ${attendee?.ticketName} social pass is ready — see you at The Westin, Rajarhat. 🤝`;
        return `Your ${attendee?.ticketName} social pass is ready — DevFest Kolkata is waiting for you. 🚀`;
    })();

    return (
        <>
            <section id="badge" className="relative w-full select-none">
                <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8 md:px-10 md:py-24 xl:px-16 xl:py-28">
                    <motion.h2
                        initial={reduced ? false : { opacity: 0, y: 26 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="product_sans text-center text-[28px] sm:text-[34px] md:text-[42px] lg:text-[52px] xl:text-[56px]"
                        style={{
                            fontWeight: 700,
                            lineHeight: 1.05,
                            letterSpacing: "-0.01em",
                            color: "#000000",
                        }}
                    >
                        Got your ticket? Claim your{" "}
                        <span style={{ color: "#F63130" }}>social pass</span>.
                    </motion.h2>

                    <motion.p
                        initial={reduced ? false : { opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
                        className="product_sans mx-auto mt-4 max-w-[640px] text-center text-[15px] md:mt-6 md:text-[17px] xl:text-[18px]"
                        style={{
                            fontWeight: 400,
                            lineHeight: 1.5,
                            color: "#5f6368",
                        }}
                    >
                        Enter the email you booked with and we&rsquo;ll make
                        your DevFest Kolkata &rsquo;26 social pass in seconds —
                        sized for Instagram, LinkedIn and X.
                    </motion.p>

                    <motion.form
                        initial={reduced ? false : { opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.5, ease: EASE, delay: 0.16 }}
                        onSubmit={submit}
                        className="mx-auto mt-8 flex w-full max-w-[600px] flex-col items-stretch gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4"
                    >
                        <input
                            ref={inputRef}
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            spellCheck={false}
                            value={email}
                            disabled={status === "loading"}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (status === "error") {
                                    setStatus("idle");
                                    setMessage("");
                                }
                            }}
                            placeholder="you@example.com"
                            aria-label="The email address you booked with"
                            className="product_sans h-12 w-full rounded-full px-5 text-[16px] outline-none transition-colors disabled:opacity-60 sm:h-11"
                            style={{
                                border: "2px solid #dadce0",
                                color: "#0b0b0b",
                                background: "#ffffff",
                            }}
                        />
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="product_sans flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap px-7 text-[16px] transition-transform duration-200 hover:scale-[1.03] disabled:scale-100 disabled:opacity-70 sm:h-11"
                            style={{
                                border: "3px solid transparent",
                                borderRadius: "50px",
                                background:
                                    "linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(98deg, #F63130 0%, #4787EA 35%, #34A853 72%, #FBBC04 100%) border-box",
                                color: "#000000",
                                fontWeight: 500,
                            }}
                        >
                            {status === "loading" ? (
                                <>
                                    <Loader2
                                        size={17}
                                        className="animate-spin"
                                        aria-hidden="true"
                                    />
                                    Finding your ticket
                                </>
                            ) : (
                                "Generate my social pass"
                            )}
                        </button>
                    </motion.form>

                    <div className="mt-4 min-h-[44px] text-center">
                        {status === "error" && (
                            <div className="product_sans text-[14px] md:text-[15px]">
                                <span style={{ color: "#d93025" }}>{message}</span>
                                <button
                                    type="button"
                                    onClick={() => onNavigate?.("tickets")}
                                    className="ml-2 cursor-pointer underline underline-offset-2"
                                    style={{ color: "#1a73e8" }}
                                >
                                    Buy a ticket instead &rarr;
                                </button>
                            </div>
                        )}
                        {status !== "error" && (
                            <p
                                className="product_sans text-[13px] md:text-[14px]"
                                style={{ color: "#80868b" }}
                            >
                                We only read your email to find your booking —
                                nothing is stored.
                            </p>
                        )}
                    </div>

                    {/* Three short answers to the three reasons someone would
                        scroll past instead. */}
                    <motion.ul
                        initial={reduced ? false : { opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.45, ease: EASE, delay: 0.22 }}
                        className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:gap-x-8"
                    >
                        {WHY.map((item) => (
                            <li
                                key={item}
                                className="product_sans flex items-center gap-1.5 text-[13px] md:text-[14px]"
                                style={{ color: "#5f6368" }}
                            >
                                <Check
                                    size={14}
                                    aria-hidden="true"
                                    style={{ color: "#34A853" }}
                                />
                                {item}
                            </li>
                        ))}
                    </motion.ul>

                    {/* The condition, boxed so it reads as a rule rather than a
                        footnote — a badge is not a ticket. */}
                    <motion.div
                        initial={reduced ? false : { opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.45, ease: EASE, delay: 0.3 }}
                        className="mx-auto mt-6 flex max-w-[680px] items-start gap-3 rounded-2xl px-4 py-3.5 md:px-5"
                        style={{
                            background: "#fff8e1",
                            border: "1px solid #fde293",
                        }}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#b06000"
                            strokeWidth="2"
                            strokeLinecap="round"
                            aria-hidden="true"
                            className="mt-0.5 h-4 w-4 flex-none md:h-5 md:w-5"
                        >
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 8h.01M12 11.5v4.5" />
                        </svg>
                        <p
                            className="product_sans text-[13px] md:text-[14px]"
                            style={{ lineHeight: 1.5, color: "#5a4200" }}
                        >
                            <strong style={{ fontWeight: 700 }}>
                                It&rsquo;s a social pass, not a ticket.
                            </strong>{" "}
                            Made for posting on social media — it does not
                            guarantee entry. We verify attendees separately at
                            the venue, so keep your original booking email
                            handy.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Result — a full-screen sheet over the page. It closes from the
                X, the Escape key or the backdrop, and the page behind it keeps
                the scroll position it had. */}
            {attendee && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Your DevFest social pass"
                    className="cs-overlay fixed inset-0 z-[100] overflow-y-auto"
                    style={{
                        background: "rgba(0,0,0,0.55)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                    }}
                    onClick={() => setAttendee(null)}
                >
                    <div
                        className="flex min-h-full w-full flex-col items-center justify-center px-4 py-10 sm:px-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setAttendee(null)}
                            aria-label="Close"
                            className="fixed right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition-colors hover:bg-black/60 sm:right-6 sm:top-6"
                        >
                            <X size={20} aria-hidden="true" />
                        </button>

                        <div
                            className="product_sans mb-5 text-center text-white"
                            style={{ maxWidth: "760px" }}
                        >
                            {/* Stamp-feel admit chip above the greeting */}
                            <div
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginBottom: "10px",
                                    background: "rgba(255,255,255,0.12)",
                                    border: "1px solid rgba(255,255,255,0.25)",
                                    borderRadius: "999px",
                                    padding: "4px 14px",
                                    fontSize: "clamp(10px, 1.8vw, 12px)",
                                    fontWeight: 700,
                                    letterSpacing: "0.18em",
                                    textTransform: "uppercase",
                                    color: "rgba(255,255,255,0.85)",
                                }}
                            >
                                <span
                                    style={{
                                        width: 7,
                                        height: 7,
                                        borderRadius: "50%",
                                        background: "#34A853",
                                        flexShrink: 0,
                                    }}
                                />
                                Ticket confirmed · Day {attendee.day} · {attendee.date}
                            </div>

                            {/* Main greeting */}
                            <div
                                style={{
                                    fontSize: "clamp(22px, 4.5vw, 34px)",
                                    fontWeight: 700,
                                    lineHeight: 1.1,
                                }}
                            >
                                You&rsquo;re in, {firstName}! 🎉
                            </div>

                            {/* Personalised subline based on designation */}
                            <div
                                style={{
                                    marginTop: "8px",
                                    fontSize: "clamp(13px, 2.4vw, 15px)",
                                    color: "rgba(255,255,255,0.75)",
                                    lineHeight: 1.45,
                                }}
                            >
                                {designationKicker}
                            </div>

                            {/* Stamp row — the same compact metadata the card prints */}
                            <div
                                style={{
                                    marginTop: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                    flexWrap: "wrap",
                                    fontSize: "clamp(11px, 2vw, 13px)",
                                    color: "rgba(255,255,255,0.55)",
                                    letterSpacing: "0.04em",
                                }}
                            >
                                <span>DevFest Kolkata &rsquo;26</span>
                                <span style={{ opacity: 0.35 }}>·</span>
                                <span>The Westin Kolkata, Rajarhat</span>
                                <span style={{ opacity: 0.35 }}>·</span>
                                <span>21–22 November 2026</span>
                            </div>
                        </div>

                        {/* The card, capped to the same width it has in the
                            section so the exported file is not sized by the
                            device it happened to be viewed on. */}
                        <div className="w-full" style={{ maxWidth: "760px" }}>
                            <BadgeCard attendee={attendee} cardRef={cardRef} />
                        </div>

                        <div className="mt-6 flex w-full max-w-[760px] flex-col items-center gap-4">
                            <div className="flex w-full flex-wrap items-center justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={download}
                                    disabled={exporting}
                                    className="product_sans flex h-11 cursor-pointer items-center gap-2 whitespace-nowrap px-6 text-[15px] transition-transform duration-200 hover:scale-[1.04] disabled:scale-100 disabled:opacity-70"
                                    style={{
                                        border: "3px solid transparent",
                                        borderRadius: "50px",
                                        background:
                                            "linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(98deg, #F63130 0%, #4787EA 35%, #34A853 72%, #FBBC04 100%) border-box",
                                        color: "#000000",
                                        fontWeight: 500,
                                    }}
                                >
                                    {exporting ? (
                                        <>
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                                aria-hidden="true"
                                            />
                                            Building…
                                        </>
                                    ) : (
                                        <>
                                            <Download size={16} aria-hidden="true" />
                                            Download
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={shareInstagram}
                                    className="product_sans flex h-11 cursor-pointer items-center gap-2 rounded-full border border-white/30 px-5 text-[14px] text-white transition-colors hover:bg-white/10"
                                >
                                    <Instagram size={16} aria-hidden="true" />
                                    Instagram
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        open(
                                            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                                                SITE_URL
                                            )}&summary=${encodeURIComponent(caption)}`
                                        )
                                    }
                                    className="product_sans flex h-11 cursor-pointer items-center gap-2 rounded-full border border-white/30 px-5 text-[14px] text-white transition-colors hover:bg-white/10"
                                >
                                    <Linkedin size={16} aria-hidden="true" />
                                    LinkedIn
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        open(
                                            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                                caption
                                            )}`
                                        )
                                    }
                                    className="product_sans flex h-11 cursor-pointer items-center gap-2 rounded-full border border-white/30 px-5 text-[14px] text-white transition-colors hover:bg-white/10"
                                >
                                    <Twitter size={16} aria-hidden="true" />
                                    X
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        open(
                                            `https://wa.me/?text=${encodeURIComponent(caption)}`
                                        )
                                    }
                                    className="product_sans flex h-11 cursor-pointer items-center gap-2 rounded-full border border-white/30 px-5 text-[14px] text-white transition-colors hover:bg-white/10"
                                >
                                    {/* WhatsApp icon */}
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                        style={{ width: 16, height: 16, flexShrink: 0 }}
                                    >
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                                    </svg>
                                    WhatsApp
                                </button>

                                <button
                                    type="button"
                                    onClick={copyCaption}
                                    className="product_sans flex h-11 cursor-pointer items-center gap-2 rounded-full border border-white/30 px-5 text-[14px] text-white transition-colors hover:bg-white/10"
                                >
                                    <Copy size={16} aria-hidden="true" />
                                    Copy caption
                                </button>
                            </div>

                            <p
                                className="product_sans text-center text-[13px] md:text-[14px]"
                                style={{ color: "rgba(255,255,255,0.7)" }}
                            >
                                Post it and tag{" "}
                                <span style={{ color: "#ffffff" }}>
                                    @gdgkolkata
                                </span>{" "}
                                · #DevFestKolkata — we reshare our favourites
                                every week.
                            </p>

                            {/* Same rule as on the card and under the form, so
                                nobody meets it for the first time at the gate. */}
                            <p
                                className="product_sans mx-auto max-w-[560px] text-center text-[12px] md:text-[13px]"
                                style={{ color: "rgba(255,255,255,0.55)" }}
                            >
                                Made for sharing, not for entry — this social
                                pass does not guarantee entry. Attendee
                                verification is done separately by us before
                                the event.
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    setAttendee(null);
                                    setEmail("");
                                    setTimeout(() => inputRef.current?.focus(), 60);
                                }}
                                className="product_sans flex cursor-pointer items-center gap-1.5 text-[14px] text-white/80 underline underline-offset-4 transition-colors hover:text-white"
                            >
                                <Check size={14} aria-hidden="true" />
                                Not you? Try another email
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BadgeSection;
