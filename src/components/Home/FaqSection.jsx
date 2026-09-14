"use client";

import { useEffect, useState } from "react";

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
    <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        className="flex-none"
        style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 250ms ease",
        }}
    >
        <path
            d="M6 9l6 6 6-6"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
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

    return (
        <section
            id="faqs"
            className="relative w-full bg-white select-none"
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
                                className="bg-black cursor-pointer"
                                style={{
                                    border: `${isMobile ? 3 : 5}px solid #f63130`,
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
                                <div
                                    className="product_sans"
                                    style={{
                                        maxHeight: open ? "240px" : "0px",
                                        overflow: "hidden",
                                        transition: "max-height 300ms ease",
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: isMobile
                                                ? "0 16px 20px"
                                                : "0 40px 24px",
                                            paddingTop: 0,
                                            fontSize: isMobile
                                                ? "clamp(13px, 4vw, 16px)"
                                                : "clamp(15px, 1.4vw, 18px)",
                                            lineHeight: 1.5,
                                            color: "rgba(255,255,255,0.82)",
                                        }}
                                    >
                                        {f.a}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;