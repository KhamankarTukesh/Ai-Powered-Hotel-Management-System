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

  const isSunday = new Date().getDay() === 0;
  const todayDate = new Date().toISOString().split("T")[0];

  const feedbackSubmittedToday =
    activity?.feedback?.date?.startsWith(todayDate);

  const fetchData = async () => {
    setLoading(true);
    try {
      const menuRes = await API.get('/mess/today-menu');
      setMenu(menuRes.data);

      const today = new Date().toLocaleDateString('en-CA');
      const activityRes = await API.get(`/mess/my-activity?date=${today}`);

      if (activityRes.data && activityRes.data.meals) {
        setActivity(activityRes.data);
      } else {
        setActivity({ meals: {} });
      }
    } catch (err) {
      toast.error("Failed to sync your meal status");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentMeal = () => {
    if (!menu) return null;

    const now = new Date();
    const currentTime =
      now.getHours().toString().padStart(2, '0') + ":" +
      now.getMinutes().toString().padStart(2, '0');

    const meals = [
      { key: 'breakfast', timeRange: menu.breakfastTime },
      { key: 'lunch', timeRange: menu.lunchTime },
      { key: 'snacks', timeRange: menu.snacksTime },
      { key: 'dinner', timeRange: menu.dinnerTime }
    ];

    for (const meal of meals) {
      if (meal.timeRange && meal.timeRange.includes('-')) {
        const [start, end] = meal.timeRange.split('-').map(t => t.trim());
        if (currentTime >= start && currentTime <= end) return meal.key;
      }
    }

    return null;
  };

  const activeMeal = getCurrentMeal();

  const traffic = { label: "No Queue", color: "text-green-500", icon: "🟢" };

  useEffect(() => { fetchData(); }, []);

  const handleMarkMeal = async (mealType) => {
    if (activity?.meals?.[mealType]?.checked) return;

    try {
      await API.post('/mess/mark-meal', { mealType });

      setActivity(prev => ({
        ...prev,
        meals: {
          ...prev?.meals,
          [mealType]: { checked: true, time: new Date() }
        }
      }));

      toast.success(`${mealType} marked successfully!`);
    } catch {
      toast.error("Failed to mark meal");
      fetchData();
    }
  };

  const handleFeedback = async (e) => {
    e.preventDefault();

    if (!isSunday) return toast.error("Feedback only on Sundays");
    if (feedbackSubmittedToday) return toast.error("Already submitted");
    if (!feedback.comment) return toast.error("Add comment");

    setSubmitting(true);

    try {
      const res = await API.post('/mess/feedback', feedback);
      setActivity(res.data.activity);
      toast.success(`Sentiment: ${res.data.sentiment}`);
      setFeedback({ rating: 5, comment: "" });
    } catch (err) {
      toast.error("Error submitting feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSpecialRequest = async () => {
    if (!specialReq) return;

    try {
      const res = await API.post('/mess/special-request', { item: specialReq });
      setActivity(res.data.activity);
      toast.success("Request sent!");
      setSpecialReq("");
    } catch {
      toast.error("Failed to send request");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fffaf5]">
      <RefreshCw className="size-10 sm:size-12 text-orange-500 animate-spin" />
      <p className="font-black text-[10px] mt-6 italic uppercase tracking-widest">
        Syncing Kitchen...
      </p>
    </div>
  );

  const mealCards = [
    { key: "breakfast", title: "Breakfast", icon: <Coffee size={24} />, items: menu?.breakfast, theme: "bg-blue-50 text-blue-600" },
    { key: "lunch", title: "Lunch", icon: <CloudSun size={24} />, items: menu?.lunch, theme: "bg-orange-50 text-orange-600" },
    { key: "snacks", title: "Snacks", icon: <Utensils size={24} />, items: menu?.snacks, theme: "bg-purple-50 text-purple-600" },
    { key: "dinner", title: "Dinner", icon: <Moon size={24} />, items: menu?.dinner, theme: "bg-slate-900 text-white" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10 bg-[#fffaf5] min-h-screen">

      {/* Header */}
      <header className="flex flex-col lg:flex-row justify-between gap-6 lg:items-center mb-10">

        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight italic">
            Today's <span className="text-orange-500">{menu?.day || "Menu"}</span>
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-slate-400 font-bold mt-3 text-sm">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span className="text-green-500">Kitchen Active</span>
            </div>

            <div className={`flex items-center gap-1 ${traffic.color}`}>
              {traffic.icon} {traffic.label}
            </div>
          </div>
        </div>

        <button
          onClick={fetchData}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center gap-2"
        >
          <RefreshCw size={16} /> Refresh
        </button>

      </header>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">

        {mealCards.map((meal) => {

          const isMarked = activity?.meals?.[meal.key]?.checked;
          const hasFood = meal.items && meal.items.trim().length > 0;
          const isServingNow = meal.key === activeMeal;

          return (
            <div key={meal.key}
              className={`relative bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-7 border-2 transition-all flex flex-col
              ${isServingNow ? 'border-orange-500 shadow-xl scale-[1.02]' : 'border-transparent opacity-50 grayscale'}`}>

              {isServingNow && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black animate-bounce">
                  SERVING NOW
                </div>
              )}

              <div className={`${meal.theme} size-12 sm:size-14 flex items-center justify-center rounded-2xl mb-5`}>
                {meal.icon}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 italic mb-4">
                {meal.title}
              </h3>

              <div className="flex-1 text-sm text-slate-600 mb-5">
                {hasFood
                  ? meal.items.split(',').map((it, i) =>
                    <span key={i} className="block">• {it.trim()}</span>)
                  : <span className="text-red-400 italic font-bold flex items-center gap-1">
                    <AlertCircle size={14} /> Menu not updated
                  </span>}
              </div>

              <button
                onClick={() => handleMarkMeal(meal.key)}
                disabled={isMarked || !hasFood || !isServingNow || submitting}
                className={`w-full py-3 sm:py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all
                ${isMarked
                    ? 'bg-green-100 text-green-600'
                    : (!hasFood || !isServingNow)
                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                      : 'bg-slate-900 text-white hover:bg-orange-500 shadow-lg'
                  }`}
              >
                {isMarked ? "✓ Already Eaten" : !isServingNow ? "Locked" : "Mark as Eaten"}
              </button>

            </div>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

        {/* Feedback */}
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-xl border border-orange-100">

          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-orange-500" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 italic">
              AI Feedback
            </h2>
          </div>

          <form onSubmit={handleFeedback} className="space-y-5">

            <div className="flex gap-3 sm:gap-4 flex-wrap">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFeedback({ ...feedback, rating: num })}
                  className={`size-9 sm:size-10 rounded-xl transition-all
                  ${feedback.rating >= num
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-50 text-slate-300'}`}
                >
                  <Star size={16} fill={feedback.rating >= num ? "currentColor" : "none"} className="mx-auto" />
                </button>
              ))}
            </div>

            <textarea
              value={feedback.comment}
              onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
              placeholder="How was the food today?"
              className="w-full h-28 sm:h-32 bg-slate-50 rounded-3xl p-4 sm:p-6 font-bold focus:ring-2 focus:ring-orange-500 outline-none"
            />

            <button
              disabled={submitting || !isSunday || feedbackSubmittedToday}
              className="w-full py-4 sm:py-5 rounded-3xl font-black uppercase tracking-widest bg-orange-500 text-white hover:bg-slate-900 transition-all"
            >
              Submit Review
            </button>

          </form>
        </div>

        {/* Special Request */}
        <div className="bg-slate-900 p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[3rem] text-white shadow-xl relative overflow-hidden">

          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl font-black italic mb-4">
              Special Request
            </h2>

            <input
              type="text"
              value={specialReq}
              onChange={(e) => setSpecialReq(e.target.value)}
              placeholder="e.g. Sick Diet"
              className="w-full bg-slate-800 rounded-2xl p-4 sm:p-5 mb-5 font-bold focus:ring-2 focus:ring-orange-500 outline-none"
            />

            <button
              onClick={handleSpecialRequest}
              className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all"
            >
              Send to Kitchen
            </button>
          </div>

          <Zap className="absolute -bottom-10 -right-10 size-32 sm:size-40 text-slate-800 opacity-20" />
        </div>

      </div>
    </div>
  );
};

export default MessPanel;
