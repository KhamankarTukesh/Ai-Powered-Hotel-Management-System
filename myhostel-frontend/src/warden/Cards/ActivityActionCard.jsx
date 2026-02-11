import React from 'react';
import { Fingerprint, ArrowRight, History, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ActivityActionCard = ({ activityStats, onClick }) => {
  const navigate = useNavigate();
  const todayCount = activityStats?.todayMovements || 0;
  const lastAction = activityStats?.lastMovement;

  const formatTime = (dateString) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.button
      whileHover={{ y: -6 }}
      onClick={onClick}
      className="
        group relative bg-white
        p-5 sm:p-6 lg:p-8
        rounded-[2rem] sm:rounded-[3rem]
        border border-orange-100
        shadow-xl hover:shadow-2xl
        transition-all text-left
        flex flex-col justify-between
        overflow-hidden w-full
        min-h-[260px] sm:min-h-[300px] lg:min-h-[350px]
      "
    >
      {/* Background Icon */}
      <div className="absolute -right-4 -bottom-4 sm:-right-8 sm:-bottom-8 text-orange-50/40 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
        <Fingerprint size={130} className="sm:size-[170px] lg:size-[200px]" strokeWidth={1} />
      </div>

      <div className="relative z-10">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div className="
            h-12 w-12 sm:h-14 sm:w-14
            rounded-xl sm:rounded-2xl
            bg-orange-50 text-orange-600
            flex items-center justify-center
            group-hover:bg-slate-900 group-hover:text-white
            transition-all duration-500 shadow-sm
          ">
            <Fingerprint size={22} className="sm:size-[28px]" />
          </div>

          <div className="bg-green-50 px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1 border border-green-100">
            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[8px] sm:text-[9px] font-black text-green-600 uppercase tracking-tight">
              Live Monitor
            </span>
          </div>
        </div>

        {/* TITLE */}
        <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 italic uppercase tracking-tight leading-none">
          Activity <span className="text-orange-500">Pulse</span>
        </h3>

        {/* LIVE FEED */}
        <div className="
          mt-3 sm:mt-4
          p-2.5 sm:p-3
          bg-slate-50
          rounded-xl sm:rounded-2xl
          border border-slate-100
          min-h-[55px] sm:min-h-[60px]
          flex flex-col justify-center
        ">
          {lastAction ? (
            <>
              <p className="text-[9px] sm:text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-1">
                <Timer size={10} /> Latest Update
              </p>

              <p className="text-[10px] sm:text-[11px] font-bold text-slate-600 truncate mt-0.5 uppercase italic">
                {lastAction.text}
              </p>
            </>
          ) : (
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 italic uppercase">
              No activity recorded today
            </p>
          )}
        </div>

        {/* STATS GRID */}
        <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">

          <div className="bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-orange-100 shadow-sm">
            <p className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest">
              Today's Logs
            </p>
            <p className="text-lg sm:text-xl font-black text-slate-800">
              {todayCount}
            </p>
          </div>

          <div className="bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-orange-100 shadow-sm">
            <p className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest">
              Last Seen
            </p>
            <p className="text-lg sm:text-xl font-black text-slate-800">
              {formatTime(lastAction?.time)}
            </p>
          </div>

        </div>
      </div>

      {/* FOOTER ACTION */}
      <div
        className="relative z-10 mt-4 sm:mt-6 flex items-center justify-between"
        onClick={() => navigate('/warden/student-activity')}
      >
        <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-black text-slate-900 uppercase tracking-widest">
          <History size={13} className="sm:size-[14px] text-orange-500" />
          Full Timeline
        </div>

        <div className="bg-slate-900 text-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl group-hover:bg-orange-500 transition-colors shadow-lg shadow-slate-200">
          <ArrowRight size={18} className="sm:size-[20px]" />
        </div>
      </div>
    </motion.button>
  );
};

export default ActivityActionCard;
