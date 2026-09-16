"use client";

import { useEffect, useRef, useState } from "react";

const RED = "#F63130";

// Ticket shape (scalloped edges + the stub notch top and bottom) comes from
// these assets. Their own 474x234 box is the coordinate system for everything
// below, and the card is stretched to exactly that box. Which one a card wears
// is the `color` field on its Firestore doc; `accent` is that artwork's fill,
// reused for anything drawn on top of white.
const PALETTE = {
    red: { bg: "/ticket/background-red.svg", accent: "#F63130" },
    blue: { bg: "/ticket/background-blue.svg", accent: "#4285F4" },
    green: { bg: "/ticket/background-green.svg", accent: "#34A853" },
    yellow: { bg: "/ticket/background-yellow.svg", accent: "#FBBC04" },
};

const paletteFor = (color) =>
    PALETTE[String(color ?? "").toLowerCase()] ?? PALETTE.red;

// Clips an overlay to the ticket silhouette, so nothing leaks past the notches.
const maskWith = (bg) => ({
    WebkitMaskImage: `url(${bg})`,
    maskImage: `url(${bg})`,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
});

// Card text scales with the card itself (cqw), so it only needs to step down
// as the ticket name gets longer.
const nameSizeFor = (name) => {
    const n = (name || "").length;
    if (n <= 14) return "6.6cqw";
    if (n <= 22) return "5.4cqw";
    if (n <= 34) return "4.3cqw";
    return "3.6cqw";
};

const TicketCard = ({ reveal, revealRef, stampStarted, stampTick, index, ticket }) => {
    const live = ticket?.live && ticket?.url;
    const isDefault = ticket?.source !== "server";
    const { bg, accent } = paletteFor(ticket?.color);
    // Sold out only applies to a real ticket Firebase has switched off;
    // everything else that can't be bought yet reads as coming soon.
    const stampLabel =
        !isDefault && !ticket?.isActive ? "Sold Out" : "Coming Soon";
    return (
        <div
            ref={revealRef}
            onClick={() => {
                if (live) window.open(ticket.url, "_blank", "noopener,noreferrer");
            }}
            className="relative w-full max-w-[360px] shrink-0 grow-0 overflow-hidden md:w-[290px] lg:w-[320px] xl:w-[360px]"
            style={{
                aspectRatio: "474 / 234",
                containerType: "inline-size",
                backgroundImage: `url(${bg})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                opacity: reveal.opacity,
                transform: reveal.transform,
                transformOrigin: "center",
                transition: "opacity 150ms linear, transform 150ms linear",
                cursor: live ? "pointer" : "default",
            }}
        >
            {/* Dashed stub perforation, run between the notches of the artwork */}
            <svg
                viewBox="0 0 474 234"
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden="true"
            >
                <path
                    d="M 118 27 V 207"
                    stroke="#FFFFFF"
                    strokeWidth="2.2"
                    strokeDasharray="9 7.5"
                    strokeLinecap="round"
                />
            </svg>

            {/* Stub: rotated -90deg so it reads bottom-to-top along the perforation */}
            <div
                className="pointer-events-none absolute flex items-center"
                style={{
                    left: 0,
                    top: "100%",
                    width: "49.37cqw",
                    height: "24.9cqw",
                    transform: "rotate(-90deg)",
                    transformOrigin: "left top",
                    gap: "3.5cqw",
                    paddingLeft: "4.5cqw",
                }}
            >
                <img
                    src="/logo-brackets-white.svg"
                    alt=""
                    style={{ width: "6.2cqw", height: "auto", flex: "0 0 auto" }}
                />
                <div
                    className="product_sans flex flex-col whitespace-nowrap"
                    style={{
                        gap: "2.6cqw",
                        color: "#FFFFFF",
                        fontWeight: 500,
                        lineHeight: 1,
                    }}
                >
                    <span style={{ fontSize: "2.8cqw" }}>Google Developer Group</span>
                    <span style={{ fontSize: "3.2cqw" }}>Kolkata</span>
                </div>
            </div>

            {/* Main stub: name, price, and the purchase CTA when the ticket is live */}
            <div
                className="absolute flex flex-col items-center justify-center text-center"
                style={{
                    left: "24.9%",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    padding: "4% 5% 6.25% 5%",
                    gap: "4.5cqw",
                }}
            >
                <div
                    className="product_sans pointer-events-none"
                    title={ticket?.name}
                    style={{
                        fontSize: nameSizeFor(ticket?.name),
                        fontWeight: 500,
                        lineHeight: 1.15,
                        color: "#FFFFFF",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        overflowWrap: "anywhere",
                    }}
                >
                    {ticket?.name || "Super Early Bird"}
                </div>
                <div
                    className="product_sans pointer-events-none whitespace-nowrap"
                    style={{
                        fontSize: "3.2cqw",
                        fontWeight: 500,
                        lineHeight: 1,
                        color: "#FFFFFF",
                    }}
                >
                    {ticket?.priceLabel || "Rs. 299"}
                </div>
                {live && (
                    <a
                        href={ticket.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="product_sans"
                        style={{
                            background: "#FFFFFF",
                            color: accent,
                            borderRadius: "999px",
                            padding: "1.2cqw 4cqw",
                            fontSize: "2.9cqw",
                            fontWeight: 500,
                            lineHeight: 1,
                            textDecoration: "none",
                        }}
                    >
                        Purchase
                    </a>
                )}
            </div>

            {/* Howrah Bridge skyline along the bottom of the main stub */}
            <img
                src="/ticket/howrah_bridge.svg"
                alt=""
                className="pointer-events-none absolute"
                style={{ left: "33.5%", bottom: "4%", width: "58%", height: "auto" }}
            />

            {/* Full-cover stamp — Coming Soon on default cards, SOLD OUT on server sold-out cards */}
            {!live && (
                <div
                    className="pointer-events-none absolute inset-0 flex items-center"
                    style={{
                        // Masked with the same asset, so the scrim never leaks
                        // past the notches. It also mutes the name and price so
                        // the stamp reads over them instead of fighting them.
                        background: isDefault
                            ? "rgba(0,0,0,0.45)"
                            : "rgba(0,0,0,0.35)",
                        ...maskWith(bg),
                    }}
                >
                    <div
                        className="product_sans w-full text-center"
                        style={{
                            background: "#FFFFFF",
                            color: "#0B0B0B",
                            padding: "2.6cqw 0",
                            fontSize: "5cqw",
                            fontWeight: 500,
                            lineHeight: 1,
                            letterSpacing: "0.01em",
                        }}
                    >
                        {stampLabel}
                    </div>
                </div>
            )}
        </div>
    );
};

const DEFAULT_CARDS = ["red", "blue", "green"].map((color, i) => ({
    key: `default-${i}`,
    name: "Super Early Bird",
    priceLabel: "Rs. 299",
    url: null,
    color,
    live: false,
    isActive: true,
    isComingSoon: true,
    source: "default",
}));

// Firestore doc (color, isActive, isCommingSoon, price, title, url) -> card
// model. A card is buyable only when it is active, not coming soon, and carries
// a purchase link.
const toCard = (t, i) => {
    const url = t.url || null;
    const isActive = t.isActive ?? false;
    const isComingSoon = t.isComingSoon ?? false;
    return {
        key: String(t.id ?? i),
        name: t.title || "Ticket",
        priceLabel: t.price != null ? `Rs. ${t.price}` : "Rs. 299",
        url,
        color: t.color,
        isActive,
        isComingSoon,
        live: isActive && !isComingSoon && !!url,
        source: "server",
    };
};

const TicketsSection = () => {
    const [headingP, setHeadingP] = useState(0);
    const [tickets, setTickets] = useState(DEFAULT_CARDS);
    const [cardP, setCardP] = useState(() => DEFAULT_CARDS.map(() => 0));
    const [stampStarted, setStampStarted] = useState(false);
    const [stampTick, setStampTick] = useState(0);
    const headingRef = useRef(null);
    const cardRefs = useRef([]);
    const sectionRef = useRef(null);
    const inViewRef = useRef(false);

    // Keep reveal progress in sync when the card count changes (4, 5, many...)
    useEffect(() => {
        setCardP((prev) => tickets.map((_, i) => prev[i] ?? 0));
    }, [tickets.length]);

    // No-auth load: Next.js server fetches Firebase, client just renders.
    // Success -> show every server ticket (live ones buyable, rest SOLD OUT).
    // Failure/empty -> keep the default 3 coming-soon cards.
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch("/api/tickets/view", { cache: "no-store" });
                if (!res.ok) return;
                const data = await res.json();
                if (!Array.isArray(data.tickets) || data.tickets.length === 0) return;
                if (!cancelled) setTickets(data.tickets.map(toCard));
            } catch {
                // keep DEFAULT_CARDS
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    // Scroll-driven reveal (bi-directional): fade in while scrolling down,
    // wrap back up while scrolling up.
    useEffect(() => {
        let raf;
        const update = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const vh = window.innerHeight;

                const h = headingRef.current;
                if (h) {
                    const r = h.getBoundingClientRect();
                    const s = vh * 0.9;
                    const e = vh * 0.55;
                    setHeadingP(
                        Math.min(1, Math.max(0, 1 - (r.top - e) / (s - e)))
                    );
                }

                cardRefs.current.forEach((c, i) => {
                    if (!c) return;
                    const r = c.getBoundingClientRect();
                    const s = vh;
                    const e = vh * 0.55;
                    setCardP((prev) => {
                        if (prev[i] === void 0) return prev;
                        const next = [...prev];
                        next[i] = 1 - Math.min(1, Math.max(0, (r.top - e) / (s - e)));
                        return next;
                    });
                });

                // Live-stamp: trigger once each time the section enters the screen
                // and keep it stamped while the user stops inside it.
                const section = sectionRef.current;
                if (section) {
                    const r = section.getBoundingClientRect();
                    const inView = r.top < vh && r.bottom > 0;
                    if (inView && !inViewRef.current) {
                        setStampStarted(true);
                        setStampTick((t) => t + 1);
                    }
                    inViewRef.current = inView;
                }
            });
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <section
            id="tickets"
            ref={sectionRef}
            className="relative w-full select-none"
        >
            <div className="relative mx-auto w-full max-w-[1120px] px-5 sm:px-8 md:px-10 xl:px-16">
                {/* Heading */}
                <h2
                    ref={headingRef}
                    className="product_sans w-full pt-10 text-center text-[32px] sm:text-[38px] md:pt-14 md:text-[44px] lg:text-[54px] xl:pt-20 xl:text-[64px]"
                    style={{
                        fontWeight: 500,
                        lineHeight: 0.95,
                        color: "#000000",
                        opacity: headingP,
                        transform: `translateY(${(1 - headingP) * 26}px)`,
                        transition:
                            "opacity 150ms linear, transform 150ms linear",
                    }}
                >
                    Grab your <span style={{ color: RED }}>Tickets</span>
                </h2>

                {/* Ticket cards — flexible: renders however many the server returns */}
                <div className="mt-8 mb-5 flex w-full flex-wrap justify-center gap-7 md:mt-12 md:gap-8 xl:mt-16 xl:mb-8 xl:gap-10">
                    {tickets.map((ticket, key) => (
                        <TicketCard
                            key={ticket.key}
                            ticket={ticket}
                            index={key}
                            stampStarted={stampStarted}
                            stampTick={stampTick}
                            reveal={{
                                opacity: cardP[key] ?? 0,
                                transform: `translateY(${(1 - (cardP[key] ?? 0)) * 22}px) scale(${0.85 + (cardP[key] ?? 0) * 0.15})`,
                            }}
                            revealRef={(el) => {
                                cardRefs.current[key] = el;
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TicketsSection;