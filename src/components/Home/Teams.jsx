"use client";
import { FaXTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import { useMemo } from "react";
import ComingSoon from "../common/ComingSoon";
import teams from '@/data/team.json';

const TeamCard = ({ name, role, image, bgColor, socialLinks, memberId }) => {
    // Generate random blob shape based on member id for consistency
    const blobShape = useMemo(() => {
        // Use memberId as seed for consistent randomness
        const seed = memberId || Math.random();
        const random = (min, max, seedOffset = 0) => {
            const x = Math.sin(seed * (seedOffset + 1)) * 10000;
            return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
        };

        // More extreme variations for distinct shapes
        const p1 = random(30, 75, 1);
        const p2 = random(25, 75, 2);
        const p3 = random(25, 75, 3);
        const p4 = random(25, 75, 4);
        const p5 = random(25, 75, 5);
        const p6 = random(25, 75, 6);
        const p7 = random(25, 75, 7);
        const p8 = random(25, 75, 8);

        return `${p1}% ${100 - p1}% ${p3}% ${100 - p3}% / ${p5}% ${p6}% ${p7}% ${p8}%`;
    }, [memberId]);

    return (
        <div className="flex flex-col items-center group bg-dark">
            {/* Image Container with Colored Blob Background */}
            <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] mb-6 overflow-visible">
                {/* Colored Blob Background - positioned behind */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 top-[70px] w-[200px] h-[200px] sm:w-[200px] sm:h-[200px] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6"
                    style={{ 
                        backgroundColor: bgColor,
                        borderRadius: blobShape
                    }}
                />

                {/* Team Member Image - Full color, positioned on top */}
                <div className="relative w-full h-full z-10 flex items-start justify-center">
                    <img
                        src={image}
                        alt={name}
                        className="w-[200px] h-[230px] sm:w-[260px] sm:h-[280px] object-cover object-top filter grayscale hover:grayscale-0 transition duration-600"
                    />
                </div>
            </div>

            {/* Role */}
            <h3 className="text-white bg-dark text-sm sm:text-base tracking-[0.3em] mb-2 aldrich uppercase">
                {role}
            </h3>

            {/* Name */}
            <p className="text-[#D4AF37] text-base sm:text-lg mb-4 tracking-wider aldrich uppercase">
                {name}
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
                {socialLinks.twitter && (
                    <a
                        href={socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 bg-[#3A3A3A] rounded flex items-center justify-center hover:bg-[#4A4A4A] transition-colors"
                    >
                        <FaXTwitter className="text-white text-xs" />
                    </a>
                )}
                {socialLinks.linkedin && (
                    <a
                        href={socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 bg-[#3A3A3A] rounded flex items-center justify-center hover:bg-[#4A4A4A] transition-colors"
                    >
                        <FaLinkedinIn className="text-white text-xs" />
                    </a>
                )}
                {socialLinks.instagram && (
                    <a
                        href={socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 bg-[#3A3A3A] rounded flex items-center justify-center hover:bg-[#4A4A4A] transition-colors"
                    >
                        <FaInstagram className="text-white text-xs" />
                    </a>
                )}
            </div>
        </div>
    );
};

export default function Teams() {
    const teamMembers = teams.teamMembers;

    return (
        <div className="bg-[#1E1E1E] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Heading */}
                <div className="text-center mb-16 sm:mb-20">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 tracking-wider albert_sans font-bold">
                        The TEAM
                    </h2>
                    <p className="text-gray-400 text-lg sm:text-xl tracking-wide albert_sans">
                        Meet the passionate organizers behind DevFest Kolkata 2025
                    </p>
                </div>

                {/* Team Grid - 3 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16 place-items-center relative">
                    {teamMembers.map((member) => (
                        <TeamCard key={member.id} {...member} memberId={member.id} />
                    ))}
                    {/* <div className="absolute inset-0 flex items-center justify-center w-full h-full backdrop-blur-2xl">
                        <ComingSoon description="Our Team members will be announced soon." />
                    </div> */}
                </div>
            </div>
        </div>
    );
}
