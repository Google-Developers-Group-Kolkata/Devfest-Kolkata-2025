"use client";

import { useEffect, useRef, useState } from "react";

const RED = "#F63130";
const INK = "#0B0B0B";

// Ticket artwork: the coloured border, the white body inside it, the corner
// radius and every notch come from these assets. Their own 959x317 box is the
// coordinate system for everything drawn on top, and the card is stretched to
// exactly that box. Which one a card wears is the `color` field on its
// Firestore doc; `accent` is that artwork's fill, reused for the perforation
// dashes and the purchase pill.
const PALETTE = {
    red: { bg: "/ticket/background-red.svg", accent: "#F63130" },
    blue: { bg: "/ticket/background-blue.svg", accent: "#4285F4" },
    green: { bg: "/ticket/background-green.svg", accent: "#34A853" },
    yellow: { bg: "/ticket/background-yellow.svg", accent: "#FBBC04" },
};

const paletteFor = (color) =>
    PALETTE[String(color ?? "").toLowerCase()] ?? PALETTE.red;

const TICKET_W = 959;
const TICKET_H = 317;

// The artwork's landmarks, read off the asset in its own units. The two
// perforations are the notch pairs top and bottom, and they cut the ticket
// into three stubs: barcode, middle, price.
const BODY = { left: 14.23, right: 945.43, top: 11.25, bottom: 304.44 };
const PERF_L = 143.12;
const PERF_R = 740.1;
const NOTCH_TOP = 37.72; // where the top notches bottom out
const NOTCH_BOTTOM = 277.97; // and where the bottom pair begins

const px = (v) => `${(v / TICKET_W) * 100}%`;
const py = (v) => `${(v / TICKET_H) * 100}%`;
// The card holds a fixed aspect ratio, so one artwork unit is the same
// fraction of its width whichever axis it is measured on: `cq` sizes the type
// and the gaps, which have to scale with the card rather than the viewport.
const cq = (v) => `${(v / TICKET_W) * 100}cqw`;

// Venue and date are the same on every ticket, so they live here rather than
// in each Firestore doc — a doc can still override either with its own
// `venue` or `date` string.
const EVENT_VENUE = "The Westin Kolkata, Rajarhat";
const EVENT_DATE = "22nd November, 2026";

// Clips an overlay to the ticket silhouette, so nothing leaks past the notches.
const maskWith = (bg) => ({
    WebkitMaskImage: `url(${bg})`,
    maskImage: `url(${bg})`,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
});

// The name sits in the price stub, which is only 205 units wide, so a long
// one has to step down to keep to three lines.
const nameSizeFor = (name) => {
    const n = (name || "").length;
    if (n <= 12) return cq(23);
    if (n <= 18) return cq(21);
    if (n <= 28) return cq(18);
    return cq(15);
};

// Type on the card scales with the card, which holds down to roughly a 520px
// ticket and turns to specks below it. `floor` keeps the pieces that carry
// meaning — name, price, the purchase pill — legible on a phone, and the
// venue and date, which no floor can fit into their share of a 350px ticket,
// are dropped there instead: the Venue section right below says both.
const floor = (min, size) => `max(${min}px, ${size})`;

// The barcode is decoration, not a scannable symbol: the bars are derived from
// the ticket's purchase url, so they are stable between renders and differ from
// ticket to ticket, with nothing extra to ship or to store. Even indices are
// bars, odd ones the gaps between them. It reads turned a quarter-turn, the way
// a stub barcode does, so the bars run across the stub and the scan axis down
// it — which is also what gives them room: 225 of the artwork's units to stack
// in rather than the stub's 75 of width.
const BAR_COUNT = 25;

const barsFor = (seed) => {
    let h = 2166136261;
    const key = String(seed ?? "ticket");
    for (let i = 0; i < key.length; i++) {
        h = Math.imul(h ^ key.charCodeAt(i), 16777619);
    }
    const bars = [];
    for (let i = 0; i < BAR_COUNT; i++) {
        h = Math.imul(h ^ (h >>> 15), 2246822507);
        bars.push(1 + ((h >>> 9) % 3));
    }
    return bars;
};

const Barcode = ({ seed }) => (
    <div className="flex h-full w-full flex-col items-stretch" aria-hidden="true">
        {barsFor(seed).map((weight, i) => (
            <div
                key={i}
                style={{
                    flex: `${weight} 0 0`,
                    background: i % 2 ? "transparent" : INK,
                }}
            />
        ))}
    </div>
);

const TicketCard = ({ reveal, revealRef, stampStarted, stampTick, index, ticket }) => {
    const live = ticket?.live && ticket?.url;
    const isDefault = ticket?.source !== "server";
    const { bg, accent } = paletteFor(ticket?.color);
    // Sold out only applies to a real ticket Firebase has switched off;
    // everything else that can't be bought yet reads as coming soon.
    const stampLabel =
        !isDefault && !ticket?.isActive ? "Sold Out" : "Coming Soon";
    const name = ticket?.name || "Super Early Bird";
    return (
        <div
            ref={revealRef}
            onClick={() => {
                if (live) window.open(ticket.url, "_blank", "noopener,noreferrer");
            }}
            className="relative w-full max-w-[760px] overflow-hidden"
            style={{
                aspectRatio: `${TICKET_W} / ${TICKET_H}`,
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
            {/* The two stub perforations, run between the notches so the dashes
                start and stop exactly where the artwork is cut. */}
            <svg
                viewBox={`0 0 ${TICKET_W} ${TICKET_H}`}
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden="true"
            >
                {[PERF_L, PERF_R].map((x) => (
                    <path
                        key={x}
                        d={`M ${x} ${NOTCH_TOP + 4} V ${NOTCH_BOTTOM - 4}`}
                        stroke={accent}
                        strokeWidth="2.6"
                        strokeDasharray="10 8"
                        strokeLinecap="round"
                    />
                ))}
            </svg>

            {/* Barcode stub. The quarter-turn is in the bars themselves —
                stacked rather than side by side — because turning this box
                instead would swing its 225 units of height across a stub only
                129 wide. A ticket with no url yet falls back to its own key, so
                the coming-soon cards still differ from each other. */}
            <div
                className="pointer-events-none absolute"
                style={{
                    left: px(BODY.left + 27),
                    top: py(46),
                    width: px(PERF_L - BODY.left - 54),
                    height: py(225),
                }}
            >
                <Barcode seed={ticket?.url || ticket?.key} />
            </div>

            {/* Middle stub: the lockup, then the venue and date either side of
                the memorial's dome. */}
            <div
                className="pointer-events-none absolute flex items-center justify-center"
                style={{
                    left: px(PERF_L),
                    width: px(PERF_R - PERF_L),
                    top: py(36),
                    height: py(52),
                    gap: cq(13),
                }}
            >
                <img
                    src="/logo-brackets.svg"
                    alt=""
                    style={{ height: cq(38), width: "auto", flex: "0 0 auto" }}
                />
                <span
                    className="product_sans whitespace-nowrap"
                    style={{
                        fontSize: cq(46),
                        fontWeight: 700,
                        lineHeight: 1,
                        color: INK,
                        letterSpacing: "-0.01em",
                    }}
                >
                    DevFest
                </span>
                <span
                    className="product_sans whitespace-nowrap"
                    style={{
                        background: "#ECECEC",
                        color: INK,
                        borderRadius: "999px",
                        padding: `${floor(3, cq(7))} ${floor(7, cq(16))}`,
                        fontSize: floor(9, cq(21)),
                        fontWeight: 500,
                        lineHeight: 1,
                    }}
                >
                    Kolkata
                </span>
            </div>

            <div
                className="product_sans pointer-events-none absolute @max-[520px]:hidden"
                style={{
                    left: px(PERF_L + 30),
                    top: py(101),
                    width: px(175),
                    fontSize: cq(16.5),
                    fontWeight: 500,
                    lineHeight: 1.3,
                    color: INK,
                }}
            >
                {ticket?.venue || EVENT_VENUE}
            </div>

            <div
                className="product_sans pointer-events-none absolute text-right @max-[520px]:hidden"
                style={{
                    right: px(TICKET_W - PERF_R + 26),
                    top: py(101),
                    width: px(150),
                    fontSize: cq(16.5),
                    fontWeight: 500,
                    lineHeight: 1.3,
                    color: INK,
                }}
            >
                {ticket?.date || EVENT_DATE}
            </div>

            <img
                src="/ticket/victoria-memorial.svg"
                alt=""
                className="pointer-events-none absolute"
                style={{
                    left: px((PERF_L + PERF_R) / 2 - 186),
                    bottom: py(TICKET_H - BODY.bottom + 2),
                    width: px(372),
                    height: "auto",
                }}
            />

            {/* Price stub: the ticket's name up top, its price low down, and
                the purchase pill below that once the ticket is buyable. */}
            <div
                className="product_sans pointer-events-none absolute text-center"
                title={name}
                style={{
                    left: px(PERF_R),
                    width: px(BODY.right - PERF_R),
                    top: py(42),
                    padding: `0 ${cq(14)}`,
                    fontSize: floor(11, nameSizeFor(name)),
                    fontWeight: 500,
                    lineHeight: 1.25,
                    color: INK,
                    textTransform: "uppercase",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    overflowWrap: "anywhere",
                }}
            >
                {name}
            </div>

            <div
                className="product_sans pointer-events-none absolute text-center whitespace-nowrap"
                style={{
                    left: px(PERF_R),
                    width: px(BODY.right - PERF_R),
                    bottom: py(live ? 104 : 74),
                    fontSize: floor(12, cq(23)),
                    fontWeight: 500,
                    lineHeight: 1,
                    color: INK,
                }}
            >
                {ticket?.priceLabel || "Rs. 299"}
            </div>

            {live && (
                <div
                    className="absolute flex justify-center"
                    style={{
                        left: px(PERF_R),
                        width: px(BODY.right - PERF_R),
                        bottom: py(30),
                    }}
                >
                    <a
                        href={ticket.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="product_sans"
                        style={{
                            background: accent,
                            color: "#FFFFFF",
                            borderRadius: "999px",
                            padding: `${floor(4, cq(8))} ${floor(7, cq(22))}`,
                            fontSize: floor(10, cq(18)),
                            fontWeight: 500,
                            lineHeight: 1,
                            textDecoration: "none",
                        }}
                    >
                        Purchase
                    </a>
                </div>
            )}

            {/* Full-cover stamp — Coming Soon on default cards, Sold Out on a
                server ticket Firebase has switched off */}
            {!live && (
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        // Masked with the same asset, so the scrim never leaks
                        // past the notches. It also mutes the stub contents so
                        // the stamp reads over them instead of fighting them.
                        background: isDefault
                            ? "rgba(0,0,0,0.38)"
                            : "rgba(0,0,0,0.30)",
                        ...maskWith(bg),
                    }}
                >
                    {/* Sat between the venue line and the price rather than
                        mid-card: it lands on the memorial, the one band of the
                        ticket that carries no words. */}
                    <div
                        className="product_sans absolute w-full text-center"
                        style={{
                            top: py(148),
                            left: 0,
                            background: "#FFFFFF",
                            color: INK,
                            padding: `${cq(11)} 0`,
                            fontSize: floor(14, cq(34)),
                            fontWeight: 500,
                            lineHeight: 1,
                            letterSpacing: "0.01em",
                            boxShadow: "0 2px 14px rgba(0,0,0,0.30)",
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

// Firestore doc (color, isActive, isCommingSoon, price, title, url, and
// optionally venue and date) -> card model. A card is buyable only when it is active, not coming soon, and carries
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
        // Both optional: the card falls back to the event-wide strings.
        venue: t.venue || null,
        date: t.date || null,
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

                {/* Ticket cards — flexible: renders however many the server
                    returns. One to a row: the artwork is close to 3:1, so
                    side by side would leave the venue and date too small to
                    read at any sensible page width. */}
                <div className="mt-8 mb-5 flex w-full flex-col items-center gap-6 md:mt-12 md:gap-7 xl:mt-16 xl:mb-8 xl:gap-8">
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