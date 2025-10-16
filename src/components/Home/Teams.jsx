"use client";
import { FaXTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import ComingSoon from "../common/ComingSoon";

const TeamCard = ({ name, role, image, bgColor, socialLinks }) => {
    return (
        <div className="flex flex-col items-center group">
            {/* Image Container with Colored Circle Background */}
            <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] mb-6 overflow-visible">
                {/* Colored Circle Background - positioned behind */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 top-[30px] w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] rounded-full transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: bgColor }}
                />

                {/* Team Member Image - Full color, positioned on top */}
                <div className="relative w-full h-full z-10 flex items-start justify-center">
                    {/* <img
                        src={image}
                        alt={name}
                        className="w-[200px] h-[220px] sm:w-[240px] sm:h-[260px] object-cover object-top"
                    /> */}
                </div>
            </div>

            {/* Role */}
            <h3 className="text-white text-sm sm:text-base tracking-[0.3em] mb-2 aldrich uppercase">
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
    const teamMembers = [
        {
            id: 1,
            name: "Organiser 1",
            role: "ORGANISER",
            image: "https://placehold.co/240x260/png?text=Team+1",
            bgColor: "#FF5757",
            socialLinks: {
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com",
            },
        },
        {
            id: 2,
            name: "Organiser 2",
            role: "ORGANISER",
            image: "https://placehold.co/240x260/png?text=Team+2",
            bgColor: "#4285F4",
            socialLinks: {
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com",
            },
        },
        {
            id: 3,
            name: "Organiser 3",
            role: "ORGANISER",
            image: "https://placehold.co/240x260/png?text=Team+3",
            bgColor: "#34A853",
            socialLinks: {
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com",
            },
        },
        {
            id: 4,
            name: "Organiser 4",
            role: "ORGANISER",
            image: "https://placehold.co/240x260/png?text=Team+4",
            bgColor: "#4285F4",
            socialLinks: {
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com",
            },
        },
        {
            id: 5,
            name: "Organiser 5",
            role: "ORGANISER",
            image: "https://placehold.co/240x260/png?text=Team+5",
            bgColor: "#FBBC04",
            socialLinks: {
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com",
            },
        },
        {
            id: 6,
            name: "Organiser 6",
            role: "ORGANISER",
            image: "https://placehold.co/240x260/png?text=Team+6",
            bgColor: "#EA4335",
            socialLinks: {
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com",
            },
        },
    ];

    return (
        <div className="bg-[#1E1E1E] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
            {/* <div className="max-w-7xl mx-auto"> */}
            <div className="mx-auto">
                {/* Section Heading */}
                <div className="text-center mb-16 sm:mb-20">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 tracking-wider albert_sans font-bold">
                        The TEAM
                    </h2>
                    <p className="text-gray-400 text-lg sm:text-xl tracking-wide albert_sans">
                        We are Few but lorem ipsum
                    </p>
                </div>

                {/* Team Grid - 3 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16 place-items-center relative">
                    {teamMembers.map((member) => (
                        <TeamCard key={member.id} {...member} />
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center w-full h-full backdrop-blur-2xl">
                        <ComingSoon description="Our Team members will be announced soon." />
                    </div>
                </div>
            </div>
        </div>
    );
}
