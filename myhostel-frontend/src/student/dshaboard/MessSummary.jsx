import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Coffee, Sun, Moon, Star, AlertCircle } from 'lucide-react';

const MessSummary = ({ menu, activity }) => {
  // menu: backend ke getTodayMenu se aa raha hai
  // activity: backend ke MessActivity (today's record) se aa raha hai

  const meals = [
    { 
      type: "breakfast", 
      label: "Breakfast", 
      icon: <Coffee size={18} />, 
      time: "08:00 AM",
      item: menu?.breakfast || "Not Updated",
      checked: activity?.meals?.breakfast?.checked 
    },
    { 
      type: "lunch", 
      label: "Lunch", 
      icon: <Sun size={18} />, 
      time: "01:30 PM",
      item: menu?.lunch || "Not Updated",
      checked: activity?.meals?.lunch?.checked 
    },
    { 
      type: "dinner", 
      label: "Dinner", 
      icon: <Moon size={18} />, 
      time: "08:30 PM",
      item: menu?.dinner || "Not Updated",
      checked: activity?.meals?.dinner?.checked 
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-full"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-1">
            Dining & Nutrition
          </h3>
          <h2 className="text-2xl font-black text-slate-800 italic">Today's Menu</h2>
        </div>
        <div className="bg-orange-50 p-3 rounded-2xl text-orange-600">
          <Utensils size={20} />
        </div>
      </div>

      {/* Meals List */}
      <div className="space-y-4">
        {meals.map((meal, index) => (
          <div 
            key={index}
            className={`p-4 rounded-3xl border transition-all ${
              meal.checked 
                ? 'bg-emerald-50/50 border-emerald-100 opacity-75' 
                : 'bg-slate-50 border-slate-100 hover:border-orange-200'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${meal.checked ? 'bg-white text-emerald-500' : 'bg-white text-orange-500 shadow-sm'}`}>
                  {meal.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-slate-700">{meal.label}</h4>
                    {meal.checked && (
                      <span className="text-[8px] font-black bg-emerald-500 text-white px-1.5 py-0.5 rounded-md uppercase">
                        Consumed
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 italic">{meal.time}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-3 pl-12">
              <p className="text-xs font-bold text-slate-600 leading-relaxed">
                {meal.item}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Special Note / Request Status */}
      {activity?.specialRequest?.item && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
          <AlertCircle size={18} className="text-indigo-600 mt-0.5" />
          <div>
            <p className="text-[9px] font-black uppercase text-indigo-400">Special Diet Requested</p>
            <p className="text-[11px] font-bold text-indigo-700">
              {activity.specialRequest.item} — 
              <span className="ml-1 italic underline">{activity.specialRequest.status}</span>
            </p>
          </div>
        </div>
      )}

      {/* Feedback Teaser */}
      <div className="mt-6 pt-6 border-t border-slate-50">
        <button className="w-full py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
          <Star size={14} fill="currentColor" />
          Submit Meal Feedback
        </button>
      </div>
    </motion.div>
  );
};

export default MessSummary;