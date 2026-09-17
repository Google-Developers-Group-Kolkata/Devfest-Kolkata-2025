"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CalendarPlus, MapPin } from "lucide-react";

const PHOTO_FRONT = "/venue.jpg";
const PHOTO_BACK = "/venue1.jpg";

// The section is pinned for this much scroll; the photo flip plays out across it.
const RUNWAY_VH = 260;

const MAPS_URL =
    "https://www.google.com/maps/search/?api=1&query=The+Westin+Kolkata+Rajarhat";

// The one place the event's when/where is written down for the calendar link.
// The times are local wall-clock hours — `ctz` below tells Google which zone
// to read them in — and run from doors open to the last session.
const EVENT = {
    title: "DevFest Kolkata 2026",
    start: "20261122T083000",
    end: "20261122T170000",
    timeZone: "Asia/Kolkata",
    location: "The Westin Kolkata Rajarhat, New Town, Kolkata, West Bengal",
    details:
        "DevFest Kolkata 2026 by GDG Kolkata — a full day of talks, workshops and community at The Westin Kolkata, Rajarhat.",
};

// Google Calendar's own event-composer link: it opens a prefilled event the
// user only has to save, on whichever account they are signed in with.
const CALENDAR_URL = `https://calendar.google.com/calendar/render?${new URLSearchParams(
    {
        action: "TEMPLATE",
        text: EVENT.title,
        dates: `${EVENT.start}/${EVENT.end}`,
        details: EVENT.details,
        location: EVENT.location,
        ctz: EVENT.timeZone,
    }
).toString()}`;

const clamp01 = (n) => Math.min(1, Math.max(0, n));

// Phone layout budget, all inside one pinned screen.
const EDGE_GAP = 100; // kept clear above the copy and below the card, at rest
const STACK_GAP = 50; // between the copy and the card (matches `gap-6`)
// Below this pinned height there is no room to stack copy over card — that is
// a phone on its side, so it falls back to the side-by-side layout.
const COMPACT_H = 540;

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
        action: {
            label: "Map Guide",
            href: MAPS_URL,
            title: "Open The Westin Kolkata, Rajarhat in Google Maps",
            icon: MapPin,
            bg: "#1e1e1e",
            fg: "#ffffff",
            ring: "rgba(26,115,232,0.38)",
        },
        photo: PHOTO_FRONT,
        photoAlt: "The Westin Kolkata, Rajarhat",
        tilt: -15,
    },
    {
        glow: "radial-gradient(52% 50% at 12% 34%, rgba(251,188,4,0.52) 0%, rgba(251,188,4,0.14) 46%, rgba(251,188,4,0) 74%)",
        title: "Date of the Event",
        lines: ["22nd November,", "2026"],
        action: {
            label: "Mark Your Calendar",
            href: CALENDAR_URL,
            title: "Add DevFest Kolkata 2026 to your Google Calendar",
            icon: CalendarPlus,
            bg: "#1e1e1e",
            fg: "#ffffff",
            ring: "rgba(251,188,4,0.48)",
        },
        photo: PHOTO_BACK,
        photoAlt: "The Westin Kolkata tower by day",
        tilt: -15,
    },
];

// A tilted card is bigger than its own box. For the 4:6 card at `tilt`, these
// are its rotated bounding height and width as multiples of its width — the
// card has to be sized against these, not against its layout box, or it gets
// clipped by the top and bottom of the pinned screen.
const TILT_RAD = (Math.abs(FACES[0].tilt) * Math.PI) / 180;
const CARD_BBOX_H = 1.5 * Math.cos(TILT_RAD) + Math.sin(TILT_RAD);
const CARD_BBOX_W = Math.cos(TILT_RAD) + 1.5 * Math.sin(TILT_RAD);

// The face's call to action. Each face carries its own brand colour, handed to
// the class names as custom properties so the hover shadow and focus ring can
// be written in CSS rather than juggled in state.
const FaceAction = ({ action }) => {
    const Icon = action.icon;
    return (
        <a
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            title={action.title}
            aria-label={action.title}
            className="product_sans group mt-6 inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-[15px] shadow-[0_10px_26px_var(--cta-ring)] transition duration-300 ease-out hover:-translate-y-[3px] hover:shadow-[0_20px_44px_var(--cta-ring)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--cta-ring)] active:translate-y-0 active:shadow-[0_8px_20px_var(--cta-ring)] md:mt-9 md:gap-3 md:px-7 md:py-4 md:text-[17px] xl:mt-11 xl:px-8 xl:py-[18px] xl:text-[18px]"
            style={{
                "--cta-ring": action.ring,
                background: action.bg,
                color: action.fg,
                fontWeight: 600,
                letterSpacing: "-0.01em",
            }}
        >
            <Icon
                className="h-[18px] w-[18px] transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110 md:h-5 md:w-5 xl:h-[22px] xl:w-[22px]"
                strokeWidth={2.2}
                aria-hidden="true"
            />
            {action.label}
            <ArrowUpRight
                className="h-4 w-4 opacity-70 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 md:h-[18px] md:w-[18px]"
                strokeWidth={2.2}
                aria-hidden="true"
            />
        </a>
    );
};

// The copy block for one face. Laid over its sibling in the same grid cell and
// crossfaded, so the column is as tall as the taller face and never reflows
// mid-turn.
const FaceCopy = ({ face, opacity, shift, stacked }) => (
    <div
        className="relative"
        style={{
            gridArea: stacked ? "1 / 1" : undefined,
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

        <FaceAction action={face.action} />
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
    const paneRef = useRef(null);
    const copyRef = useRef(null);
    const [p, setP] = useState(0);
    const [reduced, setReduced] = useState(false);
    const [narrow, setNarrow] = useState(false);
    // Measured, not assumed: the copy wraps differently at every width and
    // `dvh` moves as the browser chrome hides, so the card can only be sized
    // once we know how much room the pinned screen actually has.
    const [box, setBox] = useState({ pane: 0, copy: 0, col: 0 });

    useEffect(() => {
        const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
        const on = () => setReduced(rm.matches);
        on();
        rm.addEventListener?.("change", on);
        return () => rm.removeEventListener?.("change", on);
    }, []);

    // Matches Tailwind's `md` breakpoint: below it the copy sits over the card
    // instead of beside it, and both have to share one screen's height.
    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        const on = () => setNarrow(mq.matches);
        on();
        mq.addEventListener?.("change", on);
        return () => mq.removeEventListener?.("change", on);
    }, []);

    useEffect(() => {
        const measure = () => {
            const pane = paneRef.current;
            const copy = copyRef.current;
            if (!pane || !copy) return;
            setBox((b) =>
                b.pane === pane.clientHeight &&
                b.copy === copy.offsetHeight &&
                b.col === copy.offsetWidth
                    ? b
                    : {
                          pane: pane.clientHeight,
                          copy: copy.offsetHeight,
                          col: copy.offsetWidth,
                      }
            );
        };
        measure();
        const ro = new ResizeObserver(measure);
        [paneRef.current, copyRef.current].forEach((n) => n && ro.observe(n));
        window.addEventListener("resize", measure);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, [reduced]);

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

    // A phone screen has no spare height for a big travel — the same 48px that
    // reads as a gentle arrival on a desktop drives the title into the top edge.
    const compact = narrow && box.pane > 0 && box.pane < COMPACT_H;
    const rise = narrow ? 16 : 48;
    const settle = narrow ? 12 : 32;

    // Hold face one, turn through the middle, hold face two.
    const flip = smoothstep(0.18, 0.82, p);
    // Rise and settle at the ends so the block arrives rather than just sitting.
    const entry = smoothstep(0, 0.16, p);
    const exit = 1 - smoothstep(0.86, 1, p);
    const lift = (1 - entry) * rise - (1 - exit) * settle;

    // On a phone the card takes whatever the copy leaves behind, measured
    // against its rotated bounding box so the corners stay on screen. Null on
    // wider screens and before the first measurement, where the class below
    // caps it instead.
    const cardW =
        narrow && box.pane > 0 && box.copy > 0
            ? Math.round(
                  Math.max(
                      120,
                      Math.min(
                          248,
                          (box.pane -
                              EDGE_GAP * 2 -
                              (compact ? 0 : box.copy + STACK_GAP)) /
                              CARD_BBOX_H,
                          compact ? Infinity : box.col / CARD_BBOX_W
                      )
                  )
              )
            : null;

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

    // One size for the photo frame, shared by both layouts. The card keeps the
    // same portrait ratio at every width. From `md` up the `min()` caps it
    // against viewport height as well as width, so the card can't outgrow the
    // pinned screen on a short display: the second term is the width at which
    // the card's own height reaches that share of the viewport. Below `md` the
    // phone value is only what shows before `cardW` is measured.
    const PHOTO_FRAME =
        "relative aspect-[4/6] w-full max-w-[min(240px,calc(40vh*0.62))] shrink-0 md:max-w-[min(300px,calc(74vh*0.66))] lg:max-w-[min(340px,calc(74vh*0.66))] xl:max-w-[min(380px,calc(74vh*0.66))]";

    // The two copy blocks stacked and crossfaded, so the column never reflows
    // mid-turn.
    const copyColumn = (
        <div ref={copyRef} className="relative grid w-full">
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

    // The brand glow is deliberately wider than its column, so it has to be
    // trimmed at the screen edge or it drags a horizontal scrollbar onto the
    // whole page. `clip`, not `hidden`: `hidden` would make this box the
    // scrollport for the sticky pane below and kill the pin.
    const CLIP = "overflow-x-clip";

    // Reduced motion: no pinning, no 3D — the two pairings simply stack.
    if (reduced) {
        return (
            <section
                id="venue"
                className={`relative w-full select-none ${CLIP}`}
            >
                <div
                    className={`flex w-full flex-col gap-10 py-10 md:gap-14 md:py-16 xl:gap-20 xl:py-20 ${SHELL}`}
                >
                    {FACES.map((face) => (
                        <div
                            key={face.title}
                            className="flex w-full flex-col items-center gap-6 md:flex-row md:gap-6 lg:gap-8 xl:gap-10"
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
            className={`relative w-full select-none ${CLIP}`}
            style={{ height: `${RUNWAY_VH}vh` }}
        >
            <div
                ref={paneRef}
                className="sticky top-0 flex h-screen w-full items-center supports-[height:100dvh]:h-dvh"
            >
                <div
                    className={`flex w-full items-center gap-6 md:flex-row md:gap-6 lg:gap-8 xl:gap-10 ${
                        compact ? "flex-row" : "flex-col"
                    } ${SHELL}`}
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
                            ...(cardW ? { maxWidth: `${cardW}px` } : null),
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
