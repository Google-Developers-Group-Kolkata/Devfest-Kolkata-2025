"use client";
import { FaXTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import { useState, useEffect } from "react";
import Link from "next/link";
import teams from '@/data/team.json';

const TeamCard = ({ name, role, image, socialLinks }) => {
    const blobColors = teams.blobColors;
    const blobShapes = teams.blobShapes;
    
    // Initialize with first indices to avoid hydration mismatch
    const [colorIndex, setColorIndex] = useState(0);
    const [shapeIndex, setShapeIndex] = useState(0);
    
    // Generate random indices on client side only
    useEffect(() => {
        setColorIndex(Math.floor(Math.random() * blobColors.length));
        setShapeIndex(Math.floor(Math.random() * blobShapes.length));
    }, [blobColors.length, blobShapes.length]);
    
    const bgColorFinal = blobColors[colorIndex];
    const blobShape = blobShapes[shapeIndex];

    return (
        <div className="flex flex-col items-center group bg-dark">
            {/* Image Container with Colored Blob Background */}
            <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] mb-10 overflow-hidden">
                {/* Colored Blob Background - positioned behind */}
                <div
                    className={`absolute left-1/2 -translate-x-1/2 top-[35px] w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] transition-transform duration-300 group-hover:scale-108 group-hover:rotate-6 ${blobShape}`}
                    style={{ 
                        backgroundColor: bgColorFinal,
                    }}
                />

                {/* Team Member Image - Full color, positioned on top */}
                <div className="relative w-full h-full z-10 flex items-start justify-center">
                    <img
                        src={image}
                        alt={name}
                        className="w-[200px] h-[230px] sm:w-[260px] sm:h-[280px] object-cover object-top"
                    />
                </div>
            </div>

            {/* Role */}
            <h3 className="text-white bg-dark text-sm sm:text-base mb-2 aldrich uppercase">
                {role}
            </h3>

            {/* Name */}
            <p className="text-[#D4AF37] text-base sm:text-lg mb-4 tracking-wider aldrich uppercase">
                {name}
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
                {socialLinks.twitter && (
                    <Link
                        href={socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 bg-[#3A3A3A] rounded flex items-center justify-center hover:bg-[#4A4A4A] transition-colors"
                    >
                        <FaXTwitter className="text-white text-xs" />
                    </Link>
                )}
                {socialLinks.linkedin && (
                    <Link
                        href={socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 bg-[#3A3A3A] rounded flex items-center justify-center hover:bg-[#4A4A4A] transition-colors"
                    >
                        <FaLinkedinIn className="text-white text-xs" />
                    </Link>
                )}
                {socialLinks.instagram && (
                    <Link
                        href={socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 bg-[#3A3A3A] rounded flex items-center justify-center hover:bg-[#4A4A4A] transition-colors"
                    >
                        <FaInstagram className="text-white text-xs" />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default function Teams() {
    const [shuffledMembers, setShuffledMembers] = useState(teams.teamMembers);
    
    // Shuffle team members on mount
    useEffect(() => {
        const shuffled = [...teams.teamMembers].sort(() => Math.random() - 0.5);
        setShuffledMembers(shuffled);
    }, []);

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
                    {shuffledMembers.map((member) => (
                        <TeamCard key={member.id} {...member} />
                    ))}
                </div>
            </div>
        </div>
    );
}
