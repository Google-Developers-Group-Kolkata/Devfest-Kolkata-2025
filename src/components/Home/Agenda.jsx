import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const HALL_COLORS = {
    "Main Hall": "var(--google-blue)",
    "Second Hall": "var(--google-red)",
    "All": "var(--google-green)",
    "Utsav Convention Center": "var(--google-yellow)",
    "Om Ball Room": "var(--google-red)",
    "Slot 1": "var(--google-blue)",
    "Slot 2": "var(--google-green)",
};

// Day 1 Agenda - December 20, 2025 - RCCIIT
const DAY1_AGENDA = {
    slot1: [
        { id: "d1s1-1", title: "Registration Starts", time: "8:30 AM - 9:15 AM", hall: "Slot 1" },
        { id: "d1s1-2", title: "Keynote by GDG Kolkata", time: "9:15 AM - 9:30 AM", hall: "Slot 1" },
        { id: "d1s1-3", title: "Workshop: Safety First - Hands-on with GeminiCLI and Model Armor for Security", time: "", hall: "Slot 1", isWorkshopHeader: true },
        { id: "d1s1-4", title: "Basic overview and setup", time: "9:30 AM - 10 AM", hall: "Slot 1" },
        { id: "d1s1-5", title: "Demo 1 - Input and Output prompt sanitisation via Model Armor demonstrated on VertexAI Workbench", time: "10 AM - 11 AM", hall: "Slot 1" },
        { id: "d1s1-6", title: "Demo 2 - Using GeminiCLI and Trivy on GCE VM to automate container image scan before deployment as part of a CICD Pipeline example", time: "11 AM - 12 PM", hall: "Slot 1" },
        { id: "d1s1-7", title: "Food and Swags Distribution", time: "12:00 PM", hall: "Slot 1" },
    ],
    slot2: [
        { id: "d1s2-1", title: "Registration Starts", time: "12:30 PM - 1:15 PM", hall: "Slot 2" },
        { id: "d1s2-2", title: "Keynote by GDG Kolkata", time: "1:15 PM - 1:30 PM", hall: "Slot 2" },
        { id: "d1s2-3", title: "Workshop: Safety First - Hands-on with GeminiCLI and Model Armor for Security", time: "", hall: "Slot 2", isWorkshopHeader: true },
        { id: "d1s2-4", title: "Basic overview and setup", time: "1:30 PM - 2 PM", hall: "Slot 2" },
        { id: "d1s2-5", title: "Demo 1 - Input and Output prompt sanitisation via Model Armor demonstrated on VertexAI Workbench", time: "2 PM - 3 PM", hall: "Slot 2" },
        { id: "d1s2-6", title: "Demo 2 - Using GeminiCLI and Trivy on GCE VM to automate container image scan before deployment as part of a CICD Pipeline example", time: "3 PM - 4 PM", hall: "Slot 2" },
        { id: "d1s2-7", title: "Food and Swags Distribution", time: "4:00 PM", hall: "Slot 2" },
    ],
};

const AgendaCard = ({ title, speaker, startTime, endTime, hall, description, time, isWorkshopHeader }) => {
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

    // For Day 1 static data (uses time string directly)
    const displayTime = time || (startTime && endTime ? `${formatTime(startTime)} - ${formatTime(endTime)}` : "");

    return (
        <div className={`bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 h-full flex flex-col p-6 ${isWorkshopHeader ? 'border-l-4' : ''}`} style={isWorkshopHeader ? { borderLeftColor: bgColor } : {}}>
            <div
                className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 self-start"
                style={{ backgroundColor: bgColor, color: "#000" }}
            >
                {hall}
            </div>
            <h3 className={`text-white ${isWorkshopHeader ? 'text-lg sm:text-xl font-semibold italic' : 'text-xl sm:text-2xl font-bold'} mb-2 product_sans`}>
                {title}
            </h3>
            {speaker && (
                <p className="text-gray-400 text-sm sm:text-base mb-3 albert_sans">
                    Speaker: <span className="text-white">{speaker}</span>
                </p>
            )}
            {displayTime && (
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
                    <span>{displayTime}</span>
                </div>
            )}
        </div>
    );
};

export default function Agenda() {
    const [agendaData, setAgendaData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState("day2");

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

    // Separate agenda by venue (Day 2)
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
                <div className="text-center mb-10 sm:mb-12">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 tracking-wider albert_sans font-bold">
                        EVENT AGENDA
                    </h2>
                    <p className="text-gray-400 text-lg sm:text-xl tracking-wide albert_sans mb-8">
                        Schedule & Sessions
                    </p>

                    {/* Day Selector */}
                    <motion.div
                        className="flex justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-2 sm:gap-4 relative bg-[#2A2A2A] rounded-full p-1 w-fit">
                            <motion.div
                                className="absolute bg-[#FFF3D2] rounded-full h-[calc(100%-8px)] top-1"
                                layoutId="agendaDayIndicator"
                                initial={false}
                                animate={{
                                    left: selectedDay === "day1" ? "4px" : "50%",
                                    width: "calc(50% - 8px)",
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 30,
                                }}
                            />
                            <motion.button
                                onClick={() => setSelectedDay("day1")}
                                className={`px-4 sm:px-6 md:px-8 py-2 rounded-full text-sm md:text-base font-semibold transition-colors duration-200 relative z-10 cursor-pointer ${
                                    selectedDay === "day1"
                                        ? "text-[#1E1E1E]"
                                        : "text-[#FFF3D2]"
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Day 1
                            </motion.button>
                            <motion.button
                                onClick={() => setSelectedDay("day2")}
                                className={`px-4 sm:px-6 md:px-8 py-2 rounded-full text-sm md:text-base font-semibold transition-colors duration-200 relative z-10 cursor-pointer ${
                                    selectedDay === "day2"
                                        ? "text-[#1E1E1E]"
                                        : "text-[#FFF3D2]"
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Day 2
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Date subtitle */}
                    <motion.p
                        key={selectedDay}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-[#FFF3D2] text-base sm:text-lg mt-4 albert_sans"
                    >
                        {selectedDay === "day1" ? "December 20, 2025 - RCCIIT" : "December 21, 2025 - Vedic Village"}
                    </motion.p>
                </div>

                {/* Day 1 Agenda */}
                {selectedDay === "day1" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
                    >
                        {/* Slot 1 */}
                        <div className="space-y-6">
                            <div className="text-center lg:text-left mb-8">
                                <h3 className="text-3xl sm:text-4xl text-white font-bold mb-2 product_sans">
                                    Slot 1
                                </h3>
                                <div className="h-1 w-24 bg-[var(--google-blue)] mx-auto lg:mx-0"></div>
                            </div>
                            <div className="space-y-6">
                                {DAY1_AGENDA.slot1.map((item) => (
                                    <AgendaCard
                                        key={item.id}
                                        title={item.title}
                                        time={item.time}
                                        hall={item.hall}
                                        isWorkshopHeader={item.isWorkshopHeader}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Slot 2 */}
                        <div className="space-y-6">
                            <div className="text-center lg:text-left mb-8">
                                <h3 className="text-3xl sm:text-4xl text-white font-bold mb-2 product_sans">
                                    Slot 2
                                </h3>
                                <div className="h-1 w-24 bg-[var(--google-green)] mx-auto lg:mx-0"></div>
                            </div>
                            <div className="space-y-6">
                                {DAY1_AGENDA.slot2.map((item) => (
                                    <AgendaCard
                                        key={item.id}
                                        title={item.title}
                                        time={item.time}
                                        hall={item.hall}
                                        isWorkshopHeader={item.isWorkshopHeader}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Day 2 Agenda */}
                {selectedDay === "day2" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
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
                    </motion.div>
                )}
            </div>
        </div>
    );
}
