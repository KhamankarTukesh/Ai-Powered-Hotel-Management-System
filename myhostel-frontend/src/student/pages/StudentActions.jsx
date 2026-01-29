import React, { useState } from 'react';
import API from '../../api/axios';
import { 
  CheckCircle, Send, Star, Coffee, 
  UtensilsCrossed, Pizza, AlertCircle, Loader2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const StudentActions = () => {
  const [mealType, setMealType] = useState('breakfast');
  const [specialItem, setSpecialItem] = useState('');
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);

  // 1. Mark Meal Attendance
  const handleMarkMeal = async () => {
    setLoading(true);
    try {
      const res = await API.post('/mess/mark-meal', { mealType });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.error || "Already marked!");
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit Feedback (Rating + Comment)
  const handleFeedback = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/mess/feedback', feedback);
      toast.success("Feedback sent to Warden!");
      setFeedback({ rating: 5, comment: '' });
    } catch (err) {
      toast.error("Failed to send feedback");
    }
  };

  // 3. Special Food Request
  const handleSpecialRequest = async () => {
    if(!specialItem) return toast.error("Mention an item name");
    try {
      const res = await API.post('/mess/special-request', { item: specialItem });
      toast.success(`Request for ${specialItem} sent! 🥣`);
      setSpecialItem('');
    } catch (err) {
      toast.error("Request failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#fdfdfd]">
      
      {/* LEFT COLUMN: Attendance & Special Request */}
      <div className="space-y-8">
        {/* Attendance Card */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
          <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
            <CheckCircle className="text-green-500" /> Mark Presence
          </h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {['breakfast', 'lunch', 'snacks', 'dinner'].map((type) => (
              <button
                key={type}
                onClick={() => setMealType(type)}
                className={`py-4 rounded-2xl font-bold capitalize transition-all border-2 ${
                  mealType === type ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-50 bg-slate-50 text-slate-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <button 
            onClick={handleMarkMeal}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : <UtensilsCrossed size={20} />}
            Confirm My Meal
          </button>
        </div>

        {/* Special Request Card */}
        <div className="bg-orange-500 p-8 rounded-[2.5rem] text-white shadow-lg shadow-orange-200">
          <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
            <Pizza /> Special Food
          </h3>
          <p className="text-orange-100 text-sm mb-6">Feeling sick? Request "Dahi Wada" or "Khichdi".</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. Dahi Wada"
              value={specialItem}
              onChange={(e) => setSpecialItem(e.target.value)}
              className="flex-1 p-4 rounded-xl bg-white/10 border border-white/20 placeholder:text-orange-200 outline-none focus:bg-white/20"
            />
            <button 
              onClick={handleSpecialRequest}
              className="bg-white text-orange-600 px-6 rounded-xl font-bold hover:bg-orange-50 transition-all"
            >
              Request
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Feedback Form */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
        <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
          <Star className="text-yellow-500" /> Share Experience
        </h3>
        <p className="text-slate-400 text-sm mb-8">Your feedback goes directly to the Warden's desk.</p>
        
        <form onSubmit={handleFeedback} className="space-y-6">
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-4">Meal Rating</label>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFeedback({...feedback, rating: num})}
                  className={`size-12 rounded-xl font-black transition-all ${
                    feedback.rating >= num ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-100' : 'bg-slate-50 text-slate-300'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Comment</label>
            <textarea 
              required
              value={feedback.comment}
              onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
              placeholder="The paneer was very salty..."
              className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-2 focus:ring-orange-500/20 min-h-[150px] text-sm font-medium"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all active:scale-95"
          >
            Submit Review <Send size={18} />
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-2xl flex items-start gap-3 border border-blue-100">
          <AlertCircle className="text-blue-500 mt-1" size={18} />
          <p className="text-[11px] text-blue-600 font-medium leading-relaxed">
            AI will analyze your comment to help the warden improve food quality for the next meal.
          </p>
        </div>
      </div>

    </div>
  );
};

export default StudentActions;