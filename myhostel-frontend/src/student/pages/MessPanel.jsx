import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Coffee, CloudSun, Utensils, Moon, Calendar, Clock, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MessPanel = () => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch data - ise separate kiya taaki manually bhi refresh ho sake
  const fetchTodayMenu = async () => {
    setLoading(true);
    try {
      const res = await API.get('/mess/today-menu');
      // Response matching: res.data direct database object hai jo aapne share kiya
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
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <RefreshCw className="size-10 text-orange-500 animate-spin mb-4" />
      <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Fetching Real-time Menu...</p>
    </div>
  );

  const mealCards = [
    { 
      title: "Breakfast", 
      time: "07:30 - 09:30", 
      icon: <Coffee />, 
      items: menu?.breakfast, // Matches "breakfast" from DB
      img: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=400&q=80"
    },
    { 
      title: "Lunch", 
      time: "12:30 - 14:30", 
      icon: <CloudSun />, 
      items: menu?.lunch, // Matches "lunch" from DB
      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"
    },
    { 
      title: "Snacks", 
      time: "16:30 - 17:30", 
      icon: <Utensils />, 
      items: menu?.snacks, // Matches "snacks" from DB
      img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400&q=80"
    },
    { 
      title: "Dinner", 
      time: "19:30 - 21:30", 
      icon: <Moon />, 
      items: menu?.dinner, // Matches "dinner" from DB
      img: "https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?auto=format&fit=crop&w=400&q=80"
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 bg-[#fbfaf8] min-h-screen">
      {/* Real-time Status Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-green-600 font-black text-[10px] uppercase tracking-widest">Connected to Kitchen</span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
            Today's <span className="text-orange-500">{menu?.day || "Menu"}</span>
          </h2>
          <p className="text-slate-400 font-medium">Last updated: {menu?.updatedAt ? new Date(menu.updatedAt).toLocaleTimeString() : 'Just now'}</p>
        </div>
        
        <button 
          onClick={fetchTodayMenu}
          className="flex items-center gap-2 px-6 py-4 bg-white shadow-sm border border-slate-100 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
        >
          <RefreshCw size={18} className="text-orange-500" />
          <span>Refresh Data</span>
        </button>
      </header>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {mealCards.map((meal, idx) => (
          <div key={idx} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-50 flex flex-col group">
            <div className="relative h-40 overflow-hidden">
              <img src={meal.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={meal.title} />
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-white text-[10px] font-black uppercase">
                {meal.time}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-orange-500">{meal.icon}</span>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">{meal.title}</h3>
              </div>
              
              {/* This is the real-time data from Warden */}
              <div className="bg-slate-50 p-4 rounded-2xl flex-1 border border-slate-100">
                <p className="text-sm text-slate-600 font-bold leading-relaxed italic">
                  {meal.items || "Pending Warden Update..."}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessPanel;