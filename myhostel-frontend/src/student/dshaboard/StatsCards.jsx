import React from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarCheck, 
  CreditCard, 
  Home, 
  AlertCircle 
} from 'lucide-react';

const StatsCards = ({ stats }) => {
  // Stats data mapping
  const cards = [
    {
      title: "Attendance",
      value: `${stats?.attendance || 0}%`,
      icon: <CalendarCheck size={24} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      desc: "Overall Presence"
    },
    {
      title: "Pending Fees",
      value: `₹${stats?.dueFees || 0}`,
      icon: <CreditCard size={24} />,
      color: "text-rose-600",
      bg: "bg-rose-50",
      desc: "Current Dues"
    },
    {
      title: "Room No",
      value: stats?.roomNo || 'N/A',
      icon: <Home size={24} />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      desc: "Assigned Room"
    },
    {
      title: "Complaints",
      value: stats?.pendingComplaints || 0,
      icon: <AlertCircle size={24} />,
      color: "text-amber-600",
      bg: "bg-amber-50",
      desc: "Pending Issues"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className={`${card.bg} ${card.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                {card.title}
              </p>
              <h3 className="text-xl font-black text-slate-800 leading-tight">
                {card.value}
              </h3>
              <p className="text-[9px] font-bold text-slate-400 mt-0.5 italic">
                {card.desc}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;