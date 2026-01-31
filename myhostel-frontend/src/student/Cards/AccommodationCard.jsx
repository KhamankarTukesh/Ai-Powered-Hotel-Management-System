import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccommodationCard = ({ profile }) => {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => navigate('/room-details')}
            className="relative group bg-gradient-to-br from-[#FFF9F5] to-white p-6 sm:p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(255,145,77,0.1)] hover:shadow-[0_20px_60px_rgba(255,145,77,0.2)] transition-all duration-500 border border-orange-100/50 flex flex-col justify-between min-h-[320px] h-full overflow-hidden cursor-pointer active:scale-95"
        >
            {/* Floating Elements - Hidden on very small screens for cleanliness */}
            <div className="absolute -right-2 -top-2 text-5xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-bounce-slow hidden sm:block">
                🏠
            </div>
            <div className="absolute right-10 top-20 text-2xl opacity-10 animate-pulse hidden sm:block">
                ✨
            </div>

            {/* Background Glow */}
            <div className="absolute -bottom-10 -left-10 size-32 bg-orange-200/20 rounded-full blur-3xl group-hover:bg-orange-300/30 transition-all duration-700"></div>

            {/* Top Row: Icon & Block Info */}
            <div className="flex justify-between items-start relative z-10">
                <div className="p-3.5 sm:p-4 bg-orange-100 rounded-2xl text-orange-600 group-hover:bg-orange-500 group-hover:text-white group-hover:rotate-12 transition-all duration-300 shadow-sm">
                    <span className="material-symbols-outlined text-2xl sm:text-3xl">home_pin</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-white/80 backdrop-blur-sm text-orange-600 text-[9px] sm:text-[10px] font-black rounded-full uppercase tracking-widest border border-orange-100 shadow-sm mb-1">
                        {profile?.block || "Block A"}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 italic">Floor: {profile?.floor || 1}</span>
                </div>
            </div>

            {/* Middle Row: Room Number */}
            <div className="relative z-10 mt-6 sm:mt-4">
                <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-1">Current Sanctuary</p>
                <h3 className="text-3xl sm:text-4xl font-[1000] text-slate-800 tracking-tight flex items-baseline gap-2">
                    Room <span className="text-orange-500">{profile?.roomNumber || "N/A"}</span>
                </h3>
            </div>

            {/* Bottom Row: Roommates Section */}
            <div className="flex items-center justify-between mt-6 bg-white/50 backdrop-blur-sm p-3 rounded-2xl border border-orange-50 relative z-10">
                <div className="flex -space-x-3">
                    {[1, 2].map((i) => (
                        <img 
                            key={i}
                            className="size-8 sm:size-10 rounded-full border-2 border-white object-cover ring-2 ring-orange-50 transition-transform group-hover:translate-x-1" 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i === 1 ? 'Felix' : 'Aneka'}`} 
                            alt="roommate" 
                        />
                    ))}
                    <div className="size-8 sm:size-10 flex items-center justify-center rounded-full border-2 border-white bg-orange-500 text-[10px] font-bold text-white shadow-lg ring-2 ring-orange-50 animate-pulse">
                        +1
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Status</p>
                    <p className="text-xs sm:text-sm font-black text-slate-700">Co-Living</p>
                </div>
            </div>
        </div>
    );
};

export default AccommodationCard;