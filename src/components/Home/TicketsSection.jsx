"use client";

import { useEffect, useRef, useState } from "react";

const LEFT_DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const RIGHT_DIGITS = ["5", "3", "8", "5", "9", "12", "1", "9"];

const TicketCard = ({ isMobile, reveal, revealRef, stampStarted, stampTick, index, ticket }) => {
    const live = ticket?.live && ticket?.url;
    const isDefault = ticket?.source !== "server";
    const nameLen = (ticket?.name || "").length;
    const nameSize = nameLen <= 12 ? "9cqw" : nameLen <= 22 ? "7cqw" : "5.5cqw";
    return (
    <div
        ref={revealRef}
        onClick={() => {
            if (live) window.open(ticket.url, "_blank", "noopener,noreferrer");
        }}
        className="relative bg-white border-2 border-solid border-black overflow-hidden"
        style={{
            aspectRatio: "369 / 443",
            borderRadius: "45px",
            flex: isMobile ? "0 0 auto" : "0 1 400px",
            width: isMobile ? "min(86vw, 420px)" : "100%",
            maxWidth: isMobile ? "420px" : "420px",
            containerType: "inline-size",
            opacity: reveal.opacity,
            transform: reveal.transform,
            transformOrigin: "center",
            transition: "opacity 150ms linear, transform 150ms linear",
            cursor: live ? "pointer" : "default",
        }}
    >
        {/* TRAM — top center of stub */}
        <div
            className="absolute product_sans pointer-events-none whitespace-nowrap"
            style={{
                left: "50%",
                top: "1.5%",
                transform: "translateX(-50%)",
                fontSize: "11cqw",
                fontWeight: 500,
                lineHeight: 1,
                color: "#4787ea",
                letterSpacing: "0.02em",
            }}
        >
            TRAM
        </div>

        {/* UP / DOWN — rotated vertical stub labels */}
        <div
            className="absolute product_sans pointer-events-none"
            style={{
                left: "1.5%",
                top: "1%",
                transform: "rotate(-90deg)",
                transformOrigin: "left top",
                fontSize: "9cqw",
                fontWeight: 500,
                lineHeight: 1,
                color: "#000000",
            }}
        >
            UP
        </div>
        <div
            className="absolute product_sans pointer-events-none"
            style={{
                left: "88%",
                top: "0.5%",
                transform: "rotate(-90deg)",
                transformOrigin: "left top",
                fontSize: "4.5cqw",
                fontWeight: 500,
                lineHeight: 1,
                color: "#000000",
            }}
        >
            DOWN
        </div>

        {/* Perforation box: two vertical dashed lines framing the stub columns */}
        <div
            className="absolute inset-y-0"
            style={{
                left: "14%",
                borderLeft: "2px dashed #000000",
            }}
        />
        <div
            className="absolute inset-y-0"
            style={{
                left: "86.5%",
                borderLeft: "2px dashed #000000",
            }}
        />
        {/* Horizontal perforation under the stub header */}
        <div
            className="absolute left-0 right-0"
            style={{
                top: "16%",
                borderTop: "2px dashed #000000",
            }}
        />
        {/* Row dividers */}
        <div
            className="absolute"
            style={{
                top: "38%",
                left: "13.6%",
                width: "73%",
                borderTop: "2px dashed #000000",
            }}
        />
        <div
            className="absolute"
            style={{
                top: "70.8%",
                left: "13.6%",
                width: "73%",
                borderTop: "2px dashed #000000",
            }}
        />
        <div
            className="absolute"
            style={{
                top: "89.8%",
                left: "13.6%",
                width: "73%",
                borderTop: "2px dashed #000000",
            }}
        />

        {/* Edge serial-number strips (perforation rows) */}
        <div
            className="absolute product_sans flex flex-col pointer-events-none"
            style={{
                left: "2.5%",
                top: "9%",
                bottom: "5%",
                justifyContent: "space-between",
                fontSize: "8.5cqw",
                lineHeight: 1,
                color: "#000000",
            }}
        >
            {LEFT_DIGITS.map((d, i) => (
                <span key={i}>{d}</span>
            ))}
        </div>
        <div
            className="absolute product_sans flex flex-col pointer-events-none"
            style={{
                left: "89.5%",
                top: "9%",
                bottom: "5%",
                justifyContent: "space-between",
                fontSize: "8.5cqw",
                lineHeight: 1,
                color: "#000000",
            }}
        >
            {RIGHT_DIGITS.map((d, i) => (
                <span key={i}>{d}</span>
            ))}
        </div>

        {/* Ticket info — shrinks with name length, clamps to 3 lines */}
        <div
            className="absolute product_sans pointer-events-none"
            title={ticket?.name}
            style={{
                left: "21%",
                right: "14%",
                top: "19%",
                fontSize: nameSize,
                fontWeight: 500,
                lineHeight: 1.1,
                color: "#000000",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                overflowWrap: "anywhere",
            }}
        >
            {ticket?.name || "SUPER EARLY BIRD"}
        </div>
        <div
            className="absolute product_sans pointer-events-none"
            style={{
                left: "21%",
                top: "76%",
                fontSize: "10cqw",
                fontWeight: 500,
                lineHeight: 1,
                color: "#000000",
                whiteSpace: "nowrap",
            }}
        >
            {ticket?.priceLabel || "Rs 499"}
        </div>
        {(isDefault || live) && (
        <div
            className="absolute product_sans"
            style={{
                left: "21%",
                top: "92%",
                fontSize: "6.5cqw",
                fontWeight: 500,
                lineHeight: 1,
                color: "#4787ea",
                pointerEvents: live ? "auto" : "none",
            }}
        >
            {live ? (
                <a
                    href={ticket.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ color: "inherit", textDecoration: "none" }}
                >
                    Purchase
                </a>
            ) : (
                <span className="pointer-events-none">Purchase</span>
            )}
        </div>
        )}

        {/* Full-cover stamp — Coming Soon on default cards, SOLD OUT on server sold-out cards */}
        {!live && (
        <div
            className="absolute product_sans pointer-events-none flex items-center justify-center"
            style={{
                inset: 0,
                borderRadius: "45px",
                background: isDefault ? "rgba(255,255,255,0.3)" : "transparent",
                backdropFilter: isDefault ? "blur(18px)" : "none",
                WebkitBackdropFilter: isDefault ? "blur(18px)" : "none",
            }}
        >
            <div
                key={`${stampTick}-${index}`}
                className={`ticket-stamp ${stampStarted ? "ticket-stamp-go" : ""}`}
                style={{
                    opacity: 0,
                    position: "absolute",
                    inset: 0,
                    padding: isMobile ? "5%" : "3.5%",
                    boxSizing: "border-box",
                    animationDelay: `${index * 320}ms`,
                }}
            >
                {/* Full-ticket red-bordered stamp (SVG) */}
                <svg
                    viewBox="0 0 369 443"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="xMidYMid meet"
                    style={{ display: "block", overflow: "visible" }}
                >
                    <defs>
                        <linearGradient
                            id="inkFade"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                        >
                            <stop offset="0%" stopColor="#E02020" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#B3120E" stopOpacity="0.75" />
                        </linearGradient>
                    </defs>

                    {/* outer red border */}
                    <rect
                        x="12"
                        y="12"
                        width="345"
                        height="419"
                        rx="30"
                        fill="rgba(224,32,32,0.07)"
                        stroke="#E02020"
                        strokeWidth="7"
                    />

                    {/* inner dashed border */}
                    <rect
                        x="28"
                        y="28"
                        width="313"
                        height="387"
                        rx="20"
                        fill="none"
                        stroke="#E02020"
                        strokeWidth="3"
                        strokeDasharray="14 9"
                    />

                    {/* corner brackets between the borders */}
                    {[
                        [12, 12],
                        [357, 12],
                        [12, 431],
                        [357, 431],
                    ].map(([cx, cy], i) => (
                        <rect
                            key={i}
                            x={cx - 20}
                            y={cy - 20}
                            width="40"
                            height="40"
                            rx="8"
                            fill="none"
                            stroke="#E02020"
                            strokeWidth="6"
                        />
                    ))}

                    {/* top banner text */}
                    <text
                        x="184.5"
                        y="102"
                        textAnchor="middle"
                        fill="url(#inkFade)"
                        fontSize="26"
                        fontWeight="800"
                        letterSpacing="10"
                    >
                        OFFICIAL
                    </text>

                    {/* center stamp — COMING SOON on defaults, SOLD OUT on sold-out */}
                    <g transform="rotate(-18 184.5 221.5)">
                        <text
                            x="184.5"
                            y="212"
                            textAnchor="middle"
                            fill="url(#inkFade)"
                            fontSize="52"
                            fontWeight="900"
                            letterSpacing="4"
                        >
                            {isDefault ? "COMING" : "SOLD"}
                        </text>
                        <text
                            x="184.5"
                            y="264"
                            textAnchor="middle"
                            fill="url(#inkFade)"
                            fontSize="52"
                            fontWeight="900"
                            letterSpacing="4"
                        >
                            {isDefault ? "SOON" : "OUT"}
                        </text>
                        <text
                            x="184.5"
                            y="286"
                            textAnchor="middle"
                            fill="url(#inkFade)"
                            fontSize="18"
                            fontWeight="700"
                            letterSpacing="8"
                        >
                            ••••••
                        </text>
                    </g>

                    {/* bottom banner */}
                    <text
                        x="184.5"
                        y="368"
                        textAnchor="middle"
                        fill="url(#inkFade)"
                        fontSize="20"
                        fontWeight="800"
                        letterSpacing="6"
                    >
                        NOT FOR SALE
                    </text>
                </svg>
            </div>
        </div>
        )}
    </div>
    );
};

const DEFAULT_CARDS = [0, 1, 2].map((i) => ({
    key: `default-${i}`,
    name: "SUPER EARLY BIRD",
    priceLabel: "Rs 499",
    url: null,
    live: false,
    source: "default",
}));

// Server ticket (same shape as main branch) -> tram card model.
// A card is live only when Firebase marks it available AND gives a purchase link.
const toCard = (t, i) => {
    const url = t.url || null;
    return {
        key: String(t.slug ?? t.id ?? i),
        name: t.title || t.name || "Ticket",
        priceLabel: t.price != null ? `Rs ${t.price}` : "Rs 499",
        url,
        live: (t.available ?? true) && !!url,
        source: "server",
    };
};

const TicketsSection = () => {
    const [isMobile, setIsMobile] = useState(false);
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

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px)");
        const onChange = () => setIsMobile(mq.matches);
        onChange();
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
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
            className="relative w-full bg-white select-none"
        >
            <div
                className="relative w-full"
                style={{
                    padding: isMobile ? "0 6vw" : "0 clamp(20px, 5vw, 72px)",
                }}
            >
                {/* Heading */}
                <h2
                    ref={headingRef}
                    className="product_sans w-full"
                    style={{
                        textAlign: "center",
                        fontSize: isMobile
                            ? "clamp(40px, 12.5vw, 62px)"
                            : "clamp(48px, 8.4vw, 100px)",
                        fontWeight: 500,
                        lineHeight: 0.95,
                        color: "#000000",
                        paddingTop: isMobile ? "8vw" : "clamp(40px, 6vw, 90px)",
                        opacity: headingP,
                        transform: `translateY(${(1 - headingP) * 26}px)`,
                        transition:
                            "opacity 150ms linear, transform 150ms linear",
                    }}
                >
                    Grab your Tickets
                </h2>

                {/* Ticket cards — flexible: renders however many the server returns */}
                <div
                    className="w-full flex"
                    style={{
                        flexWrap: "wrap",
                        justifyContent: isMobile ? "center" : "center",
                        gap: isMobile ? "7vw" : "clamp(20px, 3.5vw, 56px)",
                        marginTop: isMobile ? "6vw" : "clamp(28px, 7vw, 92px)",
                        marginBottom: "clamp(16px, 3vw, 40px)",
                    }}
                >
                    {tickets.map((ticket, key) => (
                        <TicketCard
                            key={ticket.key}
                            ticket={ticket}
                            index={key}
                            isMobile={isMobile}
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

                {/* Subheading */}
                <h2
                    className="product_sans w-full"
                    style={{
                        textAlign: "center",
                        fontSize: isMobile
                            ? "clamp(40px, 12.5vw, 62px)"
                            : "clamp(48px, 8.4vw, 100px)",
                        fontWeight: 500,
                        lineHeight: 1,
                        color: "#000000",
                        paddingTop: isMobile ? "4vw" : "clamp(30px, 4vw, 60px)",
                        paddingBottom: isMobile
                            ? "8vw"
                            : "clamp(40px, 6vw, 90px)",
                    }}
                >
                    Everything you
                    <br />
                    need to <span style={{ color: "#4787ea" }}>know....</span>
                </h2>
            </div>
        </section>
    );
};

export default TicketsSection;