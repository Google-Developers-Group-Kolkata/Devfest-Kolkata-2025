"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";

const TicketCard = ({ title, price, features, buttonColor, url, isActive }) => {
  let star;

  switch (buttonColor) {
    case "#377ABB":
      star = "/blue-star.svg";
      break;
    case "#EA4335":
      star = "/red-star.svg";
      break;
    case "#4DAB49":
      star = "/green-star.svg";
      break;

    default:
      star = "/blue-star.svg";
      break;
  }
  return (
  <div className="relative bg-[#F5E6D3] rounded-2xl w-full max-w-[360px] min-h-[400px] shadow-xl aldrich">
    {/* Sold Out Banner */}
    {!isActive && (
      <div className="absolute -left-3 -right-3 top-1/2 -translate-y-1/2 z-10">
        <div className="bg-white py-4 text-center shadow-lg border-2 border-black">
          <span className="text-black text-2xl font-bold albert_sans">Sold Out</span>
        </div>
      </div>
    )}
    <div className={`p-8 h-full flex flex-col rounded-2xl ${!isActive ? 'bg-black/40' : ''}`}>
      {/* Star Icon */}
      <div className="absolute top-6 right-6">
        <Image 
          src={star} 
          alt="star" 
          height={30} 
          width={30} 
        />
      </div>

      {/* Title */}
      <h3 className="text-[#0B0B0B] text-3xl font-bold mb-8">{title}</h3>

      {/* Features */}
      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3 text-[#4A4A4A]">
            <Image src="/tick.svg" alt="tick" height={20} width={20} className="w-7 h-7"/>
            <span className="text-base font-medium">{feature}</span>
          </div>
        ))}
      </div>

      {/* Price */}
      <div className="mb-6 mt-auto">
        <span className="text-[#0B0B0B] text-5xl font-bold">{price}</span>
        <span className="text-[#666] text-lg ml-2">/person</span>
      </div>

      {/* Button */}
      <button
        onClick={() => window.open(url)}
        className="w-full py-2 rounded-xl font-bold border-3 border-black text-black text-xl cursor-pointer transition-all hover:opacity-90 disabled:cursor-not-allowed"
        style={{ backgroundColor: buttonColor }}
        disabled={!isActive}
      >
        Buy Ticket
      </button>
    </div>
  </div>
)};

export default function Tickets() {
  const [ticketData, setTicketData] = useState([]);

  const fetchTickets = async () => {
    try {
      const ticketCollection = collection(db, "devfest-tickets");
      const ticketSnapshot = await getDocs(ticketCollection);
      const ticketList = ticketSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // sort: active tickets first (ascending price), then inactive (ascending price)
      const active = ticketList.filter(t => t.isActive).sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      const inactive = ticketList.filter(t => !t.isActive).sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      setTicketData([...active, ...inactive]);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <section className="relative bg-dark py-20 px-0 overflow-hidden w-full">
      {/* full-bleed section — inner wrapper keeps content centered */}
      <div className="w-full">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-3">
            Grab your Tickets
          </h2>
          <p className="text-[#888] text-lg">A Stacked Day, Dont miss out.</p>
        </div>

        {/* Tickets Grid - no blur */}
        <div className="relative">
          <div className="w-full max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8 justify-items-center">
              {ticketData.map((ticket, index) => (
                <div key={index} className="flex justify-center w-full">
                  <TicketCard {...ticket} />
                </div>
              ))}
            </div>
          </div>

          {/* overlay removed */}
        </div>
      </div>
    </section>
  );
}
