import React from 'react';
import { useNavigate } from 'react-router-dom';

const MessCard = ({ mess }) => {
    const navigate = useNavigate();

    /* ---------- SAFE TIME FALLBACK ---------- */
    const lunchTime = mess?.lunchTime || "12:30 PM - 2:30 PM";
    const dinnerTime = mess?.dinnerTime || "7:30 PM - 9:30 PM";

    return (
        <div 
            onClick={() => navigate('/mess-panel')}
            className="bg-white 
            p-5 sm:p-6 md:p-8 
            rounded-[2rem] sm:rounded-[2.5rem] 
            shadow-soft hover:-translate-y-1 
            transition-all duration-500 
            border border-orange-50 
            flex flex-col 
            min-h-[260px] sm:min-h-fit md:h-80 
            group cursor-pointer relative overflow-hidden 
            md:col-span-2"
        >

            {/* Rotating Background Food Icon */}
            <div className="absolute 
            -right-6 sm:-right-10 
            -bottom-6 sm:-bottom-10 
            opacity-[0.03] group-hover:opacity-[0.08] 
            transition-opacity duration-500 pointer-events-none">
                
                <span className="material-symbols-outlined 
                text-[120px] sm:text-[150px] md:text-[200px] 
                animate-[spin_40s_linear_infinite]">
                    restaurant
                </span>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row 
            sm:justify-between sm:items-start 
            gap-4 mb-5 sm:mb-6 relative z-10">

                <div className="flex items-center gap-3 sm:gap-4">
                    
                    <div className="p-2.5 sm:p-3 md:p-4 
                    bg-orange-500 text-white 
                    rounded-xl sm:rounded-2xl 
                    shadow-glow animate-bounce-slow">
                        
                        <span className="material-symbols-outlined 
                        text-xl sm:text-2xl md:text-3xl">
                            flatware
                        </span>
                    </div>

                    <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl 
                        font-black text-slate-800 tracking-tight leading-none">
                            Today's Feast
                        </h3>

                        <p className="text-[9px] sm:text-[10px] md:text-xs 
                        font-bold text-orange-500 uppercase tracking-widest 
                        mt-2 flex items-center gap-2">
                            
                            <span className="flex size-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                            Mess Live
                        </p>
                    </div>
                </div>

                <div className="hidden md:block 
                px-4 md:px-5 py-2 
                rounded-full bg-orange-50 text-orange-600 
                text-[9px] md:text-[10px] 
                font-black uppercase tracking-wider 
                border border-orange-100 
                hover:bg-orange-600 hover:text-white 
                transition-all duration-300">
                    Weekly Menu
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 grid 
            grid-cols-1 sm:grid-cols-2 
            gap-4 sm:gap-5 relative z-10">
                
                {/* Lunch Section */}
                <div className="bg-gradient-to-br from-[#FFF9F5] to-white 
                rounded-[1.5rem] sm:rounded-[2rem] 
                p-4 sm:p-5 
                border border-orange-100 
                relative group/item overflow-hidden 
                shadow-sm hover:shadow-orange-100 
                transition-all flex flex-col justify-between">

                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 
                    flex items-center gap-1.5">
                        
                        <p className="text-[7px] sm:text-[8px] 
                        font-black text-orange-500 uppercase">
                            Current
                        </p>

                        <span className="relative flex size-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full size-2 bg-orange-500"></span>
                        </span>
                    </div>
                    
                    <div>
                        <p className="text-[8px] sm:text-[9px] md:text-[10px] 
                        font-black text-slate-400 uppercase tracking-widest mb-2">
                            Morning / Lunch
                        </p>

                        <h4 className="text-sm sm:text-base md:text-lg 
                        font-bold text-slate-700 
                        group-hover/item:text-orange-600 
                        transition-colors capitalize leading-relaxed">
                            {mess?.lunch || "Loading Menu..."}
                        </h4>
                    </div>
                    
                    {/* Time Display */}
                    <div className="mt-4 flex items-center gap-2 
                    text-[9px] sm:text-[10px] font-bold text-slate-400">
                        
                        <span className="material-symbols-outlined text-xs sm:text-sm text-orange-400">
                            schedule
                        </span>

                        {lunchTime}
                    </div>
                </div>

                {/* Dinner Section */}
                <div className="bg-white 
                rounded-[1.5rem] sm:rounded-[2rem] 
                p-4 sm:p-5 
                border border-slate-100 
                relative group/item 
                hover:border-orange-200 
                transition-all shadow-sm 
                flex flex-col justify-between">

                    <div>
                        <p className="text-[8px] sm:text-[9px] md:text-[10px] 
                        font-black text-slate-400 uppercase tracking-widest mb-2">
                            Evening / Dinner
                        </p>

                        <h4 className="text-sm sm:text-base md:text-lg 
                        font-bold text-slate-700 
                        group-hover/item:text-orange-600 
                        transition-colors capitalize leading-relaxed">
                            {mess?.dinner || "Menu Standing By..."}
                        </h4>
                    </div>
                    
                    {/* Time Display */}
                    <div className="mt-4 flex items-center gap-2 
                    text-[9px] sm:text-[10px] font-bold text-slate-400">
                        
                        <span className="material-symbols-outlined text-xs sm:text-sm text-orange-400">
                            schedule
                        </span>

                        {dinnerTime}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessCard;
