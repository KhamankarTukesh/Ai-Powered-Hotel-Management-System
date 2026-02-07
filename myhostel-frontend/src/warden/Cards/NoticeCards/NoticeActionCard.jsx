import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence
import { Megaphone, BellRing, Calendar, ChevronRight, MessageSquare, Sparkles, Clock, AlertTriangle } from 'lucide-react';

const NoticeActionCard = ({ latestNotice }) => {
  const navigate = useNavigate();

  const isPostedToday = () => {
    const rawDate = latestNotice?.date || latestNotice?.createdAt;
    if (!rawDate) return false;
    
    const noticeDate = new Date(rawDate);
    const today = new Date();
    
    return (
      noticeDate.getDate() === today.getDate() &&
      noticeDate.getMonth() === today.getMonth() &&
      noticeDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="relative group bg-white rounded-[2.5rem] p-8 shadow-2xl border border-orange-100 flex flex-col justify-between overflow-hidden min-h-[350px] h-full transition-all duration-500"
    >
      {/* 1. BACKGROUND DECORATION */}
      <div className="absolute -left-10 -bottom-10 opacity-[0.03] rotate-12 pointer-events-none">
        <Megaphone size={200} className="text-orange-950" />
      </div>

      {/* 2. TOP SECTION */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-[1000] text-slate-800 italic tracking-tighter uppercase leading-none">
              Notice <span className="text-orange-500 font-black">Board</span>
            </h3>
            {isPostedToday() && <Sparkles size={14} className="text-orange-400 animate-pulse" />}
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Broadcast Hub</p>
        </div>
        
        <div className={`p-3 rounded-2xl border shadow-sm relative transition-all duration-300 ${
          latestNotice?.isEmergency 
          ? "bg-red-50 text-red-500 border-red-100 group-hover:bg-red-500 group-hover:text-white" 
          : "bg-orange-50 text-orange-500 border-orange-100 group-hover:bg-orange-500 group-hover:text-white"
        }`}>
          {latestNotice?.isEmergency ? (
            <AlertTriangle size={20} className="animate-pulse" />
          ) : (
            <BellRing size={20} className={isPostedToday() ? "animate-bounce" : ""} />
          )}
          {isPostedToday() && (
            <span className={`absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white animate-ping ${
              latestNotice?.isEmergency ? "bg-red-600" : "bg-orange-500"
            }`}></span>
          )}
        </div>
      </div>

      {/* 3. MIDDLE SECTION: DYNAMIC CONTENT */}
      <div className="relative z-10 flex-grow flex flex-col justify-center py-6">
        <AnimatePresence mode="wait">
          {latestNotice && latestNotice.title ? (
            <motion.div 
              key={latestNotice.title} // Re-animates when title changes
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-3"
            >
              <div className={`flex items-center gap-2 text-[10px] font-black w-fit px-3 py-1 rounded-full uppercase tracking-tighter ${
                latestNotice.isEmergency ? "bg-red-100 text-red-600" : "bg-orange-50 text-orange-500"
              }`}>
                {isPostedToday() ? <Clock size={12} /> : <Calendar size={12} />}
                <span>{isPostedToday() ? "Active Broadcast" : new Date(latestNotice.date || latestNotice.createdAt).toLocaleDateString()}</span>
              </div>
              
              <h4 className={`text-2xl font-black leading-tight tracking-tighter line-clamp-2 uppercase italic ${
                latestNotice.isEmergency ? "text-red-600" : "text-slate-800"
              }`}>
                {latestNotice.title}
              </h4>
              
              <p className="text-xs font-bold text-slate-500 italic line-clamp-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 border-l-4 border-l-orange-400 shadow-inner">
                "{latestNotice.content || "No description provided."}"
              </p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200"
            >
              <MessageSquare size={40} className="text-slate-200 mb-3" />
              <div className="text-center">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Silence is Golden</p>
                <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">No active announcements</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. BOTTOM SECTION */}
      <div className="relative z-10">
        <button
          onClick={() => navigate('/warden/notices')}
          className="w-full text-white p-5 rounded-[1.8rem] flex items-center justify-between group/btn bg-slate-900 hover:bg-orange-600 transition-all duration-300 shadow-xl"
        >
          <div className="flex flex-col items-start leading-none">
            <span className="text-[11px] font-[1000] uppercase tracking-widest">Notice Center</span>
            <span className="text-[8px] font-black text-orange-400 uppercase mt-1">Broadcast to Campus</span>
          </div>
          <div className="bg-white/10 p-2 rounded-xl group-hover/btn:rotate-45 transition-transform">
            <ChevronRight size={18} />
          </div>
        </button>
      </div>
    </motion.div>
  );
};

export default NoticeActionCard;