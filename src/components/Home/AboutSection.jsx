"use client";

import { useEffect, useRef, useState } from "react";

// Photos laid out in a loose 3-column collage with visible gaps (~2% x, ~3% y).
const PHOTOS = [
    { src: "/desktop4/a6.webp", left: 5, top: 32, w: 22, h: 20.5 },
    { src: "/desktop4/a4.webp", left: 5, top: 55.8, w: 22, h: 20.5 },
    { src: "/desktop4/a1.webp", left: 5, top: 79.6, w: 22, h: 20.5 },
    { src: "/desktop4/a5.webp", left: 29, top: 55.8, w: 22, h: 20.5 },
    { src: "/desktop4/a2.webp", left: 29, top: 79.6, w: 22, h: 20.5 },
    { src: "/desktop4/a3.webp", left: 53, top: 79.6, w: 22, h: 20.5 },
];

// Paragraph with Figma's color-highlighted words. Each segment keeps its color;
// the array is flattened into word tokens so the scroll can fill them in order.
const SEGMENTS = [
    { t: "Devfest Kolkata is a ", c: "#000000" },
    { t: "space", c: "#f63130" },
    { t: " for ", c: "#000000" },
    { t: "developers", c: "#4787ea" },
    { t: " and ", c: "#000000" },
    { t: "designers", c: "#34a853" },
    { t: " who ", c: "#000000" },
    { t: "built with intent . We believe the ", c: "#000000" },
    { t: "future", c: "#fbbc04" },
    { t: " of technology starts with ", c: "#000000" },
    { t: "passion", c: "#f63130" },
    { t: " and shared ", c: "#000000" },
    { t: "knowledge", c: "#4787ea" },
    { t: ".", c: "#000000" },
];

const TOKENS = SEGMENTS.flatMap(({ t, c }) =>
    t.split(" ").map((w, i) => ({ t: i === 0 ? w : ` ${w}`, c }))
);

const AboutSection = () => {
    const textRef = useRef(null);
    const photoRefs = useRef([]);
    const [progress, setProgress] = useState(0);
    const [photoProgress, setPhotoProgress] = useState(() =>
        PHOTOS.map(() => 0)
    );
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px)");
        const onChange = () => setIsMobile(mq.matches);
        onChange();
        mq.addEventListener?.("change", onChange);
        return () => mq.removeEventListener?.("change", onChange);
    }, []);

    // Single scroll handler drives everything so it works in both directions:
    // scrolling down reveals (loads), scrolling up reverses (wraps up).
    useEffect(() => {
        let raf;
        const update = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const vh = window.innerHeight;

                // Word-by-word "text completes" progress.
                const el = textRef.current;
                if (el) {
                    const rect = el.getBoundingClientRect();
                    const start = vh * 0.85;
                    const end = vh * 0.4;
                    const p = (start - rect.top) / (start - end + rect.height);
                    setProgress(Math.min(1, Math.max(0, p)));
                }

                // Per-tile photo opacity, reverseable on scroll up.
                const next = [];
                const s = isMobile ? vh * 0.9 : vh;
                const e = isMobile ? vh * 0.5 : vh * 0.55;
                PHOTOS.forEach((_, i) => {
                    const t = photoRefs.current[i];
                    if (!t) {
                        next.push(0);
                        return;
                    }
                    const rect = t.getBoundingClientRect();
                    const p = 1 - Math.min(1, Math.max(0, (rect.top - e) / (s - e)));
                    next.push(p);
                });
                setPhotoProgress(next);
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
    }, [isMobile]);

    const showCount = Math.ceil(progress * TOKENS.length);

    const renderWords = () =>
        TOKENS.map((tok, i) => (
            <span
                key={i}
                style={{
                    color: tok.c,
                    opacity: i < showCount ? 1 : 0.13,
                    transition: "opacity 160ms ease",
                }}
            >
                {tok.t}
            </span>
        ));

    // Mobile: stacked full-width cards with real spacing so everything fits
    // and reveals fully. Desktop: the Figma percentage collage.
    if (isMobile) {
        return (
            <section
                id="about"
                className="relative w-full bg-white select-none"
                style={{ padding: "6vw 6vw calc(6vw + 36px)" }}
            >
                <div
                    ref={textRef}
                    className="product_sans pointer-events-none"
                    style={{
                        fontSize: "clamp(14px, 4.3vw, 19px)",
                        fontWeight: 500,
                        lineHeight: 1.45,
                        color: "#000000",
                        marginBottom: "7vw",
                    }}
                >
                    {renderWords()}
                </div>
                <div className="w-full flex flex-col">
                    {PHOTOS.map((p, i) => (
                        <div
                            key={p.src}
                            ref={(el) => {
                                photoRefs.current[i] = el;
                            }}
                            className="relative w-full"
                            style={{
                                marginBottom: i === PHOTOS.length - 1 ? 0 : "7vw",
                                aspectRatio: "4 / 3",
                                borderRadius: "21px",
                                overflow: "hidden",
                                opacity: photoProgress[i],
                                transform: `translateY(${(1 - photoProgress[i]) * 26}px) scale(${0.9 + photoProgress[i] * 0.1})`,
                                transformOrigin: "center",
                                transition:
                                    "opacity 150ms linear, transform 150ms linear",
                                boxShadow: "0px 6px 14px rgba(0,0,0,0.2)",
                            }}
                        >
                            <img
                                src={p.src}
                                alt=""
                                draggable={false}
                                loading="lazy"
                                className="block w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section
            id="about"
            className="relative w-full bg-white"
            style={{ paddingBottom: "clamp(24px, 4vw, 64px)" }}
        >
            <div
                className="relative w-full mx-auto"
                style={{
                    aspectRatio: "1440 / 1426",
                }}
            >
                {/* About paragraph — fills word by word on scroll */}
                <div
                    ref={textRef}
                    className="absolute product_sans pointer-events-none"
                    style={{
                        left: "45.3%",
                        top: "18.65%",
                        width: "45.9%",
                        fontSize: "clamp(16px, 3.47vw, 50px)",
                        fontWeight: 500,
                        lineHeight: 1.35,
                        color: "#000000",
                    }}
                >
                    {renderWords()}
                </div>

                {/* Photo collage — fades in one photo at a time on scroll */}
                {PHOTOS.map((p, i) => (
                    <div
                        key={p.src}
                        ref={(el) => {
                            photoRefs.current[i] = el;
                        }}
                        className="absolute"
                        style={{
                            left: `${p.left}%`,
                            top: `${p.top}%`,
                            width: `${p.w}%`,
                            height: `${p.h}%`,
                            borderRadius: "33px",
                            boxShadow:
                                i === 2
                                    ? "-6px 8px 12.6px 4px rgba(0,0,0,0.36)"
                                    : "0px 6px 12.6px 4px rgba(0,0,0,0.36)",
                            overflow: "hidden",
                            opacity: photoProgress[i],
                            transform: `translateY(${(1 - photoProgress[i]) * 20}px) scale(${0.85 + photoProgress[i] * 0.15})`,
                            transformOrigin: "center",
                            transition:
                                "opacity 150ms linear, transform 150ms linear",
                        }}
                    >
                        <img
                            src={p.src}
                            alt=""
                            draggable={false}
                            loading="lazy"
                            className="block w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AboutSection;