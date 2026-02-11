import React from 'react';
import { useNavigate } from 'react-router-dom';

const GatePassCard = ({ gatepass }) => {
    const navigate = useNavigate();
    const isInCampus = gatepass?.status === 'In Campus';

    return (
        <div 
            onClick={() => navigate('/gate-pass-manager')}
            className="relative group bg-white 
            p-5 sm:p-6 md:p-8 
            rounded-[2rem] sm:rounded-[2.5rem] 
            shadow-soft hover:-translate-y-1 sm:hover:-translate-y-2 
            transition-all duration-500 
            border border-orange-50 
            flex flex-col justify-between 
            min-h-[280px] sm:min-h-[320px] 
            h-full overflow-hidden cursor-pointer"
        >

            {/* Scanning Line Effect */}
            <div className="absolute top-0 left-0 w-full h-[3px] 
            bg-gradient-to-r from-transparent via-orange-400 to-transparent 
            animate-[scan_3s_ease-in-out_infinite] 
            opacity-60 z-20 pointer-events-none"></div>
            
            {/* Decorative Background Icon */}
            <div className="absolute -right-4 sm:-right-6 -bottom-4 sm:-bottom-6 
            opacity-[0.05] group-hover:rotate-12 group-hover:scale-110 
            transition-all duration-700 pointer-events-none">
                <span className="material-symbols-outlined text-[120px] sm:text-[150px] md:text-[180px]">
                    qr_code_2
                </span>
            </div>

            {/* Top Section */}
            <div className="flex justify-between items-start relative z-10">

                {/* Icon */}
                <div className="p-3 sm:p-3.5 md:p-4 
                bg-orange-50 text-orange-600 rounded-xl sm:rounded-2xl 
                group-hover:bg-orange-500 group-hover:text-white 
                transition-all duration-300 shadow-sm">
                    <span className="material-symbols-outlined text-xl sm:text-2xl md:text-3xl">
                        sensor_occupied
                    </span>
                </div>
                
                {/* Status Badge */}
                <div className={`flex items-center gap-2 
                px-2.5 sm:px-3 md:px-4 
                py-1 sm:py-1.5 
                rounded-full border 
                text-[8px] sm:text-[9px] md:text-[10px] 
                font-black uppercase tracking-widest 
                transition-all duration-500 ${
                    isInCampus 
                    ? 'bg-orange-50 text-orange-600 border-orange-100' 
                    : 'bg-slate-900 text-white border-slate-800'
                }`}>
                    
                    <span className={`size-1 sm:size-1.5 rounded-full 
                    ${isInCampus ? 'bg-orange-500 animate-pulse' : 'bg-red-400'}`}></span>
                    
                    {gatepass?.status || "In Campus"}
                </div>
            </div>

            {/* Middle Section */}
            <div className="relative z-10 my-4 sm:my-5">
                
                <p className="text-[9px] sm:text-[10px] font-[900] 
                text-slate-400 uppercase tracking-[0.2em] mb-1">
                    Security Clearance
                </p>

                <h4 className="text-2xl sm:text-3xl md:text-4xl 
                font-[1000] text-slate-800 tracking-tight">
                    Gate Pass
                </h4>

                <div className="mt-2 h-1.5 w-10 sm:w-12 
                bg-orange-500 rounded-full 
                group-hover:w-20 sm:group-hover:w-24 
                transition-all duration-500 
                shadow-[0_0_10px_rgba(249,115,22,0.4)]"></div>
            </div>

            {/* Bottom Button */}
            <button className="w-full py-3 sm:py-4 
            rounded-xl sm:rounded-2xl 
            bg-slate-50 text-slate-700 
            text-[9px] sm:text-xs 
            font-[900] uppercase tracking-[0.1em] 
            hover:bg-orange-500 hover:text-white 
            transition-all duration-300 
            border border-slate-100 
            flex items-center justify-center gap-2 
            shadow-sm relative z-10 
            group/btn overflow-hidden active:scale-95">

                Apply for Pass

                <span className="material-symbols-outlined text-sm sm:text-base 
                group-hover/btn:translate-x-1 transition-transform">
                    nest_remote_comfort_sensor
                </span>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-white/10 
                opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
            </button>
        </div>
    );
};

export default GatePassCard;
