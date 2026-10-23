"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, useReducedMotion } from "framer-motion";
import teamData from "@/data/team.json";

// The card is drawn against the 336x480 artboard from the design; every offset
// below is that artboard converted to a percentage, so the whole composition
// scales as one piece at any column width. Type scales with it too — the card
// is an inline-size container and the two labels are sized in `cqw`.
const CARD_W = 336;
const CARD_H = 480;
const pctW = (px) => `${(px / CARD_W) * 100}%`;
const pctH = (px) => `${(px / CARD_H) * 100}%`;
// The card's aspect ratio is fixed, so one artboard pixel is the same fraction
// of the width whichever axis it is measured on: `cqw` therefore works for
// vertical lengths too, which `%` cannot do for background/mask geometry.
const cqw = (px) => `${(px / CARD_W) * 100}cqw`;

// Kolkata furniture, exported from the design file.
const DOME = "/team-components/dome.svg"; // arch behind the portrait: shape + fill
const VICTORIA = "/team-components/victoria.svg"; // Victoria Memorial skyline
const BLOB = "/team-components/blob.svg"; // yellow disc under the portrait
const RIBBON = "/team-components/ribbon.svg"; // `{ }` plate the role sits on
const BRIDGE = "/team-components/bridge.svg"; // Howrah bridge, taxi, signal
// The disc again, translated into the portrait's box and carried straight up
// from its two widest points, open along the top: the body is cut to the disc
// while the head rises over the arch. Generated from blob.svg.
const PHOTO_MASK = "/team-components/photo-mask.svg";

// team.json predates this design and spells the roles its own way. The plate
// only has room for the design's labels, so map onto those.
const ROLE_LABELS = {
    ORGANISER: "Organizer",
    "Event ORGANISER": "Event Organizer",
    Graphics: "Graphics Team",
    "PR and Outreach": "PR & Outreach",
    "Videography": "Videography",
};

const roleLabel = (role) => ROLE_LABELS[role] ?? role;

const TeamCard = ({ member }) => (
    <div
        className="relative w-full overflow-hidden rounded-2xl bg-white"
        style={{
            aspectRatio: `${CARD_W} / ${CARD_H}`,
            containerType: "inline-size",
            boxShadow: "0 18px 40px rgba(0,0,0,0.10)",
        }}
    >
        {/* Arch — an ellipse far wider than the card, so only its lower curve
            shows: black at the card's top, dipping to y=196 at the centre and
            rising to the corners. It paints the panel and masks it at once, so
            the skyline inside is cut to the same curve. Without that mask the
            skyline — which the design bottom-aligns with the ellipse's lowest
            point — spills past the curve near the left and right edges and
            reads as two grey wings on the white card. */}
        <div
            className="absolute inset-0"
            style={{
                backgroundColor: "#000000",
                WebkitMaskImage: `url(${DOME})`,
                maskImage: `url(${DOME})`,
                WebkitMaskSize: `${cqw(426)} ${cqw(383)}`,
                maskSize: `${cqw(426)} ${cqw(383)}`,
                WebkitMaskPosition: `${cqw(-44)} ${cqw(-187)}`,
                maskPosition: `${cqw(-44)} ${cqw(-187)}`,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
            }}
        >
            <img
                src={VICTORIA}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="absolute block"
                style={{
                    left: pctW(14.44),
                    top: pctH(66.13),
                    width: pctW(313.43),
                    height: pctH(130),
                }}
            />
        </div>

        {/* Bridge, taxi and traffic signal — one artwork across the card foot. */}
        <img
            src={BRIDGE}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute left-0 block"
            style={{ top: pctH(325), width: "100%", height: pctH(149) }}
        />

        <img
            src={RIBBON}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute block"
            style={{
                left: pctW(65.61),
                top: pctH(375.6),
                width: pctW(204.8),
                height: pctH(45.556),
            }}
        />

        {/* Role — centred on the ribbon's grey plate, not on the card. */}
        <div
            className="absolute flex items-center justify-center overflow-hidden px-[2%]"
            style={{
                left: pctW(77.81),
                top: pctH(378.62),
                width: pctW(180.856),
                height: pctH(31.523),
            }}
        >
            <span
                className="open_sans block truncate text-center leading-none text-black"
                style={{ fontWeight: 700, fontSize: cqw(20) }}
            >
                {roleLabel(member.role)}
            </span>
        </div>

        <div
            className="absolute left-0 flex w-full justify-center px-[4%]"
            style={{ top: pctH(340) }}
        >
            <span
                className="open_sans block truncate text-center leading-none text-black"
                style={{ fontWeight: 700, fontSize: cqw(15) }}
            >
                {member.name}
            </span>
        </div>

        <img
            src={BLOB}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute block"
            style={{
                left: pctW(84),
                top: pctH(168),
                width: pctW(168),
                height: pctH(163),
            }}
        />

        {/* Portrait — the cut-outs in /public/team already have no background,
            so the mask only has to shape the body against the yellow disc. */}
        <div
            className="absolute"
            style={{
                left: pctW(60.14),
                top: pctH(128),
                width: pctW(215.727),
                height: pctH(219.73),
                WebkitMaskImage: `url(${PHOTO_MASK})`,
                maskImage: `url(${PHOTO_MASK})`,
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
            }}
        >
            {/* Every cut-out is framed tight to the top of the head and runs
                off the bottom of the frame, so top-anchoring alone leaves the
                hair flush with the box's edge. Dropping the image by a twentieth
                of the box buys that bit of air without changing its scale —
                width still drives `cover` — and the disc goes on cropping the
                body, which overruns the box either way. */}
            <img
                src={member.image}
                alt={member.name}
                draggable={false}
                loading="lazy"
                className="absolute left-0 block w-full object-cover object-top"
                style={{ top: "5%", height: "95%" }}
            />
        </div>
    </div>
);

const EASE = [0.33, 0, 0.2, 1];

// The page dots take Google's four colours in turn, so paging through the team
// walks the brand palette.
const GOOGLE_COLORS = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"];

const NavButton = ({ dir, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={dir === "prev" ? "Previous team members" : "Next team members"}
        className="flex h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-full
            bg-[#202124] transition-colors hover:bg-[#4285F4] focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-[#4285F4] md:h-12 md:w-12"
    >
        <Image
            src={dir === "prev" ? "/left-arrow.svg" : "/right-arrow.svg"}
            alt=""
            width={34}
            height={22}
            className="h-3.5 w-auto md:h-4"
        />
    </button>
);

// A row of evenly sized cards that pages a screenful at a time: three from
// `lg`, two from `sm`, and on a phone one card with the edge of the next one
// showing, so it reads as swipeable. The card's labels scale with its width,
// which is what keeps the row at three.
const TeamSection = () => {
    const reduced = useReducedMotion();
    const members = teamData.teamMembers;

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: "start", slidesToScroll: "auto" },
        reduced
            ? []
            : [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
    );

    // One dot per page, and how many pages there are depends on how many cards
    // fit, so both are re-read whenever Embla re-inits on a resize.
    const [snaps, setSnaps] = useState([]);
    const [selected, setSelected] = useState(0);

    const sync = useCallback(() => {
        if (!emblaApi) return;
        setSnaps(emblaApi.scrollSnapList());
        setSelected(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        sync();
        emblaApi.on("select", sync);
        emblaApi.on("reInit", sync);
        return () => {
            emblaApi.off("select", sync);
            emblaApi.off("reInit", sync);
        };
    }, [emblaApi, sync]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((i) => emblaApi?.scrollTo(i), [emblaApi]);

    return (
        <section id="team" className="relative w-full select-none">
            <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8 md:px-10 md:py-24 xl:px-16 xl:py-28">
                <h2
                    className="product_sans text-center text-[28px] sm:text-[34px] md:text-[42px] lg:text-[52px] xl:text-[56px]"
                    style={{
                        fontWeight: 700,
                        lineHeight: 1.05,
                        letterSpacing: "-0.01em",
                        color: "#000000",
                    }}
                >
                    The Team
                </h2>

                <motion.div
                    className="mt-10 md:mt-14 xl:mt-16"
                    initial={reduced ? false : { opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, ease: EASE }}
                >
                    {/* The viewport clips the track. A negative margin cancels
                        the slides' gutters at the two outer edges so the row
                        lines up with the heading's column. The cards' drop
                        shadow reaches 58px below them, so the bottom padding
                        holds all of it (the matching negative margin gives the
                        space back to the controls); at the sides only the
                        gutter is free, so the clip fades out across it rather
                        than cutting the shadow off in a hard line. */}
                    <div
                        className="-mx-2.5 -mb-10 overflow-hidden pb-16 pt-6 [--fade:10px] lg:-mx-3 lg:[--fade:12px]"
                        style={{
                            WebkitMaskImage:
                                "linear-gradient(to right, transparent, #000 var(--fade), #000 calc(100% - var(--fade)), transparent)",
                            maskImage:
                                "linear-gradient(to right, transparent, #000 var(--fade), #000 calc(100% - var(--fade)), transparent)",
                        }}
                        ref={emblaRef}
                        aria-roledescription="carousel"
                        aria-label="DevFest Kolkata team"
                    >
                        <div className="flex touch-pan-y">
                            {members.map((member, i) => (
                                <div
                                    key={member.id}
                                    role="group"
                                    aria-roledescription="slide"
                                    aria-label={`${i + 1} of ${members.length}: ${member.name}, ${roleLabel(member.role)}`}
                                    className="min-w-0 flex-[0_0_86%] px-2.5 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] lg:px-3"
                                >
                                    <TeamCard member={member} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-center gap-5 md:mt-6">
                        <NavButton dir="prev" onClick={scrollPrev} />

                        {/* On a phone every card is its own page — far more dots
                            than fit beside the arrows — so phones get a counter
                            instead. */}
                        <div className="hidden items-center gap-2 sm:flex">
                            {snaps.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => scrollTo(i)}
                                    aria-label={`Go to page ${i + 1} of ${snaps.length}`}
                                    aria-current={i === selected ? "true" : undefined}
                                    className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 motion-reduce:transition-none ${
                                        i === selected ? "w-7" : "w-2.5 bg-[#dadce0] hover:bg-[#bdc1c6]"
                                    }`}
                                    style={
                                        i === selected
                                            ? { backgroundColor: GOOGLE_COLORS[i % GOOGLE_COLORS.length] }
                                            : undefined
                                    }
                                />
                            ))}
                        </div>
                        <span
                            className="product_sans min-w-[64px] text-center text-[15px] tabular-nums sm:hidden"
                            style={{ fontWeight: 500, color: "#5f6368" }}
                            aria-live="polite"
                        >
                            {selected + 1} / {snaps.length || members.length}
                        </span>

                        <NavButton dir="next" onClick={scrollNext} />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TeamSection;
