import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Wallet, Coins, TrendingUp } from 'lucide-react';

const MasterFeeCard = ({ financeStats }) => {
  const navigate = useNavigate();
  const [hoveredIcon, setHoveredIcon] = useState(null);

  // 1. Map Backend Data from your object
  const totalDues = financeStats?.totalDues || 0;
  const collectionRate = financeStats?.collectionRate || "0.0";

  // 2. Only showing the specific Dashboard Action
  const actions = [
    { 
      id: 5, 
      name: "Open Dashboard", 
      icon: <LayoutDashboard size={28} />, 
      path: "/warden/feedashboard", 
      color: "text-orange-600", 
      bg: "bg-orange-100/50" 
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="relative group bg-white rounded-[2.5rem] p-8 shadow-2xl border border-orange-50 flex flex-col justify-between overflow-hidden min-h-[350px] h-full transition-all duration-500"
    >
      {/* --- MOVING COINS ANIMATION (Background) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -120, 0], 
              x: [0, 30, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.4, 0.1] 
            }}
            transition={{ 
              duration: 12 + i * 2, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute text-orange-200"
            style={{ 
              top: `${10 + i * 20}%`, 
              left: `${15 + i * 15}%` 
            }}
          >
            <Coins size={30 + i * 10} />
          </motion.div>
        ))}
      </div>

      {/* --- TOP SECTION: Data Display --- */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-[1000] text-slate-800 italic tracking-tighter uppercase">
              Finance <span className="text-orange-500">Pro</span>
            </h3>
            <div className="bg-orange-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full tracking-widest animate-pulse">
              LIVE DATA
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-5xl font-[1000] text-slate-900 tracking-tighter leading-none">
              ₹{totalDues.toLocaleString('en-IN')}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">
                Total Outstanding
              </span>
              <div className="h-1 w-1 rounded-full bg-slate-300" />
              <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md border border-green-100">
                <TrendingUp size={10} className="text-green-600" />
                <span className="text-[10px] font-bold text-green-700">{collectionRate}% Paid</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-orange-50 text-orange-500 rounded-[1.5rem] border border-orange-100 shadow-inner">
          <Wallet size={24} />
        </div>
      </div>

      {/* --- CENTER SECTION: The Single Functional Icon --- */}
      <div className="relative z-10 flex justify-center py-4">
        {actions.map((item, idx) => (
          <div key={item.id} className="relative flex flex-col items-center">
            <motion.button
              onMouseEnter={() => setHoveredIcon(idx)}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={() => navigate(item.path)}
              whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.9 }}
              className={`relative h-20 w-20 rounded-[2rem] flex items-center justify-center transition-all duration-300 border-2
                ${hoveredIcon === idx 
                  ? "bg-slate-900 text-white border-slate-800 shadow-[0_20px_40px_rgba(0,0,0,0.2)]" 
                  : `${item.bg} ${item.color} border-orange-100 shadow-lg shadow-orange-100`}`}
            >
              {item.icon}
              
              {/* Floating Entry Indicator */}
              <div className="absolute -top-2 -right-2 bg-orange-500 rounded-full p-1.5 border-4 border-white shadow-md">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              </div>
            </motion.button>

            <AnimatePresence>
              {hoveredIcon === idx && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-10 bg-slate-900 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest z-20 shadow-xl"
                >
                  {item.name}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* --- FOOTER: Status --- */}
      <div className="relative z-10 pt-4 border-t border-orange-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
     `      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
             Finance Module Active
           </span>
        </div>
        <p className="text-[10px] font-bold text-slate-300 italic">v2.0 PRO</p>
      </div>`
    </motion.div>
  );
};

export default MasterFeeCard;