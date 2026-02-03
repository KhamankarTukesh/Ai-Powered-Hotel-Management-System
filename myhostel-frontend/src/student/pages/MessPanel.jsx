import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Coffee, CloudSun, Utensils, Moon, RefreshCw, Sparkles, Zap, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MessPanel = () => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTodayMenu = async () => {
    setLoading(true);
    try {
      const res = await API.get('/mess/today-menu');
      setMenu(res.data);
    } catch (err) {
      console.error("Menu fetch error:", err);
      toast.error("Warden hasn't updated the menu yet.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayMenu();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fffaf5]">
      <RefreshCw className="size-12 text-orange-500 animate-spin" />
      <p className="font-black text-slate-900 uppercase tracking-[0.3em] text-[10px] mt-6 italic">Syncing Kitchen Data...</p>
    </div>
  );

  const mealCards = [
    { 
      title: "Breakfast", 
      time: menu?.breakfastTime || "07:30 - 09:30", 
      icon: <Coffee size={24} />, 
      items: menu?.breakfast,
      theme: "bg-blue-50 text-blue-600",
      accent: "border-blue-100"
    },
    { 
      title: "Lunch", 
      time: menu?.lunchTime || "12:30 - 14:30", 
      icon: <CloudSun size={24} />, 
      items: menu?.lunch,
      theme: "bg-orange-50 text-orange-600",
      accent: "border-orange-100"
    },
    { 
      title: "Snacks", 
      time: menu?.snacksTime || "16:30 - 17:30", 
      icon: <Utensils size={24} />, 
      items: menu?.snacks,
      theme: "bg-purple-50 text-purple-600",
      accent: "border-purple-100"
    },
    { 
      title: "Dinner", 
      time: menu?.dinnerTime || "19:30 - 21:30", 
      icon: <Moon size={24} />, 
      items: menu?.dinner,
      theme: "bg-slate-900 text-white",
      accent: "border-slate-700"
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-12 bg-[#fffaf5] min-h-screen font-display">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse"></div>
            <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Live Kitchen Feed</span>
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic">
            Today's <span className="text-orange-500">{menu?.day || "Delights"}</span>
          </h1>
          <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
            <Clock size={16} className="text-orange-400" />
            <span>Updated {menu?.updatedAt ? new Date(menu.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'recently'}</span>
          </div>
        </div>
        
        <button onClick={fetchTodayMenu} className="group flex items-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all shadow-2xl active:scale-95">
          <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
          Refresh Menu
        </button>
      </header>

      {/* Special Note */}
      {menu?.specialNote && (
        <div className="mb-12 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-[2.5rem] blur opacity-25"></div>
          <div className="relative bg-white border-2 border-orange-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 shadow-xl">
            <div className="bg-orange-500 p-5 rounded-3xl text-white shadow-lg shadow-orange-200">
              <Sparkles size={32} className="animate-bounce" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-1">Chef's Special Note</h4>
              <p className="text-2xl font-black text-slate-800 italic tracking-tight">"{menu.specialNote}"</p>
            </div>
          </div>
        </div>
      )}

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {mealCards.map((meal, idx) => (
          <div key={idx} className="bg-white rounded-[3rem] p-8 shadow-sm border border-orange-50 flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
            <div className="flex justify-between items-start mb-8">
              <div className={`${meal.theme} p-5 rounded-[2rem] shadow-lg`}>
                {meal.icon}
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Timing</span>
                <span className="text-[10px] font-black text-slate-900 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                  {meal.time}
                </span>
              </div>
            </div>

            <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic mb-4 group-hover:text-orange-500 transition-colors">
              {meal.title}
            </h3>
            
            <div className={`flex-1 ${meal.accent} border-l-4 pl-4 py-2`}>
              <div className="text-sm text-slate-600 font-bold leading-relaxed">
                {meal.items ? (
                  meal.items.split(',').map((item, i) => (
                    <span key={i} className="block mb-1">• {item.trim()}</span>
                  ))
                ) : (
                  <span className="text-slate-300 italic font-medium tracking-tight">Warden hasn't pushed today's menu...</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessPanel;