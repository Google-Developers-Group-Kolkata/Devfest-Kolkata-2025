"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
    ArrowUpRight,
    CalendarDays,
    CalendarPlus,
    MapPin,
} from "lucide-react";

// The section is pinned for this much scroll; the photo flip plays out across it.
const RUNWAY_VH = 260;

const clamp01 = (n) => Math.min(1, Math.max(0, n));
const lerp = (a, b, t) => a + (b - a) * t;

// Ease so each face is held for a beat and the turn happens through the middle.
const smoothstep = (edge0, edge1, x) => {
    const t = clamp01((x - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
};

// Google Calendar's own event-composer link: it opens a prefilled event the
// user only has to save, on whichever account they are signed in with. Times
// are local wall-clock hours — `ctz` tells Google which zone to read them in.
const calendarUrl = ({ title, dates, details, location }) =>
    `https://calendar.google.com/calendar/render?${new URLSearchParams({
        action: "TEMPLATE",
        text: title,
        dates,
        details,
        location,
        ctz: "Asia/Kolkata",
    }).toString()}`;

// Google Maps' route planner, pointed at the venue from wherever the visitor is.
const directionsUrl = (destination) =>
    `https://www.google.com/maps/dir/?${new URLSearchParams({
        api: "1",
        destination,
    }).toString()}`;

// The two stops of the festival, in the order the scroll reveals them. Each
// face carries everything it shows: where, when, how to get there, and the
// photo with the shape it is shown at.
const FACES = [
    {
        step: "Pre-DevFest",
        event: "Pre-DevFest Kolkata 2026",
        name: "Sister Nivedita University",
        area: "New Town, Kolkata",
        date: "21st November, 2026",
        accent: "#4285F4",
        ring: "rgba(66,133,244,0.38)",
        glow: "radial-gradient(closest-side, rgba(66,133,244,0.40) 0%, rgba(66,133,244,0.10) 44%, rgba(66,133,244,0) 72%)",
        photo: "/snu.webp",
        photoAlt: "Sister Nivedita University campus, New Town",
        // snu.webp is 1920×960, so this face is a landscape card (height / width).
        ratio: 0.5,
        // Which card-width custom property (see CARD_VARS) sizes this face.
        sizeVar: "--lw",
        phoneMaxW: 340,
        tilt: -8,
        directions: directionsUrl(
            "Sister Nivedita University, New Town, Kolkata"
        ),
        calendar: calendarUrl({
            title: "Pre-DevFest Kolkata 2026",
            // No start time is fixed yet, so it goes in as an all-day event
            // (the end date is exclusive).
            dates: "20261121/20261122",
            details:
                "Pre-DevFest Kolkata 2026 by GDG Kolkata at Sister Nivedita University, New Town — the curtain-raiser to DevFest Kolkata 2026 on 22nd November.",
            location:
                "Sister Nivedita University, New Town, Kolkata, West Bengal",
        }),
    },
    {
        step: "DevFest",
        event: "DevFest Kolkata 2026",
        name: "The Westin Kolkata",
        area: "Rajarhat, New Town",
        date: "22nd November, 2026",
        accent: "#F9AB00",
        ring: "rgba(251,188,4,0.48)",
        glow: "radial-gradient(closest-side, rgba(251,188,4,0.52) 0%, rgba(251,188,4,0.14) 46%, rgba(251,188,4,0) 74%)",
        photo: "/venue.jpg",
        photoAlt: "The Westin Kolkata, Rajarhat",
        // Portrait 4:6 card.
        ratio: 1.5,
        sizeVar: "--pw",
        phoneMaxW: 248,
        tilt: -15,
        directions: directionsUrl("The Westin Kolkata Rajarhat"),
        calendar: calendarUrl({
            title: "DevFest Kolkata 2026",
            // Doors open to the last session.
            dates: "20261122T083000/20261122T170000",
            details:
                "DevFest Kolkata 2026 by GDG Kolkata — a full day of talks, workshops and community at The Westin Kolkata, Rajarhat.",
            location:
                "The Westin Kolkata Rajarhat, New Town, Kolkata, West Bengal",
        }),
    },
];

// Card widths, per breakpoint, for each shape: `--lw` the landscape card,
// `--pw` the portrait one. Set once on the section so the pinned stage, the
// morphing card and the reduced-motion layout all read the same numbers. The
// portrait `min()` also caps it against viewport height, so it can't outgrow
// the pinned screen on a short display. Below `md` these only show until the
// phone layout has been measured.
const CARD_VARS =
    "[--lw:min(340px,100%)] [--pw:min(240px,calc(40vh*0.62))] md:[--lw:320px] md:[--pw:min(300px,calc(74vh*0.66))] lg:[--lw:400px] lg:[--pw:min(340px,calc(74vh*0.66))] xl:[--lw:440px] xl:[--pw:min(380px,calc(74vh*0.66))]";

// A tilted card is bigger than its own box. For each face, its rotated
// bounding height and width as multiples of its width — the card has to be
// sized against these, not its layout box, or it gets clipped by the pinned
// screen.
const BBOX = FACES.map(({ ratio, tilt }) => {
    const t = (Math.abs(tilt) * Math.PI) / 180;
    return {
        h: ratio * Math.cos(t) + Math.sin(t),
        w: Math.cos(t) + ratio * Math.sin(t),
    };
});

// Phone layout budget, all inside one pinned screen.
const EDGE_GAP = 48; // kept clear above the copy and below the card, at rest
const STACK_GAP = 24; // between the copy and the card (matches `gap-6`)
const MIN_CARD_W = 120;
// Below this pinned height there is no room to stack copy over card — that is
// a phone on its side, so it falls back to the side-by-side layout.
const COMPACT_H = 540;
// Side-by-side on a phone on its side: the widest the tilted card may get.
const COMPACT_STAGE_W = 280;

// Where a face's brand glow sits, as an inset on the copy column (top right
// bottom left). The glow is an ellipse that exactly fills this box
// (`closest-side`), centred just left of the column's start and a fifth of the
// way down, so it has faded out before it reaches any edge of its own box —
// the only thing that ever trims it is the edge of the screen.
const GLOW_INSET = "-69% 29% -11% -85%";

// Scroll progress at which each face is fully shown and holding still.
const HOLD = [0.17, 0.84];

// One call to action. Each face hands over its brand colour as a custom
// property so the hover shadow and focus ring can be written in CSS. The
// short label is for narrow columns, where both buttons share one row.
const FaceAction = ({ action, ring }) => {
    const Icon = action.icon;
    return (
        <a
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            title={action.title}
            aria-label={action.title}
            className="product_sans group inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[14px] shadow-[0_10px_26px_var(--cta-ring)] transition duration-300 ease-out hover:-translate-y-[3px] hover:shadow-[0_20px_44px_var(--cta-ring)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--cta-ring)] active:translate-y-0 active:shadow-[0_8px_20px_var(--cta-ring)] md:px-5 md:py-3 md:text-[15px] lg:gap-2.5 lg:px-6 lg:py-3.5 lg:text-[16px]"
            style={{
                "--cta-ring": ring,
                background: action.primary ? "#1e1e1e" : "#ffffff",
                color: action.primary ? "#ffffff" : "#1e1e1e",
                border: "1.5px solid #1e1e1e",
                fontWeight: 600,
                letterSpacing: "-0.01em",
            }}
        >
            <Icon
                className="h-[17px] w-[17px] shrink-0 transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110 lg:h-5 lg:w-5"
                strokeWidth={2.2}
                aria-hidden="true"
            />
            <span className="lg:hidden">{action.short}</span>
            <span className="hidden lg:inline">{action.label}</span>
            <ArrowUpRight
                className="hidden h-[18px] w-[18px] shrink-0 opacity-70 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 lg:block"
                strokeWidth={2.2}
                aria-hidden="true"
            />
        </a>
    );
};

const actionsFor = (face) => [
    {
        label: "Get Directions",
        short: "Directions",
        href: face.directions,
        title: `Get directions to ${face.name} in Google Maps`,
        icon: MapPin,
        primary: true,
    },
    {
        label: "Mark Your Calendar",
        short: "Add to Calendar",
        href: face.calendar,
        title: `Add ${face.event} to your Google Calendar`,
        icon: CalendarPlus,
    },
];

// Brand dot plus the stop's name — "Pre-DevFest" / "DevFest".
const StepLabel = ({ face }) => (
    <span className="inline-flex items-center gap-2">
        <span
            aria-hidden="true"
            className="h-2 w-2 shrink-0 rounded-full md:h-2.5 md:w-2.5"
            style={{ background: face.accent }}
        />
        {face.step}
    </span>
);

const STEP_TEXT =
    "product_sans relative flex items-center gap-2.5 text-[13px] md:gap-3 md:text-[15px]";
const STEP_STYLE = {
    fontWeight: 600,
    letterSpacing: "0.01em",
    color: "#1e1e1e",
};

// Pinned layout only: both stops on one line with a track that fills as the
// scroll carries the visitor from the first to the second, so it is clear
// from the start that there is a second venue further down.
const StepTrack = ({ flip, swap }) => (
    <div className={`${STEP_TEXT} mb-4 md:mb-6`} style={STEP_STYLE}>
        {FACES.map((face, i) => (
            <Fragment key={face.step}>
                {i > 0 && (
                    <span
                        aria-hidden="true"
                        className="relative h-[3px] w-8 overflow-hidden rounded-full bg-black/10 md:w-14"
                    >
                        <span
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{
                                width: `${flip * 100}%`,
                                background: `linear-gradient(90deg, ${FACES[0].accent}, ${FACES[1].accent})`,
                            }}
                        />
                    </span>
                )}
                <span
                    style={{
                        opacity: i === 0 ? 1 - 0.55 * swap : 0.45 + 0.55 * swap,
                    }}
                >
                    <StepLabel face={face} />
                </span>
            </Fragment>
        ))}
    </div>
);

// The copy block for one face: where, when and the two actions. In the pinned
// layout the two faces are laid over each other in one grid cell and
// crossfaded, so the column is as tall as the taller face and never reflows
// mid-turn.
const FaceCopy = ({
    face,
    opacity = 1,
    shift = 0,
    stacked = false,
    showStep = false,
    onFocus,
}) => (
    <div
        className="relative"
        onFocus={onFocus}
        style={{
            gridArea: stacked ? "1 / 1" : undefined,
            opacity,
            transform: `translateY(${shift}px)`,
            pointerEvents: opacity > 0.5 ? "auto" : "none",
            willChange: stacked ? "opacity, transform" : undefined,
        }}
    >
        {showStep && (
            <div className={`${STEP_TEXT} mb-3 md:mb-5`} style={STEP_STYLE}>
                <StepLabel face={face} />
            </div>
        )}

        <h2
            className="product_sans text-[26px] sm:text-[32px] md:text-[36px] lg:text-[44px] xl:text-[50px]"
            style={{
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                color: "#000000",
            }}
        >
            {face.name}
        </h2>

        <p
            className="product_sans mt-1.5 text-[18px] sm:text-[20px] md:mt-2 md:text-[22px] lg:text-[26px] xl:text-[28px]"
            style={{ fontWeight: 500, lineHeight: 1.25, color: "#000000" }}
        >
            {face.area}
        </p>

        <p
            className="product_sans mt-2.5 flex items-center gap-2 text-[15px] md:mt-4 md:gap-2.5 md:text-[17px] lg:text-[19px]"
            style={{ fontWeight: 500, lineHeight: 1.3, color: "#1e1e1e" }}
        >
            <CalendarDays
                className="h-[18px] w-[18px] shrink-0 md:h-5 md:w-5"
                strokeWidth={2.2}
                style={{ color: face.accent }}
                aria-hidden="true"
            />
            {face.date}
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5 md:mt-6 md:gap-3 xl:mt-7">
            {actionsFor(face).map((action) => (
                <FaceAction key={action.label} action={action} ring={face.ring} />
            ))}
        </div>
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

// `calc()` blend of the two faces' CSS card widths, `k` scaling each one
// (1 for the width itself, the face's ratio for its height).
const blendVars = (m, kA = 1, kB = 1) =>
    `calc(var(${FACES[0].sizeVar}) * ${((1 - m) * kA).toFixed(4)} + var(${FACES[1].sizeVar}) * ${(m * kB).toFixed(4)})`;

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

    // Tabbing into the face that is faded out (its links) scrolls
    // the runway to that face, so keyboard focus never lands on something
    // invisible. A frame later, because the browser's own scroll-into-view
    // for the newly focused element runs after this handler and would undo it.
    const revealFace = useCallback((i) => {
        requestAnimationFrame(() => {
            const sec = sectionRef.current;
            if (!sec) return;
            const travel = sec.offsetHeight - window.innerHeight;
            if (travel <= 0) return;
            const top = sec.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: top + travel * HOLD[i],
                behavior: "instant",
            });
        });
    }, []);

    // A phone on its side: copy beside the card instead of over it.
    const compact = narrow && box.pane > 0 && box.pane < COMPACT_H;
    // A phone screen has no spare height for a big travel — the same 48px that
    // reads as a gentle arrival on a desktop drives the title into the top edge.
    const rise = narrow ? 16 : 48;
    const settle = narrow ? 12 : 32;

    // Hold face one, turn through the middle, hold face two.
    const flip = smoothstep(0.18, 0.82, p);
    // Rise and settle at the ends so the block arrives rather than just sitting.
    const entry = smoothstep(0, 0.16, p);
    const exit = 1 - smoothstep(0.86, 1, p);
    const lift = (1 - entry) * rise - (1 - exit) * settle;

    // Copy swaps at the halfway point of the photo's turn, so text and image
    // change over together.
    const swap = smoothstep(0.38, 0.62, flip);
    // The card changes shape — landscape to portrait — while it is turned
    // most nearly edge-on, so the morph reads as part of the flip.
    const morph = smoothstep(0.2, 0.8, flip);
    // Slight tilt that eases from one face's angle to the other's. It lives on
    // the card's frame, so frame and photo carry the exact same angle.
    const tilt = lerp(FACES[0].tilt, FACES[1].tilt, flip);
    const current = swap < 0.5 ? 0 : 1;

    // On a phone the card takes whatever the copy leaves behind, measured
    // against each face's rotated bounding box so the corners stay on screen.
    // The stage around it is reserved at the larger of the two, so the copy
    // above doesn't move as the card changes shape. Null on wider screens and
    // before the first measurement, where CARD_VARS sizes it instead.
    const phone =
        narrow && box.pane > 0 && box.copy > 0
            ? (() => {
                  const availH =
                      box.pane -
                      EDGE_GAP * 2 -
                      (compact ? 0 : box.copy + STACK_GAP);
                  const availW = compact ? COMPACT_STAGE_W : box.col;
                  const cards = FACES.map((face, i) => {
                      const w = Math.round(
                          Math.max(
                              MIN_CARD_W,
                              Math.min(
                                  face.phoneMaxW,
                                  availH / BBOX[i].h,
                                  availW / BBOX[i].w
                              )
                          )
                      );
                      return { w, h: w * face.ratio };
                  });
                  return {
                      cards,
                      stageW: compact
                          ? Math.max(...cards.map((c, i) => c.w * BBOX[i].w))
                          : box.col,
                      stageH: Math.max(...cards.map((c, i) => c.w * BBOX[i].h)),
                  };
              })()
            : null;

    const stageStyle = phone
        ? { width: `${phone.stageW}px`, height: `${phone.stageH}px` }
        : {
              width: `max(var(${FACES[0].sizeVar}), var(${FACES[1].sizeVar}))`,
              height: `max(${FACES.map((f) => `calc(var(${f.sizeVar}) * ${f.ratio})`).join(", ")})`,
          };

    const cardStyle = phone
        ? {
              width: `${lerp(phone.cards[0].w, phone.cards[1].w, morph)}px`,
              height: `${lerp(phone.cards[0].h, phone.cards[1].h, morph)}px`,
          }
        : {
              width: blendVars(morph),
              height: blendVars(morph, FACES[0].ratio, FACES[1].ratio),
          };

    // Content shell, shared by both layouts — same width cap and side gutter as
    // the About/Tickets sections above, so every section lines up.
    const SHELL =
        "mx-auto w-full max-w-[1120px] px-5 sm:px-8 md:px-10 xl:px-16";

    // The brand glow is deliberately wider than its column, so it has to be
    // trimmed at the screen edge or it drags a horizontal scrollbar onto the
    // whole page. `clip`, not `hidden`: `hidden` would make this box the
    // scrollport for the sticky pane below and kill the pin.
    const CLIP = "overflow-x-clip";

    // Reduced motion: no pinning, no 3D — the two venues simply stack.
    if (reduced) {
        return (
            <section
                id="venue"
                className={`relative w-full select-none ${CLIP} ${CARD_VARS}`}
            >
                <div
                    className={`flex w-full flex-col gap-14 py-10 md:gap-16 md:py-16 xl:gap-20 xl:py-20 ${SHELL}`}
                >
                    {FACES.map((face) => (
                        <div
                            key={face.step}
                            className="flex w-full flex-col items-center gap-8 md:flex-row md:gap-8 lg:gap-10 xl:gap-12"
                        >
                            <div className="relative w-full">
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute"
                                    style={{ inset: GLOW_INSET, background: face.glow }}
                                />
                                <FaceCopy face={face} showStep />
                            </div>
                            <div
                                className="relative shrink-0"
                                style={{
                                    width: `var(${face.sizeVar})`,
                                    aspectRatio: `1 / ${face.ratio}`,
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
            className={`relative w-full select-none ${CLIP} ${CARD_VARS}`}
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
                    <div ref={copyRef} className="relative w-full">
                        {/* Brand glow, crossfaded with the copy. Sits behind
                            the text and bleeds past the column. */}
                        {FACES.map((face, i) => (
                            <div
                                key={face.step}
                                aria-hidden="true"
                                className="pointer-events-none absolute"
                                style={{
                                    inset: GLOW_INSET,
                                    background: face.glow,
                                    opacity: i === 0 ? 1 - swap : swap,
                                }}
                            />
                        ))}

                        <StepTrack flip={flip} swap={swap} />

                        <div className="relative grid w-full">
                            {FACES.map((face, i) => (
                                <FaceCopy
                                    key={face.step}
                                    face={face}
                                    opacity={i === 0 ? 1 - swap : swap}
                                    shift={i === 0 ? swap * -30 : (1 - swap) * 30}
                                    stacked
                                    onFocus={
                                        i === current
                                            ? undefined
                                            : () => revealFace(i)
                                    }
                                />
                            ))}
                        </div>
                    </div>

                    {/* The stage holds a fixed slot, sized for the larger of
                        the two cards, so the copy never reflows while the card
                        inside it turns and changes shape. */}
                    <div
                        className="flex shrink-0 items-center justify-center"
                        style={stageStyle}
                    >
                        {/* Only this card turns. The tilt sits on the frame,
                            so the frame is angled with the photo rather than
                            the photo leaning inside an upright box. */}
                        <div
                            className="relative shrink-0"
                            style={{
                                ...cardStyle,
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
            </div>
        </section>
    );
};

export default VenueSection;
