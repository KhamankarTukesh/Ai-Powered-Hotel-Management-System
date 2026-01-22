import React from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  LogIn, 
  LogOut, 
  UserCircle, 
  Home, 
  Clock, 
  Calendar,
  ChevronRight
} from 'lucide-react';

const ActivityHistory = ({ activities }) => {

  // Action based icons and colors mapping
  const actionConfig = {
    'Check-in': {
      icon: <LogIn size={16} />,
      color: "bg-emerald-100 text-emerald-600 border-emerald-200",
      dot: "bg-emerald-500"
    },
    'Check-out': {
      icon: <LogOut size={16} />,
      color: "bg-rose-100 text-rose-600 border-rose-200",
      dot: "bg-rose-500"
    },
    'Profile-Update': {
      icon: <UserCircle size={16} />,
      color: "bg-indigo-100 text-indigo-600 border-indigo-200",
      dot: "bg-indigo-500"
    },
    'Room-Allocated': {
      icon: <Home size={16} />,
      color: "bg-amber-100 text-amber-600 border-amber-200",
      dot: "bg-amber-500"
    },
    'Default': {
      icon: <History size={16} />,
      color: "bg-slate-100 text-slate-600 border-slate-200",
      dot: "bg-slate-400"
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Page Title */}
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-800 italic flex items-center gap-3">
          Activity <span className="text-indigo-600">Timeline</span>
        </h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Logs of your hostel journey</p>
      </div>

      <div className="relative">
        {/* The Vertical Line */}
        <div className="absolute left-[2.25rem] md:left-[5.5rem] top-0 bottom-0 w-px bg-slate-100" />

        <div className="space-y-8">
          {activities && activities.length > 0 ? (
            activities.map((log, i) => {
              const config = actionConfig[log.action] || actionConfig.Default;
              const { day, time } = formatDate(log.timestamp);

              return (
                <motion.div 
                  key={log._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-4 md:gap-10 group"
                >
                  {/* Date/Time for Desktop */}
                  <div className="hidden md:block w-20 text-right shrink-0 pt-2">
                    <p className="text-xs font-black text-slate-800">{day}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{time}</p>
                  </div>

                  {/* Icon & Connector */}
                  <div className="relative z-10 shrink-0">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-sm transition-transform group-hover:scale-110 ${config.color}`}>
                      {config.icon}
                    </div>
                  </div>

                  {/* Log Card */}
                  <div className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm group-hover:shadow-md group-hover:border-indigo-50 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${config.color}`}>
                          {log.action}
                        </span>
                        {/* Date/Time for Mobile */}
                        <div className="md:hidden mt-2 flex items-center gap-2 text-slate-400">
                          <Clock size={10} />
                          <p className="text-[10px] font-bold uppercase">{day} • {time}</p>
                        </div>
                      </div>
                      <ChevronRight className="text-slate-100 group-hover:text-indigo-200 transition-colors" size={20} />
                    </div>

                    <p className="text-sm font-bold text-slate-600 leading-relaxed">
                      {log.description}
                    </p>
                    
                    {log.student?.roomNumber && (
                      <div className="mt-4 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center">
                          <Home size={12} className="text-slate-400" />
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase">Room: {log.student.roomNumber}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <History className="mx-auto text-slate-200 mb-4" size={50} />
              <p className="text-sm font-bold text-slate-400 italic">No activity logs found for your account.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityHistory;