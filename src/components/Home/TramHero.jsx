"use client";

import { useEffect, useState } from "react";
import AboutSection from "./AboutSection";
import TicketsSection from "./TicketsSection";
import FaqSection from "./FaqSection";
import FooterSection from "./FooterSection";

// Desktop 3 collage — Kolkata landmark tiles (design px 1440x1024 -> % of viewport).
// Each tile also carries a scatter direction (dx/dy in vw/vh, rot in deg).
const TILES = [
    { src: "/desktop3/kolkata-1.webp", left: 7.85, top: 38.9, w: 19.86, h: 27.9, dx: -18, dy: -18, rot: -12 },
    { src: "/desktop3/interior.webp", left: 27.7, top: 30.0, w: 15.97, h: 22.07, dx: 0, dy: -24, rot: 8 },
    { src: "/desktop3/kalighat.webp", left: 27.7, top: 52.05, w: 15.97, h: 22.46, dx: -24, dy: 4, rot: -8 },
    { src: "/desktop3/dl29.webp", left: 43.68, top: 17.38, w: 14.24, h: 21.48, dx: 18, dy: -18, rot: 14 },
    { src: "/desktop3/victoria.webp", left: 43.68, top: 38.38, w: 14.44, h: 20.8, dx: 26, dy: -2, rot: -10 },
    { src: "/desktop3/dl30.webp", left: 43.68, top: 58.79, w: 14.24, h: 23.83, dx: -16, dy: 22, rot: 10 },
    { src: "/desktop3/stpauls.webp", left: 57.92, top: 30.0, w: 14.86, h: 22.56, dx: 10, dy: -26, rot: -6 },
    { src: "/desktop3/indian-museum.webp", left: 57.85, top: 52.44, w: 15.0, h: 21.97, dx: 22, dy: 24, rot: 12 },
    { src: "/desktop3/calcutta.webp", left: 72.78, top: 41.31, w: 19.31, h: 28.42, dx: 28, dy: 14, rot: -14 },
];

const TramHero = () => {
    const [show, setShow] = useState(false);
    const [started, setStarted] = useState(false);
    const [tilesIn, setTilesIn] = useState(false);
    const [scatter, setScatter] = useState(false);
    const [d4, setD4] = useState(false);
    const [d4In, setD4In] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [comingSoonItem, setComingSoonItem] = useState(null);

    // Desktop 4 hero is positioned for a wide canvas; on narrow screens the
    // content is centered vertically instead. Match the breakpoint via JS so
    // the desktop layout stays pixel-identical.
    useEffect(() => {
        const mq = window.matchMedia?.("(max-width: 1024px)");
        if (!mq) return;
        const on = () => setIsMobile(mq.matches);
        on();
        mq.addEventListener?.("change", on);
        return () => mq.removeEventListener?.("change", on);
    }, []);

    // On "Start the experience", reveal the collage tiles one by one.
    useEffect(() => {
        if (!started) return;
        const raf = requestAnimationFrame(() => setTilesIn(true));
        return () => cancelAnimationFrame(raf);
    }, [started]);

    // After the last tile has appeared (~2.9s in), scatter all tiles away.
    useEffect(() => {
        if (!tilesIn) return;
        const t = setTimeout(() => setScatter(true), 2900);
        return () => clearTimeout(t);
    }, [tilesIn]);

    // Once the scatter plays out, move on to Desktop 4's hero.
    useEffect(() => {
        if (!scatter) return;
        const t = setTimeout(() => setD4(true), 1100);
        return () => clearTimeout(t);
    }, [scatter]);

    // Fade in all Desktop 4 hero content (not the tram — it slides itself).
    useEffect(() => {
        if (!d4) return;
        const raf = requestAnimationFrame(() => setD4In(true));
        return () => cancelAnimationFrame(raf);
    }, [d4]);

    useEffect(() => {
        // If the user prefers reduced motion the tram sits at its final
        // position, so show the overlay right away.
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
            const t = setTimeout(() => setShow(true), 600);
            return () => clearTimeout(t);
        }

        // Fire the logo/button entrance when the tram's body reaches the
        // middle of the right side (~halfway through the 6.5s run).
        const t = setTimeout(() => setShow(true), 3250);
        return () => clearTimeout(t);
    }, []);

    // Enter or Space starts the experience while the intro is on screen.
    useEffect(() => {
        if (started) return;
        const onKey = (e) => {
            if (e.code === "Enter" || e.code === "Space") {
                e.preventDefault();
                setStarted(true);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [started]);

    // Big centered logo -> Desktop 3 style small top-left logo (54,32 / 266x47)
    const logoStyle = {
        left: started ? "3.75%" : "50%",
        top: started ? "3.1%" : "38%",
        width: started ? "min(18.5vw, 18.5vh)" : "min(92vw, 92vh)",
        transform: !show
            ? "translateX(-50%) scale(0.55)"
            : started
              ? "none"
              : "translateX(-50%)",
        opacity: show ? 1 : 0,
        pointerEvents: "none",
        transition:
            "left 900ms cubic-bezier(.33,0,.2,1), top 900ms cubic-bezier(.33,0,.2,1), width 900ms cubic-bezier(.33,0,.2,1), transform 900ms cubic-bezier(.33,0,.2,1), opacity 900ms ease",
    };

    return (
        <>
        <div
            className="relative h-screen supports-[height:100dvh]:h-dvh w-full overflow-hidden select-none"
            style={{ backgroundColor: "#ffffff", overflowX: "hidden" }}
        >
            {!d4 && (
            <>
            {/* Tram sliding left -> right, exits fully off the right */}
            <div
                className="tram-slide absolute left-0 will-change-transform pointer-events-none"
                style={{ width: "50vw", bottom: "-0.85vw" }}
            >
                <img
                    src="/hero-tram/tram.webp"
                    alt=""
                    draggable={false}
                    className="block w-full h-auto"
                />
            </div>

            {/* GDG Kolkata logo — fades in centered, then on "Start" animates up
                to the small Desktop 3 top-left position */}
            <div className="absolute" style={logoStyle}>
                <img
                    src="/gdg-kolkata-logo.webp"
                    alt="GDG Kolkata"
                    draggable={false}
                    className="block w-full h-auto"
                />
            </div>

            {/* Desktop 3 collage — tiles pop in one by one, then scatter away together */}
            {started &&
                TILES.map((t, i) => (
                    <div
                        key={t.src}
                        className="absolute pointer-events-none"
                        style={{
                            left: `${t.left}%`,
                            top: `${t.top}%`,
                            width: `${t.w}%`,
                            height: `${t.h}%`,
                            transform: scatter
                                ? `translate(${t.dx}vw, ${t.dy}vh) rotate(${t.rot}deg) scale(0.7)`
                                : "none",
                            opacity: scatter ? 0 : tilesIn ? 1 : 0,
                            transition: scatter
                                ? "transform 900ms cubic-bezier(.5,0,.75,.4), opacity 900ms cubic-bezier(.5,0,.75,.4)"
                                : `opacity 400ms ease ${i * 250}ms`,
                            zIndex: 1,
                        }}
                    >
                        <img
                            src={t.src}
                            alt=""
                            draggable={false}
                            className="block w-full h-full object-cover"
                        />
                    </div>
                ))}

            {/* Start the experience button — fades in, fades out on click */}
            <button
                type="button"
                className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-[clamp(5px,0.6vw,10px)] cursor-pointer bg-transparent border-0 p-3 -m-3 rounded-full transition-all duration-500 ease-out motion-reduce:transition-none group ${
                    started
                        ? "opacity-0 -translate-y-3 pointer-events-none"
                        : show
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-4"
                }`}
                style={{
                    top: "64%",
                    transitionDelay: show && !started ? "180ms" : "0ms",
                }}
                onClick={() => setStarted(true)}
            >
                <span
                    className="product_sans font-medium text-black whitespace-nowrap leading-none tracking-normal"
                    style={{ fontSize: "17px" }}
                >
                    Start the experience
                </span>
                <svg
                    viewBox="0 0 49 25"
                    className="text-black transition-transform duration-200 group-hover:translate-x-1.5"
                    style={{ width: "22px", height: "auto" }}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 12.5C0 12.1317 0.184363 11.7785 0.51253 11.518C0.840698 11.2576 1.28579 11.1113 1.74989 11.1113H43.0228L32.009 2.37364C31.6804 2.11288 31.4958 1.75922 31.4958 1.39045C31.4958 1.02168 31.6804 0.668012 32.009 0.407253C32.3375 0.146493 32.7832 8.68851e-09 33.2479 0C33.7126 -8.68851e-09 34.1582 0.146493 34.4868 0.407253L48.4859 11.5168C48.6489 11.6458 48.7782 11.799 48.8664 11.9678C48.9546 12.1365 49 12.3173 49 12.5C49 12.6827 48.9546 12.8635 48.8664 13.0322C48.7782 13.201 48.6489 13.3542 48.4859 13.4832L34.4868 24.5927C34.1582 24.8535 33.7126 25 33.2479 25C32.7832 25 32.3375 24.8535 32.009 24.5927C31.6804 24.332 31.4958 23.9783 31.4958 23.6096C31.4958 23.2408 31.6804 22.8871 32.009 22.6264L43.0228 13.8887H1.74989C1.28579 13.8887 0.840698 13.7424 0.51253 13.482C0.184363 13.2215 0 12.8683 0 12.5Z"
                        fill="black"
                    />
                </svg>
            </button>
            </>
            )}

            {/* ===== Desktop 4 hero — everything fades in except the tram,
                  which slides in from the left -> right (same animation) ===== */}
            {d4 && (
                <>
                    {/* Tram re-runs its left->right slide */}
                    <div
                        key="d4-tram"
                        className="tram-slide absolute left-0 will-change-transform pointer-events-none"
                        style={{
                            width: isMobile ? "120vw" : "42vw",
                            bottom: isMobile ? "-1.5vw" : "-0.85vw",
                        }}
                    >
                        <img
                            src="/hero-tram/tram.webp"
                            alt=""
                            draggable={false}
                            className="block w-full h-auto"
                        />
                    </div>

                    {/* GDG logo — top left */}
                    <div
                        className="absolute pointer-events-none left-[4.79%] top-[2.5%] lg:top-[6.64%] w-[min(32vw,130px)] lg:w-[min(22vw,323px)]"
                        style={{
                            opacity: d4In ? 1 : 0,
                            transition: "opacity 900ms ease 0ms",
                        }}
                    >
                        <img
                            src="/gdg-kolkata-logo.webp"
                            alt="GDG Kolkata"
                            draggable={false}
                            className="block w-full h-auto"
                        />
                    </div>

                    {/* Nav — right edge (upper area) */}
                    <div
                        className="absolute product_sans left-[2%] right-[2%] top-[9.5%] lg:left-auto lg:right-[1.5%] lg:top-[6.64%] lg:w-auto flex flex-row items-center justify-center gap-x-[8px] gap-y-[4px] flex-wrap lg:flex-col lg:items-end lg:gap-[8px]"
                        style={{
                            opacity: d4In ? 1 : 0,
                            transition: "opacity 900ms ease 700ms",
                        }}
                    >
                        {[["Home", "#4787ea", "home", "scroll"],
                            ["About", "#000000", "about", "section"],
                            ["Speaker", "#000000", "speakers", "soon"],
                            ["Tickets", "#000000", "tickets", "section"],
                            ["Agenda", "#000000", "agenda", "soon"],
                            ["FAQs", "#000000", "faqs", "section"],
                        ].map(([label, color, id, kind]) => (
                            <a
                                key={label}
                                href={kind === "ticket" ? "/ticket" : `#${id}`}
                                onClick={(e) => {
                                    if (kind === "ticket") return;
                                    e.preventDefault();
                                    if (kind === "soon") {
                                        setComingSoonItem(label);
                                        return;
                                    }
                                    setComingSoonItem(null);
                                    if (kind === "scroll") {
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                        return;
                                    }
                                    document
                                        .getElementById(id)
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                            block: "start",
                                        });
                                }}
                                className="whitespace-nowrap leading-none cursor-pointer hover:opacity-60 transition-opacity"
                                style={{
                                    fontSize: "min(2.08vw, 30px)",
                                    color,
                                    textDecoration: "none",
                                }}
                            >
                                {label}
                            </a>
                        ))}
                    </div>

                    {/* DevFest headline */}
                    <div
                        className="absolute product_sans d4-devfest pointer-events-none left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-[30%] top-[20%] portrait:top-[26%] lg:top-[20.4%] whitespace-nowrap max-w-[90vw] lg:max-w-none"
                        style={{
                            fontWeight: 700,
                            lineHeight: 1,
                            color: "#000000",
                            opacity: d4In ? 1 : 0,
                            transition: "opacity 900ms ease 150ms",
                        }}
                    >
                        DevFest
                    </div>

                    {/* Kolkata'26 */}
                    <div
                        className="absolute product_sans d4-kolkata pointer-events-none left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-[31%] top-[32%] portrait:top-[33%] lg:top-[37.3%] whitespace-nowrap max-w-[90vw] lg:max-w-none"
                        style={{
                            fontWeight: 500,
                            lineHeight: 1,
                            color: "#4285f4",
                            opacity: d4In ? 1 : 0,
                            transition: "opacity 900ms ease 300ms",
                        }}
                    >
                        Kolkata&rsquo;26
                    </div>

                    {/* Bengali tagline */}
                    <div
                        className="absolute product_sans d4-bengali pointer-events-none left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-[33%] top-[43%] portrait:top-[39%] lg:top-[54.79%] max-w-[90vw] lg:max-w-none text-center lg:text-left whitespace-normal lg:whitespace-nowrap"
                        style={{
                            lineHeight: 1,
                            color: "#000000",
                            opacity: d4In ? 1 : 0,
                            transition: "opacity 900ms ease 450ms",
                        }}
                    >
                        কলকাতার ছন্দে, DevFest-এর আনন্দে !
                    </div>

                    {/* Get Tickets button */}
                    <a
                        href="#tickets"
                        className="absolute product_sans d4-tickets flex items-center justify-center cursor-pointer select-none left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-[41.74%] top-[62%] portrait:top-[48%] lg:top-[68%] rounded-full whitespace-nowrap"
                        style={{
                            padding: "0 32px",
                            height: "56px",
                            lineHeight: "1",
                            border: "4px solid transparent",
                            borderRadius: "50px",
                            background:
                                "linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(98deg, #F63130 0%, #4787EA 35%, #34A853 72%, #FBBC04 100%) border-box",
                            color: "#000000",
                            opacity: d4In ? 1 : 0,
                            transition: "opacity 900ms ease 600ms",
                        }}
                    >
                        Get Tickets
                    </a>

                    {/* Coming Soon overlay — blurs the whole screen until Home */}
                    {comingSoonItem && (
                        <div
                            className="cs-overlay fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6"
                            style={{
                                background: "rgba(0,0,0,0.35)",
                                backdropFilter: "blur(8px)",
                                WebkitBackdropFilter: "blur(8px)",
                            }}
                        >
                            <div className="product_sans text-center text-white cs-title-pop">
                                <div
                                    className="cs-float"
                                    style={{
                                        fontSize: "clamp(40px, 8vw, 90px)",
                                        fontWeight: 700,
                                        lineHeight: 1,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Coming Soon
                                </div>
                                <div
                                    className="cs-subtitle-in"
                                    style={{
                                        marginTop: "12px",
                                        fontSize: "clamp(16px, 3vw, 30px)",
                                        color: "rgba(255,255,255,0.8)",
                                    }}
                                >
                                    {comingSoonItem}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setComingSoonItem(null);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="product_sans cs-btn-pop cursor-pointer transition-transform hover:scale-105"
                                style={{
                                    border: "3px solid #ffffff",
                                    borderRadius: "50px",
                                    color: "#ffffff",
                                    background: "transparent",
                                    padding: "10px 36px",
                                    fontSize: "clamp(16px, 2.5vw, 24px)",
                                }}
                            >
                                Home
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
        {d4 && <AboutSection />}
        {d4 && <TicketsSection />}
        {d4 && <FaqSection />}
        {d4 && <FooterSection />}
        </>
    );
};

export default TramHero;