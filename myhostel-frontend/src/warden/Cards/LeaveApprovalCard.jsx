import React from "react";
import { PlaneTakeoff, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const LeaveApprovalCard = ({ leaveStats = {}, onClick }) => {
  const { pendingCount = 0, onLeaveToday = 0 } = leaveStats;

  return (
    <button
      onClick={onClick}
      className="relative group overflow-hidden text-left w-full h-full
      bg-white rounded-[2rem] sm:rounded-[2.5rem]
      p-5 sm:p-7 lg:p-8
      border border-orange-50
      shadow-lg hover:shadow-2xl
      transition-all duration-500 active:scale-[0.98]
      flex flex-col justify-between"
    >
      {/* ---------- Glow Background ---------- */}
      <div
        className="absolute -left-12 -bottom-12 w-28 h-28 sm:w-36 sm:h-36
        bg-orange-100/40 rounded-full blur-3xl
        group-hover:bg-orange-200/40 transition-all"
      />

      {/* ---------- Plane Animation ---------- */}
      <div
        className="absolute -right-8 -top-8 sm:-right-6 sm:-top-6
        p-10 sm:p-12 bg-orange-50 rounded-full
        group-hover:bg-orange-100 transition-colors duration-500"
      >
        <motion.div
          animate={{ x: [0, 6, 0], y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <PlaneTakeoff
            size={50}
            className="sm:w-[60px] sm:h-[60px]
            text-orange-200 group-hover:text-orange-400
            group-hover:drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]
            transition-all rotate-12"
          />
        </motion.div>
      </div>

      {/* ---------- Main Content ---------- */}
      <div className="relative z-10">
        {/* Icon */}
        <div
          className="p-3 sm:p-4 bg-orange-50 text-orange-600
          rounded-xl sm:rounded-2xl w-fit mb-5 sm:mb-6
          group-hover:bg-orange-600 group-hover:text-white
          transition-all duration-300"
        >
          <Clock size={24} className="sm:w-7 sm:h-7" />
        </div>

        {/* Label */}
        <div className="flex items-center gap-2 mb-1">
          <p
            className="text-orange-500 font-bold uppercase
            tracking-[0.2em] text-[9px] sm:text-[10px]"
          >
            Student Mobility
          </p>

          <Sparkles
            size={10}
            className="text-orange-300 animate-pulse"
          />
        </div>

        {/* Title */}
        <h3
          className="text-2xl sm:text-3xl font-black text-slate-900
          italic uppercase tracking-tight leading-tight"
        >
          Leave <br /> Requests
        </h3>

        {/* Stats */}
        <div className="mt-4 flex items-end sm:items-baseline gap-4 flex-wrap">
          <p
            className="text-4xl sm:text-5xl font-black text-slate-900
            tracking-tight italic"
          >
            {pendingCount}
            <span
              className="text-[10px] sm:text-xs font-black text-slate-300
              uppercase tracking-widest ml-2 not-italic"
            >
              Pending
            </span>
          </p>

          <div className="hidden sm:block h-8 w-[1px] bg-slate-100" />

          <div className="flex flex-col">
            <span
              className="text-[9px] sm:text-[10px] font-black text-slate-400
              uppercase tracking-widest"
            >
              Active Today
            </span>

            <span className="text-base sm:text-lg font-black text-orange-500 italic">
              {onLeaveToday}
            </span>
          </div>
        </div>
      </div>

      {/* ---------- Bottom Action ---------- */}
      <div className="mt-6 sm:mt-8 flex items-center justify-between relative z-10">
        <span
          className="text-[9px] sm:text-[10px] font-black text-slate-400
          uppercase tracking-widest
          group-hover:text-orange-600 transition-colors"
        >
          Process Outpasses
        </span>

        <div
          className="p-2.5 sm:p-3 bg-slate-900 text-white
          rounded-lg sm:rounded-xl
          group-hover:bg-[#ff6b00] group-hover:scale-110
          transition-all shadow-lg"
        >
          <PlaneTakeoff size={18} />
        </div>
      </div>
    </button>
  );
};

export default LeaveApprovalCard;
