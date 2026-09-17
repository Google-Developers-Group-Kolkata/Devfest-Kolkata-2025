"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
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

const NavButton = ({ dir, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={dir === "prev" ? "Previous team member" : "Next team member"}
        className={`absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer
            items-center justify-center rounded-full bg-black/85 transition-colors
            hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-black md:h-12 md:w-12 ${
                dir === "prev" ? "left-1 md:left-2" : "right-1 md:right-2"
            }`}
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

// Three cards at a time from `lg` up, the middle one at full size; one at a
// time below that, where three would leave the labels too small to read. The
// breakpoint lives in the slides' own classes — the middle card is whichever
// one Embla has snapped to, at either size, so nothing else has to know how
// many are on screen.
const TeamSection = () => {
    const reduced = useReducedMotion();
    const members = teamData.teamMembers;
    const [selected, setSelected] = useState(0);
    // Matches the `lg` breakpoint the slides switch layouts at: three cards
    // from here up, one below.
    const [threeUp, setThreeUp] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 1024px)");
        const on = () => setThreeUp(mq.matches);
        on();
        mq.addEventListener?.("change", on);
        return () => mq.removeEventListener?.("change", on);
    }, []);

    // Where the carousel opens. With three cards on screen the middle one is
    // the one being shown off, so it starts on the second member and the first
    // sits to its left; with one card on screen the middle card is the only
    // card, so it starts on the first.
    const startIndex = Math.min(threeUp ? 1 : 0, Math.max(members.length - 1, 0));

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "center",
        skipSnaps: false,
        dragFree: false,
        // Changing this re-inits Embla, which is how the carousel re-centres
        // when the viewport crosses the breakpoint.
        startIndex,
    });

    const onSelect = useCallback(() => {
        if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

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
                    className="relative mt-10 md:mt-14 xl:mt-16"
                    initial={reduced ? false : { opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, ease: [0.33, 0, 0.2, 1] }}
                >
                    {/* The viewport clips the track horizontally, so it needs a
                        little vertical padding of its own or it would crop the
                        cards' drop shadows. */}
                    <div
                        className="overflow-hidden py-4 md:py-6"
                        ref={emblaRef}
                        aria-roledescription="carousel"
                        aria-label="DevFest Kolkata team"
                    >
                        {/* Cards shrink rather than move, so the track centres
                            them against the full-size middle card. */}
                        <div className="flex items-center">
                            {members.map((member, i) => (
                                <div
                                    key={member.id}
                                    role="group"
                                    aria-roledescription="slide"
                                    aria-label={`${member.name}, ${roleLabel(member.role)}`}
                                    className="min-w-0 flex-[0_0_100%] px-2 lg:flex-[0_0_33.333%] lg:px-3"
                                >
                                    {/* One card to a view would otherwise
                                        stretch to the full container width on a
                                        tablet, so cap it there and let the
                                        three-up row size the cards instead. */}
                                    <div
                                        className={`relative mx-auto w-full max-w-[360px] origin-center transition-transform duration-500 ease-out motion-reduce:transition-none lg:max-w-none ${
                                            i === selected ? "scale-100" : "scale-[0.84]"
                                        }`}
                                    >
                                        <TeamCard member={member} />
                                        {/* The cards either side are veiled
                                            rather than faded: the section's
                                            background illustration shows
                                            straight through a card whose own
                                            opacity is below 1. */}
                                        <div
                                            aria-hidden="true"
                                            className={`pointer-events-none absolute inset-0 rounded-2xl bg-white transition-opacity duration-500 motion-reduce:transition-none ${
                                                i === selected ? "opacity-0" : "opacity-45"
                                            }`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <NavButton dir="prev" onClick={scrollPrev} />
                    <NavButton dir="next" onClick={scrollNext} />
                </motion.div>
            </div>
        </section>
    );
};

export default TeamSection;
