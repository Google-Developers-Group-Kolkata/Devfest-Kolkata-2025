"use client";

import { useEffect, useRef, useState } from "react";
import {
    motion,
    useMotionTemplate,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from "framer-motion";

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
const BOARD_BLUE = "#2D4FA1";
const BOARD = { left: 24.93, top: 11.4, width: 65.74, height: 25.89 };

// The tram artwork is exactly 3:1, so the stage box it defines doubles as the
// coordinate system for the boards: every board offset below is a percentage
// of that box, which keeps the composition identical at any viewport size.
const STAGE_ASPECT = 3;

const LAYOUT = {
    desktop: {
        stageWidth: "min(88vw, 132vh)",
        // The tram is parked on the bottom edge of the viewport.
        stageBottom: "0px",
        bannerWidth: 58, // % of the stage width
        bannerLeft: 43.5, // % of the stage width
        bannerTop: -104.2, // % of the stage height, from its top
        clip: 0.7, // boards are cut off this far (in stage heights) above the stage bottom
        headTop: 36, // % of the viewport height
        headExit: "112vw", // far enough left to clear the widest line
        line1: "clamp(30px, 5.8vw, 92px)",
        line2: "clamp(34px, 6.4vw, 104px)",
    },
    mobile: {
        // The tram runs wider than the screen so its body still fills the
        // bottom edge once the board needs most of the width above it.
        stageWidth: "min(150vw, 77vh)",
        stageBottom: "0px",
        bannerWidth: 80,
        bannerLeft: 7,
        bannerTop: -179.5,
        clip: 0.7,
        headTop: 40,
        headExit: "128vw",
        line1: "9.5vw",
        line2: "10.5vw",
    },
};

// Scroll spent on the heading before the first board rides in; the rest is one
// slot per board.
const INTRO = 0.13;
const RUNWAY_VH = 120 + FAQS.length * 90;
const SLOT = (1 - INTRO) / FAQS.length;

// Where a board's slide sits inside its own slot, in slot units. The entry
// starts a shade before the slot does so the outgoing board is still leaving
// as the next one arrives — the boards read as one line of stations passing
// rather than four separate cuts.
const ENTER = [-0.05, 0.35];
const EXIT = [0.78, 1.05];

// Nothing precedes the first board, so it pulls away well before its own slot:
// it is already on its way in while the heading is still on its way out, and
// since both travel left the two read as one movement instead of a handover
// with an empty stage in the middle.
const FIRST_ENTER = 0.045;

// Smoothstep, the same curve the section used before Framer Motion drove it.
const EASE = (t) => t * t * (3 - 2 * t);

// Scroll position is quantised and jumpy — wheel notches, trackpad momentum,
// mobile fling. Running it through a spring turns each of those steps into a
// glide, which is what keeps the boards from snapping across the screen.
const SPRING = { stiffness: 110, damping: 26, mass: 0.35, restDelta: 0.0005 };

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

// One board's ride: in from the right, hold, out to the left. Both offsets are
// read off CSS custom properties rather than baked into the motion values, so
// a switch between the mobile and desktop layouts is picked up by the browser
// without having to rebuild any of these hooks.
const Board = ({ faq, index, progress, layout, last }) => {
    const start = INTRO + index * SLOT;

    const enter = useTransform(
        progress,
        [
            index === 0 ? FIRST_ENTER : start + ENTER[0] * SLOT,
            start + ENTER[1] * SLOT,
        ],
        [1, 0],
        { ease: EASE },
    );
    // The last board holds its place while the section unpins and scrolls away
    // under its own steam, so it never gets an exit.
    const exit = useTransform(
        progress,
        [start + EXIT[0] * SLOT, start + EXIT[1] * SLOT],
        [0, last ? 0 : 1],
        { ease: EASE },
    );

    const x = useMotionTemplate`calc(var(--board-in) * ${enter} + var(--board-out) * ${exit})`;

    return (
        <motion.div
            className="absolute"
            style={{
                left: `${layout.bannerLeft}%`,
                top: `${layout.bannerTop}%`,
                width: `${layout.bannerWidth}%`,
                aspectRatio: BANNER_ASPECT,
                x,
                zIndex: index,
            }}
        >
            <img
                src={BANNER_SRC}
                alt=""
                draggable={false}
                className="absolute inset-0 block h-full w-full"
            />
            <BoardCopy faq={faq} index={index} />
        </motion.div>
    );
};

const FaqTramSection = () => {
    const sectionRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const reduced = useReducedMotion();

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 768px)");
        const on = () => setIsMobile(mq.matches);
        on();
        mq.addEventListener?.("change", on);
        return () => mq.removeEventListener?.("change", on);
    }, []);

    // Progress through the pinned runway: 0 as the section locks to the top of
    // the viewport, 1 once it has been scrolled all the way through.
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });
    const p = useSpring(scrollYProgress, SPRING);

    // Heading: centred while the section locks, then slides clean off the left
    // edge as the first board comes in from the right.
    const headF = useTransform(p, [0, INTRO], [0, 1], { ease: EASE });
    const headX = useMotionTemplate`calc(var(--head-out) * ${headF})`;

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
            <section
                ref={sectionRef}
                id="faqs"
                className="relative w-full select-none"
            >
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
                    // A board sits at bannerLeft% of the centred stage box, so
                    // the ride in is whatever puts its left edge just past the
                    // right edge of the viewport, and the ride out is whatever
                    // takes its right edge just past the left one.
                    "--board-in": `calc(52vw + var(--stage-w) * ${(
                        0.5 -
                        L.bannerLeft / 100
                    ).toFixed(4)})`,
                    "--board-out": `calc(-52vw + var(--stage-w) * ${(
                        0.5 -
                        (L.bannerLeft + L.bannerWidth) / 100
                    ).toFixed(4)})`,
                    "--head-out": `-${L.headExit}`,
                }}
            >
                {/* Frequently / ASKED QUESTIONS */}
                <motion.div
                    className="pointer-events-none absolute left-0 z-10 w-full text-center"
                    style={{ top: `${L.headTop}%`, x: headX, y: "-50%" }}
                >
                    {heading}
                </motion.div>

                {/* Boards. Clipped part-way down the tram body, so the pole
                    reads as running down behind the tram as the board passes. */}
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
                        {FAQS.map((faq, i) => (
                            <Board
                                key={faq.q}
                                faq={faq}
                                index={i}
                                progress={p}
                                layout={L}
                                last={i === FAQS.length - 1}
                            />
                        ))}
                    </div>
                </div>

                {/* The tram itself — parked on the bottom edge, the one thing
                    that never moves */}
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
