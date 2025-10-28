"use client";

const TicketCard = ({ title, price, features, buttonColor, buttonText }) => (
  <div className="relative bg-[#FBFBFB] rounded-xl p-6 w-full max-w-[360px] min-h-[320px] border border-[#F0F0F0] shadow-lg">
    {/* Title */}
    <h3 className="text-[#0B0B0B] text-lg font-semibold mb-4">{title}</h3>

    {/* Features */}
    <div className="space-y-2 mb-6">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start gap-2 text-[#666]">
          <span className="text-xs text-green-500">✓</span>
          <span className="text-xs">{feature}</span>
        </div>
      ))}
    </div>

    {/* Price */}
    <div className="mb-4 mt-auto">
      <span className="text-[#0B0B0B] text-2xl font-bold">{price}</span>
    </div>

    {/* Button */}
    <button
      className="w-full py-2.5 rounded-lg font-semibold text-white text-sm"
      style={{ backgroundColor: buttonColor }}
    >
      {buttonText}
    </button>
  </div>
);

export default function Tickets() {
  const tickets = [
    {
      title: "Community Pass",
      price: "₹XXX",
      features: ["Access to all sessions", "Lunch included", "Swag kit", "Networking"],
      buttonColor: "#34A853",
      buttonText: "Register Now"
    },
    {
      title: "Early Bird",
      price: "₹XXX",
      features: ["Access to all sessions", "Lunch included", "Swag kit", "Networking"],
      buttonColor: "#FBBC04",
      buttonText: "Register Now"
    },
    {
      title: "Regular Pass",
      price: "₹XXX",
      features: ["Access to all sessions", "Lunch included", "Swag kit", "Networking"],
      buttonColor: "#EA4335",
      buttonText: "Register Now"
    },
    {
      title: "Student Pass",
      price: "₹XXX",
      features: ["Access to all sessions", "Lunch included", "Swag kit", "Networking"],
      buttonColor: "#4285F4",
      buttonText: "Register Now"
    },
    {
      title: "VIP Pass",
      price: "₹XXXX",
      features: ["Access to all sessions", "Lunch included", "Swag kit", "Networking"],
      buttonColor: "#EA4335",
      buttonText: "Register Now"
    },
    {
      title: "Group Pass",
      price: "₹XXXX",
      features: ["Access to all sessions", "Lunch included", "Swag kit", "Networking"],
      buttonColor: "#34A853",
      buttonText: "Register Now"
    }
  ];

  return (
    <section className="relative bg-[#0A0A0A] py-20 px-0 overflow-hidden w-full">
      {/* full-bleed section — inner wrapper keeps content centered */}
      <div className="w-full">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-3">
            Grab your Tickets
          </h2>
          <p className="text-[#888] text-lg">
            A Stacked Day, Dont miss out.
          </p>
        </div>

        {/* Tickets Grid - Blurred */}
        <div className="relative">
          <div className="w-full max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8 blur-md opacity-60 justify-items-center">
              {tickets.map((ticket, index) => (
                <div key={index} className="flex justify-center w-full">
                  <TicketCard {...ticket} />
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-[#2C2C2C] rounded-[32px] px-12 py-10 max-w-md shadow-2xl">
              {/* Clock Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-[#404040] rounded-[20px] p-5 inline-block">
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 56 56"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <path
                      d="M28 14V28L38 38"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Coming Soon Text */}
              <h3 className="text-white text-4xl font-bold text-center mb-4">
                Coming soon
              </h3>

              {/* Description */}
              <p className="text-[#AAAAAA] text-center text-base leading-relaxed">
                We&apos;re crafting an amazing agenda for you.
                <br />
                Stay tuned for updates!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
