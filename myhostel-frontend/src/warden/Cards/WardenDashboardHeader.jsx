import React from "react";
import { useNavigate } from "react-router-dom";

const WardenDashboardHeader = ({ profileStats = {} }) => {
  const navigate = useNavigate();

  /* ---------- Safe Local Storage ---------- */
  let savedUser = {};
  try {
    savedUser = JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    savedUser = {};
  }

  /* ---------- Display Data Logic ---------- */
  const firstName = (
    profileStats?.name ||
    savedUser?.name ||
    "User"
  ).split(" ")[0];

  const displayName = `${firstName} Warden`;
  const displayRole = profileStats?.role || savedUser?.role || "Warden";

  /* ---------- Greeting ---------- */
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="w-full mb-8 sm:mb-12 lg:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8 relative">

      {/* ---------- LEFT SECTION ---------- */}
      <div className="relative group w-full lg:max-w-2xl">
        <div className="relative z-10">

          {/* Greeting + Name */}
          <h1
            onClick={() => navigate("/warden/profile")}
            className="cursor-pointer leading-tight tracking-tight"
          >
            <span
              className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
              font-extrabold bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 
              bg-clip-text text-transparent italic"
            >
              {getGreeting()},
            </span>

            <span
              className="block mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl 
              font-extrabold text-slate-800 hover:text-orange-600 transition-all duration-500 
              break-words"
            >
              {displayName} ✨
            </span>
          </h1>

          {/* Subtitle */}
          <div className="flex items-center gap-3 sm:gap-4 mt-5 sm:mt-7">
            <div className="h-[3px] w-12 sm:w-16 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" />

            <p className="text-slate-500 text-xs sm:text-sm md:text-lg font-medium italic tracking-tight">
              Hostel Command Center{" "}
              <span className="text-orange-600 font-bold underline decoration-orange-200 decoration-4 underline-offset-4">
                Dashboard.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ---------- RIGHT STATUS CARD ---------- */}
      <div
        className="flex items-center gap-4 sm:gap-5 
        bg-white/70 backdrop-blur-xl border border-white/80 
        p-4 sm:p-5 rounded-3xl shadow-lg 
        hover:shadow-orange-200/50 transition-all duration-500 
        group/status self-start lg:self-end"
      >
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-10" />

          <div
            className="bg-slate-900 text-orange-400 
            group-hover/status:bg-orange-600 
            group-hover/status:text-white 
            w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl 
            flex items-center justify-center 
            transition-all duration-700 shadow-xl rotate-3 
            group-hover/status:rotate-0"
          >
            <span className="material-symbols-outlined text-2xl sm:text-3xl">
              shield_person
            </span>
          </div>
        </div>

        {/* Role Info */}
        <div className="pr-2 sm:pr-4">
          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">
            Authenticated Role
          </p>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-md" />

            <p className="text-sm sm:text-base lg:text-lg font-extrabold text-slate-800 capitalize">
              {displayRole}
            </p>
          </div>
        </div>
      </div>

      {/* ---------- Decorative Divider ---------- */}
      <div className="absolute -bottom-6 left-0 w-full h-[1px] bg-gradient-to-r from-orange-200 via-transparent to-transparent opacity-50" />
    </div>
  );
};

export default WardenDashboardHeader;
