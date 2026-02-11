import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const WardenComplaintCard = ({ complaintStats = {} }) => {
  const navigate = useNavigate();

  /* ---------- Safe Data ---------- */
  const {
    total = 0,
    pending = 0,
    resolved = 0,
    urgentCount = 0,
  } = complaintStats;

  /* ---------- Success Rate ---------- */
  const successRate =
    total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <div
      className="relative bg-white rounded-[2rem] sm:rounded-[2.5rem]
      p-5 sm:p-7 lg:p-8 shadow-lg border border-orange-50
      flex flex-col justify-between h-full
      group hover:shadow-2xl transition-all duration-500 overflow-hidden"
    >
      {/* ---------- Glow Background ---------- */}
      <div
        className="absolute -left-12 -bottom-12 w-28 h-28 sm:w-36 sm:h-36
        bg-orange-100/40 rounded-full blur-3xl
        group-hover:bg-orange-200/40 transition-all"
      />

      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-start relative z-10">
        {/* Icon */}
        <div
          className="p-3 sm:p-4 bg-orange-50 rounded-xl sm:rounded-2xl
          text-orange-500 group-hover:bg-orange-500
          group-hover:text-white transition-all duration-300"
        >
          <ClipboardList size={24} className="sm:w-7 sm:h-7" />
        </div>

        {/* Urgent Badge */}
        {urgentCount > 0 && (
          <div
            className="flex items-center gap-1.5 bg-red-50 px-2.5 sm:px-3 py-1
            rounded-full border border-red-100 animate-bounce shadow-sm"
          >
            <AlertCircle size={12} className="text-red-500" />

            <span className="text-[9px] sm:text-[10px] font-black text-red-600 uppercase tracking-tight">
              {urgentCount} Urgent
            </span>
          </div>
        )}
      </div>

      {/* ---------- Main Stats ---------- */}
      <div className="mt-6 sm:mt-8 relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <p
            className="text-orange-500 font-bold uppercase
            tracking-[0.2em] text-[9px] sm:text-[10px]"
          >
            Maintenance Hub
          </p>

          <Sparkles
            size={12}
            className="text-orange-300 animate-pulse"
          />
        </div>

        <h2
          className="text-2xl sm:text-3xl lg:text-4xl font-black
          text-slate-900 leading-tight italic uppercase tracking-tight"
        >
          {pending}
          <span className="text-slate-300"> / {total}</span>
          <br />
          Active Issues
        </h2>
      </div>

      {/* ---------- Micro Stats ---------- */}
      <div
        className="mt-5 sm:mt-6 flex items-center gap-4
        border-t border-slate-50 pt-5 sm:pt-6 relative z-10"
      >
        {/* Resolved */}
        <div className="flex flex-col">
          <span
            className="text-[9px] sm:text-[10px] font-black
            text-slate-400 uppercase tracking-widest"
          >
            Resolved
          </span>

          <span className="text-lg sm:text-xl font-black text-green-500 italic">
            {resolved}
          </span>
        </div>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-slate-100" />

        {/* Success Rate */}
        <div className="flex flex-col">
          <span
            className="text-[9px] sm:text-[10px] font-black
            text-slate-400 uppercase tracking-widest"
          >
            Success Rate
          </span>

          <span className="text-lg sm:text-xl font-black text-slate-900 italic">
            {successRate}%
          </span>
        </div>
      </div>

      {/* ---------- Action Button ---------- */}
      <div className="mt-6 sm:mt-8 relative z-10">
        <button
          onClick={() => navigate("/warden/complaints")}
          className="w-full flex items-center justify-between
          px-4 sm:px-5 py-3 sm:py-4
          text-white rounded-xl sm:rounded-2xl
          bg-[#ff6b00] hover:scale-[1.03]
          transition-all shadow-md hover:shadow-lg
          group/btn"
        >
          <span
            className="text-[9px] sm:text-[10px] font-black
            uppercase tracking-widest"
          >
            Resolve Portal
          </span>

          <div
            className="p-2 bg-white/10 rounded-lg
            group-hover/btn:translate-x-1 transition-transform"
          >
            <ArrowRight size={18} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default WardenComplaintCard;
