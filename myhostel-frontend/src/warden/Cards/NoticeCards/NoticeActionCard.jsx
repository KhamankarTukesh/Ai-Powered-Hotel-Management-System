import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  BellRing,
  Calendar,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Clock,
  AlertTriangle,
} from "lucide-react";

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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      className="
        relative group bg-white
        rounded-[2rem] sm:rounded-[2.5rem]
        p-5 sm:p-6 lg:p-8
        shadow-xl hover:shadow-2xl
        border border-orange-100
        flex flex-col justify-between
        overflow-hidden w-full
        min-h-[280px] sm:min-h-[320px] lg:min-h-[360px]
        transition-all duration-500
      "
    >
      {/* Background Decoration */}
      <div className="absolute -left-6 -bottom-6 sm:-left-10 sm:-bottom-10 opacity-[0.04] rotate-12 pointer-events-none">
        <Megaphone size={150} className="sm:size-[180px] lg:size-[220px] text-orange-900" />
      </div>

      {/* HEADER */}
      <div className="relative z-10 flex justify-between items-start">

        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-black text-slate-800 italic uppercase tracking-tight">
              Notice <span className="text-orange-500">Board</span>
            </h3>

            {isPostedToday() && (
              <Sparkles size={14} className="text-orange-400 animate-pulse" />
            )}
          </div>

          <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Broadcast Hub
          </p>
        </div>

        <div
          className={`relative p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border shadow-sm transition-all duration-300
          ${
            latestNotice?.isEmergency
              ? "bg-red-50 text-red-500 border-red-100 group-hover:bg-red-500 group-hover:text-white"
              : "bg-orange-50 text-orange-500 border-orange-100 group-hover:bg-orange-500 group-hover:text-white"
          }`}
        >
          {latestNotice?.isEmergency ? (
            <AlertTriangle size={18} className="animate-pulse" />
          ) : (
            <BellRing size={18} className={isPostedToday() ? "animate-bounce" : ""} />
          )}

          {isPostedToday() && (
            <span
              className={`absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white animate-ping
              ${latestNotice?.isEmergency ? "bg-red-600" : "bg-orange-500"}`}
            />
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex-grow flex flex-col justify-center py-4 sm:py-6">

        <AnimatePresence mode="wait">

          {latestNotice?.title ? (
            <motion.div
              key={latestNotice.title}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="space-y-3"
            >

              {/* Tag */}
              <div
                className={`flex items-center gap-2 text-[9px] sm:text-[10px] font-black w-fit px-3 py-1 rounded-full uppercase tracking-tight
                ${
                  latestNotice.isEmergency
                    ? "bg-red-100 text-red-600"
                    : "bg-orange-50 text-orange-500"
                }`}
              >
                {isPostedToday() ? <Clock size={12} /> : <Calendar size={12} />}

                <span>
                  {isPostedToday()
                    ? "Active Broadcast"
                    : new Date(
                        latestNotice.date || latestNotice.createdAt
                      ).toLocaleDateString()}
                </span>
              </div>

              {/* Title */}
              <h4
                className={`text-lg sm:text-xl lg:text-2xl font-black leading-tight uppercase italic line-clamp-2
                ${
                  latestNotice.isEmergency
                    ? "text-red-600"
                    : "text-slate-800"
                }`}
              >
                {latestNotice.title}
              </h4>

              {/* Content */}
              <p className="
                text-[10px] sm:text-xs font-bold text-slate-500 italic
                line-clamp-3 bg-slate-50
                p-3 sm:p-4
                rounded-xl sm:rounded-2xl
                border border-slate-100
                border-l-4 border-l-orange-400
                shadow-inner
              ">
                "{latestNotice.content || "No description provided."}"
              </p>

            </motion.div>
          ) : (

            /* Empty State */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="
                flex flex-col items-center justify-center
                py-6 sm:py-8
                bg-slate-50
                rounded-2xl sm:rounded-[2rem]
                border-2 border-dashed border-slate-200
              "
            >
              <MessageSquare size={34} className="text-slate-200 mb-3" />

              <div className="text-center">
                <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Silence is Golden
                </p>

                <p className="text-[8px] sm:text-[9px] font-bold text-slate-300 uppercase mt-1">
                  No active announcements
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* FOOTER BUTTON */}
      <button
        onClick={() => navigate("/warden/notices")}
        className="
          relative z-10 w-full
          text-white
          p-4 sm:p-5
          rounded-[1.5rem] sm:rounded-[1.8rem]
          flex items-center justify-between
          bg-slate-900 hover:bg-orange-600
          transition-all duration-300
          shadow-lg
        "
      >
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">
            Notice Center
          </span>

          <span className="text-[8px] font-black text-orange-400 uppercase mt-1">
            Broadcast to Campus
          </span>
        </div>

        <div className="bg-white/10 p-2 rounded-xl group-hover:rotate-45 transition-transform">
          <ChevronRight size={18} />
        </div>
      </button>
    </motion.div>
  );
};

export default NoticeActionCard;
