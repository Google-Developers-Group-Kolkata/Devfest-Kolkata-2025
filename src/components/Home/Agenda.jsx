import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const HALL_COLORS = {
    "Main Hall": "var(--google-blue)",
    "Second Hall": "var(--google-red)",
    "All": "var(--google-green)",
    "Utsav Convention Center": "var(--google-yellow)",
    "Om Ball Room": "var(--google-red)",
};

const AgendaCard = ({ title, speaker, startTime, endTime, hall, description }) => {
    const bgColor = HALL_COLORS[hall] || "var(--google-blue)";

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 h-full flex flex-col p-6">
            <div
                className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 self-start"
                style={{ backgroundColor: bgColor, color: "#000" }}
            >
                {hall}
            </div>
            <h3 className="text-white text-xl sm:text-2xl font-bold mb-2 product_sans">
                {title}
            </h3>
            {speaker && (
                <p className="text-gray-400 text-sm sm:text-base mb-3 albert_sans">
                    Speaker: <span className="text-white">{speaker}</span>
                </p>
            )}
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-4 albert_sans">
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span>
                    {formatTime(startTime)} - {formatTime(endTime)}
                </span>
            </div>
        </div>
    );
};

export default function Agenda() {
    const [agendaData, setAgendaData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAgenda = async () => {
        try {
            setLoading(true);
            const agendaCollection = collection(db, "agenda");
            const agendaSnapshot = await getDocs(agendaCollection);
            const agendaList = agendaSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            
            // Sort by startTime
            agendaList.sort((a, b) => {
                const aTime = a.startTime?.toDate ? a.startTime.toDate() : new Date(a.startTime);
                const bTime = b.startTime?.toDate ? b.startTime.toDate() : new Date(b.startTime);
                return aTime - bTime;
            });
            
            setAgendaData(agendaList);
        } catch (error) {
            console.error("Error fetching agenda:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgenda();
    }, []);

    // Separate agenda by venue
    const utsavAgenda = agendaData.filter(
        (item) => item.hall === "Utsav Convention Center" || item.hall === "All"
    );
    const omBallAgenda = agendaData.filter(
        (item) => item.hall === "Om Ball Room" || item.hall === "All"
    );

    return (
        <div className="bg-[#1E1E1E] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Heading */}
                <div className="text-center mb-16 sm:mb-20">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 tracking-wider albert_sans font-bold">
                        EVENT AGENDA
                    </h2>
                    <p className="text-gray-400 text-lg sm:text-xl tracking-wide albert_sans">
                        Schedule & Sessions
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                ) : agendaData.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Utsav Convention Center */}
                        <div className="space-y-6">
                            <div className="text-center lg:text-left mb-8">
                                <h3 className="text-3xl sm:text-4xl text-white font-bold mb-2 product_sans">
                                    Utsav Convention Center
                                </h3>
                                <div className="h-1 w-24 bg-[var(--google-yellow)] mx-auto lg:mx-0"></div>
                            </div>
                            {utsavAgenda.length > 0 ? (
                                <div className="space-y-6">
                                    {utsavAgenda.map((item) => (
                                        <AgendaCard
                                            key={item.id}
                                            title={item.title}
                                            speaker={item.speaker}
                                            startTime={item.startTime}
                                            endTime={item.endTime}
                                            hall={item.hall}
                                            description={item.description}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-400 py-10 albert_sans">
                                    <p>No sessions scheduled</p>
                                </div>
                            )}
                        </div>

                        {/* Om Ball Room */}
                        <div className="space-y-6">
                            <div className="text-center lg:text-left mb-8">
                                <h3 className="text-3xl sm:text-4xl text-white font-bold mb-2 product_sans">
                                    Om Ball Room
                                </h3>
                                <div className="h-1 w-24 bg-[var(--google-red)] mx-auto lg:mx-0"></div>
                            </div>
                            {omBallAgenda.length > 0 ? (
                                <div className="space-y-6">
                                    {omBallAgenda.map((item) => (
                                        <AgendaCard
                                            key={item.id}
                                            title={item.title}
                                            speaker={item.speaker}
                                            startTime={item.startTime}
                                            endTime={item.endTime}
                                            hall={item.hall}
                                            description={item.description}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-400 py-10 albert_sans">
                                    <p>No sessions scheduled</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-400 py-20 albert_sans">
                        <p className="text-xl">Agenda will be announced soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
