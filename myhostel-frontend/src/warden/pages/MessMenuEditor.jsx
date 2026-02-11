import React, { useState } from "react";
import { Utensils, Save, Calendar, Coffee, Sun, Pizza, Moon, Loader2, Clock } from "lucide-react";
import API from "../../api/axios";
import { toast } from "react-hot-toast";

const MessMenuEditor = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    day: "Monday",
    breakfast: "",
    breakfastStart: "07:30",
    breakfastEnd: "09:30",
    lunch: "",
    lunchStart: "12:30",
    lunchEnd: "14:30",
    snacks: "",
    snacksStart: "16:30",
    snacksEnd: "17:30",
    dinner: "",
    dinnerStart: "19:30",
    dinnerEnd: "21:30",
    specialNote: ""
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      breakfastTime: `${formData.breakfastStart} - ${formData.breakfastEnd}`,
      lunchTime: `${formData.lunchStart} - ${formData.lunchEnd}`,
      snacksTime: `${formData.snacksStart} - ${formData.snacksEnd}`,
      dinnerTime: `${formData.dinnerStart} - ${formData.dinnerEnd}`,
    };

    try {
      const { data } = await API.post("/mess/update-menu", payload);
      toast.success(data.message || "Menu Updated! 📋");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] p-4 md:p-12 font-display">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-4 bg-orange-100 rounded-3xl text-orange-600 mb-2">
            <Utensils size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Mess Menu Warden</h1>
          <p className="text-orange-500 font-bold uppercase tracking-[0.2em] text-[10px]">Weekly Nutrition Management</p>
        </div>

        <form onSubmit={handleUpdate} className="bg-white rounded-[3rem] p-6 md:p-12 shadow-xl shadow-orange-900/5 border border-orange-50/50 space-y-8">

          {/* Day Selector */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">
              <Calendar size={14} /> Select Day
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {days.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setFormData({ ...formData, day: d })}
                  className={`py-3 rounded-2xl text-[10px] font-black transition-all ${
                    formData.day === d 
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200" 
                    : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  {d.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Meals Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MealInput 
              icon={<Coffee size={18}/>} 
              label="Breakfast" 
              itemsValue={formData.breakfast}
              startValue={formData.breakfastStart}
              endValue={formData.breakfastEnd}
              onItemsChange={(v) => setFormData({...formData, breakfast: v})}
              onStartChange={(v) => setFormData({...formData, breakfastStart: v})}
              onEndChange={(v) => setFormData({...formData, breakfastEnd: v})}
            />
            <MealInput 
              icon={<Sun size={18}/>} 
              label="Lunch" 
              itemsValue={formData.lunch}
              startValue={formData.lunchStart}
              endValue={formData.lunchEnd}
              onItemsChange={(v) => setFormData({...formData, lunch: v})}
              onStartChange={(v) => setFormData({...formData, lunchStart: v})}
              onEndChange={(v) => setFormData({...formData, lunchEnd: v})}
            />
            <MealInput 
              icon={<Pizza size={18}/>} 
              label="Snacks" 
              itemsValue={formData.snacks}
              startValue={formData.snacksStart}
              endValue={formData.snacksEnd}
              onItemsChange={(v) => setFormData({...formData, snacks: v})}
              onStartChange={(v) => setFormData({...formData, snacksStart: v})}
              onEndChange={(v) => setFormData({...formData, snacksEnd: v})}
            />
            <MealInput 
              icon={<Moon size={18}/>} 
              label="Dinner" 
              itemsValue={formData.dinner}
              startValue={formData.dinnerStart}
              endValue={formData.dinnerEnd}
              onItemsChange={(v) => setFormData({...formData, dinner: v})}
              onStartChange={(v) => setFormData({...formData, dinnerStart: v})}
              onEndChange={(v) => setFormData({...formData, dinnerEnd: v})}
            />
          </div>

          {/* Special Note */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Special Note (Optional)</label>
            <input 
              className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 ring-orange-200"
              placeholder="Ex: Diwali Special Sweet: Jalebi"
              value={formData.specialNote}
              onChange={(e) => setFormData({...formData, specialNote: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white py-6 rounded-[2rem] font-black uppercase tracking-widest bg-orange-500 hover:scale-105 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {loading ? "Updating..." : "Push Menu to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

// Reusable Input Component with Clock Inputs
const MealInput = ({ icon, label, itemsValue, startValue, endValue, onItemsChange, onStartChange, onEndChange }) => (
  <div className="space-y-3">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-2">
      <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
        {icon} {label}
      </label>
      {/* Clock Inputs */}
      <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-xl border border-slate-100">
        <Clock size={12} className="text-orange-500" />
        <input 
          type="time" 
          value={startValue} 
          onChange={(e) => onStartChange(e.target.value)}
          className="bg-transparent text-[10px] font-bold outline-none cursor-pointer" 
        />
        <span className="text-[10px] font-bold text-slate-300">-</span>
        <input 
          type="time" 
          value={endValue} 
          onChange={(e) => onEndChange(e.target.value)}
          className="bg-transparent text-[10px] font-bold outline-none cursor-pointer" 
        />
      </div>
    </div>
    <textarea 
      required
      className="w-full p-5 bg-slate-50 border-none rounded-3xl font-bold text-slate-700 outline-none focus:ring-2 ring-orange-200 resize-none h-24"
      placeholder={`Enter ${label} items...`}
      value={itemsValue}
      onChange={(e) => onItemsChange(e.target.value)}
    />
  </div>
);

export default MessMenuEditor;
