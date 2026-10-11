"use client";

import { motion, useReducedMotion } from "framer-motion";

// One artwork carries the whole wall of logos — the card, its gradient border
// and every mark on it — so the section ships a single asset instead of a dozen
// independent images that each had to be sized and aligned by hand.
const SPONSORS_IMAGE = "/sponsors/previous-sponsors-partners.webp";

// Intrinsic pixel size of that artwork, so the browser can reserve the right
// box and hold the aspect ratio at every width.
const IMAGE_W = 3200;
const IMAGE_H = 1681;

const EASE = [0.33, 0, 0.2, 1];

const PreviousSponsorsSection = () => {
    const reduced = useReducedMotion();

    return (
        <section id="past-sponsors" className="relative w-full select-none">
            {/* Heading and intro keep the page's standard column width. */}
            <div className="mx-auto w-full max-w-[1120px] px-5 pt-16 sm:px-8 md:px-10 md:pt-24 xl:px-16 xl:pt-28">
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
            </div>

            {/* The wall is given the room it needs: it spans nearly the whole
                width of whatever screen it lands on, so the marks stay large
                and readable instead of bunching up in the middle. */}
            <motion.div
                className="mx-auto w-full max-w-[1600px] px-4 pt-12 pb-16 sm:px-6 md:px-8 md:pt-16 md:pb-24 xl:px-12 xl:pb-28"
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: EASE }}
            >
                <img
                    src={SPONSORS_IMAGE}
                    alt="Logos of the sponsors and partners who backed earlier DevFest Kolkata editions"
                    width={IMAGE_W}
                    height={IMAGE_H}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                />
            </motion.div>
        </section>
    );
};

export default PreviousSponsorsSection;
