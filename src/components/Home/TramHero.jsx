"use client";

import { useEffect, useState } from "react";
import AboutSection from "./AboutSection";
import TicketsSection from "./TicketsSection";
import VenueSection from "./VenueSection";
import TeamSection from "./TeamSection";
import FaqTramSection from "./FaqTramSection";
import FooterSection from "./FooterSection";

// Looping, muted YouTube footage behind the Desktop 4 hero.
const HERO_VIDEO_SRC =
    "https://www.youtube-nocookie.com/embed/tcrpjKyCQ2g?autoplay=1&mute=1&loop=1&playlist=tcrpjKyCQ2g&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1";

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

// A headline whose stroke sits outside the glyph rather than straddling it.
// The invisible copy is what takes part in layout — it keeps the Tailwind type
// steps, the tracking and the a11y tree working exactly as plain text — and the
// SVG on top paints the same string at double stroke width, masking the glyph
// body away so only the outer half of the stroke survives. See `.d4-outline`
// in globals.css for why `-webkit-text-stroke` cannot do this.
const OutlineText = ({ text, maskId, className = "", style }) => (
    <div className={`relative ${className}`} style={style}>
        <span style={{ color: "transparent" }}>{text}</span>
        <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ overflow: "visible" }}
        >
            <defs>
                <mask
                    id={maskId}
                    maskUnits="userSpaceOnUse"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                >
                    <rect
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                        fill="#fff"
                    />
                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="central"
                    >
                        {text}
                    </text>
                </mask>
            </defs>
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                mask={`url(#${maskId})`}
            >
                {text}
            </text>
        </svg>
    </div>
);

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
        width: started ? "min(15vw, 15vh)" : "min(78vw, 78vh)",
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
            className="sticky top-0 z-0 h-screen supports-[height:100dvh]:h-dvh w-full overflow-hidden select-none"
            style={{
                backgroundColor: d4 ? "#000000" : "#ffffff",
                overflowX: "hidden",
            }}
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
                className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 md:gap-2 cursor-pointer bg-transparent border-0 p-3 -m-3 rounded-full transition-all duration-500 ease-out motion-reduce:transition-none group ${
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
                <span className="product_sans font-medium text-black whitespace-nowrap leading-none tracking-normal text-[14px] md:text-[15px]">
                    Start the experience
                </span>
                <svg
                    viewBox="0 0 49 25"
                    className="h-auto w-[18px] text-black transition-transform duration-200 group-hover:translate-x-1.5 md:w-5"
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

            {/* Background footage — mounted a beat early so YouTube can buffer
                while the collage scatters, then cross-fades in with Desktop 4 */}
            {(scatter || d4) && (
                <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{
                        backgroundColor: "#000000",
                        opacity: d4In ? 1 : 0,
                        transition: "opacity 900ms ease",
                        zIndex: 0,
                    }}
                >
                    <iframe
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-0 pointer-events-none"
                        style={{
                            // 16:9 blown up to cover the viewport in both axes
                            width: "max(100vw, 177.78vh)",
                            height: "max(100vh, 56.25vw)",
                            filter: "contrast(110%) brightness(90%)",
                        }}
                        src={HERO_VIDEO_SRC}
                        title="DevFest Hero Background Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                    {/* Scrim — keeps the white headline readable over the footage */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.65) 100%)",
                        }}
                    />
                </div>
            )}

            {/* ===== Desktop 4 hero — centered over the looping background video ===== */}
            {d4 && (
                <>
                    {/* GDG logo — top left. Inverted (hue kept) so the black
                        wordmark reads as white against the footage. */}
                    <div
                        className="absolute z-10 pointer-events-none left-5 top-10 w-[150px] md:left-10 md:w-[200px] lg:w-[270px] xl:left-16 xl:w-[300px]"
                        style={{
                            opacity: d4In ? 1 : 0,
                            transition: "opacity 900ms ease 0ms",
                        }}
                    >
                        <img
                            src="/gdg-kolkata-logo-white.svg"
                            alt="GDG Kolkata"
                            draggable={false}
                            className="block w-full h-auto"
                        />
                    </div>

                    {/* Headline stack — centered on every breakpoint */}
                    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center md:px-10 xl:px-16">
                        {/* DevFest headline */}
                        <OutlineText
                            text="DevFest"
                            maskId="d4-outline-devfest"
                            className="product_sans d4-outline whitespace-nowrap text-[48px] sm:text-[50px] md:text-[70px] lg:text-[92px] xl:text-[116px] 2xl:text-[132px]"
                            style={{
                                fontWeight: 700,
                                lineHeight: 1,
                                color: "#ffffff",
                                // drop-shadow, not text-shadow: with a hollow
                                // letterform a text-shadow would blur through the
                                // centres instead of hugging the stroke.
                                filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.55))",
                                opacity: d4In ? 1 : 0,
                                transition: "opacity 900ms ease 150ms",
                            }}
                        />

                        {/* Kolkata'26 */}
                        <OutlineText
                            text={"Kolkata\u201926"}
                            maskId="d4-outline-kolkata"
                            className="product_sans d4-outline mt-[0.04em] whitespace-nowrap text-[31px] sm:text-[41px] md:text-[57px] lg:text-[75px] xl:text-[94px] 2xl:text-[107px]"
                            style={{
                                fontWeight: 500,
                                lineHeight: 1,
                                color: "#4285f4",
                                filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.55))",
                                opacity: d4In ? 1 : 0,
                                transition: "opacity 900ms ease 300ms",
                            }}
                        />

                        {/* Bengali tagline */}
                        <div
                            className="product_sans mt-[0.9em] max-w-[90vw] text-[13px] sm:text-[15px] md:text-[18px] lg:text-[21px] xl:text-[24px]"
                            style={{
                                lineHeight: 1.35,
                                color: "#ffffff",
                                textShadow: "0 2px 18px rgba(0,0,0,0.6)",
                                opacity: d4In ? 1 : 0,
                                transition: "opacity 900ms ease 450ms",
                            }}
                        >
                            কলকাতার ছন্দে, DevFest-এর আনন্দে !
                        </div>

                        {/* Get Tickets button */}
                        <a
                            href="#tickets"
                            className="product_sans pointer-events-auto mt-[1.5em] flex h-9 cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-full px-5 text-[14px] leading-none transition-transform duration-200 hover:scale-105 md:h-11 md:px-6 md:text-[16px] xl:h-12 xl:px-7 xl:text-[18px]"
                            style={{
                                border: "3px solid transparent",
                                borderRadius: "50px",
                                background:
                                    "linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(98deg, #F63130 0%, #4787EA 35%, #34A853 72%, #FBBC04 100%) border-box",
                                color: "#000000",
                                opacity: d4In ? 1 : 0,
                                transition: "opacity 900ms ease 600ms, transform 200ms ease",
                            }}
                        >
                            Get Tickets
                        </a>
                    </div>

                    {/* Scroll cue */}
                    <a
                        href="#about"
                        aria-label="Scroll to about section"
                        className="d4-scroll-cue absolute z-10 left-1/2 -translate-x-1/2 bottom-[5%] flex items-center justify-center rounded-full p-2"
                        style={{
                            opacity: d4In ? 1 : 0,
                            transition: "opacity 900ms ease 750ms",
                        }}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="h-auto w-4 md:w-5 xl:w-6"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M5 9l7 7 7-7" />
                        </svg>
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
                                    className="cs-float whitespace-nowrap text-[32px] md:text-[52px] lg:text-[62px] xl:text-[72px]"
                                    style={{ fontWeight: 700, lineHeight: 1 }}
                                >
                                    Coming Soon
                                </div>
                                <div
                                    className="cs-subtitle-in mt-3 text-[14px] md:text-[18px] xl:text-[22px]"
                                    style={{ color: "rgba(255,255,255,0.8)" }}
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
                                className="product_sans cs-btn-pop cursor-pointer rounded-[50px] border-[3px] border-white bg-transparent px-8 py-2 text-[14px] text-white transition-transform hover:scale-105 md:text-[16px] xl:text-[18px]"
                            >
                                Home
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
        {d4 && (
            <div
                className="relative z-10 w-full rounded-t-2xl bg-white md:rounded-t-3xl xl:rounded-t-[32px]"
                style={{ boxShadow: "0 -24px 60px rgba(0,0,0,0.28)" }}
            >
                {/* Kolkata doodle backdrop — one continuous layer that holds
                    still while About / Tickets / FAQ scroll over it. No
                    overflow here on purpose: an overflow ancestor would become
                    the sticky child's scrollport and kill the effect. */}
                {/* overflow `clip`, not `hidden`: it trims the backdrop to the
                    panel's rounded top without turning this box into a
                    scrollport, which would freeze the sticky layer inside. */}
                <div
                    id="doodle-backdrop"
                    className="pointer-events-none absolute inset-0 rounded-t-2xl md:rounded-t-3xl xl:rounded-t-[32px]"
                    aria-hidden="true"
                    style={{ overflow: "clip" }}
                >
                    <div
                        className="sticky top-0 h-screen supports-[height:100dvh]:h-dvh w-full"
                        style={{
                            backgroundImage: "url(/background.svg)",
                            backgroundSize: "cover",
                            backgroundPosition: "center top",
                            backgroundRepeat: "no-repeat",
                        }}
                    />
                </div>

                <div className="relative">
                    <AboutSection />
                    <TicketsSection />
                    <VenueSection />
                    <TeamSection />
                    <FaqTramSection />
                </div>
            </div>
        )}
        {d4 && (
            /* The pinned hero is positioned (z-0), so it would paint over an
               in-flow footer — keep the footer on the same layer as the panel. */
            <div className="relative z-10">
                <FooterSection />
            </div>
        )}
        </>
    );
};

export default TramHero;