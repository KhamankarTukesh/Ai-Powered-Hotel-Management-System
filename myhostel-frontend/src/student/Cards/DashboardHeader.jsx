import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardHeader = ({ profile }) => {
  const navigate = useNavigate();

  const firstName = profile?.name?.split(" ")[0] || "Student";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="relative mb-8 sm:mb-12 md:mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
      
      {/* LEFT SIDE */}
      <div className="relative group max-w-2xl w-full">
        
        {/* Blur Decoration */}
        <div className="absolute -left-6 -top-6 sm:-left-10 sm:-top-10 w-24 sm:w-32 h-24 sm:h-32 bg-orange-200/40 rounded-full blur-[70px] sm:blur-[90px] group-hover:bg-orange-400/20 transition-all duration-1000"></div>

        <div className="relative z-10">
          
          {/* Greeting */}
          <h1
            onClick={() => navigate("/student/profile")}
            className="cursor-pointer text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-[900] text-slate-800 tracking-tight leading-[1.15]"
          >
            <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent italic">
              {getGreeting()},
            </span>

            <span className="block mt-2 hover:text-orange-600 transition-colors duration-300">
              {firstName} ✨
            </span>
          </h1>

          {/* Tagline */}
          <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
            <div className="hidden sm:block h-[2px] w-12 bg-orange-500 rounded-full"></div>

            <p className="text-slate-500 text-sm sm:text-base md:text-lg font-medium italic">
              Your hostel life,
              <span className="text-orange-600 font-bold"> simplified.</span>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE STATUS BADGE */}
      <div className="flex items-center justify-start lg:justify-end self-start lg:self-end gap-4 bg-white/60 backdrop-blur-xl border border-orange-100/50 p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-[2rem] shadow-[0_10px_30px_-10px_rgba(255,145,77,0.1)] hover:shadow-orange-200/40 transition-all duration-500 group/status w-fit">
        
        {/* Icon */}
        <div className="relative shrink-0">
          <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-20"></div>

          <div className="bg-slate-900 text-orange-400 group-hover/status:bg-orange-500 group-hover/status:text-white size-10 sm:size-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg">
            <span className="material-symbols-outlined text-xl sm:text-2xl group-hover/status:rotate-[360deg] transition-transform duration-700">
              bolt
            </span>
          </div>
        </div>

        {/* Status Text */}
        <div>
          <p className="text-[9px] sm:text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-1">
            System Status
          </p>

          <div className="flex items-center gap-2">
            <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>

            <p className="text-xs sm:text-sm md:text-base font-black text-slate-800 tracking-tight">
              Active Now
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Line */}
      <div className="absolute -bottom-5 left-0 w-full h-[1px] bg-gradient-to-r from-orange-100 via-transparent to-transparent"></div>
    </div>
  );
};

export default DashboardHeader;
