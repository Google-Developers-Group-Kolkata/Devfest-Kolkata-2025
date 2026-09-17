"use client";

import { motion, useReducedMotion } from "framer-motion";

// Partners, grouped by the line they are credited under. Add a logo to an
// existing group's `items`, or add a whole group — the section lays out
// however many of each there are.
const PARTNER_GROUPS = [
    {
        label: "Powered by",
        items: [
            {
                name: "Google for Developers",
                logo: "/sponsors/google-for-developers.svg",
                href: "https://developers.google.com/",
            },
        ],
    },
];

const EASE = [0.33, 0, 0.2, 1];

// One logo on a white card inside the animated Google ring the FAQ cards use,
// so the section belongs to the same page without inventing a new frame.
const PartnerCard = ({ partner }) => {
    const Tag = partner.href ? "a" : "div";
    return (
        <Tag
            {...(partner.href
                ? {
                      href: partner.href,
                      target: "_blank",
                      rel: "noopener noreferrer",
                  }
                : {})}
            title={partner.name}
            className="google-gradient-border group block w-full max-w-[420px] rounded-[26px] bg-white transition duration-300 ease-out hover:-translate-y-1 sm:w-[380px]"
            style={{
                "--gb-width": "3px",
                padding: "3px",
                boxShadow: "0 12px 34px rgba(0,0,0,0.08)",
            }}
        >
            <div className="flex min-h-[112px] items-center justify-center rounded-[23px] bg-white px-8 py-7 md:min-h-[132px] md:px-10 md:py-8">
                <img
                    src={partner.logo}
                    alt={partner.name}
                    draggable={false}
                    loading="lazy"
                    className="h-8 w-auto max-w-full transition-transform duration-300 ease-out group-hover:scale-[1.04] md:h-10 xl:h-11"
                />
            </div>
        </Tag>
    );
};

const PartnersSection = () => {
    const reduced = useReducedMotion();

    return (
        <section id="partners" className="relative w-full select-none">
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
                    Our <span style={{ color: "#4285F4" }}>Partners</span>
                </h2>

                <p
                    className="product_sans mx-auto mt-4 max-w-[640px] text-center text-[15px] md:mt-6 md:text-[17px] xl:text-[18px]"
                    style={{ fontWeight: 400, lineHeight: 1.5, color: "#5f6368" }}
                >
                    DevFest Kolkata 2026 runs on the support of the platforms and
                    partners standing behind our community.
                </p>

                {PARTNER_GROUPS.map((group, gi) => (
                    <motion.div
                        key={group.label}
                        className="mt-12 md:mt-16 xl:mt-20"
                        initial={reduced ? false : { opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{
                            duration: 0.5,
                            ease: EASE,
                            delay: gi * 0.08,
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
                            {group.items.map((partner, i) => (
                                <motion.div
                                    key={partner.name}
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
                                    <PartnerCard partner={partner} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default PartnersSection;
