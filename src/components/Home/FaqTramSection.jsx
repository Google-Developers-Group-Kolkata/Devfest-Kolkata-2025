"use client";

import { useEffect, useRef, useState } from "react";

// station-banner.svg wraps its artwork in an opaque white paper, which would
// read as a white box over the doodle backdrop the sections scroll across.
// This is the same artwork with that paper keyed out.
const BANNER_SRC = "/faq/station-banner.png";
// Same artwork as /tram.svg, which carries the identical 2172x724 bitmap at
// 2.6 MB. This is the copy the hero already loads, so the browser has it.
const TRAM_SRC = "/hero-tram/tram.webp";

const FAQS = [
    {
        q: "What is DevFest Kolkata 2026 ?",
        a: "The annual flagship event of GDG Kolkata — a full day of talks, workshops and networking around Google tech.",
    },
    {
        q: "Who can attend DevFest ?",
        a: "Everyone. Students, developers, designers and tech professionals of every skill level are welcome.",
    },
    {
        q: "What is included with a pass ?",
        a: "All talks and workshops, networking with the speakers, refreshments and exclusive GDG Kolkata goodies.",
    },
    {
        q: "How do I get my ticket ?",
        a: "Tap Get Tickets, pick the pass you want and finish the booking in a couple of minutes.",
    },
];

// The board is a 1287x1311 box. These are the bounds of the sign's blue panel
// inside it, measured off the artwork: the FAQ copy is painted over the panel
// in that same blue, which buries the original "RAILWAY STATION" lettering and
// its arrow. The pole runs down at 15.4% of the width — that column is what
// has to end up behind the tram.
const BANNER_ASPECT = "1287 / 1311";
const BANNER_H_OVER_W = 1311 / 1287;
const BOARD_BLUE = "#2D4FA1";
const BOARD = { left: 24.93, top: 11.4, width: 65.74, height: 25.89 };

// The tram artwork is exactly 3:1, so the stage box it defines doubles as the
// coordinate system for the boards: every board offset below is a percentage
// of that box, which keeps the composition identical at any viewport size.
const STAGE_ASPECT = 3;

const LAYOUT = {
    desktop: {
        stageWidth: "min(88vw, 132vh)",
        stageBottom: "4vh",
        bannerWidth: 58, // % of the stage width
        bannerLeft: 43.5, // % of the stage width
        bannerTop: -104.2, // % of the stage height, from its top
        clip: 0.7, // boards are cut off this far (in stage heights) above the stage bottom
        headCentre: [50, 20], // % of the viewport width — centred, then parked left
        headMiddle: [36, 36], // % of the viewport height
        line1: "clamp(30px, 5.8vw, 92px)",
        line2: "clamp(34px, 6.4vw, 104px)",
    },
    mobile: {
        // The tram runs wider than the screen so its body still fills the
        // bottom edge once the board needs most of the width above it.
        stageWidth: "min(150vw, 77vh)",
        stageBottom: "4vh",
        bannerWidth: 80,
        bannerLeft: 7,
        bannerTop: -179.5,
        clip: 0.7,
        headCentre: [50, 34],
        headMiddle: [40, 19],
        line1: "9.5vw",
        line2: "10.5vw",
    },
};

// Scroll spent on the heading before the first board rides up; the rest is one
// slot per board.
const INTRO = 0.13;
const RUNWAY_VH = 120 + FAQS.length * 90;

const clamp01 = (n) => Math.min(1, Math.max(0, n));

const smoothstep = (edge0, edge1, x) => {
    const t = clamp01((x - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
};

const lerp = (a, b, t) => a + (b - a) * t;

// How far a board has to drop, as a percentage of its own height, to put its top
// edge below the clip line — i.e. the shortest travel that hides it completely.
// Anything beyond that is spent out of sight, so the ride up is timed against
// this rather than a blanket 100%.
const travelFor = (L) => {
    const gap = 1 - L.clip - L.bannerTop / 100; // in stage heights
    const height = (L.bannerWidth / 100) * STAGE_ASPECT * BANNER_H_OVER_W;
    return Math.min(100, (gap / height) * 100 + 6);
};

// The copy that stands in for the board's original "RAILWAY STATION" lettering.
// Type is sized in cqw so it tracks the board rather than the viewport, with px
// floors so the smallest phone board stays readable.
const BoardCopy = ({ faq, index }) => (
    <div
        className="absolute flex flex-col items-center justify-center text-center"
        style={{
            left: `${BOARD.left}%`,
            top: `${BOARD.top}%`,
            width: `${BOARD.width}%`,
            height: `${BOARD.height}%`,
            padding: "0 5%",
            background: BOARD_BLUE,
            containerType: "inline-size",
            overflow: "hidden",
        }}
    >
        <div
            className="product_sans"
            style={{
                fontSize: "max(11px, 3.6cqw)",
                fontWeight: 700,
                lineHeight: 1.2,
                letterSpacing: "0.04em",
                color: "#ffffff",
            }}
        >
            FAQ #{index + 1}
        </div>
        <div
            className="product_sans"
            style={{
                marginTop: "2.5cqw",
                fontSize: "max(13px, 4.4cqw)",
                fontWeight: 500,
                lineHeight: 1.2,
                color: "#ffffff",
            }}
        >
            {faq.q}
        </div>
        <div
            className="product_sans"
            style={{
                marginTop: "2cqw",
                fontSize: "max(10.5px, 3.5cqw)",
                lineHeight: 1.35,
                color: "rgba(255,255,255,0.88)",
            }}
        >
            {faq.a}
        </div>
    </div>
);

const FaqTramSection = () => {
    const sectionRef = useRef(null);
    const [p, setP] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px)");
        const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
        const on = () => {
            setIsMobile(mq.matches);
            setReduced(rm.matches);
        };
        on();
        mq.addEventListener?.("change", on);
        rm.addEventListener?.("change", on);
        return () => {
            mq.removeEventListener?.("change", on);
            rm.removeEventListener?.("change", on);
        };
    }, []);

    // Progress through the pinned runway: 0 as the section locks to the top of
    // the viewport, 1 once it has been scrolled all the way through.
    useEffect(() => {
        let raf;
        const update = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const sec = sectionRef.current;
                if (!sec) return;
                const rect = sec.getBoundingClientRect();
                const travel = rect.height - window.innerHeight;
                setP(travel > 0 ? clamp01(-rect.top / travel) : 0);
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

    const L = isMobile ? LAYOUT.mobile : LAYOUT.desktop;

    const heading = (
        <>
            <div
                className="product_sans whitespace-nowrap"
                style={{
                    fontSize: L.line1,
                    fontWeight: 400,
                    lineHeight: 1.05,
                    color: "#A6A6A6",
                }}
            >
                Frequently
            </div>
            <div
                className="product_sans whitespace-nowrap"
                style={{
                    fontSize: L.line2,
                    fontWeight: 700,
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                    color: "#8F8F8F",
                }}
            >
                ASKED QUESTIONS
            </div>
        </>
    );

    // Reduced motion: no pinning and no travel — the heading sits still and
    // every board is simply listed.
    if (reduced) {
        return (
            <section id="faqs" className="relative w-full select-none">
                <div className="mx-auto w-full max-w-[1120px] px-5 py-14 sm:px-8 md:px-10 md:py-20 xl:px-16">
                    <div className="text-center md:text-left">{heading}</div>
                    <div className="mt-10 flex flex-col gap-6 md:mt-14">
                        {FAQS.map((faq, i) => (
                            <div
                                key={faq.q}
                                className="relative w-full"
                                style={{
                                    background: BOARD_BLUE,
                                    border: "4px solid #ffffff",
                                    outline: "4px solid #2D4FA1",
                                    borderRadius: "4px",
                                    padding: "22px 28px",
                                }}
                            >
                                <div
                                    className="product_sans"
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: 700,
                                        letterSpacing: "0.04em",
                                        color: "#ffffff",
                                    }}
                                >
                                    FAQ #{i + 1}
                                </div>
                                <div
                                    className="product_sans mt-2"
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: 500,
                                        lineHeight: 1.25,
                                        color: "#ffffff",
                                    }}
                                >
                                    {faq.q}
                                </div>
                                <div
                                    className="product_sans mt-2"
                                    style={{
                                        fontSize: "16px",
                                        lineHeight: 1.45,
                                        color: "rgba(255,255,255,0.88)",
                                    }}
                                >
                                    {faq.a}
                                </div>
                            </div>
                        ))}
                    </div>
                    <img
                        src={TRAM_SRC}
                        alt=""
                        draggable={false}
                        loading="lazy"
                        className="mt-12 block h-auto w-full"
                    />
                </div>
            </section>
        );
    }

    // Heading: centred while the section locks, then slides left and parks with
    // the bold line bleeding off the edge.
    const slide = smoothstep(0, INTRO, p);
    const centre = lerp(L.headCentre[0], L.headCentre[1], slide);
    const middle = lerp(L.headMiddle[0], L.headMiddle[1], slide);

    const slot = (1 - INTRO) / FAQS.length;
    const boardTravel = travelFor(L);

    const stageStyle = {
        width: "var(--stage-w)",
        height: "var(--stage-h)",
        bottom: "var(--stage-b)",
    };

    return (
        <section
            ref={sectionRef}
            id="faqs"
            className="relative w-full select-none"
            style={{ height: `${RUNWAY_VH}vh` }}
        >
            <div
                className="sticky top-0 h-screen w-full overflow-hidden supports-[height:100dvh]:h-dvh"
                style={{
                    "--stage-w": L.stageWidth,
                    "--stage-h": `calc(${L.stageWidth} / ${STAGE_ASPECT})`,
                    "--stage-b": L.stageBottom,
                }}
            >
                {/* Frequently / ASKED QUESTIONS */}
                <div
                    className="pointer-events-none absolute left-0 z-10 w-full text-center"
                    style={{
                        top: `${middle}%`,
                        transform: `translate(${centre - 50}vw, -50%) scale(${lerp(1.06, 1, slide)})`,
                        willChange: "transform",
                    }}
                >
                    {heading}
                </div>

                {/* Boards. Clipped part-way down the tram body, so a board that
                    has not risen yet is nowhere to be seen and the pole reads as
                    running down behind the tram. */}
                <div
                    className="pointer-events-none absolute inset-0 z-20"
                    style={{
                        clipPath: `inset(0 0 calc(var(--stage-b) + ${L.clip} * var(--stage-h)) 0)`,
                    }}
                >
                    <div
                        className="absolute left-1/2 -translate-x-1/2"
                        style={stageStyle}
                    >
                        {FAQS.map((faq, i) => {
                            // One slot each: ride up, hold, drop back behind the
                            // tram. The last board stays up while the section
                            // unpins and scrolls away on its own.
                            const t = clamp01((p - INTRO) / slot - i);
                            const rise = smoothstep(0, 0.3, t);
                            const drop =
                                i === FAQS.length - 1
                                    ? 0
                                    : smoothstep(0.8, 1, t);
                            const y = ((1 - rise) + drop) * boardTravel;

                            return (
                                <div
                                    key={faq.q}
                                    className="absolute"
                                    style={{
                                        left: `${L.bannerLeft}%`,
                                        top: `${L.bannerTop}%`,
                                        width: `${L.bannerWidth}%`,
                                        aspectRatio: BANNER_ASPECT,
                                        transform: `translate3d(0, ${y}%, 0)`,
                                        willChange: "transform",
                                        zIndex: i,
                                    }}
                                >
                                    <img
                                        src={BANNER_SRC}
                                        alt=""
                                        draggable={false}
                                        className="absolute inset-0 block h-full w-full"
                                    />
                                    <BoardCopy faq={faq} index={i} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* The tram itself — the one thing that never moves */}
                <div
                    className="pointer-events-none absolute left-1/2 z-30 -translate-x-1/2"
                    style={stageStyle}
                >
                    <img
                        src={TRAM_SRC}
                        alt="Kolkata tram"
                        draggable={false}
                        className="absolute inset-0 block h-full w-full"
                    />
                </div>
            </div>
        </section>
    );
};

export default FaqTramSection;
