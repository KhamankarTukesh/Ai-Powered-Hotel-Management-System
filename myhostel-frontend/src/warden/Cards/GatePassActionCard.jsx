import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, ShieldCheck, ChevronRight, Clock, MapPin, Users, Zap } from 'lucide-react';

const GatepassActionCard = ({ gatepassStats }) => {
  const navigate = useNavigate();
  const pendingCount = gatepassStats?.pendingCount || 0;
  const activeOut = gatepassStats?.activeOutCount || 0;
  
  // Real-time ago calculation (Simple version)
  const formatTime = (dateString) => {
    if (!dateString) return "No requests";
    const date = new Date(dateString);
    const diff = Math.floor((new Date() - date) / 60000); // Minutes
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="relative group bg-white rounded-[2.5rem] p-8 shadow-2xl border border-orange-100 flex flex-col justify-between overflow-hidden min-h-[350px] h-full transition-all duration-500"
    >
      {/* 1. ANIMATED BACKGROUND LOGO */}
      <div className="absolute -right-6 -top-6 text-orange-50/40 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
        <LogOut size={180} strokeWidth={1} />
      </div>

      {/* 2. HEADER SECTION */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-[1000] text-slate-800 italic tracking-tighter uppercase leading-none">
            Gate <span className="text-orange-500">Pass</span>
          </h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Movement Control</p>
        </div>
        <div className={`p-3 rounded-2xl border shadow-sm transition-all duration-300 
          ${pendingCount > 0 ? "bg-orange-500 text-white border-orange-400 shadow-orange-200" : "bg-orange-50 text-orange-400 border-orange-100"}`}>
          <ShieldCheck size={22} className={pendingCount > 0 ? "animate-pulse" : ""} />
        </div>
      </div>

      {/* 3. CENTER STATS (DYNAMIC DATA) */}
      <div className="relative z-10 py-6">
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-[1000] text-slate-900 tracking-tighter">
            {pendingCount}
          </span>
          <span className="text-sm font-black text-orange-500 uppercase tracking-widest italic">
            Pending
          </span>
        </div>
        
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase bg-slate-50 w-fit px-3 py-1.5 rounded-full border border-slate-100">
            <Clock size={12} className="text-orange-500" />
            <span>Last Request: <span className="text-slate-900">{formatTime(gatepassStats?.lastRequestTime)}</span></span>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase bg-orange-50/50 w-fit px-3 py-1.5 rounded-full border border-orange-100">
            <Zap size={12} className="text-orange-500 fill-orange-500" />
            <span>Active Out: <span className="text-orange-600">{activeOut} Students</span></span>
          </div>
        </div>
      </div>

      {/* 4. FOOTER ACTION */}
      <div className="relative z-10">
        <button
          onClick={() => navigate('/warden/gate-pass')}
          className="w-full text-white p-5 rounded-[1.8rem] flex items-center justify-between group/btn hover:bg-slate-900 bg-orange-600 transition-all duration-300 shadow-xl shadow-orange-100"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl group-hover:bg-orange-500 transition-colors">
              <Users size={18} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest">Process Requests</span>
          </div>
          <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default GatepassActionCard;