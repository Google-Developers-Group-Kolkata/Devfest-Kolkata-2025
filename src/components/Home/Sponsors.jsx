"use client";

import React from "react";
import { motion } from "framer-motion";

const sponsorTiers = {
    diamond: [
        { name: "Google Developers", logo: "/sponsors/google-for-developers.svg" },
    ],
    gold: [
        { name: "CAST AI", logo: "/sponsors/cast-ai.png" },
    ],
    association: [
        { name: "FRIENDS FM", logo: "/sponsors/friends-fm.png" },
    ],
    socialMedia: [
        { name: "ADI Kolkata", logo: "/sponsors/adi-kolkata.png" },
        { name: "OH Kolkata", logo: "/sponsors/oh-kolkata.png" },
        { name: "Kolkatar Somikaronn", logo: "/sponsors/kolkatar-somikaronn.png" },
    ],
    media: [
        { name: "Pratidin.in", logo: "/sponsors/pratidin.in.jpg" },
        { name: "THE WALL", logo: "/sponsors/the-wall.png" },
        { name: "WIKI KOLKATA", logo: "/sponsors/wiki-kolkata.png" },
    ],
    hospitality: [
        { name: "Diagnoeasy", logo: "/sponsors/diagnoeasy.png" },
    ],
    communityGrowth: [
        { name: "Indiminds", logo: "/sponsors/indiminds.png" },
    ],
    newsChannel: [
        { name: "KOLKATA TV", logo: "/sponsors/kolkata-tv.png" },
    ],
};

export default function Sponsors() {
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.2,
            },
        },
    };

    const tierVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                staggerChildren: 0.1,
            },
        },
    };

    const logoVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4, ease: "easeOut" },
        },
    };

    const SponsorTier = ({ title, sponsors, divider="w-[75%]" }) => (
        <motion.div
            className="mb-12 flex flex-col items-center"
            variants={tierVariants}
        >
            {/* Divider Line */}
            <div className={`${divider} h-[1px] bg-[#E8DCC4] mb-8`}></div>
            
            {/* Tier Title */}
            <h3 className="text-[#E8DCC4] text-center text-2xl font-semibold mb-8 open_sans">
                {title}
            </h3>

            {/* Sponsor Logos */}
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
                {sponsors.map((sponsor, index) => (
                    <motion.div
                        key={index}
                        className="relative group"
                        variants={logoVariants}
                        whileHover={{
                            scale: 1.05,
                            transition: {
                                duration: 0.2,
                                ease: "easeOut",
                            },
                        }}
                    >
                        {/* Outer cream/beige border container */}
                        <div className="bg-[#E8DCC4] rounded-2xl p-3 shadow-lg">
                            {/* Inner white container with black border */}
                            <div className="bg-white rounded-xl border-2 border-black w-[260px] h-[150px] flex items-center justify-center p-4 transition-shadow duration-300 group-hover:shadow-xl">
                                <img
                                    src={sponsor.logo}
                                    alt={sponsor.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );

    return (
        <section className="py-16 px-4 bg-[#1E1E1E] relative overflow-hidden">
            {/* Background gradient orb */}
            <div className="absolute top-0 left-[40%] w-[250px] h-[250px] bg-radial-green-dark rounded-full rotate-270 opacity-30"></div>

            <motion.div
                className="max-w-6xl mx-auto relative z-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                variants={containerVariants}
            >
                {/* Title */}
                <motion.div
                    className="text-center mb-16"
                    variants={tierVariants}
                >
                    <h2 className="text-5xl md:text-6xl font-bold text-[#FFF3D2] mb-4">
                        Our Sponsors
                    </h2>
                </motion.div>

                {/* Sponsor Tiers */}
                <SponsorTier title="Diamond Sponsor" sponsors={sponsorTiers.diamond} divider="w-[40%]" />
                <SponsorTier title="Gold Sponsor" sponsors={sponsorTiers.gold} />
                <SponsorTier title="In Association With" sponsors={sponsorTiers.association} />
                <SponsorTier title="Social Media Partner" sponsors={sponsorTiers.socialMedia} />
                <SponsorTier title="Media Partner" sponsors={sponsorTiers.media} />
                <SponsorTier title="Hospitality Partner" sponsors={sponsorTiers.hospitality} />
                <SponsorTier title="Community Growth Partner" sponsors={sponsorTiers.communityGrowth} />
                <SponsorTier title="News Channel Partner" sponsors={sponsorTiers.newsChannel} />
            </motion.div>
        </section>
    );
}
