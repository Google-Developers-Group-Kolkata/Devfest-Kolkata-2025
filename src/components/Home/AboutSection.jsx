"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
    motion,
    motionValue,
    useAnimationFrame,
    useMotionValue,
    useReducedMotion,
} from "framer-motion";

// Memories collage — five photos scattered across the section (design 1440x1143),
// each with its own hand-drawn style accents. `w` is a % of the section width;
// height follows from the shared 384x231 source ratio.
// Filenames carry a space, so the paths are URL-encoded.
const PHOTOS = [
    {
        src: "/Rectangle%2021210.png",
        alt: "Speaker on stage at DevFest Kolkata",
        left: 69.5,
        top: 19.5,
        w: 28,
        decor: [
            { type: "frame", color: "#34a853", dx: -1, dy: 1 },
            { type: "circle", color: "#fbbc04", at: "tl" },
        ],
    },
    {
        src: "/Rectangle%2021209.png",
        alt: "Attendees gathering at the DevFest registration desk",
        left: 3.5,
        top: 48.5,
        w: 30,
        decor: [
            { type: "circle", color: "#4285f4", at: "tr" },
            { type: "circle", color: "#4285f4", at: "bl" },
            { type: "line", color: "#fbbc04", at: "t" },
            { type: "line", color: "#f63130", at: "b" },
        ],
    },
    {
        src: "/Rectangle%2021206.png",
        alt: "Full auditorium during a DevFest keynote",
        left: 47,
        top: 47.5,
        w: 27,
        decor: [],
    },
    {
        src: "/Rectangle%2021212.png",
        alt: "Attendees with laptops in the audience",
        left: 21,
        top: 73,
        w: 28,
        decor: [
            { type: "frame", color: "#f63130", dx: -1, dy: 1 },
            { type: "circle", color: "#34a853", at: "br" },
        ],
    },
    {
        src: "/Rectangle%2021207.png",
        alt: "Volunteers handing out saplings at the venue",
        left: 64,
        top: 73,
        w: 27.5,
        decor: [
            { type: "frame", color: "#f63130", dx: 1, dy: 1 },
            { type: "line", color: "#4285f4", at: "t" },
        ],
    },
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

// How far (px) the whole section starts below its resting place.
const SLIDE = 72;

// Tiles are close to square, so the 384x231 sources are centre-cropped.
const TILE_RATIO = 1.15;

// The mobile strip: an endless row where size follows position. Whichever
// photo is crossing the middle of the screen is the largest, and they taper
// toward both edges, so each one swells as it arrives and shrinks as it goes.
const STRIP = {
    gap: 12,
    copies: 3, // enough that the loop's seam is never on screen
    speed: 38, // px per second
    peak: 1, // scale in the middle of the screen
    min: 0.6, // scale out at either edge
};

// Peak tile height for a given strip width — the same clamp the rest of the
// section uses, but in JS, because the position maths needs the number.
const tileHeightFor = (width) => Math.min(150, Math.max(112, width * 0.19));

// A soft falloff rather than a straight line: `away` is 0 in the middle of the
// screen and 1 at the edge, and cosine keeps the peak round instead of pointed.
const scaleFor = (away) =>
    STRIP.min + (STRIP.peak - STRIP.min) * Math.cos((away * Math.PI) / 2);

const MemoryStrip = () => {
    const reduced = useReducedMotion();
    const viewportRef = useRef(null);
    const travelled = useRef(0);
    const [live, setLive] = useState(true);
    const [box, setBox] = useState({ w: 0, h: 0, view: 0 });

    // Every tile keeps the same layout box and only its transform changes.
    // A scale that fed back into layout would shift the very tile it was
    // measured from, and the strip's geometry has to stay fixed for the
    // position maths to hold.
    const x = useMotionValue(0);
    const tiles = useMemo(
        () =>
            Array.from({ length: PHOTOS.length * STRIP.copies }, (_, i) => ({
                photo: PHOTOS[i % PHOTOS.length],
                copy: Math.floor(i / PHOTOS.length),
                scale: motionValue(STRIP.min),
            })),
        []
    );

    useEffect(() => {
        const measure = () => {
            const view =
                viewportRef.current?.clientWidth || window.innerWidth || 0;
            const h = tileHeightFor(view);
            setBox({ w: h * TILE_RATIO, h, view });
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    // No reason to compute transforms for a strip nobody can see; the page is
    // long and this sits near the top of it.
    useEffect(() => {
        const el = viewportRef.current;
        if (!el || typeof IntersectionObserver === "undefined") return;
        const io = new IntersectionObserver(
            ([entry]) => setLive(entry.isIntersecting),
            { rootMargin: "200px 0px" }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // Place the track and give every tile the scale its position earns.
    const place = (slid) => {
        const pitch = box.w + STRIP.gap;
        if (!pitch || !box.view) return;
        x.set(-slid);
        const middle = box.view / 2;
        tiles.forEach((tile, i) => {
            const centre = -slid + i * pitch + box.w / 2;
            const away = Math.min(1, Math.abs(centre - middle) / middle);
            tile.scale.set(scaleFor(away));
        });
    };

    // Counting elapsed time rather than reading the clock keeps the strip from
    // jumping forward over the stretches where it was paused.
    useAnimationFrame((_, delta) => {
        if (reduced || !live) return;
        const group = PHOTOS.length * (box.w + STRIP.gap);
        if (!group) return;
        travelled.current =
            (travelled.current + (delta / 1000) * STRIP.speed) % group;
        place(travelled.current);
    });

    // Standing still for anyone who asked for less motion: every tile at full
    // size rather than frozen part-way through the wave, which reads as a
    // plain row instead of a stalled animation. The strip is swipeable there,
    // so the photos past the edge stay reachable.
    useEffect(() => {
        if (reduced) tiles.forEach((tile) => tile.scale.set(STRIP.peak));
    }, [reduced, tiles]);

    return (
        <div
            ref={viewportRef}
            className="-mx-5 overflow-hidden py-2 motion-reduce:overflow-x-auto sm:-mx-8"
        >
            <motion.div
                className="flex items-center"
                style={{ x, gap: STRIP.gap, willChange: "transform" }}
            >
                {tiles.map((tile, i) => (
                    <motion.div
                        key={i}
                        className="shrink-0"
                        style={{
                            width: box.w || undefined,
                            height: box.h || undefined,
                            scale: tile.scale,
                        }}
                    >
                        <img
                            src={tile.photo.src}
                            alt={tile.copy === 0 ? tile.photo.alt : ""}
                            aria-hidden={tile.copy === 0 ? undefined : "true"}
                            draggable={false}
                            loading="lazy"
                            className="block h-full w-full rounded-xl object-cover"
                            style={{ boxShadow: "0 6px 16px rgba(0,0,0,0.14)" }}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

// Accent geometry — frame offset, stroke width, circle diameter, line length.
// Stepped at the breakpoints rather than scaled off the viewport.
const DECOR_CLASS = [
    "[--dec-o:5px] md:[--dec-o:7px] xl:[--dec-o:9px]",
    "[--dec-s:1.5px] xl:[--dec-s:2px]",
    "[--dec-c:18px] md:[--dec-c:26px] xl:[--dec-c:32px]",
    "[--dec-l:28px] md:[--dec-l:44px] xl:[--dec-l:56px]",
].join(" ");

const CORNERS = {
    tl: { top: "calc(var(--dec-c) / -2)", left: "calc(var(--dec-c) / -2)" },
    tr: { top: "calc(var(--dec-c) / -2)", right: "calc(var(--dec-c) / -2)" },
    bl: { bottom: "calc(var(--dec-c) / -2)", left: "calc(var(--dec-c) / -2)" },
    br: { bottom: "calc(var(--dec-c) / -2)", right: "calc(var(--dec-c) / -2)" },
};

// Simple outlined shapes drawn around a photo — an offset frame, corner
// circles and short rules, in the four Google colors.
const Decor = ({ items }) =>
    items.map((d, i) => {
        if (d.type === "frame") {
            return (
                <div
                    key={i}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-[4px]"
                    style={{
                        border: `var(--dec-s) solid ${d.color}`,
                        transform: `translate(calc(var(--dec-o) * ${d.dx}), calc(var(--dec-o) * ${d.dy}))`,
                    }}
                />
            );
        }
        if (d.type === "circle") {
            return (
                <div
                    key={i}
                    aria-hidden="true"
                    className="absolute rounded-full"
                    style={{
                        width: "var(--dec-c)",
                        height: "var(--dec-c)",
                        border: `var(--dec-s) solid ${d.color}`,
                        ...CORNERS[d.at],
                    }}
                />
            );
        }
        // line — a short rule hugging the top or bottom edge
        return (
            <div
                key={i}
                aria-hidden="true"
                className="absolute"
                style={{
                    width: "var(--dec-l)",
                    height: "var(--dec-s)",
                    backgroundColor: d.color,
                    left: d.at === "t" ? "calc(var(--dec-o) * -1)" : "auto",
                    right: d.at === "t" ? "auto" : "calc(var(--dec-o) * -1)",
                    top: d.at === "t" ? "calc(var(--dec-o) * -1)" : "auto",
                    bottom: d.at === "t" ? "auto" : "calc(var(--dec-o) * -1)",
                }}
            />
        );
    });

const AboutSection = () => {
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const photoRefs = useRef([]);
    const [progress, setProgress] = useState(0);
    const [slide, setSlide] = useState(0);
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

                // Whole-section rise: 0 while the section is still low on
                // screen, 1 once its top has climbed past a third of the fold.
                let sp = 0;
                const sec = sectionRef.current;
                if (sec) {
                    const rect = sec.getBoundingClientRect();
                    sp = 1 - (rect.top - vh * 0.32) / (vh * 0.5);
                    sp = Math.min(1, Math.max(0, sp));
                    setSlide(sp);
                }
                // The rise shifts every child down, so measurements below take
                // it back out — otherwise the photos would chase the section.
                const lift = (1 - sp) * SLIDE;

                // Word-by-word "text completes" progress.
                const el = textRef.current;
                if (el) {
                    const rect = el.getBoundingClientRect();
                    const top = rect.top - lift;
                    const start = vh * 0.85;
                    const end = vh * 0.4;
                    const p = (start - top) / (start - end + rect.height);
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
                    const top = t.getBoundingClientRect().top - lift;
                    const p = 1 - Math.min(1, Math.max(0, (top - e) / (s - e)));
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

    // Words start fully invisible and fade in one by one as the scroll
    // advances — no ghosted preview of the text ahead of the reveal. The
    // spans still occupy their space, so the paragraph never reflows.
    const renderWords = () =>
        TOKENS.map((tok, i) => (
            <span
                key={i}
                style={{
                    color: tok.c,
                    opacity: i < showCount ? 1 : 0,
                    transition: "opacity 260ms ease",
                }}
            >
                {tok.t}
            </span>
        ));

    // The section itself stays put so the shared backdrop shows through; only
    // this inner wrapper rises into place.
    const riseStyle = {
        transform: `translateY(${(1 - slide) * SLIDE}px)`,
        opacity: slide,
        transition: "transform 200ms linear, opacity 200ms linear",
        willChange: "transform, opacity",
    };

    const photoStyle = (i) => ({
        opacity: photoProgress[i],
        transform: `translateY(${(1 - photoProgress[i]) * 20}px) scale(${0.9 + photoProgress[i] * 0.1})`,
        transformOrigin: "center",
        transition: "opacity 150ms linear, transform 150ms linear",
    });

    // Mobile: centred paragraph over a row of photos that scrolls on forever.
    // Desktop: the Figma percentage collage.
    if (isMobile) {
        return (
            <section
                ref={sectionRef}
                id="about"
                className="relative w-full select-none overflow-hidden px-5 pb-16 pt-10 sm:px-8"
            >
                <div style={riseStyle}>
                    <h2
                        className="product_sans mb-5 text-center text-[22px] sm:text-[26px]"
                        style={{ fontWeight: 500, lineHeight: 1.1, color: "#000000" }}
                    >
                        Memories we Created
                    </h2>
                    <div
                        ref={textRef}
                        className="product_sans pointer-events-none mx-auto mb-9 max-w-[52ch] text-center text-[15px] sm:text-[18px] md:text-[21px]"
                        style={{ fontWeight: 500, lineHeight: 1.5, color: "#000000" }}
                    >
                        {renderWords()}
                    </div>

                    <MemoryStrip />
                </div>
            </section>
        );
    }

    return (
        <section
            ref={sectionRef}
            id="about"
            className="relative w-full select-none px-6 pb-8 md:px-10 xl:px-16 xl:pb-12"
        >
            <div
                className="relative mx-auto w-full max-w-[1120px]"
                style={{ aspectRatio: "1440 / 1143", ...riseStyle }}
            >
                {/* Heading */}
                <h2
                    className="product_sans absolute text-[26px] md:text-[30px] lg:text-[36px] xl:text-[42px]"
                    style={{
                        left: "4.9%",
                        top: "7.5%",
                        fontWeight: 500,
                        lineHeight: 1.1,
                        color: "#000000",
                    }}
                >
                    Memories we Created
                </h2>

                {/* About paragraph — fills word by word on scroll */}
                <div
                    ref={textRef}
                    className="product_sans pointer-events-none absolute text-[16px] md:text-[18px] lg:text-[23px] xl:text-[28px]"
                    style={{
                        left: "4.9%",
                        top: "19.5%",
                        width: "59%",
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
                        className={`absolute ${DECOR_CLASS}`}
                        style={{
                            left: `${p.left}%`,
                            top: `${p.top}%`,
                            width: `${p.w}%`,
                            aspectRatio: "384 / 231",
                            ...photoStyle(i),
                        }}
                    >
                        <img
                            src={p.src}
                            alt={p.alt}
                            draggable={false}
                            loading="lazy"
                            className="block w-full h-full object-cover rounded-[4px]"
                            style={{
                                boxShadow: "0px 6px 16px rgba(0,0,0,0.25)",
                            }}
                        />
                        <Decor items={p.decor} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AboutSection;
