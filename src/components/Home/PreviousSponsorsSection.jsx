"use client";

import { motion, useReducedMotion } from "framer-motion";

const LOGOS = [
    { name: "Google Developers", logo: "/sponsors/google-for-developers.svg", href: null },
    { name: "CAST AI", logo: "/sponsors/cast-ai.png", href: null },
    { name: "FRIENDS FM", logo: "/sponsors/friends-fm.png", href: null },
    { name: "ADI Kolkata", logo: "/sponsors/adi-kolkata.png", href: null },
    { name: "OH Kolkata", logo: "/sponsors/oh-kolkata.png", href: null },
    { name: "Pratidin.in", logo: "/sponsors/pratidin.in.jpg", href: null },
    { name: "THE WALL", logo: "/sponsors/the-wall.png", href: null },
    { name: "WIKI KOLKATA", logo: "/sponsors/wiki-kolkata.png", href: null },
    { name: "Diagnoeasy", logo: "/sponsors/diagnoeasy.png", href: null },
    { name: "Indiminds", logo: "/sponsors/indiminds.png", href: null },
];

// Small, stable per-note tilt for the sticky-note collage feel.
const TILTS = [-2, 2, -3, 1, -1, 3, -2, 2, 0, -3];

const EASE = [0.33, 0, 0.2, 1];

const LogoNote = ({ logo, tilt }) => {
    const Tag = logo.href ? "a" : "div";
    return (
        <Tag
            {...(logo.href
                ? {
                      href: logo.href,
                      target: "_blank",
                      rel: "noopener noreferrer",
                  }
                : {})}
            title={logo.name}
            className="group block w-full max-w-[150px] sm:max-w-[170px]"
        >
            <div
                className="flex h-full items-center justify-center rounded-2xl bg-white px-5 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.10)] transition-all duration-300 ease-out hover:rotate-0 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.16)]"
                style={{ transform: `rotate(${tilt}deg)` }}
            >
                <img
                    src={logo.logo}
                    alt={logo.name}
                    draggable={false}
                    loading="lazy"
                    className="h-auto w-[120px] max-w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:w-[140px] md:w-[160px]"
                />
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

                <div className="mt-12 grid w-full grid-cols-2 justify-items-center gap-x-6 gap-y-9 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-10 md:mt-16 md:grid-cols-4 md:gap-x-10 md:gap-y-12 lg:grid-cols-5">
                    {LOGOS.map((logo, i) => (
                        <motion.div
                            key={logo.name}
                            className="flex justify-center"
                            initial={reduced ? false : { opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{
                                duration: 0.45,
                                ease: EASE,
                                delay: (i % 5) * 0.06,
                            }}
                        >
                            <LogoNote logo={logo} tilt={TILTS[i % TILTS.length]} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PreviousSponsorsSection;
