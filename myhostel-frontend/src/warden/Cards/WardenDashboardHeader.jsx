import React from 'react';
import { useNavigate } from 'react-router-dom';

const WardenDashboardHeader = ({ profileStats }) => {
    const navigate = useNavigate();

    // 1. Local Storage fallback (Jab tak API load ho rahi hai)
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

    // 2. Logic: Pehle API ka data dekho, fir local storage ka, fir "Warden" likho
    const displayName = `${(profileStats?.name || savedUser.name || "User").split(' ')[0]} Warden`;
    const displayRole = profileStats?.role || savedUser.role || "Warden";

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="w-full mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 relative">
            <div className="relative group max-w-full md:max-w-2xl">
                <div className="relative z-10">
                    <h1 
                        className="text-4xl sm:text-5xl md:text-7xl font-[1000] text-slate-800 tracking-tighter leading-[1.1] cursor-pointer"
                        onClick={() => navigate('/student/profile')}
                    >
                        <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent italic">
                            {getGreeting()},
                        </span>
                        <br />
                        <span className="hover:text-orange-600 transition-all duration-500 block mt-2 drop-shadow-sm truncate">
                            {displayName} ✨
                        </span>
                    </h1>
                    
                    <div className="flex items-center gap-4 mt-6 md:mt-8">
                        <div className="h-[3px] w-14 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"></div>
                        <p className="text-slate-500 text-sm md:text-xl font-medium italic tracking-tight leading-none">
                            Hostel Command Center <span className="text-orange-600 font-bold underline decoration-orange-200 decoration-4 underline-offset-4">Dashboard.</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Status Badge (Responsive) */}
            <div className="flex items-center self-start md:self-end gap-5 bg-white/60 backdrop-blur-2xl border border-white/80 p-4 md:p-5 rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(255,145,77,0.15)] hover:shadow-orange-200/50 transition-all duration-500 group/status cursor-default">
                <div className="relative">
                    <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-10"></div>
                    <div className="bg-slate-900 text-orange-400 group-hover/status:bg-orange-600 group-hover/status:text-white size-12 md:size-14 rounded-[1.2rem] md:rounded-[1.5rem] flex items-center justify-center transition-all duration-700 shadow-2xl rotate-3 group-hover/status:rotate-0">
                        <span className="material-symbols-outlined text-2xl md:text-3xl">shield_person</span>
                    </div>
                </div>
                
                <div className="pr-4 md:pr-6">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] leading-none mb-2">Authenticated Role</p>
                    <div className="flex items-center gap-2.5">
                        <div className="size-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
                        <p className="text-sm md:text-lg font-black text-slate-800 tracking-tight capitalize">
                            {displayRole}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Decorative Line */}
            <div className="absolute -bottom-8 left-0 w-full h-[1px] bg-gradient-to-r from-orange-200 via-transparent to-transparent opacity-50"></div>
        </div>
    );
};

export default WardenDashboardHeader;