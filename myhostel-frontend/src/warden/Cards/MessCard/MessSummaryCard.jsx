import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronRight,
  MessageSquare,
  Soup,
  Calendar,
  Activity,
  ArrowUpRight,
  Edit,
} from "lucide-react";

const MessSummaryCard = ({ messStats }) => {
  const navigate = useNavigate();

  const {
    mealsServedToday = 0,
    pendingFeedback = 0,
    todayMenu = "Menu Not Set",
  } = messStats || {};

  /* Helper → Handles string or object menu */
  const renderMenuText = () => {
    if (typeof todayMenu === "string") return todayMenu;

    if (typeof todayMenu === "object" && todayMenu !== null) {
      return `${todayMenu.breakfast || ""} • ${todayMenu.lunch || ""}`;
    }

    return "Menu Not Set";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      className="
        relative group bg-slate-900
        rounded-[2rem] sm:rounded-[2.5rem]
        p-5 sm:p-6 lg:p-8
        shadow-xl hover:shadow-2xl
        border border-slate-800
        flex flex-col justify-between
        overflow-hidden
        w-full
        min-h-[280px] sm:min-h-[320px] lg:min-h-[360px]
        transition-all duration-500
      "
    >
      {/* ---------- TOP SECTION ---------- */}
      <div className="flex justify-between items-start relative z-10">

        {/* Live Kitchen Badge */}
        <div>
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full w-fit">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[9px] sm:text-[10px] font-black text-green-500 uppercase tracking-widest">
              Kitchen Live
            </span>
          </div>

          <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 ml-1">
            Daily Operations
          </p>
        </div>

        {/* Menu Navigate Button */}
        <button
          onClick={() => navigate("/warden/menu")}
          className="
            p-2.5 sm:p-3
            bg-white/5 text-orange-400
            rounded-xl sm:rounded-2xl
            hover:bg-orange-500 hover:text-white
            transition-all duration-300
            border border-white/10 shadow-md
          "
        >
          <Calendar size={20} />
        </button>
      </div>

      {/* ---------- MEALS SERVED ---------- */}
      <div className="relative z-10 my-4 sm:my-6">

        <div className="flex items-end gap-2">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white italic tracking-tight leading-none">
            {mealsServedToday}
          </h2>

          <div className="flex flex-col pb-1">
            <span className="text-xs sm:text-sm font-black text-orange-500 uppercase">
              Meals
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-tight">
              Served Today
            </span>
          </div>
        </div>

        {/* ---------- MENU BOX ---------- */}
        <button
          onClick={() => navigate("/warden/menu")}
          className="
            w-full mt-4
            flex items-center justify-between
            bg-white/5 border border-white/10
            p-3 sm:p-4
            rounded-2xl sm:rounded-3xl
            hover:bg-orange-500/10
            hover:border-orange-500/40
            transition-all duration-300
            group/menu
          "
        >
          <div className="flex items-center gap-3 overflow-hidden">

            <div className="bg-orange-500/20 p-2 rounded-xl shrink-0">
              <Soup size={16} className="text-orange-400" />
            </div>

            <div className="text-left overflow-hidden">
              <p className="text-[8px] sm:text-[9px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-1">
                <Edit size={8} /> Update Today's Menu
              </p>

              <p className="text-[11px] sm:text-xs font-bold text-slate-200 truncate italic mt-0.5">
                {renderMenuText()}
              </p>
            </div>
          </div>

          <ArrowUpRight
            size={14}
            className="text-slate-600 group-hover/menu:text-orange-500 transition-colors shrink-0"
          />
        </button>
      </div>

      {/* ---------- FOOTER ---------- */}
      <div className="relative z-10 pt-4 sm:pt-6 border-t border-white/5 flex items-center justify-between">

        {/* Stats */}
        <div className="flex gap-5 sm:gap-6">

          {/* Feedback */}
          <div className="flex flex-col">
            <span className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest">
              Feedback
            </span>

            <div className="flex items-center gap-1.5 mt-1">
              <MessageSquare size={14} className="text-orange-400" />
              <span className="text-base sm:text-lg font-black text-white">
                {pendingFeedback}
              </span>
            </div>
          </div>

          {/* Activity */}
          <div className="flex flex-col">
            <span className="text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest">
              Activity
            </span>

            <div className="flex items-center gap-1.5 mt-1">
              <Activity size={14} className="text-blue-400" />
              <span className="text-[9px] sm:text-[10px] font-black text-slate-300 uppercase">
                Live Track
              </span>
            </div>
          </div>
        </div>

        {/* Navigate Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/warden/mess/activity")}
          className="
            group/btn
            h-12 w-12 sm:h-14 sm:w-14
            bg-orange-500 text-white
            rounded-xl sm:rounded-[1.25rem]
            flex items-center justify-center
            shadow-lg
            hover:bg-white hover:text-slate-900
            transition-all
          "
        >
          <ChevronRight
            size={22}
            className="group-hover/btn:translate-x-1 transition-transform"
          />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MessSummaryCard;
