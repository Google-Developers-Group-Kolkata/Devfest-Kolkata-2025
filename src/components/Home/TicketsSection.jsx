"use client";

import { useEffect, useRef, useState } from "react";

const LEFT_DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const RIGHT_DIGITS = ["5", "3", "8", "5", "9", "12", "1", "9"];

const TicketCard = ({ isMobile, reveal, revealRef }) => (
    <div
        ref={revealRef}
        className="relative bg-white border-2 border-solid border-black overflow-hidden"
        style={{
            aspectRatio: "369 / 443",
            borderRadius: "45px",
            flex: isMobile ? "0 0 auto" : "1 1 0",
            width: isMobile ? "min(86vw, 420px)" : "100%",
            maxWidth: isMobile ? "420px" : "min(32vw, 520px)",
            opacity: reveal.opacity,
            transform: reveal.transform,
            transformOrigin: "center",
            transition: "opacity 150ms linear, transform 150ms linear",
        }}
    >
        {/* TRAM — top center of stub */}
        <div
            className="absolute product_sans pointer-events-none whitespace-nowrap"
            style={{
                left: "50%",
                top: "1.5%",
                transform: "translateX(-50%)",
                fontSize: isMobile
                    ? "clamp(24px, 7vw, 34px)"
                    : "clamp(40px, 3.2vw, 50px)",
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
                fontSize: isMobile
                    ? "clamp(18px, 5.8vw, 30px)"
                    : "clamp(30px, 2.6vw, 40px)",
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
                fontSize: isMobile
                    ? "clamp(10px, 2.8vw, 16px)"
                    : "clamp(15px, 1.3vw, 20px)",
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
                fontSize: isMobile
                    ? "clamp(16px, 5vw, 26px)"
                    : "clamp(28px, 2.4vw, 38px)",
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
                fontSize: isMobile
                    ? "clamp(16px, 5vw, 26px)"
                    : "clamp(28px, 2.4vw, 38px)",
                lineHeight: 1,
                color: "#000000",
            }}
        >
            {RIGHT_DIGITS.map((d, i) => (
                <span key={i}>{d}</span>
            ))}
        </div>

        {/* Ticket info */}
        <div
            className="absolute product_sans pointer-events-none"
            style={{
                left: "21%",
                top: "20%",
                fontSize: isMobile
                    ? "clamp(18px, 5.2vw, 28px)"
                    : "clamp(28px, 2.4vw, 37px)",
                fontWeight: 500,
                lineHeight: 1.05,
                color: "#000000",
            }}
        >
            <div>SUPER EARLY</div>
            <div style={{ paddingLeft: "3.4em" }}>BIRD</div>
        </div>
        <div
            className="absolute product_sans pointer-events-none"
            style={{
                left: "21%",
                top: "78%",
                fontSize: isMobile
                    ? "clamp(24px, 8vw, 40px)"
                    : "clamp(42px, 3.5vw, 55px)",
                fontWeight: 500,
                lineHeight: 1,
                color: "#000000",
            }}
        >
            Rs 499
        </div>
        <div
            className="absolute product_sans pointer-events-none"
            style={{
                left: "21%",
                top: "94%",
                fontSize: isMobile
                    ? "clamp(14px, 4.4vw, 24px)"
                    : "clamp(22px, 1.9vw, 28px)",
                fontWeight: 300,
                lineHeight: 1,
                color: "#4787ea",
            }}
        >
            GDG Kolkata
        </div>
    </div>
);

const TicketsSection = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [headingP, setHeadingP] = useState(0);
    const [cardP, setCardP] = useState(() => [0, 0, 0]);
    const headingRef = useRef(null);
    const cardRefs = useRef([]);

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

                {/* Ticket cards */}
                <div
                    className="w-full flex"
                    style={{
                        flexWrap: isMobile ? "wrap" : "nowrap",
                        justifyContent: isMobile ? "center" : "center",
                        gap: isMobile ? "7vw" : "clamp(20px, 3.5vw, 56px)",
                        marginTop: isMobile ? "6vw" : "clamp(28px, 7vw, 92px)",
                        marginBottom: "clamp(16px, 3vw, 40px)",
                    }}
                >
                    {[0, 1, 2].map((key) => (
                        <TicketCard
                            key={key}
                            isMobile={isMobile}
                            reveal={{
                                opacity: cardP[key],
                                transform: `translateY(${(1 - cardP[key]) * 22}px) scale(${0.85 + cardP[key] * 0.15})`,
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