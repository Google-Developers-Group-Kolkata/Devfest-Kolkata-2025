"use client";

import { motion } from "framer-motion";
import {
    MapPinIcon,
    ClockIcon,
    CalendarDaysIcon,
    BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

export default function Venue() {
    const venueDetails = {
        name: "Vedic Village",
        address: "Shikharpur P.O, Bagu, Shikharpur, Kolkata, West Bengal 700135",
        date: "December 15, 2025",
        time: "9:00 AM - 6:00 PM",
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    };

    return (
        <section className="py-20 bg-[#1E1E1E]">
            <div className="container mx-auto px-4 md:max-w-6xl">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="text-center mb-16"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="text-5xl md:text-7xl font-bold mb-6"
                    >
                        <span className="text-[#FFF3D2] albert_sans">
                            Venue
                        </span>
                    </motion.h2>
                </motion.div>

                {/* Main Content */}
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-[#2A2A2A] rounded-3xl p-8 md:p-12"
                >
                    {/* Venue Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                        <div className="mb-4 md:mb-0">
                            <h3 className="text-3xl md:text-4xl font-bold text-[#FFF3D2] mb-2 albert_sans">
                                {venueDetails.name}
                            </h3>
                            <div className="flex items-center gap-2 text-[#FFF3D2]">
                                <MapPinIcon className="w-5 h-5" />
                                <p className="albert_sans">
                                    {venueDetails.address}
                                </p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#FFF3D2] text-black font-semibold py-3 px-8 rounded-full albert_sans shadow-lg hover:shadow-xl transition-all duration-300 w-fit"
                        >
                            Get Directions
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}