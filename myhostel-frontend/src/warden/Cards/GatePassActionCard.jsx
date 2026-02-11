import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, ShieldCheck, ChevronRight, Clock, Zap, Users } from 'lucide-react';

const GatepassActionCard = ({ gatepassStats }) => {
  const navigate = useNavigate();
  const pendingCount = gatepassStats?.pendingCount || 0;
  const activeOut = gatepassStats?.activeOutCount || 0;

  const formatTime = (dateString) => {
    if (!dateString) return "No requests";
    const date = new Date(dateString);
    const diff = Math.floor((new Date() - date) / 60000);

    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      className="
        relative group bg-white 
        rounded-[2rem] sm:rounded-[2.5rem]
        p-5 sm:p-6 lg:p-8
        shadow-xl border border-orange-100
        flex flex-col justify-between
        overflow-hidden
        min-h-[260px] sm:min-h-[300px] lg:min-h-[350px]
        transition-all duration-500
      "
    >
      {/* Background Icon */}
      <div className="absolute -right-4 -top-4 sm:-right-6 sm:-top-6 text-orange-50/40 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
        <LogOut size={120} className="sm:size-[160px] lg:size-[180px]" strokeWidth={1} />
      </div>

      {/* HEADER */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-800 italic tracking-tight uppercase">
            Gate <span className="text-orange-500">Pass</span>
          </h3>

          <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Movement Control
          </p>
        </div>

        <div
          className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border shadow-sm transition-all duration-300
          ${
            pendingCount > 0
              ? "bg-orange-500 text-white border-orange-400 shadow-orange-200"
              : "bg-orange-50 text-orange-400 border-orange-100"
          }`}
        >
          <ShieldCheck
            size={18}
            className={`sm:size-[22px] ${pendingCount > 0 ? "animate-pulse" : ""}`}
          />
        </div>
      </div>

      {/* CENTER STATS */}
      <div className="relative z-10 py-4 sm:py-6">
        <div className="flex items-end gap-2 flex-wrap">
          <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight">
            {pendingCount}
          </span>

          <span className="text-[10px] sm:text-xs font-black text-orange-500 uppercase tracking-widest italic">
            Pending
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3 mt-3 sm:mt-4">

          {/* Last Request */}
          <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase bg-slate-50 w-fit px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-100">
            <Clock size={11} className="text-orange-500" />
            <span>
              Last Request :
              <span className="text-slate-900 ml-1">
                {formatTime(gatepassStats?.lastRequestTime)}
              </span>
            </span>
          </div>

          {/* Active Out */}
          <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase bg-orange-50/50 w-fit px-2.5 sm:px-3 py-1.5 rounded-full border border-orange-100">
            <Zap size={11} className="text-orange-500 fill-orange-500" />
            <span>
              Active Out :
              <span className="text-orange-600 ml-1">
                {activeOut} Students
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER BUTTON */}
      <div className="relative z-10">
        <button
          onClick={() => navigate('/warden/gate-pass')}
          className="
            w-full text-white 
            p-3 sm:p-4 lg:p-5
            rounded-[1.5rem] sm:rounded-[1.8rem]
            flex items-center justify-between
            hover:bg-slate-900 bg-orange-600
            transition-all duration-300
            shadow-lg shadow-orange-100
          "
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-white/20 p-2 rounded-lg sm:rounded-xl">
              <Users size={16} className="sm:size-[18px]" />
            </div>

            <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-widest">
              Process Requests
            </span>
          </div>

          <ChevronRight
            size={18}
            className="sm:size-[20px] group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </motion.div>
  );
};

export default GatepassActionCard;
