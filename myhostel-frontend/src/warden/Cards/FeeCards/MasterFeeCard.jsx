import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Wallet, Coins, TrendingUp } from "lucide-react";

const MasterFeeCard = ({ financeStats }) => {
  const navigate = useNavigate();
  const [hoveredIcon, setHoveredIcon] = useState(null);

  /* ---------------- SAFE DATA MAPPING ---------------- */
  const totalDues = Number(financeStats?.totalDues || 0);
  const collectionRate = financeStats?.collectionRate || "0.0";

  /* ---------------- DASHBOARD ACTION ---------------- */
  const actions = [
    {
      id: 1,
      name: "Open Dashboard",
      icon: <LayoutDashboard size={28} />,
      path: "/warden/feedashboard",
      color: "text-orange-600",
      bg: "bg-orange-100/60",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      className="
        relative group bg-white
        rounded-[2rem] md:rounded-[2.5rem]
        p-5 md:p-8
        shadow-xl hover:shadow-2xl
        border border-orange-50
        flex flex-col justify-between
        overflow-hidden
        min-h-[300px] md:min-h-[350px]
        transition-all duration-500
      "
    >
      {/* ---------------- BACKGROUND COIN ANIMATION ---------------- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, 30, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute text-orange-200"
            style={{
              top: `${15 + i * 18}%`,
              left: `${10 + i * 20}%`,
            }}
          >
            <Coins size={28 + i * 10} />
          </motion.div>
        ))}
      </div>

      {/* ---------------- TOP SECTION ---------------- */}
      <div className="relative z-10 flex justify-between items-start gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg md:text-xl font-black text-slate-800 italic uppercase tracking-tight">
              Finance <span className="text-orange-500">Pro</span>
            </h3>

            <span className="bg-orange-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full tracking-widest animate-pulse">
              LIVE DATA
            </span>
          </div>

          {/* Amount */}
          <div className="mt-5">
            <p className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-none">
              ₹{totalDues.toLocaleString("en-IN")}
            </p>

            <div className="flex items-center flex-wrap gap-2 mt-3">
              <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.2em]">
                Total Outstanding
              </span>

              <div className="h-1 w-1 rounded-full bg-slate-300" />

              <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md border border-green-100">
                <TrendingUp size={10} className="text-green-600" />
                <span className="text-[9px] font-bold text-green-700">
                  {collectionRate}% Paid
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Icon */}
        <div className="p-3 md:p-4 bg-orange-50 text-orange-500 rounded-xl md:rounded-[1.5rem] border border-orange-100 shadow-inner">
          <Wallet size={22} />
        </div>
      </div>

      {/* ---------------- CENTER ACTION BUTTON ---------------- */}
      <div className="relative z-10 flex justify-center py-5">
        {actions.map((item, idx) => (
          <div key={item.id} className="relative flex flex-col items-center">
            <motion.button
              onMouseEnter={() => setHoveredIcon(idx)}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={() => navigate(item.path)}
              whileHover={{ scale: 1.15, rotate: [0, -4, 4, 0] }}
              whileTap={{ scale: 0.9 }}
              className={`relative h-16 w-16 md:h-20 md:w-20 rounded-2xl flex items-center justify-center border-2 transition-all duration-300
              ${
                hoveredIcon === idx
                  ? "bg-slate-900 text-white border-slate-800 shadow-xl"
                  : `${item.bg} ${item.color} border-orange-100 shadow-md`
              }`}
            >
              {item.icon}

              {/* Notification Indicator */}
              <div className="absolute -top-2 -right-2 bg-orange-500 rounded-full p-1 border-4 border-white shadow-md">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              </div>
            </motion.button>

            {/* Tooltip */}
            <AnimatePresence>
              {hoveredIcon === idx && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-9 bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-xl"
                >
                  {item.name}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* ---------------- FOOTER ---------------- */}
      <div className="relative z-10 pt-4 border-t border-orange-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Finance Module Active
          </span>
        </div>

        <p className="text-[10px] font-bold text-slate-300 italic">
          v2.0 PRO
        </p>
      </div>
    </motion.div>
  );
};

export default MasterFeeCard;
