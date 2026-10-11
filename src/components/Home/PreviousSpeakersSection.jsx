"use client";

import { motion, useReducedMotion } from "framer-motion";

// The speakers and guests who stood on DevFest Kolkata stages before this
// edition. Each name is taken straight from the supplied artwork's filename.
const SPEAKERS = [
    { name: "Amey Nerkar", src: "/previous-speakers/amey-nerkar.webp" },
    { name: "Angshuman Bhattacharya", src: "/previous-speakers/angshuman-bhattacharya.webp" },
    { name: "Ashok Vishwakarma", src: "/previous-speakers/ashok-vishwakarma.webp" },
    { name: "Ayushi Gupta", src: "/previous-speakers/ayushi-gupta.webp" },
    { name: "Daniel Nath", src: "/previous-speakers/daniel-nath.webp" },
    { name: "Geeta Kakrani", src: "/previous-speakers/geeta-kakrani.webp" },
    { name: "Imran Roshan", src: "/previous-speakers/imran-roshan.webp" },
    { name: "Indranil Chandra", src: "/previous-speakers/indranil-chandra.webp" },
    { name: "Kunal Das", src: "/previous-speakers/kunal-das.webp" },
    { name: "Namrata More", src: "/previous-speakers/namrata-more.webp" },
    { name: "Nikhilesh Tayal", src: "/previous-speakers/nikhilesh-tayal.webp" },
    { name: "Pawan Kumar", src: "/previous-speakers/pawan-kumar.webp" },
    { name: "Raj Vikramaditya", src: "/previous-speakers/raj-vikramaditya.webp" },
    { name: "Rajat Kumar Gupta", src: "/previous-speakers/rajat-kumar-gupta.webp" },
    { name: "Rivu Chakraborty", src: "/previous-speakers/rivu-chakraborty.webp" },
    { name: "Shruti Mantri", src: "/previous-speakers/shruti-mantri.webp" },
    { name: "Shuva Jyoti Kar", src: "/previous-speakers/shuva-jyoti-kar.webp" },
    { name: "Srushti Raybhoge", src: "/previous-speakers/srushti-raybhoge.webp" },
    { name: "Vivek Yadav", src: "/previous-speakers/vivek-yadav.webp" },
];

// Same marquee technique the Media Coverage section uses: the track holds
// several identical copies and slides exactly one copy's width, so the seam is
// always off-screen and the loop never runs dry.
const MARQUEE_COPIES = 3;

const EASE = [0.33, 0, 0.2, 1];

const SpeakerCard = ({ speaker }) => (
    <div
        className="google-gradient-border w-[184px] shrink-0 rounded-[24px] bg-white sm:w-[204px] md:w-[228px]"
        style={{
            "--gb-width": "3px",
            padding: "3px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.10)",
        }}
    >
        <div className="overflow-hidden rounded-[21px] bg-white">
            <img
                src={speaker.src}
                alt={speaker.name}
                draggable={false}
                loading="lazy"
                className="aspect-square w-full object-cover"
            />
        </div>
        <div className="product_sans px-3 py-3.5 text-center md:py-4">
            <div
                className="text-[14px] md:text-[15px]"
                style={{ fontWeight: 600, lineHeight: 1.25, color: "#202124" }}
            >
                {speaker.name}
            </div>
        </div>
    </div>
);

const PreviousSpeakersSection = () => {
    const reduced = useReducedMotion();

    return (
        <section
            id="previous-speakers"
            className="relative w-full select-none"
        >
            <div className="mx-auto w-full max-w-[1120px] px-5 pt-16 sm:px-8 md:px-10 md:pt-24 xl:px-16 xl:pt-28">
                <motion.h2
                    initial={reduced ? false : { opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="product_sans text-center text-[28px] sm:text-[34px] md:text-[42px] lg:text-[52px] xl:text-[56px]"
                    style={{
                        fontWeight: 700,
                        lineHeight: 1.05,
                        letterSpacing: "-0.01em",
                        color: "#000000",
                    }}
                >
                    Previous{" "}
                    <span style={{ color: "#34A853" }}>
                        Speakers &amp; Guests
                    </span>
                </motion.h2>

                <motion.p
                    initial={reduced ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.08 }}
                    className="product_sans mx-auto mt-4 max-w-[680px] text-center text-[15px] md:mt-6 md:text-[17px] xl:text-[18px]"
                    style={{
                        fontWeight: 400,
                        lineHeight: 1.5,
                        color: "#5f6368",
                    }}
                >
                    The speakers and guests who took the stage at earlier DevFest
                    Kolkata editions.
                </motion.p>
            </div>

            {/* The track is inset from the screen edge (same gutter as the Media
                Coverage marquee) and fades out at both ends, then glides right
                to left. */}
            <div className="relative w-full px-5 pb-16 sm:px-8 md:px-10 md:pb-24 xl:px-16 xl:pb-28">
                <div
                    className="marquee-wrap relative overflow-hidden py-6 motion-reduce:overflow-x-auto"
                    style={{
                        WebkitMaskImage:
                            "linear-gradient(to right, transparent, #000 3%, #000 97%, transparent)",
                        maskImage:
                            "linear-gradient(to right, transparent, #000 3%, #000 97%, transparent)",
                    }}
                >
                    <div
                        className="marquee-track items-stretch"
                        style={{
                            "--marquee-duration": "110s",
                            "--marquee-shift": `-${100 / MARQUEE_COPIES}%`,
                        }}
                    >
                        {Array.from({ length: MARQUEE_COPIES }).map(
                            (_, copy) => (
                                <div
                                    key={copy}
                                    className="flex shrink-0 items-stretch gap-5 pr-5 md:gap-6 md:pr-6"
                                    aria-hidden={copy > 0 ? true : undefined}
                                    inert={copy > 0 ? true : undefined}
                                >
                                    {SPEAKERS.map((speaker) => (
                                        <SpeakerCard
                                            key={speaker.name}
                                            speaker={speaker}
                                        />
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PreviousSpeakersSection;
