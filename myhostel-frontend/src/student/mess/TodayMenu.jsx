import React from 'react';
import { Coffee, Sun, Moon, UtensilsCrossed } from 'lucide-react';

const TodayMenu = ({ menuData }) => {
  const schedule = [
    { type: 'Breakfast', icon: <Coffee />, items: menuData?.breakfast, time: '08:00 - 09:30' },
    { type: 'Lunch', icon: <Sun />, items: menuData?.lunch, time: '13:00 - 14:30' },
    { type: 'Snacks', icon: <UtensilsCrossed />, items: menuData?.snacks || "Tea & Biscuits", time: '17:00 - 18:00' },
    { type: 'Dinner', icon: <Moon />, items: menuData?.dinner, time: '20:00 - 21:30' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {schedule.map((meal, i) => (
        <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-4">
            {meal.icon}
          </div>
          <h3 className="font-black text-slate-800 italic">{meal.type}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">{meal.time}</p>
          <p className="text-sm font-bold text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
            {meal.items || "Loading..."}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TodayMenu;