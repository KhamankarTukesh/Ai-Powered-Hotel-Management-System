import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone, FileText, Bell, ExternalLink, Calendar } from 'lucide-react';

const NoticePreview = ({ notices }) => {
  // notices: backend ke getStudentDashboardSummary se aa raha hai (Top 3)

  const getCategoryStyles = (category, isEmergency) => {
    if (isEmergency) return "bg-rose-50 text-rose-600 border-rose-100";
    switch (category) {
      case 'Fee': return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case 'Holiday': return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case 'Event': return "bg-amber-50 text-amber-600 border-amber-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-1">
            Communication Hub
          </h3>
          <h2 className="text-2xl font-black text-slate-800 italic flex items-center gap-2">
            Notice Board <Bell size={20} className="text-slate-400" />
          </h2>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices && notices.length > 0 ? (
          notices.map((notice, index) => (
            <div 
              key={index}
              className={`p-5 rounded-3xl border transition-all hover:shadow-md ${
                notice.isEmergency ? 'border-rose-200 bg-rose-50/30' : 'border-slate-50 bg-white'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getCategoryStyles(notice.category, notice.isEmergency)}`}>
                  {notice.isEmergency ? '🚨 Emergency' : notice.category}
                </span>
                <div className="flex items-center gap-1 text-slate-400">
                  <Calendar size={12} />
                  <span className="text-[9px] font-bold">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-black text-slate-800 mb-1 leading-tight line-clamp-1">
                {notice.title}
              </h4>
              <p className="text-[11px] font-bold text-slate-500 line-clamp-2 leading-relaxed mb-4">
                {notice.content}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 border border-white">
                    {notice.postedBy?.fullName?.charAt(0)}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    By {notice.postedBy?.fullName.split(' ')[0]}
                  </span>
                </div>

                {notice.attachmentUrl && (
                  <a 
                    href={notice.attachmentUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <FileText size={14} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">View PDF</span>
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
            <Megaphone size={30} className="mx-auto text-slate-200 mb-2" />
            <p className="text-xs font-bold text-slate-400 italic">No new announcements</p>
          </div>
        )}
      </div>

      <button className="w-full mt-6 py-4 border-2 border-slate-50 text-slate-400 hover:text-indigo-600 hover:border-indigo-50 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
        View All Notices
      </button>
    </motion.div>
  );
};

export default NoticePreview;