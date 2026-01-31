import React from 'react';
import { useNavigate } from 'react-router-dom';

const AttendanceCard = ({ attendance }) => {
    const navigate = useNavigate();
    const percentage = parseFloat(attendance?.percentage) || 0;
    const isOnTrack = percentage >= 75;

    return (
        <div 
            onClick={() => navigate('/attendance-analytics')}
            className="relative group bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-soft hover:-translate-y-2 transition-all duration-500 border border-orange-50 flex flex-col min-h-[320px] h-full overflow-hidden cursor-pointer"
        >
            {/* Responsive Rotating Background Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-48 sm:size-64 border-[12px] sm:border-[16px] border-dashed border-orange-100/40 rounded-full animate-[spin_20s_linear_infinite] group-hover:border-orange-200/60 transition-colors pointer-events-none"></div>
            
            {/* Floating Decorative Particle */}
            <div className="absolute top-6 right-6 sm:top-10 sm:right-10 text-xl animate-ping opacity-30">✨</div>

            {/* Top Section: Icon & Status Badge */}
            <div className="flex justify-between items-start z-10">
                <div className="p-3.5 sm:p-4 bg-orange-50 rounded-2xl text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm">
                    <span className="material-symbols-outlined text-2xl sm:text-3xl font-bold">analytics</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 sm:px-4 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-tighter shadow-sm border transition-colors duration-500 ${
                        isOnTrack 
                        ? 'bg-orange-500 text-white border-orange-400' 
                        : 'bg-white text-red-500 border-red-100'
                    }`}>
                        {attendance?.status || "Regular"}
                    </span>
                </div>
            </div>

            {/* Main Percentage Circle Area */}
            <div className="flex-1 flex flex-col items-center justify-center z-10 relative my-4">
                <div className="relative flex items-center justify-center">
                    {/* Pulsing Glow behind the number */}
                    <div className="absolute inset-0 bg-orange-200 rounded-full blur-2xl opacity-20 group-hover:opacity-40 animate-pulse"></div>
                    
                    <div className="flex flex-col items-center relative">
                        <span className="text-5xl sm:text-6xl font-[950] text-slate-800 tracking-tighter italic">
                            {percentage}
                            <span className="text-xl sm:text-2xl text-orange-500 not-italic ml-0.5">%</span>
                        </span>
                        
                        {/* Status Chip with movement */}
                        <div className="flex items-center gap-1.5 mt-2 bg-slate-900 px-3 py-1 rounded-full shadow-lg transform group-hover:scale-105 transition-transform">
                            <span className={`size-1.5 sm:size-2 rounded-full animate-pulse ${isOnTrack ? 'bg-orange-400' : 'bg-red-400'}`}></span>
                            <span className="text-[8px] sm:text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap">
                                {isOnTrack ? 'On Track' : 'Low Attendance'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Performance Footer */}
            <div className="mt-auto pt-4 border-t border-orange-50/50 z-10 flex justify-between items-center">
                <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Sem Performance</p>
                <div className="flex items-center gap-1 text-orange-400">
                    <span className="text-[10px] font-black group-hover:mr-1 transition-all">VIEW</span>
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">trending_up</span>
                </div>
            </div>
        </div>
    );
};

export default AttendanceCard;