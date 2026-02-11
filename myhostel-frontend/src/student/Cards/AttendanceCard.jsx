import React from 'react';
import { useNavigate } from 'react-router-dom';

const AttendanceCard = ({ attendance }) => {
    const navigate = useNavigate();
    
    /* ---------- SAFE LOCAL CALCULATION (Dashboard Sync Fix) ---------- */
    const presentDays = attendance?.presentDays || 0;
    const totalDays = attendance?.totalDays || 0;

    const percentage = totalDays
        ? Number(((presentDays / totalDays) * 100).toFixed(2))
        : 0;

    /* ---------- STATUS ---------- */
    const isOnTrack = percentage >= 75;
    const isRecordedToday = attendance?.todayCheckIn?.recorded ?? false;

    return (
        <div 
            onClick={() => navigate('/attendance-analytics')}
            className="relative group bg-white 
            p-4 sm:p-6 md:p-7 lg:p-8 
            rounded-[2rem] sm:rounded-[2.5rem] 
            shadow-soft hover:-translate-y-2 
            transition-all duration-500 
            border border-orange-50 
            flex flex-col 
            min-h-[260px] sm:min-h-[300px] md:min-h-[320px] 
            h-full overflow-hidden cursor-pointer"
        >

            {/* Background Ring */}
            <div className="absolute top-1/2 left-1/2 
            -translate-x-1/2 -translate-y-1/2 
            size-36 sm:size-48 md:size-56 lg:size-64 
            border-[8px] sm:border-[12px] md:border-[14px] lg:border-[16px] 
            border-dashed border-orange-100/40 rounded-full 
            animate-[spin_20s_linear_infinite] 
            group-hover:border-orange-200/60 
            transition-colors pointer-events-none"></div>
            
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-10 md:right-10 
            text-lg sm:text-xl animate-ping opacity-30">
                ✨
            </div>

            {/* Top Section */}
            <div className="flex justify-between items-start z-10">
                
                <div className="p-2.5 sm:p-3 md:p-4 
                bg-orange-50 rounded-xl sm:rounded-2xl 
                text-orange-600 
                group-hover:bg-orange-500 group-hover:text-white 
                transition-all duration-300 shadow-sm">
                    
                    <span className="material-symbols-outlined 
                    text-xl sm:text-2xl md:text-3xl font-bold">
                        analytics
                    </span>
                </div>

                <div className="flex flex-col items-end gap-1.5 sm:gap-2">
                    
                    {/* Status Badge */}
                    <span className={`px-2 sm:px-3 py-1 
                    rounded-full 
                    text-[8px] sm:text-[9px] 
                    font-black uppercase tracking-tighter 
                    shadow-sm border ${
                        isOnTrack 
                        ? 'bg-orange-500 text-white border-orange-400' 
                        : 'bg-red-50 text-red-500 border-red-100'
                    }`}>
                        {attendance?.status || "Check Stats"}
                    </span>
                    
                    {/* Today Badge */}
                    <span className={`text-[7px] sm:text-[8px] 
                    font-bold px-2 py-0.5 rounded-md 
                    flex items-center gap-1 
                    whitespace-nowrap ${
                        isRecordedToday 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-slate-50 text-slate-400'
                    }`}>
                        <span className="size-1 rounded-full bg-current animate-pulse"></span>
                        {isRecordedToday ? 'TODAY SYNCED' : 'AWAITING WARDEN'}
                    </span>
                </div>
            </div>

            {/* Percentage Area */}
            <div className="flex-1 flex flex-col items-center justify-center 
            z-10 relative my-3 sm:my-4">
                
                <div className="relative flex items-center justify-center">
                    
                    <div className="absolute inset-0 bg-orange-200 rounded-full blur-2xl opacity-20 group-hover:opacity-40 animate-pulse"></div>
                    
                    <div className="flex flex-col items-center relative">
                        
                        <span className="text-3xl sm:text-5xl md:text-6xl 
                        font-[950] text-slate-800 
                        tracking-tighter italic">
                            
                            {percentage}
                            
                            <span className="text-sm sm:text-xl md:text-2xl 
                            text-orange-500 not-italic ml-0.5">
                                %
                            </span>
                        </span>
                        
                        {/* Present / Total */}
                        <p className="text-[8px] sm:text-[10px] 
                        font-bold text-slate-400 mt-1 text-center">
                            {presentDays} / {totalDays} DAYS PRESENT
                        </p>

                        <div className="flex items-center gap-1 sm:gap-1.5 mt-2 
                        bg-slate-900 px-2.5 sm:px-3 py-1 
                        rounded-full shadow-lg 
                        transform group-hover:scale-105 
                        transition-transform">
                            
                            <span className={`size-1 sm:size-1.5 md:size-2 
                            rounded-full animate-pulse ${
                                isOnTrack ? 'bg-orange-400' : 'bg-red-400'
                            }`}></span>
                            
                            <span className="text-[7px] sm:text-[8px] md:text-[10px] 
                            font-bold text-white uppercase 
                            tracking-widest whitespace-nowrap">
                                {isOnTrack ? 'On Track' : 'Below Target'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto pt-3 sm:pt-4 
            border-t border-orange-50/50 
            z-10 flex justify-between items-center">
                
                <p className="text-[8px] sm:text-[9px] md:text-[10px] 
                font-bold text-slate-400 uppercase 
                tracking-widest italic tracking-[0.2em]">
                    Sem Performance
                </p>

                <div className="flex items-center gap-1 text-orange-400">
                    <span className="text-[8px] sm:text-[10px] 
                    font-black group-hover:mr-1 transition-all uppercase">
                        Detailed View
                    </span>

                    <span className="material-symbols-outlined 
                    text-sm sm:text-base md:text-lg 
                    group-hover:translate-x-1 transition-transform">
                        arrow_forward_ios
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AttendanceCard;
