import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Megaphone, 
  Calendar, 
  FileText, 
  AlertOctagon, 
  PartyPopper, 
  CalendarDays,
  ExternalLink 
} from 'lucide-react';

const Notices = ({ notices }) => {
  
  // Backend Categories Map
  const categoryStyles = {
    Emergency: {
      icon: <AlertOctagon size={20} />,
      color: "bg-rose-500 text-white",
      border: "border-rose-200",
      bg: "bg-rose-50/50"
    },
    Event: {
      icon: <PartyPopper size={20} />,
      color: "bg-indigo-500 text-white",
      border: "border-indigo-100",
      bg: "bg-white"
    },
    Holiday: {
      icon: <CalendarDays size={20} />,
      color: "bg-emerald-500 text-white",
      border: "border-emerald-100",
      bg: "bg-white"
    },
    Fee: {
      icon: <FileText size={20} />,
      color: "bg-amber-500 text-white",
      border: "border-amber-100",
      bg: "bg-white"
    },
    General: {
      icon: <Megaphone size={20} />,
      color: "bg-slate-700 text-white",
      border: "border-slate-100",
      bg: "bg-white"
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-4xl font-black text-slate-800 italic flex items-center gap-3">
            Notices <span className="text-indigo-600">Board</span>
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Official University Updates</p>
        </div>
        <div className="flex -space-x-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-50 bg-slate-200" />
          ))}
          <div className="w-10 h-10 rounded-full border-4 border-slate-50 bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
            +
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence>
          {notices && notices.length > 0 ? (
            notices.map((notice, i) => {
              const style = categoryStyles[notice.category] || categoryStyles.General;
              const isEmergency = notice.isEmergency || notice.category === 'Emergency';

              return (
                <motion.div
                  key={notice._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative p-8 rounded-[2.5rem] border ${style.border} ${style.bg} transition-all hover:shadow-xl hover:shadow-slate-200/50 group`}
                >
                  {/* Emergency Pulse Glow */}
                  {isEmergency && (
                    <span className="absolute -top-2 -right-2 flex h-6 w-6">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-6 w-6 bg-rose-500 border-4 border-white"></span>
                    </span>
                  )}

                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Icon & Meta */}
                    <div className="flex flex-row md:flex-col items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${style.color}`}>
                        {style.icon}
                      </div>
                      <div className="text-center md:block">
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                           {new Date(notice.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                         </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${isEmergency ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                          {notice.category}
                        </span>
                        <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Calendar size={12} /> Posted by {notice.postedBy?.fullName || "Admin"}
                        </p>
                      </div>

                      <h3 className={`text-xl font-black italic ${isEmergency ? 'text-rose-600' : 'text-slate-800'}`}>
                        {notice.title}
                      </h3>

                      <p className="text-sm font-bold text-slate-500 leading-relaxed">
                        {notice.content}
                      </p>

                      {/* Attachment Button */}
                      {notice.attachmentUrl && (
                        <div className="pt-4">
                          <a 
                            href={notice.attachmentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                          >
                            <FileText size={14} /> View Attachment <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <Megaphone className="mx-auto text-slate-200 mb-4" size={60} />
              <h3 className="text-xl font-black text-slate-400 italic">No Announcements Yet</h3>
              <p className="text-xs font-bold text-slate-400">Everything is quiet on the board today.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notices;