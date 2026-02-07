import React from 'react';
import { PlaneTakeoff, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const LeaveApprovalCard = ({ leaveStats, onClick }) => {
  // Destructuring exactly from your backend: leaveStats: { pendingCount: 0, onLeaveToday: 0 }
  const { pendingCount = 0, onLeaveToday = 0 } = leaveStats || {};

  return (
    <button 
      onClick={onClick}
      className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-orange-50 flex flex-col justify-between group hover:shadow-2xl transition-all duration-500 relative overflow-hidden text-left h-full w-full"
    >
      {/* AI Insight Glow Effect - Light Orange Background Decoration */}
      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-orange-100/40 rounded-full blur-3xl group-hover:bg-orange-200/40 transition-all"></div>

      {/* Plane Icon Animation - Moving and Glowing */}
      <div className="absolute -right-6 -top-6 p-12 bg-orange-50 rounded-full group-hover:bg-orange-100 transition-colors duration-500">
        <motion.div
          animate={{ 
            x: [0, 5, 0], 
            y: [0, -5, 0] 
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <PlaneTakeoff 
            size={60} 
            className="text-orange-200 group-hover:text-orange-400 group-hover:drop-shadow-[0_0_15px_rgba(251,146,60,0.5)] transition-all rotate-12" 
          />
        </motion.div>
      </div>

      <div className="relative z-10">
        <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl w-fit mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
          <Clock size={28} />
        </div>
        
        <div className="flex items-center gap-2 mb-1">
          <p className="text-orange-500 font-bold uppercase tracking-[0.2em] text-[10px]">Student Mobility</p>
          <Sparkles size={10} className="text-orange-300 animate-pulse" />
        </div>

        <h3 className="text-3xl font-[1000] text-slate-900 italic uppercase tracking-tighter leading-tight">
          Leave <br /> Requests
        </h3>
        
        <div className="mt-4 flex items-baseline gap-4">
          <p className="text-5xl font-black text-slate-900 tracking-tighter italic">
            {pendingCount}
            <span className="text-xs font-black text-slate-300 uppercase tracking-widest ml-2 not-italic">
              Pending
            </span>
          </p>
          
          <div className="h-8 w-[1px] bg-slate-100"></div>
          
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Today</span>
            <span className="text-lg font-black text-orange-500 italic">{onLeaveToday}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between relative z-10">
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-orange-600 transition-colors">
            Process Outpasses
         </span>
         <div className="p-3 bg-slate-900 text-white rounded-xl group-hover:bg-[#ff6b00] group-hover:scale-110 transition-all shadow-lg">
            <PlaneTakeoff size={18} />
         </div>
      </div>
    </button>
  );
};

export default LeaveApprovalCard;