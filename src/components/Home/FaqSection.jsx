"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Google's own easing curve, shared by the chevron and the answer panel so the
// two halves of a toggle move as one gesture.
const EASE = [0.4, 0, 0.2, 1];

const FAQS = [
    {
        n: "01",
        q: "What is DevFest Kolkata 2026 ?",
        a: "DevFest Kolkata 2026 is the annual flagship event of Google Developer Groups Kolkata — a full day of talks, hands-on workshops and networking powered by Google technologies.",
    },
    {
        n: "02",
        q: "Who can attend DevFest Kolkata?",
        a: "Anyone interested in technology is welcome — students, developers, designers and tech professionals of every skill level.",
    },
    {
        n: "03",
        q: "What is included with the conference pass ?",
        a: "Access to all talks and workshops, networking with speakers, refreshments and exclusive GDG Kolkata goodies.",
    },
    {
        n: "04",
        q: "How do I get my ticket ?",
        a: "Tap Get Tickets or the Tickets link in the menu, pick your pass and complete your booking instantly.",
    },
];

const Chevron = ({ open }) => (
    <motion.svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        className="flex-none"
        initial={false}
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.35, ease: EASE }}
    >
        <path
            d="M6 9l6 6 6-6"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </motion.svg>
);

const FaqSection = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [openIndex, setOpenIndex] = useState(0);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px)");
        const onChange = () => setIsMobile(mq.matches);
        onChange();
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
    }, []);

    const answersFont = isMobile
        ? "clamp(15px, 4.6vw, 23px)"
        : "clamp(17px, 1.9vw, 23px)";
    // The gradient ring is painted by a masked pseudo-element rather than a
    // real border, so the card pads itself by the same amount to keep the
    // content inset it had.
    const ring = isMobile ? 3 : 5;

    return (
        <section
            id="faqs"
            className="relative w-full select-none"
        >
            <div
                className="w-full flex"
                style={{
                    padding: isMobile
                        ? "0 6vw"
                        : "0 clamp(20px, 5vw, 72px)",
                    alignItems: "center",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? "7vw" : "clamp(24px, 4vw, 64px)",
                    paddingBottom: isMobile
                        ? "10vw"
                        : "clamp(50px, 8vw, 130px)",
                }}
            >
                {/* Left block — 04 / ANSWERS */}
                <div
                    className="flex flex-col"
                    style={{
                        flex: isMobile ? "0 0 auto" : "0 0 auto",
                        width: isMobile ? "100%" : "min(31vw, 447px)",
                        textAlign: isMobile ? "center" : "left",
                    }}
                >
                    <div
                        className="product_sans pointer-events-none"
                        style={{
                            fontSize: isMobile
                                ? "clamp(72px, 22vw, 120px)"
                                : "clamp(90px, 10.4vw, 150px)",
                            fontWeight: 500,
                            lineHeight: 0.9,
                            letterSpacing: "-7.5px",
                            color: "#c1c1c1",
                        }}
                    >
                        04
                    </div>
                    <div
                        className="product_sans pointer-events-none"
                        style={{
                            paddingTop: "1vw",
                            fontSize: isMobile
                                ? "clamp(16px, 4.8vw, 22px)"
                                : "clamp(20px, 2vw, 28px)",
                            fontWeight: 300,
                            lineHeight: 1.3,
                            color: "#000000",
                        }}
                    >
                        <div>ANSWERS,</div>
                        <div>STRAIGHT FROM</div>
                        <div>THE ORGANISER</div>
                    </div>
                </div>

                {/* Right column — FAQ rows */}
                <div
                    className="flex flex-col"
                    style={{
                        flex: "1 1 0",
                        width: isMobile ? "100%" : "auto",
                        gap: isMobile ? "4vw" : "clamp(20px, 3vw, 43px)",
                    }}
                >
                    {FAQS.map((f, i) => {
                        const open = openIndex === i;
                        return (
                            <div
                                key={f.n}
                                className="google-gradient-border bg-black cursor-pointer"
                                style={{
                                    "--gb-width": `${ring}px`,
                                    padding: `${ring}px`,
                                    borderRadius: isMobile ? "24px" : "30px",
                                    overflow: "hidden",
                                }}
                                onClick={() =>
                                    setOpenIndex(open ? -1 : i)
                                }
                            >
                                <div
                                    className="w-full flex items-center"
                                    style={{
                                        minHeight: isMobile ? "72px" : "92px",
                                        padding: isMobile
                                            ? "0 16px"
                                            : "0 40px",
                                        gap: isMobile ? "12px" : "24px",
                                    }}
                                >
                                    <span
                                        className="product_sans"
                                        style={{
                                            fontSize: isMobile
                                                ? "clamp(22px, 7vw, 30px)"
                                                : "clamp(26px, 2.4vw, 35px)",
                                            fontWeight: 500,
                                            lineHeight: 1,
                                            letterSpacing: "-1.75px",
                                            color: "#ffffff",
                                            width: "48px",
                                        }}
                                    >
                                        {f.n}
                                    </span>
                                    <span
                                        className="product_sans flex-1"
                                        style={{
                                            fontSize: answersFont,
                                            lineHeight: 1.25,
                                            color: "#ffffff",
                                        }}
                                    >
                                        {f.q}
                                    </span>
                                    <Chevron open={open} />
                                </div>
                                {/* `initial={false}` so the row that starts
                                    open is simply open on load rather than
                                    unrolling itself. */}
                                <AnimatePresence initial={false}>
                                    {open && (
                                        <motion.div
                                            key="answer"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{
                                                height: {
                                                    duration: 0.35,
                                                    ease: EASE,
                                                },
                                                opacity: {
                                                    duration: 0.25,
                                                    ease: "easeInOut",
                                                },
                                            }}
                                            style={{ overflow: "hidden" }}
                                        >
                                            <div
                                                className="product_sans"
                                                style={{
                                                    padding: isMobile
                                                        ? "0 16px 20px"
                                                        : "0 40px 24px",
                                                    fontSize: isMobile
                                                        ? "clamp(13px, 4vw, 16px)"
                                                        : "clamp(15px, 1.4vw, 18px)",
                                                    lineHeight: 1.5,
                                                    color: "rgba(255,255,255,0.82)",
                                                }}
                                            >
                                                {f.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;