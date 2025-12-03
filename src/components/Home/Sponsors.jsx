"use client";

import React from "react";
import { motion } from "framer-motion";

const sponsorLogos = [
    // Row 1
    [
        { name: "ADI Kolkata", logo: "/sponsors/adi-kolkata.png" },
        { name: "DIAGNOEASY", logo: "/sponsors/diagnoeasy.png" },
        { name: "FRIENDS FM", logo: "/sponsors/friends-fm.png" },
        { name: "Indiminds Technologies", logo: "/sponsors/indiminds.png" },
        { name: "KOLKATAR SOMIKARONN", logo: "/sponsors/kolkatar-somikaronn.png" },
        { name: "OH KOLKATA", logo: "/sponsors/oh-kolkata.png" },
        { name: "THE WALL", logo: "/sponsors/the-wall.png" },
        { name: "WIKI KOLKATA", logo: "/sponsors/wiki-kolkata.png" },
    ],
    // // Row 2
    // [
    //     { name: "Indiminds Technologies", logo: "/sponsors/indiminds.png" },
    //     { name: "KOLKATAR SOMIKARONN", logo: "/sponsors/kolkatar-somikaronn.png" },
    // ],
    // // Row 3
    // [
    //     { name: "OH KOLKATA", logo: "/sponsors/oh-kolkata.png" },
    //     { name: "THE WALL", logo: "/sponsors/the-wall.png" },
    //     { name: "WIKI KOLKATA", logo: "/sponsors/wiki-kolkata.png" },
    // ],
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
            <div className="absolute top-0 left-[40%] w-[250px] h-[250px] bg-radial-green-dark rounded-full rotate-270"></div>

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
                                    <div className="bg-[#FFF3D2] rounded-lg w-[140px] h-[140px] flex items-center justify-center p-4 shadow-lg">
                                        <img
                                            src={sponsor.logo}
                                            alt={sponsor.name}
                                            className="w-full h-full object-contain"
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
