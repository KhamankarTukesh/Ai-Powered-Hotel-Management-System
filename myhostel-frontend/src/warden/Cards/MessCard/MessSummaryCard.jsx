import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Utensils, ChevronRight, MessageSquare, Soup, Calendar, Activity, ArrowUpRight, Edit } from 'lucide-react';

const MessSummaryCard = ({ messStats }) => {
  const navigate = useNavigate();

  const {
    mealsServedToday = 0,
    pendingFeedback = 0,
    todayMenu = "Menu Not Set" 
  } = messStats || {};

  // HELPER: To handle object or string menu
  const renderMenuText = () => {
    if (typeof todayMenu === 'string') return todayMenu;
    if (typeof todayMenu === 'object' && todayMenu !== null) {
      // Breakfast aur Lunch dikha rahe hain as a preview
      return `${todayMenu.breakfast || ''} • ${todayMenu.lunch || ''}`;
    }
    return "Menu Not Set";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      className="relative group  bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-800 flex flex-col justify-between overflow-hidden min-h-[350px] h-full transition-all duration-500"
    >
      {/* 1. TOP SECTION */}
      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full w-fit">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Kitchen Live</span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 ml-1">Daily Operations</p>
        </div>

        {/* --- SET MENU POINTER --- */}
        <div className="relative group/hint">
          <motion.div 
            animate={{ x: [-5, 0, -5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -left-24 top-3 hidden group-hover/hint:block bg-orange-500 text-white text-[9px] font-black px-2 py-1 rounded-md"
          >
            SET MENU HERE
          </motion.div>
          <button 
            onClick={() => navigate('/warden/menu')}
            className="p-3 bg-white/5 text-orange-400 rounded-2xl hover:bg-orange-500 hover:text-white transition-all duration-300 border border-white/10 shadow-lg"
          >
            <Calendar size={22} />
          </button>
        </div>
      </div>

      {/* 2. MIDDLE SECTION: Meals Served */}
      <div className="relative z-10 my-6">
        <div className="flex items-baseline gap-2">
          <h2 className="text-6xl font-[1000] text-white italic tracking-tighter leading-none">
            {mealsServedToday}
          </h2>
          <div className="flex flex-col">
            <span className="text-sm font-black text-orange-500 uppercase leading-none">Meals</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Served Today</span>
          </div>
        </div>

        {/* Interactive Menu Box - Points to /warden/menu */}
        <button 
          onClick={() => navigate('/warden/menu')}
          className="w-full mt-4 flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-3xl hover:bg-orange-500/10 hover:border-orange-500/40 transition-all duration-300 group/menu"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-orange-500/20 p-2 rounded-xl shrink-0">
              <Soup size={18} className="text-orange-400" />
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-1">
                <Edit size={8} /> Update Today's Menu
              </p>
              <p className="text-xs font-bold text-slate-200 truncate italic mt-0.5">
                {renderMenuText()}
              </p>
            </div>
          </div>
          <ArrowUpRight size={14} className="text-slate-600 group-hover/menu:text-orange-500 transition-colors shrink-0" />
        </button>
      </div>

      {/* 3. BOTTOM SECTION: Stats & Activity Link */}
      <div className="relative z-10 pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Feedback</span>
            <div className="flex items-center gap-1.5 mt-1">
              <MessageSquare size={14} className="text-orange-400" />
              <span className="text-lg font-black text-white">{pendingFeedback}</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Activity</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Activity size={14} className="text-blue-400" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-tight">Live Track</span>
            </div>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/warden/mess/activity')}
          className="group/btn relative h-14 w-14 bg-orange-500 text-white rounded-[1.25rem] flex items-center justify-center transition-all shadow-lg hover:bg-white hover:text-slate-900"
        >
          <ChevronRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MessSummaryCard;