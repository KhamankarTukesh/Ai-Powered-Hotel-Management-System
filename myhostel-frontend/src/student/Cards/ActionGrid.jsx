import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActionGrid = ({ summary }) => {
    const navigate = useNavigate();

    return (
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 
        gap-4 sm:gap-5 md:gap-6 
        min-h-[260px] sm:min-h-[300px] md:min-h-[320px] lg:h-80">
            
            {/* Leave Card */}
            <div 
                onClick={() => navigate('/leave-management')} 
                className="group relative bg-white 
                p-5 sm:p-6 md:p-7 
                rounded-[2rem] sm:rounded-[2.5rem] 
                shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] 
                hover:-translate-y-3 sm:hover:-translate-y-4 
                hover:shadow-[0_30px_70px_-15px_rgba(255,145,77,0.25)] 
                transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
                cursor-pointer overflow-hidden 
                flex flex-col justify-between h-full 
                border border-orange-50/50"
            >
                {/* Floating Blobs */}
                <div className="absolute -top-8 sm:-top-10 -right-8 sm:-right-10 
                size-32 sm:size-40 
                bg-orange-100/40 rounded-full blur-[50px] sm:blur-[60px] 
                group-hover:bg-orange-400/20 
                group-hover:-translate-y-4 group-hover:translate-x-4 
                transition-all duration-700 pointer-events-none"></div>

                <div className="absolute -bottom-8 sm:-bottom-10 -left-8 sm:-left-10 
                size-24 sm:size-32 
                bg-orange-50/50 rounded-full blur-[40px] sm:blur-[50px] 
                group-hover:bg-orange-300/30 
                group-hover:translate-y-4 group-hover:-translate-x-4 
                transition-all duration-700 pointer-events-none"></div>

                <div className="relative z-10">
                    
                    {/* Icon */}
                    <div className="relative inline-flex 
                    group-hover:-translate-y-2 
                    transition-transform duration-500 delay-75">

                        <div className="absolute inset-0 
                        bg-orange-500/20 rounded-xl sm:rounded-2xl 
                        blur-lg group-hover:blur-2xl 
                        transition-all opacity-0 group-hover:opacity-100"></div>

                        <div className="p-3 sm:p-4 
                        bg-slate-900 rounded-xl sm:rounded-2xl 
                        inline-flex text-orange-400 
                        group-hover:text-white group-hover:bg-orange-600 
                        transition-all duration-500 shadow-xl">
                            
                            <span className="material-symbols-outlined 
                            text-2xl sm:text-3xl font-light 
                            group-hover:rotate-[15deg] transition-transform">
                                flight_takeoff
                            </span>
                        </div>
                    </div>
                    
                    {/* Text */}
                    <div className="mt-5 sm:mt-6 
                    group-hover:translate-x-1 transition-transform duration-500">
                        
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-5 sm:w-6 h-[1.5px] bg-orange-500 rounded-full group-hover:w-10 transition-all"></span>
                            <p className="text-[9px] sm:text-[10px] 
                            font-[900] text-slate-400 uppercase tracking-[0.2em]">
                                Registry
                            </p>
                        </div>

                        <h4 className="text-xl sm:text-2xl 
                        font-[1000] text-slate-800 leading-none tracking-tight">
                            Leave <br/> <span className="text-orange-500">Request</span>
                        </h4>
                    </div>
                </div>

                {/* Bottom */}
                <div className="relative z-10 flex items-end justify-between mt-4">
                    
                    <div className="space-y-2 
                    group-hover:-translate-y-1 transition-transform duration-500 delay-100">
                        
                        <p className="text-[8px] sm:text-[9px] 
                        font-bold text-slate-400 uppercase tracking-tighter">
                            Current Status
                        </p>

                        <div className={`px-3 sm:px-4 py-1.5 sm:py-2 
                        rounded-xl text-[9px] sm:text-[10px] 
                        font-black uppercase tracking-wider 
                        backdrop-blur-md shadow-sm flex items-center gap-2 border transition-colors ${
                            summary?.leave?.status === 'Approved' 
                            ? 'bg-orange-500/10 text-orange-600 border-orange-200/50' 
                            : 'bg-slate-900 text-white border-slate-700'
                        }`}>
                            <span className={`size-1.5 rounded-full animate-pulse ${
                                summary?.leave?.status === 'Approved' 
                                ? 'bg-orange-500' 
                                : 'bg-red-400'
                            }`}></span>
                            {summary?.leave?.status || "In Review"}
                        </div>
                    </div>
                    
                    <div className="size-10 sm:size-12 
                    rounded-full border border-orange-100 
                    flex items-center justify-center text-orange-500 
                    group-hover:bg-slate-900 group-hover:text-white 
                    group-hover:border-slate-900 
                    group-hover:scale-110 group-hover:-rotate-45 
                    transition-all duration-500 shadow-lg">
                        
                        <span className="material-symbols-outlined 
                        text-lg sm:text-xl transition-transform">
                            arrow_forward
                        </span>
                    </div>
                </div>
            </div>

            {/* Complaint Card */}
            <div 
                onClick={() => navigate('/complaints')} 
                className="group relative bg-[#0f172a] 
                p-5 sm:p-6 md:p-7 
                rounded-[2rem] sm:rounded-[2.5rem] 
                shadow-2xl hover:-translate-y-2 
                transition-all duration-700 
                cursor-pointer overflow-hidden 
                flex flex-col justify-between h-full 
                border border-slate-800"
            >
                {/* Eyes Animation */}
                <div className="absolute inset-0 z-0 flex items-center justify-center opacity-0 
                group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    
                    <div className="flex gap-10 sm:gap-12 group-hover:animate-pulse">
                        <div className="w-8 sm:w-10 h-2 bg-red-600 rounded-full rotate-12 shadow-[0_0_20px_rgba(220,38,38,0.8)]"></div>
                        <div className="w-8 sm:w-10 h-2 bg-red-600 rounded-full -rotate-12 shadow-[0_0_20px_rgba(220,38,38,0.8)]"></div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-orange-900/10 to-transparent"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        
                        <div className="p-3 sm:p-4 
                        bg-orange-500/10 backdrop-blur-xl 
                        border border-orange-500/20 
                        rounded-xl sm:rounded-2xl inline-flex 
                        text-orange-500 group-hover:text-red-500 
                        group-hover:bg-red-500/10 
                        transition-all duration-500 shadow-lg">
                            
                            <span className="material-symbols-outlined 
                            text-2xl sm:text-3xl font-light">
                                emergency_home
                            </span>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                            <span className="px-2 sm:px-3 py-1 
                            bg-red-500/10 border border-red-500/20 
                            rounded-full text-[7px] sm:text-[8px] 
                            font-black text-red-500 uppercase tracking-widest">
                                Priority
                            </span>
                        </div>
                    </div>
                    
                    <div className="mt-5 sm:mt-6">
                        <p className="text-[9px] sm:text-[10px] 
                        font-black text-slate-500 uppercase tracking-[0.3em] mb-1">
                            Issue Tracker
                        </p>

                        <h4 className="text-xl sm:text-2xl 
                        font-[1000] text-white leading-none tracking-tight">
                            Help & <br/> 
                            <span className="text-orange-400 group-hover:text-red-500 transition-colors">
                                Concierge
                            </span>
                        </h4>
                    </div>
                </div>

                <div className="relative z-10 flex items-center justify-between mt-6 sm:mt-8">
                    
                    <div className="flex flex-col gap-1">
                        <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                            Status
                        </p>

                        <span className="px-3 sm:px-4 py-1.5 sm:py-2 
                        rounded-xl bg-slate-800 text-orange-400 
                        text-[9px] sm:text-[10px] font-black uppercase tracking-widest 
                        border border-slate-700 group-hover:border-red-500/50 transition-all">
                            {summary?.complaint?.status || "Standing By"}
                        </span>
                    </div>

                    <div className="size-10 sm:size-12 
                    rounded-full bg-orange-500 text-white 
                    flex items-center justify-center 
                    group-hover:bg-red-600 transition-all duration-500 
                    shadow-[0_0_20px_rgba(249,115,22,0.4)] 
                    group-hover:shadow-[0_0_25px_rgba(220,38,38,0.6)]">
                        
                        <span className="material-symbols-outlined 
                        text-lg sm:text-xl font-bold group-hover:animate-bounce">
                            priority_high
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionGrid;
