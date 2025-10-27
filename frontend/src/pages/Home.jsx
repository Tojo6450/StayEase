import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext"; // Ensure path is correct

function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: "🏡",
      title: "Effortless Hosting",
      text: "List your space quickly and manage bookings, guests, and messages in one place. Make your property shine with stunning photos and smooth communication tools.",
      iconColor: "text-blue-600", // Slightly darker icon color
    },
    {
      icon: "🌟",
      title: "Discover & Review",
      text: "Browse curated listings, read verified guest reviews, and share your experiences. Help others discover amazing stays while planning your next getaway with confidence.",
      iconColor: "text-purple-600", // Slightly darker icon color
    },
    {
      icon: "🛒",
      title: "Smart Booking System",
      text: "Easily compare listings, manage your cart, and organize your next trip. A clean booking experience — with secure payments and instant confirmations coming soon.",
      iconColor: "text-pink-600", // Slightly darker icon color
    },
  ];

  return (
    <>
      {/* --- Background --- */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-indigo-100 via-blue-50 to-indigo-100">
        <div className="absolute top-0 left-0 w-[28rem] h-[28rem] bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob"></div>
        <div className="absolute top-20 right-10 w-[24rem] h-[24rem] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-[26rem] h-[26rem] bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>
      </div>

      {/* --- Hero Section --- */}
      <section className="relative flex items-start justify-center px-6 pt-10 pb-16 sm:pt-12 sm:pb-20 md:pt-14 md:pb-24 text-center">
        <div className="w-full max-w-5xl mx-auto">
          {/* Icon */}
          <div className="mb-6 inline-block animate-bounce-slow">
            <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl">
              <i className="fas fa-home text-white text-4xl sm:text-5xl"></i>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-4 leading-tight">
            Discover Your{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Perfect Stay
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-gray-700 mb-10 mx-auto max-w-2xl leading-relaxed font-light">
            Find beautiful homes, cozy apartments, and unique stays around the
            world. Whether you're exploring new cities or hosting guests,
            <span className="font-semibold text-indigo-600"> StayEase </span>
            helps you do it all effortlessly.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              to="/listings"
              className="px-10 py-3 rounded-full bg-indigo-600 text-white font-semibold text-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 no-underline"
            >
              Explore Listings
            </Link>

            {!user && (
              <Link
                to="/signup"
                className="px-10 py-3 rounded-full border-2 border-indigo-600 text-indigo-600 bg-white font-semibold text-lg hover:bg-indigo-50 hover:border-indigo-700 hover:text-indigo-700 transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 no-underline"
              >
                Join Now
              </Link>
            )}
          </div>

          {/* --- Feature Cards --- */}
          <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2 sm:px-4 ">
            {features.map((feature, i) => (
              <div
                key={i}
                // Subtle blue/indigo tint + blur
                className="group p-8 rounded-2xl bg-indigo-50/60 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`text-5xl mb-4 ${feature.iconColor} group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                {/* Dark text for good contrast on light background */}
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                {/* Slightly darker gray for readability */}
                <p className="text-gray-700 leading-relaxed text-base">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Animations --- */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 8s infinite ease-in-out; }
        .animation-delay-2000 { animation-delay: -2s; }
        .animation-delay-4000 { animation-delay: -4s; }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-3%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
          50% { transform: none; animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
        }
        .animate-bounce-slow { animation: bounce-slow 2.5s infinite; }

        /* Fallback for backdrop-filter */
        @supports not (backdrop-filter: blur(1rem)) {
          .backdrop-blur-lg { background-color: rgba(239, 246, 255, 0.9); } /* Fallback to light indigo */
        }
        /* Ensure links don't get underlines even on hover/focus if not desired */
        a.no-underline:hover, a.no-underline:focus {
          text-decoration: none;
        }
      `}</style>
    </>
  );
}

export default Home;