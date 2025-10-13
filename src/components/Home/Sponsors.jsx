"use client";

import React from "react";
import { motion } from "framer-motion";

const sponsorLogos = [
    // Row 1
    [
        { name: "Webflow", logo: "/sponsors/webflow.png" },
        { name: "Digital Sphere", logo: "/sponsors/digital-sphere.png" },
        { name: "Cybro Space", logo: "/sponsors/cybro-space.png" },
        { name: "Synapse Solutions", logo: "/sponsors/synapse.png" },
        { name: "NextStep", logo: "/sponsors/nextstep.png" },
    ],
    // Row 2
    [
        { name: "Webflow", logo: "/sponsors/webflow.png" },
        { name: "Digital Sphere", logo: "/sponsors/digital-sphere.png" },
        { name: "Cybro Space", logo: "/sponsors/cybro-space.png" },
    ],
    // Row 3
    [
        { name: "Synapse Solutions", logo: "/sponsors/synapse.png" },
        { name: "NextStep", logo: "/sponsors/nextstep.png" },
        { name: "Webflow", logo: "/sponsors/webflow.png" },
        { name: "Digital Sphere", logo: "/sponsors/digital-sphere.png" },
        { name: "Cybro Space", logo: "/sponsors/cybro-space.png" },
    ],
];

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

    const rowVariants = {
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

    return (
        <section className="py-16 px-4 bg-[#1E1E1E] relative overflow-hidden">
            {/* Background gradient orb */}
            <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-radial-green-dark rounded-full opacity-30"></div>

            <motion.div
                className="max-w-6xl mx-auto relative z-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                variants={containerVariants}
            >
                {/* Title */}
                <motion.div
                    className="text-center mb-16"
                    variants={rowVariants}
                >
                    <h2 className="text-5xl md:text-6xl font-bold text-[#FFF3D2] mb-4">
                        Our Sponsors
                    </h2>
                    <p className="text-gray-300 text-lg">
                        Powered by industry leaders who believe in innovation
                    </p>
                </motion.div>

                {/* Sponsor Rows */}
                <div className="space-y-12">
                    {sponsorLogos.map((row, rowIndex) => (
                        <motion.div
                            key={rowIndex}
                            className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
                            variants={rowVariants}
                        >
                            {row.map((sponsor, logoIndex) => (
                                <motion.div
                                    key={`${rowIndex}-${logoIndex}`}
                                    className="relative group"
                                    variants={logoVariants}
                                    whileHover={{
                                        scale: 1.1,
                                        transition: {
                                            duration: 0.2,
                                            ease: "easeOut",
                                        },
                                    }}
                                >
                                    {/* Logo placeholder with sponsor logo */}
                                    <div className="bg-transparent rounded-lg min-w-[140px] h-[80px] flex items-center justify-center">
                                        <img
                                            src={sponsor.logo}
                                            alt={sponsor.name}
                                            className="w-full h-[50px] object-cover"
                                        />
                                    </div>

                                    {/* Hover effect overlay */}
                                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"></div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
