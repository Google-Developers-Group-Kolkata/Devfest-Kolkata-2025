"use client";

import { motion, useReducedMotion } from "framer-motion";

const PREVIOUS_GROUPS = [
    {
        label: "Diamond Sponsor",
        items: [
            {
                name: "Google Developers",
                logo: "/sponsors/google-for-developers.svg",
                href: "https://developers.google.com/",
            },
        ],
    },
    {
        label: "Gold Sponsor",
        items: [
            {
                name: "CAST AI",
                logo: "/sponsors/cast-ai.png",
                href: null,
            },
        ],
    },
    {
        label: "In Association With",
        items: [
            {
                name: "FRIENDS FM",
                logo: "/sponsors/friends-fm.png",
                href: null,
            },
        ],
    },
    {
        label: "Social Media Partner",
        items: [
            {
                name: "ADI Kolkata",
                logo: "/sponsors/adi-kolkata.png",
                href: null,
            },
            {
                name: "OH Kolkata",
                logo: "/sponsors/oh-kolkata.png",
                href: null,
            },
        ],
    },
    {
        label: "Media Partner",
        items: [
            {
                name: "Pratidin.in",
                logo: "/sponsors/pratidin.in.jpg",
                href: null,
            },
            {
                name: "THE WALL",
                logo: "/sponsors/the-wall.png",
                href: null,
            },
            {
                name: "WIKI KOLKATA",
                logo: "/sponsors/wiki-kolkata.png",
                href: null,
            },
        ],
    },
    {
        label: "Hospitality Partner",
        items: [
            {
                name: "Diagnoeasy",
                logo: "/sponsors/diagnoeasy.png",
                href: null,
            },
        ],
    },
    {
        label: "Community Growth Partner",
        items: [
            {
                name: "Indiminds",
                logo: "/sponsors/indiminds.png",
                href: null,
            },
        ],
    },
];

const EASE = [0.33, 0, 0.2, 1];

const SponsorCard = ({ sponsor }) => {
    const Tag = sponsor.href ? "a" : "div";
    return (
        <Tag
            {...(sponsor.href
                ? {
                      href: sponsor.href,
                      target: "_blank",
                      rel: "noopener noreferrer",
                  }
                : {})}
            title={sponsor.name}
            className="google-gradient-border group block w-full max-w-[420px] rounded-[26px] bg-white transition duration-300 ease-out hover:-translate-y-1 sm:w-[380px]"
            style={{
                "--gb-width": "3px",
                padding: "3px",
                boxShadow: "0 12px 34px rgba(0,0,0,0.08)",
            }}
        >
            <div className="flex min-h-[150px] flex-col items-center justify-center gap-4 rounded-[23px] bg-white px-8 py-7 md:min-h-[186px] md:gap-5 md:px-10 md:py-8">
                <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    draggable={false}
                    loading="lazy"
                    className="h-20 w-auto max-w-full object-contain transition-transform duration-300 ease-out group-hover:scale-[1.04] md:h-24 xl:h-28"
                />
                <div
                    className="product_sans text-center text-[13px] md:text-[14px] xl:text-[15px]"
                    style={{
                        fontWeight: 600,
                        lineHeight: 1.3,
                        letterSpacing: "0.01em",
                        color: "#3c4043",
                    }}
                >
                    {sponsor.name}
                </div>
            </div>
        </Tag>
    );
};

const PreviousSponsorsSection = () => {
    const reduced = useReducedMotion();

    return (
        <section id="past-sponsors" className="relative w-full select-none">
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
                    Previous{" "}
                    <span style={{ color: "#4285F4" }}>
                        Sponsors &amp; Partners
                    </span>
                </h2>

                <p
                    className="product_sans mx-auto mt-4 max-w-[680px] text-center text-[15px] md:mt-6 md:text-[17px] xl:text-[18px]"
                    style={{
                        fontWeight: 400,
                        lineHeight: 1.5,
                        color: "#5f6368",
                    }}
                >
                    The sponsors, media houses and community platforms that
                    backed earlier DevFest Kolkata editions.
                </p>

                {PREVIOUS_GROUPS.map((group, gi) => (
                    <motion.div
                        key={group.label}
                        className="mt-12 md:mt-16 xl:mt-20"
                        initial={reduced ? false : { opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{
                            duration: 0.5,
                            ease: EASE,
                            delay: gi * 0.06,
                        }}
                    >
                        <div
                            className="product_sans text-center text-[12px] uppercase md:text-[13px] xl:text-[14px]"
                            style={{
                                fontWeight: 600,
                                letterSpacing: "0.18em",
                                color: "#80868b",
                            }}
                        >
                            {group.label}
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 md:mt-8 md:gap-8">
                            {group.items.map((sponsor, i) => (
                                <motion.div
                                    key={sponsor.name}
                                    className="flex w-full justify-center sm:w-auto"
                                    initial={
                                        reduced ? false : { opacity: 0, y: 18 }
                                    }
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{
                                        duration: 0.45,
                                        ease: EASE,
                                        delay: i * 0.08,
                                    }}
                                >
                                    <SponsorCard sponsor={sponsor} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default PreviousSponsorsSection;
