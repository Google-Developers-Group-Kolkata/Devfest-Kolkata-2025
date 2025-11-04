"use client";
import { FaXTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import useEmblaCarousel from "embla-carousel-react";
import teams from '@/data/team.json';

const TeamCardSkeleton = ({ isCenter = true }) => {
    return (
        <div 
            className={`flex flex-col items-center px-4 sm:px-8 animate-pulse transition-all duration-700 ease-out ${
                isCenter ? 'scale-100 opacity-100' : 'scale-75 opacity-50'
            }`}
            style={{
                transform: isCenter ? 'translateY(-20px)' : 'translateY(300px)',
            }}
        >
            {/* Image Skeleton */}
            <div className={`relative mb-10 overflow-hidden transition-all duration-700 ease-out ${
                isCenter 
                    ? 'w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px]' 
                    : 'w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px]'
            }`}>
                {/* Blob Background Skeleton with rounded organic shape */}
                <div className={`absolute left-1/2 -translate-x-1/2 top-[35px] bg-gray-700 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] transition-all duration-700 ease-out ${
                    isCenter 
                        ? 'w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] md:w-[300px] md:h-[300px]' 
                        : 'w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] md:w-[200px] md:h-[200px]'
                }`} />
                
                {/* Image Skeleton with rounded corners */}
                <div className="relative w-full h-full z-10 flex items-start justify-center">
                    <div className={`bg-gray-600 rounded-3xl transition-all duration-700 ease-out ${
                        isCenter 
                            ? 'w-[200px] h-[230px] sm:w-[260px] sm:h-[290px] md:w-[320px] md:h-[350px]' 
                            : 'w-[120px] h-[150px] sm:w-[160px] sm:h-[190px] md:w-[200px] md:h-[230px]'
                    }`} />
                </div>
            </div>

            {/* Details Skeleton */}
            <div className={`flex flex-col items-center transition-all duration-500 ease-out min-h-[120px] ${
                isCenter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
            }`}>
                {/* Role Skeleton */}
                <div className="h-4 sm:h-5 w-28 sm:w-32 bg-gray-700 rounded-md mb-2" />

                {/* Name Skeleton */}
                <div className="h-5 sm:h-6 w-32 sm:w-40 bg-gray-600 rounded-md mb-4" />

                {/* Social Icons Skeleton */}
                <div className="flex gap-3">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-700 rounded-md" />
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-700 rounded-md" />
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-700 rounded-md" />
                </div>
            </div>
        </div>
    );
};

const TeamCard = ({ name, role, image, socialLinks, isCenter }) => {
    const blobColors = teams.blobColors;
    const blobShapes = teams.blobShapes;
    
    const [colorIndex, setColorIndex] = useState(0);
    const [shapeIndex, setShapeIndex] = useState(0);
    
    useEffect(() => {
        setColorIndex(Math.floor(Math.random() * blobColors.length));
        setShapeIndex(Math.floor(Math.random() * blobShapes.length));
    }, [blobColors.length, blobShapes.length]);
    
    const bgColorFinal = blobColors[colorIndex];
    const blobShape = blobShapes[shapeIndex];

    return (
        <div 
            className={`flex flex-col items-center group bg-dark px-4 sm:px-8 transition-all duration-700 ease-out ${
                isCenter ? 'scale-100 opacity-100' : 'scale-75 opacity-50'
            }`}
            style={{
                transform: isCenter ? 'translateY(-20px)' : 'translateY(300px)',
            }}
        >
            {/* Image Container with Colored Blob Background */}
            <div className={`relative mb-10 overflow-hidden transition-all duration-700 ease-out ${
                isCenter 
                    ? 'w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px]' 
                    : 'w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px]'
            } pt-10`}>
                {/* Colored Blob Background */}
                <div
                    className={`absolute left-1/2 -translate-x-1/2 top-[35px] transition-all duration-500 ease-out group-hover:scale-105 group-hover:rotate-6 ${blobShape} ${
                        isCenter 
                            ? 'w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] md:w-[300px] md:h-[300px]' 
                            : 'w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] md:w-[200px] md:h-[200px]'
                    }`}
                    style={{ 
                        backgroundColor: bgColorFinal,
                    }}
                />

                {/* Team Member Image */}
                <div className="relative w-full h-full z-10 flex items-start justify-center ">
                    <img
                        src={image}
                        alt={name}
                        className={`object-cover object-top transition-all duration-700 ease-out ${
                            isCenter 
                                ? 'w-[200px] h-[230px] sm:w-[260px] sm:h-[290px] md:w-[320px] md:h-[350px] grayscale-0' 
                                : 'w-[120px] h-[150px] sm:w-[160px] sm:h-[190px] md:w-[200px] md:h-[230px] grayscale'
                        }`}
                    />
                </div>
            </div>

            {/* Details - Only show for center card */}
            <div className={`flex flex-col items-center transition-all duration-500 ease-out min-h-[120px] ${
                isCenter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
            }`}>
                {/* Role */}
                <h3 className="text-white bg-dark mb-2 aldrich uppercase text-sm sm:text-base md:text-lg text-center px-2">
                    {role}
                </h3>

                {/* Name */}
                <p className="text-[#D4AF37] mb-4 tracking-wider aldrich uppercase text-base sm:text-lg md:text-xl text-center px-2">
                    {name}
                </p>

                {/* Social Icons */}
                <div className="flex gap-2 sm:gap-3">
                    {socialLinks.twitter && (
                        <Link
                            href={socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-6 h-6 sm:w-7 sm:h-7 bg-[#3A3A3A] rounded flex items-center justify-center hover:bg-[#4A4A4A] transition-colors"
                        >
                            <FaXTwitter className="text-white text-[10px] sm:text-xs" />
                        </Link>
                    )}
                    {socialLinks.linkedin && (
                        <Link
                            href={socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-6 h-6 sm:w-7 sm:h-7 bg-[#3A3A3A] rounded flex items-center justify-center hover:bg-[#4A4A4A] transition-colors"
                        >
                            <FaLinkedinIn className="text-white text-[10px] sm:text-xs" />
                        </Link>
                    )}
                    {socialLinks.instagram && (
                        <Link
                            href={socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-6 h-6 sm:w-7 sm:h-7 bg-[#3A3A3A] rounded flex items-center justify-center hover:bg-[#4A4A4A] transition-colors"
                        >
                            <FaInstagram className="text-white text-[10px] sm:text-xs" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function Teams() {
    const [shuffledMembers, setShuffledMembers] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [itemsPerView, setItemsPerView] = useState(3);
    const [selectedIndex, setSelectedIndex] = useState(0);
    
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'center',
        skipSnaps: false,
        dragFree: false,
    });

    // Shuffle team members on mount
    useEffect(() => {
        const shuffled = [...teams.teamMembers].sort(() => Math.random() - 0.5);
        setShuffledMembers(shuffled);
        // Add a small delay to show the skeleton (optional)
        setTimeout(() => setIsLoading(false), 300);
    }, []);

    // Update items per view based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setItemsPerView(1);
            } else {
                setItemsPerView(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);

        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const getVisibleIndices = () => {
        if (itemsPerView === 1) {
            return [selectedIndex];
        }
        
        const prevIndex = selectedIndex === 0 && shuffledMembers ? shuffledMembers.length - 1 : selectedIndex - 1;
        const nextIndex = shuffledMembers && selectedIndex === shuffledMembers.length - 1 ? 0 : selectedIndex + 1;
        
        return [prevIndex, selectedIndex, nextIndex];
    };

    const visibleIndices = getVisibleIndices();

    return (
        <div className="bg-[#1E1E1E] py-10 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-full mx-auto">
                {/* Section Heading */}
                <div className="text-center mb-12 sm:mb-16 md:mb-10">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-3 sm:mb-4 tracking-wider albert_sans font-bold">
                        The TEAM
                    </h2>
                    <p className="text-gray-400 text-base sm:text-lg md:text-xl tracking-wide albert_sans px-4">
                        Meet the passionate organizers behind DevFest Kolkata 2025
                    </p>
                </div>

                {/* Carousel Container with Fixed Height */}
                <div className="relative">
                    {isLoading ? (
                        // Loading Skeleton with Fixed Height
                        <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto min-h-[500px] sm:min-h-[600px] md:min-h-[700px]">
                            <button
                                disabled
                                className="z-20 bg-gray-800 text-gray-600 p-2 sm:p-3 rounded-full flex-shrink-0 opacity-50 cursor-not-allowed"
                                aria-label="Previous"
                            >
                                <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                            </button>

                            <div className="flex-1 max-w-5xl">
                                <div className="flex justify-center items-start gap-2 sm:gap-4">
                                    {itemsPerView === 3 ? (
                                        <>
                                            <div className="hidden sm:block">
                                                <TeamCardSkeleton isCenter={false} />
                                            </div>
                                            <TeamCardSkeleton isCenter={true} />
                                            <div className="hidden sm:block">
                                                <TeamCardSkeleton isCenter={false} />
                                            </div>
                                        </>
                                    ) : (
                                        <TeamCardSkeleton isCenter={true} />
                                    )}
                                </div>
                            </div>

                            <button
                                disabled
                                className="z-20 bg-gray-800 text-gray-600 p-2 sm:p-3 rounded-full flex-shrink-0 opacity-50 cursor-not-allowed"
                                aria-label="Next"
                            >
                                <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                            </button>
                        </div>
                    ) : (
                        // Actual Carousel with Fixed Height
                        <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto min-h-[500px] sm:min-h-[600px] md:min-h-[550px] relative">
                            {/* Left Navigation Button */}
                            <button
                                onClick={scrollPrev}
                                className="z-20 bg-[#D9D9D933] hover:bg-[#D9D9D980] text-white p-2 sm:p-3 rounded-full transition-colors flex-shrink-0 absolute left-5 md:left-20 lg:left-50  xl:left-90 top-40 cursor-pointer"
                                aria-label="Previous"
                            >
                                <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                            </button>

                            {/* Right Navigation Button */}
                            <button
                                onClick={scrollNext}
                                className="z-20 bg-[#D9D9D933] hover:bg-[#D9D9D980] text-white p-2 sm:p-3 rounded-full transition-colors flex-shrink-0 absolute right-5 md:right-20 lg:right-50 xl:right-90 top-40 cursor-pointer"
                                aria-label="Next"
                            >
                                <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                            </button>

                            {/* Embla Carousel */}
                            <div className="overflow-hidden flex-1 max-w-6xl" ref={emblaRef}>
                                <div className="flex items-start">
                                    {shuffledMembers && shuffledMembers.map((member, index) => (
                                        <div
                                            key={member.id}
                                            className={`flex-[0_0_100%] min-w-0 ${
                                                itemsPerView === 3 ? 'sm:flex-[0_0_33.333%]' : ''
                                            }`}
                                        >
                                            <div className="flex justify-center">
                                                <TeamCard
                                                    {...member}
                                                    isCenter={visibleIndices.includes(index) && 
                                                        (itemsPerView === 1 || index === selectedIndex)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}