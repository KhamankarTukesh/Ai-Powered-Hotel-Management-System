import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const AttendanceStats = ({ stats }) => {
  // stats structure from getMyAttendance controller
  const { totalDays, presentDays, percentage, status } = stats || {
    totalDays: 0,
    presentDays: 0,
    percentage: 0,
    status: "N/A"
  };

  const absentDays = totalDays - presentDays;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 italic">Attendance Analytics</h2>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Academic Year 2025-26</p>
        </div>
        <div className="flex gap-2">
            <div className={`px-6 py-3 rounded-2xl border font-black text-[10px] uppercase tracking-tighter ${
                status === 'Good' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
            }`}>
                {status} Standing
            </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Days", value: totalDays, icon: <CalendarIcon />, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Days Present", value: presentDays, icon: <CheckCircle />, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Days Absent", value: absentDays, icon: <XCircle />, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Percentage", value: `${percentage}%`, icon: <Clock />, color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
          >
            <div className={`${item.bg} ${item.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
              {item.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
            <h3 className="text-2xl font-black text-slate-800">{item.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Progress Chart (Placeholder for now) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-800 italic">Attendance Heatmap</h3>
            <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold outline-none">
                <option>Current Month</option>
                <option>Last Month</option>
            </select>
          </div>
          
          {/* Mock Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }).map((_, i) => (
              <div 
                key={i} 
                className={`aspect-square rounded-xl border flex flex-col items-center justify-center transition-all hover:scale-105 ${
                  i % 5 === 0 ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'
                }`}
              >
                <span className="text-[10px] font-black text-slate-400">{i + 1}</span>
                <div className={`w-1.5 h-1.5 rounded-full mt-1 ${i % 5 === 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex gap-4">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Present
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                <div className="w-3 h-3 bg-rose-500 rounded-sm"></div> Absent
             </div>
          </div>
        </div>

        {/* Action / Warning Sidebar */}
        <div className="space-y-4">
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                <AlertCircle className="text-amber-400 mb-4" size={32} />
                <h4 className="text-lg font-black mb-2 italic">Requirement Notice</h4>
                <p className="text-xs text-slate-400 font-bold leading-relaxed">
                    You need to maintain 75% attendance to be eligible for the next semester's mess rebate.
                </p>
                <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-slate-500 uppercase">Target Present Days</p>
                    <p className="text-xl font-black text-amber-400">22 / 30</p>
                </div>
            </div>
            
            <button className="w-full py-5 bg-indigo-50 text-indigo-600 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-indigo-100 transition-all border border-indigo-100">
                Request Leave
            </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceStats;