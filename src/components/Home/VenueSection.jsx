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
            className="product_sans"
            style={{
                fontSize: "clamp(28px, 4.6vw, 68px)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                color: "#000000",
            }}
        >
            {face.title}
        </h2>

        <div
            className="product_sans"
            style={{
                marginTop: "clamp(14px, 2.2vw, 32px)",
                fontSize: "clamp(19px, 3vw, 44px)",
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
                className="product_sans inline-block underline-offset-4 hover:underline"
                style={{
                    marginTop: "clamp(12px, 1.8vw, 26px)",
                    fontSize: "clamp(12px, 1.2vw, 18px)",
                    color: "#5f6368",
                }}
            >
                {face.caption}
            </a>
        ) : (
            <div
                className="product_sans"
                style={{
                    marginTop: "clamp(12px, 1.8vw, 26px)",
                    fontSize: "clamp(12px, 1.2vw, 18px)",
                    color: "#5f6368",
                }}
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
        className="absolute inset-0 block h-full w-full object-cover"
        style={{
            transform: back ? "rotateX(180deg)" : "none",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: "clamp(14px, 1.8vw, 28px)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
        }}
    />
);

const VenueSection = () => {
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
    // Side margin. Desktop gets a generous one so the full-width row breathes;
    // phones keep a tight gutter or the copy runs out of room.
    const gutter = isMobile ? "clamp(20px, 6vw, 40px)" : "clamp(56px, 8vw, 180px)";

    // One size for the photo frame, shared by both layouts. The `min()` caps it
    // against viewport height as well as width, so the portrait card can't
    // outgrow the pinned screen on a short display.
    const photoRatio = isMobile ? "5 / 4" : "4 / 6";
    const photoMaxWidth = isMobile
        ? "min(100%, 380px)"
        : "min(clamp(215px, 24vw, 415px), calc(62vh * 4 / 6))";

    // The two copy blocks stacked and crossfaded, so the column never reflows
    // mid-turn.
    const copyColumn = (
        <div
            className="relative w-full"
            style={{ minHeight: "clamp(190px, 26vw, 330px)" }}
        >
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
                    className="flex w-full flex-col"
                    style={{
                        gap: "clamp(40px, 6vw, 90px)",
                        padding: `clamp(40px, 7vw, 96px) ${gutter}`,
                    }}
                >
                    {FACES.map((face) => (
                        <div
                            key={face.title}
                            className="flex w-full items-center"
                            style={{
                                flexDirection: isMobile ? "column" : "row",
                                gap: "clamp(24px, 4vw, 64px)",
                            }}
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
                                className="relative w-full shrink-0"
                                style={{
                                    maxWidth: photoMaxWidth,
                                    aspectRatio: photoRatio,
                                    transform: `rotate(${face.tilt}deg)`,
                                }}
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
                    className="flex w-full items-center"
                    style={{
                        flexDirection: isMobile ? "column" : "row",
                        gap: "clamp(28px, 5vw, 80px)",
                        padding: `0 ${gutter}`,
                        transform: `translateY(${lift}px)`,
                        willChange: "transform",
                    }}
                >
                    {copyColumn}

                    {/* Only this column turns. The tilt sits on the frame, so
                        the container is angled with the photo rather than the
                        photo leaning inside an upright box. */}
                    <div
                        className="relative w-full shrink-0"
                        style={{
                            perspective: "1600px",
                            maxWidth: photoMaxWidth,
                            aspectRatio: photoRatio,
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
