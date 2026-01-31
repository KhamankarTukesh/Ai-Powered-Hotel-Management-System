import React from 'react';
import { useNavigate } from 'react-router-dom';

const MessCard = ({ mess }) => {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => navigate('/mess-panel')}
            className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-soft hover:-translate-y-1 transition-all duration-500 border border-orange-50 flex flex-col min-h-fit md:h-80 group cursor-pointer relative overflow-hidden md:col-span-2"
        >
            {/* Rotating Background Food Icon */}
            <div className="absolute -right-10 -bottom-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none">
                <span className="material-symbols-outlined text-[150px] sm:text-[200px] animate-[spin_40s_linear_infinite]">
                    restaurant
                </span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-3 sm:p-4 bg-orange-500 text-white rounded-2xl shadow-glow animate-bounce-slow">
                        <span className="material-symbols-outlined text-2xl sm:text-3xl">flatware</span>
                    </div>
                    <div>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-none">Today's Feast</h3>
                        <p className="text-[10px] sm:text-xs font-bold text-orange-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                           <span className="flex size-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                           Mess Live
                        </p>
                    </div>
                </div>
                <div className="hidden md:block px-5 py-2 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-wider border border-orange-100 hover:bg-orange-600 hover:text-white transition-all duration-300">
                    Weekly Menu
                </div>
            </div>

            {/* Content: Lunch & Dinner */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 relative z-10">
                
                {/* Lunch Section */}
                <div className="bg-gradient-to-br from-[#FFF9F5] to-white rounded-[2rem] p-5 border border-orange-100 relative group/item overflow-hidden shadow-sm hover:shadow-orange-100 transition-all flex flex-col justify-between">
                    <div className="absolute top-4 right-4 flex items-center gap-1.5">
                         <p className="text-[8px] font-black text-orange-500 uppercase">Current</p>
                         <span className="relative flex size-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full size-2 bg-orange-500"></span>
                        </span>
                    </div>
                    
                    <div>
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Morning / Lunch</p>
                        <h4 className="text-base sm:text-lg font-bold text-slate-700 group-hover/item:text-orange-600 transition-colors capitalize leading-relaxed">
                            {mess?.lunch || "Loading Menu..."}
                        </h4>
                    </div>
                    
                    {/* Animated Steam lines */}
                    <div className="mt-3 flex gap-1 opacity-40">
                        <div className="w-1 h-3 bg-orange-400 rounded-full animate-[bounce_1.5s_infinite]"></div>
                        <div className="w-1 h-5 bg-orange-500 rounded-full animate-[bounce_1s_infinite]"></div>
                        <div className="w-1 h-3 bg-orange-400 rounded-full animate-[bounce_1.2s_infinite]"></div>
                    </div>
                </div>

                {/* Dinner Section */}
                <div className="bg-white rounded-[2rem] p-5 border border-slate-100 relative group/item hover:border-orange-200 transition-all shadow-sm flex flex-col justify-between">
                    <div>
                        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Evening / Dinner</p>
                        <h4 className="text-base sm:text-lg font-bold text-slate-700 group-hover/item:text-orange-600 transition-colors capitalize leading-relaxed">
                            {mess?.dinner || "Menu Standing By..."}
                        </h4>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400">
                        <span className="material-symbols-outlined text-sm text-orange-400">schedule</span>
                        7:30 PM - 9:30 PM
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessCard;