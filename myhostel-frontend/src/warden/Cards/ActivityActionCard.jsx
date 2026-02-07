import React from 'react';
import { Fingerprint, ArrowRight, History, Activity as ActivityIcon, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

const ActivityActionCard = ({ activityStats, onClick }) => {
  const todayCount = activityStats?.todayMovements || 0;
  const lastAction = activityStats?.lastMovement;

  // Time formatting helper
  const formatTime = (dateString) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.button
      whileHover={{ y: -10 }}
      onClick={onClick}
      className="group relative bg-white p-8 rounded-[3rem] border border-orange-100 shadow-xl hover:shadow-2xl transition-all text-left flex flex-col justify-between overflow-hidden min-h-[350px] h-full w-full"
    >
      {/* Background Decor */}
      <div className="absolute -right-8 -bottom-8 text-orange-50/40 group-hover:rotate-12 transition-transform duration-700">
        <Fingerprint size={200} strokeWidth={1} />
      </div>

      <div className="relative z-10">
        {/* Top Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="h-14 w-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-sm">
            <Fingerprint size={28} />
          </div>
          <div className="bg-green-50 px-3 py-1 rounded-full flex items-center gap-1.5 border border-green-100">
             <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
             <span className="text-[9px] font-[1000] text-green-600 uppercase tracking-tighter">Live Monitor</span>
          </div>
        </div>

        {/* Title & Live Feed */}
        <h3 className="text-2xl font-[1000] text-slate-900 italic uppercase tracking-tighter leading-none">
          Activity <span className="text-orange-500">Pulse</span>
        </h3>
        
        {/* DYNAMIC FEED: Hardcoded text ki jagah ye dikhega */}
        <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 min-h-[60px] flex flex-col justify-center">
            {lastAction ? (
                <>
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-1">
                        <Timer size={10} /> Latest Update
                    </p>
                    <p className="text-[11px] font-bold text-slate-600 truncate mt-0.5 uppercase italic">
                        {lastAction.text}
                    </p>
                </>
            ) : (
                <p className="text-[10px] font-bold text-slate-400 italic uppercase">No activity recorded today</p>
            )}
        </div>

        {/* Stats Grid */}
        <div className="mt-6 flex gap-3">
            <div className="flex-1 bg-white p-3 rounded-2xl border border-orange-100 shadow-sm">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Today's Logs</p>
                <p className="text-xl font-black text-slate-800">{todayCount}</p>
            </div>
            <div className="flex-1 bg-white p-3 rounded-2xl border border-orange-100 shadow-sm">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Last Seen</p>
                <p className="text-xl font-black text-slate-800">{formatTime(lastAction?.time)}</p>
            </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="relative z-10 mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest">
          <History size={14} className="text-orange-500" />
          Full Timeline
        </div>
        <div className="bg-slate-900 text-white p-3 rounded-2xl group-hover:bg-orange-500 transition-colors shadow-lg shadow-slate-200">
          <ArrowRight size={20} />
        </div>
      </div>
    </motion.button>
  );
};

export default ActivityActionCard;