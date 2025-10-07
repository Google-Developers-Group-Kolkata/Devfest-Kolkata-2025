"use client";

const TrackCard = ({ icon, name }) => (
    <div className="group relative h-[100px] sm:h-[120px] md:h-[140px] w-[120px] sm:w-[150px] md:w-[180px] cursor-pointer transition-transform duration-300 hover:scale-110">
        {/* Icon box */}
        <div className="absolute left-0 top-0 h-20 w-18 sm:h-24 sm:w-22 md:h-28 md:w-26 rounded-2xl rounded-br-none bg-[#424242] flex items-center justify-center">
            <img
                src={icon}
                alt={name}
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14"
            />
        </div>

        {/* Label box */}
        <div className="absolute bottom-0 right-0 flex h-10 sm:h-12 md:h-14 w-[80px] sm:w-[100px] md:w-[120px] items-center justify-center rounded-xl bg-[#1E1E1E] aldrich">
            <span className="text-[#FFF3D2] text-sm sm:text-md md:text-lg lg:text-xl aldrich">
                {name}
            </span>
        </div>
    </div>
);

export default function TrackCardSection() {
    const tracks = [
        { name: "Android", icon: "/android.svg" },
        { name: "Chrome", icon: "/chrome.svg" },
        { name: "Firebase", icon: "/firebase.svg" },
        { name: "Flutter", icon: "/flutter.svg" },
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-30 py-8 sm:py-12 md:py-16">
            {/* Heading */}
            <div className="text-center">
                <h2 className="text-4xl sm:text-5xl md:text-6xl text-[#FFF3D2] mb-4 tracking-wider albert_sans">
                    Tracks
                </h2>
                <div className="w-12 sm:w-16 h-1 bg-green-300 mx-auto mt-2 rounded-full animate-pulse"></div>
            </div>

            {/* Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-12 md:mt-16 place-items-center">
                {tracks.map((track) => (
                    <TrackCard key={track.name} {...track} />
                ))}
            </div>
        </div>
    );
}
