import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Info } from 'lucide-react';

const AttendanceSummary = ({ attendanceData }) => {
  // Backend data structure matching getMyAttendance
  const { totalDays, presentDays, percentage, status } = attendanceData || {
    totalDays: 0,
    presentDays: 0,
    percentage: 0,
    status: "N/A"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-1">
            Tracking Analytics
          </h3>
          <h2 className="text-2xl font-black text-slate-800 italic">Attendance</h2>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
          status === 'Good' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {status} Status
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* 1. Circular Progress Visual */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-slate-100"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={364.4} // 2 * pi * r
              initial={{ strokeDashoffset: 364.4 }}
              animate={{ strokeDashoffset: 364.4 - (364.4 * percentage) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={percentage >= 75 ? "text-emerald-500" : "text-rose-500"}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-black text-slate-800">{percentage}%</span>
            <span className="text-[8px] font-black uppercase text-slate-400">Present</span>
          </div>
        </div>

        {/* 2. Detailed Stats List */}
        <div className="flex-1 w-full space-y-3">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
              <CheckCircle2 size={16} className="text-emerald-500" /> Total Present
            </div>
            <span className="font-black text-slate-800">{presentDays} Days</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
              <Clock size={16} className="text-indigo-500" /> Total Sessions
            </div>
            <span className="font-black text-slate-800">{totalDays}</span>
          </div>

          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-100">
            <Info size={14} className="text-amber-600" />
            <p className="text-[9px] font-bold text-amber-700 leading-tight">
              Maintain at least 75% attendance to avoid disciplinary action.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AttendanceSummary;