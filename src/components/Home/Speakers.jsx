"use client";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const SpeakerCard = ({ name, role, image, bgColor, socialLinks }) => {
    return (
        <div className="flex flex-col items-center group w-full max-w-[350px] h-full">
            {/* Card Container */}
            <div className="relative w-full pb-32"> {/* space reserved for overlay */}
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover object-top rounded-3xl"
                />
                {/* Info Card Overlay */}
                <div 
                    className="absolute left-1/2 bottom-0 -translate-x-1/2 w-full px-6 py-8 rounded-3xl shadow-lg product_sans"
                    style={{
                        backgroundColor: bgColor,
                    }}
                >
                    <h3 className="text-black text-xl sm:text-2xl font-bold mb-2 text-center">
                        {name}
                    </h3>
                    <p className="text-black text-sm sm:text-base mb-6 text-center opacity-80">
                        {role}
                    </p>
                    <div className="flex gap-3 justify-center">
                        {socialLinks.instagram && (
                            <a
                                href={socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded flex items-center justify-center transition-colors"
                            >
                                <img
                                    src="/icons/insta.svg"
                                    alt="instagram-icon"
                                    className="h-10 w-10"
                                />
                            </a>
                        )}
                        {socialLinks.linkedin && (
                            <a
                                href={socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded flex items-center justify-center transition-colors"
                            >
                                <img
                                    src="/icons/linkedin.svg"
                                    alt="linkedin-icon"
                                    className="h-10 w-10"
                                />
                            </a>
                        )}
                        {socialLinks.twitter && (
                            <a
                                href={socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded flex items-center justify-center transition-colors"
                            >
                                <img
                                    src="/icons/x.svg"
                                    alt="x-icon"
                                    className="h-9 w-9"
                                />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Speakers() {
    const speakers = [
        {
            id: 1,
            name: "Speaker 1",
            role: "SPEAKER",
            image: "/speaker/1.svg",
            bgColor: "var(--google-red)",
            bgShape: "rounded-rect",
            socialLinks: {
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com",
            },
        },
        {
            id: 2,
            name: "Speaker 2",
            role: "SPEAKER",
            image: "/speaker/1.svg",
            bgColor: "var(--google-yellow)",
            bgShape: "circle",
            socialLinks: {
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com",
            },
        },
        {
            id: 3,
            name: "Speaker 3",
            role: "SPEAKER",
            image: "/speaker/1.svg",
            bgColor: "var(--google-green)",
            bgShape: "rounded-rect",
            socialLinks: {
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com",
            },
        },
        {
            id: 4,
            name: "Speaker 4",
            role: "ORGANISER",
            image: "/speaker/1.svg",
            bgColor: "var(--google-blue)",
            bgShape: "triangle",
            socialLinks: {
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com",
            },
        },
        {
            id: 5,
            name: "Speaker 5",
            role: "ORGANISER",
            image: "/speaker/1.svg",
            bgColor: "var(--google-red)",
            bgShape: "rounded-rect",
            socialLinks: {
                twitter: "https://twitter.com",
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com",
            },
        },
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

                {/* Speakers Carousal */}
                <Carousel
                    opts={{ align: "start" }}
                    className="w-full"
                >
                    <CarouselContent className="overflow-visible"> {/* allow overlay visibility */}
                        {speakers.map((speaker) => (
                            <CarouselItem
                                key={speaker.id}
                                className="md:basis-1/2 lg:basis-1/3 h-full flex"
                            >
                                <SpeakerCard {...speaker} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    );
}
