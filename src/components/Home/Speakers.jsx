"use client";
import { FaXTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa6";

const SpeakerCard = ({ name, role, image, bgColor, bgShape, socialLinks }) => {
    return (
        <div className="flex flex-col items-center group">
            {/* Image Container with Colored Background Shape */}
            <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] mb-6 overflow-visible">
                {/* Colored Background Shape - positioned behind */}
                {bgShape === 'rounded-rect' && (
                    <div
                        className="absolute left-0 top-[30px] w-[200px] h-[180px] sm:w-[240px] sm:h-[200px] rounded-[50px] transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundColor: bgColor }}
                    />
                )}
                {bgShape === 'circle' && (
                    <div
                        className="absolute left-1/2 -translate-x-1/2 top-[30px] w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] rounded-full transition-transform duration-300 group-hover:scale-105"
                        style={{ backgroundColor: bgColor }}
                    />
                )}
                {bgShape === 'triangle' && (
                    <div
                        className="absolute left-1/2 -translate-x-1/2 top-[40px] w-0 h-0 transition-transform duration-300 group-hover:scale-105"
                        style={{
                            borderLeft: '120px solid transparent',
                            borderRight: '120px solid transparent',
                            borderBottom: `200px solid ${bgColor}`
                        }}
                    />
                )}

                {/* Speaker Image - Full color, positioned on top */}
                <div className="relative w-full h-full z-10 flex items-start justify-center">
                    <img
                        src={image}
                        alt={name}
                        className="w-[200px] h-[220px] sm:w-[240px] sm:h-[260px] object-cover object-top"
                    />
                </div>
            </div>

            {/* Role */}
            <h3 className="text-white text-sm sm:text-base tracking-[0.3em] mb-2 aldrich uppercase">
                {role}
            </h3>

            {/* Name */}
            <p className="text-white text-base sm:text-lg mb-4 tracking-wider aldrich border-b border-white pb-1 uppercase">
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

export default function Speakers() {
    const speakers = [
        {
            id: 1,
            name: "RAHUL SHARMA",
            role: "SPEAKER",
            image: "https://placehold.co/240x260/png?text=Speaker+1",
            bgColor: "#FF5757",
            bgShape: "rounded-rect",
            socialLinks: {
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com"
            }
        },
        {
            id: 2,
            name: "PRIYA SINGH",
            role: "SPEAKER",
            image: "https://placehold.co/240x260/png?text=Speaker+2",
            bgColor: "#FBBC04",
            bgShape: "circle",
            socialLinks: {
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com"
            }
        },
        {
            id: 3,
            name: "AMIT KUMAR",
            role: "SPEAKER",
            image: "https://placehold.co/240x260/png?text=Speaker+3",
            bgColor: "#34A853",
            bgShape: "rounded-rect",
            socialLinks: {
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com"
            }
        },
        {
            id: 4,
            name: "SNEHA PATEL",
            role: "ORGANISER",
            image: "https://placehold.co/240x260/png?text=Speaker+4",
            bgColor: "#4285F4",
            bgShape: "triangle",
            socialLinks: {
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com"
            }
        },
        {
            id: 5,
            name: "VIKRAM REDDY",
            role: "ORGANISER",
            image: "https://placehold.co/240x260/png?text=Speaker+5",
            bgColor: "#EA4335",
            bgShape: "rounded-rect",
            socialLinks: {
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com"
            }
        }
    ];

    return (
        <div className="bg-[#1E1E1E] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Heading */}
                <div className="text-center mb-16 sm:mb-20">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 tracking-wider albert_sans font-bold">
                        The SPEAKERS
                    </h2>
                    <p className="text-gray-400 text-lg sm:text-xl tracking-wide albert_sans">
                        Expert Voices in Technology
                    </p>
                </div>

                {/* Speakers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16 place-items-center">
                    {/* First Row - 3 speakers */}
                    {speakers.slice(0, 3).map((speaker) => (
                        <SpeakerCard key={speaker.id} {...speaker} />
                    ))}
                </div>

                {/* Second Row - 2 speakers centered */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-16 place-items-center mt-12 sm:mt-16 max-w-3xl mx-auto">
                    {speakers.slice(3, 5).map((speaker) => (
                        <SpeakerCard key={speaker.id} {...speaker} />
                    ))}
                </div>
            </div>
        </div>
    );
}
