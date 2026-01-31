import React from 'react';
import { useNavigate } from 'react-router-dom';

const NoticeCard = ({ notice }) => {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => navigate('/notices')}
            className="group relative bg-gradient-to-br from-orange-50 to-white p-5 sm:p-6 rounded-[2.5rem] border border-orange-100/50 shadow-soft hover:shadow-[0_20px_50px_rgba(255,145,77,0.15)] transition-all duration-500 cursor-pointer overflow-hidden"
        >
            {/* Animated Background Pulse */}
            <div className="absolute top-0 right-0 size-32 bg-orange-200/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>

            <div className="flex items-center gap-4 sm:gap-5 relative z-10">
                {/* Icon with Glowing Ring */}
                <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-orange-500/20 rounded-2xl blur-md group-hover:blur-xl transition-all"></div>
                    <div className="relative p-3.5 sm:p-4 bg-white rounded-2xl shadow-sm border border-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-500">
                        <span className="material-symbols-outlined text-2xl sm:text-3xl">campaign</span>
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-orange-500 text-[8px] font-black text-white uppercase rounded-md tracking-widest animate-bounce">
                            New
                        </span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {notice?.date ? new Date(notice.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : "Recently"}
                        </p>
                    </div>
                    
                    <h5 className="text-base sm:text-lg font-[1000] text-slate-800 leading-tight truncate group-hover:text-orange-600 transition-colors">
                        {notice?.title || "No new announcements today"}
                    </h5>
                    
                    <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-1 group-hover:text-slate-700 transition-colors truncate">
                        Tap to view full circular and attachments
                    </p>
                </div>

                {/* Floating Action Arrow - Hidden on very small screens to save space */}
                <div className="hidden xs:flex size-10 rounded-full bg-white border border-orange-50 items-center justify-center text-orange-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-sm flex-shrink-0">
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                </div>
            </div>

            {/* Luxury Progress Line */}
            <div className="absolute bottom-0 left-0 h-[3px] bg-orange-500 w-0 group-hover:w-full transition-all duration-700"></div>
        </div>
    );
};

export default NoticeCard;