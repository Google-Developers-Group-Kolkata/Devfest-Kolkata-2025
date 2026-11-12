"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    AnimatePresence,
    motion,
    useAnimationControls,
    useReducedMotion,
} from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import speakersData from "@/data/speakers.json";

const SPEAKERS = speakersData.speakers ?? [];

// Each speaker takes the next Google colour: `soft` fills the card behind the
// photo (so cut-out portraits sit on colour, not on nothing), `solid` fills
// the corner badge, `tint` washes the session panel, and `text` is the shade
// of the colour dark enough to read as type on white.
const ACCENTS = [
    { solid: "#4285F4", soft: "#D2E3FC", tint: "#E8F0FE", text: "#1967D2", ink: "#ffffff" },
    { solid: "#EA4335", soft: "#FAD2CF", tint: "#FCE8E6", text: "#C5221F", ink: "#ffffff" },
    { solid: "#FBBC04", soft: "#FEEFC3", tint: "#FEF7E0", text: "#B06000", ink: "#202124" },
    { solid: "#34A853", soft: "#CEEAD6", tint: "#E6F4EA", text: "#137333", ink: "#ffffff" },
];

const GOOGLE_RULE =
    "linear-gradient(to right, #4285F4 0 25%, #EA4335 25% 50%, #FBBC04 50% 75%, #34A853 75% 100%)";

// The festival day a speaker is on, keyed by `day` in speakers.json. Labels,
// dates and colours follow the passes in TicketsSection (Day 1 blue, Day 2
// red), so a speaker's chip matches the ticket for their day.
const DAYS = {
    1: { label: "Day 1", kind: "Workshop", date: "21 Nov", spoken: "21st November", color: "#4285F4" },
    2: { label: "Day 2", kind: "DevFest", date: "22 Nov", spoken: "22nd November", color: "#F63130" },
};

// Pinned to the foot of the card: which day this speaker is on.
const DayChip = ({ day }) => (
    <div
        className="product_sans pointer-events-none absolute bottom-[4.5%] left-[5%] z-10 flex items-center gap-[0.55em] whitespace-nowrap rounded-full bg-white/90 py-[0.32em] pl-[0.32em] pr-[0.95em] shadow-[0_6px_18px_rgba(0,0,0,0.14)] backdrop-blur-sm"
        style={{ fontSize: "clamp(11px, 3.3cqw, 15px)", lineHeight: 1.2 }}
    >
        <span
            className="rounded-full px-[0.8em] py-[0.38em] uppercase"
            style={{
                background: day.color,
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "0.82em",
                letterSpacing: "0.08em",
            }}
        >
            {day.label}
        </span>
        <span style={{ fontWeight: 600, color: "#202124" }}>{day.kind}</span>
        <span aria-hidden="true" style={{ color: "#BDC1C6" }}>
            •
        </span>
        <span style={{ fontWeight: 500, color: "#5f6368" }}>{day.date}</span>
    </div>
);

// Mask for the deck window: solid over the card on show, then fading to
// nothing at the screen edge, so the queued cards blend into the page.
const DECK_FADE =
    "linear-gradient(to right, #000 calc(var(--card-w) * 1.05), transparent 100%)";

const EASE = [0.65, 0, 0.35, 1];
const EASE_OUT = [0.22, 1, 0.36, 1];

// Card pitch on the track: one card width plus the gap, in % of a card width.
const STEP = 109;

// Radius of a card at rest, and the radius it swells to as it shrinks into the
// badge — large enough that CSS clamps it into a full ellipse by the end.
const RADIUS_REST = 22;
const RADIUS_GONE = 320;

const initialsOf = (name = "") =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");

const SOCIALS = [
    { key: "linkedin", label: "LinkedIn", icon: FaLinkedinIn },
    { key: "twitter", label: "X", icon: FaXTwitter },
    { key: "instagram", label: "Instagram", icon: FaInstagram },
];

// A link has to name someone to count — a bare "https://x.com" is skipped.
const isProfile = (href) => /^https?:\/\/[^/]+\/[^/?#]/.test(href ?? "");

// Where card `i` sits relative to the one on show: 0 is on show, 1 peeks in
// from the right, 2+ wait off to the right, and -1 has shrunk into the badge.
// With three or more speakers the deck loops, so the offsets wrap into
// [-1, n-2] — the card before the current one is always the one in the badge.
const offsetOf = (i, active, n) => {
    let d = i - active;
    if (n > 2) {
        if (d < -1) d += n;
        if (d > n - 2) d -= n;
    }
    return d;
};

const cardTarget = (d, reduced) => {
    if (d < 0) {
        return reduced
            ? { x: "0%", scale: 1, opacity: 0, borderRadius: RADIUS_REST }
            : { x: "0%", scale: 0.16, opacity: 0, borderRadius: RADIUS_GONE };
    }
    return { x: `${d * STEP}%`, scale: 1, opacity: 1, borderRadius: RADIUS_REST };
};

// The video's choreography: going forward, the card on show starts collapsing
// into its badge first, the next card slides in under it a beat later, and the
// one behind that follows into the peek slot. Going back plays it in reverse.
// A card that jumps more than one slot (the deck wrapping round) is off screen
// for the jump, so it moves instantly.
const cardTransition = (prevD, d, dir, reduced) => {
    if (prevD === undefined || Math.abs(d - prevD) > 1) return { duration: 0 };
    if (reduced) return { duration: 0.25, ease: "linear", x: { duration: 0 } };
    const base = { duration: 0.85, ease: EASE };
    if (dir > 0) {
        if (d < 0) return { ...base, opacity: { duration: 0.25, delay: 0.6 } };
        if (d === 0) return { ...base, delay: 0.12 };
        return { ...base, delay: 0.3 };
    }
    if (d === 0) return { ...base, opacity: { duration: 0.2 } };
    return { ...base, delay: 0.08 };
};

// Copy that swaps when the speaker changes: the new text drops in from above
// while the old text drops away below (reversed when going back). Both are
// stacked in one grid cell so the block never jumps while they cross.
const swapVariants = {
    enter: ({ dir, reduced }) =>
        reduced ? { opacity: 0 } : { opacity: 0, y: dir > 0 ? -14 : 14, filter: "blur(4px)" },
    center: ({ reduced }) => ({
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: reduced
            ? { duration: 0.2 }
            : { duration: 0.6, ease: EASE_OUT, delay: 0.25 },
    }),
    exit: ({ dir, reduced }) =>
        reduced
            ? { opacity: 0, transition: { duration: 0.15 } }
            : {
                  opacity: 0,
                  y: dir > 0 ? 14 : -14,
                  filter: "blur(4px)",
                  transition: { duration: 0.4, ease: EASE },
              },
};

const Swap = ({ swapKey, dir, reduced, className, children }) => (
    <div className={`grid ${className ?? ""}`}>
        <AnimatePresence initial={false} custom={{ dir, reduced }}>
            <motion.div
                key={swapKey}
                custom={{ dir, reduced }}
                variants={swapVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ gridArea: "1 / 1" }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    </div>
);

// The big index. Each digit rolls on its own, so 01 → 02 only moves the 2.
const digitVariants = {
    enter: ({ dir, reduced }) =>
        reduced ? { opacity: 0 } : { opacity: 0, y: dir > 0 ? "-40%" : "40%", filter: "blur(8px)" },
    center: ({ reduced }) => ({
        opacity: 1,
        y: "0%",
        filter: "blur(0px)",
        transition: reduced ? { duration: 0.2 } : { duration: 0.7, ease: EASE_OUT, delay: 0.2 },
    }),
    exit: ({ dir, reduced }) =>
        reduced
            ? { opacity: 0, transition: { duration: 0.15 } }
            : {
                  opacity: 0,
                  y: dir > 0 ? "40%" : "-40%",
                  filter: "blur(8px)",
                  transition: { duration: 0.45, ease: EASE },
              },
};

const BigIndex = ({ value, dir, reduced }) => (
    <div
        className="product_sans flex select-none text-[76px] sm:text-[96px] lg:text-[120px] xl:text-[140px]"
        style={{
            fontWeight: 700,
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            color: "#202124",
            fontVariantNumeric: "tabular-nums",
        }}
        aria-hidden="true"
    >
        {[...value].map((ch, pos) => (
            <span key={pos} className="grid">
                <AnimatePresence initial={false} custom={{ dir, reduced }}>
                    <motion.span
                        key={ch}
                        custom={{ dir, reduced }}
                        variants={digitVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        style={{ gridArea: "1 / 1" }}
                    >
                        {ch}
                    </motion.span>
                </AnimatePresence>
            </span>
        ))}
    </div>
);

// The badge's letters scramble through glyphs before settling on the new
// initials, the way they flicker in the video.
const GLYPHS = "ABCDEFGHJKLMNPRSTUVWXYZ/#*+";

const useScramble = (text, enabled) => {
    const [out, setOut] = useState(text);
    const first = useRef(true);
    useEffect(() => {
        if (first.current || !enabled) {
            first.current = false;
            setOut(text);
            return;
        }
        const frames = 9;
        let frame = 0;
        const id = setInterval(() => {
            frame += 1;
            if (frame >= frames) {
                setOut(text);
                clearInterval(id);
                return;
            }
            // Letters lock in left to right over the last few frames.
            setOut(
                [...text]
                    .map((ch, i) =>
                        frame >= frames - (text.length - i) * 2
                            ? ch
                            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
                    )
                    .join(""),
            );
        }, 60);
        return () => clearInterval(id);
    }, [text, enabled]);
    return out;
};

// The badge the outgoing card collapses into. As the card lands, the badge
// gives a small pulse and the next speaker's colour grows out from its centre
// (rather than blending one colour into the other through a muddy middle).
const Badge = ({ speaker, accent, slideKey, reduced }) => {
    const letters = useScramble(initialsOf(speaker?.name), !reduced);
    const pulse = useAnimationControls();
    const first = useRef(true);

    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }
        if (reduced) return;
        pulse.start({
            scale: [1, 1.14, 1],
            transition: { duration: 0.55, ease: EASE_OUT, delay: 0.38 },
        });
    }, [slideKey, reduced, pulse]);

    return (
        <motion.div
            aria-hidden="true"
            className="product_sans pointer-events-none absolute z-40 flex aspect-square w-[22%] items-center justify-center overflow-hidden rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.12)]"
            style={{ left: "4%", top: "2.5%", translate: "-50% -50%" }}
            animate={pulse}
        >
            <AnimatePresence initial={false}>
                <motion.span
                    key={slideKey}
                    className="absolute inset-0 rounded-full"
                    style={{ background: accent.solid }}
                    initial={reduced ? { opacity: 0 } : { scale: 0 }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        transition: reduced
                            ? { duration: 0.2 }
                            : { duration: 0.55, ease: EASE_OUT, delay: 0.38 },
                    }}
                    // The old colour stays underneath until the new one has
                    // filled the circle.
                    exit={{ opacity: 0, transition: { duration: 0, delay: reduced ? 0.2 : 0.95 } }}
                />
            </AnimatePresence>
            <motion.span
                className="relative text-[17px] sm:text-[20px] lg:text-[24px]"
                style={{
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    rotate: -14,
                    fontVariantNumeric: "tabular-nums",
                }}
                initial={false}
                animate={{ color: accent.ink }}
                transition={{ duration: 0.2, delay: reduced ? 0 : 0.5 }}
            >
                {letters}
            </motion.span>
        </motion.div>
    );
};

// What the cut-out portrait stands in front of: a pool of light where the
// head sits, rings radiating out behind it, and a dot grid in the corner the
// badge leaves free — all in the card's own colour.
const RINGS = [30, 46, 62, 78, 94];

const CardBackdrop = ({ accent }) => (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
            className="absolute inset-0"
            style={{
                background:
                    "radial-gradient(115% 70% at 50% 22%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 62%)",
            }}
        />
        <svg
            className="absolute left-1/2 top-[38%] w-[175%] -translate-x-1/2 -translate-y-1/2"
            viewBox="0 0 200 200"
            fill="none"
        >
            {RINGS.map((r, i) => (
                <circle
                    key={r}
                    cx="100"
                    cy="100"
                    r={r}
                    stroke={accent.solid}
                    strokeOpacity={0.26 - i * 0.04}
                    strokeWidth="0.5"
                />
            ))}
        </svg>
        <svg className="absolute right-[7%] top-[5.5%] w-[17%]" viewBox="0 0 50 50">
            {Array.from({ length: 25 }, (_, k) => (
                <circle
                    key={k}
                    cx={5 + (k % 5) * 10}
                    cy={5 + Math.floor(k / 5) * 10}
                    r="1.7"
                    fill={accent.solid}
                    fillOpacity="0.5"
                />
            ))}
        </svg>
    </div>
);

// Photo, or — until a speaker's photo is in — their initials on their colour.
const CardFace = ({ speaker, accent, eager }) =>
    speaker.image ? (
        <>
            <CardBackdrop accent={accent} />
            <img
                src={speaker.image}
                alt={speaker.name}
                draggable={false}
                loading={eager ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 h-full w-full origin-bottom object-cover transition-transform duration-700 group-hover/card:scale-[1.04]"
                style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
            />
        </>
    ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <CardBackdrop accent={accent} />
            <span
                className="product_sans relative"
                style={{
                    fontSize: "clamp(56px, 30cqw, 140px)",
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                    color: accent.solid,
                }}
            >
                {initialsOf(speaker.name)}
            </span>
            <span
                className="product_sans relative text-[12px] uppercase sm:text-[13px]"
                style={{ fontWeight: 600, letterSpacing: "0.16em", color: "#5f6368" }}
            >
                Photo coming soon
            </span>
        </div>
    );

const ArrowButton = ({ dir, onClick, label }) => {
    const Icon = dir < 0 ? ArrowLeft : ArrowRight;
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#dadce0] bg-white/80 text-[#3c4043] backdrop-blur-sm transition-colors duration-300 hover:border-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] focus-visible:border-transparent focus-visible:bg-[var(--accent)] focus-visible:text-[var(--accent-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A73E8] lg:h-12 lg:w-12"
        >
            {/* At rest the arrows lean diagonally (↙ ↘) and straighten out
                when the pointer reaches the controls (or keyboard focus does);
                on touch screens, with no hover to wait for, they stay
                straight. */}
            <Icon
                className={`h-5 w-5 transition-transform duration-500 group-hover/arrows:rotate-0 group-has-[:focus-visible]/arrows:rotate-0 [@media(hover:none)]:rotate-0 ${
                    dir < 0 ? "-rotate-45" : "rotate-45"
                }`}
                style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
                strokeWidth={1.75}
            />
        </button>
    );
};

// A small caps caption over each value; the value carries its own type size,
// since the name, role and session each sit at a different weight.
// A pill per speaker (the one on show stretches out in its colour) beside the
// arrows. It sits under the index on small screens and at the foot of the
// info column on large ones, so the page renders it in both places and shows
// one.
const Pager = ({ active, onPrev, onNext, className }) => (
    <div className={`group/arrows ${className}`}>
        <div aria-hidden="true" className="flex items-center gap-1.5">
            {SPEAKERS.map((s, i) => (
                <span
                    key={s.id ?? i}
                    className="h-1.5 rounded-full transition-[width,background-color] duration-500"
                    style={{
                        width: i === active ? 22 : 6,
                        background: i === active ? ACCENTS[i % ACCENTS.length].solid : "#DADCE0",
                        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                />
            ))}
        </div>
        <div className="flex gap-2">
            <ArrowButton dir={-1} onClick={onPrev} label="Previous speaker" />
            <ArrowButton dir={1} onClick={onNext} label="Next speaker" />
        </div>
    </div>
);

const Field = ({ label, children }) => (
    <div>
        <div
            className="product_sans text-[12px] uppercase md:text-[13px]"
            style={{ fontWeight: 600, letterSpacing: "0.14em", color: "#5f6368", lineHeight: 1.3 }}
        >
            {label}
        </div>
        <div className="product_sans mt-1.5 md:mt-2">{children}</div>
    </div>
);

const reveal = (reduced, delay = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.7, ease: EASE_OUT, delay },
});

const SpeakersSection = () => {
    const reduced = useReducedMotion();
    const n = SPEAKERS.length;
    const [active, setActive] = useState(0);
    const [dir, setDir] = useState(1);
    const prevOffsets = useRef({});
    const panned = useRef(false);

    const go = useCallback(
        (step) => {
            if (n < 2) return;
            setDir(step);
            setActive((a) => (a + step + n) % n);
        },
        [n],
    );
    const next = useCallback(() => go(1), [go]);
    const prev = useCallback(() => go(-1), [go]);

    const offsets = SPEAKERS.map((_, i) => offsetOf(i, active, n));
    useEffect(() => {
        prevOffsets.current = Object.fromEntries(offsets.map((d, i) => [i, d]));
    });

    const speaker = SPEAKERS[active];
    const accent = ACCENTS[active % ACCENTS.length];
    const number = String(active + 1).padStart(2, "0");
    const socials = speaker
        ? SOCIALS.filter(({ key }) => isProfile(speaker.socialLinks?.[key]))
        : [];
    const companyLine = speaker
        ? [speaker.company, speaker.position].filter(Boolean)
        : [];

    return (
        // `--pad` mirrors the container's side padding at each breakpoint, so
        // `--to-edge` is the distance from the content's right edge to the
        // screen's — how far the deck window reaches past it. The section clips
        // sideways (without becoming a scroll box) so nothing can overhang.
        <section
            id="speakers"
            className="relative w-full select-none overflow-x-clip [--pad:1.25rem] sm:[--pad:2rem] md:[--pad:2.5rem] xl:[--pad:4rem]"
            style={{ "--to-edge": "calc(max(0px, 50vw - 560px) + var(--pad))" }}
        >
            <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8 md:px-10 md:py-24 xl:px-16 xl:py-28">
                <motion.h2
                    className="product_sans text-center text-[28px] sm:text-[34px] md:text-[42px] lg:text-[52px] xl:text-[56px]"
                    style={{
                        fontWeight: 700,
                        lineHeight: 1.05,
                        letterSpacing: "-0.01em",
                        color: "#000000",
                    }}
                    {...reveal(reduced)}
                >
                    Meet our <span style={{ color: "#4285F4" }}>Speakers</span>
                </motion.h2>

                <motion.p
                    className="product_sans mx-auto mt-4 max-w-[640px] text-center text-[16px] sm:text-[17px] md:mt-6 md:text-[19px] xl:text-[20px]"
                    style={{ fontWeight: 400, lineHeight: 1.5, color: "#5f6368" }}
                    {...reveal(reduced, 0.08)}
                >
                    The people taking the stage at DevFest Kolkata 2026.
                </motion.p>

                {n === 0 ? (
                    <p
                        className="product_sans mt-10 text-center text-[15px] md:text-[17px]"
                        style={{ color: "#5f6368" }}
                    >
                        Speakers will be announced soon.
                    </p>
                ) : (
                    <motion.div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Speakers"
                        onKeyDown={(e) => {
                            if (e.key === "ArrowRight") next();
                            if (e.key === "ArrowLeft") prev();
                        }}
                        className="relative mt-12 px-6 py-10 sm:px-10 sm:py-12 md:mt-16 lg:px-14 lg:py-16"
                        style={{
                            "--accent": accent.solid,
                            "--accent-ink": accent.ink,
                        }}
                        {...reveal(reduced, 0.1)}
                    >
                        <p className="sr-only" aria-live="polite">
                            {`Speaker ${active + 1} of ${n}: ${speaker.name}${
                                companyLine.length ? `, ${companyLine.join(", ")}` : ""
                            }${
                                DAYS[speaker.day]
                                    ? `, ${DAYS[speaker.day].label} ${DAYS[speaker.day].kind}, ${DAYS[speaker.day].spoken}`
                                    : ""
                            }`}
                        </p>

                        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:grid-rows-[1fr_auto_auto] lg:gap-x-10 xl:gap-x-12">
                            {/* The stage: the card on show, with the rest of
                                the deck queued to its right so the next speaker
                                peeks in. It is a size container, so the card is
                                sized off the stage (`--card-w`) even inside the
                                deck window, which is wider. */}
                            <motion.div
                                className="relative col-span-2 row-start-1 -mr-6 [--card-w:min(74cqw,420px)] sm:-mr-10 sm:[--card-w:min(62cqw,420px)] lg:col-span-1 lg:col-start-2 lg:row-span-3 lg:-mr-14 lg:[--card-w:min(84cqw,440px)]"
                                style={{ touchAction: "pan-y", containerType: "inline-size" }}
                                onPointerDown={() => {
                                    panned.current = false;
                                }}
                                onPanStart={() => {
                                    panned.current = true;
                                }}
                                onPanEnd={(_, info) => {
                                    if (info.offset.x < -40) next();
                                    else if (info.offset.x > 40) prev();
                                }}
                            >
                                {/* A soft glow in the speaker's colour behind the
                                    card on show, so the deck lifts off the page. */}
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-0 top-[7cqw] aspect-[4/5] w-[var(--card-w)] lg:top-[6cqw]"
                                >
                                    <div
                                        className="absolute inset-x-[4%] bottom-[-5%] top-[14%] rounded-[45%] opacity-35 blur-[56px] transition-colors duration-700"
                                        style={{ background: accent.solid }}
                                    />
                                </div>

                                {/* Slot: holds the card's 4:5 box in the flow so
                                    the stage has height, and carries the badge
                                    above the deck window so it is never clipped. */}
                                <div className="pointer-events-none relative z-20 mt-[7cqw] aspect-[4/5] w-[var(--card-w)] lg:mt-[6cqw]">
                                    <Badge
                                        speaker={speaker}
                                        accent={accent}
                                        slideKey={active}
                                        reduced={reduced}
                                    />
                                </div>

                                {/* Deck window: runs from the stage out to the
                                    screen's right edge, and fades out from just
                                    past the card on show, so the queued cards
                                    melt into the page instead of being cut off. */}
                                <div
                                    className="absolute inset-y-0 left-0 z-10 overflow-hidden"
                                    style={{
                                        right: "calc(-1 * var(--to-edge, 0px))",
                                        WebkitMaskImage: DECK_FADE,
                                        maskImage: DECK_FADE,
                                    }}
                                >
                                    <div
                                        className="absolute left-0 top-[7cqw] aspect-[4/5] w-[var(--card-w)] lg:top-[6cqw]"
                                        style={{ containerType: "inline-size" }}
                                    >
                                        {SPEAKERS.map((s, i) => {
                                            const d = offsets[i];
                                            const cardAccent = ACCENTS[i % ACCENTS.length];
                                            return (
                                                <motion.div
                                                    key={s.id ?? i}
                                                    aria-hidden={d !== 0}
                                                    onClick={() => {
                                                        if (panned.current) return;
                                                        if (d === 1) next();
                                                    }}
                                                    className="group/card absolute inset-0 overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]"
                                                    style={{
                                                        background: cardAccent.soft,
                                                        transformOrigin: "0% 0%",
                                                        zIndex: d < 0 ? 30 : d === 0 ? 20 : 10 - d,
                                                        cursor: d === 1 ? "pointer" : "default",
                                                        pointerEvents: d < 0 ? "none" : "auto",
                                                    }}
                                                    initial={false}
                                                    animate={cardTarget(d, reduced)}
                                                    transition={cardTransition(
                                                        prevOffsets.current[i],
                                                        d,
                                                        dir,
                                                        reduced,
                                                    )}
                                                >
                                                    <CardFace
                                                        speaker={s}
                                                        accent={cardAccent}
                                                        eager={d >= -1 && d <= 2}
                                                    />
                                                    {DAYS[s.day] && <DayChip day={DAYS[s.day]} />}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Index: a short rule in the four Google colours,
                                then the big number over the count. */}
                            <div className="col-start-1 row-start-2 mt-8 lg:mt-0">
                                <motion.div
                                    className="h-[3px] w-24 origin-left rounded-full lg:w-36"
                                    style={{ background: GOOGLE_RULE }}
                                    initial={reduced ? false : { scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true, amount: 1 }}
                                    transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.2 }}
                                />
                                <div className="mt-4 flex items-end gap-2 lg:mt-6 lg:gap-3">
                                    <BigIndex value={number} dir={dir} reduced={reduced} />
                                    <span
                                        aria-hidden="true"
                                        className="product_sans pb-[0.3em] text-[18px] sm:text-[20px] lg:text-[24px] xl:text-[26px]"
                                        style={{
                                            fontWeight: 500,
                                            color: "#9AA0A6",
                                            fontVariantNumeric: "tabular-nums",
                                        }}
                                    >
                                        / {String(n).padStart(2, "0")}
                                    </span>
                                </div>
                            </div>

                            {n > 1 && (
                                <Pager
                                    active={active}
                                    onPrev={prev}
                                    onNext={next}
                                    className="col-start-2 row-start-2 flex flex-col items-center gap-4 self-end pb-1 lg:hidden"
                                />
                            )}

                            {/* Who they are. */}
                            <div className="col-span-2 row-start-3 mt-8 flex flex-col gap-5 lg:col-span-1 lg:col-start-1 lg:mt-6">
                                <Field label="Name">
                                    <Swap swapKey={`name-${active}`} dir={dir} reduced={reduced}>
                                        <h3
                                            className="text-[28px] sm:text-[32px] lg:text-[34px] xl:text-[38px]"
                                            style={{
                                                fontWeight: 700,
                                                lineHeight: 1.1,
                                                letterSpacing: "-0.015em",
                                                color: "#202124",
                                            }}
                                        >
                                            {speaker.name}
                                        </h3>
                                    </Swap>
                                </Field>

                                {companyLine.length > 0 && (
                                    <Field label="Company & Position">
                                        <Swap swapKey={`role-${active}`} dir={dir} reduced={reduced}>
                                            <p
                                                className="text-[17px] md:text-[18px] xl:text-[19px]"
                                                style={{ lineHeight: 1.4 }}
                                            >
                                                {speaker.company && (
                                                    <span
                                                        className="block"
                                                        style={{ fontWeight: 700, color: accent.text }}
                                                    >
                                                        {speaker.company}
                                                        {speaker.position ? "," : ""}
                                                    </span>
                                                )}
                                                {speaker.position && (
                                                    <span
                                                        className="block"
                                                        style={{ fontWeight: 400, color: "#3c4043" }}
                                                    >
                                                        {speaker.position}
                                                    </span>
                                                )}
                                            </p>
                                        </Swap>
                                    </Field>
                                )}

                                {speaker.talk && (
                                    <div
                                        className="relative overflow-hidden rounded-2xl py-4 pl-5 pr-4 transition-colors duration-500 md:py-5 md:pl-6 md:pr-5"
                                        style={{ background: accent.tint }}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-y-4 left-0 w-1 rounded-r-full transition-colors duration-500"
                                            style={{ background: accent.solid }}
                                        />
                                        <Field label="Session">
                                            <Swap swapKey={`talk-${active}`} dir={dir} reduced={reduced}>
                                                <p
                                                    className="text-[18px] md:text-[19px] xl:text-[21px]"
                                                    style={{
                                                        fontWeight: 500,
                                                        lineHeight: 1.35,
                                                        letterSpacing: "-0.005em",
                                                        color: "#202124",
                                                    }}
                                                >
                                                    {speaker.talk}
                                                </p>
                                            </Swap>
                                        </Field>
                                    </div>
                                )}

                                {/* Foot: their links, and on large screens the
                                    pager, where the arrows have always sat. */}
                                <div
                                    className={`items-center gap-4 ${
                                        socials.length > 0 ? "flex" : "hidden lg:flex"
                                    }`}
                                >
                                    {socials.length > 0 && (
                                        <Swap swapKey={`social-${active}`} dir={dir} reduced={reduced}>
                                            <div className="flex flex-wrap gap-2">
                                                {socials.map(({ key, label, icon: Icon }) => (
                                                    <a
                                                        key={key}
                                                        href={speaker.socialLinks[key]}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        aria-label={`${speaker.name} on ${label}`}
                                                        className="product_sans inline-flex h-10 items-center gap-2 rounded-full border border-[#dadce0] bg-white px-4 text-[14px] text-[#3c4043] transition-colors duration-300 hover:border-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A73E8] md:text-[15px]"
                                                        style={{ fontWeight: 500 }}
                                                    >
                                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                                        {label}
                                                    </a>
                                                ))}
                                            </div>
                                        </Swap>
                                    )}
                                    {n > 1 && (
                                        <Pager
                                            active={active}
                                            onPrev={prev}
                                            onNext={next}
                                            className="ml-auto hidden items-center gap-4 lg:flex"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default SpeakersSection;
