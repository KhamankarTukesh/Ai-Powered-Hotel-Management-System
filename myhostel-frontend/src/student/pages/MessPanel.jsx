import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Coffee, CloudSun, Utensils, Moon, RefreshCw, Sparkles, Clock, Send, Star, AlertCircle, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MessPanel = () => {
  const [menu, setMenu] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [feedback, setFeedback] = useState({ rating: 5, comment: "" });
  const [specialReq, setSpecialReq] = useState("");
const fetchData = async () => {
  setLoading(true);
  try {
    const menuRes = await API.get('/mess/today-menu');
    setMenu(menuRes.data);

    // Ye format bilkul sahi hai: "YYYY-MM-DD"
    const today = new Date().toLocaleDateString('en-CA');
    const activityRes = await API.get(`/mess/my-activity?date=${today}`);

    // Agar data empty object hai ya null, toh safety ke liye structure maintain karein
    if (activityRes.data && activityRes.data.meals) {
        setActivity(activityRes.data);
    } else {
        setActivity({ meals: {} }); 
    }
  } catch (err) {
    console.error("Data fetch error:", err);
    toast.error("Failed to sync your meal status");
  } finally {
    setLoading(false);
  }
};
  // 1. Real-World Timing Logic
  const getCurrentMeal = () => {
    if (!menu) return null;

    const now = new Date();
    // Current time in HH:mm format (24-hour)
    const currentTime = now.getHours().toString().padStart(2, '0') + ":" +
      now.getMinutes().toString().padStart(2, '0');

    const meals = [
      { key: 'breakfast', timeRange: menu.breakfastTime },
      { key: 'lunch', timeRange: menu.lunchTime },
      { key: 'snacks', timeRange: menu.snacksTime },
      { key: 'dinner', timeRange: menu.dinnerTime }
    ];

    for (const meal of meals) {
      if (meal.timeRange && meal.timeRange.includes('-')) {
        // "08:00 - 10:00" ko split karke start aur end nikalna
        const [start, end] = meal.timeRange.split('-').map(t => t.trim());

        if (currentTime >= start && currentTime <= end) {
          return meal.key;
        }
      }
    }
    return null;
  };

  const activeMeal = getCurrentMeal();

  // 2. Kitchen Traffic (Mock data)
  const traffic = { label: "No Queue", color: "text-green-500", icon: "🟢" };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkMeal = async (mealType) => {
    // 1. Double check before sending
    if (activity?.meals?.[mealType]?.checked) return;

    try {
      const res = await API.post('/mess/mark-meal', { mealType });

      // 2. Update local state immediately
      setActivity(prev => ({
        ...prev,
        meals: {
          ...prev?.meals,
          [mealType]: { checked: true, time: new Date() }
        }
      }));

      toast.success(`${mealType} marked successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark meal");
      fetchData(); // Reset data if error occurs
    }
  };
  const handleFeedback = async (e) => {
    e.preventDefault();
    if (!feedback.comment) return toast.error("Please add a comment");
    setSubmitting(true);
    try {
      const res = await API.post('/mess/feedback', feedback);
      setActivity(res.data.activity);
      toast.success(`Sentiment: ${res.data.sentiment}`);
      setFeedback({ rating: 5, comment: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error submitting feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSpecialRequest = async () => {
    if (!specialReq) return;
    try {
      const res = await API.post('/mess/special-request', { item: specialReq });
      setActivity(res.data.activity);
      toast.success("Request sent to Chef!");
      setSpecialReq("");
    } catch (err) {
      toast.error("Failed to send request");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fffaf5]">
      <RefreshCw className="size-12 text-orange-500 animate-spin" />
      <p className="font-black text-[10px] mt-6 italic uppercase tracking-widest">Syncing Kitchen...</p>
    </div>
  );

  const mealCards = [
    { key: "breakfast", title: "Breakfast", icon: <Coffee size={24} />, items: menu?.breakfast, theme: "bg-blue-50 text-blue-600" },
    { key: "lunch", title: "Lunch", icon: <CloudSun size={24} />, items: menu?.lunch, theme: "bg-orange-50 text-orange-600" },
    { key: "snacks", title: "Snacks", icon: <Utensils size={24} />, items: menu?.snacks, theme: "bg-purple-50 text-purple-600" },
    { key: "dinner", title: "Dinner", icon: <Moon size={24} />, items: menu?.dinner, theme: "bg-slate-900 text-white" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-12 bg-[#fffaf5] min-h-screen font-sans">

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic">
            Today's <span className="text-orange-500">{menu?.day || "Menu"}</span>
          </h1>
          <div className="flex items-center gap-4 text-slate-400 font-bold">
            <div className="flex items-center gap-1"><Clock size={16} /> <span className="text-green-500">Kitchen Active</span></div>
            <div className={`flex items-center gap-1 ${traffic.color}`}>{traffic.icon} {traffic.label}</div>
          </div>
        </div>
        <button onClick={fetchData} className="px-8 py-4 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center gap-2">
          <RefreshCw size={18} /> Refresh
        </button>
      </header>

      {/* SINGLE Meals Grid - Corrected Logic */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {mealCards.map((meal) => {
          const isMarked = activity?.meals?.[meal.key]?.checked;
          const hasFood = meal.items && meal.items.trim().length > 0;
          const isServingNow = meal.key === activeMeal;

          return (
            <div key={meal.key} className={`relative bg-white rounded-[2.5rem] p-8 border-2 transition-all duration-500 flex flex-col
              ${isServingNow ? 'border-orange-500 shadow-2xl scale-105 z-10' : 'border-transparent opacity-50 grayscale'}`}>

              {isServingNow && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-black animate-bounce">
                  SERVING NOW
                </div>
              )}

              <div className={`${meal.theme} size-14 flex items-center justify-center rounded-2xl mb-6 shadow-sm`}>
                {meal.icon}
              </div>

              <h3 className="text-2xl font-black text-slate-900 italic mb-4">{meal.title}</h3>

              <div className="flex-1 text-sm text-slate-600 mb-6">
                {hasFood ? (
                  meal.items.split(',').map((it, i) => <span key={i} className="block">• {it.trim()}</span>)
                ) : (
                  <span className="text-red-400 italic flex items-center gap-1 font-bold">
                    <AlertCircle size={14} /> Menu not updated
                  </span>
                )}
              </div>
              <button
                onClick={() => handleMarkMeal(meal.key)}
                // Strict disabling logic
                disabled={isMarked || !hasFood || !isServingNow || submitting}
                className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all 
      ${isMarked
                    ? 'bg-green-100 text-green-600 cursor-not-allowed opacity-100'
                    : (!hasFood || !isServingNow)
                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      : 'bg-slate-900 text-white hover:bg-orange-500 shadow-lg active:scale-95'
                  }`}
              >
                {isMarked ? "✓ Already Eaten" : !isServingNow ? "Locked" : "Mark as Eaten"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Interactive Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Feedback */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-orange-100">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-orange-500" />
            <h2 className="text-2xl font-black text-slate-900 italic">AI Feedback</h2>
          </div>
          <form onSubmit={handleFeedback} className="space-y-6">
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <button key={num} type="button" onClick={() => setFeedback({ ...feedback, rating: num })} className={`size-10 rounded-xl transition-all ${feedback.rating >= num ? 'bg-orange-500 text-white' : 'bg-slate-50 text-slate-300'}`}>
                  <Star size={18} fill={feedback.rating >= num ? "currentColor" : "none"} className="mx-auto" />
                </button>
              ))}
            </div>
            <textarea
              value={feedback.comment}
              onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
              placeholder="How was the food today?"
              className="w-full h-32 bg-slate-50 rounded-3xl p-6 text-slate-900 font-bold focus:ring-2 focus:ring-orange-500 outline-none"
            />
            <button disabled={submitting} className="w-full py-5 bg-orange-500 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all">
              {submitting ? <RefreshCw className="animate-spin mx-auto" /> : "Submit Review"}
            </button>
          </form>
        </div>

        {/* Special Request */}
        <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6 text-orange-400">
              <AlertCircle />
              <h2 className="text-2xl font-black italic">Special Request</h2>
            </div>
            <p className="text-slate-400 mb-8">Unwell? Request a Sick Diet (Khichdi) here.</p>
            <input
              type="text"
              value={specialReq}
              onChange={(e) => setSpecialReq(e.target.value)}
              placeholder="e.g. Sick Diet (Khichdi)"
              className="w-full bg-slate-800 rounded-2xl p-5 mb-6 focus:ring-2 focus:ring-orange-500 outline-none font-bold"
            />
            <button onClick={handleSpecialRequest} className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">
              Send to Kitchen
            </button>

            {activity?.specialRequest?.item && (
              <div className="mt-8 p-4 bg-slate-800 rounded-2xl border border-slate-700">
                <span className="text-[10px] font-black uppercase text-orange-400">Status</span>
                <p className="font-bold">{activity.specialRequest.item} — <span className="text-green-400">{activity.specialRequest.status}</span></p>
              </div>
            )}
          </div>
          <Zap className="absolute -bottom-10 -right-10 size-40 text-slate-800 opacity-20" />
        </div>
      </div>
    </div>
  );
};

export default MessPanel;