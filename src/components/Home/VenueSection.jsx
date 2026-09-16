"use client";

import { useEffect, useRef, useState } from "react";

const PHOTO_FRONT = "/venue.jpg";
const PHOTO_BACK = "/venue1.jpg";

// The section is pinned for this much scroll; the photo flip plays out across it.
const RUNWAY_VH = 260;

const MAPS_URL =
    "https://www.google.com/maps/search/?api=1&query=The+Westin+Kolkata+Rajarhat";

const clamp01 = (n) => Math.min(1, Math.max(0, n));

// Ease so each face is held for a beat and the turn happens through the middle.
const smoothstep = (edge0, edge1, x) => {
    const t = clamp01((x - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
};

const FACES = [
    {
        glow: "radial-gradient(52% 50% at 12% 34%, rgba(66,133,244,0.40) 0%, rgba(66,133,244,0.10) 44%, rgba(66,133,244,0) 72%)",
        title: "Venue of the Event",
        lines: ["The Westin", "Kolkata, Rajarhat"],
        caption: "Map Guide",
        captionHref: MAPS_URL,
        photo: PHOTO_FRONT,
        photoAlt: "The Westin Kolkata, Rajarhat",
        tilt: -15,
    },
    {
        glow: "radial-gradient(52% 50% at 12% 34%, rgba(251,188,4,0.52) 0%, rgba(251,188,4,0.14) 46%, rgba(251,188,4,0) 74%)",
        title: "Date of the Event",
        lines: ["22nd November,", "2026"],
        caption: "Mark Your Calendar",
        photo: PHOTO_BACK,
        photoAlt: "The Westin Kolkata tower by day",
        tilt: -15,
    },
];

// The copy block for one face. Stacked on top of its sibling and crossfaded, so
// the column never reflows mid-turn.
const FaceCopy = ({ face, opacity, shift, stacked }) => (
    <div
        className={stacked ? "absolute inset-0" : "relative"}
        style={{
            opacity,
            transform: `translateY(${shift}px)`,
            pointerEvents: opacity > 0.5 ? "auto" : "none",
            willChange: "opacity, transform",
        }}
    >
        <h2
            className="product_sans text-[28px] sm:text-[34px] md:text-[42px] lg:text-[52px] xl:text-[56px]"
            style={{
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                color: "#000000",
            }}
        >
            {face.title}
        </h2>

        <div
            className="product_sans mt-5 text-[19px] sm:text-[22px] md:mt-8 md:text-[27px] lg:text-[32px] xl:mt-12 xl:text-[36px]"
            style={{
                fontWeight: 500,
                lineHeight: 1.25,
                color: "#000000",
            }}
        >
            {face.lines.map((l) => (
                <div key={l}>{l}</div>
            ))}
        </div>

        {face.captionHref ? (
            <a
                href={face.captionHref}
                target="_blank"
                rel="noopener noreferrer"
                className="product_sans mt-5 inline-block text-[13px] underline-offset-4 hover:underline md:mt-8 md:text-[14px] xl:mt-12 xl:text-[15px]"
                style={{ color: "#5f6368" }}
            >
                {face.caption}
            </a>
        ) : (
            <div
                className="product_sans mt-5 text-[13px] md:mt-8 md:text-[14px] xl:mt-12 xl:text-[15px]"
                style={{ color: "#5f6368" }}
            >
                {face.caption}
            </div>
        )}
    </div>
);

// One photo of the flipper. The back face is pre-rotated about the same
// horizontal axis the turn uses, so it reads upright once it comes to the front.
const PhotoFace = ({ src, alt, back = false }) => (
    <img
        src={src}
        alt={alt}
        draggable={false}
        loading="lazy"
        className="absolute inset-0 block h-full w-full rounded-xl object-cover md:rounded-2xl xl:rounded-[20px]"
        style={{
            transform: back ? "rotateX(180deg)" : "none",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
        }}
    />
);

const VenueSection = () => {
    const sectionRef = useRef(null);
    const [p, setP] = useState(0);
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
        const on = () => setReduced(rm.matches);
        on();
        rm.addEventListener?.("change", on);
        return () => rm.removeEventListener?.("change", on);
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

    // Hold face one, turn through the middle, hold face two.
    const flip = smoothstep(0.18, 0.82, p);
    // Rise and settle at the ends so the block arrives rather than just sitting.
    const entry = smoothstep(0, 0.16, p);
    const exit = 1 - smoothstep(0.86, 1, p);
    const lift = (1 - entry) * 48 - (1 - exit) * 32;

    // Copy swaps at the halfway point of the photo's turn, so text and image
    // change over together.
    const swap = smoothstep(0.38, 0.62, flip);
    // Slight tilt that eases from one face's angle to the other's. It lives on
    // the photo's container, so frame and photo carry the exact same angle.
    const tilt = FACES[0].tilt + (FACES[1].tilt - FACES[0].tilt) * flip;
    // Content shell, shared by both layouts — same width cap and side gutter as
    // the About/Tickets sections above, so every section lines up.
    const SHELL =
        "mx-auto w-full max-w-[1120px] px-5 sm:px-8 md:px-10 xl:px-16";

    // One size for the photo frame, shared by both layouts. The `min()` caps it
    // against viewport height as well as width, so the portrait card can't
    // outgrow the pinned screen on a short display.
    const PHOTO_FRAME =
        "relative aspect-[5/4] w-full max-w-[300px] shrink-0 md:aspect-[4/6] md:max-w-[min(300px,calc(74vh*0.66))] lg:max-w-[min(340px,calc(74vh*0.66))] xl:max-w-[min(380px,calc(74vh*0.66))]";

    // The two copy blocks stacked and crossfaded, so the column never reflows
    // mid-turn.
    const copyColumn = (
        <div className="relative min-h-[190px] w-full md:min-h-[230px] xl:min-h-[290px]">
            {/* Brand glow, crossfaded with the copy. Sits behind the text and
                bleeds past the column — there is no card to contain it now. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute"
                style={{
                    inset: "-40% -25%",
                    background: FACES[0].glow,
                    opacity: 1 - swap,
                }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute"
                style={{
                    inset: "-40% -25%",
                    background: FACES[1].glow,
                    opacity: swap,
                }}
            />

            <FaceCopy face={FACES[0]} opacity={1 - swap} shift={swap * -30} stacked />
            <FaceCopy face={FACES[1]} opacity={swap} shift={(1 - swap) * 30} stacked />
        </div>
    );

    // Reduced motion: no pinning, no 3D — the two pairings simply stack.
    if (reduced) {
        return (
            <section id="venue" className="relative w-full select-none">
                <div
                    className={`flex w-full flex-col gap-10 py-10 md:gap-14 md:py-16 xl:gap-20 xl:py-20 ${SHELL}`}
                >
                    {FACES.map((face) => (
                        <div
                            key={face.title}
                            className="flex w-full flex-col items-center gap-8 md:flex-row md:gap-6 lg:gap-8 xl:gap-10"
                        >
                            <div className="relative w-full">
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute"
                                    style={{ inset: "-40% -25%", background: face.glow }}
                                />
                                <FaceCopy face={face} opacity={1} shift={0} />
                            </div>
                            <div
                                className={PHOTO_FRAME}
                                style={{ transform: `rotate(${face.tilt}deg)` }}
                            >
                                <PhotoFace src={face.photo} alt={face.photoAlt} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section
            ref={sectionRef}
            id="venue"
            className="relative w-full select-none"
            style={{ height: `${RUNWAY_VH}vh` }}
        >
            <div className="sticky top-0 flex h-screen w-full items-center supports-[height:100dvh]:h-dvh">
                <div
                    className={`flex w-full flex-col items-center gap-8 md:flex-row md:gap-6 lg:gap-8 xl:gap-10 ${SHELL}`}
                    style={{
                        transform: `translateY(${lift}px)`,
                        willChange: "transform",
                    }}
                >
                    {copyColumn}

                    {/* Only this column turns. The tilt sits on the frame, so
                        the container is angled with the photo rather than the
                        photo leaning inside an upright box. */}
                    <div
                        className={PHOTO_FRAME}
                        style={{
                            perspective: "1600px",
                            transform: `rotate(${tilt}deg)`,
                            willChange: "transform",
                        }}
                    >
                        <div
                            className="relative h-full w-full"
                            style={{
                                transformStyle: "preserve-3d",
                                // Vertical turn: the top edge rotates away.
                                transform: `rotateX(${flip * -180}deg)`,
                                willChange: "transform",
                            }}
                        >
                            <PhotoFace
                                src={FACES[0].photo}
                                alt={FACES[0].photoAlt}
                            />
                            <PhotoFace
                                src={FACES[1].photo}
                                alt={FACES[1].photoAlt}
                                back
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VenueSection;
