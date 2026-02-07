import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = ({ profile }) => {
    const navigate = useNavigate();
console.log(profile);
    // Greeting logic based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 relative">
            
            {/* Left Side: Greeting & Branding */}
            <div className="relative group max-w-2xl">
                {/* Luxury Blur Element */}
                <div className="absolute -left-10 -top-10 w-32 h-32 bg-orange-200/40 rounded-full blur-[80px] group-hover:bg-orange-400/20 transition-all duration-1000"></div>
                
                <div className="relative z-10">
                    <h1 
                        className="text-4xl sm:text-5xl md:text-7xl font-[1000] text-slate-800 tracking-tight leading-[1.1] cursor-pointer"
                        onClick={() => navigate('/student/profile')}
                    >
                        <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent italic">
                            {getGreeting()},
                        </span>
                        <br />
                        <span className="hover:text-orange-600 transition-colors duration-300 block mt-1">
                            {profile?.name?.split(' ')[0] || "Student"} ✨
                        </span>
                    </h1>
                    
                    <div className="flex items-center gap-4 mt-6">
                        <div className="h-[2px] w-12 bg-orange-500 rounded-full hidden sm:block"></div>
                        <p className="text-slate-500 text-base md:text-lg font-medium italic leading-none">
                            Your hostel life, <span className="text-orange-600 font-bold">simplified.</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side: Real-time Status Badge */}
            <div className="flex items-center self-start md:self-end gap-5 bg-white/60 backdrop-blur-xl border border-orange-100/50 p-4 md:p-5 rounded-[2rem] shadow-[0_10px_30px_-10px_rgba(255,145,77,0.1)] hover:shadow-orange-200/40 transition-all duration-500 group/status cursor-default">
                <div className="relative">
                    {/* Pulsing indicator */}
                    <div className="absolute inset-0 bg-orange-400 rounded-full animate-ping opacity-20"></div>
                    <div className="bg-slate-900 text-orange-400 group-hover/status:bg-orange-500 group-hover/status:text-white size-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg">
                        <span className="material-symbols-outlined text-2xl group-hover/status:rotate-[360deg] transition-transform duration-700">bolt</span>
                    </div>
                </div>
                
                <div className="pr-4">
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] leading-none mb-1.5">System Status</p>
                    <div className="flex items-center gap-2">
                        <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-sm md:text-base font-black text-slate-800 tracking-tight">Active Now</p>
                    </div>
                </div>
            </div>

            {/* Decorative line for separation */}
            <div className="absolute -bottom-6 left-0 w-full h-[1px] bg-gradient-to-r from-orange-100 via-transparent to-transparent"></div>
        </div>
    );
};

export default DashboardHeader;